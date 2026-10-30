// lch29e · componentes únicos 22-27 (el ruedo de cocina pegajoso, la cinta con lápiz, cambiar de lado para que destiñan parejo, la funda atada con piolín, la toalla enrollada como pionono, el encaje que vuelve a su forma).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Curtain, Rod, Window, cottonTex, laceTex } from "./curtain";
import { Hand } from "./sofa";

const PI = Math.PI;

const gingham = () => tex.text("ging", 128, 128, (g) => { g.fillStyle = "#fbf6e4"; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(232,188,40,0.55)"; for (let i = 0; i < 128; i += 32) { g.fillRect(i, 0, 16, 128); g.fillRect(0, i, 128, 16); } });

// ---- 14:35 · EL RUEDO PEGAJOSO: el dedo corre por el dobladillo de la cortina de cocina; la tela se le pega y se estira con un hilo brillante de grasa ----
export const HTackyHem: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#15110d" key1={[-0.6, 1.3, 1.2]}
  cam={{ at: [0, 0.02, 0.02], az: [0.25, 0.15], el: [0.12, 0.18], r: [0.78, 0.66], fov: 30 }}>{(tt) => {
  const run = eio(tt, 0.6, 3.6), x = lerp(-0.2, 0.2, run), lift = Math.max(0, Math.sin(tt * 3.2)) * cl(tt - 0.6);
  return <>
    {/* el ruedo de guinga amarilla, colgando del tope del cuadro */}
    <group position={[0, 0.32, 0]}><Curtain w={0.62} h={0.36} folds={4} amp={0.012} map={gingham()} /></group>
    {/* la franja del ruedo: más oscura y brillante (grasa) */}
    <mesh position={[0, -0.02, 0.012]}><planeGeometry args={[0.62, 0.05]} /><meshPhysicalMaterial color="#c9a85a" roughness={0.25} clearcoat={1} transparent opacity={0.45} /></mesh>
    {/* el dedo que pasa y despega la tela */}
    <group position={[x, -0.15, 0.05 + 0.03 * lift]} rotation={[-PI / 2 + 0.25, 0, 0]}><Hand grip={0.35} /></group>
    {/* el hilo de grasa entre la yema y la tela */}
    {lift > 0.15 && <mesh position={[x - 0.04, -0.03, 0.02 + 0.015 * lift]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.0012, 0.0025, 0.01 + 0.04 * lift, 8]} /><meshPhysicalMaterial color="#e8c870" roughness={0.1} clearcoat={1} transparent opacity={0.85} /></mesh>}
    {/* la tela que sigue al dedo: un pico que se estira */}
    <mesh position={[x - 0.04, -0.045, 0.012 + 0.02 * lift]} rotation={[0.3, 0, 0]} scale={[1, 1, 1 + lift]}><coneGeometry args={[0.02, 0.03, 12]} /><meshStandardMaterial map={gingham()} roughness={0.9} /></mesh>
  </>;
}}</Scene3D>;

const tapeTex = (i: number, k: number) => tex.text("tape" + i + "_" + Math.round(k * 8), 160, 48, (g) => { g.fillStyle = "#efe3b8"; g.fillRect(0, 0, 160, 48); g.fillStyle = "#3a3a3a"; g.font = "28px 'Segoe Print', 'Comic Sans MS', cursive";
  const s = ["KITCHEN 1", "KITCHEN 2", "FRONT 1", "FRONT 2", "FRONT 3", "BED 1", "BED 2", "BATH 1"][i]; g.fillText(s.slice(0, Math.ceil(s.length * k)), 8, 34); });
// ---- 16:22 · CINTA DE PAPEL Y LÁPIZ: cada cortina se dobla y se le pega un pedacito de cinta; el lápiz escribe el cuarto y el número de ventana; ocho cortinas en fila, cada una con la suya ----
export const HTapeLabels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15110d" key1={[-0.6, 1.4, 1.1]}
  cam={{ at: [0.0, 0.0, 0], az: [0.3, 0.12], el: [0.75, 0.82], r: [0.95, 0.7], fov: 32 }}>{(tt) => {
  const C = ["#f2ead6", "#f2ead6", "#cfe0ea", "#cfe0ea", "#cfe0ea", "#ead3d6", "#ead3d6", "#f0f0ea"];
  return <>
    {/* la colcha de la cama */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.01, 0]}><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial map={cottonTex("#e9e1cf")} roughness={1} /></mesh>
    {C.map((c, i) => { const land = phys(tt, 0.2 + i * 0.32, 8, 0.4), wr = cl((tt - 0.5 - i * 0.32) / 0.55), x = -0.56 + (i % 4) * 0.37, z = i < 4 ? -0.2 : 0.2;
      return land > 0.001 && <group key={i} position={[x, 0.02 + 0.3 * (1 - land), z]}>
        <RBox s={[0.3, 0.035, 0.3]} r={0.012}><meshStandardMaterial map={cottonTex(c)} roughness={1} /></RBox>
        {[0.25, 0.5, 0.75].map((f, j) => <mesh key={j} position={[-0.15 + 0.3 * f, 0.0185, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.002, 0.29]} /><meshBasicMaterial color="#b9b2a2" /></mesh>)}
        {wr > 0 && <mesh position={[0, 0.019, 0.1]} rotation={[-PI / 2, 0, 0.04 * (i % 3 - 1)]}><planeGeometry args={[0.2, 0.06]} /><meshStandardMaterial map={tapeTex(i, wr)} roughness={0.8} /></mesh>}
      </group>; })}
    {/* el lápiz que salta de cinta en cinta */}
    {(() => { const i = Math.min(7, Math.max(0, Math.floor((tt - 0.5) / 0.32))), wr = cl((tt - 0.5 - i * 0.32) / 0.55), x = -0.56 + (i % 4) * 0.37 - 0.08 + 0.16 * wr, z = (i < 4 ? -0.2 : 0.2) + 0.1;
      return tt > 0.4 && <group position={[x, 0.06 + 0.015 * Math.abs(Math.sin(tt * 20)), z]} rotation={[0.9, 0.3, 0.2]}>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.007, 0.007, 0.13, 6]} /><meshStandardMaterial color="#e8b82a" roughness={0.5} /></mesh>
        <mesh position={[0, 0.0, 0]}><coneGeometry args={[0.007, 0.02, 6]} /><meshStandardMaterial color="#e2c79a" /></mesh>
        <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.0075, 0.0075, 0.015, 8]} /><meshStandardMaterial color="#d97a8a" /></mesh></group>; })()}
  </>;
}}</Scene3D>;

// ---- 17:32 · CAMBIARLAS DE LADO: dos paños azules en la ventana, el de la izquierda comido por el sol; se cruzan en el barral y al año los dos quedan del mismo azul ----
export const HFadeSwap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" bg="#15110d" key1={[-0.8, 1.3, 1.3]}
  cam={{ at: [0, 1.0, 0.1], az: [0.15, -0.05], el: [0.06, 0.1], r: [1.5, 1.32], fov: 34 }}>{(tt) => {
  const sw = eio(tt, 1.0, 2.6), even = eio(tt, 3.0, 5.2);
  const a = new THREE.Color("#8fb0cc").lerp(new THREE.Color("#4f7fae"), even * 0.5), b = new THREE.Color("#2f5f9a").lerp(new THREE.Color("#4f7fae"), even);
  return <>
    <group position={[0, 1.05, -0.06]}><Window w={0.9} h={1.05} sky="#f6e3b2" /></group>
    {/* el sol que entra en diagonal desde la izquierda */}
    <mesh position={[-0.7, 1.05, -0.02]}><planeGeometry args={[0.3, 1.0]} />{M.glow({ col: "#ffe2a0", op: 0.18 * (1 - even) })}</mesh>
    <group position={[0, 1.62, 0.1]}><Rod len={1.25} />
      {/* el gastado viaja de izquierda a derecha por arriba; el sano al revés por abajo */}
      <group position={[lerp(-0.32, 0.32, sw), 0.06 * Math.sin(sw * PI), 0.08 * Math.sin(sw * PI)]}><Curtain w={0.48} h={1.25} folds={4} amp={0.03} col={"#" + a.getHexString()} /></group>
      <group position={[lerp(0.32, -0.32, sw), 0, -0.06 * Math.sin(sw * PI)]}><Curtain w={0.48} h={1.25} folds={4} amp={0.03} col={"#" + b.getHexString()} /></group>
    </group>
    {/* el calendario de la pared pasa sus hojas mientras se emparejan */}
    <group position={[0.85, 1.2, -0.02]}>
      <RBox s={[0.2, 0.26, 0.01]} r={0.004}><meshStandardMaterial map={tex.paper()} /></RBox>
      {Array.from({ length: 4 }, (_, i) => { const f = cl(even * 4 - i); return f > 0 && f < 1 && <mesh key={i} position={[0, 0.13, 0.008]} rotation={[-f * PI, 0, 0]}><planeGeometry args={[0.19, 0.24]} /><meshStandardMaterial color="#f4efe2" side={2} /></mesh>; })}
      <mesh position={[0, 0.08, 0.008]}><planeGeometry args={[0.19, 0.05]} /><meshBasicMaterial color="#b23a2a" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 19:10 · LA FUNDA COMO BOLSITA: el encaje entra en una funda de algodón vieja y la boca se cierra con piolín de cocina, vuelta y moño ----
export const HPillowString: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="none" bg="#15110d" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0.05, 0.05, 0.02], az: [0.25, 0.18], el: [0.62, 0.7], r: [0.85, 0.72], fov: 32 }}>{(tt) => {
  const inside = eio(tt, 0.3, 1.8), tie = eio(tt, 2.0, 3.6), bow = eio(tt, 3.6, 4.4);
  const neck = lerp(0.16, 0.035, tie);
  return <>
    {/* la funda de almohada: rectángulo blando con su costura */}
    <RBox s={[0.5, 0.05 + 0.04 * inside, 0.34]} p={[-0.12, 0.03 + 0.02 * inside, 0]} r={0.025}><meshStandardMaterial map={cottonTex("#f6f3ec")} roughness={1} /></RBox>
    <mesh position={[-0.12, 0.056 + 0.04 * inside, 0.0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.48, 0.003]} /><meshBasicMaterial color="#cfc6b4" /></mesh>
    {/* la boca que se frunce hacia el cuello */}
    <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, PI / 2]} scale={[1, 1, 0.55]}><cylinderGeometry args={[neck, 0.17, 0.16, 30, 1, true]} /><meshStandardMaterial map={cottonTex("#f6f3ec")} roughness={1} side={2} /></mesh>
    {/* el encaje color té que entra y deja la puntilla asomando */}
    <group position={[lerp(0.6, 0.31, inside), 0.045, 0]} rotation={[-PI / 2, 0, 0]}><mesh><planeGeometry args={[0.3 - 0.22 * inside, 0.2]} /><meshStandardMaterial map={laceTex()} color="#d8c49a" transparent alphaTest={0.25} side={2} /></mesh></group>
    {/* el piolín: tres vueltas gruesas alrededor del cuello */}
    {Array.from({ length: 3 }, (_, i) => { const k = cl(tie * 3 - i); return k > 0.05 && <mesh key={i} position={[0.27 + i * 0.014, 0.04, 0]} rotation={[0, PI / 2, 0]} scale={[0.55, 1, 1]}><torusGeometry args={[neck + 0.006, 0.0055, 8, 40, PI * 2 * k]} /><meshStandardMaterial color="#b89a62" roughness={0.9} /></mesh>; })}
    {/* el moño arriba del nudo */}
    {bow > 0.02 && [-1, 1].map((s) => <mesh key={s} position={[0.29, 0.04 + neck * 0.55 + 0.025, 0.03 * s]} rotation={[PI / 2, s * 0.5, 0]} scale={[bow, bow, bow]}><torusGeometry args={[0.028, 0.0055, 8, 24]} /><meshStandardMaterial color="#b89a62" roughness={0.9} /></mesh>)}
    {bow > 0.5 && [-1, 1].map((s) => <mesh key={"c" + s} position={[0.31, 0.06 + neck * 0.55, 0.05 * s]} rotation={[0, 0, 0.4 * s]}><cylinderGeometry args={[0.004, 0.004, 0.06, 6]} /><meshStandardMaterial color="#b89a62" /></mesh>)}
    {/* el carretel de piolín */}
    <group position={[0.38, 0.04, 0.22]}><mesh><cylinderGeometry args={[0.04, 0.04, 0.08, 24]} /><meshStandardMaterial color="#c9ad74" roughness={1} /></mesh>
      <mesh position={[0, 0.042, 0]}><cylinderGeometry args={[0.047, 0.047, 0.006, 24]} />{M.wood({ base: [150, 102, 60] })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 19:57 · ENROLLARLA COMO PIONONO: el encaje húmedo sobre una toalla blanca; la toalla se enrolla sola desde un borde, aprieta, y el agua sale por las puntas ----
export const HJellyRoll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15110d" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [0, 0.03, 0], az: [0.08, 0.04], el: [0.62, 0.68], r: [1.15, 1.0], fov: 32 }}>{(tt) => {
  const roll = eio(tt, 0.6, 3.8), squeeze = eio(tt, 3.8, 4.6), L = 0.7, rolled = L * roll;
  const rad = 0.012 + 0.05 * Math.sqrt(roll);
  return <>
    <mesh position={[0, -0.005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.4, 0.9]} />{M.wood({ base: [150, 110, 72] })}</mesh>
    {/* la parte de toalla que queda plana + el encaje encima */}
    {roll < 0.99 && <group position={[(-L / 2 + rolled + (L - rolled) / 2) - 0, 0.004, 0]}>
      <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[L - rolled, 0.4]} /><meshStandardMaterial color="#fbfaf6" roughness={1} /></mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[Math.max(0.001, (L - rolled) * 0.9), 0.3]} /><meshStandardMaterial map={laceTex()} color="#c9b48a" transparent alphaTest={0.25} side={2} /></mesh>
    </group>}
    {/* el rollo que avanza */}
    <group position={[-L / 2 + rolled, rad, 0]} rotation={[PI / 2, 0, 0]} scale={[1 - 0.12 * squeeze, 1, 1 - 0.12 * squeeze]}>
      <mesh><cylinderGeometry args={[rad, rad, 0.4, 36]} /><meshStandardMaterial color="#f7f5ef" roughness={1} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0, s * 0.201, 0]} rotation={[s > 0 ? -PI / 2 : PI / 2, 0, 0]}><ringGeometry args={[rad * 0.2, rad, 36]} /><meshStandardMaterial map={tex.text("spir", 128, 128, (g) => { g.fillStyle = "#f7f5ef"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#c9c4b8"; g.lineWidth = 2; g.beginPath(); for (let a = 0; a < PI * 10; a += 0.1) { const r = 4 + a * 1.9; g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); } g.stroke(); })} side={2} /></mesh>)}
    </group>
    {/* las manos que aprietan y el agua que sale por las puntas */}
    {[-1, 1].map((s) => <group key={s} position={[-L / 2 + rolled, rad + 0.04, s * 0.13]} rotation={[PI / 2 - 0.2, 0, PI]}><Hand grip={0.5 + 0.4 * squeeze} /></group>)}
    {squeeze > 0.05 && Array.from({ length: 12 }, (_, i) => { const s = i % 2 ? 1 : -1, ph = (tt * 1.6 + rn(i, 2)) % 1; return <mesh key={"d" + i} position={[-L / 2 + rolled + (rn(i, 3) - 0.5) * 0.04, rad * (1 - ph), s * (0.21 + 0.04 * ph)]}><sphereGeometry args={[0.006, 10, 8]} />{M.water({ col: "#dbe9f0", op: 0.9 * squeeze })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 20:13 · CADA ROSA Y CADA HOJA: el encaje arrugado sobre la sábana blanca; los dedos lo estiran y las rosas de crochet se abren una por una, planas y redondas ----
export const HLaceShape: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#15110d" key1={[-0.8, 1.0, 0.6]}
  cam={{ at: [0, 0.0, 0.02], az: [0.12, 0.06], el: [0.85, 0.95], r: [0.78, 0.64], fov: 30 }}>{(tt) => {
  const R = [[-0.18, -0.1], [0.0, -0.12], [0.18, -0.1], [-0.18, 0.1], [0.0, 0.12], [0.18, 0.1]];
  const cur = Math.min(5, Math.max(0, Math.floor((tt - 0.8) / 0.55)));
  return <>
    {/* sábana celeste pálida para que el encaje se lea */}
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.3, 0.9]} /><meshStandardMaterial map={cottonTex("#a9b9c4")} roughness={1} /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.62, 0.42]} /><meshStandardMaterial map={laceTex()} color="#d9c290" transparent alphaTest={0.25} side={2} roughness={0.9} /></mesh>
    {/* cada rosa de crochet en relieve: arrugada y chica, se abre plana y redonda, con su sombra */}
    {R.map(([x, z], j) => { const k = eio(tt, 0.8 + j * 0.55, 1.5 + j * 0.55), sc = 0.45 + 0.55 * k;
      return <group key={j} position={[x, 0.006, -z]} rotation={[0, j + (1 - k) * 1.5, 0]} scale={[sc, 1 + 0.8 * (1 - k), sc]}>
        <mesh position={[0, -0.003, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.06, 30]} /><meshBasicMaterial color="#000" transparent opacity={0.12} depthWrite={false} /></mesh>
        {[0.012, 0.024, 0.036].map((r, q) => <mesh key={q} position={[0, 0.006 - q * 0.0015 + (1 - k) * 0.01 * Math.sin(q * 3 + j), 0]} rotation={[PI / 2 + (1 - k) * 0.6 * Math.sin(q + j), 0, 0]}><torusGeometry args={[r, 0.0042, 8, 30]} /><meshStandardMaterial color="#e0c994" roughness={0.85} /></mesh>)}
        {Array.from({ length: 6 }, (_, q) => { const a = (q / 6) * PI * 2; return <mesh key={"p" + q} position={[Math.cos(a) * 0.05, 0.004 + (1 - k) * 0.012, Math.sin(a) * 0.05]} rotation={[-PI / 2 + (1 - k) * 0.8, 0, -a]} scale={[1, 0.42, 0.3]}><sphereGeometry args={[0.016, 14, 10]} /><meshStandardMaterial color="#e0c994" roughness={0.85} /></mesh>; })}
      </group>; })}
    {/* la rosa que se está abriendo brilla apenas */}
    {tt > 0.8 && <mesh position={[R[cur][0], 0.004, -R[cur][1]]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.085, 30]} />{M.glow({ col: "#fff1c6", op: 0.2 * Math.sin(cl((tt - 0.8 - cur * 0.55) / 0.8) * PI) })}</mesh>}
    {tt > 0.7 && [-1, 1].map((s) => <group key={s} position={[R[cur][0] + s * 0.17, 0.02, -R[cur][1]]} rotation={[0, s > 0 ? -PI / 2 : PI / 2, 0]}><Hand grip={0.6} /></group>)}
  </>;
}}</Scene3D>;
void rn; void Rod; void lerp;
