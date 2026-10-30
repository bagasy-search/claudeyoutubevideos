// dur29b · componentes únicos en 3D, bloque D: «todo lo demás» del ordenanza de Scutari y la Laguna de la Paz de Messines.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, rn, tex } from "./h3d";
import { U3, sec } from "./k3";
import { EnSitio, Plate, latheG, pop, rockT } from "./kb";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;

// ---- TodoLoDemas · «Cargar a los enfermos. Repartir la comida. Vaciar los baldes. Limpiar»: el pabellón como una fila de cuatro
// estaciones; el ordenanza camina de una a otra y cada tarea se enciende cuando la nombra; las anteriores quedan prendidas ----
const ST = [-1.2, -0.4, 0.4, 1.2];
export const TodoLoDemas3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, A = [sec(p, "cargar", 0.4), sec(p, "comida", 2.0), sec(p, "baldes", 3.4), sec(p, "limpiar", 4.8)].map((a) => Math.min(a, D - 1));
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="wipe" key1={[-1.2, 2.6, 2.0]} backZ={-1.6}
    cam={{ at: [-0.9, 0.45, 0], at1: [0.9, 0.45, 0], az: [-0.32, 0.22], el: [0.16, 0.12], r: [2.2, 2.0], fov: 38 }}>{(tt) => {
    // a qué estación va y si está caminando
    let k = 0; for (let i = 0; i < 4; i++) if (tt >= A[i] - 0.55) k = i;
    const mv = k > 0 ? eio(tt, A[k] - 0.55, A[k] - 0.05) : 1, x = k > 0 ? lerp(ST[k - 1], ST[k], mv) : ST[0] - 0.35 * (1 - eio(tt, 0, A[0]));
    const walking = (k > 0 && mv > 0.02 && mv < 0.98) || tt < A[0] - 0.05;
    const tired = cl((tt - A[0]) / Math.max(1, A[3] - A[0]));
    const acc = ["cargar_caja", "idle", "cargar_caja", "empujar"][k];
    const on = (i: number) => eio(tt, A[i], A[i] + 0.5);
    return <>
      {/* el piso de tablas del pabellón y las camas al fondo */}
      <RBox s={[3.4, 0.06, 1.3]} r={0.006} p={[0, 0.27, -0.1]}><meshStandardMaterial map={tex.wood(6, 2, [120, 92, 60])} roughness={0.9} /></RBox>
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-1.55 + i * 0.39, 0.33, -0.62]}>
        <RBox s={[0.3, 0.05, 0.36]} r={0.012}><meshStandardMaterial color="#cfc2a4" roughness={1} /></RBox>
        <mesh position={[0, 0.045, 0.02]} scale={[1, 0.38, 1]}><capsuleGeometry args={[0.07, 0.2, 6, 10]} /><meshStandardMaterial color="#8a7e6a" roughness={1} /></mesh>
      </group>)}
      {/* 1 · la camilla con un enfermo */}
      <group position={[ST[0], 0.3, 0.12]} scale={pop(tt, A[0] - 0.2)}>
        {[-0.09, 0.09].map((z) => <mesh key={z} position={[0, 0.05, z]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.62, 10]} />{M.wood({ base: [130, 92, 54] })}</mesh>)}
        <RBox s={[0.48, 0.012, 0.18]} r={0.004} p={[0, 0.05, 0]}><meshStandardMaterial color="#b8a888" roughness={1} /></RBox>
        <mesh position={[0, 0.09, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.8]}><capsuleGeometry args={[0.05, 0.3, 6, 10]} /><meshStandardMaterial color="#6a6458" roughness={1} /></mesh>
        <Plate k="tdl1" txt="CARGAR" w={0.26} h={0.07} p={[0, 0.02, 0.13]} rot={[-0.5, 0, 0]} />
      </group>
      {/* 2 · la bandeja con el pan y los jarros */}
      <group position={[ST[1], 0.3, 0.14]} scale={pop(tt, A[1] - 0.2)}>
        <RBox s={[0.4, 0.03, 0.22]} r={0.008} p={[0, 0.02, 0]}>{M.wood({ base: [140, 100, 60] })}</RBox>
        {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.14 + i * 0.07, 0.06, -0.04]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.85]}><capsuleGeometry args={[0.025, 0.05, 6, 10]} /><meshStandardMaterial color="#a8763c" roughness={0.85} /></mesh>)}
        {[-0.1, 0.0, 0.1].map((z, i) => <mesh key={i} position={[z, 0.07, 0.06]}><cylinderGeometry args={[0.022, 0.02, 0.06, 18]} />{M.steel({ col: "#9a9ea2" })}</mesh>)}
        <Plate k="tdl2" txt="COMIDA" w={0.26} h={0.07} p={[0, 0.0, 0.14]} rot={[-0.5, 0, 0]} />
      </group>
      {/* 3 · los baldes */}
      <group position={[ST[2], 0.3, 0.14]} scale={pop(tt, A[2] - 0.2)}>
        {[-0.08, 0.08].map((z, i) => <group key={i} position={[z, 0, i * 0.04]}>
          <mesh position={[0, 0.07, 0]} geometry={latheG("tdlb", [[0, 0], [0.06, 0], [0.075, 0.13], [0.07, 0.13], [0.055, 0.01], [0, 0.01]], 28)}>{M.wood({ base: [110, 78, 46] })}</mesh>
          <mesh position={[0, 0.18, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.066, 24]} /><meshStandardMaterial color="#4a4030" roughness={0.3} /></mesh>
        </group>)}
        <Plate k="tdl3" txt="BALDES" w={0.26} h={0.07} p={[0, 0.0, 0.16]} rot={[-0.5, 0, 0]} />
      </group>
      {/* 4 · el trapeador y el jabón */}
      <group position={[ST[3], 0.3, 0.14]} scale={pop(tt, A[3] - 0.2)}>
        <mesh position={[0.05, 0.2, -0.04]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.01, 0.01, 0.42, 10]} />{M.wood({ base: [150, 110, 70] })}</mesh>
        <mesh position={[0.1, 0.0, -0.04]} scale={[1, 0.4, 1]}><sphereGeometry args={[0.06, 16, 10]} /><meshStandardMaterial color="#c8c0a8" roughness={1} /></mesh>
        <RBox s={[0.07, 0.03, 0.04]} r={0.008} p={[-0.08, 0.02, 0.0]}><meshStandardMaterial color="#e8dcb8" roughness={0.6} /></RBox>
        <Plate k="tdl4" txt="LIMPIAR" w={0.26} h={0.07} p={[0, 0.0, 0.14]} rot={[-0.5, 0, 0]} />
      </group>
      {/* la luz cálida que queda sobre cada tarea ya hecha */}
      {ST.map((sx, i) => <mesh key={i} position={[sx, 0.305, 0.14]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.28, 32]} /><meshBasicMaterial color="#ffd38a" transparent opacity={0.22 * on(i)} depthWrite={false} /></mesh>)}
      {/* el ordenanza */}
      <group position={[x, 0.3, -0.18]}>
        {walking ? <EnSitio tt={tt} accion="caminar" escala={0.13} rotY={90} expr={tired > 0.5 ? "triste" : "nervioso"} semilla={71} contacto={0.3} />
          : <Stickman escala={0.13} rotY={10} guion={[{ t: 0, accion: acc, expr: tired > 0.5 ? "triste" : "decidido" }]} semilla={71} contacto={0.3} colorContacto="#4a3a2a" />}
      </group>
    </>;
  }}</U3>;
};

// ---- LagunaPaz · «cráteres llenos de agua, con patos nadando… y al menos una mina enterrada que nunca explotó»: el cráter de
// Spanbroekmolen se llena de agua, aparecen los patos, y la cámara se corre al campo de al lado donde, bajo el surco, siguen los barriles ----
const BOWL = [[0, -0.36], [0.35, -0.33], [0.62, -0.2], [0.82, -0.05], [0.92, 0.03], [1.0, 0.0]];
const rAt = (y: number) => { for (let i = 1; i < BOWL.length; i++) if (y <= BOWL[i][1]) { const [r0, y0] = BOWL[i - 1], [r1, y1] = BOWL[i]; return lerp(r0, r1, (y - y0) / (y1 - y0)); } return 0.92; };
export const LagunaPaz3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, aP = Math.min(sec(p, "patos", 1.6), D - 3), aM = Math.min(sec(p, "mina", 4.0), D - 1.6);
  const camK = (tt: number) => eio(tt, aM - 0.4, aM + 0.8);
  return <U3 d={d} bg={p.bg} ground={null} floor="none" mode="iris" key1={[-1.4, 3.0, 1.6]} sky="#b8c4c8"
    cam={{ at: [0, -0.05, 0], at1: [0.9, -0.15, 0.3], az: [-0.35, 0.25], el: [0.55, 0.42], r: [3.2, 2.8], fov: 36 }}>{(tt) => {
    const fill = eio(tt, 0.1, aP), wy = lerp(-0.34, -0.06, fill), wr = Math.max(0.05, rAt(wy) * 0.98);
    const duck = eio(tt, aP, aP + 0.5), see = eio(tt, aM, aM + 0.9);
    return <>
      {/* el campo alrededor y el borde del cráter */}
      <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.99, 4.2, 64, 1]} /><meshStandardMaterial map={rockT("pasto", [96, 118, 64], 6, 6)} roughness={1} /></mesh>
      <mesh geometry={latheG("crater", BOWL as any, 64)}><meshStandardMaterial map={rockT("barro", [104, 96, 70], 3, 3)} roughness={1} side={THREE.DoubleSide} /></mesh>
      {/* el agua que sube */}
      <mesh position={[0, wy, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[wr, 64]} />{M.water({ col: "#4a6a72" })}</mesh>
      {/* los árboles del borde */}
      {Array.from({ length: 11 }, (_, i) => { const a = (i / 11) * 2 * PI + rn(i, 4) * 0.3, r = 1.15 + rn(i, 5) * 0.25;
        return <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r - (Math.sin(a) > 0.4 ? 0.0 : 0)]}>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.015, 0.02, 0.24, 8]} /><meshStandardMaterial color="#5a4632" roughness={1} /></mesh>
          <mesh position={[0, 0.3, 0]} scale={[1, 1.2, 1]}><sphereGeometry args={[0.1 + rn(i, 6) * 0.05, 14, 10]} /><meshStandardMaterial color={new THREE.Color().setRGB(0.24 + rn(i, 7) * 0.08, 0.36 + rn(i, 8) * 0.08, 0.18)} roughness={1} /></mesh>
        </group>; })}
      {/* los patos */}
      {Array.from({ length: 4 }, (_, i) => { const a = tt * 0.25 + i * 1.6, r = wr * (0.35 + 0.15 * (i % 2));
        return <group key={i} position={[Math.cos(a) * r, wy + 0.012, Math.sin(a) * r]} rotation={[0, -a - PI / 2 * (i % 2 ? -1 : 1), 0]} scale={Math.max(0.001, duck) * 0.9}>
          <mesh scale={[1.4, 0.7, 0.9]}><sphereGeometry args={[0.035, 16, 10]} /><meshStandardMaterial color={i % 2 ? "#6a5a40" : "#8a7a5a"} roughness={0.8} /></mesh>
          <mesh position={[0.04, 0.035, 0]}><sphereGeometry args={[0.018, 12, 8]} /><meshStandardMaterial color={i % 2 ? "#2a5a3a" : "#7a6a4a"} roughness={0.6} /></mesh>
          <mesh position={[0.06, 0.032, 0]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.006, 0.02, 8]} /><meshStandardMaterial color="#c8a040" /></mesh>
        </group>; })}
      {/* el campo de cultivo de al lado: los surcos se vuelven transparentes y abajo siguen los barriles */}
      <group position={[1.9, 0, 0.9]}>
        {Array.from({ length: 7 }, (_, i) => <RBox key={i} s={[1.1, 0.05, 0.08]} r={0.02} p={[0, 0.025, -0.3 + i * 0.1]}><meshStandardMaterial color="#6a5232" roughness={1} transparent opacity={1 - 0.75 * see} depthWrite={see < 0.5} /></RBox>)}
        <mesh position={[0, -0.25, 0]}><boxGeometry args={[1.1, 0.5, 0.75]} /><meshStandardMaterial color="#5a4632" roughness={1} transparent opacity={0.95 - 0.8 * see} depthWrite={see < 0.5} /></mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.18 + (i % 3) * 0.18, -0.36, -0.1 + Math.floor(i / 3) * 0.2]} rotation={[PI / 2, 0, 0]} scale={Math.max(0.001, see)}><cylinderGeometry args={[0.06, 0.06, 0.15, 18]} /><meshStandardMaterial color="#3a3226" roughness={0.7} /></mesh>)}
        <mesh position={[0, -0.36, 0]}><sphereGeometry args={[0.32, 20, 14]} /><meshBasicMaterial color="#ff9a4a" transparent opacity={0.08 * see * (0.75 + 0.25 * Math.sin(tt * 2 * PI * 0.8))} depthWrite={false} /></mesh>
        <Plate k="lpz" txt="¿DÓNDE?" w={0.32} h={0.1} p={[-0.45, 0.22, 0.38]} rot={[0, 0.3, 0.06]} mat="wood" />
        <mesh position={[-0.45, 0.1, 0.37]}><cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />{M.wood({ base: [120, 86, 50] })}</mesh>
      </group>
    </>;
  }}</U3>;
};
