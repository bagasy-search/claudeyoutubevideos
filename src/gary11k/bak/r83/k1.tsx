// gary11k · componentes únicos 1/3 (0:20 → 8:30): el teclado muerto, las tres opciones, la casa oscura y callada, lo que el
// monitoreo hace bien, la lata gris con la manteca, horas vs días, la batería hinchada, el camino de la señal, el pitido toda la
// noche, el rango de presupuesto, la nube, la tarjetita, el UPS, el último clip, grabar vs hacer ruido. Render SÓLO en el farm.
import React from "react";
import { Cap, Mist } from "./caps";
import { H, cl, eio } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { Mark, PI, Txt3, pop, roll } from "./gk";
import { AMB, AlarmCan, BLU, Bat12, Butter, CRM, Cam, Case, DoorAl, GRN, INK, Led, MiniHouse, Pir, RED, Router, V, Waves, YEL, z1 } from "./kparts";

type P = { t: number; h: H };
const lab = (tt: number, at: number, txt: string, w: number, p: V, col = INK, bg: string | undefined = AMB) => <Txt3 txt={txt} w={w} h={w * 0.15} col={col} bg={bg} p={p} r={[-1.05, 0, 0]} s={pop(tt, at)} op={cl((tt - at + 0.1) / 0.2)} />;

// 0:20 · EL TECLADO MUERTO: un dedo aprieta tres veces el teclado de la pared; la pantalla no prende, y el «beep» se tacha.
export const HDeadPad: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.9} txt={"NO LIGHT · NO BEEP"} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.62, 0], az: [0.18, -0.08], el: [0.05, 0.02], r: [1.25, 1.02], fov: 30 }}>{(tt) => {
  const pr = [1.0, 1.9, 2.8].map((a) => eio(tt, a, a + 0.12) * (1 - eio(tt, a + 0.2, a + 0.35))).reduce((a, b) => a + b, 0);
  return <>
    <RBox s={[0.5, 0.66, 0.06]} p={[0, 0.62, 0]} r={0.03}>{M.plastic({ col: "#e8e1cc" })}</RBox>
    <mesh position={[0, 0.82, 0.031]}><planeGeometry args={[0.36, 0.13]} /><meshStandardMaterial color="#0c120c" roughness={0.3} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <RBox key={i} s={[0.08, 0.05, 0.02]} p={[-0.1 + (i % 3) * 0.1, 0.66 - Math.floor(i / 3) * 0.065, 0.035]} r={0.01}>{M.plastic({ col: "#d4cbb2" })}</RBox>)}
    {/* el dedo (cilindro con uña) */}
    <group position={[0.1, 0.6, 0.12 - 0.07 * pr]} rotation={[PI / 2.2, 0, 0.2]}><mesh><capsuleGeometry args={[0.03, 0.22, 8, 16]} /><meshStandardMaterial color="#c99a7c" roughness={0.7} /></mesh></group>
    <Txt3 txt="BEEP?" w={0.4} h={0.12} col={CRM} p={[0.48, 0.92, 0.05]} s={pop(tt, 1.2)} op={cl((tt - 1.1) / 0.2)} />
    <mesh position={[0.48, 0.92, 0.06]} rotation={[0, 0, -0.3]} scale={[z1(eio(tt, 3.3, 3.6)), 1, 1]}><planeGeometry args={[0.46, 0.025]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
    
  </>;
}}</Scene3D>;

// 0:43 · LAS TRES OPCIONES Y LA CUARTA: tres pedestales (panel, cámara, timbre) suben; entra la valija negra desde abajo en el cuarto.
export const HThreeOpts: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.0} txt={"INSTEAD"} col={INK} bg={YEL} /></>} t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0c0d10"
  cam={{ at: [0, 0.38, 0], az: [-0.1, 0.1], el: [0.22, 0.16], r: [2.5, 2.2], fov: 32 }}>{(tt) => {
  const up = (i: number) => eio(tt, 0.4 + i * 0.6, 0.9 + i * 0.6), cs = eio(tt, 3.0, 3.6);
  const X = [-0.9, -0.3, 0.3, 0.9];
  return <>
    {X.map((x, i) => <RBox key={i} s={[0.42, 0.3 * (i < 3 ? up(i) : cs) + 0.001, 0.42]} p={[x, 0.15 * (i < 3 ? up(i) : cs), 0]} r={0.02}>{M.matte({ col: i === 3 ? "#3a3020" : "#2a2c31" })}</RBox>)}
    <group position={[X[0], 0.3 * up(0), 0]}><AlarmCan s={0.5} /></group>
    <group position={[X[1], 0.3 * up(1) + 0.1, 0]}><Cam s={0.9} on={1} /></group>
    <group position={[X[2], 0.3 * up(2), 0]}><RBox s={[0.1, 0.24, 0.04]} p={[0, 0.12, 0]} r={0.03}>{M.plastic({ col: "#202226" })}</RBox><mesh position={[0, 0.07, 0.021]}><circleGeometry args={[0.028, 20]} /><meshStandardMaterial color="#111" emissive={BLU} emissiveIntensity={1.4} toneMapped={false} /></mesh></group>
    <group position={[X[3], 0.3 * cs, 0]}><Case s={0.5} op={eio(tt, 3.8, 4.4)} arm={cl((tt - 4.4) / 0.3)} /></group>
    {["MONITORED", "WI-FI CAMS", "DOORBELL"].map((l, i) => <Txt3 key={l} txt={l} w={0.4} h={0.07} col={CRM} p={[X[i], 0.04, 0.3]} r={[-1.1, 0, 0]} op={up(i)} />)}
    
    <pointLight position={[X[3], 0.8, 0.4]} intensity={3 * cs} distance={1.6} color={YEL} />
  </>;
}}</Scene3D>;

// 2:11 · OSCURA Y CALLADA: una cuadra de casitas apagadas; un vúmetro baja a cero; una sola casa se prende y hace ruido, el foco se va.
export const HQuietDark: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={0.6} until={3.3} txt={"DARK + QUIET"} col={CRM} bg={"#31343c"} /><Cap tt={tt} at={3.3} txt={"NOT WORTH IT"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="dark" wall="none" bg="#06080e"
  cam={{ at: [0, 0.2, 0], az: [0.35, -0.2], el: [0.42, 0.3], r: [2.6, 2.2], fov: 32 }}>{(tt) => {
  const lit = eio(tt, 2.6, 3.0), loud = cl((tt - 3.0) / 0.3);
  return <>
    {[-1.05, -0.45, 0.15, 0.75].map((x, i) => <MiniHouse key={i} p={[x, 0, (i % 2) * 0.25 - 0.1]} r={[0, 0.2 - i * 0.1, 0]} s={1.2} lit={i === 2 ? lit : 0} col={i === 2 ? "#6b7586" : "#3f4652"} />)}
    {[-1.05, -0.45, 0.75].map((x, i) => <Txt3 key={i} txt="?" w={0.14} h={0.14} col="#ff7a5a" glow p={[x, 0.75 + 0.03 * Math.sin(tt * 3 + i), 0]} op={cl((tt - 1.0 - i * 0.3) / 0.3)} />)}
    <Waves tt={tt} k={loud} p={[0.15, 0.35, 0.2]} s={1.2} />
    
    
  </>;
}}</Scene3D>;

// 2:40 · LO QUE HACE BIEN: un panel abierto y cuatro tildes verdes que se encienden (sensores, humo/CO, persona real, descuento del seguro).
export const HGoodDay: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.0} txt={"ON A NORMAL DAY"} col={INK} bg={GRN} /></>} t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#0f0d0b"
  cam={{ at: [0.1, 0.42, 0], az: [-0.2, 0.05], el: [0.12, 0.1], r: [1.9, 1.6], fov: 32 }}>{(tt) => <>
  <AlarmCan p={[-0.55, 0.12, -0.1]} s={0.9} op={0.0} />
  <Led on={0.8} p={[-0.55, 0.62, 0.0]} r={0.015} col={GRN} />
  {["SENSORS ON DOORS", "SMOKE + CO", "A REAL PERSON", "INSURANCE DISCOUNT"].map((l, i) => { const a = 0.7 + i * 0.75; return <group key={l} position={[0.32, 0.75 - i * 0.17, 0]}>
    <Mark ok k={eio(tt, a, a + 0.3)} p={[-0.33, 0, 0]} s={0.5} />
    <Txt3 txt={l} w={0.6} h={0.08} col={CRM} p={[0.08, 0, 0]} op={cl((tt - a) / 0.25)} /></group>; })}
  
</>}</Scene3D>;

// 3:19 · LA LATA GRIS Y LA MANTECA: la puerta de la lata se abre; adentro, la batería de 12 V; al lado aterriza una barra de manteca del mismo tamaño.
export const HGrayCan: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.4} txt={"THE WHOLE BACKUP PLAN"} col={INK} bg={AMB} /></>} t={t} h={h} mode="split" floor="none" wall="none" bg="#16181b"
  cam={{ at: [0, 0.32, 0], az: [-0.32, 0.12], el: [0.16, 0.12], r: [1.55, 1.3], fov: 32 }}>{(tt) => {
  const op = eio(tt, 0.5, 1.4), bt = eio(tt, 2.2, 2.8);
  return <>
    <mesh position={[0, 0.3, -0.2]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial color="#6d6a62" roughness={1} /></mesh>
    <AlarmCan p={[-0.15, 0.02, -0.12]} s={1} op={op}><Bat12 p={[0, 0.06, -0.05]} s={1.1} /></AlarmCan>
    <group position={[0.38, 0.06 + 0.5 * (1 - bt), 0.05]}><Butter s={1.05} /></group>
    <Txt3 txt="12 V" w={0.18} h={0.07} col={CRM} p={[-0.15, 0.3, 0.06]} op={cl((tt - 1.6) / 0.3)} />
    <mesh position={[0.12, 0.09, 0.07]} scale={[z1(eio(tt, 3.0, 3.4)), 1, 1]}><planeGeometry args={[0.4, 0.008]} /><meshBasicMaterial color={YEL} toneMapped={false} /></mesh>
    
  </>;
}}</Scene3D>;

// 3:39 · HORAS, NO DÍAS: la batería sobre una regla de tiempo; un cursor corre de 0 h a 72 h y la barra se vacía antes del día 2.
export const HHoursDay: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"HOURS. NOT A WEEK."} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="wipe" floor="dark" wall="dark" bg="#0c0d10"
  cam={{ at: [0, 0.3, 0], az: [0.06, -0.06], el: [0.3, 0.24], r: [2.1, 1.85], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.2), hr = Math.round(72 * k), lvl = cl(1 - hr / 24);
  return <>
    <RBox s={[2.0, 0.02, 0.12]} p={[0, 0.01, 0.3]} r={0.005}>{M.wood({ base: [196, 160, 100] })}</RBox>
    {[0, 24, 48, 72].map((v, i) => <Txt3 key={v} txt={i ? `DAY ${i + 1}` : "0 H"} w={0.3} h={0.06} col={i ? (i === 1 ? AMB : RED) : GRN} p={[-0.95 + i * 0.633, 0.03, 0.42]} r={[-1.2, 0, 0]} />)}
    <mesh position={[-0.95 + 1.9 * k, 0.1, 0.3]}><coneGeometry args={[0.035, 0.08, 4]} /><meshBasicMaterial color={YEL} toneMapped={false} /></mesh>
    <Bat12 p={[-0.95 + 1.9 * k, 0.15, 0.0]} s={1.6} lvl={lvl} />
    <Txt3 txt={`${hr} H`} w={0.3} h={0.1} col={lvl > 0 ? GRN : RED} glow p={[-0.95 + 1.9 * k, 0.55, 0]} />
    
  </>;
}}</Scene3D>;

// 3:46 · LA HINCHADA: la batería se infla de a poco en la mano del tiempo; una etiqueta vieja escrita a mano y nadie lo sabía.
export const HSwollen: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.9} txt={"NOBODY KNEW"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.22, 0], az: [-0.5, 0.25], el: [0.25, 0.18], r: [1.05, 0.88], fov: 30 }}>{(tt) => {
  const b = eio(tt, 0.6, 3.6);
  return <>
    <Bat12 p={[0, 0, 0]} s={1.9} bulge={b} />
    <mesh position={[0, 0.16, 0.08 + 0.05 * b]} rotation={[0, 0, 0.06]}><planeGeometry args={[0.18, 0.08]} /><meshStandardMaterial map={undefined} color="#f2ead2" /></mesh>
    <Txt3 txt="INSTALLED 8 YRS AGO" w={0.17} h={0.03} col="#2a2a6a" font="Courier New" weight={700} p={[0, 0.16, 0.082 + 0.05 * b]} r={[0, 0, 0.06]} />
    <Txt3 txt={`${roll(tt, 0.6, 3.6, 0, 8)} YEARS`} w={0.3} h={0.09} col={RED} glow p={[0.38, 0.42, 0]} />
    
  </>;
}}</Scene3D>;

// 3:59 · POR DÓNDE SALE LA SEÑAL: del panel salen tres caminos (línea, router, torre); con el corte se apagan de a uno.
export const HSignalPath: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.3} txt={"NEEDS POWER TOO"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="drop" floor="dark" wall="none" bg="#080a10"
  cam={{ at: [0.2, 0.3, 0], az: [-0.15, 0.1], el: [0.5, 0.42], r: [2.4, 2.1], fov: 32 }}>{(tt) => {
  const off = (i: number) => 1 - eio(tt, 2.2 + i * 0.7, 2.5 + i * 0.7);
  const Y = [0.55, 0.0, -0.55];
  return <>
    <AlarmCan p={[-0.9, 0, 0]} s={0.6} />
    {Y.map((z, i) => <group key={i}>
      <mesh geometry={tubeG("sp" + i, [[-0.7, 0.2, 0], [-0.2, 0.25, z * 0.5], [0.5, 0.2, z]], 0.012, 30, 8)}><meshStandardMaterial color="#222" emissive={GRN} emissiveIntensity={2.5 * off(i)} toneMapped={false} /></mesh>
      {Array.from({ length: 4 }, (_, j) => { const u = ((tt * 0.9 + j / 4) % 1); return <mesh key={j} position={[lerp(-0.7, 0.5, u), 0.23, lerp(0, z, u)]}><sphereGeometry args={[0.02, 10, 8]} /><meshBasicMaterial color={GRN} transparent opacity={off(i)} toneMapped={false} /></mesh>; })}
    </group>)}
    <group position={[0.7, 0, Y[0]]}><RBox s={[0.16, 0.24, 0.08]} p={[0, 0.12, 0]} r={0.02}>{M.plastic({ col: "#d8d2c2" })}</RBox></group>
    <Router p={[0.75, 0, Y[1]]} s={0.7} on={off(1)} />
    <group position={[0.75, 0, Y[2]]}><mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.01, 0.05, 0.7, 4]} />{M.steel({ col: "#7a8088" })}</mesh><Led on={off(2)} p={[0, 0.72, 0]} r={0.02} /></group>
    {["PHONE LINE", "INTERNET", "CELL TOWER"].map((l, i) => <Txt3 key={l} txt={l} w={0.42} h={0.07} col={off(i) > 0.5 ? GRN : "#7a7f88"} p={[1.2, 0.04, Y[i]]} r={[-1.3, 0, 0]} />)}
    
  </>;
}}</Scene3D>;

// 4:48 · EL PITIDO TODA LA NOCHE: un reloj de cocina corre de 10 PM a 6 AM; cada vuelta del minutero, un «chirp» amarillo sale del teclado.
export const HChirp: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.5} txt={"EVERY MINUTE. ALL NIGHT."} col={CRM} bg={"#3a3020"} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.55, 0], az: [0.15, -0.1], el: [0.04, 0.02], r: [1.7, 1.45], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 4.4), hrs = lerp(22, 30, k), n = Math.floor(k * 480);
  return <>
    <group position={[-0.42, 0.62, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.04, 48]} />{M.porcelain({ col: "#f2eee4" })}</mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -((hrs % 12) / 12) * 2 * PI]}><mesh position={[0, 0.08, 0]}><boxGeometry args={[0.02, 0.16, 0.005]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
      <group position={[0, 0, 0.035]} rotation={[0, 0, -(hrs % 1) * 2 * PI * 8]}><mesh position={[0, 0.11, 0]}><boxGeometry args={[0.012, 0.22, 0.005]} /><meshBasicMaterial color="#c62a22" /></mesh></group>
    </group>
    <RBox s={[0.3, 0.4, 0.05]} p={[0.42, 0.6, 0]} r={0.02}>{M.plastic({ col: "#e8e1cc" })}</RBox>
    <Led on={(tt * 2) % 1 < 0.15 ? 1 : 0} p={[0.42, 0.72, 0.03]} r={0.015} col={AMB} />
    <Waves tt={tt} k={(tt * 2) % 1 < 0.4 ? 0.8 : 0.1} p={[0.42, 0.72, 0.05]} s={0.6} col={AMB} />
    <Txt3 txt={`CHIRP × ${n}`} w={0.5} h={0.1} col={AMB} glow p={[0.42, 0.3, 0.05]} />
    <Txt3 txt={hrs < 24 ? `${Math.floor(hrs) - 12} PM` : `${Math.floor(hrs) - 24 || 12} AM`} w={0.28} h={0.08} col={CRM} p={[-0.42, 0.2, 0.05]} />
    
  </>;
}}</Scene3D>;

// 5:08 · EL RANGO DEL PRESUPUESTO: una barra que se estira de «unos cientos» a $2,000; después cae una hoja de calendario por mes, sin fin.
export const HPriceBar: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"PLUS A MONTHLY BILL"} col={INK} bg={AMB} /></>} t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0d0e11"
  cam={{ at: [0, 0.35, 0], az: [-0.12, 0.08], el: [0.2, 0.15], r: [2.0, 1.75], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.5, 2.0), pages = Math.floor(cl((tt - 2.4) / 2.2) * 12);
  return <>
    <RBox s={[1.6, 0.06, 0.06]} p={[0, 0.65, 0]} r={0.02}>{M.matte({ col: "#2a2c31" })}</RBox>
    <mesh position={[-0.8 + 0.8 * lerp(0.15, 1, k), 0.65, 0.035]} scale={[z1(lerp(0.15, 1, k)), 1, 1]}><planeGeometry args={[1.6, 0.05]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>
    <Txt3 txt="A FEW HUNDRED" w={0.4} h={0.06} col={CRM} p={[-0.7, 0.75, 0]} />
    <Txt3 txt={`$${roll(tt, 0.5, 2.0, 300, 2000).toLocaleString("en-US")}`} w={0.42} h={0.12} col={AMB} glow p={[0.65, 0.8, 0]} />
    {Array.from({ length: 12 }, (_, i) => { const on = i < pages ? 1 : 0, f = cl((tt - 2.4 - i * 0.18) / 0.3); return <group key={i} position={[-0.6 + (i % 6) * 0.24, 0.02 + 0.35 * (1 - f) + (i < 6 ? 0.3 : 0.02), 0.2 + (i < 6 ? -0.05 : 0.15)]} rotation={[-1.2 + 0.4 * (1 - f), 0, 0]} scale={z1(on || f)}>
      <mesh><planeGeometry args={[0.2, 0.22]} /><meshStandardMaterial color="#f4efe2" /></mesh>
      <mesh position={[0, 0.085, 0.001]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial color="#c62a22" /></mesh>
      <Txt3 txt={["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][i]} w={0.12} h={0.05} col="#222" p={[0, 0.0, 0.002]} /></group>; })}
    
  </>;
}}</Scene3D>;

// 6:07 · LA NUBE ES LA COMPU DE OTRO: cámara → router → nube lejana; se corta la luz y la cadena se rompe eslabón por eslabón.
export const HCloud: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.9} txt={"NO ROUTER · NO CLOUD · NO BUZZ"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0a0d15"
  cam={{ at: [-0.05, 0.5, 0], az: [-0.06, 0.08], el: [0.16, 0.12], r: [2.05, 1.85], fov: 32 }}>{(tt) => {
  const br = (i: number) => eio(tt, 2.4 + i * 0.6, 2.6 + i * 0.6);
  return <>
    <Cam p={[-1.05, 0.45, 0]} r={[0, 0.6, 0]} s={1.2} on={1 - br(0)} />
    <Router p={[-0.3, 0.3, 0]} s={0.8} on={1 - br(0)} />
    <group position={[0.85, 0.85, -0.3]}>{[[-0.15, 0, 0.16], [0.08, 0.04, 0.2], [0.28, -0.02, 0.14], [0.06, 0.12, 0.15]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0]}><sphereGeometry args={[r, 20, 14]} /><meshStandardMaterial color="#c9d6ea" emissive="#6a86b4" emissiveIntensity={0.5 * (1 - br(1))} roughness={0.9} /></mesh>)}
      <Txt3 txt="SOMEBODY ELSE'S COMPUTER" w={0.9} h={0.1} col={CRM} glow p={[0.06, -0.3, 0.1]} op={cl((tt - 1.2) / 0.3)} /></group>
    <pointLight position={[0, 1.4, 1.2]} intensity={2.2} distance={4} color="#dfe8ff" />
    <Txt3 txt="CAMERA" w={0.3} h={0.08} col={CRM} glow p={[-1.05, 0.12, 0.1]} />
    <Txt3 txt="ROUTER" w={0.3} h={0.08} col={CRM} glow p={[-0.3, 0.12, 0.1]} />
    {[[-0.9, 0.42, -0.45, 0.4], [-0.15, 0.4, 0.6, 0.75]].map(([a, ya, b, yb], i) => <group key={i}>
      {Array.from({ length: 6 }, (_, j) => { const u = j / 5, x = lerp(a, b, u), y = lerp(ya, yb, u); return <mesh key={j} position={[x, y - 0.25 * br(i) * (j % 2 ? 1 : 0.4) * u, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.05, 0.012, 8, 18]} /><meshStandardMaterial color={br(i) > 0.5 ? "#555" : "#9fd0ff"} emissive="#4a9eff" emissiveIntensity={br(i) > 0.5 ? 0 : 1.6} toneMapped={false} /></mesh>; })}
    </group>)}
  </>;
}}</Scene3D>;

// 6:42 · GRABA PERO NO SUENA: una tarjetita de memoria gira y se llena (REC); al lado, un parlante tachado: cero ruido.
export const HSdCard: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"IT RECORDS. IT DOESN'T SCARE."} col={CRM} bg={"#3a3020"} /></>} t={t} h={h} mode="iris" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.25, 0], az: [-0.25, 0.2], el: [0.3, 0.24], r: [1.3, 1.1], fov: 30 }}>{(tt) => {
  const fill = eio(tt, 0.5, 3.0), mute = eio(tt, 3.0, 3.4);
  return <>
    <group position={[-0.32, 0.24, 0.05]} rotation={[0, 0.25 * Math.sin(tt * 0.9), 0]}><RBox s={[0.22, 0.3, 0.02]} r={0.01}>{M.plastic({ col: "#1b2a5a" })}</RBox>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.075 + i * 0.025, -0.12, 0.011]}><planeGeometry args={[0.016, 0.04]} />{M.brass()}</mesh>)}
      <mesh position={[0, 0.02, 0.011]} scale={[1, z1(fill), 1]}><planeGeometry args={[0.18, 0.2]} /><meshBasicMaterial color={RED} transparent opacity={0.5} toneMapped={false} /></mesh></group>
    <Txt3 txt="● REC" w={0.26} h={0.08} col={RED} glow p={[-0.32, 0.5, 0]} op={(tt * 1.5) % 1 < 0.6 ? 1 : 0.2} />
    <Txt3 txt="MEMORY CARD" w={0.36} h={0.08} col={CRM} glow p={[-0.32, 0.02, 0.12]} />
    <Txt3 txt="SPEAKER: NONE" w={0.42} h={0.08} col={RED} glow p={[0.35, 0.02, 0.12]} op={mute} />
    <group position={[0.35, 0.24, 0]}><RBox s={[0.3, 0.34, 0.08]} p={[0, 0, -0.06]} r={0.02}>{M.matte({ col: "#1d1f23" })}</RBox>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.08, 0.04, 30]} />{M.matte({ col: "#3a3d44" })}</mesh>
      {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0, 0.021 + i * 0.0001]}><ringGeometry args={[0.02 + i * 0.022, 0.026 + i * 0.022, 30]} /><meshBasicMaterial color="#111" /></mesh>)}
      <mesh rotation={[0, 0, PI / 4]} position={[0, 0, 0.1]} scale={[z1(mute), 1, 1]}><planeGeometry args={[0.42, 0.035]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh></group>
    
  </>;
}}</Scene3D>;

// 7:00 · LA CAJITA UPS: el router enchufado a una caja con batería; su barra baja en horas mientras la calle sigue a oscuras.
export const HUps: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={0.5} until={4.3} txt={"UNDER $100"} col={INK} bg={GRN} /><Cap tt={tt} at={4.3} txt={"HOURS, NOT DAYS"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0c0d10"
  cam={{ at: [0, 0.22, 0], az: [0.3, -0.1], el: [0.28, 0.2], r: [1.5, 1.25], fov: 30 }}>{(tt) => {
  const k = eio(tt, 1.0, 4.2), lvl = 1 - k;
  return <>
    <RBox s={[0.3, 0.36, 0.42]} p={[-0.25, 0.18, 0]} r={0.02}>{M.plastic({ col: "#1a1b1e" })}</RBox>
    <mesh position={[-0.25, 0.25, 0.211]}><planeGeometry args={[0.2, 0.06]} /><meshBasicMaterial color="#111" /></mesh>
    <mesh position={[-0.35 + 0.1 * lvl, 0.25, 0.212]} scale={[z1(lvl), 1, 1]}><planeGeometry args={[0.2, 0.05]} /><meshBasicMaterial color={lvl > 0.25 ? GRN : RED} toneMapped={false} /></mesh>
    <Router p={[0.3, 0, 0.05]} s={0.75} on={lvl > 0.02 ? 1 : 0} />
    <mesh geometry={tubeG("ups1", [[-0.1, 0.05, 0.1], [0.05, 0.01, 0.2], [0.2, 0.02, 0.1]], 0.008, 20, 6)}>{M.rubber({ col: "#111" })}</mesh>
    <Txt3 txt="A FEW HOURS" w={0.36} h={0.1} col={AMB} glow p={[-0.25, 0.55, 0]} />
    
    
  </>;
}}</Scene3D>;

// 7:44 · EL ÚLTIMO CLIP: una tira de clips en una línea de tiempo nocturna; justo donde cae el rayo del corte, la tira se termina.
export const HLastClip: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.9} txt={"NOTHING AFTER THIS"} col={CRM} bg={"#7a2a22"} /></>} t={t} h={h} mode="wipe" floor="none" wall="none" bg="#0b0c10"
  cam={{ at: [0, 0.35, 0], az: [0.04, -0.04], el: [0.06, 0.04], r: [2.1, 1.85], fov: 30 }}>{(tt) => {
  const run = eio(tt, 0.4, 3.6), cut = 0.42;
  return <>
    <RBox s={[2.0, 0.04, 0.02]} p={[0, 0.2, 0]} r={0.01}>{M.matte({ col: "#3a3d44" })}</RBox>
    {Array.from({ length: 14 }, (_, i) => { const x = -0.95 + i * 0.145, u = i / 13; const show = u < cut ? cl((run - u) * 8) : 0;
      return <group key={i} position={[x, 0.35, 0]} scale={z1(show)}><RBox s={[0.12, 0.09, 0.012]} r={0.01}>{M.matte({ col: "#2a3b55" })}</RBox><mesh position={[0, 0, 0.007]}><planeGeometry args={[0.1, 0.07]} /><meshBasicMaterial color="#5a7aa8" /></mesh></group>; })}
    <mesh position={[-0.95 + 1.9 * cut, 0.42, 0.02]} rotation={[0, 0, 0.3]} scale={z1(cl((run - cut) * 6))}><planeGeometry args={[0.05, 0.4]} /><meshBasicMaterial color={YEL} toneMapped={false} /></mesh>
    <Txt3 txt="POWER DROPS" w={0.4} h={0.07} col={YEL} glow p={[-0.95 + 1.9 * cut, 0.7, 0]} op={cl((run - cut) * 6)} />
    {["6 PM", "MIDNIGHT", "6 AM"].map((l, i) => <Txt3 key={l} txt={l} w={0.26} h={0.06} col="#9aa0a8" p={[-0.9 + i * 0.9, 0.1, 0]} />)}
    
  </>;
}}</Scene3D>;

// 8:01 · GRABAR O HACER RUIDO: una balanza; en un plato una cámara, en el otro la valija; la valija pesa más y suena.
export const HNoiseWin: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.8} txt={"NOISE"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.45, 0], az: [-0.12, 0.12], el: [0.12, 0.1], r: [2.0, 1.7], fov: 30 }}>{(tt) => {
  const tip = lerp(0, -0.22, eio(tt, 1.6, 2.6));
  return <>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.03, 0.06, 0.6, 16]} />{M.brass({ col: "#8a6a3a" })}</mesh>
    <group position={[0, 0.62, 0]} rotation={[0, 0, tip]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.015, 0.015, 1.3, 10]} />{M.brass({ col: "#8a6a3a" })}</mesh>
      {[-0.6, 0.6].map((x, i) => <group key={x} position={[x, 0, 0]} rotation={[0, 0, -tip]}>
        <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.22, 0.22, 0.02, 30]} />{M.brass({ col: "#a07a40" })}</mesh>
        {i === 0 ? <Cam p={[0, -0.08, 0]} s={0.7} on={0.3} /> : <Case p={[0, -0.17, 0]} s={0.42} op={0.5} arm={1} />}
      </group>)}
    </group>
    <Waves tt={tt} k={cl((tt - 2.6) / 0.3)} p={[0.6 * Math.cos(tip), 0.62 + 0.6 * Math.sin(tip) + 0.1, 0.2]} s={1.2} />
    <Txt3 txt="A RECORDING" w={0.42} h={0.07} col={CRM} p={[-0.6, 0.12, 0.3]} />
    
  </>;
}}</Scene3D>;
