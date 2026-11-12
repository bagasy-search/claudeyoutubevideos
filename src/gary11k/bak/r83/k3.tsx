// gary11k · componentes únicos 3/3 (21:20 → 32:50): la cinta en la tapa, la bolsa de repuestos, el mes que se tilda, los relojes que
// cambian, los 5 errores, lo que NO compraría, las preguntas, lo que el kit NO hace, el resumen y la votación. Y la CTA: la landing
// REAL como una pantalla apoyada en la mesa de la cocina de noche, con el QR impreso y la valija abierta (foto 18). Render SÓLO en el farm.
import React from "react";
import { Cap, Mist } from "./caps";
import { H, cl, eio } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG, useImg } from "./h3d";
import { Mark, PI, Txt3, pop, roll } from "./gk";
import { AMB, BLU, CRM, Cam, Case, DoorAl, DoorF, Fob, GRN, INK, Led, MiniHouse, Pir, RED, Trip, V, Waves, Wedge, YEL, z1 } from "./kparts";
import { P as PP } from "./lib";

type P = { t: number; h: H };
const lab = (tt: number, at: number, txt: string, w: number, p: V, col = INK, bg: string | undefined = AMB) => <Txt3 txt={txt} w={w} h={w * 0.15} col={col} bg={bg} p={p} r={[-1.05, 0, 0]} s={pop(tt, at)} op={cl((tt - at + 0.1) / 0.2)} />;
const MIST = (n: number) => <Txt3 txt={`MISTAKE ${n}`} w={0.5} h={0.1} col={CRM} bg="#7a2a22" p={[-0.75, 1.05, 0]} />;

// 21:21 · LA CINTA EN LA TAPA: la tapa abierta de frente; tiras de cinta de pintor se pegan de a una con el nombre de cada pieza y su pila.
export const HTapeLid: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.0} txt={"NO GUESSING IN THE DARK"} col={INK} bg={YEL} /></>} t={t} h={h} mode="iris" floor="counter" wall="tile" bg="#0e0f12"
  cam={{ at: [0, 0.45, -0.1], az: [-0.12, 0.08], el: [0.22, 0.16], r: [1.35, 1.15], fov: 30 }}>{(tt) => <>
  <Case s={1.5} op={1} />
  {["MOTION — THIS SIZE", "DOOR ALARMS — THAT SIZE", "REMOTES", "WEDGE", "TRIPWIRE"].map((l, i) => { const a = 0.6 + i * 0.6, k = eio(tt, a, a + 0.3);
    return <group key={l} position={[0, 0.62 - i * 0.1, -0.33]} rotation={[-0.27, 0, (i % 2 ? 0.02 : -0.02)]}>
      <mesh scale={[z1(k), 1, 1]} position={[-0.27 * (1 - k), 0, 0]}><planeGeometry args={[0.5, 0.07]} /><meshStandardMaterial color="#e9d9a6" roughness={0.9} /></mesh>
      <Txt3 txt={l} w={0.46} h={0.076} col="#1a1a1a" font="Courier New" weight={700} p={[0, 0, 0.002]} op={cl((tt - a - 0.2) / 0.2)} /></group>; })}
  
</>}</Scene3D>;

// 21:40 · LA BOLSA DE REPUESTOS: pares de pilas caen de dos en dos dentro de una bolsa con cierre que se cierra y entra en la goma.
export const HSpareBag: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.8} txt={"IN THE CASE · NOT THE JUNK DRAWER"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.25, 0], az: [-0.3, 0.2], el: [0.45, 0.35], r: [1.3, 1.1], fov: 30 }}>{(tt) => {
  const zip = eio(tt, 3.2, 3.7);
  const S: [number, number, string][] = [[0.014, 0.05, "#c9a227"], [0.011, 0.045, "#3a6ea8"], [0.02, 0.006, "#c9ced3"], [0.017, 0.06, "#c62a22"]];
  return <>
    <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.5, 0.32, 0.08]} />{M.glass({ op: 0.25, col: "#eef6ff" })}</mesh>
    <mesh position={[0, 0.32, 0]}><boxGeometry args={[0.5 * (0.2 + 0.8 * zip), 0.012, 0.085]} />{M.plastic({ col: "#3a6ea8" })}</mesh>
    {S.flatMap(([r, l, c], i) => [0, 1].map((j) => { const a = 0.4 + i * 0.6 + j * 0.15, f = eio(tt, a, a + 0.4);
      return <mesh key={i + "-" + j} position={[-0.17 + i * 0.11 + j * 0.035, 0.05 + 0.6 * (1 - f), 0]} rotation={[0, 0, r > 0.019 && l < 0.01 ? PI / 2 : 0]}><cylinderGeometry args={[r * 2, r * 2, l * 2, 18]} />{M.steel({ col: c })}</mesh>; }))}
    <Txt3 txt="2 SPARES · EVERY SIZE" w={0.6} h={0.08} col={YEL} glow p={[0, 0.5, 0]} op={cl((tt - 0.6) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 21:57 · UNA VEZ POR MES: doce casilleros de un almanaque; en cada uno un mini-test (puerta, sensor, SOS) y un tilde; 5 minutos por mes.
export const HMonthTest: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.2} txt={"ARM · OPEN · WALK · PRESS SOS"} col={CRM} bg={"#3a3020"} /></>} t={t} h={h} mode="wipe" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [0.1, -0.06], el: [0.04, 0.02], r: [1.8, 1.55], fov: 30 }}>{(tt) => {
  const n = Math.floor(cl((tt - 0.4) / 3.8) * 12 + 0.001);
  return <>
    <RBox s={[1.3, 0.9, 0.02]} p={[0, 0.6, 0]} r={0.01}><meshStandardMaterial color="#f4efe2" /></RBox>
    <RBox s={[1.3, 0.12, 0.022]} p={[0, 1.0, 0]} r={0.01}><meshStandardMaterial color="#c62a22" /></RBox>
    <Txt3 txt="TEST IT ONCE A MONTH" w={0.8} h={0.08} col="#fff" p={[0, 1.0, 0.013]} />
    {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => <group key={i} position={[-0.5 + (i % 6) * 0.2, 0.78 - Math.floor(i / 6) * 0.32, 0.015]}>
      <Txt3 txt={m} w={0.09} h={0.09} col="#444" p={[0, 0.1, 0]} />
      <Mark ok k={i < n ? 1 : 0} p={[0, -0.03, 0.01]} s={0.5} /></group>)}
    <Txt3 txt={`${roll(tt, 0.4, 4.2, 0, 5)} MIN`} w={0.3} h={0.1} col={GRN} glow p={[0.85, 0.3, 0.05]} />
    
  </>;
}}</Scene3D>;

// 22:19 · CUANDO CAMBIA LA HORA: dos relojes (marzo adelanta, noviembre atrasa); cuando la aguja salta, todas las pilas del kit se cambian de golpe.
export const HClockChange: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"SMOKE · CO · THE CASE · SAME WEEKEND"} col={INK} bg={YEL} /></>} t={t} h={h} mode="split" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [-0.08, 0.08], el: [0.05, 0.03], r: [1.9, 1.65], fov: 30 }}>{(tt) => {
  const f = [eio(tt, 0.8, 1.6), eio(tt, 2.0, 2.8)], sw = cl((tt - 3.0) / 0.4);
  return <>
    {[["MARCH", "SPRING FORWARD", -0.45, 1], ["NOVEMBER", "FALL BACK", 0.45, -1]].map(([m, s, x, d], i) => <group key={i} position={[x as number, 0.75, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.24, 0.24, 0.04, 48]} />{M.porcelain({ col: "#f2eee4" })}</mesh>
      <group position={[0, 0, 0.03]} rotation={[0, 0, -((2 + (d as number) * f[i]) / 12) * 2 * PI]}><mesh position={[0, 0.07, 0]}><boxGeometry args={[0.02, 0.14, 0.005]} /><meshBasicMaterial color="#1a1a1a" /></mesh></group>
      <Txt3 txt={m as string} w={0.36} h={0.08} col={AMB} p={[0, 0.34, 0]} />
      <Txt3 txt={s as string} w={0.4} h={0.06} col={CRM} p={[0, -0.32, 0]} /></group>)}
    {Array.from({ length: 8 }, (_, i) => <group key={i} position={[-0.7 + i * 0.2, 0.18, 0.05]}>
      <mesh position={[0, 0.05 * (1 - sw), 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 16]} />{M.steel({ col: sw > 0.5 ? "#3fa060" : "#7a5a3a" })}</mesh></group>)}
    
  </>;
}}</Scene3D>;

// 23:05 · ERROR 1: el sensor apuntado a la ventana: barren los faros de un auto y sopla la rejilla de calor; salta la alarma por nada.
export const HHeadlights: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Mist tt={tt} n={1} /><Cap tt={tt} at={3.6} txt={"HIGH IN A CORNER · AWAY FROM GLASS"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0a0b0f"
  cam={{ at: [0, 0.6, 0], az: [0.45, 0.3], el: [0.25, 0.2], r: [2.0, 1.75], fov: 32 }}>{(tt) => {
  const sweep = lerp(-0.8, 0.8, eio(tt, 0.6, 2.2)), heat = cl((tt - 2.4) / 0.4), fa = cl((tt - 1.4) / 0.2);
  return <>
    
    <mesh position={[0, 0.6, -0.6]}><boxGeometry args={[1.8, 1.2, 0.04]} />{M.matte({ col: "#cfc6b4" })}</mesh>
    <mesh position={[0, 0.65, -0.57]}><planeGeometry args={[0.6, 0.45]} /><meshBasicMaterial color="#16233a" /></mesh>
    <Pir p={[-0.7, 1.05, -0.5]} r={[0.4, 0.5, 0]} s={0.8} on={fa} />
    <mesh position={[sweep, 0.6, -0.3]} rotation={[0, 0, PI / 2]}><coneGeometry args={[0.35, 1.0, 20, 1, true]} /><meshBasicMaterial color="#fff5c8" transparent opacity={0.18} depthWrite={false} side={2} /></mesh>
    <RBox s={[0.3, 0.02, 0.15]} p={[0.55, 0.01, -0.3]} r={0.005}>{M.steel({ col: "#888" })}</RBox>
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.8 + i / 6) % 1; return <mesh key={i} position={[0.55 + 0.05 * Math.sin(i), 0.05 + 0.6 * u, -0.3]} scale={z1(0.04 + 0.08 * u)}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ff8a4a" transparent opacity={0.4 * heat * (1 - u)} depthWrite={false} /></mesh>; })}
    <Txt3 txt="FALSE ALARM" w={0.55} h={0.1} col={RED} glow p={[0, 1.15, 0]} op={fa} />
    
  </>;
}}</Scene3D>;

// 23:41 · ERROR 2: las marcas tienen que coincidir: el imán desalineado no hace nada; se alinea, la regla marca ½" y recién ahí grita.
export const HHalfInch: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Mist tt={tt} n={2} /><Cap tt={tt} at={4.3} txt={"OPEN & CLOSE IT 3 TIMES"} col={INK} bg={YEL} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [-0.1, 0.06], el: [0.04, 0.02], r: [1.2, 1.0], fov: 30 }}>{(tt) => {
  const al = eio(tt, 1.6, 2.4), gap = lerp(0.25, 0.04, eio(tt, 2.4, 3.0)), on = cl((tt - 3.4) / 0.2) * (tt < 4.4 ? 1 : 0.6);
  return <>
    
    <RBox s={[0.16, 0.4, 0.06]} p={[-0.15, 0.6, 0]} r={0.02}>{M.plastic({ col: "#f1efe8" })}</RBox>
    <mesh position={[-0.07, 0.6, 0.035]}><coneGeometry args={[0.02, 0.04, 3]} /><meshBasicMaterial color="#c62a22" /></mesh>
    <group position={[-0.07 + gap + 0.04, 0.6 + 0.18 * (1 - al), 0]} rotation={[0, 0, PI * (1 - al)]}>
      <RBox s={[0.07, 0.28, 0.06]} r={0.02}>{M.plastic({ col: "#f1efe8" })}</RBox>
      <mesh position={[-0.035, 0, 0.035]} rotation={[0, 0, PI]}><coneGeometry args={[0.02, 0.04, 3]} /><meshBasicMaterial color="#c62a22" /></mesh></group>
    <mesh position={[-0.07 + gap / 2, 0.3, 0.05]} scale={[z1(gap / 0.2), 1, 1]}><planeGeometry args={[0.2, 0.012]} /><meshBasicMaterial color={gap < 0.06 ? GRN : RED} toneMapped={false} /></mesh>
    <Txt3 txt={gap < 0.06 ? '½" GAP' : "TOO FAR"} w={0.3} h={0.09} col={gap < 0.06 ? GRN : RED} glow p={[0.22, 0.92, 0.05]} />
    <Waves tt={tt} k={on} p={[-0.15, 0.7, 0.06]} s={1} />
    
  </>;
}}</Scene3D>;

// 24:06 · ERROR 3: el hilo a la altura del perro: pasa el perro, un ciervo y el gato del vecino y suena cada vez; se mueve el hilo a la portera.
export const HDogHeight: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Mist tt={tt} n={3} /><Cap tt={tt} at={4.0} txt={"ACROSS THE GATE · DOG INSIDE"} col={INK} bg={YEL} /></>} t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#080a0f"
  cam={{ at: [0, 0.3, 0], az: [-0.35, -0.2], el: [0.3, 0.22], r: [2.0, 1.75], fov: 32 }}>{(tt) => {
  const run = (a: number) => lerp(-1.2, 1.2, eio(tt, a, a + 1.0)), fix = eio(tt, 3.6, 4.0);
  const hits = [1.1, 2.0, 2.9].filter((a) => tt > a + 0.5 && tt < a + 0.9).length;
  return <>
    
    <mesh position={[0, 0.13 + 0.25 * fix, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 1.8, 6]} /><meshBasicMaterial color="#f4f0e0" toneMapped={false} /></mesh>
    <Trip p={[0.9, 0.13 + 0.25 * fix, 0]} s={0.7} on={hits} len={0.001} />
    {[-0.95, 0.95].map((x) => <mesh key={x} position={[x, 0.3, -0.02]} scale={[1, z1(fix), 1]}><boxGeometry args={[0.06, 0.6, 0.06]} />{M.wood({ base: [150, 112, 70] })}</mesh>)}
    {[0.12, 0.48].map((y) => <mesh key={y} position={[0, y, -0.06]} scale={[z1(fix), 1, 1]}><boxGeometry args={[1.84, 0.05, 0.02]} />{M.wood({ base: [170, 128, 82] })}</mesh>)}
    <Txt3 txt="GATE" w={0.24} h={0.08} col={GRN} glow p={[0, 0.7, 0]} op={fix} />
    <Waves tt={tt} k={hits} p={[0.9, 0.2, 0]} s={1} />
    {[[1.0, 0.18, "#8a6a4a"], [1.9, 0.35, "#7a5a3a"], [2.8, 0.1, "#444"]].map(([a, hh, c], i) => <group key={i} position={[run(a as number), 0, 0.05 * i]}>
      <RBox s={[0.3 * (hh as number) / 0.18 * 0.8, (hh as number) * 0.6, 0.12]} p={[0, (hh as number) * 0.7, 0]} r={0.03}>{M.matte({ col: c as string })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, (hh as number) * 0.2, 0]}><boxGeometry args={[0.025, (hh as number) * 0.5, 0.025]} />{M.matte({ col: c as string })}</mesh>)}</group>)}
    {["DOG", "DEER", "CAT"].map((l, i) => <Txt3 key={l} txt={l} w={0.2} h={0.06} col={CRM} p={[run(1.0 + i * 0.9), 0.55, 0]} op={tt > 1.0 + i * 0.9 && tt < 2.0 + i * 0.9 ? 1 : 0} />)}
    
  </>;
}}</Scene3D>;

// 24:31 · ERROR 4: la cuña en la puerta equivocada: puerta que abre hacia adentro = la cuña frena; puerta que abre hacia afuera = se aleja sola.
export const HSwingOut: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Mist tt={tt} n={4} /><Cap tt={tt} at={3.6} txt={"CHECK THE SWING FIRST"} col={INK} bg={YEL} /></>} t={t} h={h} mode="split" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.5, 0], az: [0.0, 0.12], el: [0.75, 0.62], r: [2.6, 2.3], fov: 32 }}>{(tt) => {
  const p1 = eio(tt, 1.0, 1.6), p2 = eio(tt, 2.2, 3.0);
  return <>
    
    <DoorF p={[-0.6, 0, 0]} open={0.05 * p1} />
    <Wedge p={[-0.45, 0, 0.18]} r={[0, PI / 2, 0]} s={1.2} on={p1} />
    <Mark ok k={eio(tt, 1.6, 1.9)} p={[-0.6, 1.0, 0.3]} s={0.35} />
    <DoorF p={[0.6, 0, 0]} open={-0.6 * p2} />
    <Wedge p={[0.75, 0, 0.18]} r={[0, PI / 2, 0]} s={1.2} on={0} />
    <Mark k={eio(tt, 3.0, 3.3)} p={[0.6, 1.0, 0.3]} s={0.35} />
    <Txt3 txt="OPENS IN" w={0.4} h={0.08} col={GRN} p={[-0.6, 0.02, 0.7]} r={[-1.2, 0, 0]} />
    <Txt3 txt="SWINGS OUT" w={0.44} h={0.08} col={RED} p={[0.6, 0.02, 0.7]} r={[-1.2, 0, 0]} />
    
  </>;
}}</Scene3D>;

// 24:50 · ERROR 5: el control en la mesada: la planta de la casa; el control salta de la mesada (junto a la puerta) a la mesa de luz, con la linterna.
export const HRemoteBed: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Mist tt={tt} n={5} /><Cap tt={tt} at={3.3} txt={"BY THE BED · WITH A FLASHLIGHT"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.1, 0], az: [0.0, 0.2], el: [1.15, 1.05], r: [2.2, 1.95], fov: 32 }}>{(tt) => {
  const mv = eio(tt, 1.6, 3.0), x = lerp(-0.55, 0.55, mv), z = lerp(0.2, -0.25, mv), hop = 0.25 * Math.sin(PI * mv);
  return <>
    
    <RBox s={[1.6, 0.04, 1.0]} p={[0, 0.02, 0]} r={0.02}>{M.matte({ col: "#d8cdb6" })}</RBox>
    {[[-0.8, 0, 0.04, 1.0], [0.8, 0, 0.04, 1.0], [0, -0.5, 1.6, 0.04], [0, 0.5, 1.6, 0.04], [0.0, 0.0, 0.04, 1.0]].map(([px, pz, w, d], i) => <mesh key={i} position={[px, 0.08, pz]}><boxGeometry args={[w, 0.12, d]} />{M.matte({ col: "#efe9dc" })}</mesh>)}
    <RBox s={[0.5, 0.06, 0.12]} p={[-0.45, 0.07, 0.38]} r={0.01}>{M.matte({ col: "#8a7a62" })}</RBox>
    <RBox s={[0.4, 0.08, 0.5]} p={[0.45, 0.08, -0.15]} r={0.02}>{M.matte({ col: "#3f5f88" })}</RBox>
    <RBox s={[0.12, 0.08, 0.12]} p={[0.55, 0.08, -0.25]} r={0.01}>{M.wood({ base: [130, 88, 52] })}</RBox>
    <Fob p={[x, 0.16 + hop, z]} r={[-PI / 2, 0, 0]} s={0.6} />
    <mesh position={[0.62, 0.15, -0.22]} rotation={[0, 0, PI / 2]} scale={z1(mv)}><cylinderGeometry args={[0.015, 0.015, 0.1, 12]} />{M.steel({ col: "#c9a227" })}</mesh>
    <Txt3 txt="KITCHEN" w={0.3} h={0.06} col={CRM} p={[-0.45, 0.12, 0.25]} r={[-PI / 2, 0, 0]} />
    <Txt3 txt="BED" w={0.2} h={0.06} col={CRM} p={[0.3, 0.14, -0.05]} r={[-PI / 2, 0, 0]} />
    
  </>;
}}</Scene3D>;

// 25:08 · LA CÁMARA FALSA: rayos X sobre la cámara de mentira bajo el alero: adentro no hay nada, ni cable; sólo un LED con una pila.
export const HFakeCam: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"A REAL LIGHT DOES MORE"} col={INK} bg={YEL} i={2} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [-0.4, 0.15], el: [0.05, 0.03], r: [1.1, 0.95], fov: 30 }}>{(tt) => {
  const xr = eio(tt, 1.2, 2.0);
  return <>
    <mesh position={[0, 0.95, 0]}><boxGeometry args={[1.6, 0.06, 0.6]} />{M.wood({ base: [110, 84, 60] })}</mesh>
    <group position={[0, 0.65, 0.05]}>
      <mesh><boxGeometry args={[0.18, 0.15, 0.32]} /><meshStandardMaterial color="#ececec" transparent opacity={1 - 0.8 * xr} roughness={0.5} /></mesh>
      <Led on={(tt * 1.2) % 1 < 0.4 ? 1 : 0.1} p={[0.06, 0.05, 0.165]} r={0.01} />
      <mesh position={[0, 0, 0]} scale={z1(xr)}><boxGeometry args={[0.03, 0.03, 0.05]} />{M.steel({ col: "#c9a227" })}</mesh>
      <mesh position={[0, 0.2, -0.05]}><cylinderGeometry args={[0.015, 0.015, 0.25, 10]} />{M.plastic({ col: "#e8e8e8" })}</mesh>
    </group>
    <Txt3 txt="NO CABLE · NO BRAND · NO POWER" w={0.9} h={0.07} col={RED} glow p={[0, 0.32, 0.1]} op={cl((tt - 2.2) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 25:34 · EL CARTEL SOLO ES UN FAROL: un cartel clavado solo se cae de un soplido; el mismo cartel con la valija detrás queda firme.
export const HBluffSign: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"A SIGN ISN'T A SYSTEM"} col={INK} bg={YEL} /></>} t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#080a0f"
  cam={{ at: [0, 0.4, 0], az: [-0.08, 0.1], el: [0.2, 0.15], r: [1.9, 1.65], fov: 30 }}>{(tt) => {
  const fall = eio(tt, 1.4, 2.0);
  const Sign = ({ x, r }: { x: number; r: number }) => <group position={[x, 0, 0]} rotation={[r, 0, 0]}>
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />{M.steel()}</mesh>
    <RBox s={[0.42, 0.28, 0.015]} p={[0, 0.6, 0]} r={0.01}><meshStandardMaterial color="#1f4a8a" /></RBox>
    <Txt3 txt="PROTECTED" w={0.36} h={0.08} col="#fff" p={[0, 0.6, 0.009]} /></group>;
  return <>
    <Sign x={-0.5} r={-1.4 * fall} />
    <Sign x={0.5} r={0} />
    <Case p={[0.5, 0, -0.35]} s={0.6} op={0.6} arm={1} />
    <Txt3 txt="BLUFF" w={0.3} h={0.09} col={RED} glow p={[-0.5, 0.15, 0.35]} op={fall} />
    <Txt3 txt="BACKED UP" w={0.42} h={0.09} col={GRN} glow p={[0.5, 0.95, 0]} op={cl((tt - 2.3) / 0.3)} />
    
  </>;
}}</Scene3D>;

// 26:17 · LA CASA DE VIDRIO: corte de una sala con ventanales; la alarma de puerta sólo cuida la puerta (cono chico); el sensor adentro cubre toda la sala.
export const HGlass50: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"TWO SENSORS IN THE RIGHT SPOTS"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="wood" wall="none" bg="#0b0c10"
  cam={{ at: [0, 0.3, 0], az: [0.4, 0.15], el: [0.85, 0.75], r: [2.3, 2.0], fov: 32 }}>{(tt) => {
  const d = eio(tt, 0.8, 1.4), m = eio(tt, 2.2, 3.0);
  return <>
    {[[-0.8, 0, 0.04, 1.2], [0.8, 0, 0.04, 1.2], [0, -0.6, 1.6, 0.04]].map(([x, z, w, dd], i) => <mesh key={i} position={[x, 0.3, z]}><boxGeometry args={[w, 0.6, dd]} />{M.glass({ op: 0.3, col: "#bfe0ff" })}</mesh>)}
    <mesh position={[0, 0.3, 0.6]}><boxGeometry args={[0.3, 0.6, 0.04]} />{M.wood({ base: [176, 128, 82] })}</mesh>
    <mesh position={[0, 0.02, 0.48]} rotation={[-PI / 2, 0, 0]} scale={z1(d)}><circleGeometry args={[0.15, 24, 0, PI]} /><meshBasicMaterial color={AMB} transparent opacity={0.4} toneMapped={false} /></mesh>
    <Pir p={[-0.7, 0.55, -0.5]} r={[0, 0.8, 0]} s={0.6} on={m} />
    <mesh position={[-0.7, 0.02, -0.5]} rotation={[-PI / 2, 0, -PI / 4 - 0.7]} scale={z1(m)}><circleGeometry args={[1.5, 32, 0, PI / 2]} /><meshBasicMaterial color={RED} transparent opacity={0.22} toneMapped={false} depthWrite={false} /></mesh>
    <Txt3 txt="DOOR ALARM: THE DOOR" w={0.6} h={0.07} col={AMB} p={[0.3, 0.05, 0.85]} r={[-1.2, 0, 0]} op={d} />
    <Txt3 txt="MOTION: THE WHOLE ROOM" w={0.68} h={0.07} col={RED} glow p={[-0.1, 0.7, -0.2]} op={m} />
    
  </>;
}}</Scene3D>;

// 27:58 · DÓNDE CORREN LOS CABLES: pared en corte con montantes; desde la llave de luz (a 4 pies, del lado del picaporte) el cable sube y baja; zona roja arriba y abajo.
export const HStudFinder: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.8} txt={"AC WIRE SETTING · OR SHUT THE BREAKER"} col={INK} bg={YEL} /></>} t={t} h={h} mode="split" floor="none" wall="none" bg="#0d0c0b"
  cam={{ at: [0, 0.6, 0], az: [-0.05, 0.08], el: [0.04, 0.02], r: [1.8, 1.55], fov: 30 }}>{(tt) => {
  const w = eio(tt, 0.8, 2.0), z = eio(tt, 2.2, 2.8), sf = lerp(-0.5, 0.2, eio(tt, 3.0, 4.2));
  return <>
    <mesh position={[0, 0.6, -0.05]}><planeGeometry args={[1.8, 1.3]} /><meshStandardMaterial color="#e9e1d0" transparent opacity={0.35} /></mesh>
    {[-0.6, -0.2, 0.2, 0.6].map((x) => <mesh key={x} position={[x, 0.6, -0.08]}><boxGeometry args={[0.05, 1.3, 0.05]} />{M.wood({ base: [196, 160, 110] })}</mesh>)}
    <mesh position={[-0.42, 0.6, -0.07]}><boxGeometry args={[0.04, 1.3, 0.04]} />{M.wood({ base: [176, 140, 96] })}</mesh>
    <RBox s={[0.07, 0.11, 0.02]} p={[-0.32, 0.55, 0]} r={0.008}>{M.plastic({ col: "#f2efe6" })}</RBox>
    <mesh geometry={tubeG("sfw", [[-0.32, 0.55, -0.07], [-0.3, 0.55 + 0.65 * w, -0.07]], 0.01, 12, 6)}>{M.rubber({ col: "#e0a020" })}</mesh>
    <mesh geometry={tubeG("sfw2", [[-0.32, 0.55, -0.07], [-0.3, 0.55 - 0.5 * w, -0.07]], 0.01, 12, 6)}>{M.rubber({ col: "#e0a020" })}</mesh>
    <mesh position={[-0.32, 0.6, -0.02]} scale={[1, z1(z), 1]}><planeGeometry args={[0.16, 1.2]} /><meshBasicMaterial color={RED} transparent opacity={0.25} toneMapped={false} /></mesh>
    <RBox s={[0.12, 0.2, 0.04]} p={[sf, 0.85, 0.02]} r={0.02}>{M.plastic({ col: "#e0b020" })}</RBox>
    <Led on={Math.abs(sf + 0.32) < 0.08 ? 1 : 0} p={[sf, 0.92, 0.045]} r={0.012} />
    <Txt3 txt="4 FT" w={0.18} h={0.06} col={CRM} p={[-0.12, 0.55, 0]} />
    
  </>;
}}</Scene3D>;

// 28:42 · EL TIMER NO SIRVE EN UN APAGÓN: un enchufe con timer que gira y no prende nada; al lado, una luz solar que se prende sola.
export const HTimerPlug: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={3.6} txt={"ITS OWN BATTERY OR SOLAR"} col={INK} bg={YEL} i={2} /></>} t={t} h={h} mode="iris" floor="none" wall="wood" bg="#0a0a0c"
  cam={{ at: [0, 0.55, 0], az: [0.12, -0.08], el: [0.05, 0.03], r: [1.4, 1.2], fov: 30 }}>{(tt) => {
  const sol = cl((tt - 2.2) / 0.4);
  return <>
    <group position={[-0.35, 0.55, 0]}>
      <RBox s={[0.2, 0.28, 0.08]} r={0.02}>{M.plastic({ col: "#f0f0ea" })}</RBox>
      <group position={[0, 0.04, 0.045]} rotation={[0, 0, -tt * 1.2]}><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.01, 24]} />{M.plastic({ col: "#d8d4c8" })}</mesh>
        {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i / 12 * 2 * PI) * 0.06, Math.cos(i / 12 * 2 * PI) * 0.06, 0.008]}><boxGeometry args={[0.008, 0.015, 0.006]} />{M.plastic({ col: i % 2 ? "#c62a22" : "#666" })}</mesh>)}</group>
      <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.07, 16, 12]} /><meshStandardMaterial color="#ddd" /></mesh>
    </group>
    <group position={[0.35, 0.45, 0]}>
      <RBox s={[0.18, 0.02, 0.12]} p={[0, 0.25, 0]} r={0.005}><meshStandardMaterial color="#1a2a4a" metalness={0.4} roughness={0.3} /></RBox>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.06, 0.05, 0.12, 20]} />{M.plastic({ col: "#222" })}</mesh>
      <mesh position={[0, 0.04, 0]}><sphereGeometry args={[0.06, 16, 12]} /><meshStandardMaterial color="#fff2c0" emissive="#ffd27a" emissiveIntensity={3 * sol} toneMapped={false} /></mesh>
      <pointLight position={[0, 0, 0.2]} intensity={3 * sol} distance={1.4} color="#ffd27a" />
    </group>
    <Txt3 txt="TIMER: NO POWER" w={0.4} h={0.07} col={RED} glow p={[-0.35, 0.18, 0.05]} op={cl((tt - 1.0) / 0.3)} />
    <Txt3 txt="SOLAR: ON" w={0.3} h={0.07} col={GRN} glow p={[0.35, 0.18, 0.05]} op={sol} />
    
  </>;
}}</Scene3D>;

// 30:30 · LO QUE NO HACE: cuatro tarjetas que se dan vuelta: no llama a nadie, no graba, no frena al decidido; la última: hace ruido.
export const HWontDo: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.3} txt={"LOCKS STILL MATTER MOST"} col={INK} bg={YEL} /></>} t={t} h={h} mode="drop" floor="dark" wall="dark" bg="#0c0d10"
  cam={{ at: [0, 0.55, 0], az: [-0.06, 0.06], el: [0.08, 0.06], r: [2.2, 1.95], fov: 30 }}>{(tt) => {
  const C: [string, boolean][] = [["CALLS|ANYBODY", false], ["RECORDS|VIDEO", false], ["STOPS THE|DETERMINED", false], ["MAKES|NOISE", true]];
  return <>
    {C.map(([l, ok], i) => { const f = eio(tt, 0.5 + i * 0.85, 0.9 + i * 0.85); return <group key={l} position={[-0.75 + i * 0.5, 0.6, 0]} rotation={[0, PI * (1 - f), 0]}>
      <RBox s={[0.42, 0.55, 0.02]} r={0.02}>{M.matte({ col: ok ? "#3a3020" : "#24262b" })}</RBox>
      {l.split("|").map((ln, j) => <Txt3 key={j} txt={ln} w={0.38} h={0.085} col={ok ? YEL : CRM} p={[0, -0.08 - j * 0.09, 0.012]} />)}
      <Mark ok={ok} k={f} p={[0, 0.1, 0.02]} s={0.4} /></group>; })}
    
  </>;
}}</Scene3D>;

// 31:57 · EL RESUMEN EN UNA VALIJA: la valija abierta en el centro; cada pieza vuela a su lugar en una casita (pasillo, slider, puertas, sótano, garaje, portera, mesa de luz).
export const HRecapCase: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={4.4} txt={"TEST MONTHLY · SPARES IN THE CASE"} col={INK} bg={YEL} /></>} t={t} h={h} mode="iris" floor="dark" wall="none" bg="#080a10"
  cam={{ at: [0, 0.25, 0.05], az: [-0.2, 0.2], el: [0.95, 0.85], r: [2.7, 2.4], fov: 32 }}>{(tt) => {
  const D: [string, number, number][] = [["HALLWAY", -0.9, -0.6], ["SLIDER", -0.3, -0.75], ["BACK DOOR", 0.35, -0.75], ["BASEMENT", 0.95, -0.55], ["GARAGE", 1.0, 0.25], ["SIDE GATE", 0.4, 0.75], ["NIGHTSTAND", -0.6, 0.65]];
  return <>
    <Case p={[0, 0, 0]} s={0.9} op={1} arm={1} />
    {D.map(([l, x, z], i) => { const a = 0.5 + i * 0.5, f = eio(tt, a, a + 0.5); return <group key={l}>
      <mesh position={[lerp(0, x, f), 0.15 + 0.35 * Math.sin(PI * f), lerp(0, z, f)]}><boxGeometry args={[0.06, 0.08, 0.04]} />{M.plastic({ col: "#f1efe8" })}</mesh>
      <MiniHouse p={[x, 0, z]} s={0.45} lit={f} />
      <Txt3 txt={l} w={0.36} h={0.06} col={CRM} p={[x, 0.5, z]} r={[-0.7, 0, 0]} op={f} /></group>; })}
    
  </>;
}}</Scene3D>;

// 32:44 · ¿QUÉ PROTEGERÍAS PRIMERO?: cuatro fichas (puerta de atrás, garaje, portera, otra cosa) y un signo de pregunta que salta de una a otra.
export const HVote: React.FC<P> = ({ t, h }) => <Scene3D over={(tt) => <><Cap tt={tt} at={2.8} txt={"TELL ME IN THE COMMENTS"} col={INK} bg={YEL} /></>} t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#0f0d0b"
  cam={{ at: [0, 0.2, 0], az: [-0.1, 0.1], el: [0.6, 0.5], r: [1.9, 1.65], fov: 30 }}>{(tt) => {
  const O = ["BACK DOOR", "GARAGE", "GATE", "SOMETHING|ELSE?"], k = Math.floor((tt * 1.4) % 4);
  return <>
    {O.map((l, i) => <group key={l} position={[-0.75 + i * 0.5, 0.03, 0]} scale={pop(tt, 0.4 + i * 0.3)}>
      <RBox s={[0.42, 0.04, 0.3]} r={0.02}>{M.matte({ col: i === k ? "#3a3020" : "#24262b" })}</RBox>
      {l.split("|").map((ln, j, A) => <Txt3 key={j} txt={ln} w={0.36} h={0.08} col={i === k ? YEL : CRM} p={[0, 0.025, (j - (A.length - 1) / 2) * 0.085]} r={[-PI / 2, 0, 0]} />)}</group>)}
    <Txt3 txt="?" w={0.2} h={0.2} col={YEL} glow p={[-0.75 + k * 0.5, 0.35 + 0.05 * Math.sin(tt * 8), 0]} />
    
  </>;
}}</Scene3D>;

// ===== CTA: la landing REAL como pantalla apoyada en la mesa de la cocina a oscuras; el QR impreso y la foto de la valija abierta =====
// h.page = "top" | "case" (qué parte de la landing); nunca una URL escrita: «LINK: FIRST LINE OF THE DESCRIPTION».
export const LandingCTA: React.FC<P> = ({ t, h }) => {
  const scr = useImg(PP + "cta/land_" + (h.page ?? "top") + ".jpg"), qr = useImg(PP + "cta/qr.png"), ph = useImg(PP + "cta/p18.jpg");
  return <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#0f0c0a" key1={[-0.6, 1.8, 1.2]} lamp={[-0.5, 0.45, 0.3]}
    cam={{ at: [0.0, 0.32, 0], at1: [0.05, 0.36, 0], az: [-0.45, 0.05], el: [0.35, 0.12], r: [1.75, 1.35], fov: 32 }}>{(k) => {
    const up = eio(k, 0.2, 0.9), qk = pop(k, 1.6), pk = pop(k, 2.2);
    return <>
      {/* la pantalla (tablet grande) apoyada contra la pared */}
      <group position={[0, 0.02, -0.12]} rotation={[-0.22 * up - 0.02, 0, 0]}>
        <RBox s={[0.98, 0.58, 0.025]} p={[0, 0.3, 0]} r={0.025}>{M.plastic({ col: "#111214" })}</RBox>
        <mesh position={[0, 0.3, 0.0135]}><planeGeometry args={[0.93, 0.523]} /><meshBasicMaterial map={scr ?? null} color={scr ? "#fff" : "#222"} toneMapped={false} /></mesh>
      </group>
      {/* el farol */}
      <group position={[-0.62, 0, 0.2]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.05, 0.06, 0.2, 20]} /><meshStandardMaterial color="#fff2d0" emissive="#ffc97a" emissiveIntensity={1.6} toneMapped={false} /></mesh><pointLight position={[0, 0.2, 0.1]} intensity={2.4} distance={1.6} color="#ffc98a" /></group>
      {/* la tarjeta con el QR */}
      <group position={[0.52, 0.005, 0.32]} rotation={[-PI / 2, 0, -0.18]} scale={qk}>
        <mesh><planeGeometry args={[0.24, 0.3]} /><meshStandardMaterial color="#f7f4ee" roughness={0.9} /></mesh>
        <mesh position={[0, 0.02, 0.001]}><planeGeometry args={[0.19, 0.19]} /><meshBasicMaterial map={qr ?? null} color={qr ? "#fff" : "#888"} /></mesh>
        <Txt3 txt="GARY'S KIT" w={0.18} h={0.04} col="#111" p={[0, -0.11, 0.002]} />
      </group>
      {/* la foto impresa de la valija abierta */}
      <group position={[-0.32, 0.006, 0.36]} rotation={[-PI / 2, 0, 0.12]} scale={pk}>
        <mesh><planeGeometry args={[0.36, 0.22]} /><meshStandardMaterial color="#fff" roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.34, 0.19]} /><meshBasicMaterial map={ph ?? null} color={ph ? "#fff" : "#555"} /></mesh>
      </group>
      <Txt3 txt="$149 · SHIPS US ONLY · 60 DAYS" w={0.9} h={0.07} col={INK} bg={YEL} p={[0, 0.66, -0.1]} s={pop(k, 2.6)} op={cl((k - 2.5) / 0.2)} />
      <Txt3 txt="LINK: FIRST LINE OF THE DESCRIPTION" w={1.0} h={0.07} col={CRM} bg="#1a1b1e" p={[0.05, 0.012, 0.6]} r={[-1.1, 0, 0]} s={pop(k, 3.0)} op={cl((k - 2.9) / 0.2)} />
    </>;
  }}</Scene3D>;
};
