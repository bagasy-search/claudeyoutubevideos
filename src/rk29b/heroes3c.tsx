// rk29b · componentes 3D 31-45 (29-oct). Cada uno UNA vez en toda la tanda.
// Contraseñas que tumban fichas, el vidrio con lámina, el garage de 1986, Walt y su caja fuerte, el domingo de 10 minutos…
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { Studio, Wall3, RB, Mat, sm, spr, c01, rnd, type V3 } from "./studio3d";
import { AMB, RED, ICE, GRN, useTxt, Lock3, Door3, Phone3, Hand3, Screw3, Arrow3, Hourglass3 } from "./lock3d";

type P = { t: number; h: H };

// candado (cuerpo + arco); open sube el arco
const Padlock3: React.FC<{ p?: V3; rot?: V3; s?: number; open?: number; col?: string }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, open = 0, col = "#b08a3a" }) => (
  <group position={p} rotation={rot} scale={s}>
    <RB p={[0, 0, 0]} s={[0.3, 0.26, 0.12]} rad={0.04} c={col} m={1} r={0.3} />
    <mesh position={[0, -0.03, 0.061]}><circleGeometry args={[0.025, 20]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
    <group position={[0, 0.13 + 0.08 * open, 0]}>
      <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.09, 0.022, 12, 32, Math.PI]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
      {[-0.09, 0.09].map((x, i) => <mesh key={i} position={[x, -0.04, 0]}><cylinderGeometry args={[0.022, 0.022, 0.08, 12]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>)}
    </group>
  </group>
);

// 31 · dominó: la contraseña repetida de un sitio filtrado tumba fichas, una tras otra, hasta la puerta de casa
export const H3Domino: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const N = 11, step = 0.28, open = sm(tt, 0.9 + N * step, 1.6 + N * step);
  const leak = useTxt(["LEAKED", "PASSWORD"], 256, 160, "#2a0f0d", RED, 46);
  return <Studio tt={tt} floor="wood" photo={0.25} keys={[{ t: 0, p: [-1.6, 1.1, 1.9], l: [-1.0, 0.3, 0], fov: 40 }, { t: 3.5, p: [0.2, 1.3, 2.4], l: [0.3, 0.35, -0.2] }, { t: 10, p: [1.0, 1.2, 2.0], l: [1.1, 0.5, -0.3], arc: 0.04 }]}>
    <Wall3 p={[0.5, 1.6, -0.9]} s={[7, 3.4, 0.1]} kind="drywall" />
    <group position={[-1.95, 0, 0]}>
      <RB p={[0, 0.2, 0]} s={[0.4, 0.4, 0.4]} rad={0.03} c="#1a1c20" r={0.4} m={0.4} e={RED} ei={0.25 + 0.2 * Math.sin(tt * 5)} />
      <mesh position={[0, 0.2, 0.205]}><planeGeometry args={[0.34, 0.21]} /><meshBasicMaterial map={leak} toneMapped={false} /></mesh>
    </group>
    {[...Array(N)].map((_, i) => { const x = -1.55 + i * 0.27, f = sm(tt, 0.6 + i * step, 0.6 + i * step + 0.32); return <group key={i} position={[x + 0.04, 0, 0]} rotation={[0, 0, -1.2 * f]}><RB p={[0, 0.2, 0]} s={[0.06, 0.4, 0.2]} rad={0.012} c={i === 0 ? RED : "#f6f3ec"} r={0.4} /></group>; })}
    <Door3 p={[1.75, 0, -0.75]} s={0.85} open={open * 0.65} col="#5a2a24" led={open} ledCol={RED} bolt={1 - open} />
  </Studio>;
}}</Stage>;

// 32 · el candado sobre el candado: un segundo candado chico baja y cierra encima del primero
export const H3Nested: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const down = sm(tt, 0.8, 2.0), shut = sm(tt, 2.2, 2.5), flash = tt > 2.5 ? Math.exp(-(tt - 2.5) * 4) : 0;
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0.2, 1.25, 1.7], l: [0, 1.05, 0], fov: 34 }, { t: 10, p: [0.45, 1.2, 1.45], l: [0.05, 1.08, 0], arc: 0.03 }]}>
    <RB p={[0, 1.0, -0.15]} s={[1.8, 2.0, 0.08]} rad={0.015} c="#3c4d5e" r={0.55} />
    <Lock3 p={[-0.35, 1.15, -0.08]} s={0.75} led={1} ledCol={GRN} />
    <group position={[0.25, 1.05, -0.08]}>
      <RB p={[0, 0, 0]} s={[0.22, 0.08, 0.04]} rad={0.01} c="#9aa0a8" m={1} r={0.3} />
      <mesh position={[0.06, 0, 0.05]} rotation={[0, 0, 0]}><torusGeometry args={[0.04, 0.012, 10, 24]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
      <Padlock3 p={[0.06, -0.22, 0.06]} s={0.8} col="#b08a3a" />
      <Padlock3 p={[0.06, -0.33 - 0.0 + 0.8 * (1 - down), 0.14]} rot={[0, 0, 0.1 * (1 - down)]} s={0.5} open={1 - shut} col="#8a1f1a" />
    </group>
    {flash > 0.02 && <pointLight position={[0.3, 0.8, 0.4]} intensity={2 * flash} distance={0.8} color={GRN} />}
  </Studio>;
}}</Stage>;

// 33 · el router: se da vuelta y la etiqueta de fábrica se despega mostrando la clave impresa
export const H3Router: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const flip = sm(tt, 0.6, 1.8), peel = sm(tt, 2.4, 3.6);
  const lab = useTxt(["NETWORK: HOME-4G7K", "PASSWORD: admin1234", "MODEL WR-1400"], 512, 256, "#f6f3ec", "#2a2c31", 36);
  return <Studio tt={tt} floor="wood" photo={0.25} keys={[{ t: 0, p: [0.3, 1.0, 1.6], l: [0, 0.2, 0], fov: 38 }, { t: 2.2, p: [0.1, 1.3, 0.95], l: [0, 0.15, 0] }, { t: 10, p: [0.25, 1.2, 0.85], l: [0.02, 0.15, 0], arc: 0.03 }]}>
    <group position={[0, 0.1 + 0.25 * Math.sin(Math.PI * flip), 0]} rotation={[0, 0, Math.PI * flip]}>
      <RB p={[0, 0, 0]} s={[0.7, 0.12, 0.45]} rad={0.03} c="#1d1f24" r={0.35} m={0.2} />
      {[-0.25, 0.0, 0.25].map((x, i) => <group key={i} position={[x, 0.06, -0.2]} rotation={[-0.3 + i * 0.1, 0, (i - 1) * 0.25]}><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.018, 0.022, 0.4, 12]} /><Mat c="#1d1f24" r={0.4} /></mesh></group>)}
      {[...Array(5)].map((_, i) => <mesh key={i} position={[-0.2 + i * 0.1, 0.0, 0.226]}><circleGeometry args={[0.012, 10]} /><meshBasicMaterial color={i < 3 ? GRN : ICE} toneMapped={false} /></mesh>)}
      <group position={[0, -0.062, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.21]} /><meshStandardMaterial map={lab} roughness={0.9} /></mesh>
        <group position={[-0.21, -0.001, 0]} rotation={[0, 0, 0]}><group rotation={[0, 0, 0]}>
          <group position={[0, 0, 0]} rotation={[0, 0, -2.4 * peel]}><mesh position={[0.21, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[0.43, 0.22]} /><meshStandardMaterial color="#c7c9cc" roughness={0.6} metalness={0.4} side={THREE.DoubleSide} /></mesh></group>
        </group></group>
      </group>
    </group>
  </Studio>;
}}</Stage>;

// telaraña de vidrio rajado
const useWeb = () => React.useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const g = cv.getContext("2d")!;
  g.clearRect(0, 0, 512, 512); g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + rnd(i) * 0.3; g.beginPath(); g.moveTo(256, 256); g.lineTo(256 + Math.cos(a) * 300, 256 + Math.sin(a) * 300); g.stroke(); }
  for (let r = 30; r < 260; r += 40) { g.beginPath(); for (let i = 0; i <= 14; i++) { const a = (i / 14) * Math.PI * 2, rr = r * (0.85 + 0.3 * rnd(i, r)); if (i === 0) g.moveTo(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr); else g.lineTo(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr); } g.stroke(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

// 34 · lámina en el vidrio: el mismo golpe; el vidrio común se cae en pedazos, el que tiene lámina queda en telaraña y no abre agujero
export const H3Filmglass: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const web = useWeb(), hitT = 1.4, d = Math.max(0, tt - hitT), ball = sm(tt, 0.4, hitT);
  const glass = (op: number) => <meshPhysicalMaterial color="#dfeeff" transmission={0.9} roughness={0.04} thickness={0.02} transparent opacity={op} />;
  return <Studio tt={tt} photo={0.3} keys={[{ t: 0, p: [0, 1.25, 3.0], l: [0, 1.0, 0], fov: 38 }, { t: 10, p: [0.4, 1.2, 2.7], l: [0.1, 0.95, 0], arc: 0.04 }]}>
    {[-0.7, 0.7].map((x, i) => <group key={i} position={[x, 0, -0.2]}>
      <RB p={[0, 1.05, 0]} s={[0.9, 0.06, 0.1]} rad={0.01} c="#efe9dd" r={0.6} />
      <RB p={[0, 0.0 + 0.3, 0]} s={[0.9, 0.06, 0.1]} rad={0.01} c="#efe9dd" r={0.6} />
      {[-0.42, 0.42].map((xx, j) => <RB key={j} p={[xx, 0.68, 0]} s={[0.06, 0.8, 0.1]} rad={0.01} c="#efe9dd" r={0.6} />)}
      {i === 1 && <><mesh position={[0, 0.68, 0]}><planeGeometry args={[0.78, 0.7]} />{glass(0.3)}</mesh>{tt > hitT && <mesh position={[0, 0.68, 0.003]}><planeGeometry args={[0.78, 0.7]} /><meshBasicMaterial map={web} transparent opacity={c01(d * 5)} toneMapped={false} /></mesh>}</>}
      {i === 0 && (tt < hitT ? <mesh position={[0, 0.68, 0]}><planeGeometry args={[0.78, 0.7]} />{glass(0.3)}</mesh> :
        [...Array(16)].map((_, k) => { const sx = -0.3 + (k % 4) * 0.2, sy = 0.4 + Math.floor(k / 4) * 0.18; return <mesh key={k} position={[sx + (rnd(k) - 0.5) * d * 0.3, sy - 1.6 * d * d * (0.6 + rnd(k, 2)), 0.05 + d * 0.4 * rnd(k, 3)]} rotation={[d * 4 * rnd(k, 4), d * 3, d * 5 * rnd(k, 5)]}><planeGeometry args={[0.18, 0.16]} />{glass(0.4)}</mesh>; }))}
      {/* el ladrillo que golpea */}
      {tt < hitT + 0.15 && <RB p={[0, 0.68, 1.4 - 1.35 * ball]} rot={[tt * 3, tt * 2, 0]} s={[0.16, 0.08, 0.08]} rad={0.01} c="#a54a32" r={0.9} />}
      {tt > hitT && <RB p={[0, Math.max(0.04, 0.68 - 2 * d * d), 0.12 + (i ? 0.1 * d : -0.3 * d)]} rot={[d * 4, 0, 0]} s={[0.16, 0.08, 0.08]} rad={0.01} c="#a54a32" r={0.9} />}
    </group>)}
  </Studio>;
}}</Stage>;

// 35 · el brazo: desde el vidrio lateral se dibuja el arco de alcance de un brazo; llega al pestillo y se pone rojo
export const H3Armreach: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const arm = sm(tt, 0.6, 1.8), arc = sm(tt, 1.6, 3.6), reach = arc > 0.95;
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0.6, 1.25, 2.9], l: [0.6, 1.05, 0], fov: 40 }, { t: 10, p: [0.7, 1.22, 2.7], l: [0.65, 1.05, 0], arc: 0.02 }]}>
    <Wall3 p={[-1.1, 1.3, -0.12]} s={[1.6, 2.8, 0.16]} kind="drywall" />
    <Wall3 p={[2.0, 1.3, -0.12]} s={[1.4, 2.8, 0.16]} kind="drywall" />
    <Door3 p={[0.35, 0, -0.1]} col="#4a2e26" led={0.5} ledCol={reach ? RED : AMB} frame />
    <group position={[1.12, 0, -0.1]}>
      <RB p={[0, 1.05, 0]} s={[0.36, 2.1, 0.1]} rad={0.01} c="#efe9dd" r={0.6} />
      <mesh position={[0, 1.15, 0.055]}><planeGeometry args={[0.24, 1.5]} /><meshPhysicalMaterial color="#dfeeff" transmission={0.9} roughness={0.05} transparent opacity={0.35} /></mesh>
    </group>
    {/* el arco del alcance, en el plano de la puerta */}
    <group position={[1.12, 1.1, 0.05]}>
      <mesh rotation={[0, 0, Math.PI - 1.1 * arc]}><ringGeometry args={[0.86, 0.9, 64, 1, 0, 1.1 * arc]} /><meshBasicMaterial color={reach ? RED : AMB} transparent opacity={0.9} toneMapped={false} /></mesh>
      <mesh rotation={[0, 0, Math.PI - 1.1 * arc]}><circleGeometry args={[0.88, 64, 0, 1.1 * arc]} /><meshBasicMaterial color={reach ? RED : AMB} transparent opacity={0.12} depthWrite={false} /></mesh>
    </group>
    <Hand3 p={[1.25 - 0.55 * arm, 1.12, 0.22]} rot={[0, -Math.PI / 2, 0]} s={1.9} sleeve="#3a4a5e" />
  </Studio>;
}}</Stage>;

// 36 · el garage: el portón grande sube con un botón y detrás está la puerta a la cocina con un pomo de 1986, sin cerrojo
export const H3Garagepanel: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const btn = sm(tt, 0.4, 0.7), up = sm(tt, 0.8, 3.2), spot = sm(tt, 3.0, 3.6);
  const tgt = React.useMemo(() => { const o = new THREE.Object3D(); o.position.set(0, 0.9, -1.6); return o; }, []);
  return <Studio tt={tt} floor="concrete" night={0.5} photo={0} keys={[{ t: 0, p: [0, 1.4, 4.2], l: [0, 1.2, -0.5], fov: 42 }, { t: 3.6, p: [0.2, 1.2, 2.6], l: [0.05, 1.0, -1.6] }, { t: 10, p: [0.4, 1.15, 2.2], l: [0.1, 0.98, -1.6], arc: 0.03 }]}>
    <RB p={[-1.9, 1.3, 0]} s={[1.0, 2.6, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
    <RB p={[1.9, 1.3, 0]} s={[1.0, 2.6, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
    <RB p={[0, 2.45, 0]} s={[2.8, 0.3, 0.2]} rad={0.01} c="#d8d2c4" r={0.9} />
    {[0, 1, 2, 3].map((i) => <RB key={i} p={[0, 0.29 + i * 0.56 + 2.2 * up, 0.02 - 0.2 * up]} s={[2.8, 0.54, 0.06]} rad={0.01} c="#ecebe6" r={0.6} />)}
    <group position={[1.6, 1.15, 0.12]}><RB s={[0.24, 0.34, 0.05]} rad={0.015} c="#ecebe6" r={0.6} /><mesh position={[0, 0, 0.035 - 0.02 * btn]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.04, 24]} /><Mat c="#c62a22" r={0.4} /></mesh></group>
    <Wall3 p={[0, 1.3, -1.75]} s={[3.6, 2.6, 0.1]} kind="drywall" />
    <Door3 p={[0, 0, -1.68]} s={0.92} col="#b8ad98" lock={false} knobOld />
    <primitive object={tgt} />
    <spotLight position={[0, 2.3, -0.6]} target={tgt} angle={0.5} penumbra={0.6} intensity={7 * spot} distance={5} color="#ffd9a8" />
  </Studio>;
}}</Stage>;

// 37 · los grados: tres cerraduras en el podio; el grado 1 arriba, el 3 de «trabajo liviano» abajo
export const H3Grades: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const n = [useTxt(["2"], 128, 128, "#9aa0a8", "#1a1a1a", 96), useTxt(["1"], 128, 128, "#d4af37", "#1a1a1a", 96), useTxt(["3"], 128, 128, "#a0703a", "#1a1a1a", 96)];
  const light = useTxt(["LIGHT DUTY"], 256, 64, "#f6f3ec", RED, 40);
  const hs = [0.5, 0.8, 0.3], xs = [-0.75, 0, 0.75], order = [1, 0, 2];
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.4, 3.3], l: [0, 0.85, 0], fov: 38 }, { t: 10, p: [0.45, 1.5, 3.0], l: [0.05, 0.85, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    {[0, 1, 2].map((i) => { const at = 0.3 + order.indexOf(i) * 0.7, f = c01(spr(tt, at, 7, 0.45)); return <group key={i} position={[xs[i], 0, 0]}>
      <RB p={[0, hs[i] / 2, 0]} s={[0.7, hs[i], 0.6]} rad={0.02} c="#f2efe8" r={0.6} />
      <mesh position={[0, hs[i] / 2, 0.301]}><planeGeometry args={[0.24, 0.24]} /><meshStandardMaterial map={n[i]} /></mesh>
      <group position={[0, hs[i] + 0.25 + 0.6 * (1 - f), 0]} scale={[1, 1, 1].map(() => (i === 1 ? 0.78 : i === 0 ? 0.6 : 0.42) * f) as V3}><Lock3 rot={[0, 0, 0]} led={1} ledCol={i === 2 ? RED : GRN} /></group>
      {i === 2 && tt > 2.4 && <mesh position={[0, hs[i] + 0.04, 0.32]} rotation={[-0.3, 0, 0]} scale={c01((tt - 2.4) / 0.3)}><planeGeometry args={[0.5, 0.12]} /><meshStandardMaterial map={light} /></mesh>}
    </group>; })}
  </Studio>;
}}</Stage>;

// 38 · el pasillo de los cinco errores: cinco puertas; cada una se cierra y se prende verde al nombrar su arreglo
export const H3Hallfive: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  return <Studio tt={tt} night={0.4} photo={0} keys={[{ t: 0, p: [0, 1.4, 3.6], l: [0, 1.1, -3], fov: 44 }, { t: 11, p: [0.05, 1.35, 0.6], l: [0, 1.1, -5], arc: 0.01 }]}>
    {[-1, 1].map((sd) => <Wall3 key={sd} p={[sd * 1.1, 1.3, -2.5]} rot={[0, Math.PI / 2, 0]} s={[8, 2.6, 0.1]} kind="drywall" />)}
    <Wall3 p={[0, 1.3, -6.4]} s={[2.3, 2.6, 0.1]} kind="drywall" />
    {[0, 1, 2, 3, 4].map((i) => { const sd = i % 2 ? 1 : -1, z = 0.2 - i * 1.25, sh = sm(tt, 0.8 + i * 1.5, 1.4 + i * 1.5);
      return <group key={i}>
        <Door3 p={[sd * 1.04, 0, z]} rot={[0, -sd * Math.PI / 2, 0]} s={0.85} open={0.7 * (1 - sh)} col={["#5a2a24", "#2f4a5e", "#4a3a2a", "#3c4d5e", "#5a3a4a"][i]} led={1} ledCol={sh > 0.9 ? GRN : RED} bolt={sh} frame />
        {sh > 0.9 && <pointLight position={[sd * 0.8, 1.2, z]} intensity={1.0} distance={1.2} color={GRN} />}
      </group>; })}
    <pointLight position={[0, 2.4, -2]} intensity={6} distance={7} color="#ffe6c4" />
  </Studio>;
}}</Stage>;

// 39 · la cerradura que se deja ver por dentro: la carcasa se vuelve vidrio y adentro gira el motor y corre el pestillo
export const H3Glasslock: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const g = sm(tt, 0.5, 1.8), run = c01((tt - 2.0) / 3), gear = run * 14, bolt = 0.5 - 0.5 * Math.cos(run * Math.PI * 2);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [0.2, 1.15, 1.3], l: [0, 1.05, 0], fov: 32 }, { t: 10, p: [0.55, 1.1, 1.05], l: [0.05, 1.05, 0], arc: 0.03 }]}>
    <RB p={[0, 1.0, -0.16]} s={[1.8, 2.0, 0.08]} rad={0.015} c="#4a2e26" r={0.55} />
    <Lock3 p={[0, 1.05, 0]} s={1.25} led={0.3} ledCol={ICE} glass={g} bolt={bolt} />
    <group position={[0, 1.05, 0.0]} scale={1.6}>
      <group position={[0, 0.12, 0]} rotation={[0, 0, gear]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 24]} /><Mat c="#d0a040" m={1} r={0.3} /></mesh>
        {[...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2; return <RB key={i} p={[Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0]} rot={[0, 0, a]} s={[0.025, 0.018, 0.03]} rad={0.003} c="#d0a040" m={1} r={0.3} />; })}
      </group>
      <group position={[0.1, 0.05, 0]} rotation={[0, 0, -gear * 1.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.03, 20]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
        {[...Array(7)].map((_, i) => { const a = (i / 7) * Math.PI * 2; return <RB key={i} p={[Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0]} rot={[0, 0, a]} s={[0.02, 0.014, 0.03]} rad={0.003} c="#c9ced4" m={1} r={0.25} />; })}
      </group>
      <mesh position={[-0.06, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.12, 20]} /><Mat c="#3a5a8a" m={0.6} r={0.3} /></mesh>
      <mesh position={[0.05, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} /><Mat c="#c98a3a" m={1} r={0.3} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 40 · la combinación escrita en la caja fuerte: la perilla gira y, al dar la vuelta, al costado está escrita a marcador
export const H3Safecombo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const scrib = React.useMemo(() => { const cv = document.createElement("canvas"); cv.width = 512; cv.height = 512; const g = cv.getContext("2d")!; g.fillStyle = "#4a4f57"; g.fillRect(0, 0, 512, 512);
    g.fillStyle = "#151515"; g.font = "italic bold 88px 'Comic Sans MS', cursive"; g.save(); g.translate(60, 170); g.rotate(-0.08); g.fillText("R 32", 0, 0); g.fillText("L 17", 20, 110); g.fillText("R 5", 10, 220); g.restore();
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }, []);
  const spin = Math.sin(tt * 1.6) * 2.2 + tt * 0.6;
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0.1, 1.0, 2.0], l: [0, 0.65, 0], fov: 36 }, { t: 2.8, p: [1.2, 0.95, 1.6], l: [0.1, 0.65, 0] }, { t: 10, p: [1.4, 0.9, 1.2], l: [0.2, 0.62, 0], arc: 0.04 }]}>
    <Wall3 p={[0, 1.6, -0.9]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 0.6, 0]} s={[0.8, 1.0, 0.75]} rad={0.04} c="#4a4f57" r={0.35} m={0.6} />
    <mesh position={[0.401, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.65, 0.65]} /><meshStandardMaterial map={scrib} roughness={0.45} metalness={0.5} /></mesh>
    <RB p={[0, 0.6, 0.38]} s={[0.66, 0.86, 0.02]} rad={0.02} c="#3d4148" r={0.35} m={0.6} />
    <group position={[0, 0.75, 0.4]} rotation={[0, 0, spin]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.14, 0.05, 48]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
      {[...Array(20)].map((_, i) => { const a = (i / 20) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.115, Math.sin(a) * 0.115, 0.028]} rotation={[0, 0, a]}><planeGeometry args={[0.02, 0.004]} /><meshBasicMaterial color="#1a1a1a" /></mesh>; })}
    </group>
    <mesh position={[0, 0.9, 0.395]}><coneGeometry args={[0.015, 0.03, 3]} /><meshBasicMaterial color={RED} /></mesh>
    <RB p={[0.2, 0.45, 0.42]} s={[0.04, 0.2, 0.05]} rad={0.015} c="#c9ced4" m={1} r={0.2} />
  </Studio>;
}}</Stage>;

// 41 · cada uno su llave: cuatro ganchos con tarjetas de color; la de la limpiadora se va en una valija rodando
export const H3Owncodes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const names = ["CLEANER", "IN-LAW", "NEIGHBOR", "GRANDSON"].map((n) => useTxt([n], 256, 96, "#f6f3ec", "#2a2c31", 50)), cols = ["#e8a33a", "#4a8ad8", "#5bb06a", "#c75a8a"];
  const off = sm(tt, 2.0, 2.8), into = sm(tt, 2.8, 3.6), roll = sm(tt, 3.8, 5.6);
  return <Studio tt={tt} photo={0.25} keys={[{ t: 0, p: [0, 1.2, 2.0], l: [0, 1.05, 0], fov: 40 }, { t: 3.2, p: [0.3, 1.0, 2.6], l: [0.25, 0.75, 0] }, { t: 10, p: [0.55, 0.95, 2.6], l: [0.45, 0.7, 0], arc: 0.03 }]}>
    <Wall3 p={[0, 1.6, -0.6]} s={[6, 3.4, 0.1]} kind="drywall" />
    <RB p={[0, 1.45, -0.52]} s={[1.6, 0.14, 0.04]} rad={0.01} c="#7a4a2a" r={0.6} />
    {[0, 1, 2, 3].map((i) => { const x = -0.6 + i * 0.4, me = i === 0; const cx = me ? x + (0.15 - x) * into + 1.2 * roll : x, cy = me ? 1.22 + 0.25 * off - 0.85 * into : 1.22, cs = me ? 1 - 0.6 * into : 1;
      return <group key={i}>
        <mesh position={[x, 1.42, -0.45]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 8]} /><Mat c="#c9ced4" m={1} r={0.2} /></mesh>
        {(!me || into < 0.99) && <group position={[cx, cy, -0.44 + (me ? 0.5 * into : 0)]} scale={cs} rotation={[0, 0, me ? 0.5 * off : 0.05 * Math.sin(tt + i)]}>
          <RB s={[0.3, 0.42, 0.012]} rad={0.02} c={cols[i]} r={0.5} />
          <mesh position={[0, -0.08, 0.007]}><planeGeometry args={[0.27, 0.1]} /><meshStandardMaterial map={names[i]} /></mesh>
          <mesh position={[0, 0.14, 0.007]}><circleGeometry args={[0.03, 16]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
        </group>}
      </group>; })}
    <group position={[0.15 + 1.2 * roll, 0, 0.06]} rotation={[0, -0.3, 0]}>
      <RB p={[0, 0.32, 0]} s={[0.42, 0.56, 0.22]} rad={0.04} c="#8a2a2a" r={0.5} />
      <RB p={[0, 0.64, 0]} s={[0.04, 0.12, 0.04]} rad={0.01} c="#2a2c31" r={0.4} />
      <RB p={[0, 0.72, 0]} s={[0.2, 0.03, 0.04]} rad={0.01} c="#2a2c31" r={0.4} />
      {[-0.15, 0.15].map((x, i) => <mesh key={i} position={[x, 0.03, 0]} rotation={[roll * 12, 0, Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.03, 16]} /><Mat c="#1a1a1a" /></mesh>)}
    </group>
  </Studio>;
}}</Stage>;

// 42 · la cuña: corte de la puerta y el piso; la puerta empuja, la cuña la frena; la barra bajo el pomo también
export const H3Wedge: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const push = (tt > 1.2 && tt < 4.5 ? 1 : 0) * (0.5 + 0.5 * Math.sin(tt * 9)), sw = 0.02 * push, bar = sm(tt, 2.6, 3.4);
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [2.2, 0.9, 1.8], l: [0.3, 0.6, 0], fov: 40 }, { t: 10, p: [2.3, 0.85, 1.3], l: [0.3, 0.6, 0], arc: 0.03 }]}>
    <RB p={[-0.1, 1.05, -0.5]} s={[0.12, 2.2, 0.12]} rad={0.01} c="#efe9dd" r={0.6} />
    <group position={[-0.1, 0, -0.5]} rotation={[0, sw, 0]}>
      <RB p={[0, 1.02, 0.45]} s={[0.07, 2.02, 0.9]} rad={0.015} c="#5a2a24" r={0.55} />
      <mesh position={[0.07, 0.98, 0.82]}><sphereGeometry args={[0.04, 16, 16]} /><Mat c="#c9ced4" m={1} r={0.25} /></mesh>
    </group>
    {tt > 1.2 && tt < 4.5 && <Arrow3 p={[-0.9, 0.9, 0]} rot={[0, 0, -Math.PI / 2]} L={0.55 + 0.05 * push} col={RED} />}
    <mesh position={[0.15, 0.04, 0.0]} rotation={[0, Math.PI / 2, 0]}><extrudeGeometry args={[React.useMemo(() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.3, 0); s.lineTo(0.3, 0.07); s.closePath(); return s; }, []), { depth: 0.12, bevelEnabled: false }]} /><Mat c="#f2c230" r={0.6} e={GRN} ei={0.2 * push} /></mesh>
    <group position={[0.0, 0, 0.32]} rotation={[0, 0, -0.85 + 0.85 * (1 - bar)]} >
      <mesh position={[0.5, 0.0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, bar, 1]}><cylinderGeometry args={[0.025, 0.025, 1.3, 16]} /><Mat c="#9aa0a8" m={1} r={0.3} /></mesh>
    </group>
  </Studio>;
}}</Stage>;

// 43 · la cámara mira, el interruptor cierra: la cámara graba la puerta abierta con su lucecita roja; el interruptor baja y la puerta se cierra
export const H3Camvsswitch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" three>{(tt) => {
  const flip = sm(tt, 3.0, 3.3), close = sm(tt, 3.4, 4.6), rec = Math.sin(tt * 5) > 0 ? 1 : 0.2;
  return <Studio tt={tt} photo={0.2} keys={[{ t: 0, p: [-0.6, 1.6, 3.2], l: [-0.2, 1.3, 0], fov: 40 }, { t: 2.6, p: [0.6, 1.4, 3.0], l: [0.4, 1.1, 0] }, { t: 10, p: [0.8, 1.3, 2.7], l: [0.4, 1.05, 0], arc: 0.04 }]}>
    <Wall3 p={[-1.5, 1.3, -0.15]} s={[1.8, 2.8, 0.18]} kind="drywall" />
    <Wall3 p={[1.6, 1.3, -0.15]} s={[1.6, 2.8, 0.18]} kind="drywall" />
    <Door3 p={[0, 0, -0.1]} open={0.65 * (1 - close)} col="#2f4a5e" lock led={close} ledCol={GRN} bolt={close} />
    <group position={[-0.95, 2.1, 0.0]} rotation={[0.35, 0.55, 0]}>
      <RB p={[0, 0, 0]} s={[0.16, 0.14, 0.26]} rad={0.04} c="#f2f2f2" r={0.4} />
      <mesh position={[0, 0, 0.135]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.045, 0.05, 0.02, 24]} /><Mat c="#111" m={0.5} r={0.1} /></mesh>
      <mesh position={[0.05, 0.045, 0.131]}><sphereGeometry args={[0.012, 10, 10]} /><meshBasicMaterial color={RED} transparent opacity={rec} toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.95]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.45, 1.6, 32, 1, true]} /><meshBasicMaterial color={ICE} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    </group>
    <group position={[1.0, 1.15, 0.0]}>
      <RB s={[0.18, 0.28, 0.04]} rad={0.015} c="#f2efe8" r={0.5} />
      <group position={[0, 0, 0.03]} rotation={[0.6 - 1.2 * flip, 0, 0]}><RB p={[0, 0, 0.02]} s={[0.05, 0.11, 0.04]} rad={0.012} c={flip > 0.5 ? GRN : "#d8d2c4"} r={0.4} /></group>
    </group>
    <Hand3 p={[1.0 + 0.1, 1.2 + 0.25 * (1 - sm(tt, 2.2, 2.9)) - 0.06 * flip, 0.25]} rot={[0.3, 0.3, 0]} s={1.0} />
  </Studio>;
}}</Stage>;

// 44 · el dueño: el teléfono con la corona de «owner» pasa de la mano del que lo instaló a la mano del abuelo
export const H3Owner: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const scr = useTxt(["♛", "OWNER", "PASSWORD: ••••••"], 512, 1024, "#101216", AMB, 92), k = sm(tt, 1.0, 3.4), x = -0.55 + 1.1 * k, y = 0.62 + 0.15 * Math.sin(Math.PI * k);
  return <Studio tt={tt} floor="wood" photo={0.25} keys={[{ t: 0, p: [0, 1.05, 1.5], l: [0, 0.68, 0], fov: 40 }, { t: 10, p: [0.25, 1.0, 1.35], l: [0.2, 0.68, 0], arc: 0.03 }]}>
    <RB p={[0, 0.25, -0.1]} s={[2.2, 0.5, 0.9]} rad={0.03} c="#8a7a64" r={0.7} />
    <Hand3 p={[-0.8 + 0.25 * (1 - sm(tt, 3.2, 4.2)) - 0.25, 0.6, 0.15]} rot={[0, Math.PI / 2, 0]} s={1.8} skin="#e3bf9e" sleeve="#3a6ea5" />
    <Hand3 p={[0.85 - 0.15 * sm(tt, 0.4, 1.2), 0.6, 0.15]} rot={[0, -Math.PI / 2, 0]} s={1.8} skin="#c9a080" sleeve="#7a6450" />
    <Phone3 p={[x, y + 0.08, 0.1]} rot={[1.1, 0, 0]} s={1.1} on={1} map={scr} col={AMB} />
  </Studio>;
}}</Stage>;

// 45 · el domingo de 10 minutos: una rueda de 10 porciones sobre la mesa; cada minuto se prende la suya y aparece su objeto
export const H3Sunday10: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const cnt = Math.min(10, Math.floor(c01((tt - 0.5) / 6.5) * 10.99));
  const obj = (i: number) => {
    switch (i) {
      case 0: return <Phone3 s={0.4} on={1} />;
      case 1: return <group rotation={[Math.PI / 2, 0, 0]}><mesh><cylinderGeometry args={[0.08, 0.08, 0.04, 24]} /><Mat c="#22252b" /></mesh></group>;
      case 2: return <Hourglass3 s={0.25} k={0.5} />;
      case 3: return <Screw3 p={[0, 0.25, 0]} L={0.25} />;
      case 4: return <Lock3 p={[0, 0.12, 0]} s={0.3} led={1} ledCol={GRN} />;
      case 5: return <group><RB p={[0, 0.06, 0]} s={[0.07, 0.12, 0.05]} rad={0.01} c="#2a2c31" /><RB p={[0, 0.06, 0.026]} s={[0.06, 0.04, 0.002]} rad={0.002} c="#d8a030" /></group>;
      case 6: return <RB p={[0, 0.04, 0]} s={[0.16, 0.06, 0.1]} rad={0.015} c="#1d1f24" />;
      case 7: return <group><mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.07, 0.05, 0.14, 20]} /><Mat c="#b5643c" r={0.85} /></mesh></group>;
      case 8: return <RB p={[0, 0.08, 0]} s={[0.1, 0.14, 0.01]} rad={0.01} c="#e8a33a" />;
      default: return <group rotation={[Math.PI / 2, 0, 0]}><mesh position={[0, 0, -0.06]}><torusGeometry args={[0.04, 0.012, 10, 24]} /><Mat c="#c9a24a" m={1} r={0.25} /></mesh></group>;
    }
  };
  return <Studio tt={tt} floor="wood" photo={0.2} keys={[{ t: 0, p: [0, 2.1, 1.9], l: [0, 0.1, 0], fov: 40 }, { t: 10, p: [0.4, 1.9, 1.7], l: [0, 0.1, 0], arc: 0.03 }]}>
    <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.92, 0.95, 0.06, 80]} /><Mat c="#2a2c31" m={0.4} r={0.4} /></mesh>
    {[...Array(10)].map((_, i) => { const a0 = Math.PI / 2 - (i + 1) * (Math.PI * 2 / 10), on = i < cnt, a = a0 + Math.PI / 10; const pop = on ? c01(spr(tt, 0.5 + (i + 0.0) * 0.65 + 0.65, 8, 0.5)) : 0;
      return <group key={i}>
        <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, a0]}><ringGeometry args={[0.28, 0.88, 24, 1, 0.02, Math.PI * 2 / 10 - 0.04]} /><meshStandardMaterial color={on ? (i % 2 ? "#c9822e" : "#e0a050") : "#3a3e46"} roughness={0.6} /></mesh>
        {on && <group position={[Math.cos(a) * 0.6, 0.065 + 0.0 * pop, -Math.sin(a) * 0.6]} scale={pop * 1.9}>{obj(i)}</group>}
      </group>; })}
    <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.26, 0.26, 0.03, 48]} /><Mat c="#8a7a64" r={0.8} /></mesh>
  </Studio>;
}}</Stage>;

export const HEROES_3C = { domino: H3Domino, nested: H3Nested, router: H3Router, filmglass: H3Filmglass, armreach: H3Armreach, garagepanel: H3Garagepanel, grades: H3Grades, hallfive: H3Hallfive, glasslock: H3Glasslock, safecombo: H3Safecombo, owncodes: H3Owncodes, wedge: H3Wedge, camvsswitch: H3Camvsswitch, owner: H3Owner, sunday10: H3Sunday10 };
