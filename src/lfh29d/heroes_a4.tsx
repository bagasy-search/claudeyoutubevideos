// lfh29d · componentes únicos 22-28 (la balanza 45 contra 10, las monedas del año que llegan a 700, la casa que se llena del olor del caldo, la tarde de despensa en orden, las cajas que no entran al estante, las doce cosas de siempre, el huevo fresco que no se pela).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Coin, Egg } from "./bk";
import { Jar, Jug, SodaBox } from "./ck";

const PI = Math.PI;
const tag = (key: string, txt: string, bg = "#f2d22a", fg = "#1a1a1a") => tex.text("t4" + key, 160, 80, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 160, 80); g.fillStyle = fg; g.font = "900 46px Arial"; g.textAlign = "center"; g.fillText(txt, 80, 58); });

// ---- 14:03 · LA BALANZA: a la izquierda la pila del súper ($45), a la derecha lo que usaba mamá ($8-10); el platillo caro se hunde ----
export const HBalance: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#18130e" lamp={[0, 0.7, 0.3]}
  cam={{ at: [0, 0.25, 0], az: [-0.1, 0.12], el: [0.12, 0.1], r: [1.05, 0.92], fov: 30 }}>{(tt) => {
  const L = Array.from({ length: 8 }, (_, i) => phys(tt, 0.4 + i * 0.18, 9, 0.5)), R = Array.from({ length: 4 }, (_, i) => phys(tt, 2.0 + i * 0.3, 9, 0.5));
  const tilt = lerp(0, 0.2, phys(tt, 2.0, 4, 0.55)) * 1;
  const arm = 0.32, yl = 0.45 - Math.sin(tilt) * arm, yr = 0.45 + Math.sin(tilt) * arm;
  const pan = (x: number, y: number, children: React.ReactNode) => <group position={[x, y, 0]}>
    {[0, 1, 2].map((i) => { const a = i * PI * 2 / 3; return <mesh key={i} position={[Math.cos(a) * 0.06, -0.08, Math.sin(a) * 0.06]} rotation={[Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35]}><cylinderGeometry args={[0.0015, 0.0015, 0.18, 4]} />{M.brass()}</mesh>; })}
    <mesh position={[0, -0.17, 0]}><cylinderGeometry args={[0.15, 0.12, 0.018, 40]} />{M.brass()}</mesh>
    <group position={[0, -0.16, 0]}>{children}</group>
  </group>;
  return <>
    {/* el pie y el brazo de la balanza de bronce */}
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.12, 0.14, 0.04, 40]} />{M.brass()}</mesh>
    <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.012, 0.016, 0.42, 16]} />{M.brass()}</mesh>
    <group position={[0, 0.45, 0]} rotation={[0, 0, -tilt]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.008, 0.008, arm * 2 + 0.04, 14]} />{M.brass()}</mesh>
      <mesh position={[0, 0.03, 0]}><coneGeometry args={[0.012, 0.06, 12]} />{M.brass()}</mesh>
    </group>
    {pan(-arm, yl, <>
      {L.map((k, i) => { const x = ((i % 3) - 1) * 0.06, z = (Math.floor(i / 3) % 2 - 0.5) * 0.06, y = Math.floor(i / 6) * 0.08 + 0.3 * (1 - k);
        return <group key={i} position={[x, y, z]} scale={Math.max(0.001, cl(k * 2))}>
          {i % 3 === 0 ? <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.025, 0.025, 0.07, 20]} /><meshStandardMaterial color={["#c8281e", "#e6b030", "#3a7a3a"][i % 3 + Math.floor(i / 3) % 2]} metalness={0.3} roughness={0.4} /></mesh>
            : <RBox s={[0.05, 0.075, 0.035]} p={[0, 0.038, 0]} r={0.004}><meshStandardMaterial color={["#2a5a9a", "#f2f2ee", "#e8d020", "#8a5a2a", "#c8a040"][i % 5]} roughness={0.7} /></RBox>}
        </group>; })}
    </>)}
    {pan(arm, yr, <>
      {/* bolsa de harina, frasco de azúcar, botella de leche, jarrita de vinagre */}
      <group position={[-0.05, 0.3 * (1 - R[0]), 0]} scale={Math.max(0.001, cl(R[0] * 2))}><mesh position={[0, 0.04, 0]} scale={[1, 1.1, 0.8]}><sphereGeometry args={[0.04, 20, 14]} /><meshStandardMaterial color="#ece2cc" roughness={0.95} /></mesh></group>
      <group position={[0.04, 0.3 * (1 - R[1]), -0.03]} scale={Math.max(0.001, cl(R[1] * 2)) * 0.5}><Jar fill={0.8} liq="#f1ede4" /></group>
      <group position={[0.05, 0.3 * (1 - R[2]), 0.05]} scale={Math.max(0.001, cl(R[2] * 2))}><mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.018, 0.022, 0.09, 20]} /><meshPhysicalMaterial color="#f4f2ec" roughness={0.2} transparent opacity={0.92} /></mesh></group>
      <group position={[-0.06, 0.3 * (1 - R[3]), 0.06]} scale={Math.max(0.001, cl(R[3] * 2)) * 0.3}><Jug fill={0.8} /></group>
    </>)}
    {/* las dos etiquetas colgadas de los platillos */}
    <mesh position={[-arm, yl - 0.24, 0.13]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={tag("45", "$45")} roughness={0.6} /></mesh>
    <mesh position={[arm, yr - 0.24, 0.13]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={tag("810", "$8-10", "#2f6a3a", "#f4efe2")} roughness={0.6} /></mesh>
  </>;
}}</Scene3D>;

// ---- 14:24 · DOS VECES POR MES: el almanaque de doce meses; en cada mes caen dos pilitas de monedas ($30 cada una) y el contador llega a 700 ----
export const HYearcoins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#17120d" lamp={[0, 0.6, 0.2]}
  cam={{ at: [0, 0.02, 0.1], az: [0.15, -0.1], el: [0.95, 0.85], r: [1.02, 0.9], fov: 30 }}>{(tt) => {
  const k = eio(tt, 0.4, 4.6), n = Math.min(24, Math.floor(k * 24.5)), total = Math.min(720, n * 30);
  const mon = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return <>
    {/* las doce casillas del almanaque */}
    <RBox s={[0.8, 0.008, 0.5]} p={[0, 0.004, 0]} r={0.004}>{M.wood({ base: [86, 56, 32] })}</RBox>
    {mon.map((m, i) => { const x = ((i % 4) - 1.5) * 0.19, z = (Math.floor(i / 4) - 1) * 0.15;
      return <group key={i} position={[x, 0.009, z]}>
        <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.18, 0.14]} /><meshStandardMaterial map={tex.text("mon" + i, 128, 100, (g) => { g.fillStyle = "#4a3220"; g.fillRect(0, 0, 128, 100); g.strokeStyle = "#d8b060"; g.lineWidth = 3; g.strokeRect(2, 2, 124, 96); g.fillStyle = "#f0d9a0"; g.font = "700 26px Georgia"; g.fillText(m, 8, 28); })} roughness={0.9} /></mesh>
        {[0, 1].map((j) => { const idx = i * 2 + j, land = phys(tt, 0.4 + (idx / 24) * 4.2, 10, 0.5);
          return <group key={j} position={[-0.025 + j * 0.05, 0.25 * (1 - land), 0.01]} visible={idx < n + 1 && land > 0.01}>
            {Array.from({ length: 5 }, (_, c) => <group key={c} position={[0, 0.003 + c * 0.0035, 0]}><Coin r={0.016} col={c % 2 ? "#d4a640" : "#e8bf58"} /></group>)}
          </group>; })}
      </group>; })}
    {/* el contador del año */}
    <group position={[0, 0.07, 0.33]} rotation={[-0.75, 0, 0]} scale={1.7}>
      <RBox s={[0.17, 0.08, 0.05]} p={[0, 0, -0.012]} r={0.01}>{M.wood({ base: [110, 74, 42] })}</RBox>
      <DigitDrum v={Math.floor(total / 100)} p={[-0.042, 0, 0.018]} r={0.026} w={0.036} />
      <DigitDrum v={Math.floor(total / 10) % 10} p={[0, 0, 0.018]} r={0.026} w={0.036} />
      <DigitDrum v={total % 10} p={[0.042, 0, 0.018]} r={0.026} w={0.036} />
    </group>
  </>;
}}</Scene3D>;

// ---- 15:07 · LA CASA HUELE A CALDO: la casita de la granja en corte; de la olla sube el vapor que recorre los cuartos y sale por la chimenea ----
export const HHousesmell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#1e2430" key1={[-1.0, 1.6, 1.4]}
  cam={{ at: [0, 0.22, 0], az: [-0.35, 0.05], el: [0.2, 0.16], r: [1.15, 1.0], fov: 30 }}>{(tt) => {
  const spread = eio(tt, 0.5, 4.6);
  const path = [[-0.22, 0.12], [-0.12, 0.2], [0.05, 0.16], [0.2, 0.2], [0.16, 0.38], [-0.05, 0.36], [-0.18, 0.42], [0.12, 0.6]];
  const at = (u: number) => { const f = u * (path.length - 1), i = Math.min(path.length - 2, Math.floor(f)), r = f - i; return [lerp(path[i][0], path[i + 1][0], r), lerp(path[i][1], path[i + 1][1], r)]; };
  return <>
    {/* el pasto */}
    <mesh position={[0, -0.005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.9, 40]} /><meshStandardMaterial color="#3e5a2a" roughness={1} /></mesh>
    {/* la casa en corte: piso, entrepiso, paredes, techo a dos aguas y chimenea */}
    <RBox s={[0.6, 0.02, 0.3]} p={[0, 0.01, 0]} r={0.003}>{M.wood({ base: [150, 106, 66] })}</RBox>
    <RBox s={[0.6, 0.015, 0.3]} p={[0, 0.27, 0]} r={0.003}>{M.wood({ base: [150, 106, 66] })}</RBox>
    <RBox s={[0.6, 0.5, 0.012]} p={[0, 0.25, -0.15]} r={0.003}><meshStandardMaterial color="#efe4cc" roughness={0.9} /></RBox>
    {[-0.3, 0.3].map((x) => <RBox key={x} s={[0.012, 0.5, 0.3]} p={[x, 0.25, 0]} r={0.003}><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></RBox>)}
    <RBox s={[0.012, 0.25, 0.3]} p={[0.05, 0.14, 0]} r={0.003}><meshStandardMaterial color="#e8dcc0" roughness={0.9} /></RBox>
    {[-1, 1].map((sd) => <RBox key={sd} s={[0.38, 0.015, 0.36]} p={[sd * 0.16, 0.6, 0]} rot={[0, 0, -sd * 0.6]} r={0.004}><meshStandardMaterial color="#7a2e22" roughness={0.8} /></RBox>)}
    <RBox s={[0.05, 0.16, 0.05]} p={[0.12, 0.68, -0.05]} r={0.004}><meshStandardMaterial color="#8a4a34" roughness={0.9} /></RBox>
    {/* la cocina de hierro con la olla abajo a la izquierda */}
    <RBox s={[0.12, 0.08, 0.1]} p={[-0.22, 0.06, -0.05]} r={0.006}><meshStandardMaterial color="#1e1d1c" metalness={0.5} roughness={0.5} /></RBox>
    <mesh position={[-0.22, 0.125, -0.05]}><cylinderGeometry args={[0.035, 0.032, 0.05, 24]} />{M.steel()}</mesh>
    {/* camitas y mesa para que se lean los cuartos */}
    <RBox s={[0.12, 0.03, 0.09]} p={[0.18, 0.3, -0.05]} r={0.006}><meshStandardMaterial color="#d8c8a8" roughness={1} /></RBox>
    <RBox s={[0.12, 0.03, 0.09]} p={[-0.16, 0.3, -0.05]} r={0.006}><meshStandardMaterial color="#9a4a3a" roughness={1} /></RBox>
    <RBox s={[0.12, 0.05, 0.08]} p={[0.18, 0.045, -0.02]} r={0.006}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {/* la estela de vapor tibio que recorre la casa */}
    {Array.from({ length: 26 }, (_, i) => { const u = i / 26; if (u > spread) return null; const [x, y] = at(u), w = Math.sin(tt * 2 + i) * 0.01;
      return <mesh key={i} position={[x + w, y + w, 0.02]}><sphereGeometry args={[0.022 + 0.01 * rn(i, 2), 12, 8]} /><meshBasicMaterial color="#f2d8a8" transparent opacity={0.22 * (1 - Math.max(0, u - spread + 0.3) / 0.3)} depthWrite={false} /></mesh>; })}
    {/* ventanas con luz de tarde */}
    {[[-0.15, 0.13], [0.18, 0.4]].map(([x, y], i) => <mesh key={"w" + i} position={[x, y, -0.143]}><planeGeometry args={[0.08, 0.07]} /><meshStandardMaterial color="#3a2a18" emissive="#f0b860" emissiveIntensity={0.5} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 15:48 · LA TARDE DE DESPENSA: lo que va primero: la olla del caldo, después la bandeja de pan, la vasija de mezcla, la sal, el aderezo y el almíbar; el sol cruza la ventana ----
export const HAfternoon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" bg="#1c1611" key1={[-0.6, 1.5, 1.2]} lamp={[0, 0.6, 0.3]}
  cam={{ at: [0, 0.12, 0], az: [-0.2, 0.15], el: [0.4, 0.35], r: [1.0, 0.88], fov: 30 }}>{(tt) => {
  const it = Array.from({ length: 6 }, (_, i) => phys(tt, 0.4 + i * 0.7, 8, 0.5)), sun = eio(tt, 0.3, 5.2);
  const place = [[-0.32, -0.02], [-0.12, 0.06], [0.06, 0.04], [0.2, 0.1], [0.3, -0.04], [0.12, -0.1]];
  const num = (i: number) => tex.text("num" + i, 64, 64, (g) => { g.fillStyle = "#2a3a2a"; g.beginPath(); g.arc(32, 32, 30, 0, 6.3); g.fill(); g.fillStyle = "#f4efe2"; g.font = "700 40px Georgia"; g.textAlign = "center"; g.fillText(String(i + 1), 32, 46); });
  return <>
    <RBox s={[0.95, 0.03, 0.42]} p={[0, 0.015, 0]} r={0.008}>{M.wood({ base: [170, 128, 84], rx: 2 })}</RBox>
    {/* la ventana del fondo: el sol baja de izquierda a derecha */}
    <group position={[0, 0.42, -0.25]}>
      <RBox s={[0.5, 0.3, 0.02]} p={[0, 0, 0]} r={0.004}><meshStandardMaterial color="#efe6d4" roughness={0.6} /></RBox>
      <mesh position={[0, 0, 0.011]}><planeGeometry args={[0.46, 0.26]} /><meshBasicMaterial color={`rgb(${Math.round(lerp(150, 214, sun))},${Math.round(lerp(190, 150, sun))},${Math.round(lerp(220, 110, sun))})`} /></mesh>
      <mesh position={[lerp(-0.18, 0.18, sun), lerp(0.08, -0.08, sun), 0.012]}><circleGeometry args={[0.025, 24]} />{M.glow({ col: "#ffd890", op: 0.9 })}</mesh>
      <mesh position={[0, 0, 0.013]}><boxGeometry args={[0.012, 0.26, 0.004]} /><meshStandardMaterial color="#efe6d4" /></mesh>
    </group>
    {it.map((k, i) => { const [x, z] = place[i]; return <group key={i} position={[x, 0.03 + 0.3 * (1 - k), z]} scale={Math.max(0.001, cl(k * 2))}>
      {i === 0 && <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.09, 0.085, 0.12, 36]} />{M.steel()}</mesh>
        {Array.from({ length: 3 }, (_, s) => { const u = (tt * 0.5 + s / 3) % 1; return <mesh key={s} position={[0, 0.14 + u * 0.15, 0]}><sphereGeometry args={[0.03 + 0.03 * u, 10, 8]} /><meshBasicMaterial color="#e2ddd2" transparent opacity={0.1 * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}</group>}
      {i === 1 && <group><RBox s={[0.16, 0.01, 0.11]} p={[0, 0.005, 0]} r={0.003}>{M.steel({ col: "#a8a6a2" })}</RBox>
        {Array.from({ length: 10 }, (_, b) => <RBox key={b} s={[0.025, 0.018, 0.025]} p={[((b % 5) - 2) * 0.03, 0.018, (Math.floor(b / 5) - 0.5) * 0.04]} rot={[0, rn(b, 2), 0]} r={0.004}><meshStandardMaterial color="#d8b47a" roughness={1} /></RBox>)}</group>}
      {i === 2 && <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.055, 0.06, 0.12, 30]} /><meshStandardMaterial color="#d8cdb4" roughness={0.5} /></mesh><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0605, 0.0605, 0.02, 30]} /><meshStandardMaterial color="#2a4a7a" roughness={0.5} /></mesh></group>}
      {i === 3 && <group scale={0.5}><Jar fill={0.7} liq="#c9a27a" /></group>}
      {i === 4 && <group scale={0.5}><Jar fill={0.75} liq="#e2c04a" /></group>}
      {i === 5 && <group scale={0.5}><Jar fill={0.7} liq="#a0521a" /></group>}
      {/* la ficha con el orden */}
      <mesh position={[0, 0.002, 0.09]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02, 24]} /><meshStandardMaterial map={num(i)} roughness={0.7} /></mesh>
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 16:41 · NADA EN CAJA: el estante de mamá sólo con frascos; las cajas de mezcla y los sobres llegan, chocan con el borde y se caen ----
export const HNeverbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" bg="#1b1510" key1={[-0.7, 1.4, 1.4]}
  cam={{ at: [0.1, 0.16, 0], az: [0.15, -0.05], el: [0.12, 0.1], r: [1.12, 1.0], fov: 30 }}>{(tt) => {
  const boxes = [0, 1, 2].map((i) => cl((tt - 0.5 - i * 2.0) / 1.6));
  const bcol = ["#d8282a", "#2a6ad8", "#f2b822"];
  return <>
    <RBox s={[0.9, 0.02, 0.2]} p={[0, 0.15, 0]} r={0.004}>{M.wood({ base: [176, 132, 84] })}</RBox>
    <RBox s={[0.9, 0.02, 0.2]} p={[0, 0.38, 0]} r={0.004}>{M.wood({ base: [176, 132, 84] })}</RBox>
    <RBox s={[1.2, 0.04, 0.4]} p={[0.05, -0.1, 0.06]} r={0.006}>{M.wood({ base: [120, 84, 52] })}</RBox>
    {/* los frascos de mamá */}
    {[-0.3, -0.18, -0.06, 0.06, 0.18].map((x, i) => <group key={i} position={[x, 0.16, 0]} scale={0.7}><Jar fill={0.8} liq={["#ece6d8", "#d8b47a", "#a0521a", "#e2c04a", "#c9d6b4"][i]} /></group>)}
    {[-0.28, -0.12, 0.04, 0.2].map((x, i) => <group key={"u" + i} position={[x, 0.39, 0]} scale={0.6}><Jar fill={0.75} liq={["#b84a2a", "#7a9a3a", "#e8d8a8", "#5a3a22"][i]} /></group>)}
    {/* las cajas que intentan entrar: llegan por la derecha, chocan, se inclinan y caen */}
    {boxes.map((k, i) => { if (k <= 0) return null; const hit = cl((k - 0.45) / 0.55), x = lerp(0.62, 0.36, cl(k / 0.45)) + hit * (0.1 + i * 0.05), y = Math.max(-0.04 + i * 0.012, 0.16 + 0.07 + (i === 2 ? 0.23 : 0) - hit * hit * 0.6), rot = -hit * PI / 2;
      return <group key={i} position={[x, y, 0.02 + i * 0.01]} rotation={[0, -0.2, rot]}>
        {i < 2 ? <mesh><boxGeometry args={[0.09, 0.13, 0.04]} /><meshStandardMaterial map={tex.text("mixbox" + i, 128, 160, (g) => { g.fillStyle = bcol[i]; g.fillRect(0, 0, 128, 160); g.fillStyle = "#fff4d0"; g.beginPath(); g.arc(64, 72, 34, 0, 6.3); g.fill(); g.fillStyle = "#1a1a1a"; g.font = "900 22px Arial"; g.textAlign = "center"; g.fillText("MIX", 64, 80); })} roughness={0.6} /></mesh>
          : <mesh><boxGeometry args={[0.08, 0.1, 0.006]} /><meshStandardMaterial color={bcol[i]} metalness={0.5} roughness={0.3} /></mesh>}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 16:57 · LAS DOCE DE SIEMPRE: harina, azúcar, sal, polvo, bicarbonato, grasa, melaza, vinagre, avena, maíz, porotos y conservas; aparecen en orden y el tambor cuenta hasta 12 ----
export const HTwelve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="wood" bg="#1b1510" key1={[-0.6, 1.5, 1.4]}
  cam={{ at: [0, 0.28, 0], az: [-0.1, 0.1], el: [0.06, 0.06], r: [1.1, 0.98], fov: 30 }}>{(tt) => {
  const k = Array.from({ length: 12 }, (_, i) => phys(tt, 0.3 + i * 0.36, 9, 0.5)), n = k.filter((v) => v > 0.5).length;
  const liq = ["#ece6d8", "#f1ede4", "#f4f4f2", "#e8e2d4", "#f0f0ee", "#f2ead8", "#3a1a08", "#efe4b8", "#c8a87a", "#e8c84a", "#7a3a2a", "#b84a2a"];
  return <>
    {[0.05, 0.3].map((y) => <RBox key={y} s={[0.98, 0.02, 0.2]} p={[0, y, 0]} r={0.004}>{M.wood({ base: [170, 126, 80] })}</RBox>)}
    {k.map((v, i) => { const row = i < 6 ? 1 : 0, x = ((i % 6) - 2.5) * 0.15, y = (row ? 0.31 : 0.06) + 0.2 * (1 - v);
      return <group key={i} position={[x, y, 0]} scale={Math.max(0.001, cl(v * 1.6))}>
        {i === 0 ? <mesh position={[0, 0.06, 0]} scale={[1, 1.2, 0.8]}><sphereGeometry args={[0.05, 20, 14]} /><meshStandardMaterial color="#ece2cc" roughness={0.95} /></mesh>
          : i === 2 ? <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.035, 0.035, 0.1, 24]} /><meshStandardMaterial color="#2f5f9e" roughness={0.5} /></mesh>
          : i === 4 ? <group scale={1.1}><SodaBox /></group>
          : i === 6 || i === 7 ? <group scale={0.48}><Jug fill={0.85} liq={liq[i]} /></group>
          : i === 9 ? <mesh position={[0, 0.055, 0]} scale={[1, 1.15, 0.8]}><sphereGeometry args={[0.045, 18, 12]} /><meshStandardMaterial color="#d8c48a" roughness={0.95} /></mesh>
          : <group scale={0.75}><Jar fill={0.8} liq={liq[i]} /></group>}
      </group>; })}
    {/* el contador */}
    <group position={[0, 0.56, 0.04]} scale={2}>
      <RBox s={[0.12, 0.08, 0.05]} p={[0, 0, -0.012]} r={0.01}>{M.wood({ base: [110, 74, 42] })}</RBox>
      <DigitDrum v={Math.floor(n / 10)} p={[-0.022, 0, 0.018]} r={0.025} w={0.03} />
      <DigitDrum v={n % 10} p={[0.022, 0, 0.018]} r={0.025} w={0.03} />
    </group>
  </>;
}}</Scene3D>;

// ---- 17:41 · EL HUEVO FRESCO NO SE PELA: dos huevos duros; al fresco la cáscara se lleva pedazos de clara, al de una semana se le sale entera y queda liso ----
export const HEggpeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" bg="#1a1612" lamp={[0, 0.4, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [-0.12, 0.12], el: [0.3, 0.26], r: [0.55, 0.48], fov: 30 }}>{(tt) => {
  const peel = eio(tt, 0.8, 4.0);
  const egg = (x: number, fresh: boolean) => <group position={[x, 0.045, 0]}>
    {/* la clara: lisa o con cráteres */}
    <mesh scale={[1, 1.3, 1]}><sphereGeometry args={[0.034, 32, 24]} /><meshPhysicalMaterial color="#f4f1e8" roughness={fresh ? 0.6 : 0.25} clearcoat={fresh ? 0 : 0.6} /></mesh>
    {fresh && Array.from({ length: 9 }, (_, i) => { const a = i * 2.4, b = (rn(i, 2) - 0.5) * 2; return <mesh key={i} visible={peel > i / 10} position={[Math.cos(a) * 0.031, b * 0.035, Math.sin(a) * 0.031]} scale={[1, 1, 0.4]} rotation={[0, -a, 0]}><sphereGeometry args={[0.008 + 0.004 * rn(i, 3), 10, 8]} /><meshStandardMaterial color="#c9c2b2" roughness={1} /></mesh>; })}
    {/* los pedazos de cáscara que salen volando */}
    {Array.from({ length: 10 }, (_, i) => { const a = i * 2.4, b = (rn(i, 4) - 0.5) * 2, go = cl(peel * 1.4 - i / 14), dx = Math.cos(a) * (0.034 + go * 0.08), dz = Math.sin(a) * (0.034 + go * 0.08);
      return <mesh key={"c" + i} position={[dx, b * 0.04 * 1.3 - go * go * 0.04, dz]} rotation={[go * 3, -a, go * 2]}><sphereGeometry args={[fresh ? 0.012 : 0.02, 8, 6, 0, 1.2, 0, 1.0]} /><meshStandardMaterial color="#c98d5a" roughness={0.6} side={THREE.DoubleSide} /></mesh>; })}
    {/* lo que la cáscara del fresco arrancó: pedacitos de clara pegados */}
    {fresh && Array.from({ length: 5 }, (_, i) => { const go = cl(peel * 1.4 - i / 8), a = i * 1.7; return <mesh key={"w" + i} visible={go > 0.2} position={[Math.cos(a) * (0.04 + go * 0.07), 0.0 - go * 0.03, Math.sin(a) * (0.04 + go * 0.07)]}><sphereGeometry args={[0.006, 8, 6]} /><meshStandardMaterial color="#f4f1e8" roughness={0.6} /></mesh>; })}
  </group>;
  return <>
    {egg(-0.12, true)}{egg(0.12, false)}
    {/* huevos crudos de muestra: hoy y hace una semana */}
    <group position={[-0.12, 0.0, -0.13]}><group position={[0, 0.03, 0]}><Egg s={0.9} /></group></group>
    <group position={[0.12, 0.0, -0.13]}><group position={[0, 0.03, 0]}><Egg s={0.9} col="#d4a070" /></group></group>
    {[-0.12, 0.12].map((x, i) => <mesh key={i} position={[x, 0.002, 0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.1, 0.04]} /><meshStandardMaterial map={tex.text("egglbl" + i, 160, 64, (g) => { g.fillStyle = "#efe2b8"; g.fillRect(0, 0, 160, 64); g.fillStyle = "#2a2622"; g.font = "700 30px Georgia"; g.textAlign = "center"; g.fillText(i ? "1 WEEK" : "TODAY", 80, 44); })} roughness={0.9} /></mesh>)}
  </>;
}}</Scene3D>;
