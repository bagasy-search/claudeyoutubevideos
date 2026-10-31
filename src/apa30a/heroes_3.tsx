// apa30a · componentes únicos, minutos 20-33 (soltarlo lejos, el aceite, la malla, el riego, la semana, las preguntas y el cierre).
import React from "react";
import * as THREE from "three";
import { H, Tag, AMB, RED, GRN } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { SoilBlock, TunnelCut, Ridge, Mole, Worm, Grub, Can, Board, Flag, Jug, MeshPanel, Sign, Mound, Boot, grassT, soilT } from "./farmkit";

const PI = Math.PI;

// ---- 20:40 · UNAS MILLAS: el mapa de la zona en papel; la camioneta sigue la ruta de tierra y el cuentakilómetros sube a 3 ----
export const HFewMiles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#15110c" key1={[-0.9, 1.6, 1.0]}
  cam={{ at: [0, 0, 0], az: [-0.25, 0.2], el: [1.0, 0.85], r: [1.25, 1.05], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={140} txt="PAST A CREEK OR A ROAD" col={AMB} />}>{(tt) => {
  const k = eio(tt, 0.6, 3.4), route = [[-0.5, 0.01, 0.25], [-0.25, 0.01, 0.1], [-0.05, 0.01, 0.18], [0.15, 0.01, -0.05], [0.42, 0.01, -0.2]];
  const cur = new THREE.CatmullRomCurve3(route.map((q) => new THREE.Vector3(q[0], q[1], q[2]))), p = cur.getPointAt(k), tg = cur.getTangentAt(k);
  const miles = (3 * k).toFixed(1);
  const MAP = tex.text("milesmap", 512, 360, (g) => { g.fillStyle = "#e8dcc0"; g.fillRect(0, 0, 512, 360); g.strokeStyle = "#5f9bc8"; g.lineWidth = 9; g.beginPath(); g.moveTo(330, 0); g.bezierCurveTo(300, 120, 380, 220, 340, 360); g.stroke();
    g.fillStyle = "#7da35a"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(380 + 120 * rn(i, 1), 300 * rn(i, 2) + 20, 9, 0, 7); g.fill(); } g.fillStyle = "#8a5a3a"; g.fillRect(40, 230, 34, 26); g.fillStyle = "#2a1d12"; g.font = "700 22px Georgia"; g.fillText("HOME", 30, 290); });
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.003, 0]}><planeGeometry args={[1.3, 0.9]} /><meshStandardMaterial map={MAP} roughness={0.95} /></mesh>
    <mesh geometry={tubeG("milesroute", route, 0.006, 60, 6)}><meshStandardMaterial color="#8a5a3a" /></mesh>
    <mesh geometry={tubeG("milesdone" + Math.round(k * 40), route.slice(0, 2 + Math.floor(k * 3)), 0.009, 60, 6)}>{M.glow({ col: AMB, op: 0.8 * cl(k * 3) })}</mesh>
    <group position={[p.x, 0.035, p.z]} rotation={[0, Math.atan2(tg.x, tg.z) - PI / 2, 0]}>
      <RBox s={[0.11, 0.04, 0.055]} p={[0, 0, 0]} r={0.01}><meshStandardMaterial color="#9a2f25" roughness={0.45} /></RBox>
      <RBox s={[0.045, 0.035, 0.05]} p={[0.025, 0.035, 0]} r={0.008}><meshStandardMaterial color="#9a2f25" roughness={0.45} /></RBox>
      {[-0.035, 0.035].map((x) => [-0.03, 0.03].map((z) => <mesh key={x + "" + z} position={[x, -0.02, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.013, 0.013, 0.01, 12]} /><meshStandardMaterial color="#111" /></mesh>))}
    </group>
    <group position={[-0.38, 0.12, -0.32]} rotation={[-0.5, 0, 0]}>
      <RBox s={[0.34, 0.12, 0.03]} r={0.015}><meshStandardMaterial color="#1b1612" roughness={0.4} /></RBox>
      <mesh position={[0, 0, 0.017]}><planeGeometry args={[0.3, 0.09]} /><meshBasicMaterial map={tex.text("odo" + miles, 300, 90, (g) => { g.fillStyle = "#0e0b08"; g.fillRect(0, 0, 300, 90); g.fillStyle = "#ffcf7a"; g.font = "800 58px Arial"; g.fillText(miles + " mi", 40, 66); })} toneMapped={false} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 21:35 · EL BIDÓN DEL ACEITE: dos cucharadas de aceite de ricino y una de jabón caen en el bidón de agua; se agita y se pone lechoso ----
export const HCastorJug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" key1={[-1.0, 1.5, 1.2]}
  cam={{ at: [0, 0.16, 0], az: [-0.3, 0.25], el: [0.2, 0.15], r: [1.0, 0.85], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={0.8} x={500} y={170} txt="2 TBSP CASTOR OIL" col={AMB} /><Tag tt={tt} at={1.9} x={1420} y={170} txt="1 TBSP DISH SOAP" col="#8fd6ff" /><Tag tt={tt} at={3.4} x={960} y={950} txt="1 GALLON WATER · SHAKE" col={GRN} /></>}>{(tt) => {
  const sp1 = eio(tt, 0.5, 1.2) * (1 - eio(tt, 1.5, 1.9)), sp2 = eio(tt, 1.7, 2.3) * (1 - eio(tt, 2.6, 3.0)), shake = tt > 3.0 && tt < 4.0 ? Math.sin(tt * 30) * 0.08 : 0;
  const spoon = (k: number, x: number, col: string) => <group position={[x * (1 - k) + 0.03 * k, 0.5 - 0.05 * k, 0]} rotation={[0, 0, -1.6 * cl((k - 0.7) * 3.3)]}>
    <mesh position={[-0.1, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />{M.steel()}</mesh>
    <mesh scale={[0.04, 0.012, 0.028]}><sphereGeometry args={[1, 16, 10, 0, 2 * PI, 0, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.004, 0]} scale={[0.034, 0.004, 0.022]}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color={col} roughness={0.1} clearcoat={1} /></mesh>
  </group>;
  return <>
    <group rotation={[0, 0, shake]}><Jug p={[0, 0, 0]} s={1.2} fill={0.75} milky={eio(tt, 2.9, 4.0)} /></group>
    {sp1 > 0 && spoon(sp1, -0.35, "#e9cf72")}
    {sp2 > 0 && spoon(sp2, 0.35, "#7fd0e8")}
  </>;
}}</Scene3D>;

// ---- 22:30 · DEL MEDIO HACIA AFUERA: vista desde arriba del patio; las manchas regadas avanzan del centro al cerco y el topo sale por la tranquera ----
export const HPushOut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#11140d"
  cam={{ at: [0, 0, 0], az: [0.0, 0.0], el: [1.35, 1.25], r: [1.6, 1.4], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.4} x={960} y={1000} txt="MIDDLE FIRST · WORK OUT TO THE FENCE" col={GRN} />}>{(tt) => {
  const k = eio(tt, 0.4, 3.2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.4]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    {Array.from({ length: 22 }, (_, i) => { const x = -0.9 + i * 0.086; return [-0.58, 0.58].map((z) => <mesh key={i + "" + z} position={[x, 0.04, z]}><boxGeometry args={[0.02, 0.08, 0.02]} /><meshStandardMaterial color="#6b4a2c" /></mesh>); })}
    {[0, 1, 2, 3].map((ring) => { const on = cl((k * 4 - ring) * 1.5); return <mesh key={ring} position={[0, 0.002 + ring * 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[ring * 0.2, ring * 0.2 + 0.18, 64]} /><meshStandardMaterial color="#d6c27a" transparent opacity={0.45 * on} roughness={0.3} /></mesh>; })}
    {Array.from({ length: 8 }, (_, i) => { const a = i * PI / 4, r = 0.1 + 0.6 * k; return <mesh key={i} position={[Math.cos(a) * r, 0.01, Math.sin(a) * r * 0.65]} rotation={[-PI / 2, 0, -a]}><coneGeometry args={[0.03, 0.08, 3]} />{M.glow({ col: AMB, op: 0.85 })}</mesh>; })}
    <group position={[lerp(0.2, 1.05, eio(tt, 1.0, 3.6)), 0.02, lerp(0.05, -0.1, eio(tt, 1.0, 3.6))]} rotation={[0, 0, 0]}><Mole s={0.7} paddle={tt * 1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 23:45 · LA MALLA EN L: corte de la zanja junto al cantero; la malla baja y dobla hacia afuera; el topo llega, la toca y dobla ----
export const HMeshL: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.15, 0], az: [0.3, 0.05], el: [0.15, 0.1], r: [1.15, 0.95], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={1.0} x={560} y={140} txt="2 FT DOWN" col={AMB} /><Tag tt={tt} at={1.8} x={1300} y={980} txt="BENT OUT IN AN L" col={GRN} /></>}>{(tt) => {
  const drop = eio(tt, 0.3, 1.2), mx = tt < 2.4 ? lerp(0.6, 0.12, eio(tt, 1.4, 2.4)) : 0.12 + 0.15 * eio(tt, 2.8, 3.8);
  return <>
    <SoilBlock w={1.4} h={0.6} d={0.6} p={[0, 0, -0.3]} />
    {[-0.5, -0.38, -0.26, -0.14].map((x, i) => <mesh key={i} position={[x, 0.1, 0.1]}><coneGeometry args={[0.03, 0.09, 5]} /><meshStandardMaterial color="#3f7a32" /></mesh>)}
    <group position={[0, 0.2 - 0.2 * drop, 0.005]}>
      <MeshPanel w={0.012} h={0.5} p={[-0.05, -0.25, 0]} cell={14} />
      <mesh position={[-0.05, -0.25, 0]}><boxGeometry args={[0.006, 0.5, 0.008]} />{M.steel()}</mesh>
      <mesh position={[0.05, -0.5, 0]}><boxGeometry args={[0.2, 0.006, 0.008]} />{M.steel()}</mesh>
    </group>
    <TunnelCut pts={[[0.7, -0.3], [0.35, -0.29], [0.14, -0.3]]} z={0.002} r={0.028} />
    {tt > 2.4 && <TunnelCut pts={[[0.14, -0.3], [0.22, -0.4], [0.3, -0.45]]} z={0.002} r={0.026} />}
    <group position={[mx, tt > 2.6 ? -0.3 - 0.13 * eio(tt, 2.8, 3.8) : -0.3, 0.01]} rotation={[0, tt < 2.4 ? -PI / 2 : PI / 2, tt > 2.6 ? -0.6 : 0]}><Mole s={0.6} paddle={tt * 1.3} /></group>
  </>;
}}</Scene3D>;

// ---- 24:40 · REGAR HONDO: dos columnas de suelo; la de riego cortito tiene las lombrices arriba (y el topo cerca del pasto), la de riego hondo las manda abajo ----
export const HWaterDeep: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.15, 0], az: [0.15, -0.15], el: [0.12, 0.1], r: [1.25, 1.05], fov: 30 }}
  over={(tt) => <><Tag tt={tt} at={0.8} x={560} y={140} txt="EVERY DAY, A LITTLE" col={RED} /><Tag tt={tt} at={1.8} x={1360} y={140} txt="DEEP, LESS OFTEN" col={GRN} /></>}>{(tt) => {
  const k = eio(tt, 1.2, 3.4);
  return <>{[-1, 1].map((sd) => <group key={sd} position={[sd * 0.33, 0, 0]}>
    <SoilBlock w={0.5} h={0.7} d={0.3} p={[0, 0, -0.15]} />
    <mesh position={[0, sd < 0 ? -0.04 : -0.04 - 0.25 * k, 0.003]}><planeGeometry args={[0.5, sd < 0 ? 0.08 : 0.08 + 0.5 * k]} /><meshBasicMaterial color="#3f8fc8" transparent opacity={0.28} depthWrite={false} /></mesh>
    {[0, 1, 2, 3].map((i) => <Worm key={i} id={"wd" + sd + i} p={[-0.15 + i * 0.1, sd < 0 ? -0.06 - 0.02 * i : lerp(-0.06 - 0.02 * i, -0.42 - 0.04 * i, k), 0.01]} len={0.09} ph={tt * 2 + i} s={0.9} />)}
    {sd < 0 && <group position={[0.1, -0.09, 0.012]} rotation={[0, -PI / 2, 0]}><Mole s={0.55} paddle={tt * 1.4} /></group>}
  </group>)}</>;
}}</Scene3D>;

// ---- 25:35 · LA SEMANA EN EL ALMANAQUE: el almanaque de pared; las hojas de los días caen de a una y en cada día aparece la tarea ----
const DAYS = [["DAY 1", "walk & press"], ["DAY 2", "pick live runs"], ["DAY 3", "set 2 cans"], ["DAY 4", "check · move"], ["DAY 5", "castor soak"], ["DAY 7", "mesh the bed"]];
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="wood" key1={[-1.1, 1.4, 1.3]}
  cam={{ at: [0, 0.52, -1.5], az: [0.25, -0.2], el: [0.04, 0.08], r: [1.25, 1.05], fov: 30 }}>{(tt) => {
  const step = Math.min(DAYS.length - 1, Math.floor(cl((tt - 0.3) / 3.6) * DAYS.length));
  const pg = (i: number) => tex.text("cal" + i, 360, 420, (g) => { g.fillStyle = "#f6f0e2"; g.fillRect(0, 0, 360, 420); g.fillStyle = "#9a2f25"; g.fillRect(0, 0, 360, 90);
    g.fillStyle = "#fff"; g.font = "800 52px Georgia"; g.fillText(DAYS[i][0], 90, 64); g.fillStyle = "#2a1d12"; g.font = "700 38px Arial"; g.fillText(DAYS[i][1], 30, 250); });
  return <group position={[0, 0.5, -1.5]}>
    <mesh position={[0, 0.25, 0.01]}><cylinderGeometry args={[0.012, 0.012, 0.03, 10]} />{M.steel()}</mesh>
    <mesh position={[0, 0, 0.02]}><planeGeometry args={[0.36, 0.42]} /><meshStandardMaterial map={pg(Math.min(step + 1, DAYS.length - 1))} roughness={0.9} /></mesh>
    {(() => { const f = cl(((tt - 0.3) / 3.6 * DAYS.length) - step); return <group position={[0, 0.21, 0.03]} rotation={[-1.4 * eio(f, 0.6, 1), 0, 0.3 * eio(f, 0.6, 1)]}><mesh position={[0, -0.21 - 0.3 * eio(f, 0.7, 1), 0.2 * eio(f, 0.7, 1)]}><planeGeometry args={[0.36, 0.42]} /><meshStandardMaterial map={pg(step)} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>; })()}
  </group>;
}}</Scene3D>;

// ---- 26:20 · EL MISMO DÍA: la veleta con el gallo gira, sale el sol y el balde con el topo ya va camino a la camioneta ----
export const HSameMorning: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#1a1410" key1={[-1.0, 1.0, 1.4]}
  cam={{ at: [0, 0.2, 0], az: [-0.35, 0.3], el: [0.15, 0.1], r: [1.4, 1.2], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={2.8} x={960} y={140} txt="CAUGHT AT DAWN · RELEASED BY NOON" col={AMB} />}>{(tt) => {
  const sun = eio(tt, 0.3, 2.8), turn = phys(tt, 0.5, 4, 0.4);
  return <>
    <mesh position={[0, -0.02, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <mesh position={[0.6, -0.25 + 0.65 * sun, -1.0]}><sphereGeometry args={[0.13, 32, 20]} />{M.glow({ col: "#ffb45a" })}</mesh>
    <pointLight position={[0.6, 0.4 * sun, -0.6]} intensity={1.2 * sun} distance={3} color="#ffcf8a" />
    <group position={[-0.35, 0, 0]}>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.008, 0.008, 0.6, 8]} />{M.steel({ col: "#3a3a3a" })}</mesh>
      <group position={[0, 0.56, 0]} rotation={[0, 2.4 * turn, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.3, 6]} />{M.steel({ col: "#3a3a3a" })}</mesh>
        <mesh position={[0.02, 0.06, 0]} scale={[0.07, 0.06, 0.006]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[0.08, 0.1, 0]} scale={[0.02, 0.04, 0.005]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[-0.05, 0.08, 0]} rotation={[0, 0, 0.6]} scale={[0.035, 0.05, 0.005]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} /></mesh>
      </group>
    </group>
    <group position={[lerp(0.0, 0.45, eio(tt, 2.0, 4.0)), 0.06, 0.2]}>
      <mesh><cylinderGeometry args={[0.07, 0.055, 0.12, 24, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, -0.059, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.055, 24]} />{M.steel()}</mesh>
      <group position={[0, -0.03, 0]}><Mole s={0.5} paddle={tt} /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 27:30 · CADA TÚNEL ES UN CAÑO: corte del cantero; la lluvia se va por los túneles hasta abajo y las raíces bajan siguiéndolos ----
export const HAirPipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.15, 0], az: [-0.2, 0.15], el: [0.12, 0.08], r: [1.25, 1.05], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.2} x={960} y={140} txt="HE AIRS AND DRAINS YOUR SOIL" col={GRN} />}>{(tt) => {
  const w = eio(tt, 0.5, 2.6), roots = eio(tt, 1.8, 4.0);
  const tun = [[[-0.6, -0.08], [-0.3, -0.18], [0, -0.3], [0.3, -0.4], [0.6, -0.48]], [[-0.1, -0.02], [-0.05, -0.15], [0.0, -0.3]]];
  return <>
    <SoilBlock w={1.4} h={0.6} d={0.6} p={[0, 0, -0.3]} />
    {tun.map((p, i) => <TunnelCut key={i} pts={p} z={0.002} r={0.022} />)}
    {tun.map((p, i) => <TunnelCut key={"w" + i} pts={p} z={0.003} r={0.016} k={w} col="#3f8fc8" />)}
    {[-0.45, -0.15, 0.2, 0.45].map((x, i) => <group key={i}>
      <mesh position={[x, 0.07, 0.02]}><coneGeometry args={[0.035, 0.11, 6]} /><meshStandardMaterial color="#3f7a32" /></mesh>
      <mesh geometry={tubeG("root" + i + Math.round(roots * 20), [[x, 0, 0.004], [x + 0.03, -0.1 * (0.3 + roots), 0.004], [x - 0.02, -0.25 * (0.2 + roots), 0.004]], 0.005, 20, 5)}><meshStandardMaterial color="#e8d8b0" roughness={0.8} /></mesh>
    </group>)}
    {Array.from({ length: 14 }, (_, i) => { const ph = ((tt * 1.3 + rn(i, 1)) % 1); return tt < 2.6 && <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.2, 0.5 - 0.48 * ph, 0.05]}><capsuleGeometry args={[0.004, 0.025, 4, 6]} />{M.water({ op: 0.8 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 28:10 · DÓNDE TRAZO LA LÍNEA: el plano del campo; alrededor de la casa la zona de trampa en ámbar, el potrero en verde (ahí se queda) ----
export const HFenceDeal: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#11140d"
  cam={{ at: [0, 0, 0], az: [-0.15, 0.15], el: [1.15, 1.0], r: [1.7, 1.45], fov: 32 }}
  over={(tt) => <><Tag tt={tt} at={1.2} x={600} y={180} txt="AROUND THE HOUSE · I TRAP" col={AMB} /><Tag tt={tt} at={2.4} x={1350} y={980} txt="THE PASTURE · HE STAYS" col={GRN} /></>}>{(tt) => {
  const a = eio(tt, 0.8, 1.6), b = eio(tt, 2.0, 2.8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <group position={[-0.55, 0, -0.1]}>
      <RBox s={[0.22, 0.14, 0.18]} p={[0, 0.07, 0]} r={0.008}><meshStandardMaterial color="#e9e2d2" /></RBox>
      <mesh position={[0, 0.17, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.18, 0.1, 4]} /><meshStandardMaterial color="#7a2f25" /></mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.36 * a, 48]} /><meshBasicMaterial color={AMB} transparent opacity={0.28} depthWrite={false} /></mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.35 * a, 0.36 * a, 64]} />{M.glow({ col: AMB })}</mesh>
    </group>
    <mesh position={[0.45, 0.003, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.0 * b, 1.0]} /><meshBasicMaterial color={GRN} transparent opacity={0.16} depthWrite={false} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <Ridge key={i} id={"fd" + i} pts={[[0.1 + i * 0.13, 0.002, -0.3 + 0.1 * Math.sin(i)], [0.16 + i * 0.13, 0.002, 0], [0.12 + i * 0.13, 0.002, 0.35]]} r={0.022} />)}
    {[0, 1, 2].map((i) => <Mound key={i} p={[0.3 + i * 0.25, 0, 0.45 - i * 0.2]} s={0.5} />)}
  </>;
}}</Scene3D>;

// ---- 29:15 · LO QUE CAE EN LA LATA: la lata en el pasto se inclina; salen una musaraña y un sapo, cada uno por su lado ----
export const HBycatch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#11140d"
  cam={{ at: [0, 0.03, 0], az: [0.45, 0.15], el: [0.35, 0.25], r: [0.95, 0.8], fov: 30 }}
  over={(tt) => <Tag tt={tt} at={3.0} x={960} y={140} txt="LET THEM ALL GO" col={GRN} />}>{(tt) => {
  const tip = eio(tt, 0.4, 1.2), s1 = eio(tt, 1.2, 2.6), s2 = eio(tt, 1.9, 3.6);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2, 1.4]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <group position={[0, 0.0, 0]} rotation={[0, 0, PI / 2 * tip]}><group position={[0, 0, 0]}><Can r={0.08} h={0.19} label={false} /></group></group>
    <group position={[-0.08 - 0.45 * s1, 0.02, 0.05 + 0.15 * s1]} rotation={[0, PI * 0.8, 0]}>
      <mesh scale={[0.05, 0.025, 0.025]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#5a4a3e" roughness={0.9} /></mesh>
      <mesh position={[0.055, 0, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.012, 0.04, 8]} /><meshStandardMaterial color="#7a6a5e" /></mesh>
    </group>
    <group position={[-0.1 - 0.15 * s2, 0.025 + 0.06 * Math.abs(Math.sin(s2 * PI * 3)), -0.05 - 0.35 * s2]}>
      <mesh scale={[0.045, 0.03, 0.05]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#7a6a3a" roughness={0.7} /></mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.022, 0.022, 0.03]}><sphereGeometry args={[0.009, 10, 8]} /><meshStandardMaterial color="#c9a23a" /></mesh>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 30:05 · LAS ESTACIONES: el mismo corte en cuatro tiempos; primavera y otoño el túnel va arriba, verano e invierno se hunde ----
export const HSeasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110c"
  cam={{ at: [0, -0.15, 0], az: [0.0, 0.0], el: [0.1, 0.08], r: [1.5, 1.3], fov: 30 }}>{(tt) => {
  const S = [["SPRING", -0.06, "#7fc06a"], ["SUMMER", -0.4, "#e8b23a"], ["FALL", -0.07, "#d0743a"], ["WINTER", -0.45, "#9fc8e8"]] as const;
  return <>{S.map(([nm, d, col], i) => { const on = cl((tt - 0.3 - i * 0.6) * 2.5);
    return <group key={nm} position={[-0.54 + i * 0.36, 0, 0]} scale={[1, Math.max(0.01, on), 1]}>
      <SoilBlock w={0.33} h={0.6} d={0.25} p={[0, 0, -0.125]} />
      <TunnelCut pts={[[-0.16, d], [0, d - 0.01], [0.16, d]]} z={0.002} r={0.022} />
      <Sign id={"seas2" + i} txt={nm} w={0.31} h={0.1} p={[0, 0.11, 0.05]} col={col} />
    </group>; })}</>;
}}</Scene3D>;

// ---- 30:50 · EL VECINO: dos patios lado a lado; si sólo tratás uno, el topo cruza el alambrado; si los dos, se va al monte ----
export const HNeighbor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#11140d"
  cam={{ at: [0, 0, 0], az: [0.2, -0.15], el: [1.1, 0.95], r: [1.6, 1.35], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={tt < 2.3 ? 0.6 : 2.3} x={960} y={140} txt={tt < 2.3 ? "ONE YARD · HE HOPS THE FENCE" : "TWO YARDS · HE LEAVES"} col={tt < 2.3 ? RED : GRN} />}>{(tt) => {
  const both = eio(tt, 2.0, 2.6), m1 = tt < 2.3 ? eio(tt, 0.6, 2.0) : 0, m2 = eio(tt, 2.6, 4.0);
  const mx = tt < 2.3 ? lerp(-0.3, 0.35, m1) : lerp(0.35, 0.35, m2), mz = tt < 2.3 ? 0 : lerp(0, -0.75, m2);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.6]} /><meshStandardMaterial map={grassT()} roughness={0.95} /></mesh>
    <mesh position={[-0.45, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 1.0]} /><meshStandardMaterial color="#d6c27a" transparent opacity={0.4} /></mesh>
    <mesh position={[0.45, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.8, 1.0]} /><meshStandardMaterial color="#d6c27a" transparent opacity={0.4 * both} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0, 0.04, -0.5 + i * 0.09]}><boxGeometry args={[0.018, 0.08, 0.018]} /><meshStandardMaterial color="#6b4a2c" /></mesh>)}
    {Array.from({ length: 14 }, (_, i) => <mesh key={"t" + i} position={[-0.9 + i * 0.14, 0.09, -0.72 - 0.04 * rn(i, 1)]}><coneGeometry args={[0.07, 0.2, 6]} /><meshStandardMaterial color="#2f5a2a" /></mesh>)}
    <group position={[mx, 0.02, mz]} rotation={[0, tt < 2.3 ? 0 : PI / 2, 0]}><Mole s={0.7} paddle={tt * 1.4} /></group>
  </>;
}}</Scene3D>;

// ---- 31:40 · LA PÁGINA DEL ALMANAQUE: una hoja del almanaque se escribe sola, renglón por renglón, con todo el método ----
const PAGE = ["Press the ridges · flag the live ones", "Can flush with the tunnel floor", "Board on top · dark and dry", "Check at noon, supper and dark", "Release miles away, same morning", "Castor soak · mesh the beds"];
export const HAlmanacPage: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#15110c" key1={[-0.8, 1.6, 1.0]}
  cam={{ at: [0, 0.01, 0], az: [-0.15, 0.1], el: [1.05, 0.95], r: [0.95, 0.82], fov: 30 }}>{(tt) => {
  const n = Math.floor(cl((tt - 0.4) / 3.6) * PAGE.length * 40);
  const T = tex.text("alm" + n, 640, 820, (g) => { g.fillStyle = "#efe3c4"; g.fillRect(0, 0, 640, 820); g.strokeStyle = "rgba(120,80,40,.35)"; g.lineWidth = 3; g.strokeRect(20, 20, 600, 780);
    g.fillStyle = "#5a2a1a"; g.font = "800 46px Georgia"; g.fillText("THE MOLE · ONE PAGE", 80, 100); g.fillStyle = "#2a1d12"; g.font = "italic 32px Georgia";
    let left = n; PAGE.forEach((l, i) => { const c = Math.max(0, Math.min(l.length, left)); left -= 40; if (c > 0) g.fillText((i + 1) + ". " + l.slice(0, c), 50, 200 + i * 100); }); });
  return <>
    <mesh rotation={[-PI / 2, 0, 0.04]} position={[0, 0.004, 0]}><planeGeometry args={[0.5, 0.64]} /><meshStandardMaterial map={T} roughness={0.95} /></mesh>
    <group position={[0.2, 0.03, 0.05]} rotation={[0.2, 0.6, -1.2]}><mesh><cylinderGeometry args={[0.006, 0.006, 0.18, 8]} /><meshStandardMaterial color="#c9a23a" /></mesh></group>
  </>;
}}</Scene3D>;

// ---- 32:30 · EL ESTANTE DE LO QUE NO SIRVE: veneno, chicle, manguera, naftalina y estacas caen al estante del granero y se tachan ----
const SHELF = ["POISON", "GUM", "HOSE", "MOTHBALLS", "STAKES"];
export const HShelf: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" key1={[-1.1, 1.5, 1.2]}
  cam={{ at: [0, 0.38, -1.4], az: [-0.2, 0.15], el: [0.1, 0.12], r: [1.55, 1.35], fov: 32 }}
  over={(tt) => <Tag tt={tt} at={3.6} x={960} y={950} txt="CAN · BOARD · SHOVEL" col={GRN} />}>{(tt) => <group position={[0, 0.3, -1.45]}>
  <mesh position={[0, 0, 0.1]}><boxGeometry args={[1.7, 0.03, 0.22]} />{M.wood({ base: [120, 80, 45] })}</mesh>
  {SHELF.map((w, i) => { const at = 0.4 + i * 0.5, f = phys(tt, at, 7, 0.4), x = -0.64 + i * 0.32, x2 = cl((tt - 2.9 - i * 0.12) * 4);
    const obj = [<mesh key="p" position={[0, 0.06, 0]}><boxGeometry args={[0.08, 0.12, 0.06]} /><meshStandardMaterial color="#c22a26" /></mesh>,
      <mesh key="g" position={[0, 0.02, 0]} scale={[0.06, 0.012, 0.03]}><boxGeometry /><meshStandardMaterial color="#e86aa8" /></mesh>,
      <mesh key="h" position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.014, 8, 24]} />{M.rubber({ col: "#2e7d32" })}</mesh>,
      <group key="m">{[0, 1, 2, 3].map((k) => <mesh key={k} position={[-0.03 + k * 0.02, 0.012, 0.01 * (k % 2)]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#f4f4f0" /></mesh>)}</group>,
      <mesh key="s" position={[0, 0.07, 0]}><cylinderGeometry args={[0.018, 0.018, 0.14, 12]} />{M.plastic({ col: "#2b3a2b" })}</mesh>][i];
    return <group key={w} position={[x, 0.015 + 0.6 * (1 - cl(f)), 0.1]}>
      {obj}
      <Sign id={"shelf2" + i} txt={w} w={0.29} h={0.06} p={[0, -0.06, 0.12]} />
      {x2 > 0 && <mesh position={[0, 0.06, 0.08]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.2 * x2, 0.012, 0.004]} />{M.glow({ col: RED })}</mesh>}
    </group>; })}
</group>}</Scene3D>;
export const _u3 = { Grub, Board, Flag, Boot, Mound };
