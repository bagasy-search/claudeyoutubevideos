// rk29b · componentes 3D 16-30 (29-oct). Cada uno UNA vez en toda la tanda.
// La madera manda, el teclado se gasta, la pila avisa semanas, los códigos viejos siguen vivos…
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, Rings3, Drawer3, RB, Mat, sm, spr, c01, rnd, useTex3, type V3 } from "./studio3d";
import { AMB, RED, ICE, GRN, useTxt, Lock3, Door3, Phone3, Person3, Hand3, Thread, Screw3 } from "./lock3d";

type P = { t: number; h: H };

// 16 · la balanza: la cerradura cara de un lado, la tira de pino blando del otro; gana la madera, para mal (se raja)
export const H3Pricescale: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const t3 = useTex3(), land = sm(tt, 0.3, 1.2), tilt = -0.32 * spr(tt, 1.6, 5, 0.45), crack = sm(tt, 3.2, 4.0);
  const tag = useTxt(["$349"], 192, 96, "#f6f3ec", "#2a2c31", 60), tag2 = useTxt(["SOFT PINE"], 256, 96, "#f6f3ec", RED, 46);
  const L: V3 = [-0.75 * Math.cos(tilt), 1.3 - 0.75 * Math.sin(tilt), 0], R: V3 = [0.75 * Math.cos(tilt), 1.3 + 0.75 * Math.sin(tilt), 0];
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.15, 2.5], l: [0, 0.95, 0], fov: 40 }, { t: 10, p: [0.35, 1.2, 2.3], l: [0.05, 0.95, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.04, 0.12, 1.3, 20]} /><Mat c="#b08a3a" m={1} r={0.35} /></mesh>
    <group position={[0, 1.3, 0]} rotation={[0, 0, tilt]}><RB p={[0, 0, 0]} s={[1.6, 0.05, 0.06]} rad={0.015} c="#b08a3a" m={1} r={0.3} /></group>
    {[L, R].map((p, i) => <group key={i} position={[p[0], p[1] - (i ? 0 : 0), p[2]]}>
      {[[-0.12, 0], [0.12, 0]].map(([x], j) => <mesh key={j} position={[x * 0.9, -0.22, 0]} rotation={[0, 0, x > 0 ? 0.25 : -0.25]}><cylinderGeometry args={[0.004, 0.004, 0.46, 6]} /><Mat c="#777" /></mesh>)}
      <mesh position={[0, -0.45, 0]}><cylinderGeometry args={[0.32, 0.26, 0.04, 40]} /><Mat c="#b08a3a" m={1} r={0.35} /></mesh>
      {i === 0 && <group position={[0, -0.43 + 0.6 * (1 - land), 0]}><Lock3 p={[0, 0.16, 0]} rot={[-0.2, 0.2, 0]} s={0.4} led={0.4} ledCol={AMB} />
        <mesh position={[0.2, 0.05, 0.12]} rotation={[0, -0.3, 0.2]}><planeGeometry args={[0.16, 0.08]} /><meshStandardMaterial map={tag} /></mesh></group>}
      {i === 1 && <group position={[0, -0.39 + 0.6 * (1 - land), 0]}>
        <RB p={[-0.13, 0.09, 0]} s={[0.3, 0.18, 0.34]} rad={0.006} c="#efd9a8" r={0.8} map={t3.wood} />
        <group position={[0.15 + 0.03 * crack, 0.09, 0]} rotation={[0, 0, -0.25 * crack]}><RB p={[0, 0, 0]} s={[0.28, 0.18, 0.34]} rad={0.006} c="#efd9a8" r={0.8} map={t3.wood} /></group>
        <mesh position={[0, 0.19, 0.18]} rotation={[-0.3, 0, 0]}><planeGeometry args={[0.3, 0.11]} /><meshStandardMaterial map={tag2} /></mesh>
      </group>}
    </group>)}
  </Studio>;
}}</Stage>;

// 17 · la patada: flecha de fuerza contra la puerta; el pestillo queda entero y brillando, lo que se parte es el marco
export const H3Kick: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const hitT = 1.6, arr = sm(tt, 0.4, hitT), d = Math.max(0, tt - hitT), shake = tt > hitT ? 0.03 * Math.sin(d * 30) * Math.exp(-d * 4) : 0;
  const glow = sm(tt, 2.4, 3.0);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [1.4, 1.2, 2.4], l: [0.3, 0.9, 0], fov: 40 }, { t: 2.4, p: [1.25, 1.2, 1.6], l: [0.48, 1.0, 0] }, { t: 10, p: [1.5, 1.2, 1.5], l: [0.5, 1.05, 0], arc: 0.03 }]}>
    <Wall3 p={[1.45, 1.3, -0.08]} s={[1.6, 2.8, 0.16]} kind="drywall" />
    <Wall3 p={[-1.45, 1.3, -0.08]} s={[1.0, 2.8, 0.16]} kind="drywall" />
    <group position={[shake, 0, 0]}>
      <RB p={[0, 1.02, 0]} s={[0.9, 2.02, 0.07]} rad={0.015} c="#3c4d5e" r={0.55} />
      <Lock3 p={[0.33, 1.1, 0.05]} s={0.32} led={1} ledCol={AMB} />
      <RB p={[0.5, 1.1, 0]} s={[0.16, 0.05, 0.035]} rad={0.008} c="#c9ced4" m={1} r={0.2} e={GRN} ei={0.9 * glow} />
    </group>
    {/* el marco: trozos de pino que vuelan al golpe */}
    {[...Array(9)].map((_, i) => { const y = 0.75 + i * 0.08, near = Math.abs(y - 1.1) < 0.25, f = near && tt > hitT ? 1 - Math.exp(-d * 3) : 0;
      return <RB key={i} p={[0.53 + 0.5 * f * (0.4 + rnd(i)), y + 0.3 * f * (rnd(i, 2) - 0.3) - 0.6 * f * f, 0.05 + 0.6 * f * rnd(i, 3)]} rot={[f * 3 * rnd(i, 4), f * 2, f * 4 * rnd(i, 5)]} s={[0.14, 0.09, 0.16]} rad={0.004} c="#e2c48e" r={0.7} />; })}
    <RB p={[0.53, 0.35, 0]} s={[0.1, 0.7, 0.12]} rad={0.004} c="#e2c48e" r={0.7} />
    <RB p={[0.53, 1.75, 0]} s={[0.1, 1.0, 0.12]} rad={0.004} c="#e2c48e" r={0.7} />
    {tt < hitT + 0.5 && <group position={[0.15, 0.6, 1.3 - 1.2 * arr + 0.3 * sm(tt, hitT, hitT + 0.5)]} rotation={[0.2, 0, 0]}>
      <RB p={[0, 0, 0]} s={[0.16, 0.14, 0.34]} rad={0.04} c="#3a2a1e" r={0.8} />
      <RB p={[0, 0.2, 0.1]} s={[0.14, 0.32, 0.14]} rad={0.04} c="#3a2a1e" r={0.8} />
      <RB p={[0, -0.075, 0]} s={[0.17, 0.03, 0.36]} rad={0.01} c="#1a1a1a" r={0.9} />
      <mesh position={[0, 0.6, 0.12]}><capsuleGeometry args={[0.08, 0.5, 4, 12]} /><Mat c="#2c3e5a" r={0.9} /></mesh>
    </group>}
    
  </Studio>;
}}</Stage>;

// 18 · vista explotada del cerradero: la placa se separa del marco y salen los dos tornillos de 3/4"; al lado, la regla dice lo cortos que son
export const H3Strikeexplode: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const ex = sm(tt, 0.6, 2.0), sc = sm(tt, 1.6, 3.0), rule = sm(tt, 3.0, 3.8);
  const ru = useTxt(["0", "", "3/4\"", "", "", "", "3\""], 128, 768, "#f2c230", "#2a2c31", 50);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0.75, 1.15, 0.95], l: [0.25, 1.05, 0], fov: 38 }, { t: 10, p: [0.85, 1.1, 0.8], l: [0.35, 1.05, 0], arc: 0.02 }]}>
    <Wall3 p={[-0.6, 1.3, -0.15]} s={[1.0, 2.8, 0.16]} kind="drywall" />
    <RB p={[0, 1.05, -0.1]} s={[0.14, 2.2, 0.2]} rad={0.01} c="#e2c48e" r={0.6} />
    <RB p={[0.06, 1.05, -0.08]} s={[0.04, 0.12, 0.06]} rad={0.004} c="#3a2a1a" r={0.9} />
    <group position={[0.075 + 0.35 * ex, 1.05, -0.08]}>
      <RB p={[0, 0, 0]} s={[0.016, 0.44, 0.1]} rad={0.004} c="#d4a84a" m={1} r={0.22} />
      <mesh position={[0.007, 0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.05, 0.1]} /><meshBasicMaterial color="#222" /></mesh>
    </group>
    {[0.14, -0.14].map((y, i) => <group key={i} position={[0.09 + 0.35 * ex + 0.3 * sc, 1.05 + y, -0.08]} scale={1.8}><Screw3 rot={[0, 0, Math.PI / 2]} L={0.19} spin={sc * 12} /></group>)}
    {rule > 0.05 && <group position={[0.56, 0.78, 0.02]} scale={[1.8, 1.8, 1.8]}><Screw3 rot={[0, 0, Math.PI / 2]} L={0.76} c={GRN} /></group>}
    <group position={[0.62, 1.05 - 0.3 * (1 - rule), 0.0]} scale={[1.6, 1.6 * rule, 1.6]}>
      <mesh rotation={[0, -0.4, 0]}><planeGeometry args={[0.1, 0.6]} /><meshStandardMaterial map={ru} roughness={0.6} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 19 · el tornillo largo: corte del marco (moldura, hueco, montante); el corto sólo muerde la moldura, el de 3" atraviesa y muerde la casa
export const H3Deepscrew: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const t3 = useTex3(), shortIn = sm(tt, 0.4, 1.4), longIn = sm(tt, 2.2, 4.4);
  return <Studio tt={tt} floor="none" photo={0.25} keys={[{ t: 0, p: [0.1, 0.35, 2.1], l: [0.1, 0, 0], fov: 38 }, { t: 10, p: [0.35, 0.5, 1.9], l: [0.15, 0, 0], arc: 0.03 }]}>
    {/* moldura, hueco y montante, en corte */}
    <RB p={[-0.55, 0, 0]} s={[0.12, 1.2, 0.4]} rad={0.01} c="#f4f1ea" r={0.5} />
    <RB p={[0.55, 0, 0]} s={[0.6, 1.2, 0.4]} rad={0.01} c="#e6c78e" r={0.7} map={t3.wood} />
    <mesh position={[-0.05, 0, -0.2]}><planeGeometry args={[0.85, 1.2]} /><meshBasicMaterial color="#3a2c22" /></mesh>
    <RB p={[-0.66, 0, 0]} s={[0.02, 1.2, 0.4]} rad={0.004} c="#c9ced4" m={1} r={0.3} />
    <group position={[-0.68 + 0.17 * shortIn, 0.28, 0]} scale={1.7}><Screw3 rot={[0, 0, -Math.PI / 2]} L={0.19} spin={shortIn * 14} c={RED} /></group>
    <group position={[-0.68 + 0.84 * longIn, -0.22, 0]} scale={[1, 1.7, 1.7]}><Screw3 rot={[0, 0, -Math.PI / 2]} L={0.76} spin={longIn * 30} c={longIn > 0.98 ? GRN : "#c9ced4"} /></group>
    
  </Studio>;
}}</Stage>;

// 20 · las huellas del teclado: la luz rasante de la tarde barre los botones y aparecen los 4 gastados y brillosos
export const H3Smudge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const sweep = sm(tt, 0.5, 3.5), ang = -1.2 + 2.0 * sweep, show = sm(tt, 1.2, 3.2);
  const lp: V3 = [Math.sin(ang) * 1.6, 1.1 + 0.3 * Math.cos(ang), 0.25];
  const tgt = React.useMemo(() => { const o = new THREE.Object3D(); o.position.set(0, 1.05, 0); return o; }, []);
  return <Studio tt={tt} night={0.85} photo={0.1} keys={[{ t: 0, p: [0, 1.15, 1.25], l: [0, 1.05, 0], fov: 32 }, { t: 10, p: [0.18, 1.1, 1.05], l: [0, 1.05, 0], arc: 0.02 }]}>
    <primitive object={tgt} />
    <spotLight position={lp} target={tgt} angle={0.35} penumbra={0.5} intensity={30} distance={5} color="#ffc98a" />
    <RB p={[0, 1.0, -0.1]} s={[1.6, 2.0, 0.08]} rad={0.015} c="#4a2e26" r={0.55} />
    <Lock3 p={[0, 1.05, 0]} s={1.05} led={0.2} ledCol={AMB} glossy={show > 0.4 ? [1, 4, 6, 9] : []} />
    {show > 0.4 && [1, 4, 6, 9].map((i) => { const r = Math.floor(i / 3), c = i % 3; return <mesh key={i} position={[(-0.09 + c * 0.09) * 1.05, 1.05 + (0.2 - r * 0.09) * 1.05, 0.08]}><circleGeometry args={[0.04, 24]} /><meshBasicMaterial color="#ffe2b0" transparent opacity={0.25 * show * (0.6 + 0.4 * Math.sin(tt * 3 + i))} toneMapped={false} /></mesh>; })}
  </Studio>;
}}</Stage>;

// 21 · los códigos malos: la torta del cumpleaños, el número de la casa, el año y el 1-2-3-4 caen uno por uno al tacho
export const H3Badcodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const num = useTxt(["1427"], 256, 128, "#2a2c31", "#e9d9a8", 96), yr = useTxt(["1958"], 256, 128, "#f6f3ec", "#2a2c31", 96), pin = useTxt(["1 2 3 4"], 256, 128, "#22252b", AMB, 74);
  const fall = (i: number) => { const a = 0.6 + i * 1.1; return { f: sm(tt, a, a + 0.7), on: tt > a }; };
  const item = (i: number, child: React.ReactNode) => { const { f } = fall(i), x0 = -1.3 + i * 0.85; const land = c01((tt - (0.6 + i * 1.1) - 0.7) / 0.3); return <group key={i} position={[x0 + (0 - x0) * f, f < 1 ? 1.15 + 0.5 * Math.sin(Math.PI * f) - 0.85 * f * f : 0.3 + 0.08 * i - 0.02 * land, 0.2 * f]} rotation={[f * 2.4, 0, f * 1.2]} scale={1.7 - 0.5 * f}>{child}</group>; };
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.7, 2.6], l: [0, 0.75, 0], fov: 42 }, { t: 10, p: [0.3, 1.9, 2.2], l: [0, 0.4, 0.1], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    {item(0, <group><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.18, 0.18, 0.16, 40]} /><Mat c="#f4d9e4" r={0.7} /></mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.01, 0.01, 0.1, 8]} /><Mat c="#8fd3ff" /></mesh><mesh position={[0, 0.27, 0]}><sphereGeometry args={[0.018, 10, 10]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh></group>)}
    {item(1, <group><RB s={[0.34, 0.17, 0.03]} rad={0.01} c="#2a2c31" r={0.4} /><mesh position={[0, 0, 0.016]}><planeGeometry args={[0.32, 0.16]} /><meshStandardMaterial map={num} /></mesh></group>)}
    {item(2, <group><RB s={[0.34, 0.17, 0.03]} rad={0.01} c="#f6f3ec" r={0.6} /><mesh position={[0, 0, 0.016]}><planeGeometry args={[0.32, 0.16]} /><meshStandardMaterial map={yr} /></mesh></group>)}
    {item(3, <group><RB s={[0.34, 0.17, 0.03]} rad={0.01} c="#22252b" r={0.4} /><mesh position={[0, 0, 0.016]}><planeGeometry args={[0.32, 0.16]} /><meshBasicMaterial map={pin} toneMapped={false} /></mesh></group>)}
    <group position={[0, 0, 0.2]} scale={1.5}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.3, 0.24, 0.6, 40, 1, true]} /><meshStandardMaterial color="#5a6470" metalness={0.7} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.24, 40]} /><Mat c="#1a1c20" /></mesh>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.015, 8, 48]} /><Mat c="#7a848f" m={0.8} r={0.3} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 22 · el PIN hablado: la orden de voz llega al parlante y choca con una reja de 4 casilleros; sólo se abre cuando entran los 4 números
export const H3Voicepin: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const fill = [2.4, 2.9, 3.4, 3.9], gate = sm(tt, 4.2, 5.0), dg = ["4", "8", "1", "6"].map((d) => useTxt([d], 96, 96, "#22252b", AMB, 72));
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [-0.2, 1.3, 3.2], l: [0, 0.95, 0], fov: 40 }, { t: 10, p: [0.4, 1.25, 2.9], l: [0.15, 0.95, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.8]} s={[6, 3.4, 0.1]} kind="drywall" />
    <Person3 p={[-1.4, 0, 0.2]} yaw={Math.PI / 2 - 0.2} s={0.9} col="#5a6b80" />
    <Rings3 p={[-1.1, 1.38, 0.25]} k={(tt * 0.9) % 1} n={3} r={0.9} col={ICE} rot={[0, Math.PI / 2, 0]} op={tt < 2 ? 1 : 0.3} />
    <RB p={[-0.2, 0.4, 0]} s={[0.6, 0.8, 0.5]} rad={0.02} c="#8a7a64" r={0.7} />
    <group position={[-0.2, 0.8, 0]}>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.1, 0.11, 0.28, 32]} /><Mat c="#2a2c31" r={0.85} /></mesh>
      <mesh position={[0, 0.285, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.085, 0.012, 8, 40]} /><meshBasicMaterial color={tt > 1.2 ? ICE : "#333"} toneMapped={false} /></mesh>
    </group>
    {/* la reja de 4 casilleros delante de la puerta */}
    <RB p={[1.1, 1.0, -0.7]} s={[0.8, 2.0, 0.08]} rad={0.015} c="#5a2a24" r={0.55} />
    <group position={[1.1, 1.15, -0.45]}>
      {[0, 1, 2, 3].map((i) => <group key={i} position={[-0.27 + i * 0.18, 0, 0]}>
        <RB s={[0.15, 0.2, 0.04]} rad={0.01} c="#3a3e46" r={0.5} m={0.6} />
        {tt > fill[i] && <mesh position={[0, 0, 0.025]} scale={c01((tt - fill[i]) / 0.15)}><planeGeometry args={[0.12, 0.12]} /><meshBasicMaterial map={dg[i]} toneMapped={false} /></mesh>}
      </group>)}
      {[...Array(5)].map((_, i) => <mesh key={i} position={[-0.36 + i * 0.18, -0.3 + 0.9 * gate, 0.05]}><cylinderGeometry args={[0.012, 0.012, 1.0, 10]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>)}
    </group>
    {tt > 1.2 && tt < 2.4 && <pointLight position={[0.9, 1.15, -0.2]} intensity={2 * Math.sin((tt - 1.2) / 1.2 * Math.PI)} distance={1} color={RED} />}
  </Studio>;
}}</Stage>;

// 23 · la llave adentro: la casa en corte; ella afuera, con frío, frente a la cerradura muerta; la llave de metal brilla en el cajón de la cocina
export const H3Keyinside: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const open = sm(tt, 2.2, 3.2), kg = sm(tt, 3.0, 3.6);
  return <Studio tt={tt} night={0.8} photo={0} bg="#141a26" keys={[{ t: 0, p: [-1.6, 1.5, 3.4], l: [-0.8, 0.9, 0], fov: 40 }, { t: 3.0, p: [0.6, 1.6, 3.3], l: [0.5, 0.8, 0] }, { t: 10, p: [0.9, 1.5, 3.0], l: [0.7, 0.75, 0], arc: 0.04 }]}>
    <RB p={[-0.2, 1.3, -0.4]} s={[0.12, 2.6, 2.0]} rad={0.01} c="#ece7dc" r={0.9} />
    <RB p={[-0.2, 1.05, 0.62]} s={[0.14, 0.9, 0.06]} rad={0.01} c="#ece7dc" r={0.9} />
    <Lock3 p={[-0.29, 1.05, 0.2]} rot={[0, -Math.PI / 2, 0]} s={0.4} dead />
    <pointLight position={[1.0, 2.0, 0.2]} intensity={5} distance={4} color="#ffd9a8" />
    <Person3 p={[-1.0, 0, 0.3]} yaw={Math.PI / 2} s={0.92} col="#7a5a8a" arm={0.3 + 0.1 * Math.sin(tt * 8)} />
    {[...Array(40)].map((_, i) => <mesh key={i} position={[-2.4 + rnd(i) * 2.1, (2.6 - ((tt * 0.35 + rnd(i, 2) * 2.6) % 2.6)), -0.6 + rnd(i, 3) * 1.6]}><sphereGeometry args={[0.012, 6, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    <group position={[0.85, 0, -0.1]} scale={0.6}>
      <Drawer3 open={open}>
        <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <mesh><torusGeometry args={[0.07, 0.02, 10, 30]} /><Mat c="#c9a24a" m={1} r={0.25} e={AMB} ei={0.6 * kg} /></mesh>
          <RB p={[0.2, 0, 0]} s={[0.26, 0.05, 0.02]} rad={0.008} c="#c9a24a" m={1} r={0.25} e={AMB} ei={0.6 * kg} />
          {[0, 1, 2].map((j) => <RB key={j} p={[0.14 + j * 0.05, -0.04, 0]} s={[0.02, 0.04, 0.02]} rad={0.004} c="#c9a24a" m={1} r={0.25} />)}
        </group>
      </Drawer3>
    </group>
    {kg > 0.05 && <pointLight position={[0.85, 0.7, 0.5]} intensity={1.5 * kg} distance={1} color={AMB} />}
  </Studio>;
}}</Stage>;

// 24 · semanas de aviso: seis semanas en fila, cada una titila ámbar y la mano la barre sin mirar; la última se apaga del todo
export const H3Warnweeks: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const wk = [1, 2, 3, 4, 5, 6].map((i) => useTxt([`WEEK ${i}`], 256, 96, "#2a2c31", "#f6f3ec", 56));
  const hx = -1.25 + 2.5 * sm(tt, 0.8, 4.4), dead = sm(tt, 4.6, 5.0);
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.45, 2.2], l: [0, 0.6, 0], fov: 42 }, { t: 10, p: [0.25, 1.4, 2.0], l: [0.15, 0.6, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.25, 0]} s={[3.2, 0.5, 0.8]} rad={0.03} c="#8a7a64" r={0.7} />
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = -1.25 + i * 0.5, swept = hx > x + 0.05, last = i === 5, blink = (Math.sin(tt * 7 + i) > 0 ? 1 : 0.2);
      return <group key={i} position={[x, 0.5, 0.1 - (swept ? 0.18 : 0)]} rotation={[-0.5, 0, 0]}>
        <RB s={[0.44, 0.06, 0.5]} rad={0.012} c="#2a2c31" r={0.5} m={0.3} />
        <mesh position={[0, 0.022, 0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.38, 0.14]} /><meshStandardMaterial map={wk[i]} /></mesh>
        <mesh position={[0, 0.05, -0.08]}><sphereGeometry args={[0.07, 24, 24]} /><meshBasicMaterial color={last && dead > 0.5 ? "#151515" : AMB} transparent opacity={last && dead > 0.5 ? 1 : swept ? 0.35 * blink : blink} toneMapped={false} /></mesh>
      </group>; })}
    <Hand3 p={[hx - 0.1, 0.66, 0.2]} rot={[0.3, Math.PI / 2, 0]} s={1.8} />
    <Lock3 p={[1.0, 1.4, -0.8]} s={0.55} led={1 - dead} ledCol={AMB} dead={dead > 0.5} />
  </Studio>;
}}</Stage>;

// 25 · el puente de 9 V: la pila sube, apoya los bornes en los dos puntitos de abajo y el teclado muerto revive
export const H3Jump9v: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = sm(tt, 0.6, 2.2), alive = sm(tt, 2.3, 2.6), keys = [...Array(12)].map((_, i) => i).filter((i) => tt > 2.6 + i * 0.06);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0, 0.85, 1.4], l: [0, 0.95, 0], fov: 34 }, { t: 10, p: [0.25, 0.9, 1.2], l: [0, 0.95, 0], arc: 0.03 }]}>
    <RB p={[0, 1.0, -0.1]} s={[1.6, 2.0, 0.08]} rad={0.015} c="#3c4d5e" r={0.55} />
    <Lock3 p={[0, 1.15, 0]} s={0.9} dead={alive < 0.5} led={alive} ledCol={GRN} lit={alive > 0.5 ? keys : []} />
    {[-0.05, 0.05].map((x, i) => <mesh key={i} position={[x, 1.15 - 0.36 * 0.9, 0.02]}><sphereGeometry args={[0.012, 12, 12]} /><Mat c="#d0b060" m={1} r={0.2} /></mesh>)}
    <group position={[0, 0.5 + 0.28 * up, 0.04]}>
      <RB p={[0, 0, 0]} s={[0.13, 0.22, 0.08]} rad={0.012} c="#2a2c31" r={0.5} />
      <RB p={[0, -0.03, 0.041]} s={[0.12, 0.08, 0.002]} rad={0.002} c="#d8a030" r={0.5} />
      <mesh position={[-0.045, 0.125, 0]}><cylinderGeometry args={[0.018, 0.018, 0.03, 16]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
      <mesh position={[0.045, 0.125, 0]}><cylinderGeometry args={[0.02, 0.02, 0.03, 6]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
    </group>
    {alive > 0.05 && alive < 0.95 && <pointLight position={[0, 0.85, 0.2]} intensity={3} distance={0.6} color={ICE} />}
  </Studio>;
}}</Stage>;

// 26 · el parche: la cerradura tiene una grieta (el problema viejo); la actualización viaja por el cable desde el teléfono y la cose
export const H3Patch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const cable = sm(tt, 0.4, 1.4), heal = sm(tt, 2.0, 4.6);
  const a: V3 = [-0.85, 0.05, 0.3], b: V3 = [0.25, 0.95, 0.02];
  const cur = React.useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(...a), new THREE.Vector3((a[0] + b[0]) / 2, 0.9, 0.2), new THREE.Vector3(...b)), []);
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [-0.1, 1.0, 2.5], l: [-0.1, 0.7, 0], fov: 40 }, { t: 10, p: [0.25, 1.0, 2.3], l: [0.05, 0.7, 0], arc: 0.03 }]}>
    <Phone3 p={a} rot={[0, 0.4, 0]} s={0.75} on={1} col={ICE} />
    <Lock3 p={[0.3, 0.95, 0]} s={1.0} led={heal} ledCol={heal > 0.95 ? GRN : AMB} crack={1 - heal} />
    <RB p={[0.3, 0.45, -0.06]} s={[0.5, 0.9, 0.08]} rad={0.02} c="#8a7a64" r={0.7} />
    <Thread a={a} b={b} lift={0.6} k={cable} col="#2a2c31" r={0.012} />
    {cable > 0.99 && heal < 1 && [0, 1, 2].map((i) => { const u = ((tt * 0.8 + i / 3) % 1), p = cur.getPoint(u); return <mesh key={i} position={[p.x, p.y + 0.0, p.z]}><sphereGeometry args={[0.025, 12, 12]} /><meshBasicMaterial color={ICE} toneMapped={false} /></mesh>; })}
    {heal > 0.95 && <pointLight position={[0.3, 0.95, 0.4]} intensity={1.6 * (1 - sm(tt, 5.2, 6.5))} distance={1} color={GRN} />}
  </Studio>;
}}</Stage>;

// 27 · el rolodex: las tarjetas de la lista giran una tras otra (pintor, paseador, limpiadora vieja, «guest», ex yerno)
export const H3Rolodex: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const names = ["PAINTER · 2023", "DOG WALKER", "OLD CLEANER", "GUEST", "EX SON-IN-LAW", "PLUMBER", "NEIGHBOR KID", "CONTRACTOR"];
  const tx = names.map((n) => useTxt([n], 512, 256, "#e8dfc8", "#1e2026", 64));
  const rot = 0.2 + (Math.PI * 2 / names.length) * 4.2 * sm(tt, 0.4, 6.0);
  return <Studio tt={tt} floor="wood" photo={0.25} warm={0.35} keys={[{ t: 0, p: [0.35, 0.75, 1.7], l: [0, 0.55, 0], fov: 38 }, { t: 10, p: [0.9, 0.85, 1.6], l: [0, 0.5, 0], arc: 0.03 }]}>
    {[-0.55, 0.55].map((x, i) => <group key={i}><mesh position={[x, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.18, 0.18, 0.04, 40]} /><Mat c="#2a2c31" m={0.7} r={0.3} /></mesh><RB p={[x, 0.15, 0]} s={[0.06, 0.3, 0.3]} rad={0.01} c="#2a2c31" m={0.7} r={0.3} /></group>)}
    <RB p={[0, 0.02, 0]} s={[1.3, 0.04, 0.5]} rad={0.01} c="#2a2c31" m={0.7} r={0.3} />
    <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 1.1, 12]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
    <group position={[0, 0.5, 0]} rotation={[rot, 0, 0]}>
      {names.map((_, i) => { const a = (i / names.length) * Math.PI * 2; return <group key={i} rotation={[-a, 0, 0]}><group position={[0, 0, 0.21]}><mesh position={[0, 0, 0]} rotation={[0, 0, 0]}><planeGeometry args={[0.9, 0.45]} /><meshStandardMaterial map={tx[i]} roughness={1} metalness={0} envMapIntensity={0.2} side={THREE.DoubleSide} /></mesh></group></group>; })}
    </group>
  </Studio>;
}}</Stage>;

// 28 · los martes: la grilla del mes se arma ficha por ficha y cada martes a la 1 pm se prende con «MIKE»
export const H3Tuesdays: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const mike = useTxt(["MIKE", "1:00 PM"], 256, 256, "#3a1c12", AMB, 62), blank = useTxt([""], 64, 64, "#f6f3ec", "#000", 10);
  const days = useTxt(["S   M   T   W   T   F   S"], 1024, 96, "rgba(0,0,0,0)", "#f6f3ec", 70);
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 2.6, 1.8], l: [0, 0, -0.1], fov: 40 }, { t: 11, p: [0.3, 2.4, 1.5], l: [0.05, 0, -0.1], arc: 0.03 }]}>
    <mesh position={[0, 0.02, -1.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.3, 0.2]} /><meshBasicMaterial map={days} transparent toneMapped={false} /></mesh>
    {[...Array(35)].map((_, i) => { const r = Math.floor(i / 7), c = i % 7, at = 0.3 + (r * 7 + c) * 0.045, f = c01(spr(tt, at, 9, 0.5)), tue = c === 2, on = tue && tt > 2.4 + r * 0.5;
      return f > 0 ? <group key={i} position={[-0.99 + c * 0.33, 0.03 + 0.5 * (1 - f) + (on ? 0.04 : 0), -0.78 + r * 0.33]}>
        <RB s={[0.3, 0.05, 0.3]} rad={0.012} c={on ? "#3a1c12" : "#f6f3ec"} r={0.7} e={on ? AMB : "#000"} ei={on ? 0.35 : 0} />
        {on && <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.27, 0.27]} /><meshBasicMaterial map={mike} toneMapped={false} /></mesh>}
        {!on && <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.02]} /><meshBasicMaterial map={blank} /></mesh>}
      </group> : null; })}
  </Studio>;
}}</Stage>;

// 29 · el código que vence: un boleto con fecha; el almanaque avanza y al llegar el día, la parte del código se corta sola y cae
export const H3Expire: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const day = Math.min(14, 9 + Math.floor(sm(tt, 0.6, 3.2) * 5)), dTx = useTxt(["OCT", String(day)], 256, 256, "#f6f3ec", day === 14 ? RED : "#2a2c31", 84);
  const tk = useTxt(["PAINTER", "UNTIL OCT 14"], 512, 256, "#f2e2b8", "#2a2c31", 54), code = useTxt(["CODE", "5 1 9 3"], 256, 256, "#f2e2b8", "#2a2c31", 54);
  const cut = sm(tt, 3.4, 3.8), fall = c01((tt - 3.8) / 0.9);
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [-0.2, 1.15, 1.75], l: [-0.15, 1.1, 0], fov: 40 }, { t: 10, p: [0.1, 1.1, 1.6], l: [0, 1.05, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.5]} s={[6, 3.4, 0.1]} kind="drywall" />
    <group position={[-0.75, 1.42, -0.42]}><RB s={[0.44, 0.48, 0.04]} rad={0.01} c="#2a2c31" r={0.5} /><mesh position={[0, -0.02, 0.022]}><planeGeometry args={[0.4, 0.4]} /><meshStandardMaterial map={dTx} /></mesh></group>
    <group position={[0.05, 0.98, 0]} rotation={[0, -0.15, 0.04]} scale={1.3}>
      <RB p={[-0.2, 0, 0]} s={[0.6, 0.32, 0.01]} rad={0.004} c="#f2e2b8" r={0.8} />
      <mesh position={[-0.2, 0, 0.006]}><planeGeometry args={[0.58, 0.3]} /><meshStandardMaterial map={tk} /></mesh>
      {[...Array(9)].map((_, i) => <mesh key={i} position={[0.105, -0.13 + i * 0.033, 0.007]}><circleGeometry args={[0.006, 8]} /><meshBasicMaterial color="#8a7a5a" /></mesh>)}
      <group position={[0.105 + 0.03 * cut, -0.6 * fall * fall, 0.05 * fall]} rotation={[0, 0, -1.4 * fall]}>
        <group position={[0.15, 0, 0]}><RB s={[0.3, 0.32, 0.01]} rad={0.004} c="#f2e2b8" r={0.8} /><mesh position={[0, 0, 0.006]}><planeGeometry args={[0.28, 0.3]} /><meshStandardMaterial map={code} /></mesh></group>
      </group>
    </group>
  </Studio>;
}}</Stage>;

// 30 · rayos X a la maceta: la maceta del porche se vuelve transparente y adentro, en la tierra, está la llave
export const H3Potxray: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const x = sm(tt, 1.2, 2.4), kg = sm(tt, 2.2, 2.8);
  return <Studio tt={tt} floor="concrete" photo={0.3} keys={[{ t: 0, p: [0.4, 1.2, 2.4], l: [0.2, 0.55, 0], fov: 38 }, { t: 10, p: [0.6, 0.9, 1.6], l: [0.35, 0.35, 0.3], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="brick" />
    <Door3 p={[-0.5, 0, -0.8]} s={0.95} col="#2f4a5e" led={0.4} ledCol={ICE} />
    <group position={[0.35, 0, 0.3]}>
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.3, 0.22, 0.5, 40]} /><meshStandardMaterial color="#b5643c" roughness={0.85} transparent opacity={1 - 0.8 * x} depthWrite={x < 0.5} /></mesh>
      <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.28, 0.28, 0.04, 40]} /><meshStandardMaterial color="#3a2a1c" roughness={1} transparent opacity={1 - 0.75 * x} /></mesh>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.27, 0.2, 0.36, 40]} /><meshStandardMaterial color="#3a2a1c" roughness={1} transparent opacity={0.85 - 0.65 * x} depthWrite={false} /></mesh>
      {[...Array(7)].map((_, i) => { const a = (i / 7) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.08, 0.7, Math.sin(a) * 0.08]} rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}><coneGeometry args={[0.05, 0.45, 8]} /><Mat c="#3f7a3a" r={0.8} /></mesh>; })}
      <group position={[0.02, 0.2, 0.03]} rotation={[0.3, 0.4, 1.2]}>
        <mesh><torusGeometry args={[0.04, 0.012, 10, 24]} /><Mat c="#c9a24a" m={1} r={0.25} e={AMB} ei={0.9 * kg} /></mesh>
        <RB p={[0.11, 0, 0]} s={[0.15, 0.03, 0.012]} rad={0.005} c="#c9a24a" m={1} r={0.25} e={AMB} ei={0.9 * kg} />
      </group>
      {kg > 0.05 && <pointLight position={[0, 0.25, 0.3]} intensity={1.6 * kg} distance={0.8} color={AMB} />}
    </group>
  </Studio>;
}}</Stage>;

export const HEROES_3B = { pricescale: H3Pricescale, kick: H3Kick, strikeexplode: H3Strikeexplode, deepscrew: H3Deepscrew, smudge: H3Smudge, badcodes: H3Badcodes, voicepin: H3Voicepin, keyinside: H3Keyinside, warnweeks: H3Warnweeks, jump9v: H3Jump9v, patch: H3Patch, rolodex: H3Rolodex, tuesdays: H3Tuesdays, expire: H3Expire, potxray: H3Potxray };
