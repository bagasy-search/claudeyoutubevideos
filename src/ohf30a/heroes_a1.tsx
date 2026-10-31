// ohf30a · componentes únicos 1-7 (kit h3d + okit: objeto real con material, luz con motivo, cámara que orbita en curva)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { CShadow, M, RBox, Scene3D, cl, eio, lerp, phys, rn } from "./h3d";
import { Bubbles, Gauge, IronRad, OldBoiler, Pipe, RadH, Tape, dialTex } from "./okit";

const PI = Math.PI;
// ondas de calor: planos transparentes que tiemblan sobre lo caliente
const Shimmer: React.FC<{ tt: number; p: [number, number, number]; w: number; k: number }> = ({ tt, p, w, k }) => <group position={p}>
  {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.02 * Math.sin(tt * 2.2 + i * 1.7), 0.05 + ((tt * 0.09 + i * 0.07) % 0.28), 0.01 * i]} scale={[1 + 0.08 * Math.sin(tt * 3 + i), 1, 1]}>
    <planeGeometry args={[w, 0.06]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.06 * k} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
</group>;

// ---- 0:14 · MISMA CALDERA, DOS RADIADORES: un caño sale de la misma caldera y se parte en dos; uno arde y el otro queda azul ----
export const HTwins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="oak" wall="plaster" wallZ={-0.75} bg="#1b1815" key1={[-1.2, 2.2, 1.4]}
  cam={{ at: [0, 0.36, -0.1], az: [-0.35, 0.3], el: [0.3, 0.24], r: [1.95, 1.7], fov: 34 }}>{(tt) => {
  const hot = eio(tt, 0.9, 3.0), a = phys(tt, 0.1, 6, 0.5), b = phys(tt, 0.35, 6, 0.5);
  return <>
    {/* la caldera chiquita atrás, al centro, con su llama */}
    <OldBoiler p={[0, 0, -0.55]} col="#7a2c22" s={[0.28, 0.46, 0.22]} tt={tt} />
    <CShadow p={[0, 0, -0.55]} s={[0.4, 0.32]} o={0.7} />
    <Pipe a={[0, 0.04, -0.44]} b={[0, 0.04, 0]} r={0.02} />
    <Pipe a={[-0.5, 0.04, 0]} b={[0.5, 0.04, 0]} r={0.02} col={"#6a5a4a"} em="#ff6a1a" emI={0.25 * hot} />
    <group position={[-0.5, (1 - cl(a)) * 0.5, 0]}><RadH n={8} heat={(i, y) => 0.1 + 0.05 * Math.sin(i + y * 3)} /></group>
    <group position={[0.5, (1 - cl(b)) * 0.5, 0]}><RadH n={8} heat={(i, y) => 0.12 + 0.88 * hot * (0.85 + 0.15 * Math.sin(i * 1.3 + y * 2))} /></group>
    <Shimmer tt={tt} p={[0.5, 0.55, 0]} w={0.42} k={hot} />
    {/* escarcha sobre el frío: puntitos blancos */}
    {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[-0.5 + (rn(i, 2) - 0.5) * 0.44, 0.1 + rn(i, 3) * 0.48, 0.042]}><circleGeometry args={[0.004 + 0.004 * rn(i, 4), 8]} /><meshBasicMaterial color="#eef6ff" transparent opacity={0.7 * eio(tt, 1.2, 2.4)} /></mesh>)}
    <Tape txt="COLD" col="#1f4f9a" p={[-0.5, 0.64, 0.05]} rot={[0, 0, 0.05]} w={0.18} k={phys(tt, 1.8, 8, 0.45)} rev={cl((tt - 1.8) / 0.6)} />
    <Tape txt="HOT" col="#b3261e" p={[0.5, 0.64, 0.05]} rot={[0, 0, -0.06]} w={0.15} k={phys(tt, 2.3, 8, 0.45)} rev={cl((tt - 2.3) / 0.5)} />
    <Tape txt="SAME BOILER" p={[0, 0.56, -0.74]} w={0.3} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 1:40 · DOS SISTEMAS: en el sótano de ladrillo, la caldera de agua caliente (reloj redondo, tanque de expansión) y la de vapor
// (tubo de vidrio, respiradero que larga vapor); cada una con su placa de bronce ----
const D30 = () => dialTex("hw30", 30, 12, 15, "PSI", 27);
const D30W = () => dialTex("hw30", 30, 12, 15, "PSI", 27, "white");
export const HTwoKinds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="brick" wallZ={-0.5} bg="#15130f" key1={[-0.3, 2.0, 1.4]} warm={0.9}
  cam={{ at: [-0.05, 0.5, -0.1], at1: [0.0, 0.62, -0.15], az: [0.35, -0.1], el: [0.14, 0.1], r: [1.75, 2.35], fov: 34 }}>{(tt) => {
  const a = phys(tt, 0.1, 6, 0.5), b = phys(tt, 0.45, 6, 0.5), run = eio(tt, 1.2, 4.6), lvl = 0.5 + 0.04 * Math.sin(tt * 2.2) * cl(tt - 1), boil = eio(tt, 1.6, 3.2);
  return <>
    <group position={[-0.42, (1 - cl(a)) * 0.5, -0.22]}>
      <OldBoiler col="#2f4a5c" s={[0.44, 0.66, 0.34]} plate="HOT WATER" tt={tt}>
        <Gauge v={lerp(4, 14, run)} max={30} tx={D30W()} p={[0.0, 0.43, 0.012]} r={0.075} look="chrome" />
      </OldBoiler>
      {/* tanque de expansión acostado arriba */}
      <mesh position={[0, 0.98, -0.02]} rotation={[0, 0, PI / 2]} castShadow><capsuleGeometry args={[0.07, 0.26, 6, 24]} /><meshStandardMaterial color="#6d7378" metalness={0.6} roughness={0.42} /></mesh>
      <Pipe a={[0, 0.66, -0.02]} b={[0, 0.91, -0.02]} r={0.016} col="#55585b" />
      <Pipe a={[0.15, 0.66, 0.05]} b={[0.15, 1.4, 0.05]} r={0.02} col="#b87333" em="#ff5a10" emI={0.7 * run} />
    </group>
    <group position={[0.42, (1 - cl(b)) * 0.5, -0.22]}>
      <OldBoiler col="#6a2a22" s={[0.44, 0.66, 0.34]} plate="STEAM" tt={tt + 1}>
        {/* tubo de vidrio con sus llaves */}
        <group position={[0.15, 0.4, 0.03]}>
          <mesh><cylinderGeometry args={[0.012, 0.012, 0.2, 20]} />{M.glass({ op: 0.3 })}</mesh>
          <mesh position={[0, -0.1 + 0.1 * lvl, 0]}><cylinderGeometry args={[0.009, 0.009, 0.2 * lvl, 20]} />{M.water({ op: 0.8 })}</mesh>
          <Bubbles tt={tt} n={8} box={[0.012, 0.2 * lvl, 0.012]} p={[0, -0.1, 0]} v={0.12 * boil + 0.01} r={0.0025} />
          {[-0.11, 0.11].map((y, i) => <group key={i} position={[0, y, 0]}><mesh><cylinderGeometry args={[0.018, 0.018, 0.024, 6]} />{M.brass()}</mesh><mesh position={[-0.03, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.05, 8]} />{M.brass()}</mesh></group>)}
        </group>
        <Gauge v={lerp(0.2, 1.4, boil)} max={3} tx={DST0()} p={[-0.06, 0.43, 0.012]} r={0.06} look="iron" needle="#ff7a2a" />
      </OldBoiler>
      <Pipe a={[-0.1, 0.66, 0]} b={[-0.1, 1.4, 0]} r={0.03} col="#2b2b2b" />
      {/* respiradero arriba que larga vapor */}
      <group position={[0.1, 0.7, 0]}><mesh><cylinderGeometry args={[0.018, 0.018, 0.06, 16]} />{M.chrome()}</mesh></group>
      {Array.from({ length: 7 }, (_, i) => { const u = (tt * 0.35 + i / 7) % 1; return <mesh key={i} position={[0.1 + 0.03 * Math.sin(u * 5 + i), 0.75 + u * 0.4, 0.02 * Math.cos(i)]} scale={(0.4 + u * 1.6) * Math.max(0.001, boil)} visible={boil > 0.01}><sphereGeometry args={[0.04, 14, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.16 * (1 - u)} depthWrite={false} /></mesh>; })}
    </group>
    <CShadow p={[-0.42, 0, -0.22]} s={[0.7, 0.55]} o={0.7} />
    <CShadow p={[0.42, 0, -0.22]} s={[0.7, 0.55]} o={0.7} />
  </>;
}}</Scene3D>;

// ---- 2:15 · EL TUBO DE VIDRIO: el visor de la caldera de vapor con sus llaves de bronce; el agua hierve y baila a media altura;
// la cámara arranca pegada al vidrio y se abre hasta ver que vive en el frente de la caldera ----
const DST0 = () => dialTex("stb", 3, 0.5, 2, "PSI", undefined, "black");
export const HSightGlass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="paper" wallZ={-0.42} bg="#15120f" key1={[-0.9, 1.5, 1.2]} warm={0.85}
  cam={{ at: [0.0, 0.44, 0.0], at1: [0.0, 0.42, -0.05], az: [-0.4, 0.15], el: [0.06, 0.1], r: [0.85, 1.08], fov: 30 }}>{(tt) => {
  const boil = eio(tt, 0.6, 2.0), lvl = 0.52 + boil * (0.05 * Math.sin(tt * 3.1) + 0.025 * Math.sin(tt * 7.3));
  return <>
    <OldBoiler p={[-0.08, 0, -0.2]} col="#6a2a22" s={[0.5, 0.74, 0.36]} tt={tt}>
      <Gauge v={0.8 + 0.4 * boil} max={3} tx={DST0()} p={[-0.08, 0.5, 0.012]} r={0.07} look="black" needle="#ff7a2a" />
    </OldBoiler>
    <group position={[0.15, 0.42, 0.0]}>
      <mesh><cylinderGeometry args={[0.02, 0.02, 0.28, 28]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, -0.14 + 0.14 * lvl, 0]}><cylinderGeometry args={[0.016, 0.016, 0.28 * lvl, 28]} />{M.water({ op: 0.78 })}</mesh>
      <mesh position={[0, -0.14 + 0.28 * lvl, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.016, 28]} /><meshStandardMaterial color="#d8f0ff" emissive="#8fd0ff" emissiveIntensity={0.4} /></mesh>
      <Bubbles tt={tt} n={16} box={[0.02, Math.max(0.01, 0.28 * lvl), 0.02]} p={[0, -0.14, 0]} v={0.18 * boil + 0.01} r={0.0028} />
      {[-0.155, 0.155].map((y, i) => <group key={i} position={[0, y, 0]}>
        <mesh><cylinderGeometry args={[0.03, 0.03, 0.035, 6]} />{M.brass()}</mesh>
        <mesh position={[0, 0, -0.06]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.08, 14]} />{M.brass({ col: "#b8892e" })}</mesh>
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.005, 0.06, 10]} />{M.brass()}</mesh>
        <mesh position={[0.08, 0, 0]}><sphereGeometry args={[0.009, 12, 10]} /><meshStandardMaterial color="#1d1d1d" roughness={0.4} /></mesh>
      </group>)}
    </group>
    <CShadow p={[-0.08, 0, -0.2]} s={[0.8, 0.6]} o={0.7} />
    <Tape txt="WATER IN THE GLASS" p={[-0.03, 0.34, -0.015]} rot={[0, 0, 0.02]} w={0.28} k={phys(tt, 1.3, 8, 0.45)} rev={cl((tt - 1.3) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 3:10 · APAGADO Y FRÍO: la llave roja de emergencia en la pared del sótano baja; el piloto de la caldera se apaga, el termómetro
// cae y el reloj de pared corre dos horas (las agujas giran a la vista) ----
const DTF = () => dialTex("tf250", 250, 0, 0, "°F", 200, "aged");
export const HOffSwitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="peel" wallZ={-0.3} bg="#17150f" key1={[-0.8, 1.6, 1.3]} warm={0.8}
  cam={{ at: [-0.24, 0.66, -0.2], at1: [-0.04, 0.54, -0.2], az: [-0.3, 0.1], el: [0.06, 0.1], r: [0.9, 1.8], fov: 32 }}>{(tt) => {
  const fl = eio(tt, 0.9, 1.25), cool = eio(tt, 1.5, 5.4), spin = eio(tt, 1.6, 5.4) * PI * 2 * 2;
  return <>
    {/* la llave de emergencia: placa roja en la pared con su palanca */}
    <group position={[-0.32, 0.62, -0.29]}>
      <RBox s={[0.13, 0.19, 0.03]} p={[0, 0, 0.015]} r={0.008}><meshStandardMaterial color="#b8221c" roughness={0.45} /></RBox>
      <RBox s={[0.06, 0.1, 0.012]} p={[0, 0, 0.034]} r={0.004}><meshStandardMaterial color="#e9e3d6" roughness={0.4} /></RBox>
      <group position={[0, 0, 0.04]} rotation={[lerp(-0.6, 0.6, fl), 0, 0]}><RBox s={[0.018, 0.06, 0.02]} p={[0, 0.03, 0.01]} r={0.005}><meshStandardMaterial color="#1a1a1a" roughness={0.35} /></RBox></group>
      <Tape txt={fl > 0.5 ? "OFF" : "ON"} p={[0, -0.14, 0.02]} w={0.13} col={fl > 0.5 ? "#1f4f9a" : "#b3261e"} />
      <Pipe a={[0, 0.1, 0.01]} b={[0, 0.5, 0.01]} r={0.008} col="#7d7d7d" />
    </group>
    <OldBoiler p={[0.12, 0, -0.1]} col="#3b4a3c" s={[0.4, 0.62, 0.32]} tt={tt} pilot={1 - fl}>
      <Gauge v={lerp(190, 60, cool)} max={250} tx={DTF()} p={[-0.06, 0.42, 0.012]} r={0.065} look="black" />
    </OldBoiler>
    <CShadow p={[0.12, 0, -0.1]} s={[0.6, 0.5]} o={0.7} />
    {/* reloj de pared grande: las agujas dan dos vueltas */}
    <group position={[0.12, 0.92, -0.285]}>
      <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.11, 0.11, 0.03, 48]} />{M.wood({ base: [110, 70, 40] })}</mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.096, 48]} /><meshStandardMaterial color="#f4efe2" /></mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.082, Math.cos(i * PI / 6) * 0.082, 0.018]} rotation={[0, 0, -i * PI / 6]}><boxGeometry args={[0.005, 0.014, 0.001]} /><meshStandardMaterial color="#222" /></mesh>)}
      <mesh position={[0, 0, 0.019]}><circleGeometry args={[0.07, 48, PI / 2 - 0.6, -Math.max(0.001, spin / 12)]} /><meshBasicMaterial color="#3c6fd0" transparent opacity={0.25} depthWrite={false} /></mesh>
      <group position={[0, 0, 0.022]} rotation={[0, 0, -spin]}><mesh position={[0, 0.034, 0]}><boxGeometry args={[0.005, 0.072, 0.002]} /><meshStandardMaterial color="#111" /></mesh></group>
      <group position={[0, 0, 0.024]} rotation={[0, 0, -spin / 12 - 0.6]}><mesh position={[0, 0.022, 0]}><boxGeometry args={[0.008, 0.048, 0.002]} /><meshStandardMaterial color="#111" /></mesh></group>
    </group>
    <Tape txt="WAIT 1-2 HOURS" p={[0.12, 0.74, -0.285]} rot={[0, 0, 0.02]} w={0.42} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 3:45 · EL NÚMERO EN FRÍO: la aguja se asienta en 14, sale una tira de cinta y el marcador escribe el número; el marcador
// escribe por arriba y se va antes de que se lea (nunca tapa la palabra) ----
export const HTapeGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="brick" wallZ={-0.4} bg="#14120f" key1={[-0.6, 1.4, 1.5]} warm={0.85}
  cam={{ at: [0.03, 0.47, 0], at1: [0.06, 0.46, 0], az: [-0.32, 0.14], el: [0.06, 0.02], r: [0.62, 0.5], fov: 30 }}>{(tt) => {
  const v = 14 + 7 * Math.exp(-tt * 1.4) * Math.cos(tt * 5), tp = eio(tt, 1.4, 1.9), wr = cl((tt - 1.9) / 1.2), gone = eio(tt, 3.1, 3.7);
  return <>
    <OldBoiler p={[0.05, 0, -0.22]} col="#2f4a5c" s={[0.5, 0.72, 0.36]} tt={tt}>
      <Gauge v={v} max={30} tx={D30()} p={[-0.1, 0.47, 0.012]} r={0.085} />
      <Tape txt="COLD = 14 PSI" p={[0.12, 0.47, 0.006]} rot={[0, 0, 0.02]} w={0.2 * Math.max(0.001, tp)} rev={wr} />
      {/* el marcador: escribe por ARRIBA de la cinta y se va */}
      <group position={[0.04 + 0.17 * wr + 0.2 * gone, 0.515 + 0.006 * Math.sin(tt * 11) * (1 - gone) + 0.25 * gone, 0.06]} rotation={[0.3, 0, -0.6]}>
        <mesh><cylinderGeometry args={[0.009, 0.009, 0.12, 14]} /><meshStandardMaterial color="#141414" roughness={0.4} /></mesh>
        <mesh position={[0, -0.065, 0]}><coneGeometry args={[0.006, 0.014, 10]} /><meshStandardMaterial color="#1c2a3a" /></mesh>
        <mesh position={[0, 0.066, 0]}><cylinderGeometry args={[0.0095, 0.0095, 0.02, 14]} /><meshStandardMaterial color="#e8e2d0" /></mesh>
      </group>
    </OldBoiler>
    <CShadow p={[0.05, 0, -0.22]} s={[0.8, 0.6]} o={0.7} />
  </>;
}}</Scene3D>;

// ---- 4:15 · EL AIRE SUBE: una columna del radiador abierta en vidrio, grande en cuadro; el agua caliente entra por abajo,
// las burbujas grandes suben y arman la bolsa de aire FRÍA arriba; el radiador de hierro atrás repite el mapa de calor ----
export const HAirPocket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="oak" wall="paper" wallZ={-0.3} bg="#191714" key1={[-1.0, 1.6, 1.3]} warm={0.85}
  cam={{ at: [0.0, 0.36, 0.0], at1: [0.02, 0.38, -0.04], az: [0.38, -0.12], el: [0.2, 0.24], r: [1.15, 1.32], fov: 32 }}>{(tt) => {
  const fill = eio(tt, 0.4, 2.0), pocket = eio(tt, 1.4, 4.2), top = 0.56, lvl = top - 0.17 * pocket, wl = Math.max(0.01, lvl * fill);
  return <>
    <IronRad n={9} w={0.05} h={0.6} p={[0, 0, -0.18]} heat={(i, y) => (y * 0.6 > lvl + 0.02 ? 0.12 : 0.75 * fill + 0.1)} glow={0.3} />
    {/* la columna en corte, adelante */}
    <group position={[0, 0.07, 0.02]}>
      <mesh position={[0, 0.3, 0]}><capsuleGeometry args={[0.055, 0.5, 8, 32]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh position={[0, wl / 2, 0]}><cylinderGeometry args={[0.05, 0.05, wl, 32]} />{M.water({ op: 0.78, col: "#e0703a", em: "#7a2a08", emI: 0.55 })}</mesh>
      <mesh position={[0, wl, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.05, 32]} /><meshStandardMaterial color="#ffb080" emissive="#a0400a" emissiveIntensity={0.5} transparent opacity={0.9} /></mesh>
      {/* la bolsa de aire fría, azulada */}
      <mesh position={[0, wl + (0.58 - wl) / 2, 0]} visible={pocket > 0.01}><cylinderGeometry args={[0.049, 0.049, Math.max(0.001, 0.58 - wl), 32]} /><meshStandardMaterial color="#bcd8ff" transparent opacity={0.3 * pocket} emissive="#5f8fd0" emissiveIntensity={0.35} depthWrite={false} /></mesh>
      {Array.from({ length: 16 }, (_, i) => { const sp = 0.16 + 0.1 * rn(i, 2), y = ((rn(i, 3) * wl + tt * sp) % wl), r = 0.006 + 0.01 * rn(i, 4);
        return <mesh key={i} position={[(rn(i, 5) - 0.5) * 0.06 + 0.004 * Math.sin(tt * 3 + i), y, (rn(i, 6) - 0.5) * 0.05]} visible={fill > 0.05}><sphereGeometry args={[r, 14, 10]} /><meshPhysicalMaterial color="#fff4ea" transparent opacity={0.75} roughness={0.05} clearcoat={1} /></mesh>; })}
    </group>
    <CShadow p={[0, 0, -0.16]} s={[0.6, 0.18]} o={0.55} />
    <Tape txt="AIR RISES" col="#1f4f9a" p={[0.24, 0.07, -0.05]} rot={[-0.7, 0, 0.02]} w={0.3} k={phys(tt, 2.2, 8, 0.45)} rev={cl((tt - 2.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 5:00 · LA LLAVE DE PURGA: macro de la llave de bronce, de frente: se ve el AGUJERO CUADRADO; calza en el vástago cuadrado
// del purgador del radiador, gira un cuarto y sale el silbido de aire ----
const KeyMacro: React.FC<{ p: [number, number, number]; rot: [number, number, number] }> = ({ p, rot }) => <group position={p} rotation={rot}>
  {/* caño de la llave (eje x): el frente (+x) tiene el agujero cuadrado bien visible */}
  <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.1, 32]} />{M.brass({ col: "#d0a04a" })}</mesh>
  <mesh position={[0.0505, 0, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.019, 0.0035, 10, 32]} />{M.brass({ col: "#e8c070" })}</mesh>
  <mesh position={[0.0508, 0, 0]}><boxGeometry args={[0.002, 0.016, 0.016]} /><meshStandardMaterial color="#120c04" roughness={0.9} /></mesh>
  {/* mariposa */}
  <RBox s={[0.024, 0.13, 0.016]} p={[-0.06, 0, 0]} r={0.007}>{M.brass({ col: "#c4943e" })}</RBox>
  {[-1, 1].map((k) => <mesh key={k} position={[-0.06, k * 0.066, 0]}><sphereGeometry args={[0.014, 16, 12]} />{M.brass({ col: "#c4943e" })}</mesh>)}
</group>;
export const HBleedKey: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="oak" wall="plaster" wallZ={-0.2} bg="#1b1815" key1={[-0.6, 1.2, 1.1]} warm={0.8}
  cam={{ at: [0.22, 0.6, -0.06], at1: [0.17, 0.6, -0.08], az: [0.9, 0.45], el: [0.12, 0.16], r: [0.34, 0.42], fov: 30 }}>{(tt) => {
  const show = eio(tt, 0.2, 1.6), go = eio(tt, 2.0, 2.9), turn = eio(tt, 3.1, 3.8) * PI / 2, hiss = cl((tt - 3.5) / 0.4) * (1 - eio(tt, 5.0, 5.8));
  const n = 4, w = 0.06, L = n * w * 1.12, by = 0.6;
  return <>
    <IronRad n={n} w={w} h={0.66} p={[0.13 - L / 2 - 0.037, 0, -0.08]} heat={() => 0.3} bleed={false} valve={false} />
    {/* el purgador: cuerpo de bronce con el vástago cuadrado */}
    <group position={[0.13, by, -0.08]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.05, 24]} />{M.brass({ col: "#b8892e" })}</mesh>
      <mesh position={[0.03, 0, 0]} rotation={[turn, 0, 0]}><boxGeometry args={[0.016, 0.0145, 0.0145]} />{M.brass()}</mesh>
      {Array.from({ length: 6 }, (_, i) => { const u = (tt * 0.9 + i / 6) % 1; return <mesh key={i} position={[0.03 + u * 0.05, 0.01 + u * 0.06, 0.01 * Math.sin(i * 2)]} scale={0.4 + 1.2 * u} visible={hiss > 0.01}><sphereGeometry args={[0.01, 10, 8]} /><meshBasicMaterial color="#eef6ff" transparent opacity={0.35 * (1 - u) * hiss} depthWrite={false} /></mesh>; })}
    </group>
    {/* la llave: primero muestra el agujero de frente a cámara, después entra en el vástago */}
    <KeyMacro p={[lerp(0.31, 0.208, go), by + 0.04 * (1 - go) + 0.03 * (1 - show), -0.08 + 0.05 * (1 - go)]} rot={[turn, lerp(-0.67, PI, go), 0]} />
    <Tape txt="SQUARE HOLE" p={[0.12, 0.74, -0.195]} rot={[0, 0, 0.03]} w={0.17} k={phys(tt, 1.2, 8, 0.45)} rev={cl((tt - 1.2) / 0.7)} />
  </>;
}}</Scene3D>;
