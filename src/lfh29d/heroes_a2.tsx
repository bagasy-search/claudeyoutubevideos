// lfh29d · componentes únicos 8-14 (la licuadora que hace azúcar impalpable, el polvo de hornear que burbujea o no, los tres frascos iguales que se rotulan, el batidor que reparte el polvo, el cortapastas que deja arvejitas, los bizcochos en 15 minutos, las tres tazas del almíbar).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";

const PI = Math.PI;

// ---- 5:39 · LA LICUADORA: los cristales de azúcar giran, se achican hasta polvo, y la nube de adentro se asienta antes de abrir ----
export const HBlender: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" bg="#1c1916" key1={[-0.9, 1.5, 1.2]}
  cam={{ at: [0, 0.21, 0], az: [-0.25, 0.2], el: [0.15, 0.1], r: [0.98, 0.84], fov: 30 }}>{(tt) => {
  const spin = eio(tt, 0.4, 1.0) * (1 - eio(tt, 3.2, 3.6)), fine = eio(tt, 0.8, 3.2), cloud = Math.sin(cl((tt - 1.0) / 3.8) * PI), settle = eio(tt, 3.4, 5.4);
  const ang = tt * 40 * spin;
  return <>
    {/* base de la licuadora, vieja, crema con botones cromados */}
    <RBox s={[0.2, 0.12, 0.18]} p={[0, 0.06, 0]} r={0.03}><meshPhysicalMaterial color="#5f9c8f" roughness={0.35} clearcoat={0.6} /></RBox>
    {[-0.05, 0, 0.05].map((x, i) => <RBox key={i} s={[0.03, 0.018, 0.02]} p={[x, 0.06, 0.095]} r={0.004}>{M.chrome()}</RBox>)}
    {/* el vaso */}
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.09, 0.065, 0.26, 6, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
    <mesh position={[0, 0.385, 0]}><cylinderGeometry args={[0.095, 0.095, 0.02, 6]} /><meshStandardMaterial color="#2b2a28" roughness={0.6} /></mesh>
    <group position={[0, 0.135, 0]} rotation={[0, ang, 0]}>
      {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0.25 * (i % 2 ? 1 : -1), i * PI / 2, 0]} position={[0, 0.005, 0]}><boxGeometry args={[0.1, 0.002, 0.014]} />{M.steel()}</mesh>)}
    </group>
    {/* los cristales: cubitos que se vuelven polvo fino */}
    {Array.from({ length: 70 }, (_, i) => { const a = i * 2.4 + ang * (0.6 + rn(i, 2) * 0.4), r = 0.055 * Math.sqrt(rn(i, 3)), y = 0.145 + rn(i, 4) * lerp(0.04, 0.03, settle) + cloud * rn(i, 5) * 0.12;
      return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} rotation={[a, a * 0.7, 0]}><boxGeometry args={[lerp(0.012, 0.004, fine), lerp(0.012, 0.004, fine), lerp(0.012, 0.004, fine)]} /><meshStandardMaterial color="#e6e1d6" roughness={lerp(0.25, 0.95, fine)} /></mesh>; })}
    {/* la capa de polvo asentado */}
    <mesh position={[0, 0.142 + 0.012 * settle, 0]}><cylinderGeometry args={[0.068, 0.066, 0.004 + 0.022 * settle, 6]} /><meshStandardMaterial color="#e4e0d8" roughness={1} /></mesh>
    {/* la nube adentro del vaso que se asienta */}
    {Array.from({ length: 6 }, (_, i) => <mesh key={"c" + i} position={[(rn(i, 6) - 0.5) * 0.06, 0.2 + i * 0.03, (rn(i, 7) - 0.5) * 0.05]}><sphereGeometry args={[0.04 + 0.01 * rn(i, 8), 14, 10]} /><meshBasicMaterial color="#e8e4dc" transparent opacity={0.34 * cloud * (1 - settle)} depthWrite={false} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 6:28 · LA PRUEBA DEL POLVO: dos vasos de agua caliente; el polvo bueno burbujea, el viejo se va al fondo sin hacer nada ----
export const HPowdertest: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" bg="#181512" lamp={[0, 0.45, 0.25]}
  cam={{ at: [0, 0.1, 0], az: [0.12, -0.08], el: [0.2, 0.16], r: [0.78, 0.68], fov: 30 }}>{(tt) => {
  const drop = [0, 1].map((i) => eio(tt, 0.4 + i * 0.5, 1.0 + i * 0.5)), fizz = eio(tt, 1.1, 1.8);
  const glass = (x: number, good: boolean, k: number) => <group position={[x, 0, 0]}>
    <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.06, 0.052, 0.16, 40, 1, true]} />{M.glass({ op: 0.22 })}</mesh>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.057, 0.05, 0.11, 36]} />{M.water({ col: "#cfe2ea", op: 0.35, emI: 0.05 })}</mesh>
    {/* la cucharadita que vuelca */}
    <group position={[0.02, lerp(0.3, 0.2, k), 0]} rotation={[0, 0, lerp(0, 1.4, k)]} visible={k < 0.98}>
      <mesh><sphereGeometry args={[0.015, 14, 8, 0, PI * 2, PI / 2, PI / 2]} />{M.steel()}</mesh>
      <mesh position={[0.05, 0.004, 0]} rotation={[0, 0, PI / 2]}><boxGeometry args={[0.005, 0.09, 0.003]} />{M.steel()}</mesh>
    </group>
    {/* bueno: burbujas que suben y espuma arriba; viejo: el polvo quieto en el fondo */}
    {good ? Array.from({ length: 60 }, (_, i) => { const u = (tt * (0.9 + rn(i, 2)) + rn(i, 3)) % 1; return <mesh key={i} visible={fizz > rn(i, 4)} position={[(rn(i, 5) - 0.5) * 0.08, 0.01 + u * 0.1, (rn(i, 6) - 0.5) * 0.08]}><sphereGeometry args={[0.005 + 0.004 * rn(i, 7), 8, 6]} /><meshStandardMaterial color="#f4f8fa" roughness={0.1} transparent opacity={0.8} /></mesh>; })
      : <mesh position={[0, 0.008, 0]} scale={[1, 0.3, 1]} visible={k > 0.9}><sphereGeometry args={[0.04, 16, 10]} /><meshStandardMaterial color="#8f8268" roughness={1} /></mesh>}
    {good && <mesh position={[0, 0.118, 0]} scale={[1, 0.25 * fizz + 0.01, 1]}><cylinderGeometry args={[0.056, 0.056, 0.03, 30]} /><meshStandardMaterial color="#efece4" roughness={0.9} transparent opacity={0.85} /></mesh>}
    {/* el vapor del agua caliente */}
    {Array.from({ length: 3 }, (_, i) => { const u = (tt * 0.4 + i / 3) % 1; return <mesh key={"s" + i} position={[(rn(i, 9) - 0.5) * 0.04, 0.17 + u * 0.15, 0]}><sphereGeometry args={[0.02 + 0.02 * u, 10, 8]} /><meshBasicMaterial color="#dcd8d0" transparent opacity={0.08 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
    {/* la lata de polvo detrás: nueva vs. vieja y oxidada */}
    <group position={[0, 0, -0.14]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.035, 0.12, 30]} /><meshStandardMaterial map={good ? tex.text("bpnew", 128, 64, (g) => { g.fillStyle = "#c8281e"; g.fillRect(0, 0, 128, 64); g.fillStyle = "#f2e6c8"; g.fillRect(0, 22, 128, 20); }) : tex.rust()} roughness={good ? 0.4 : 0.9} metalness={good ? 0.3 : 0.1} /></mesh>
    </group>
  </group>;
  return <>{glass(-0.17, true, drop[0])}{glass(0.17, false, drop[1])}</>;
}}</Scene3D>;

// ---- 6:56 · TRES FRASCOS IGUALES: azúcar impalpable, harina y maicena se ven idénticos; les van llegando sus etiquetas de cinta con la fecha ----
export const HLabels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#1b1611" lamp={[0, 0.5, 0.35]}
  cam={{ at: [0, 0.1, 0], az: [-0.08, 0.08], el: [0.1, 0.08], r: [0.72, 0.64], fov: 30 }}>{(tt) => {
  const names = ["SUGAR", "FLOUR", "STARCH"], lb = [0, 1, 2].map((i) => phys(tt, 1.2 + i * 0.7, 8, 0.5)), q = eio(tt, 0.2, 1.1);
  return <>
    <RBox s={[0.9, 0.025, 0.24]} p={[0, 0.0, 0]} r={0.005}>{M.wood({ base: [150, 110, 70] })}</RBox>
    {[0, 1, 2].map((i) => { const x = (i - 1) * 0.17; return <group key={i} position={[x, 0.012, 0]} rotation={[0, Math.sin(tt * 2 + i) * 0.04 * (1 - q), 0]}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.058, 0.058, 0.16, 40, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh position={[0, 0.062, 0]}><cylinderGeometry args={[0.055, 0.055, 0.12, 36]} /><meshStandardMaterial color="#e6e2d8" roughness={1} /></mesh>
      <mesh position={[0, 0.168, 0]}><cylinderGeometry args={[0.06, 0.06, 0.018, 40]} /><meshStandardMaterial color="#c9a43a" metalness={0.8} roughness={0.3} /></mesh>
      {/* la etiqueta de cinta de papel: llega desde adelante y se pega curva */}
      <mesh position={[0, 0.09, 0.058 + 0.3 * (1 - lb[i])]} rotation={[0, 0, (1 - lb[i]) * 0.6]} scale={Math.max(0.001, cl(lb[i] * 3))}>
        <cylinderGeometry args={[0.06, 0.06, 0.042, 32, 1, true, -0.75, 1.5]} />
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.9} map={tex.text("lbl" + names[i], 256, 96, (g) => { g.fillStyle = "#efe2b8"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#2a2622"; g.font = "700 40px Georgia"; g.textAlign = "center"; g.fillText(names[i], 128, 50); g.font = "italic 22px Georgia"; g.fillText("Oct. 12", 128, 82); })} />
      </mesh>
    </group>; })}
    {/* el lápiz y el rollo de cinta */}
    <mesh position={[0.36, 0.03, 0.1]} rotation={[PI / 2, 0, 0.5]}><cylinderGeometry args={[0.005, 0.005, 0.15, 6]} /><meshStandardMaterial color="#e2b42a" roughness={0.5} /></mesh>
    <mesh position={[-0.36, 0.03, 0.08]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.025, 0.01, 10, 24]} /><meshStandardMaterial color="#efe2b8" roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

// ---- 7:28 · REPARTIR EL POLVO: el polvo de hornear amontonado en un costado de la harina; el batidor gira y los granitos quedan repartidos parejo ----
export const HWhiskflour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="none" bg="#1a1612" lamp={[0, 0.5, 0.15]}
  cam={{ at: [0, 0.05, 0], az: [0.2, -0.2], el: [0.95, 0.88], r: [0.52, 0.46], fov: 30 }}>{(tt) => {
  const mix = eio(tt, 0.8, 4.4), wa = tt * 5;
  return <>
    <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.16, 40, 20, 0, PI * 2, PI / 2, PI / 2.4]} /><meshStandardMaterial color="#6a8fb0" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.14, 48]} /><meshStandardMaterial color="#e8e1d2" roughness={1} /></mesh>
    {/* los granitos de polvo (amarillentos para verse): de la pila a todo el bol */}
    {Array.from({ length: 70 }, (_, i) => { const a0 = i * 0.3, r0 = 0.025 * Math.sqrt(rn(i, 2)), a1 = i * 2.399, r1 = 0.13 * Math.sqrt((i + 0.5) / 70);
      const x = lerp(0.07 + Math.cos(a0) * r0, Math.cos(a1) * r1, mix), z = lerp(-0.02 + Math.sin(a0) * r0, Math.sin(a1) * r1, mix);
      return <mesh key={i} position={[x, 0.048 + (1 - mix) * 0.012 * (1 - r0 / 0.025), z]}><sphereGeometry args={[0.0045, 8, 6]} /><meshStandardMaterial color="#e6c35a" roughness={0.7} /></mesh>; })}
    {/* la sal: puntitos grises */}
    {Array.from({ length: 24 }, (_, i) => { const a1 = i * 2.1 + 1, r1 = 0.12 * Math.sqrt(rn(i, 5)); return <mesh key={"s" + i} position={[lerp(-0.07, Math.cos(a1) * r1, mix), 0.047, lerp(0.04, Math.sin(a1) * r1, mix)]}><boxGeometry args={[0.004, 0.004, 0.004]} /><meshStandardMaterial color="#a9a7a2" roughness={0.3} /></mesh>; })}
    {/* el batidor de alambre girando en círculos */}
    <group position={[Math.cos(wa) * 0.06 * (mix > 0.01 && mix < 0.99 ? 1 : 0.3), 0.14, Math.sin(wa) * 0.06]} rotation={[0.35, wa, 0]}>
      {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[0, i * PI / 4, 0]} position={[0, -0.04, 0]} scale={[1, 1.8, 1]}><torusGeometry args={[0.03, 0.0014, 6, 32]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.009, 0.009, 0.1, 14]} />{M.wood({ base: [190, 140, 90] })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 8:07 · COMO ARVEJITAS: los cubos de grasa fría en la harina; el cortapastas baja y baja y quedan migas del tamaño de una arveja (la arveja de muestra al lado) ----
export const HPastrycut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#1c1713" lamp={[0, 0.45, 0.2]}
  cam={{ at: [0.04, 0.05, 0], az: [-0.35, -0.1], el: [0.6, 0.55], r: [0.6, 0.52], fov: 30 }}>{(tt) => {
  const cut = eio(tt, 0.6, 4.4), press = Math.abs(Math.sin(tt * 5.5)) * (cut > 0 && cut < 1 ? 1 : 0), px = Math.sin(tt * 2.1) * 0.05, pz = Math.cos(tt * 1.7) * 0.04;
  return <>
    <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.16, 40, 20, 0, PI * 2, PI / 2, PI / 2.4]} />{M.porcelain({ col: "#efe7d4", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.14, 48]} /><meshStandardMaterial color="#e6dfcf" roughness={1} /></mesh>
    {/* cubos grandes que se van partiendo: cada cubo se vuelve 4 migas */}
    {Array.from({ length: 9 }, (_, i) => { const cx = ((i % 3) - 1) * 0.06, cz = (Math.floor(i / 3) - 1) * 0.06, sp = cl(cut * 1.5 - rn(i, 2) * 0.5);
      return <group key={i}>{sp < 0.5 ? <RBox s={[0.034, 0.03, 0.034]} p={[cx, 0.06, cz]} rot={[0, rn(i, 3), 0]} r={0.004}><meshStandardMaterial color="#f0ebdf" roughness={0.5} /></RBox>
        : [0, 1, 2, 3].map((j) => <mesh key={j} position={[cx + ((j % 2) - 0.5) * 0.03 * sp, 0.052, cz + (Math.floor(j / 2) - 0.5) * 0.03 * sp]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.0085, 12, 8]} /><meshStandardMaterial color="#ece4d2" roughness={0.8} /></mesh>)}</group>; })}
    {/* el cortapastas: arcos de alambre y mango de madera */}
    <group position={[px, 0.1 + 0.05 * (1 - press), pz]} rotation={[0, 0.5, 0]}>
      {[-2, -1, 0, 1, 2].map((j) => <mesh key={j} position={[0, 0, j * 0.012]}><torusGeometry args={[0.045, 0.0016, 6, 24, PI]} />{M.steel()}</mesh>)}
      <mesh position={[0, 0.05, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.11, 16]} />{M.wood({ base: [160, 40, 34] })}</mesh>
    </group>
    {/* la arveja de muestra en un platito */}
    <mesh position={[0.26, 0.008, 0.06]}><cylinderGeometry args={[0.045, 0.04, 0.008, 30]} />{M.porcelain({ col: "#f3efe6" })}</mesh>
    <mesh position={[0.26, 0.02, 0.06]}><sphereGeometry args={[0.0085, 14, 10]} /><meshStandardMaterial color="#6fa83a" roughness={0.5} /></mesh>
  </>;
}}</Scene3D>;

// ---- 8:35 · BIZCOCHOS EN 15 MINUTOS: la bandeja con los bizcochos que suben y se doran mientras el tambor cuenta los minutos hasta 15 ----
export const HBiscuit15: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#1a1410" key1={[-0.6, 1.4, 1.2]} lamp={[0, 0.35, 0.2]}
  cam={{ at: [0.04, 0.06, 0.06], az: [0.25, -0.1], el: [0.42, 0.36], r: [0.82, 0.72], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.5, 4.6), m = Math.min(15, Math.floor(k * 15.4));
  return <>
    {/* la bandeja de chapa */}
    <RBox s={[0.56, 0.012, 0.38]} p={[0, 0.006, 0]} r={0.006}>{M.steel({ col: "#a8a6a2" })}</RBox>
    {Array.from({ length: 12 }, (_, i) => { const x = ((i % 4) - 1.5) * 0.12, z = (Math.floor(i / 4) - 1) * 0.11, rise = lerp(0.6, 1.25, cl(k * 1.3 - rn(i, 2) * 0.15)), brown = cl((k - 0.4) / 0.6);
      return <group key={i} position={[x, 0.012, z]}>
        <mesh position={[0, 0.018 * rise, 0]}><cylinderGeometry args={[0.042, 0.044, 0.036 * rise, 30]} /><meshStandardMaterial color={`rgb(${Math.round(lerp(226, 200, brown))},${Math.round(lerp(204, 150, brown))},${Math.round(lerp(170, 92, brown))})`} roughness={0.85} /></mesh>
        <mesh position={[0, 0.036 * rise + 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.041, 30]} /><meshStandardMaterial color={`rgb(${Math.round(lerp(236, 196, brown))},${Math.round(lerp(224, 132, brown))},${Math.round(lerp(200, 64, brown))})`} roughness={0.7} /></mesh>
      </group>; })}
    {/* el contador de minutos: dos tambores de madera */}
    <group position={[0.2, 0.09, 0.24]} scale={1.9}>
      <RBox s={[0.12, 0.08, 0.06]} p={[0, 0, -0.01]} r={0.01}>{M.wood({ base: [120, 80, 46] })}</RBox>
      <DigitDrum v={Math.floor(m / 10)} p={[-0.022, 0, 0.022]} r={0.026} w={0.03} />
      <DigitDrum v={m % 10} p={[0.022, 0, 0.022]} r={0.026} w={0.03} />
    </group>
    {/* el calor del horno: ondas suaves arriba */}
    {Array.from({ length: 5 }, (_, i) => { const u = (tt * 0.5 + i / 5) % 1; return <mesh key={i} position={[(i - 2) * 0.1, 0.08 + u * 0.2, 0]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.05 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 9:09 · UNA, UNA Y UNA: tres tazas medidoras (azúcar blanca, azúcar negra, agua) se vuelcan de a una en la ollita; el nivel sube y se vuelve ámbar ----
export const HThreecups: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#1b1612" key1={[-0.8, 1.5, 1.3]}
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.12], el: [0.3, 0.26], r: [0.86, 0.74], fov: 30 }}>{(tt) => {
  const p = [0, 1, 2].map((i) => eio(tt, 0.5 + i * 1.2, 1.3 + i * 1.2)), lvl = (p[0] + p[1] + p[2]) / 3, amb = eio(tt, 3.8, 5.4);
  const cols = ["#ece8de", "#9a6a38", "#b9d6e6"];
  return <>
    <RBox s={[0.9, 0.03, 0.4]} p={[0, -0.015, 0]} r={0.006}><meshStandardMaterial color="#3a4540" roughness={0.6} /></RBox>
    {/* la ollita */}
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.1, 0.095, 0.12, 40, 1, true]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0.17, 0.1, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.01, 0.14, 12]} /><meshStandardMaterial color="#1e1c1a" roughness={0.4} /></mesh>
    <mesh position={[0, 0.004 + 0.1 * lvl, 0]} rotation={[-PI / 2, 0, 0]} visible={lvl > 0.01}><circleGeometry args={[0.096, 40]} />
      <meshPhysicalMaterial color={amb > 0.5 ? "#b8661e" : lvl > 0.5 ? "#8a5a2e" : "#e8e2d4"} roughness={0.15} clearcoat={1} transparent opacity={0.92} /></mesh>
    {/* las tres tazas: llegan, se inclinan y vuelven */}
    {[0, 1, 2].map((i) => { const k = p[i], tilt = Math.sin(k * PI), x = lerp((i - 1) * 0.26, 0.1, tilt), y = lerp(0.04, 0.2, tilt);
      return <group key={i} position={[x, y, lerp(0.12, 0, tilt)]} rotation={[0, 0, tilt * 1.9]}>
        <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.045, 0.04, 0.07, 30, 1, true]} /><meshPhysicalMaterial color={["#b8322a", "#2f5d8a", "#3d7a4a"][i]} roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.035, -0.06]} rotation={[PI / 2, 0, 0]}><boxGeometry args={[0.014, 0.06, 0.004]} /><meshPhysicalMaterial color={["#b8322a", "#2f5d8a", "#3d7a4a"][i]} roughness={0.3} clearcoat={0.8} /></mesh>
        <mesh position={[0, 0.06 * (1 - k * 0.9), 0]} rotation={[-PI / 2, 0, 0]} visible={k < 0.95}><circleGeometry args={[0.042, 30]} /><meshStandardMaterial color={cols[i]} roughness={i === 2 ? 0.05 : 0.9} transparent opacity={i === 2 ? 0.7 : 1} /></mesh>
        {/* el chorro mientras se vuelca */}
        <mesh position={[0.05, -0.06, 0]} visible={tilt > 0.55} rotation={[0, 0, -tilt * 1.9]}><cylinderGeometry args={[0.012, 0.018, 0.2, 12]} /><meshStandardMaterial color={cols[i]} roughness={0.6} transparent opacity={0.85} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;
