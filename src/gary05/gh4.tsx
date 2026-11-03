// gary05 · componentes únicos 4/4 (min 16-21).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, rn, tubeG } from "./h3d";
import { PI, Txt3, Mark, PBox, roll } from "./gk";
import { Cage, Clamp, Flame, Furnace, Thermostat, TSwitch } from "./fk";

type V = [number, number, number];
const z1 = (k: number) => Math.max(0.001, k);

// 16:10 · LA ESTUFA PARA ADENTRO: la estufa de garrafa con su llama; primero se ladea y cae: la llama se apaga en el acto
// (clic del interruptor de vuelco); la levantan, y la aguja del oxígeno baja hasta la raya: se apaga otra vez sola.
export const HIndoorHeater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.08, 0.18, 0], az: [-0.4, -0.1], el: [0.16, 0.1], r: [1.55, 1.38], fov: 34 }}>{(tt) => {
  const tip = eio(tt, 0.6, 1.0) * (1 - eio(tt, 1.9, 2.3)), o2 = lerp(21, 18, eio(tt, 2.6, 3.8)), out1 = tt > 0.85 && tt < 2.4, out2 = tt > 3.7;
  const fl = out1 || out2 ? 0.001 : 1;
  return <>
    <group rotation={[0, 0, -tip * 1.2]} position={[0.12 * tip, 0, 0]}>
      <RBox s={[0.36, 0.3, 0.18]} p={[0, 0.15, 0]} r={0.03}>{M.plastic({ col: "#c62a22" })}</RBox>
      {/* la cerámica que se pone naranja */}
      <mesh position={[0, 0.17, 0.092]}><planeGeometry args={[0.26, 0.16]} /><meshStandardMaterial color="#3a2a22" emissive="#ff6a20" emissiveIntensity={1.6 * (fl > 0.5 ? 1 : 0)} toneMapped={false} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.11 + i * 0.044, 0.17, 0.094]}><boxGeometry args={[0.004, 0.16, 0.002]} />{M.matte({ col: "#2a1a12" })}</mesh>)}
      <mesh position={[0.15, 0.31, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.05, 0.01, 8, 20, PI]} />{M.matte({ col: "#1f2125" })}</mesh>
    </group>
    <pointLight position={[0, 0.2, 0.3]} intensity={1.6 * (fl > 0.5 ? 1 : 0)} distance={1.2} color="#ff9a5a" />
    <Txt3 txt="TIP-OVER SWITCH" w={0.34} h={0.05} col="#f2c21b" glow p={[0.1, 0.52, 0]} op={cl((tt - 0.9) / 0.3) * (1 - cl((tt - 2.3) / 0.3))} />
    {/* el medidor de oxígeno */}
    <group position={[0.5, 0.25, 0.05]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.03, 36]} />{M.plastic({ col: "#e9e7e1" })}</mesh>
      <mesh position={[0.06, -0.05, 0.017]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.04, 0.004, 0.002]} />{M.matte({ col: "#c62a22" })}</mesh>
      <group position={[0, -0.03, 0.018]} rotation={[0, 0, 1.0 - 2.0 * ((o2 - 16) / 6)]}><mesh position={[0, 0.05, 0]}><boxGeometry args={[0.004, 0.1, 0.003]} />{M.matte({ col: "#1b1d21" })}</mesh></group>
      <Txt3 txt={`O₂ ${o2.toFixed(1)}%`} w={0.14} h={0.04} col="#1b1d21" p={[0, -0.06, 0.018]} />
    </group>
    <Txt3 txt="LOW-OXYGEN SHUTOFF" w={0.4} h={0.05} col="#6fe39a" glow p={[0.4, 0.52, 0]} op={cl((tt - 3.8) / 0.3)} />
  </>;
}}</Scene3D>;

// 17:57 · LAS TRES DE WALT: tres ganchos en el tablero; cuelgan de a uno con balanceo el detector de CO (RESPIRAR),
// la varilla del sensor con su llamita (LLAMA) y el osciloscopio con la onda redonda (CORRIENTE LIMPIA); cada uno se prende.
export const HBreathe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#100d0a"
  cam={{ at: [0, 0.12, 0], az: [-0.15, 0.12], el: [0.08, 0.05], r: [1.35, 1.15], fov: 34 }}>{(tt) => {
  const T = [0.3, 1.2, 2.1], sw = (a: number) => tt < a ? 0 : 0.5 * Math.exp(-(tt - a) * 1.6) * Math.sin((tt - a) * 6), on = (a: number) => cl((tt - a - 0.4) / 0.3);
  const L = ["BREATHE", "FLAME", "CLEAN POWER"];
  return <>
    <RBox s={[1.4, 0.9, 0.04]} p={[0, 0.2, -0.08]} r={0.012}>{M.wood({ base: [122, 88, 56] })}</RBox>
    {T.map((a, i) => { const x = -0.42 + i * 0.42, drop = tt < a ? 0.6 : (1 - phys(tt, a, 9, 0.4)) * 0.6;
      return <group key={i}>
        <mesh position={[x, 0.46, -0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.08, 14]} />{M.brass()}</mesh>
        <group position={[x, 0.46 + drop, 0]} rotation={[0, 0, sw(a)]} visible={tt > a - 0.02}>
          <mesh position={[0, -0.02, 0]}><torusGeometry args={[0.024, 0.005, 8, 20]} />{M.brass()}</mesh>
          <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.002, 0.002, 0.06, 6]} />{M.rubber({ col: "#2a2b2e" })}</mesh>
          <group position={[0, -0.2, 0]} scale={1.35}>
            {i === 0 && <><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.035, 36]} />{M.plastic({ col: "#f3f1ea" })}</mesh>
              <mesh position={[0.05, 0.03, 0.019]}><circleGeometry args={[0.008, 12]} /><meshStandardMaterial color="#132" emissive="#3aff6a" emissiveIntensity={3 * on(a)} toneMapped={false} /></mesh>
              <Txt3 txt="CO" w={0.08} h={0.045} col="#1b1d21" p={[0, -0.02, 0.019]} /></>}
            {i === 1 && <><mesh rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.006, 0.006, 0.2, 10]} />{M.steel({ col: "#d9dcdf" })}</mesh>
              <Flame k={on(a)} t={tt} s={1.8} p={[0.03, -0.1, 0.02]} /></>}
            {i === 2 && <><RBox s={[0.22, 0.15, 0.06]} r={0.01}>{M.plastic({ col: "#2a2c30" })}</RBox>
              <mesh position={[0, 0.005, 0.031]}><planeGeometry args={[0.18, 0.1]} /><meshBasicMaterial color="#0d1a12" /></mesh>
              <mesh position={[0, 0.005, 0.033]} geometry={tubeG("bsine", Array.from({ length: 40 }, (_, j) => [-0.08 + j * 0.16 / 39, 0.03 * Math.sin(j / 39 * 4 * PI + tt * 2), 0]), 0.002, 80, 4)}>{M.glow({ col: "#6fe39a", op: on(a) })}</mesh></>}
          </group>
        </group>
        <Txt3 txt={L[i]} w={0.3} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[x, -0.16, 0.0]} op={on(a)} />
      </group>; })}
  </>;
}}</Scene3D>;

// 18:12 · TRES DÍAS EN UN DIORAMA: la casita gira sobre la bandeja; el cielo de atrás pasa de tarde a noche a día tres
// veces; la estación al lado baja de noche y sube de día con el auto; el termostato queda en 62.
export const HThreeDay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" bg="#0a0c12"
  cam={{ at: [0, 0.3, 0], az: [-0.35, 0.25], el: [0.2, 0.14], r: [1.85, 1.65], fov: 34 }}>{(tt) => {
  const u = cl((tt - 0.3) / 4.5) * 3, ph = u % 1, day = Math.floor(Math.min(2.999, u)), night = Math.sin(PI * cl(ph * 1.4)) ;
  const sky = `rgb(${Math.round(lerp(110, 10, night))},${Math.round(lerp(140, 14, night))},${Math.round(lerp(180, 34, night))})`;
  const pct = Math.round(lerp(100, 25, night * (ph < 0.7 ? 1 : 0.6)) + 0 * day);
  return <>
    <mesh position={[0, 0.5, -0.8]}><planeGeometry args={[3, 1.6]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.42, 0.42, 0.04, 48]} />{M.wood({ base: [120, 86, 54] })}</mesh>
    <group position={[0, 0.04, 0]} rotation={[0, tt * 0.35, 0]}>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.4, 40]} /><meshStandardMaterial color="#f1f4f8" roughness={0.9} /></mesh>
      <RBox s={[0.34, 0.2, 0.26]} p={[0, 0.1, 0]} r={0.01}>{M.matte({ col: "#d9cdb4" })}</RBox>
      <mesh position={[0, 0.25, 0]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.27, 0.14, 4]} />{M.matte({ col: "#5a3a2a" })}</mesh>
      {[-0.08, 0.08].map((x) => <mesh key={x} position={[x, 0.12, 0.131]}><planeGeometry args={[0.06, 0.06]} /><meshStandardMaterial color="#2a2a2a" emissive="#ffb85a" emissiveIntensity={1.4 * night} toneMapped={false} /></mesh>)}
    </group>
    <PBox w={0.24} h={0.18} d={0.14} p={[0.62, 0, 0.1]} scr={`${pct}%`} scrCol={pct < 35 ? "#ffcf4a" : "#4dff9a"} />
    <Thermostat temp={62} p={[-0.62, 0.2, 0.1]} s={0.9} />
    <Txt3 txt={`${night > 0.5 ? "NIGHT" : "DAY"} ${day + 1}`} w={0.3} h={0.07} col="#ffffff" glow p={[0, 0.62, 0]} />
  </>;
}}</Scene3D>;

// 19:42 · LA PERILLA DEL VENTILADOR: dos sótanos iguales con la misma estación; a la izquierda FAN ON: la jaula del
// soplador gira sin parar y la batería se va en picada; a la derecha FAN AUTO: gira sólo cuando hay llama y dura el doble.
export const HFanSwitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0c0e12"
  cam={{ at: [0, 0.4, 0], az: [-0.15, 0.12], el: [0.12, 0.08], r: [1.85, 1.65], fov: 34 }}>{(tt) => {
  const u = cl((tt - 0.5) / 4.0), cyc = (Math.sin(tt * 2.2) > 0.2 ? 1 : 0);
  const Side: React.FC<{ x: number; on: boolean }> = ({ x, on }) => { const pct = Math.round(lerp(100, on ? 18 : 62, u)), spin = on ? 1 : cyc;
    return <group position={[x, 0, 0]}>
      <Thermostat temp={62} fan={on ? 1 : 0} p={[0, 0.55, 0]} s={1.0} />
      <group position={[-0.12, 0.2, 0]}><Cage rot={tt * 9 * spin} r={0.1} w={0.14} /></group>
      <PBox w={0.22} h={0.16} d={0.13} p={[0.15, 0, 0.05]} scr={`${pct}%`} scrCol={pct < 30 ? "#ff6a5a" : "#4dff9a"} />
      <Txt3 txt={on ? "FAN: ON" : "FAN: AUTO"} w={0.24} h={0.06} col={on ? "#ff6a5a" : "#6fe39a"} glow p={[0, 0.8, 0]} />
    </group>; };
  return <>
    <Side x={-0.45} on />
    <Side x={0.45} on={false} />
    <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.006, 0.9, 0.006]} />{M.glow({ col: "#3a3f48" })}</mesh>
  </>;
}}</Scene3D>;

// 20:31 · EL REPASO EN EL BANCO: la linterna barre el banco de izquierda a derecha y frena en cada cosa, que se levanta un
// poco con su rótulo: la chapa, la pinza, el inversor de onda pura, la caja LFP, la llave de transferencia, el termostato en
// 62 y el detector de CO.
export const HBenchRecap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0d0c0b" warm={0.6}
  cam={{ at: [-0.45, 0.1, 0], at1: [0.45, 0.1, 0], az: [-0.2, 0.15], el: [0.26, 0.22], r: [1.15, 1.08], fov: 36 }}>{(tt) => {
  const N = 7, xs = Array.from({ length: N }, (_, i) => -0.66 + i * 0.22), step = 0.6 + 0.0, beam = lerp(-0.8, 0.8, cl((tt - 0.3) / (N * 0.6 + 0.3)));
  const lab = ["DATA PLATE", "CLAMP", "PURE SINE", "1000 Wh LFP", "TRANSFER", "62°", "CO ALARM"];
  return <>
    <pointLight position={[beam, 0.5, 0.35]} intensity={3.2} distance={1.0} color="#fff1d0" />
    {xs.map((x, i) => { const at = 0.3 + i * step, k = cl((tt - at) / 0.3), lift = tt < at ? 0 : (1 - Math.abs(1 - phys(tt, at, 8, 0.45))) * 0.0 + 0.04 * cl(phys(tt, at, 8, 0.45));
      return <group key={i} position={[x, 0.01 + lift, 0]}>
        {i === 0 && <RBox s={[0.16, 0.01, 0.1]} p={[0, 0.005, 0]} r={0.004}>{M.steel({ col: "#b9bec2" })}</RBox>}
        {i === 1 && <Clamp jaw={1} val="4.8A" s={0.7} p={[0, 0.12, 0]} />}
        {i === 2 && <><RBox s={[0.16, 0.07, 0.11]} p={[0, 0.035, 0]} r={0.008}>{M.steel({ col: "#7d848b" })}</RBox>
          {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[-0.06 + j * 0.024, 0.075, 0]}><boxGeometry args={[0.004, 0.02, 0.1]} />{M.steel({ col: "#9aa0a6" })}</mesh>)}</>}
        {i === 3 && <PBox w={0.17} h={0.13} d={0.11} scr="LFP" />}
        {i === 4 && <TSwitch lev={1} s={0.7} p={[0, 0.06, 0]} labels={false} />}
        {i === 5 && <Thermostat temp={62} s={0.6} p={[0, 0.08, 0]} r={[-0.5, 0, 0]} />}
        {i === 6 && <><mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 32]} />{M.plastic({ col: "#f3f1ea" })}</mesh>
          <mesh position={[0.03, 0.036, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.007, 12]} /><meshStandardMaterial color="#132" emissive="#3aff6a" emissiveIntensity={3 * k} toneMapped={false} /></mesh></>}
        <Txt3 txt={lab[i]} w={0.21} h={0.055} col="#f7f4ee" bg="#1b1d21" p={[0, -0.0, 0.1]} r={[-0.6, 0, 0]} op={k} />
      </group>; })}
  </>;
}}</Scene3D>;

// 16:58 · EL CABLE FINO: los dos cables cortados de frente como un salame: el de la cocina muestra un hilito de cobre y
// el pesado un mazo gordo; corre la corriente del calefactor y la cámara térmica pinta el fino de amarillo a rojo.
export const HCordGauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#0b0c0f"
  cam={{ at: [0, 0.0, 0], az: [-0.55, -0.3], el: [0.12, 0.08], r: [1.6, 1.45], fov: 34 }}>{(tt) => {
  const heat = eio(tt, 1.6, 3.6), hot = `rgb(${Math.round(lerp(60, 255, heat))},${Math.round(lerp(90, lerp(200, 40, heat), heat))},${Math.round(lerp(200, 20, heat))})`;
  const Cord: React.FC<{ y: number; R: number; cu: number; n: number; thin?: boolean }> = ({ y, R, cu, n, thin }) => <group position={[0, y, 0]}>
    <mesh rotation={[0, 0, PI / 2]} position={[-0.35, 0, 0]}><cylinderGeometry args={[R, R, 0.7, 32]} />{thin ? <meshStandardMaterial color={heat > 0.05 ? hot : "#e9e6de"} emissive={hot} emissiveIntensity={0.6 * heat} /> : <meshStandardMaterial color={heat > 0.05 ? "#3a6ad0" : "#d8c23a"} emissive="#2a4aa0" emissiveIntensity={0.2 * heat} />}</mesh>
    <mesh rotation={[0, 0, PI / 2]} position={[0.0, 0, 0]}><circleGeometry args={[R * 0.98, 32]} />{M.matte({ col: "#2b2c2e" })}</mesh>
    {Array.from({ length: n }, (_, i) => { const a = i * 2.4, rr = cu * Math.sqrt((i + 0.5) / n); return <mesh key={i} position={[0.002, Math.sin(a) * rr, Math.cos(a) * rr]} rotation={[0, PI / 2, 0]}><circleGeometry args={[cu / Math.sqrt(n) * 0.9, 10]} /><meshStandardMaterial color="#d9873a" metalness={0.9} roughness={0.3} emissive="#ff4a10" emissiveIntensity={thin ? 1.2 * heat : 0} /></mesh>; })}
  </group>;
  return <group rotation={[0, -PI / 2 + 0.0, 0]}>
    <Cord y={0.16} R={0.035} cu={0.013} n={7} thin />
    <Cord y={-0.14} R={0.07} cu={0.034} n={37} />
    <group rotation={[0, PI / 2, 0]}>
      <Txt3 txt="KITCHEN CORD" w={0.3} h={0.05} col={heat > 0.5 ? "#ff6a5a" : "#f7f4ee"} glow={heat > 0.5} p={[0.0, 0.27, 0.2]} />
      <Txt3 txt="HEAVY CORD · RATED" w={0.38} h={0.05} col="#6fe39a" p={[0.0, -0.27, 0.2]} />
      <Txt3 txt={`${Math.round(lerp(70, 160, heat))}°F`} w={0.16} h={0.06} col={hot} glow p={[0.3, 0.16, 0.2]} op={cl((tt - 1.6) / 0.3)} />
    </group>
  </group>;
}}</Scene3D>;
