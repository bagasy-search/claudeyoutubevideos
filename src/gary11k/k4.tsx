// gary11k · componentes únicos 4/4: los minutos 16, 18, 19 y 29 (ventana del sótano detrás del arbusto, mi casa en plano,
// el cono del sensor en el pasillo, el generador encadenado). Render SÓLO en el farm.
import React from "react";
import { Cap, Mist } from "./caps";
import { H, cl, eio } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { PI, Txt3, pop } from "./gk";
import { AMB, CRM, DoorAl, GRN, INK, Pir, RED, V, Waves, YEL, z1 } from "./kparts";

type P = { t: number; h: H };
const lab = (tt: number, at: number, txt: string, w: number, p: V, col = INK, bg: string | undefined = YEL) => <Txt3 txt={txt} w={w} h={w * 0.15} col={col} bg={bg} p={p} r={[-1.05, 0, 0]} s={pop(tt, at)} op={cl((tt - at + 0.1) / 0.2)} />;

// 16:18 · LA VENTANA DEL SÓTANO: un arbusto tapa la ventanita a ras del piso; la tijera lo recorta en tres pasadas, aparece la ventana y se le pega la alarma.
export const HBushTrim: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.4} txt={"THE MOST HIDDEN WINDOW GETS THE ALARM"} /></>} t={t} h={h} mode="drop" floor="dark" wall="none" bg="#090b0e"
  cam={{ at: [0, 0.3, 0], az: [-0.3, 0.15], el: [0.18, 0.12], r: [1.7, 1.45], fov: 32 }}>{(tt) => {
  const cut = eio(tt, 0.8, 2.6), al = cl((tt - 3.0) / 0.3), scr = tt > 4.2 && tt < 5.4 ? 1 : 0;
  return <>
    <mesh position={[0, 0.5, -0.15]}><boxGeometry args={[2.2, 1.0, 0.1]} />{M.matte({ col: "#7b6a58" })}</mesh>
    <mesh position={[0, 0.02, 0.4]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.2, 1.1]} /><meshStandardMaterial color="#2a2118" roughness={1} /></mesh>
    <mesh position={[0.1, 0.22, -0.095]}><planeGeometry args={[0.5, 0.26]} /><meshStandardMaterial color="#141a22" metalness={0.3} roughness={0.2} /></mesh>
    <RBox s={[0.54, 0.3, 0.02]} p={[0.1, 0.22, -0.1]} r={0.005}>{M.matte({ col: "#d9d4c8", op: 0.9 })}</RBox>
    {Array.from({ length: 26 }, (_, i) => { const a = (i * 2.4) % (2 * PI), rr = 0.12 + 0.18 * ((i * 37) % 10) / 10, x = 0.1 + Math.cos(a) * rr * 1.4, y = 0.22 + Math.sin(a) * rr * 0.9 + 0.08;
      const gone = cl((cut * 3 - (i % 3)) ) * (y > 0.12 ? 1 : 0.3);
      return <mesh key={i} position={[x, Math.max(0.06, y * (1 - 0.6 * gone)), 0.05 + 0.04 * (i % 4)]} scale={z1(0.12 * (1 - 0.85 * gone))}><sphereGeometry args={[1, 9, 7]} /><meshStandardMaterial color={i % 2 ? "#23401f" : "#2f5527"} roughness={0.9} /></mesh>; })}
    <group position={[0.42, 0.24, -0.08]} scale={pop(tt, 3.0)}><RBox s={[0.05, 0.1, 0.02]} r={0.008}>{M.plastic({ col: "#f1efe8" })}</RBox></group>
    <Waves tt={tt} k={scr * al} p={[0.42, 0.26, -0.05]} s={1} />
    <Txt3 txt="TRIM IT BACK" w={0.4} h={0.07} col={GRN} glow p={[-0.6, 0.8, -0.05]} op={cl((tt - 1.0) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 18:08 · MI CASA EN PLANO: el plano de la casa se dibuja línea por línea en azul, y un punto de linterna recorre las piezas en el orden en que las pone.
export const HPlanWalk: React.FC<P> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0a1424"
  cam={{ at: [0, 0, 0], az: [0, 0.05], el: [1.25, 1.18], r: [2.3, 2.05], fov: 32 }}>{(tt) => {
  const L: number[][][] = [[[-1, 0, -0.6], [1, 0, -0.6]], [[1, 0, -0.6], [1, 0, 0.6]], [[1, 0, 0.6], [-1, 0, 0.6]], [[-1, 0, 0.6], [-1, 0, -0.6]], [[-0.2, 0, -0.6], [-0.2, 0, 0.6]], [[-0.2, 0, 0], [1, 0, 0]], [[-1, 0, 0.05], [-0.2, 0, 0.05]]];
  const R: [string, number, number][] = [["KITCHEN", -0.6, 0.32], ["FAMILY", 0.4, 0.32], ["HALL", 0.4, -0.3], ["GARAGE", -0.6, -0.3]];
  const STOP: [string, number, number][] = [["CASE", -0.6, 0.3], ["WEDGE", -0.95, 0.45], ["HALL SENSOR", 0.0, -0.3], ["SLIDER", 0.95, 0.35], ["BASEMENT", 0.6, 0.55], ["GARAGE DOOR", -0.25, -0.35], ["GATE", -1.05, -0.55], ["NIGHTSTAND", 0.8, -0.45]];
  const u = cl((tt - 1.4) / 4.6) * (STOP.length - 1), k = Math.floor(u), f = u - k, A = STOP[k], B = STOP[Math.min(k + 1, STOP.length - 1)];
  const x = lerp(A[1], B[1], eio(f, 0.2, 0.9)), z = lerp(A[2], B[2], eio(f, 0.2, 0.9));
  return <>
    {L.map((s, i) => { const d = eio(tt, 0.1 + i * 0.15, 0.4 + i * 0.15); return <mesh key={i} geometry={tubeG("pw" + i + Math.round(d * 20), [s[0], [lerp(s[0][0], s[1][0], Math.max(0.02, d)), 0, lerp(s[0][2], s[1][2], Math.max(0.02, d))]], 0.008, 4, 6)}><meshBasicMaterial color="#cfe3ff" toneMapped={false} /></mesh>; })}
    {R.map(([l, rx, rz]) => <Txt3 key={l} txt={l} w={0.3} h={0.06} col="#8fb4e8" p={[rx, 0.01, rz]} r={[-PI / 2, 0, 0]} op={cl((tt - 1.0) / 0.3)} />)}
    {STOP.map(([l, sx, sz], i) => <group key={l} position={[sx, 0.02, sz]} scale={pop(tt, 1.4 + i * (4.6 / 7))}>
      <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.035, 20]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>
      <Txt3 txt={l} w={0.28} h={0.05} col={CRM} p={[0, 0.01, 0.08]} r={[-PI / 2, 0, 0]} /></group>)}
    <mesh position={[x, 0.05, z]}><sphereGeometry args={[0.05, 16, 12]} /><meshBasicMaterial color="#fff2c0" toneMapped={false} /></mesh>
    <pointLight position={[x, 0.3, z]} intensity={2.2} distance={0.9} color="#ffd27a" />
    <Txt3 txt="MY HOUSE · ONE NIGHT · LIGHTS OFF" w={1.2} h={0.08} col={YEL} p={[0, 0.02, -0.82]} r={[-PI / 2, 0, 0]} op={cl((tt - 0.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 18:58 · EL CONO DEL PASILLO: el sensor arriba en la esquina, su cono apunta pasillo abajo; una figura cruza desde la cocina y el cono se pone rojo.
export const HHallCone: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.2} txt={"POINTED DOWN THE HALL"} /></>} t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0c0d10"
  cam={{ at: [-0.2, 0.7, 0], az: [0.22, 0.12], el: [0.16, 0.12], r: [2.75, 2.5], fov: 32 }}>{(tt) => {
  const walk = lerp(1.2, -0.4, eio(tt, 1.6, 3.8)), hit = walk < 0.6 && walk > -0.6 && tt > 1.6 ? 1 : 0, on = cl((tt - 0.6) / 0.4);
  return <>
    {[-0.35].map((z) => <mesh key={z} position={[0, 0.6, z]}><boxGeometry args={[2.6, 1.2, 0.03]} />{M.matte({ col: "#cfc6b4" })}</mesh>)}
    <Pir p={[-1.15, 1.12, 0.3]} r={[0.45, PI / 2 + 0.2, 0]} s={0.8} on={on} />
    <mesh position={[-0.45, 0.62, 0.0]} rotation={[0, 0, PI / 2 + 0.35]}><coneGeometry args={[0.32, 1.5, 24, 1, true]} /><meshBasicMaterial color={hit ? RED : GRN} transparent opacity={0.16 * on} depthWrite={false} side={2} toneMapped={false} /></mesh>
    <group position={[walk, 0, 0]}>
      <mesh position={[0, 0.85, 0]}><sphereGeometry args={[0.07, 14, 10]} />{M.matte({ col: "#2a2a2e" })}</mesh>
      <RBox s={[0.12, 0.42, 0.1]} p={[0, 0.58, 0]} r={0.04}>{M.matte({ col: "#2a2a2e" })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[0.03 * s, 0.2, 0]} rotation={[0, 0, 0.25 * s * Math.sin(tt * 9)]}><boxGeometry args={[0.04, 0.38, 0.05]} />{M.matte({ col: "#2a2a2e" })}</mesh>)}
    </group>
    <Waves tt={tt} k={hit} p={[-1.15, 0.95, 0.3]} s={0.75} />
    <Txt3 txt="HEAD HEIGHT · A BIT ABOVE" w={1.5} h={0.2} col={CRM} glow p={[-0.2, 1.36, 0.3]} op={on} />
    
  </>;
}}</Scene3D>;

// 29:45 · EL GENERADOR ENCADENADO: la cadena da tres vueltas al poste, el candado cierra; una alarma de puerta en la tapa grita cuando alguien la levanta. Afuera, lejos de la casa.
export const HChainGen: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"HEAVY CHAIN · GOOD PADLOCK · DOOR ALARM"} /></>} t={t} h={h} mode="split" floor="dark" wall="none" bg="#080a0f"
  cam={{ at: [0, 0.25, 0], az: [-0.5, -0.2], el: [0.42, 0.32], r: [1.9, 1.65], fov: 32 }}>{(tt) => {
  const wrap = eio(tt, 0.6, 2.2), lock = eio(tt, 2.3, 2.6), lift = tt > 3.6 && tt < 5.2 ? eio(tt, 3.6, 3.9) : 0, scr = lift > 0.5 ? 1 : 0;
  const pts: number[][] = []; for (let i = 0; i <= 60; i++) { const u = i / 60 * wrap; const a = u * 3 * 2 * PI; pts.push([0.55 + 0.07 * Math.cos(a), 0.1 + 0.25 * u, 0.07 * Math.sin(a)]); }
  pts.push([0.3, 0.12, 0.05], [0.12, 0.14, 0.1]);
  return <>
    <mesh position={[0.55, 0.35, 0]}><cylinderGeometry args={[0.05, 0.05, 0.7, 14]} />{M.steel({ col: "#6c7076" })}</mesh>
    <group position={[-0.1, 0, 0]}>
      <RBox s={[0.5, 0.32, 0.34]} p={[0, 0.2, 0]} r={0.03}>{M.plastic({ col: "#c93a22" })}</RBox>
      <group position={[0, 0.36, -0.17]} rotation={[-0.5 * lift, 0, 0]}><RBox s={[0.5, 0.04, 0.34]} p={[0, 0, 0.17]} r={0.015}>{M.plastic({ col: "#2a2a2a" })}</RBox></group>
      <DoorAl p={[0.26, 0.3, 0.1]} r={[0, PI / 2, 0]} s={0.6} gap={0.05 * lift} on={scr} />
      {[-0.18, 0.18].map((x) => <mesh key={x} position={[x, 0.06, 0.18]} rotation={[0, PI / 2, PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />{M.rubber({ col: "#1b1b1b" })}</mesh>)}
    </group>
    <mesh geometry={tubeG("cg" + Math.round(wrap * 30), pts, 0.012, 120, 6)}>{M.steel({ col: "#9aa0a6" })}</mesh>
    <group position={[0.12, 0.14 - 0.03 * (1 - lock), 0.1]}><RBox s={[0.07, 0.07, 0.03]} r={0.01}>{M.brass()}</RBox>
      <mesh position={[0, 0.05 + 0.02 * (1 - lock), 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.025, 0.006, 8, 16, PI]} />{M.steel()}</mesh></group>
    <Waves tt={tt} k={scr} p={[0.16, 0.32, 0.1]} s={1} />
    <Txt3 txt="OUTSIDE · FAR FROM THE HOUSE" w={0.8} h={0.07} col={AMB} p={[0, 0.75, 0]} op={cl((tt - 0.5) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 19:45 · DE NOCHE SÍ, DE DÍA NO: un arco de cielo; baja el sol y sube la luna → el hilo se tiende en la portera; vuelve el sol → el hilo se enrolla y Gary sale a ver a los vecinos.
export const HDayNight: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"YOU'RE THE ONE WALKING THROUGH IT"} /></>} t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#070a12"
  cam={{ at: [0, 0.45, 0], az: [-0.06, 0.06], el: [0.12, 0.08], r: [2.0, 1.75], fov: 32 }}>{(tt) => {
  const ph = cl((tt - 0.4) / 5.0), ang = PI * ph * 2, night = cl(Math.sin(ang) * 3) , day = 1 - night;
  const line = tt < 1.0 ? 0 : night > 0.5 ? eio(tt, 1.0, 1.5) : 1 - eio(tt, 3.2, 3.7);
  return <>
    <mesh position={[0, 0.8, -0.6]}><planeGeometry args={[3, 1.8]} /><meshBasicMaterial color={day > 0.5 ? "#3a5f8a" : "#0b1428"} /></mesh>
    <mesh position={[Math.cos(ang + PI) * -0.9, 0.45 + Math.sin(ang + PI) * -0.6, -0.55]}><sphereGeometry args={[0.09, 20, 14]} /><meshBasicMaterial color="#ffd27a" toneMapped={false} /></mesh>
    <mesh position={[Math.cos(ang) * -0.9, 0.45 + Math.sin(ang) * -0.6, -0.55]}><sphereGeometry args={[0.07, 20, 14]} /><meshBasicMaterial color="#e8eefc" toneMapped={false} /></mesh>
    {[-0.45, 0.45].map((x) => <mesh key={x} position={[x, 0.35, 0]}><boxGeometry args={[0.07, 0.7, 0.07]} />{M.wood({ base: [120, 92, 64] })}</mesh>)}
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.32 + i * 0.13, 0.35, -0.02]}><boxGeometry args={[0.1, 0.62, 0.02]} />{M.wood({ base: [140, 108, 74] })}</mesh>)}
    <mesh position={[-0.45 + 0.45 * line, 0.22, 0.06]} scale={[z1(line), 1, 1]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.9, 6]} /><meshBasicMaterial color="#f4f0e0" toneMapped={false} /></mesh>
    <Txt3 txt={night > 0.5 ? "NIGHT: TRIPWIRE UP" : "MORNING: TAKE IT DOWN"} w={0.8} h={0.08} col={night > 0.5 ? AMB : GRN} glow p={[0, 0.85, 0.05]} />
    
  </>;
}}</Scene3D>;
