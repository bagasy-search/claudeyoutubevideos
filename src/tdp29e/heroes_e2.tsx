// tdp29e · componentes 13-24: la torta de cumpleaños, la casa que se vacía, la cena aparte, lo que ofrece la cárcel, los futones, el taller, el patio, las celadoras enfermeras, las cartas, la puerta giratoria, el portón, el mapa de trenes.
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, rn } from "./h3d";
import { Coin, HANDF, PI, Sheet, pop, txt } from "./lkit3d";
import { Bowl, Calendar, Clock24, Fig, House, Letter, Onigiri } from "./tkit3d";
import { Gran } from "./heroes_e1";

// ---- 6:16 · LA TORTA: de noche, en una mesa chica, una torta individual con la etiqueta amarilla de descuento; se prende una sola vela; al lado, el número 84 ----
export const HCake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0c0a08" lamp={[-0.2, 0.5, 0.5]} warm={0.9}
  cam={{ at: [0, 0.07, 0], az: [-0.3, -0.05], el: [0.3, 0.22], r: [0.5, 0.36], fov: 32 }}>{(tt) => {
  const lit = eio(tt, 2.0, 2.6), fl = 1 + 0.08 * Math.sin(tt * 9);
  return <>
    <RBox s={[0.9, 0.03, 0.5]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [96, 68, 46] })}</RBox>
    <mesh position={[0, 0.003, 0]}><cylinderGeometry args={[0.075, 0.075, 0.004, 40]} />{M.porcelain({ col: "#f2efe8" })}</mesh>
    <RBox s={[0.08, 0.05, 0.06]} r={0.006} p={[0, 0.03, 0]}>{M.matte({ col: "#f6efe2" })}</RBox>
    <RBox s={[0.082, 0.012, 0.062]} r={0.006} p={[0, 0.052, 0]}>{M.matte({ col: "#f2c8c8" })}</RBox>
    <mesh position={[0.016, 0.0595, 0.012]}><sphereGeometry args={[0.009, 16, 12]} /><meshPhysicalMaterial color="#c8202a" roughness={0.2} clearcoat={1} /></mesh>
    <mesh position={[-0.02, 0.075, -0.01]}><cylinderGeometry args={[0.0025, 0.0025, 0.035, 10]} />{M.matte({ col: "#7ab0d8" })}</mesh>
    {lit > 0 && <mesh position={[-0.02, 0.097, -0.01]} scale={[lit, lit * fl, lit]}><sphereGeometry args={[0.005, 12, 10]} />{M.glow({ col: "#ffcf6a" })}</mesh>}
    <pointLight position={[-0.02, 0.11, -0.01]} intensity={0.9 * lit} distance={0.45} color="#ffb860" />
    <mesh position={[0.045, 0.03, 0.031]} rotation={[0, 0, -0.1]} scale={pop(tt, 0.8)}><circleGeometry args={[0.014, 24]} /><meshStandardMaterial map={txt("ck50", ["50%"], { w: 128, h: 128, bg: "#f4d03f", fg: "#b8302a", size: 52 })} /></mesh>
    <Sheet map={txt("ck84", ["84"], { w: 260, h: 180, bg: "#f6f1e4", fg: "#2a2420", size: 130, font: HANDF })} w={0.08} h={0.055} p={[0.15, 0.004, 0.06]} r={[-PI / 2, 0, -0.1]} s={pop(tt, 3.6)} em={0.3 * lit} />
    <RBox s={[0.1, 0.004, 0.06]} r={0.002} p={[-0.16, 0.002, 0.05]}>{M.matte({ col: "#e8e2d2" })}</RBox>
    <mesh position={[-0.16, 0.0045, 0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.09, 0.05]} /><meshStandardMaterial map={txt("ckrec", ["2 rice balls  50%", "vegetables  30%", "cake  50%"], { w: 360, h: 200, bg: "#e8e2d2", fg: "#2a2420", size: 34, align: "left" })} /></mesh>
  </>;
}}</Scene3D>;

// ---- 6:48 · LA CASA QUE SE VACÍA: casa de dos pisos en corte; las piezas se apagan una por una (el marido, los hijos, las amigas); queda sólo la luz azul de la tele ----
export const HEmptyHouse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0c0e14" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.18, 0], az: [-0.2, 0.1], el: [0.15, 0.1], r: [0.95, 0.8], fov: 32 }}>{(tt) => {
  const R: [number, number, string, string][] = [[-0.16, 0.08, "husband", "#2a2c34"], [0.16, 0.08, "", ""], [-0.16, 0.26, "the kids", "#4a6a8a"], [0.16, 0.26, "friends", "#8a6a5a"]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#1a1c22" /></mesh>
    <RBox s={[0.68, 0.38, 0.02]} r={0.004} p={[0, 0.19, -0.11]}>{M.matte({ col: "#3a3630" })}</RBox>
    <mesh position={[0, 0.43, -0.02]} rotation={[0, PI / 4, 0]}><coneGeometry args={[0.5, 0.12, 4]} />{M.matte({ col: "#2a2c30" })}</mesh>
    {[0.0, 0.18, 0.36].map((y, i) => <RBox key={"f" + i} s={[0.66, 0.012, 0.22]} r={0.002} p={[0, y, -0.01]}>{M.wood({ base: [110, 80, 54] })}</RBox>)}
    <RBox s={[0.012, 0.36, 0.22]} r={0.002} p={[0, 0.18, -0.01]}>{M.matte({ col: "#3a3630" })}</RBox>
    {R.map(([x, y, l, c], i) => { const off = i === 1 ? 0 : eio(tt, 1.0 + i * 1.3, 1.6 + i * 1.3);
      return <group key={i}>
        <mesh position={[x, y + 0.08, -0.099]}><planeGeometry args={[0.3, 0.16]} /><meshBasicMaterial color={new THREE.Color(i === 1 ? "#0e1220" : "#ffcf8a").lerp(new THREE.Color("#14161c"), i === 1 ? 0 : off)} toneMapped={false} /></mesh>
        {i !== 1 && <group position={[x, y + 0.006, 0.02]} scale={Math.max(0.001, 1 - off)}><Fig s={1.0} cloth={c} /></group>}
        {i !== 1 && <Sheet map={txt("eh" + i, [l], { w: 260, h: 80, bg: "#f6f1e4", fg: "#2a2420", size: 48, font: HANDF })} w={0.09} h={0.028} p={[x + 0.08, y + 0.14, 0.03]} s={0.001 + (1 - off) * pop(tt, 0.4)} em={0.15} />}
        {i !== 1 && <pointLight position={[x, y + 0.12, 0.05]} intensity={0.4 * (1 - off)} distance={0.3} color="#ffcf8a" />}
      </group>; })}
    <group position={[0.16, 0.0, -0.02]}>
      <Gran p={[-0.05, 0.006, 0.03]} r={[0, 0.5, 0]} s={1.0} sit={1} />
      <RBox s={[0.07, 0.05, 0.02]} r={0.003} p={[0.07, 0.04, -0.04]}>{M.matte({ col: "#1a1a1a" })}</RBox>
      <mesh position={[0.07, 0.04, -0.029]}><planeGeometry args={[0.06, 0.04]} /><meshBasicMaterial color={new THREE.Color("#6a8ac8").multiplyScalar(0.8 + 0.2 * Math.sin(tt * 7))} toneMapped={false} /></mesh>
      <pointLight position={[0.06, 0.06, 0.02]} intensity={0.5} distance={0.25} color="#8aa8e8" />
    </group>
  </>;
}}</Scene3D>;

// ---- 7:14 · LA CENA APARTE: la familia come a las 7 en la mesa grande; la abuela come sola a las 8:30 en la mesita del rincón ----
export const HSeparate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [-0.08, 0.08, 0], at1: [0.18, 0.06, 0.02], az: [-0.45, -0.25], el: [0.45, 0.4], r: [0.9, 0.75], fov: 32 }}>{(tt) => {
  const fam = 1 - eio(tt, 2.8, 3.6), her = eio(tt, 3.6, 4.4), hr = lerp(19, 20.5, eio(tt, 2.6, 4.0));
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b8ad7c" roughness={0.9} /></mesh>
    <RBox s={[0.36, 0.06, 0.2]} r={0.006} p={[-0.12, 0.03, 0]}>{M.wood({ base: [90, 60, 40] })}</RBox>
    {[[-0.24, -0.13], [-0.12, -0.13], [0.0, -0.13], [-0.18, 0.13], [-0.06, 0.13]].map(([x, z], i) => <group key={i}>
      <Bowl p={[x, 0.06, z * 0.45]} s={0.5} soup={i % 2 === 0} />
      <group scale={Math.max(0.001, fam)} position={[x, 0, z]}><Fig s={0.9} sit={1} r={[0, z > 0 ? PI : 0, 0]} cloth={["#4a6a8a", "#8a4a4a", "#5a7a5a", "#d8c8a0", "#6a5a7a"][i]} /></group>
    </group>)}
    <RBox s={[0.1, 0.04, 0.08]} r={0.004} p={[0.3, 0.02, 0.06]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <Bowl p={[0.3, 0.04, 0.06]} s={0.45} />
    <group scale={Math.max(0.001, her)}><Gran p={[0.3, 0, 0.14]} r={[0, PI, 0]} s={0.9} sit={1} head={0.3} /></group>
    <Clock24 p={[0.1, 0.24, -0.2]} s={0.4} h={hr} />
    <pointLight position={[0.3, 0.2, 0.1]} intensity={0.4 + 0.5 * her} distance={0.4} color="#ffcf8a" />
  </>;
}}</Scene3D>;

// ---- 7:29 · LO QUE OFRECE: una bandeja de cárcel; aparecen de a uno: comida caliente, el tensiómetro, la estufa encendida, el horario, y alrededor, otras mujeres ----
export const HOffers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#14161c" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.14, -0.08], az: [-0.12, 0.08], el: [0.58, 0.5], r: [1.1, 1.0], fov: 32 }}>{(tt) => {
  const I: [number, string][] = [[-0.24, "three meals"], [-0.08, "a doctor"], [0.08, "heating"], [0.24, "a schedule"]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#3a3e48" roughness={0.9} /></mesh>
    {[[-0.33, -0.13], [0.33, -0.13], [-0.33, 0.13], [0.33, 0.13]].map(([x, z], i) => <mesh key={"lg" + i} position={[x, 0.05, z]}><cylinderGeometry args={[0.006, 0.006, 0.1, 8]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
    <RBox s={[0.06, 0.075, 0.06]} r={0.006} p={[0, 0.0375, -0.26]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <Gran p={[0, 0.0, -0.26]} s={1.6} sit={1} cloth="#8a8a8e" arm={0.3 * eio(tt, 0.4, 1.0)} head={0.2} />
    <group position={[0, 0.1, 0]}>
    <RBox s={[0.7, 0.012, 0.3]} r={0.01} p={[0, 0.006, 0]}>{M.wood({ base: [96, 68, 46] })}</RBox>
    {I.map(([x, l], i) => { const a = 0.4 + i * 1.0, s = pop(tt, a);
      return <group key={i}>
        <group position={[x, 0.012, -0.03]} scale={s}>
          {i === 0 && <><Bowl p={[-0.03, 0, 0]} s={0.6} /><Bowl p={[0.03, 0, 0.02]} s={0.55} soup />{Array.from({ length: 8 }, (_, k) => { const q = ((tt * 0.4 + rn(k, 3)) % 1); return <mesh key={k} position={[0.03 + Math.sin(k + tt) * 0.01, 0.04 + q * 0.08, 0.02]} scale={0.004 + 0.006 * q}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.2 * (1 - q)} depthWrite={false} /></mesh>; })}</>}
          {i === 1 && <><RBox s={[0.07, 0.025, 0.05]} r={0.006} p={[0, 0.0125, 0]}>{M.pvc({ col: "#f2f2ee" })}</RBox><mesh position={[0, 0.026, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.04, 0.025]} /><meshBasicMaterial color="#9ad89a" toneMapped={false} /></mesh><mesh position={[0.02, 0.008, 0.04]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.008, 10, 24]} />{M.matte({ col: "#2a4a7a" })}</mesh></>}
          {i === 2 && <><RBox s={[0.07, 0.06, 0.04]} r={0.006} p={[0, 0.03, 0]}>{M.steel({ col: "#d8d4cc" })}</RBox>{[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.02 + k * 0.012, 0.021]}><planeGeometry args={[0.05, 0.004]} />{M.glow({ col: "#ff7a3a", op: 0.9 })}</mesh>)}<pointLight position={[0, 0.04, 0.05]} intensity={0.5 * s} distance={0.2} color="#ff9a5a" /></>}
          {i === 3 && <RBox s={[0.07, 0.004, 0.09]} r={0.002} p={[0, 0.002, 0]}>{M.matte({ col: "#f6f1e4" })}</RBox>}
          {i === 3 && <mesh position={[0, 0.0045, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.065, 0.085]} /><meshStandardMaterial map={txt("sch", ["6:45 wake", "7:00 eat", "8:00 work", "12:00 eat", "17:00 eat", "21:00 lights"], { w: 260, h: 340, bg: "#f6f1e4", fg: "#22304e", size: 34, align: "left" })} /></mesh>}
        </group>
        <Sheet map={txt("of2" + i, [l], { w: 340, h: 100, bg: "#2a2420", fg: "#f6f1e4", size: 62 })} w={0.15} h={0.044} p={[x, 0.014, 0.1]} r={[-PI / 2, 0, 0]} s={s} em={0.2} />
      </group>; })}
    </group>
    {[-0.38, -0.22, 0.22, 0.38].map((x, i) => { const k = eio(tt, 4.4 + i * 0.2, 5.6 + i * 0.2), sx = x < 0 ? -1 : 1; return k > 0 ? <Gran key={"w" + i} p={[x + sx * 0.5 * (1 - k), 0, -0.3 + Math.abs(x) * 0.15]} r={[0, -sx * (PI / 2) * (1 - k) + (x < 0 ? 0.5 : -0.5) * k, 0]} s={1.5} cloth={["#7a8a9a", "#9a7a8a", "#8a9a7a", "#7a7a9a"][i]} arm={0.3 * Math.sin(tt * 8) * (1 - k)} arm2={-0.3 * Math.sin(tt * 8) * (1 - k)} /> : null; })}
    <Sheet map={txt("ofppl", ["and people"], { w: 300, h: 80, bg: "#ffd59a", fg: "#2a2420", size: 50, font: HANDF })} w={0.13} h={0.035} p={[0, 0.003, 0.24]} r={[-PI / 2, 0, 0]} s={pop(tt, 5.6)} em={0.3} />
  </>;
}}</Scene3D>;

// ---- 8:12 · LOS FUTONES: seis futones en fila sobre el tatami se doblan solos en cuadrados exactos, uno detrás de otro; las reclusas se paran en fila ----
export const HFuton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14161c" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.04, 0.04], at1: [0.03, 0.07, 0.04], az: [-0.45, -0.3], el: [0.6, 0.45], r: [0.95, 0.88], fov: 32 }}>{(tt) => <>
  <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#b8ad7c" roughness={0.9} /></mesh>
  {Array.from({ length: 6 }, (_, i) => { const x = -0.3 + i * 0.12, f1 = eio(tt, 0.6 + i * 0.45, 1.1 + i * 0.45), f2 = eio(tt, 1.2 + i * 0.45, 1.7 + i * 0.45), up = eio(tt, 3.9 + i * 0.12, 5.2 + i * 0.12);
    return <group key={i} position={[x, 0, 0]}>
      <RBox s={[0.09, 0.012, 0.2 - 0.1 * f1]} r={0.004} p={[0, 0.006, -0.05 * f1]}>{M.matte({ col: "#e8e6e0" })}</RBox>
      {f1 > 0.02 && <group position={[0, 0.012, -0.0]} rotation={[-PI * f1, 0, 0]}><RBox s={[0.09, 0.012, 0.1]} r={0.004} p={[0, 0.006, 0.05]}>{M.matte({ col: "#d8dde6" })}</RBox></group>}
      {f2 > 0.02 && <RBox s={[0.09, 0.024 * f2, 0.1]} r={0.004} p={[0, 0.024 + 0.012 * f2, -0.05]}>{M.matte({ col: "#e8e6e0" })}</RBox>}
      <RBox s={[0.06, 0.016, 0.035]} r={0.008} p={[0, 0.02 + 0.024 * f2, -0.12 + 0.04 * f2]}>{M.matte({ col: "#c8d4e0" })}</RBox>
      {up > 0 && <Fig p={[x < 0 ? -0.45 * (1 - up) : 0.45 * (1 - up), 0, 0.14]} r={[0, PI + (x < 0 ? -1 : 1) * (PI / 2) * (1 - up), 0]} s={1.1} cloth="#7a8a9a" arm={0.3 * Math.sin(tt * 8) * (1 - up)} arm2={-0.3 * Math.sin(tt * 8) * (1 - up)} />}
    </group>; })}
  <Sheet map={txt("fut", ["6:45 · wake-up"], { w: 420, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 56 })} w={0.17} h={0.036} p={[0.0, 0.004, 0.22]} r={[-PI / 2, 0, 0]} s={pop(tt, 0.4)} em={0.25} />
</>}</Scene3D>;

// ---- 8:29 · EL TALLER: mesitas en fila; manos cosiendo; una pila de bolsas de papel dobladas que crece; dos mujeres que se hablan por encima de la mesa ----
export const HSewing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#16181e" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.1, 0], az: [-0.55, -0.4], el: [0.35, 0.3], r: [0.85, 0.7], fov: 32 }}>{(tt) => {
  const n = Math.floor(eio(tt, 0.6, 6.4) * 14);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8a8e96" roughness={0.9} /></mesh>
    {[-0.18, 0.18].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <RBox s={[0.26, 0.012, 0.16]} r={0.003} p={[0, 0.1, 0]}>{M.wood({ base: [150, 116, 80] })}</RBox>
      {[[-0.12, -0.07], [0.12, -0.07], [-0.12, 0.07], [0.12, 0.07]].map(([a, b], k) => <mesh key={k} position={[a, 0.05, b]}><cylinderGeometry args={[0.004, 0.004, 0.1, 8]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
      <Gran p={[0, 0, 0.13]} r={[0, PI, 0]} s={1.15} sit={1} arm={0.35 + 0.05 * Math.sin(tt * 8 + i)} arm2={0.35 + 0.05 * Math.sin(tt * 8 + i + 1)} head={0.2 + 0.25 * Math.sin(tt * 1.3 + i * 2)} cloth="#7a8a9a" />
      <RBox s={[0.1, 0.004, 0.07]} r={0.002} p={[0, 0.108, 0.03]}>{M.matte({ col: i ? "#c8d8e8" : "#e8c8c8" })}</RBox>
      <mesh position={[0.02, 0.112, 0.03]}><cylinderGeometry args={[0.0005, 0.0005, 0.04, 4]} />{M.steel({ col: "#888" })}</mesh>
    </group>)}
    {Array.from({ length: n }, (_, k) => <RBox key={k} s={[0.07, 0.004, 0.1]} r={0.001} p={[0, 0.109 + k * 0.0045, -0.04]} rot={[0, (rn(k, 2) - 0.5) * 0.1, 0]}>{M.matte({ col: "#b8946a" })}</RBox>)}
    <RBox s={[0.12, 0.012, 0.16]} r={0.003} p={[0, 0.1, -0.04]}>{M.wood({ base: [150, 116, 80] })}</RBox>
    <Sheet map={txt("swg", ["it's company"], { w: 360, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 56, font: HANDF })} w={0.15} h={0.037} p={[0, 0.25, 0.04]} s={pop(tt, 4.0)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 8:49 · EL PATIO: una abuela camina en círculos lentos; una guardia joven a su lado la sostiene del codo; sus pasos dejan un círculo de huellas ----
export const HYard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#c4ccd2" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.07, 0.02], az: [-0.25, 0.15], el: [0.62, 0.55], r: [1.05, 0.95], fov: 32 }}>{(tt) => {
  const a = tt * 0.55, R = 0.2;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#a89a80" roughness={0.95} /></mesh>
    <RBox s={[1.4, 0.24, 0.03]} r={0.004} p={[0, 0.12, -0.42]}>{M.matte({ col: "#d0ccc4" })}</RBox>
    {Array.from({ length: 40 }, (_, i) => { const b = a - i * 0.1; if (b < 0) return null; return <mesh key={i} position={[Math.cos(b) * (R + (i % 2 ? 0.008 : -0.008)), 0.001, Math.sin(b) * R * 0.7]} rotation={[-PI / 2, 0, -b]}><circleGeometry args={[0.006, 10]} /><meshBasicMaterial color="#6a5a44" transparent opacity={0.6 * (1 - i / 40)} /></mesh>; })}
    <Gran p={[Math.cos(a) * R, 0, Math.sin(a) * R * 0.7]} r={[0, -a, 0]} s={1.2} bow={0.25} />
    <Fig p={[Math.cos(a - 0.3) * (R + 0.07), 0, Math.sin(a - 0.3) * (R + 0.07) * 0.7]} r={[0, -a, 0]} s={1.3} cloth="#1d2f5a" hat="#1d2f5a" arm={0.5} />
    <Sheet map={txt("yd", ["1:00 – 4:30 · the yard"], { w: 520, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 50 })} w={0.21} h={0.036} p={[0.0, 0.002, 0.3]} r={[-PI / 2, 0, 0]} s={pop(tt, 0.5)} em={0.2} />
  </>;
}}</Scene3D>;

// ---- 9:31 · LAS CELADORAS ENFERMERAS: una guardia joven empuja una silla de ruedas; en la mesa, un plato con la comida cortada en trocitos; un peine ----
export const HNurse: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#d8dcd6" lamp={[0.2, 0.8, 0.5]}
  cam={{ at: [0, 0.1, 0], at1: [0.1, 0.08, 0], az: [-0.6, -0.4], el: [0.3, 0.32], r: [0.8, 0.62], fov: 32 }}>{(tt) => {
  const u = eio(tt, 0.4, 3.6), x = lerp(-0.3, 0.02, u), cut = Math.floor(eio(tt, 3.8, 6.0) * 8);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#c8c4b8" roughness={0.6} /></mesh>
    <group position={[x, 0, 0]}>
      {[-0.035, 0.035].map((z, i) => <mesh key={i} position={[0, 0.04, z]} rotation={[0, 0, tt * -3 * (u < 1 ? 1 : 0)]}><torusGeometry args={[0.038, 0.004, 8, 24]} />{M.rubber({ col: "#222" })}</mesh>)}
      <RBox s={[0.07, 0.008, 0.07]} r={0.003} p={[0, 0.07, 0]}>{M.matte({ col: "#2a3a5a" })}</RBox>
      <RBox s={[0.008, 0.07, 0.07]} r={0.003} p={[-0.035, 0.1, 0]}>{M.matte({ col: "#2a3a5a" })}</RBox>
      <Gran p={[0.005, 0.03, 0]} r={[0, PI / 2, 0]} s={1.0} sit={1} />
      <Fig p={[-0.1, 0, 0]} r={[0, PI / 2, 0]} s={1.3} cloth="#1d2f5a" hat="#1d2f5a" arm={0.55} arm2={0.55} />
    </group>
    <RBox s={[0.2, 0.012, 0.14]} r={0.004} p={[0.2, 0.1, 0]}>{M.wood({ base: [150, 116, 80] })}</RBox>
    {[[-0.08, -0.05], [0.08, -0.05], [-0.08, 0.05], [0.08, 0.05]].map(([a, b], k) => <mesh key={k} position={[0.2 + a, 0.05, b]}><cylinderGeometry args={[0.004, 0.004, 0.1, 8]} />{M.steel({ col: "#6a6e76" })}</mesh>)}
    <mesh position={[0.2, 0.108, 0]}><cylinderGeometry args={[0.04, 0.035, 0.004, 32]} />{M.porcelain({ col: "#f2efe8" })}</mesh>
    {Array.from({ length: 8 }, (_, k) => { const c = k < cut; return <RBox key={k} s={c ? [0.01, 0.008, 0.01] : [0.03, 0.01, 0.015]} r={0.002} p={c ? [0.18 + (k % 4) * 0.014, 0.115, -0.01 + Math.floor(k / 4) * 0.02] : [0.2, 0.116, 0.0]}>{M.matte({ col: "#d89a5a" })}</RBox>; })}
    <RBox s={[0.05, 0.003, 0.012]} r={0.001} p={[0.27, 0.108, 0.04]}>{M.plastic({ col: "#c8302a" })}</RBox>
  </>;
}}</Scene3D>;

// ---- 10:24 · LAS CARTAS: un calendario de semanas; cada semana cae una carta a la hermana; después las semanas quedan vacías; la guardia se sienta al lado ----
export const HLetters: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#16130f" lamp={[-0.2, 0.6, 0.5]} warm={0.9}
  cam={{ at: [-0.02, 0.02, 0.02], at1: [0.1, 0.02, 0.0], az: [-0.1, 0.05], el: [0.95, 0.85], r: [0.42, 0.5], fov: 32 }}>{(tt) => {
  const wk = eio(tt, 1.6, 5.4) * 6, dim = (i: number) => cl(wk - i);
  return <>
    <RBox s={[1.1, 0.03, 0.7]} r={0.006} p={[0, -0.015, 0]}>{M.wood({ base: [110, 80, 54] })}</RBox>
    <group position={[-0.06, 0.003, 0.02]} rotation={[0, 0.06, 0]}>
      <RBox s={[0.16, 0.003, 0.11]} r={0.002}>{M.matte({ col: "#f6f1e4" })}</RBox>
      <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.15, 0.1]} /><meshStandardMaterial map={txt("lt0", ["Dear sister,", "the winter here is long…", "write to me soon"], { w: 480, h: 320, bg: "#f6f1e4", fg: "#2a2420", size: 44, font: HANDF, align: "left" })} /></mesh>
      <mesh position={[0.1, 0.006, 0.03]} rotation={[0, 0.5, PI / 2]}><cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />{M.plastic({ col: "#1d2f5a" })}</mesh>
    </group>
    {[0, 1, 2, 3, 4, 5].map((i) => { const x = 0.14 + (i % 3) * 0.1, z = -0.08 + Math.floor(i / 3) * 0.13, d = dim(i);
      return <group key={i} position={[x, 0.002, z]}>
        <mesh position={[0, 0.0, -0.045]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.05, 0.016]} /><meshStandardMaterial map={txt("wkn" + i, ["week " + (i + 2)], { w: 200, h: 64, bg: "#3a2a1c", fg: "#d8c8a8", size: 40 })} /></mesh>
        <RBox s={[0.08, 0.003, 0.055]} r={0.002}><meshStandardMaterial color="#f6f1e4" transparent opacity={1 - 0.9 * d} /></RBox>
        {d > 0.5 && <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.022, 0.025, 32]} /><meshBasicMaterial color="#9a8a70" transparent opacity={0.5} /></mesh>}
      </group>; })}
    <pointLight position={[-0.06, 0.15, 0.04]} intensity={0.6} distance={0.4} color="#ffcf8a" />
    <Sheet map={txt("ltq", ["then the letters stopped"], { w: 560, h: 90, bg: "#f6f1e4", fg: "#7a1d12", size: 50, font: HANDF })} w={0.2} h={0.032} p={[0.2, 0.004, 0.14]} r={[-PI / 2, 0, 0]} s={pop(tt, 5.6)} em={0.25} />
  </>;
}}</Scene3D>;

// ---- 11:30 · LA PUERTA GIRATORIA: una ronda de cuatro paradas (el portón, el departamento vacío, el súper, el patrullero); la abuela da la vuelta y vuelve a empezar ----
export const HRevolving: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101318" lamp={[0, 0.7, 0.5]}
  cam={{ at: [0, 0.06, 0], az: [-0.2, 0.25], el: [0.65, 0.55], r: [0.9, 0.8], fov: 32 }}>{(tt) => {
  const a = eio(tt, 0.3, 6.8) * 2 * PI * 1.25 - PI / 2, R = 0.26;
  const S: [string, number][] = [["prison gate", -PI / 2], ["empty room", 0], ["supermarket", PI / 2], ["police", PI]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#1e2128" /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, 0.002, 0]}><ringGeometry args={[R - 0.012, R + 0.012, 96]} /><meshStandardMaterial color="#3a3e48" /></mesh>
    {Array.from({ length: 48 }, (_, i) => { const b = (i / 48) * 2 * PI; return <mesh key={i} position={[Math.cos(b) * R, 0.004, Math.sin(b) * R]} rotation={[-PI / 2, 0, -b]}><planeGeometry args={[0.012, 0.003]} />{M.glow({ col: "#ffcf8a", op: 0.4 })}</mesh>; })}
    {S.map(([l, b], i) => { const x = Math.cos(b) * (R + 0.12), z = Math.sin(b) * (R + 0.1), near = cl(1 - Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) / 0.6);
      return <group key={i} position={[x, 0, z]}>
        {i === 0 && <><RBox s={[0.1, 0.1, 0.02]} r={0.003} p={[0, 0.05, 0]}>{M.steel({ col: "#5a5e66" })}</RBox>{[-0.03, 0, 0.03].map((d, k) => <mesh key={k} position={[d, 0.05, 0.011]}><boxGeometry args={[0.004, 0.09, 0.004]} />{M.steel({ col: "#2a2c30" })}</mesh>)}</>}
        {i === 1 && <><RBox s={[0.1, 0.07, 0.08]} r={0.004} p={[0, 0.035, 0]}>{M.matte({ col: "#4a4844" })}</RBox><mesh position={[0, 0.04, 0.041]}><planeGeometry args={[0.03, 0.03]} /><meshBasicMaterial color="#1a1d24" /></mesh></>}
        {i === 2 && <><RBox s={[0.12, 0.07, 0.08]} r={0.004} p={[0, 0.035, 0]}>{M.matte({ col: "#e8e4da" })}</RBox><mesh position={[0, 0.06, 0.041]}><planeGeometry args={[0.1, 0.015]} /><meshStandardMaterial color="#2a6a3a" emissive="#2a6a3a" emissiveIntensity={0.5} /></mesh><Onigiri p={[0, 0.02, 0.06]} s={0.4} /></>}
        {i === 3 && <><RBox s={[0.1, 0.035, 0.05]} r={0.012} p={[0, 0.03, 0]}>{M.pvc({ col: "#f2f2ee" })}</RBox><RBox s={[0.1, 0.012, 0.052]} r={0.004} p={[0, 0.02, 0]}>{M.matte({ col: "#1a1a1a" })}</RBox><mesh position={[0, 0.054, 0]}><boxGeometry args={[0.02, 0.008, 0.012]} />{M.glow({ col: Math.floor(tt * 3) % 2 ? "#ff3a3a" : "#3a6aff", op: 0.5 + 0.5 * near })}</mesh></>}
        <Sheet map={txt("rv" + i, [l], { w: 340, h: 80, bg: "#f6f1e4", fg: "#2a2420", size: 48, font: HANDF })} w={0.12} h={0.028} p={[0, 0.003, 0.07]} r={[-PI / 2, 0, 0]} s={0.8 + 0.25 * near} em={0.15 + 0.3 * near} />
      </group>; })}
    <Gran p={[Math.cos(a) * R, 0, Math.sin(a) * R]} r={[0, -a - PI / 2 + PI, 0]} s={1.2} bow={0.2} />
  </>;
}}</Scene3D>;

// ---- 12:02 · EL PORTÓN: el portón de la cárcel se abre a las 9; la abuela sale con su bolsa de papel; de la bolsa suben cepillo, peine, cartas, un sobrecito; afuera, el lugar de quien la espera queda vacío ----
export const HGate: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#b8c4cc" lamp={[0.3, 0.8, 0.5]}
  cam={{ at: [0, 0.12, 0], at1: [0.06, 0.1, 0.1], az: [0.2, 0.05], el: [0.18, 0.16], r: [0.95, 0.7], fov: 32 }}>{(tt) => {
  const op = eio(tt, 0.4, 1.8), walk = eio(tt, 1.4, 3.4), up = eio(tt, 3.6, 4.8);
  const items: [string, number][] = [["toothbrush", -0.06], ["comb", -0.02], ["letters", 0.02], ["¥", 0.06]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8a8a84" roughness={0.9} /></mesh>
    {[-1, 1].map((sd) => <RBox key={sd} s={[0.6, 0.34, 0.06]} r={0.004} p={[sd * 0.42, 0.17, -0.2]}>{M.matte({ col: "#c8c4bc" })}</RBox>)}
    {[-1, 1].map((sd) => <group key={"g" + sd} position={[sd * 0.12, 0, -0.2]} rotation={[0, sd * 1.3 * op, 0]}><RBox s={[0.12, 0.3, 0.012]} r={0.002} p={[-sd * 0.06, 0.15, 0]}>{M.steel({ col: "#4a4e56" })}</RBox></group>)}
    <Gran p={[lerp(0, 0.02, walk), 0, lerp(-0.25, 0.04, walk)]} s={1.3} cloth="#c8b48a" arm={0.25} />
    <group position={[lerp(0.04, 0.06, walk), 0.07, lerp(-0.24, 0.07, walk)]}>
      <RBox s={[0.05, 0.06, 0.03]} r={0.003}>{M.matte({ col: "#b8946a" })}</RBox>
      {items.map(([l, x], i) => <group key={i} position={[x * 1.6, 0.05 + 0.12 * up + (i % 2) * 0.03 * up, 0.02]} scale={Math.max(0.001, up)}>
        <Sheet map={txt("gt" + i, [l], { w: 260, h: 80, bg: "#f6f1e4", fg: "#2a2420", size: 50, font: HANDF })} w={0.07} h={0.022} em={0.25} />
      </group>)}
    </group>
    <group position={[0.24, 0.001, 0.14]}><mesh rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.045, 40]} /><meshBasicMaterial color="#5a5a54" /></mesh>
      <Sheet map={txt("nob", ["nobody waiting"], { w: 380, h: 80, bg: "#f6f1e4", fg: "#7a1d12", size: 48, font: HANDF })} w={0.14} h={0.03} p={[0, 0.003, 0.08]} r={[-PI / 2, 0, 0]} s={pop(tt, 5.0)} em={0.2} /></group>
  </>;
}}</Scene3D>;

// ---- 12:21 · EL MAPA DE TRENES: un tablero enorme de líneas de colores; una figura chiquita lo mira mucho tiempo; las líneas se encienden una por una, demasiadas ----
export const HTrainMap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1a1d24" lamp={[0, 0.6, 0.6]}
  cam={{ at: [0, 0.18, 0], at1: [0.0, 0.14, 0.1], az: [0.25, 0.1], el: [0.08, 0.06], r: [0.95, 0.7], fov: 32 }}>{(tt) => {
  const L = ["#e8382a", "#2a8ae8", "#2ab84a", "#e8a82a", "#9a4ae8", "#e84aa8", "#4ac8c8", "#8a6a3a"];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#8a8a84" roughness={0.7} /></mesh>
    <RBox s={[0.78, 0.4, 0.02]} r={0.006} p={[0, 0.26, -0.15]}>{M.matte({ col: "#f2f0ea" })}</RBox>
    {L.map((c, i) => { const k = eio(tt, 0.4 + i * 0.5, 1.4 + i * 0.5), pts = [[-0.36, 0.1 + rn(i, 2) * 0.32], [-0.1 + rn(i, 3) * 0.1, 0.1 + rn(i, 4) * 0.32], [0.1 + rn(i, 5) * 0.1, 0.1 + rn(i, 6) * 0.32], [0.36, 0.1 + rn(i, 7) * 0.32]];
      return k > 0.01 ? <mesh key={i} geometry={new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, -0.138))), 60, 0.004, 6, false)} scale={[1, 1, 1]}>
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} transparent opacity={k} /></mesh> : null; })}
    {Array.from({ length: 30 }, (_, i) => <mesh key={"s" + i} position={[-0.34 + rn(i, 8) * 0.68, 0.1 + rn(i, 9) * 0.32, -0.136]}><circleGeometry args={[0.006, 12]} /><meshStandardMaterial color="#ffffff" /></mesh>)}
    <Gran p={[0.05, 0, 0.12]} r={[0, PI, 0]} s={1.25} head={-0.45} />
    <RBox s={[0.1, 0.16, 0.06]} r={0.008} p={[0.3, 0.08, 0.0]}>{M.pvc({ col: "#e8eaec" })}</RBox>
    <mesh position={[0.3, 0.12, 0.031]}><planeGeometry args={[0.07, 0.05]} /><meshBasicMaterial color="#6ab0e8" toneMapped={false} /></mesh>
    <Sheet map={txt("2y", ["two years inside"], { w: 420, h: 90, bg: "#f6f1e4", fg: "#2a2420", size: 52, font: HANDF })} w={0.16} h={0.034} p={[-0.2, 0.03, 0.12]} r={[-0.5, 0.2, 0]} s={pop(tt, 4.4)} em={0.25} />
  </>;
}}</Scene3D>;
