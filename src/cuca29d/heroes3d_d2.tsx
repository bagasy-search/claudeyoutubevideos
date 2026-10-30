// cuca29d · ronda 2: los 11 componentes que sacaron 4-5. Un objeto héroe grande y entero, la acción que pide la frase,
// nada de carteles: lo que se dice se ve con objetos; movimiento hasta el último cuadro (cámara que avanza + algo vivo).
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, phys, Stage } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Cuchara, Llama, Olla, Onda, Plato } from "./kit3d";
import { Hoja, hojaTex, Tamal, Tazon, Vaporera } from "./heroes3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const arco = (a: V3, b: V3, k: number, hh = 0.8): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + hh * Math.sin(k * P), lerp(a[2], b[2], k)];
const col = (a: string, b: string, k: number) => "#" + new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getHexString();
// cámara que sigue avanzando hasta el final: nunca dos cuadros iguales
const push = (c: V3, tt: number, k = 0.05): V3 => [c[0] + 0.25 * Math.sin(tt * 0.35), c[1] - k * tt * 0.6, c[2] - k * tt];

// cucharita de medir grande (cromo) con su montoncito
const Cucharita: React.FC<{ p: V3; rot?: V3; s?: number; carga?: number; ras?: number; c?: string }> = ({ p, rot, s = 1, carga = 0, ras = 0, c = "#f8f6f0" }) =>
  <group position={p} rotation={rot} scale={s}>
    <mesh castShadow><sphereGeometry args={[0.1, 28, 14, 0, 2 * P, P2, P2]} />{M.cromo()}</mesh>
    <mesh position={[-0.34, 0.0, 0]} rotation={[0, 0, P2]} castShadow><boxGeometry args={[0.035, 0.5, 0.012]} />{M.cromo()}</mesh>
    {carga > 0.01 && <mesh position={[0, -0.005, 0]} scale={[0.095, 0.005 + carga * (0.02 + 0.06 * (1 - ras)), 0.095]}><sphereGeometry args={[1, 24, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={c} roughness={1} /></mesh>}
  </group>;
// lata de polvo para hornear: roja con franjas
const lataTex = () => ctex("lataD", 512, 256, (g) => { g.fillStyle = "#c0392b"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#f4ead2"; g.fillRect(0, 40, 512, 26); g.fillRect(0, 190, 512, 26);
  g.fillStyle = "#f2c040"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(40 + i * 86, 128, 26, 0, 6.28); g.fill(); } });
const Nube: React.FC<{ p: V3; k: number; n?: number; c?: string; r?: number }> = ({ p, k, n = 14, c = "#fbf8f0", r = 0.25 }) => k <= 0 || k >= 1 ? null :
  <group position={p}>{Array.from({ length: n }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * r * (1 + 2 * k), k * 0.35 * rn(i, 2), (rn(i, 3) - 0.5) * r * (1 + 2 * k)]} scale={0.03 + 0.09 * k}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={c} transparent opacity={0.45 * (1 - k)} depthWrite={false} /></mesh>)}</group>;

// ── 6 · POLVO: la cucharita grande se hunde en la lata, sale colmada, la pala de dedo la empareja (lo de más vuelve a la lata en nube) y sólo una pizca cae a la masa
const HPolvo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const dip = eio(tt, 0.3, 1.1) * (1 - eio(tt, 1.2, 1.9)), carga = cl((tt - 1.1) * 4), sw = eio(tt, 2.1, 3.1), go = eio(tt, 3.5, 4.5), tip = eio(tt, 4.6, 5.1) * (1 - eio(tt, 6.0, 6.6));
  const sp: V3 = go > 0 ? arco([-0.5, 0.78, 0.05], [0.55, 0.72, 0.1], go, 0.18) : [-0.5, 0.78 - 0.42 * dip, 0.05];
  return <Estudio t={tt} cam={push([0.05, 1.35, 2.75], tt, 0.04)} look={[0, 0.55, 0]} orbit={0.05} fov={32}>
    <group position={[-0.5, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow><cylinderGeometry args={[0.3, 0.3, 0.6, 40, 1, true]} /><meshStandardMaterial map={lataTex()} metalness={0.4} roughness={0.35} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.6, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.3, 0.012, 8, 40]} />{M.cromo()}</mesh>
      <mesh position={[0, 0.52, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.29, 40]} /><meshStandardMaterial color="#f8f6f0" roughness={1} /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.45, 0.53, (rn(i, 2) - 0.5) * 0.45]} scale={0.02 + 0.02 * rn(i, 3)}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#f1eee6" roughness={1} /></mesh>)}
    </group>
    <Tazon p={[0.6, 0, 0.1]} s={0.85} c="#9a4f2c"><mesh position={[0, 0.18, 0]} scale={[0.45, 0.12, 0.45]}><sphereGeometry args={[1, 30, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh></Tazon>
    <Cucharita p={sp} rot={[0, 0.2, -tip * 1.1]} s={1.9} carga={tip > 0.7 ? 0.25 : carga} ras={sw} />
    {/* pala de dedo (espátula) que pasa al ras sobre la cucharita */}
    <group position={[-0.5 + 0.55 * (sw - 0.5), 0.86, 0.05]} visible={tt > 1.9 && tt < 3.4} rotation={[0, 0.2, 0]}>
      <RBox s={[0.04, 0.16, 0.42]} r={0.01}><meshStandardMaterial color="#d0d4da" metalness={0.85} roughness={0.25} /></RBox>
      <RBox p={[0, 0.16, 0]} s={[0.07, 0.18, 0.12]} r={0.02}>{M.madera("#6a4428")}</RBox>
    </group>
    {/* lo que sobra cae de vuelta a la lata */}
    {Array.from({ length: 24 }, (_, i) => { const a = 2.2 + rn(i, 1) * 0.8; if (tt < a || tt > a + 0.7) return null; const k = (tt - a) / 0.7;
      return <mesh key={"s" + i} position={[-0.5 + 0.15 + (rn(i, 2) - 0.5) * 0.08, 0.84 - 0.3 * k * k, 0.05 + (rn(i, 3) - 0.5) * 0.15]} scale={0.014}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#f8f6f0" roughness={1} /></mesh>; })}
    <Nube p={[-0.45, 0.55, 0.05]} k={cl((tt - 2.4) / 1.6)} />
    {/* la pizca: pocos granitos a la masa, con su soplo chico */}
    {Array.from({ length: 12 }, (_, i) => { const a = 4.7 + rn(i, 4) * 0.4, k = cl((tt - a) / 0.45); if (k <= 0) return null;
      return <mesh key={"p" + i} position={[0.55 + (rn(i, 5) - 0.5) * 0.06, lerp(0.7, 0.29, k * k), 0.1 + (rn(i, 6) - 0.5) * 0.06]} scale={0.013}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>; })}
    <Nube p={[0.6, 0.3, 0.1]} k={cl((tt - 5.1) / 1.4)} n={8} r={0.12} />
  </Estudio>;
}}</Stage>;

// ── 7 · SALADA: la cucharita prueba la masa y se la lleva (hacia la cámara); luego el cucharón vuelca sal gruesa en cascada, los granos rebotan y se hunden
const HSalada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const sc = eio(tt, 0.4, 1.2), up = eio(tt, 1.4, 2.6), lad = ent(tt, 2.8), tilt = eio(tt, 3.4, 4.0) * (1 - eio(tt, 5.8, 6.4));
  const spP: V3 = [lerp(0.25, 0.05, up), lerp(0.42 + 0.12 * (1 - sc), 1.2, up), lerp(0, 1.4, up)];
  return <Estudio t={tt} cam={push([0.1, 1.55, 2.9], tt, 0.04)} look={[0.1, 0.5, 0]} orbit={0.05} fov={32}>
    <Tazon s={1.25} c="#9a4f2c"><mesh position={[0, 0.22, 0]} scale={[0.6, 0.13, 0.6]}><sphereGeometry args={[1, 36, 14, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#e8d6a0" roughness={0.75} /></mesh>
      {sc > 0 && <mesh position={[0.25, 0.37, 0]} scale={[0.07, 0.03 * (1 - up), 0.07]}><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color="#d8c488" roughness={0.8} /></mesh>}</Tazon>
    {up < 0.98 && <group position={spP} rotation={[-0.4 * up, 0.4, 0.15]}><Cuchara p={[0, 0, 0]} s={0.55} mat="madera">
      <mesh position={[0, 0.03, 0]} scale={[0.13, 0.06 * sc, 0.17]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh></Cuchara></group>}
    {/* cucharón de peltre con sal gruesa */}
    <group position={[0.8, 0.85 + 0.9 * (1 - lad), 0.05]} rotation={[0, 0, 0.15 + 1.2 * tilt]}>
      <mesh castShadow><sphereGeometry args={[0.2, 28, 14, 0, 2 * P, P2, P2]} /><meshPhysicalMaterial color="#2c4a6e" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.42, 0.25, 0]} rotation={[0, 0, -0.9]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.75, 10]} /><meshPhysicalMaterial color="#2c4a6e" roughness={0.25} clearcoat={1} /></mesh>
      {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.26, -0.04 + 0.04 * rn(i, 2) - 0.1 * tilt, (rn(i, 3) - 0.5) * 0.26]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} scale={0.03 * (1 - tilt)}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.5} thickness={0.5} /></mesh>)}
    </group>
    {Array.from({ length: 70 }, (_, i) => { const a = 3.7 + rn(i, 1) * 1.9; if (tt < a) return null; const x = (rn(i, 2) - 0.5) * 0.75, z = (rn(i, 3) - 0.5) * 0.7, k = cl((tt - a) / 0.5);
      const y = k < 1 ? lerp(0.78, 0.4, k * k) : 0.4 + 0.08 * Math.abs(Math.sin((tt - a - 0.5) * 9)) * Math.exp(-(tt - a - 0.5) * 5) - 0.03 * cl((tt - a - 0.9) * 1.5);
      return <mesh key={i} position={[lerp(0.72, x, k), y, lerp(0.05, z, k)]} rotation={[rn(i, 4) * 3 + tt * 4 * (1 - k), rn(i, 5) * 3, 0]} scale={0.028 * (1 - 0.6 * cl((tt - a - 1.0)))}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.5} thickness={0.5} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// ── 10 · UNTA: la cuchara de madera trae su bocha de masa y la arrastra del centro a la orilla en tres pasadas: la capa delgada crece, con surcos
const HUnta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const pas = [eio(tt, 0.9, 2.2), eio(tt, 2.5, 3.8), eio(tt, 4.1, 5.4)], tot = (pas[0] + pas[1] + pas[2]) / 3;
  const dir: [number, number][] = [[0.0, -0.42], [0.0, 0.42], [0.18, 0.0]], cur = pas[0] < 1 ? 0 : pas[1] < 1 ? 1 : 2, kk = pas[cur];
  const cp: V3 = tt < 0.9 ? [0.05, 0.3 + 0.5 * (1 - ent(tt, 0.1)), 0] : [dir[cur][0] * kk, 0.17, dir[cur][1] * kk];
  return <Estudio t={tt} cam={push([0.15, 1.95, 1.85], tt, 0.03)} look={[0, 0.1, 0]} orbit={0.05} fov={34}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.8]} r={0.04}>{M.madera("#7a5232")}</RBox>
    <Hoja p={[0, 0.1, 0]} rot={[0, 0, 0]} s={1.05} liso c="#c9a868" />
    {pas.map((k, i) => k > 0.01 && <mesh key={i} position={[dir[i][0] * k * 0.5, 0.135, dir[i][1] * k * 0.5]} scale={[0.17 + 0.03 * i, 0.012, 0.06 + Math.abs(dir[i][1]) * k * 0.9 + Math.abs(dir[i][0]) * k * 0.6]}><sphereGeometry args={[1, 28, 8, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#f7e6a0" roughness={0.6} /></mesh>)}
    {pas.map((k, i) => k > 0.05 && [-1, 0, 1].map((j) => <mesh key={i + "s" + j} position={[dir[i][0] * k * 0.5 + j * 0.06, 0.149, dir[i][1] * k * 0.5]} rotation={[-P2, 0, 0]} scale={[0.008, 0.04 + (Math.abs(dir[i][1]) + Math.abs(dir[i][0])) * k * 0.8, 1]}><planeGeometry args={[1, 1]} /><meshStandardMaterial color="#d8c078" roughness={0.8} /></mesh>))}
    <group position={cp} rotation={[0.25, cur === 1 ? P : cur === 2 ? -P2 : 0, 0]}>
      <Cuchara p={[0, 0, 0]} s={0.85} mat="madera">
        <mesh position={[0, 0.04, 0]} scale={[0.15 * (1 - 0.7 * tot), 0.1 * (1 - 0.7 * tot), 0.18 * (1 - 0.7 * tot)]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#f7e6a0" roughness={0.6} /></mesh></Cuchara></group>
  </Estudio>;
}}</Stage>;

// ── 11 · DIANA: la cuchara baja con su montículo de relleno, lo suelta justo al centro de la masa y se retira; queda la orilla limpia alrededor
const Relleno: React.FC<{ s?: number }> = ({ s = 1 }) => <group scale={s}>
  {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.14, 0.03 + 0.05 * rn(i, 2), (rn(i, 3) - 0.5) * 0.2]} scale={[0.05 + 0.03 * rn(i, 4), 0.04, 0.05 + 0.03 * rn(i, 5)]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color={i % 4 ? "#8a2412" : "#b8402a"} roughness={0.3} clearcoat={0.8} /></mesh>)}
  {Array.from({ length: 6 }, (_, i) => <mesh key={"c" + i} position={[(rn(i, 6) - 0.5) * 0.12, 0.07, (rn(i, 7) - 0.5) * 0.16]} rotation={[rn(i, 8), rn(i, 9), 0]} scale={0.03}><boxGeometry args={[1, 0.7, 1.3]} /><meshStandardMaterial color="#e4c49a" roughness={0.6} /></mesh>)}
</group>;
const HDiana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const dn = eio(tt, 0.4, 1.6), tip = eio(tt, 1.8, 2.4), drop = cl((tt - 2.2) / 0.35), sq = Math.exp(-Math.max(0, tt - 2.55) * 6) * (tt > 2.55 ? 1 : 0), aw = eio(tt, 2.9, 3.9), glow = eio(tt, 3.8, 4.6);
  return <Estudio t={tt} cam={push([0.1, 1.95, 1.85], tt, 0.03)} look={[0, 0.12, 0]} orbit={0.06} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.2, 0.08, 1.8]} r={0.04}>{M.madera("#7a5232")}</RBox>
    <Hoja p={[0, 0.1, 0]} s={1.05} liso c="#c9a868" />
    <mesh position={[0, 0.13, 0]} scale={[0.27, 0.014, 0.42]}><sphereGeometry args={[1, 30, 10, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#f4e2a4" roughness={0.65} /></mesh>
    {drop > 0 && <group position={[0, lerp(0.42, 0.14, drop * drop), 0]} scale={[1 + 0.25 * sq, 1 - 0.35 * sq, 1 + 0.25 * sq]}><Relleno s={0.85} /></group>}
    <group position={[0.35 * aw, 0.2 + 0.8 * (1 - dn) + 0.6 * aw, 0.1 * aw]} rotation={[0, -0.4, tip * 0.9]}>
      <Cuchara p={[0, 0, 0]} s={0.85} mat="madera">{drop <= 0 && <group position={[0, 0.02, 0]}><Relleno s={0.85} /></group>}</Cuchara></group>
    <mesh position={[0, 0.142, 0]} rotation={[-P2, 0, 0]} scale={[1, 1.55, 1]}><ringGeometry args={[0.2, 0.235, 48]} /><meshBasicMaterial color="#ffe2a0" transparent opacity={0.55 * glow * (0.75 + 0.25 * Math.sin(tt * 3))} toneMapped={false} depthWrite={false} /></mesh>
    <mesh position={[0, 0.101, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.42, 32]} /><meshBasicMaterial color="#000000" transparent opacity={0.12 * cl(1 - (0.2 + 0.8 * (1 - dn)) / 1.0)} depthWrite={false} /></mesh>
  </Estudio>;
}}</Stage>;

// ── 12 · RULETA (5 errores): de la vaporera abierta sale UN tamal por error, cae al plato, se abre y muestra su falla; al lado queda su ficha de madera con el número
const fichaTex = (n: number) => ctex("fichaD" + n, 256, 256, (g) => { g.fillStyle = "#c89a60"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 30; i++) { g.strokeStyle = `rgba(90,55,25,${0.15 + 0.2 * rn(i, 1)})`; g.beginPath(); g.moveTo(0, i * 9); g.bezierCurveTo(80, i * 9 + 6, 170, i * 9 - 6, 256, i * 9); g.stroke(); }
  g.fillStyle = "#3a1c10"; g.font = "800 190px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 128, 140); });
const Falla: React.FC<{ i: number; k: number; tt: number }> = ({ i, k, tt }) => {
  // 0 manteca sin batir: masa densa y grumosa · 1 caldo caliente: masa cocida a medias, con grietas · 2 masa muy gruesa · 3 relleno aguado: charco rojo · 4 destapar: centro crudo, sin vapor
  const masaC = ["#d8c48a", "#e0c890", "#efe0b0", "#efe0b0", "#f4ecd0"][i];
  return <group>
    {[-1, 1].map((sg) => <group key={sg} rotation={[sg * 1.25 * k, 0, 0]}><mesh position={[0, 0, sg * 0.15]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.2, 0.2, 0.86, 20, 1, true, sg > 0 ? 0 : P, P]} /><meshPhysicalMaterial map={hojaTex(true)} color="#d8c08a" roughness={0.7} side={THREE.DoubleSide} /></mesh></group>)}
    <mesh position={[0, 0.02, 0]} rotation={[0, 0, P2]} scale={[1, 1, i === 2 ? 1.3 : 0.8]} castShadow><capsuleGeometry args={[i === 2 ? 0.18 : 0.13, 0.46, 8, 16]} /><meshStandardMaterial color={masaC} roughness={i === 0 ? 1 : 0.7} flatShading={i === 0 || i === 1} /></mesh>
    {i === 0 && Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.5, 0.13, (rn(j, 2) - 0.5) * 0.12]} scale={0.035}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#c8b070" roughness={1} flatShading /></mesh>)}
    {i === 1 && [0, 1, 2].map((j) => <mesh key={j} position={[-0.18 + j * 0.18, 0.135, 0]} rotation={[-P2, 0, 0.5 * j]}><planeGeometry args={[0.012, 0.16]} /><meshBasicMaterial color="#6a5030" /></mesh>)}
    {i === 3 && <mesh position={[0.1, -0.05, 0.25 + 0.15 * k]} rotation={[-P2, 0, 0]} scale={[0.1 + 0.35 * k, 0.08 + 0.2 * k, 1]}><circleGeometry args={[1, 28]} /><meshPhysicalMaterial color="#9a2a14" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>}
    {i === 4 && <mesh position={[0, 0.14, 0]} scale={[0.22, 0.02, 0.07]}><sphereGeometry args={[1, 16, 8]} /><meshPhysicalMaterial color="#f8f2dc" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>}
    {i !== 4 && <Vapor t={tt} p={[0, 0.15, 0]} o={0.3 * k} h={0.6} s={0.18} spread={0.3} n={6} />}
  </group>; };
const HRuletaD: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  const cur = E.reduce((c, e, i) => (tt >= (i === 0 ? -1 : e.a - h.at) ? i : c), 0);
  return <Estudio t={tt} cam={[0.3 + 0.2 * Math.sin(tt * 0.3), 1.5, 3.0 - 0.02 * (tt % 5)]} look={[0, 0.45, 0]} orbit={0.04}>
    <Vaporera p={[-1.25, 0, -0.5]} s={0.72} agua={0.2} t={tt}>{[0, 1, 2].map((j) => <Tamal key={j} p={[(j - 1) * 0.3, 0.75, 0]} rot={[0, 0, P2 - 0.15]} s={0.8} />)}</Vaporera>
    <Vapor t={tt} p={[-1.25, 1.05, -0.5]} o={0.35} h={1.2} s={0.3} spread={0.5} n={12} />
    <Plato p={[0.35, 0.02, 0.25]} s={1.7} c="#efe6d2" />
    {E.map((e, i) => { const a = i === 0 ? 0.0 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9; if (tt < a - 0.1 || tt > nx + 0.7) return null;
      const fl = eio(tt, a, a + 0.9), op = eio(tt, a + 1.1, a + 1.9), gone = eio(tt, nx, nx + 0.6);
      const pos = arco([-1.25, 1.05, -0.5], [0.35, 0.12, 0.25], fl, 0.55);
      return <group key={i}>
        <group position={[pos[0] + 1.6 * gone, pos[1], pos[2]]} rotation={[0, 0.15 + (1 - fl) * 1.5, 0]}><Falla i={i} k={op} tt={tt} /></group>
        <group position={[0.95 + 1.6 * gone, 0.05 + fall(tt, a + 1.3, 0.8), 0.75]} rotation={[-P2 + 0.25, 0, -0.15]}>
          <mesh castShadow><cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />{M.madera("#a8784a")}</mesh>
          <mesh position={[0, 0.027, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.19, 32]} /><meshStandardMaterial map={fichaTex(i + 1)} roughness={0.7} /></mesh></group>
      </group>; })}
    <pointLight position={[0.35, 1.0, 0.9]} intensity={1.2 + 0.6 * Math.sin(tt * 2)} distance={2.5} color="#ffd9a8" />
    {void cur}
  </Estudio>;
}}</Stage>;

// ── 13 · DOBLEZ: hoja de maíz con nervaduras: se cierra un lado, luego el otro sobre el relleno, y la punta se dobla HACIA ATRÁS, por debajo
const solapa = (w: number, L: number) => { const g = new THREE.PlaneGeometry(w, L, 6, 10); g.translate(w / 2, 0, 0); g.rotateX(-P2); return g; };
const solG = solapa(0.36, 1.05), puntaG = (() => { const g = new THREE.PlaneGeometry(0.62, 0.5, 6, 6); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (0.35 + 0.65 * (y + 0.25) / 0.5)); } g.translate(0, -0.25, 0); g.rotateX(-P2); return g; })();
const HDoblez: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const l = eio(tt, 0.7, 1.8), r = eio(tt, 2.0, 3.1), back = eio(tt, 3.6, 4.9), lift = Math.sin(eio(tt, 5.3, 6.3) * P) * 0.12;
  const mat = <meshPhysicalMaterial map={hojaTex(false)} color="#f0dca8" roughness={0.45} clearcoat={0.3} side={THREE.DoubleSide} />;
  return <Estudio t={tt} cam={[0.9 - 0.25 * eio(tt, 3.2, 5.0), 1.25, 1.75]} look={[0, 0.12, -0.05]} orbit={0.05} fov={32}>
    <RBox p={[0, 0.04, 0]} s={[2.4, 0.08, 1.9]} r={0.04}>{M.madera("#7a5232")}</RBox>
    <mesh position={[0, 0.081, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.55, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} /></mesh>
    <group position={[0, 0.1 + lift, 0]}>
      {/* centro con masa y relleno */}
      <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[0.32, 1.05]} /><meshPhysicalMaterial map={hojaTex(false)} color="#f0dca8" roughness={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.035, -0.05]} scale={[0.13, 0.04, 0.4]} castShadow><sphereGeometry args={[1, 24, 12]} /><meshStandardMaterial color="#f2e2ac" roughness={0.7} /></mesh>
      <mesh position={[0, 0.06, -0.05]} scale={[0.05, 0.025, 0.3]}><sphereGeometry args={[1, 16, 8]} /><meshPhysicalMaterial color="#8a2412" roughness={0.3} clearcoat={0.7} /></mesh>
      {/* solapa izquierda y derecha: bisagras a lo largo */}
      <group position={[-0.16, 0.0, 0]} rotation={[0, 0, P - (P - 0.32) * l]}><mesh geometry={solG} castShadow>{mat}</mesh></group>
      <group position={[0.16, 0.02, 0]} rotation={[0, 0, -(P - 0.42) * r]}><group scale={[-1, 1, 1]}><mesh geometry={solG} castShadow>{mat}</mesh></group></group>
      {/* la punta: bisagra en el extremo, se va para atrás y por debajo */}
      <group position={[0, -0.005, 0.52]} rotation={[-(P - 0.12) * back, 0, 0]}><group scale={[1, 1, -1]}><mesh geometry={puntaG} castShadow>{mat}</mesh></group></group>
    </group>
    <pointLight position={[0.4, 1.0, 1.0]} intensity={0.6 + 1.2 * back} distance={2.5} color="#fff0d0" />
  </Estudio>;
}}</Stage>;

// ── 22 · ORILLA: la jarra de barro grande se inclina y el hilo de agua entra por la ORILLA, resbala por la pared interna; los tamales arriba quedan secos
const HOrilla: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.8, 1.6) * (1 - eio(tt, 5.4, 6.2)), pour = cl((tt - 1.5) * 3) * (1 - cl((tt - 5.3) * 3)), lvl = 0.1 + 0.16 * eio(tt, 1.7, 5.3);
  return <Estudio t={tt} cam={push([0.45, 2.0, 3.9], tt, 0.03)} look={[0.25, 0.95, 0]} orbit={0.05}>
    <Vaporera s={1.0} corte={0.55} agua={lvl} t={tt}>
      {Array.from({ length: 6 }, (_, i) => <Tamal key={i} p={[(i - 2.5) * 0.2, 0.86, -0.05]} rot={[0, 0, P2 - 0.12]} s={0.72} />)}
    </Vaporera>
    <Llama p={[0, -0.05, 0]} f={0.5} t={tt} r={0.5} />
    <group position={[1.05, 1.62, 0.15]} rotation={[0, 0, 1.0 * tilt]}>
      <mesh geometry={lathe([[0, 0], [0.2, 0], [0.3, 0.2], [0.26, 0.45], [0.17, 0.55], [0.2, 0.62]], 32)} castShadow><meshStandardMaterial color="#a0542e" roughness={0.6} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.3, 0.32, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.12, 0.03, 8, 16, P]} /><meshStandardMaterial color="#8a4526" roughness={0.65} /></mesh></group>
    {pour > 0.01 && <Chorro t={tt} a={[0.86, 1.95, 0.15]} b={[0.84, 1.42, 0.15]} r={0.03 * pour} c="#cfe6ee" o={0.7} splash={false} />}
    {/* el hilo resbala pegado a la pared interna */}
    {pour > 0.01 && <mesh position={[0.81, 0.85, 0.15]} rotation={[0, 0, 0.02]} scale={[1, 1, 1]}><boxGeometry args={[0.012, 1.15, 0.05]} /><meshPhysicalMaterial color="#e8f6fc" roughness={0} clearcoat={1} transparent opacity={0.6 * pour} /></mesh>}
    {Array.from({ length: 3 }, (_, i) => <Onda key={i} p={[0.72, 0.04 + lvl, 0.15]} t={tt} a={1.9 + i * 1.1} r={0.6} />)}
    {/* una gota que salpica en la pared y no llega a los tamales */}
    <mesh position={[0.8, 0.45 + fall(tt, 3.0, 0.2), 0.15]} scale={0.02 * (tt > 3 && tt < 4 ? 1 : 0)}><sphereGeometry args={[1, 8, 6]} />{M.liquido("#e8f6fc", 0.7)}</mesh>
    <Vapor t={tt} p={[0, 1.4, 0]} o={0.25} h={0.9} s={0.25} spread={0.8} n={8} />
  </Estudio>;
}}</Stage>;

// ── 23 · CONGELA: bolsa con cierre grande: entran los tamales de a uno, la bolsa se aplasta sacando el aire, corre el cierre y la escarcha crece
const bolsaGeo = (() => { const g = new THREE.BoxGeometry(1.6, 0.36, 1.0, 16, 4, 10); return g; })();
const bolsaG = bolsaGeo.clone();
const HCongela: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const air = eio(tt, 3.0, 3.9), zip = eio(tt, 4.0, 4.8), fr = eio(tt, 4.9, 7.0);
  { const p = bolsaG.attributes.position, b = bolsaGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = b.getX(i), y = b.getY(i), z = b.getZ(i);
      const bump = Math.max(0, Math.cos(((x % 0.4) + 0.4) % 0.4 / 0.4 * 2 * P - P) * 0.5 + 0.5);
      p.setY(i, y > 0 ? lerp(y, 0.04 + 0.1 * bump * (Math.abs(z) < 0.3 ? 1 : 0.3), air) : y); p.setX(i, x); p.setZ(i, z); } p.needsUpdate = true; bolsaG.computeVertexNormals(); }
  const esc = ctex("escD2" + Math.round(fr * 8), 256, 256, (g) => { g.clearRect(0, 0, 256, 256); for (let i = 0; i < 900 * fr; i++) { g.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * rn(i, 1)})`; const s = 1 + 3 * rn(i, 4); g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, s, s); } });
  return <Estudio t={tt} cam={push([0.1, 1.45, 2.4], tt, 0.03)} look={[0, 0.25, 0]} orbit={0.05}>
    <pointLight position={[0, 1.2, 1.0]} intensity={2.8 * fr} distance={3.5} color="#b8dcff" />
    {[0, 1, 2, 3].map((i) => { const a = 0.4 + i * 0.55, k = eio(tt, a, a + 0.6), x = -0.54 + i * 0.36;
      return <Tamal key={i} p={arco([1.6, 0.5, 0.2], [x, 0.17, 0], k, 0.4)} rot={[0, P2, 0]} s={0.78} />; })}
    <mesh geometry={bolsaG} position={[0, 0.19, 0]}><meshPhysicalMaterial color="#eef6fb" roughness={0.12} transmission={0.9} thickness={0.1} transparent opacity={0.4} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh geometry={bolsaG} position={[0, 0.191, 0]} scale={1.003}><meshStandardMaterial map={esc} transparent depthWrite={false} /></mesh>
    {/* la mano que aplasta y saca el aire */}
    <group position={[lerp(-0.8, 0.8, air), 0.32 + 0.35 * (1 - cl((tt - 2.8) * 3)) + 0.4 * cl((tt - 3.95) * 3), 0]} visible={tt > 2.7 && tt < 4.3}>
      <RBox s={[0.38, 0.1, 0.5]} r={0.05}><meshStandardMaterial color="#c99a7a" roughness={0.6} /></RBox></group>
    {/* el cierre: riel azul y el deslizador que corre */}
    <RBox p={[0, 0.2 + 0.18 * (1 - air), -0.5]} s={[1.62, 0.04, 0.04]} r={0.01}><meshStandardMaterial color="#2a6ab0" roughness={0.4} /></RBox>
    <RBox p={[lerp(-0.8, 0.8, zip), 0.22 + 0.18 * (1 - air), -0.5]} s={[0.08, 0.08, 0.08]} r={0.02}><meshStandardMaterial color="#d84a2a" roughness={0.4} /></RBox>
    {/* el copo grande al decir «tres meses» */}
    <group position={[0.75, 0.75, 0.2]} rotation={[0, tt * 0.6, 0]} scale={0.001 + 0.25 * eio(tt, 5.4, 6.1)}>
      {[0, 1, 2].map((i) => <mesh key={i} rotation={[0, 0, (i * P) / 3]}><boxGeometry args={[1.0, 0.06, 0.03]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.05} clearcoat={1} emissive="#9ad0ff" emissiveIntensity={0.4} /></mesh>)}
      {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={"r" + i} position={[Math.cos((i * P) / 3) * 0.32, Math.sin((i * P) / 3) * 0.32, 0]} rotation={[0, 0, (i * P) / 3 + P2]}><boxGeometry args={[0.2, 0.04, 0.03]} /><meshPhysicalMaterial color="#e8f6ff" roughness={0.05} emissive="#9ad0ff" emissiveIntensity={0.4} /></mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// ── 25 · TENDEDERO («lo que mi abuela nunca hacía»): cada «nunca» llega como objeto y le cae encima una cruz de dos hojas de maíz con nervaduras, que rebota con peso
const NuncaObj: React.FC<{ i: number; tt: number }> = ({ i, tt }) => {
  if (i === 0) return <group><RBox s={[0.55, 0.3, 0.34]} r={0.04}><meshStandardMaterial color="#f2ead0" roughness={0.5} /></RBox>
    {Array.from({ length: 30 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.52, 0.155, (rn(j, 2) - 0.5) * 0.3]} scale={0.015}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0} clearcoat={1} emissive="#cfe8ff" emissiveIntensity={0.3} /></mesh>)}</group>;
  if (i === 1) return <><Olla s={0.5} nivel={0.9} caldo="#d0a040" t={tt} hervor={1.2} /><Vapor t={tt} p={[0, 0.45, 0]} o={0.5} h={1.0} s={0.28} spread={0.3} n={12} />
    <mesh position={[0.33, 0.25, 0.1]} scale={[0.04, 0.22, 0.04]}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#d0a040", 0.9)}</mesh></>;
  if (i === 2) return <group>{[0.3, -0.3].map((y, j) => <mesh key={j} position={[0, 0.3 + y * 0.5, 0]} geometry={lathe([[0, -0.0], [0.22, 0.02], [0.03, 0.28]], 24)} rotation={[j ? P : 0, 0, 0]}>{M.vidrio()}</mesh>)}
    <mesh position={[0, 0.3 + 0.12 * Math.sin(tt * 4), 0]} scale={[0.05, 0.12, 0.05]}><coneGeometry args={[1, 1, 12]} /><meshStandardMaterial color="#e0c090" /></mesh>
    {[-1, 1].map((j) => <mesh key={j} position={[0, 0.3 + j * 0.32, 0]}><cylinderGeometry args={[0.25, 0.25, 0.04, 24]} />{M.madera("#6a4428")}</mesh>)}</group>;
  if (i === 3) return <Vaporera s={0.38} agua={0.2} t={tt}><group position={[0.6, 1.7 + 0.1 * Math.sin(tt * 3), 0]} rotation={[0, 0, -0.9]}><mesh><cylinderGeometry args={[0.88, 0.9, 0.05, 32]} /><meshStandardMaterial color="#b8bcc4" metalness={0.85} roughness={0.3} /></mesh></group><Vapor t={tt} p={[0, 1.4, 0]} o={0.5} h={1.4} s={0.6} spread={0.6} n={10} /></Vaporera>;
  return <group><Tazon s={0.75} c="#9a4f2c"><mesh position={[0, 0.16, 0]} scale={[0.4, 0.1, 0.4]}><sphereGeometry args={[1, 24, 10, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#d8c488" roughness={0.9} flatShading /></mesh></Tazon>
    <Cuchara p={[0.05, 0.38, 0]} rot={[0.2, 0.5, 0.3 * Math.sin(tt * 10)]} s={0.45} /></group>;
};
const hojaCruz = (() => { const g = new THREE.PlaneGeometry(0.22, 1.2, 4, 12); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - Math.pow(Math.abs(y) / 0.6, 2) * 0.7)); p.setZ(i, 0.04 * Math.pow(p.getX(i) / 0.11, 2)); } g.computeVertexNormals(); return g; })();
const HTendedero: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[];
  return <Estudio t={tt} cam={[0.1 + 0.15 * Math.sin(tt * 0.4), 1.25, 2.6]} look={[0, 0.4, 0]} orbit={0.04}>
    {E.map((e, i) => { const a = i === 0 ? 0.0 : e.a - h.at, nx = E[i + 1] ? E[i + 1].a - h.at : 1e9, k = ent(tt, a), gone = eio(tt, nx - 0.1, nx + 0.5);
      if (tt < a - 0.3 || gone >= 1) return null;
      const xa = a + 1.0, cy = fall(tt, xa, 1.2), sq = tt > xa + 0.5 ? Math.exp(-(tt - xa - 0.5) * 5) * Math.sin((tt - xa - 0.5) * 14) * 0.15 : 0;
      return <group key={i} position={[-2.6 * gone, 0.02 + (1 - k) * 1.2, 0]}>
        <NuncaObj i={i} tt={tt} />
        {tt > xa - 0.05 && <group position={[0, 0.45 + cy, 0.32]} rotation={[0.15, 0, sq]}>{[-1, 1].map((sg) => <mesh key={sg} geometry={hojaCruz} rotation={[0, 0, sg * 0.78]} castShadow><meshPhysicalMaterial map={hojaTex(true)} color="#e0c890" roughness={0.6} side={THREE.DoubleSide} /></mesh>)}</group>}
      </group>; })}
  </Estudio>;
}}</Stage>;

// ── 26 · CARTAS (5 preguntas, ~30 s cada una): cae el sobre con lacre, se abre, sube la carta con la pregunta; se escribe la respuesta
//        y al lado aparece la respuesta HECHA OBJETO (manteca vegetal batida, olla honda con piedritas, el puñito de masa, leche y azúcar, el caldo guardado)
const wrap = (s: string, n = 16) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) out.push(cur.trim()); return out; };
const Respuesta: React.FC<{ i: number; k: number; tt: number }> = ({ i, k, tt }) => {
  if (k <= 0.001) return null;
  if (i === 0) return <group scale={k}><Tazon s={0.9} c="#e8dcc4"><mesh position={[0, 0.2, 0]} scale={[0.45, 0.14 + 0.05 * Math.sin(tt * 2), 0.45]}><sphereGeometry args={[1, 30, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#fbf8f0" roughness={0.9} /></mesh></Tazon>
    <group position={[0.06 * Math.cos(tt * 8), 0.5, 0.06 * Math.sin(tt * 8)]} rotation={[0.2 * Math.cos(tt * 8), tt * 8, 0.2 * Math.sin(tt * 8)]}>{[0, 1, 2, 3].map((j) => <mesh key={j} rotation={[0, (j * P) / 4, 0]} position={[0, -0.15, 0]} scale={[1, 1.6, 1]}><torusGeometry args={[0.09, 0.006, 6, 24]} />{M.cromo()}</mesh>)}
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.02, 0.025, 0.35, 10]} />{M.madera("#a8784a")}</mesh></group></group>;
  if (i === 1) return <group scale={k}><Olla s={0.6} mat="peltre" nivel={0.25} caldo="#cfe6ee" t={tt} hervor={0.8} />
    {Array.from({ length: 12 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.6, 0.06, (rn(j, 2) - 0.5) * 0.6]} scale={0.045}><dodecahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#8a8070" roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.3, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.36, 24]} /><meshStandardMaterial color="#9aa0a8" metalness={0.9} roughness={0.3} wireframe /></mesh>
    <Vapor t={tt} p={[0, 0.45, 0]} o={0.35} h={0.8} s={0.22} spread={0.3} n={8} /></group>;
  if (i === 2) return <group scale={k}><Tazon s={0.9} c="#9a4f2c"><mesh position={[0, 0.2, 0]} scale={[0.46, 0.1, 0.46]}><sphereGeometry args={[1, 30, 12, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#efe0b0" roughness={0.75} /></mesh></Tazon>
    {Array.from({ length: 16 }, (_, j) => { const a = 1.0 + ((tt * 0.25 + rn(j, 1)) % 1) * 2.5, kk = cl(((tt * 0.8 + rn(j, 1) * 3) % 3) / 0.9); return <mesh key={j} position={[(rn(j, 2) - 0.5) * 0.1, lerp(0.75, 0.25, kk * kk), (rn(j, 3) - 0.5) * 0.1]} scale={0.02 * (kk < 1 ? 1 : 0)}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#e8d6a0" roughness={1} />{void a}</mesh>; })}
    <group position={[0, 0.82, 0]} rotation={[0, 0, P]}><RBox s={[0.2, 0.08, 0.18]} r={0.04}><meshStandardMaterial color="#c99a7a" roughness={0.6} /></RBox></group></group>;
  if (i === 3) return <group scale={k}><group position={[-0.3, 0, 0]}><mesh geometry={lathe([[0, 0], [0.14, 0], [0.16, 0.4], [0.12, 0.48]], 28)} castShadow>{M.vidrio()}</mesh>
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.135, 0.13, 0.32, 24]} /><meshStandardMaterial color="#fbf8f0" roughness={0.4} /></mesh><Vapor t={tt} p={[0, 0.48, 0]} o={0.25} h={0.5} s={0.12} spread={0.1} n={5} /></group>
    <group position={[0.3, 0, 0]}><mesh geometry={lathe([[0, 0], [0.12, 0], [0.17, 0.2], [0.18, 0.22]], 24)} castShadow><meshPhysicalMaterial color="#f3efe6" roughness={0.3} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 20 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.2, 0.2 + 0.03 * rn(j, 2), (rn(j, 3) - 0.5) * 0.2]} scale={0.012}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>)}</group></group>;
  return <group scale={k}><Olla s={0.55} nivel={0.6} caldo="#c8702a" t={tt} hervor={0.2}>
      {Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[(rn(j, 1) - 0.5) * 0.8, 0.47, (rn(j, 2) - 0.5) * 0.8]} rotation={[-P2, 0, 0]} scale={0.04 + 0.04 * rn(j, 3)}><circleGeometry args={[1, 14]} /><meshPhysicalMaterial color="#e05a1a" roughness={0} clearcoat={1} transparent opacity={0.85} /></mesh>)}</Olla>
    <group position={[0.6, 0, 0.1]}><mesh geometry={lathe([[0, 0], [0.13, 0], [0.14, 0.3], [0.1, 0.36]], 24)}>{M.vidrio()}</mesh><mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.125, 0.12, 0.24, 20]} />{M.liquido("#c8702a", 0.9)}</mesh>
      <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.1, 0.1, 0.04, 20]} />{M.cromo("#c8a040")}</mesh></group></group>;
};
const HCartas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (t >= e.a ? i : c), 0);
  const s = S[cur] ?? { a: h.at, tx: "|" }, [q, r] = s.tx.split("|"), a = cur === 0 ? 0 : s.a - h.at, lt = tt - a, nx = S[cur + 1] ? S[cur + 1].a - h.at : 1e9;
  const k = ent(tt, a), op = eio(tt, a + 0.6, a + 1.4), rise = eio(tt, a + 1.3, a + 2.2), w = cl((lt - 2.6) / 2.2), side = eio(tt, a + 5.0, a + 6.2), ob = ent(tt, a + 5.4), out = eio(tt, nx - 0.6, nx);
  return <Estudio t={tt} cam={[0.15 + 0.25 * Math.sin(lt * 0.15), 1.5 - 0.15 * side, 2.5 - 0.004 * Math.min(lt, 30)]} look={[0.25 * side, 0.45, 0]} orbit={0.04}>
    <group position={[-0.55 * side - 2.5 * out, 0, 0]}>
      <group position={[0, 0.03 + (1 - k) * 1.4, 0]} rotation={[0, -0.25 * side, 0]}>
        <RBox s={[1.3, 0.03, 0.85]} r={0.01}><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></RBox>
        {/* solapa del sobre con el lacre rojo */}
        <group position={[0, 0.02, -0.42]} rotation={[-P * 0.92 * op, 0, 0]}><mesh position={[0, 0, 0.26]} rotation={[-P2, 0, 0]}><shapeGeometry args={[(() => { const sh = new THREE.Shape(); sh.moveTo(-0.65, 0.26); sh.lineTo(0.65, 0.26); sh.lineTo(0, -0.26); sh.closePath(); return sh; })()]} /><meshStandardMaterial color="#ddd0b0" side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.012, 0.48]} visible={op < 0.3}><cylinderGeometry args={[0.07, 0.07, 0.025, 20]} /><meshPhysicalMaterial color="#a8201a" roughness={0.3} clearcoat={0.8} /></mesh></group>
        <mesh position={[0.5, 0.017, 0.25]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.18, 0.22]} /><meshStandardMaterial color="#3a7a5a" roughness={0.7} /></mesh>
        {/* la carta sube con la pregunta grande y debajo la respuesta que se escribe */}
        <group position={[0, 0.04 + 0.6 * rise, -0.05 - 0.15 * rise]} rotation={[-P2 + 1.25 * rise, 0, 0]}>
          <mesh><planeGeometry args={[1.15, 0.95]} /><meshStandardMaterial color="#fbf8ef" roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <mesh position={[0, 0.22, 0.004]}><planeGeometry args={[1.1, 0.44]} /><meshStandardMaterial map={papel("cq2" + cur, wrap(q), { w: 1024, h: 410, size: 120, bg: "#fbf8ef" })} roughness={0.9} /></mesh>
          <group position={[-0.55 + 0.55 * Math.max(0.001, w), -0.24, 0.005]} scale={[Math.max(0.001, w), 1, 1]}><mesh position={[0, 0, 0]}><planeGeometry args={[1.1, 0.44]} /><meshStandardMaterial map={papel("cr2" + cur, wrap(r ?? ""), { w: 1024, h: 410, size: 118, bg: "#f3e6bc", ink: "#1e2a4a" })} roughness={0.9} /></mesh></group>
        </group>
      </group>
    </group>
    <group position={[0.75 - 2.5 * out, 0.02 + (1 - ob) * 1.0, 0.1]} rotation={[0, 0.2 * Math.sin(lt * 0.2), 0]}><Respuesta i={cur} k={side} tt={tt} /></group>
  </Estudio>;
}}</Stage>;

// ── 30 · CALDO (el secreto): la olla del relleno se inclina, su capa de grasa roja brilla; el chorro curvo entra a la masa y la pinta en remolino
const HCaldoD: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.9, 1.7) * (1 - eio(tt, 5.0, 5.8)), pour = cl((tt - 1.6) * 3) * (1 - cl((tt - 4.9) * 3)), mix = eio(tt, 2.0, 6.5), sw = tt * 1.6;
  return <Estudio t={tt} cam={push([0.3, 1.75, 3.3], tt, 0.035)} look={[0.05, 0.6, 0]} orbit={0.05}>
    <Tazon p={[0.55, 0, 0.1]} s={1.3} c="#9a4f2c">
      <mesh position={[0, 0.2, 0]} scale={[0.56, 0.13, 0.56]}><sphereGeometry args={[1, 40, 16, 0, 2 * P, 0, P2]} /><meshStandardMaterial color={col("#efe0b0", "#e09a50", mix * 0.85)} roughness={0.7} /></mesh>
      {/* remolino rojo-dorado que crece de adentro hacia afuera */}
      {Array.from({ length: 26 }, (_, i) => { const u = i / 26, r = 0.04 + 0.42 * u * cl(mix * 1.6 - u * 0.6), a = sw + u * 9; if (r < 0.045) return null;
        return <mesh key={i} position={[Math.cos(a) * r, 0.33 + 0.005 * i * 0, Math.sin(a) * r]} rotation={[-P2, 0, -a]} scale={[0.06, 0.02 + 0.02 * u, 1]}><circleGeometry args={[1, 12]} /><meshPhysicalMaterial color={col("#e86a20", "#c8501a", u)} roughness={0.15} clearcoat={0.8} transparent opacity={0.85 * (1 - 0.6 * eio(tt, 5.8, 7.5))} /></mesh>; })}
    </Tazon>
    <group position={[-0.75, 1.0, 0.1]} rotation={[0, 0, -0.95 * tilt]}>
      <Olla s={0.55} nivel={0.75} caldo="#c8702a" t={tt} hervor={0.15}>
        {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.9, 0.575, (rn(i, 2) - 0.5) * 0.9]} rotation={[-P2, 0, 0]} scale={0.05 + 0.05 * rn(i, 3)}><circleGeometry args={[1, 14]} /><meshPhysicalMaterial color="#f05a10" roughness={0} clearcoat={1} emissive="#a02a00" emissiveIntensity={0.25} transparent opacity={0.9} /></mesh>)}
      </Olla>
    </group>
    {pour > 0.01 && <Chorro t={tt} a={[-0.38, 1.33, 0.1]} b={[0.5, 0.42, 0.1]} r={0.055 * pour} c="#d8701e" o={0.9} />}
    <Vapor t={tt} p={[-0.75, 1.4, 0.1]} o={0.3} h={0.7} s={0.2} spread={0.3} n={7} />
    <Vapor t={tt} p={[0.55, 0.45, 0.1]} o={0.25 * mix} h={0.7} s={0.22} spread={0.5} n={7} />
  </Estudio>;
}}</Stage>;

export const MAPD2: Record<string, C> = { polvo: HPolvo, salada: HSalada, unta: HUnta, diana: HDiana, ruleta: HRuletaD, doblez: HDoblez,
  orilla: HOrilla, congela: HCongela, tendedero: HTendedero, cartas: HCartas, caldo: HCaldoD };
