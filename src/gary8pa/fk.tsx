// gary05 · el kit del calefactor: las piezas que se repiten entre el mundo (world3d) y los componentes (gh1-gh4).
// Calefactor a gas en corte (inductor, encendedor, placa, soplador, quemadores), termostato redondo, interruptor de
// transferencia, pinza amperométrica. Todo con k 0..1 (nunca escala 0: Math.max(0.001, …)); luces siempre montadas.
import React from "react";
import * as THREE from "three";
import { M, RBox, tubeG } from "./h3d";
import { PI, Txt3, cl } from "./gk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);

// rueda de jaula de ardilla (el soplador): aspas finas alrededor de un eje; rot = ángulo
export const Cage: React.FC<{ rot: number; r?: number; w?: number; col?: string }> = ({ rot, r = 0.11, w = 0.16, col = "#8f969c" }) => <group rotation={[0, 0, rot]}>
  {Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * 2 * PI; return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation={[0, 0, a + 0.5]}><boxGeometry args={[0.028, 0.004, w]} />{M.steel({ col })}</mesh>; })}
  {[-1, 1].map((s) => <mesh key={s} position={[0, 0, s * w / 2]}><torusGeometry args={[r, 0.006, 8, 48]} />{M.steel({ col })}</mesh>)}
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, w + 0.04, 16]} />{M.steel({ col: "#5a6066" })}</mesh>
  {[0, 1, 2].map((i) => <mesh key={"s" + i} rotation={[0, 0, i * 2.09]} position={[0, 0, 0]}><boxGeometry args={[r * 2, 0.008, 0.008]} />{M.steel({ col: "#6a7076" })}</mesh>)}
</group>;

// ventilador chico del inductor: 6 paletas dentro de la voluta
export const Fan: React.FC<{ rot: number; r?: number; col?: string }> = ({ rot, r = 0.05, col = "#d8dde2" }) => <group rotation={[0, 0, rot]}>
  {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[0, 0.35, (i / 6) * 2 * PI]} position={[Math.cos((i / 6) * 2 * PI) * r * 0.5, Math.sin((i / 6) * 2 * PI) * r * 0.5, 0]}><boxGeometry args={[r * 0.9, r * 0.3, 0.004]} />{M.plastic({ col })}</mesh>)}
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[r * 0.18, r * 0.18, 0.02, 16]} />{M.steel()}</mesh>
</group>;

// llamita azul de quemador (k 0..1; t para el titileo)
export const Flame: React.FC<{ k: number; t: number; p?: V; s?: number; i?: number }> = ({ k, t, p = [0, 0, 0], s = 1, i = 0 }) => {
  const f = 1 + 0.08 * Math.sin(t * 19 + i * 2.1) + 0.05 * Math.sin(t * 31 + i);
  return <group position={p} scale={[s, s * z1(k) * f, s]}>
    <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.016, 0.07, 14, 1, true]} /><meshBasicMaterial color="#3a7dff" transparent opacity={0.85} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.022, 0]}><coneGeometry args={[0.009, 0.04, 12, 1, true]} /><meshBasicMaterial color="#bfe0ff" transparent opacity={0.9} depthWrite={false} toneMapped={false} /></mesh>
    <mesh position={[0, 0.06, 0]}><coneGeometry args={[0.01, 0.03, 10, 1, true]} /><meshBasicMaterial color="#ffb070" transparent opacity={0.35} depthWrite={false} toneMapped={false} /></mesh>
  </group>;
};

// el encendedor de superficie caliente: plaquita de cerámica que pasa de gris a naranja (heat 0..1)
export const Igniter: React.FC<{ heat: number; p?: V; s?: number }> = ({ heat, p = [0, 0, 0], s = 1 }) => <group position={p} scale={s}>
  <RBox s={[0.022, 0.03, 0.02]} p={[0, -0.02, 0]} r={0.004}>{M.porcelain({ col: "#efe8d8" })}</RBox>
  <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.012, 0.07, 0.004]} /><meshStandardMaterial color={heat > 0.05 ? "#ff8a2a" : "#6b6862"} emissive="#ff6a10" emissiveIntensity={3.2 * heat} toneMapped={false} /></mesh>
  {[-1, 1].map((sd) => <mesh key={sd} geometry={tubeG("igw" + sd, [[sd * 0.006, -0.035, 0], [sd * 0.02, -0.08, 0.01], [sd * 0.05, -0.1, 0.02]], 0.0022, 20, 6)}>{M.rubber({ col: sd > 0 ? "#f2f2f2" : "#f2f2f2" })}</mesh>)}
  <pointLight position={[0, 0.04, 0.03]} intensity={1.6 * heat} distance={0.5} color="#ff8a3a" />
</group>;

// placa de control: verde, relés, transformador y el LED que titila (led 0..1 = encendido; ok/err = color)
export const Board: React.FC<{ t: number; on: number; err?: number; p?: V; r?: V; s?: number }> = ({ t, on, err = 0, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => {
  const blink = on > 0.5 && Math.sin(t * (err > 0.5 ? 10 : 4)) > 0 ? 1 : 0;
  return <group position={p} rotation={r} scale={s}>
    <RBox s={[0.16, 0.11, 0.006]} r={0.002}><meshStandardMaterial color="#1f6a3a" roughness={0.55} /></RBox>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-0.06 + (i % 5) * 0.03, 0.03 - Math.floor(i / 5) * 0.025, 0.006]}><boxGeometry args={[0.012, 0.006, 0.006]} />{M.matte({ col: i % 3 ? "#1a1a1a" : "#c9a64a" })}</mesh>)}
    {[0, 1].map((i) => <RBox key={"r" + i} s={[0.025, 0.02, 0.018]} p={[0.04 + i * 0.03, -0.03, 0.012]} r={0.002}>{M.plastic({ col: "#e6c23a" })}</RBox>)}
    {/* transformador */}
    <RBox s={[0.04, 0.035, 0.03]} p={[-0.05, -0.03, 0.018]} r={0.003}>{M.steel({ col: "#7a7f84" })}</RBox>
    <mesh position={[-0.05, -0.03, 0.034]}><boxGeometry args={[0.03, 0.02, 0.004]} />{M.matte({ col: "#b5562a" })}</mesh>
    <mesh position={[0.065, 0.04, 0.008]}><sphereGeometry args={[0.005, 12, 8]} /><meshStandardMaterial color="#300" emissive={err > 0.5 ? "#ff3a2a" : "#3aff6a"} emissiveIntensity={3 * blink} toneMapped={false} /></mesh>
    <pointLight position={[0.065, 0.04, 0.03]} intensity={0.25 * blink} distance={0.2} color={err > 0.5 ? "#ff3a2a" : "#3aff6a"} />
  </group>;
};

// EL CALEFACTOR a gas, de frente, con la tapa de adelante sacable (open 0..1 = la tapa baja y se corre a la derecha).
// ind = inductor girando (0..1 velocidad), ign = encendedor al rojo, fl = llama, blow = soplador (velocidad), led = placa con luz
export type FurnaceK = { open?: number; ind?: number; ign?: number; fl?: number; blow?: number; led?: number; err?: number; hot?: number };
export const Furnace: React.FC<{ t: number; k: FurnaceK; p?: V; r?: V; s?: number; plate?: boolean }> = ({ t, k, p = [0, 0, 0], r = [0, 0, 0], s = 1, plate }) => {
  const open = k.open ?? 1, ind = k.ind ?? 0, ign = k.ign ?? 0, fl = k.fl ?? 0, blow = k.blow ?? 0, led = k.led ?? 0, hot = k.hot ?? fl;
  const W = 0.56, H = 1.1, D = 0.5;
  return <group position={p} rotation={r} scale={s}>
    {/* gabinete: laterales, techo, piso y fondo (el frente queda abierto) */}
    {[-1, 1].map((sd) => <RBox key={sd} s={[0.02, H, D]} p={[sd * (W / 2 - 0.01), H / 2, 0]} r={0.004}>{M.steel({ col: "#c3c7c9" })}</RBox>)}
    <RBox s={[W, 0.02, D]} p={[0, H - 0.01, 0]} r={0.004}>{M.steel({ col: "#c3c7c9" })}</RBox>
    <RBox s={[W, 0.02, D]} p={[0, 0.01, 0]} r={0.004}>{M.steel({ col: "#b9bdbf" })}</RBox>
    <mesh position={[0, H / 2, -D / 2 + 0.005]}><planeGeometry args={[W - 0.03, H - 0.03]} /><meshStandardMaterial color="#5d6266" roughness={0.6} metalness={0.4} /></mesh>
    {/* repisa del medio: separa los quemadores (arriba) del soplador (abajo) */}
    <RBox s={[W - 0.04, 0.015, D - 0.04]} p={[0, 0.5, 0]} r={0.003}>{M.steel({ col: "#9aa0a4" })}</RBox>
    {/* intercambiador de calor (tubos en S) que se pone rojo oscuro con la llama */}
    {[-0.16, -0.05, 0.06, 0.17].map((x, i) => <mesh key={i} position={[x, 0.82, -0.08]}><boxGeometry args={[0.07, 0.36, 0.2]} /><meshStandardMaterial color="#6f6a64" metalness={0.6} roughness={0.45} emissive="#a8301a" emissiveIntensity={0.35 * hot} /></mesh>)}
    {/* quemadores: caño de gas, válvula, 4 tubos con su llama */}
    <mesh position={[0, 0.6, 0.12]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.013, 0.013, W - 0.08, 14]} />{M.brass({ col: "#b08a4a" })}</mesh>
    {[-0.16, -0.05, 0.06, 0.17].map((x, i) => <group key={"b" + i} position={[x, 0.6, 0.06]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.13, 14]} />{M.steel({ col: "#8a8f94" })}</mesh>
      <Flame k={fl} t={t} i={i} p={[0, 0.03, -0.05]} s={1.1} />
    </group>)}
    <pointLight position={[0, 0.7, 0.12]} intensity={2.4 * fl} distance={1.1} color="#6aa0ff" />
    {/* válvula de gas (bloque) a la derecha con su caño negro que entra por el costado */}
    <RBox s={[0.07, 0.055, 0.05]} p={[0.2, 0.6, 0.16]} r={0.006}>{M.steel({ col: "#a9adb1" })}</RBox>
    <mesh position={[0.32, 0.6, 0.16]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.014, 0.014, 0.2, 14]} />{M.matte({ col: "#1d1d1f" })}</mesh>
    {/* encendedor entre el 1º y 2º quemador */}
    <Igniter heat={ign} p={[-0.105, 0.66, 0.06]} s={1.1} />
    {/* sensor de llama: varilla de metal al otro lado */}
    <mesh position={[0.115, 0.66, 0.05]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.07, 8]} />{M.steel({ col: "#d8d0b8" })}</mesh>
    {/* inductor: voluta redonda arriba a la izquierda con su ventilador y el caño blanco que sale por el techo */}
    <group position={[-0.14, 1.0, 0.12]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.065, 0.065, 0.05, 32]} />{M.plastic({ col: "#2a2c30" })}</mesh>
      <group position={[0, 0, 0.027]}><Fan rot={t * 40 * ind} r={0.055} /></group>
      <mesh position={[0, 0.0, 0.026]}><ringGeometry args={[0.058, 0.066, 32]} />{M.matte({ col: "#1a1a1a" })}</mesh>
    </group>
    <mesh position={[-0.14, 1.25, 0.05]}><cylinderGeometry args={[0.04, 0.04, 0.32, 24]} />{M.pvc()}</mesh>
    {/* placa de control a la derecha del inductor */}
    <Board t={t} on={led} err={k.err ?? 0} p={[0.12, 1.0, 0.12]} s={0.95} />
    {/* soplador abajo: la jaula de ardilla en su voluta + el motor */}
    <group position={[0, 0.25, 0.02]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.24, 40, 1, true]} /><meshStandardMaterial color="#8d9398" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} /></mesh>
      <group position={[0, 0, 0.0]} rotation={[0, 0, 0]}><group rotation={[0, 0, 0]}><group rotation={[PI / 2, 0, 0]}><group rotation={[-PI / 2, 0, 0]}><Cage rot={t * 30 * blow} r={0.14} w={0.2} /></group></group></group></group>
      <mesh position={[0.0, 0, 0.16]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.1, 24]} />{M.steel({ col: "#4a4f55" })}</mesh>
      {/* capacitor del motor */}
      <mesh position={[0.2, -0.08, 0.1]}><cylinderGeometry args={[0.025, 0.025, 0.08, 18]} />{M.steel({ col: "#c9ced3" })}</mesh>
    </group>
    {/* la tapa de adelante: se baja y se corre (open 1 = afuera) */}
    <group position={[(W + 0.12) * open, -0.0 - 0.02 * open, D / 2 + 0.01 + 0.06 * open]} rotation={[0, -0.25 * open, 0]}>
      <RBox s={[W, H * 0.98, 0.015]} p={[0, H / 2, 0]} r={0.006}>{M.steel({ col: "#cfd3d5" })}</RBox>
      {[0.3, 0.8].map((y) => <mesh key={y} position={[0, y, 0.009]}><planeGeometry args={[W * 0.6, 0.05]} />{M.matte({ col: "#7d8286" })}</mesh>)}
      {plate && <Txt3 txt="120 V · 7.0 A" w={0.22} h={0.05} bg="#d6d0bf" col="#2a2a2a" p={[-0.1, 0.62, 0.01]} />}
    </group>
  </group>;
};

// termostato redondo de pared (cuadro 0: 68°). temp = número; fan 0 = AUTO, 1 = ON (llavecita al costado)
export const Thermostat: React.FC<{ temp: number; fan?: number; on?: number; p?: V; r?: V; s?: number; flame?: number }> = ({ temp, fan = 0, on = 1, p = [0, 0, 0], r = [0, 0, 0], s = 1, flame = 0 }) => <group position={p} rotation={r} scale={s}>
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.025, 48]} />{M.chrome({ col: "#c9ced3" })}</mesh>
  <mesh position={[0, 0, 0.0128]}><circleGeometry args={[0.058, 48]} /><meshStandardMaterial color="#0d1218" emissive="#16304a" emissiveIntensity={0.6 * on} /></mesh>
  <Txt3 txt={`${Math.round(temp)}°`} w={0.07} h={0.035} col={on > 0.5 ? "#ffffff" : "#2a3440"} glow p={[0, 0.002, 0.014]} op={0.25 + 0.75 * on} />
  <mesh position={[0, -0.032, 0.0135]}><circleGeometry args={[0.006, 16]} /><meshBasicMaterial color={flame > 0.5 ? "#ff8a2a" : "#22303c"} toneMapped={false} /></mesh>
  {/* llave del ventilador al costado derecho: AUTO abajo, ON arriba */}
  <RBox s={[0.018, 0.045, 0.012]} p={[0.085, 0, 0.0]} r={0.003}>{M.plastic({ col: "#e9e7e1" })}</RBox>
  <RBox s={[0.012, 0.012, 0.012]} p={[0.085, -0.012 + 0.024 * fan, 0.009]} r={0.002}>{M.plastic({ col: fan > 0.5 ? "#d8361f" : "#2b6fd6" })}</RBox>
</group>;

// interruptor de transferencia del calefactor: caja gris con palanca (lev 0 = CASA, 1 = BATERÍA) y la toma de entrada
export const TSwitch: React.FC<{ lev: number; p?: V; r?: V; s?: number; labels?: boolean }> = ({ lev, p = [0, 0, 0], r = [0, 0, 0], s = 1, labels = true }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.16, 0.22, 0.07]} r={0.01}>{M.steel({ col: "#8e959b" })}</RBox>
  <group position={[0, 0.03, 0.038]} rotation={[0.9 - 1.8 * lev, 0, 0]}><RBox s={[0.03, 0.08, 0.02]} p={[0, 0.035, 0]} r={0.006}>{M.matte({ col: "#b22a20" })}</RBox></group>
  {labels && <Txt3 txt="HOUSE" w={0.1} h={0.022} col="#f7f4ee" bg="#2a2d31" p={[0, 0.095, 0.0365]} />}
  {labels && <Txt3 txt="BATTERY" w={0.1} h={0.022} col="#f7f4ee" bg="#1f5a8a" p={[0, -0.035, 0.0365]} />}
  {/* toma de entrada (inlet) redonda abajo */}
  <mesh position={[0, -0.075, 0.036]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.012, 24]} />{M.matte({ col: "#1c1d20" })}</mesh>
  {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.008, -0.072, 0.043]}><boxGeometry args={[0.003, 0.009, 0.002]} /><meshBasicMaterial color="#888" /></mesh>)}
</group>;

// pinza amperométrica amarilla (jaw 0 = abierta, 1 = cerrada) con su pantalla
export const Clamp: React.FC<{ jaw: number; val: string; p?: V; r?: V; s?: number }> = ({ jaw, val, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => <group position={p} rotation={r} scale={s}>
  <RBox s={[0.09, 0.2, 0.04]} p={[0, -0.1, 0]} r={0.015}>{M.plastic({ col: "#f2c21b" })}</RBox>
  <RBox s={[0.07, 0.055, 0.004]} p={[0, -0.07, 0.021]} r={0.004}>{M.matte({ col: "#2a2c28" })}</RBox>
  <mesh position={[0, -0.07, 0.0235]}><planeGeometry args={[0.062, 0.045]} /><meshStandardMaterial color="#b9c9b0" emissive="#a9d3a0" emissiveIntensity={0.3} /></mesh>
  <Txt3 txt={val} w={0.058} h={0.03} col="#14231a" p={[0, -0.07, 0.0245]} font="Courier New" />
  <mesh position={[0, -0.15, 0.022]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.017, 0.017, 0.01, 24]} />{M.matte({ col: "#1c1d20" })}</mesh>
  {/* las dos mordazas: medio anillo cada una; la derecha abre */}
  <group position={[0, 0.045, 0]}>
    <mesh rotation={[0, 0, PI / 2]}><torusGeometry args={[0.045, 0.012, 10, 24, PI]} />{M.plastic({ col: "#1c1d20" })}</mesh>
    <group position={[0.045, -0.0, 0]} rotation={[0, 0, -0.9 * (1 - cl(jaw))]}><group position={[-0.045, 0, 0]}><mesh rotation={[0, 0, -PI / 2]}><torusGeometry args={[0.045, 0.012, 10, 24, PI]} />{M.plastic({ col: "#1c1d20" })}</mesh></group></group>
  </group>
</group>;
