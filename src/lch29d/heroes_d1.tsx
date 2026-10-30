// lch29d · componentes únicos 1-7 (la mantita, la letra de la etiqueta, el aro del sillón de Carol, la rendija, el barro, la mezcla, el sofá rosa).
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Arm, Cushion, Hand, Spot, Steam, SteamIron, Towel, tagTex } from "./sofa";

const PI = Math.PI;


// manta tejida que ENVUELVE el brazo: el arco sobre el cilindro y lo que sobra cuelga; slide 0..1 la corre por encima hacia atrás (-x) hasta caer
const Drape: React.FC<{ slide: number; tt: number }> = ({ slide, tt }) => {
  const geo = React.useMemo(() => new THREE.PlaneGeometry(1, 1, 48, 12), []);
  const p = geo.attributes.position as THREE.BufferAttribute, R = 0.104, L = 0.62, D = 0.56, s0 = -slide * 0.55;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) + 0.5, v = p.getY(i); let s = (u - 0.5) * L + s0, x = 0, y = 0;
    const lim = R * PI / 2;
    if (Math.abs(s) <= lim) { const a = s / R; x = R * Math.sin(a); y = R * Math.cos(a); }
    else { const sg = Math.sign(s), rest = Math.abs(s) - lim; x = sg * (R + 0.004 * Math.sin(rest * 30)); y = -rest; }
    // al final del deslizamiento la manta se suelta y cae entera
    const fall = Math.max(0, slide - 0.75) * 4; y -= fall * fall * 0.4; x -= fall * 0.15;
    p.setXYZ(i, x, y, v * D + 0.006 * Math.sin(u * 40 + tt));
  }
  p.needsUpdate = true; geo.computeVertexNormals();
  return <mesh geometry={geo} position={[0, 0.006, 0]}><meshStandardMaterial map={knitTex()} roughness={1} side={2} /></mesh>;
};

const letTex = (L: string) => tex.text("let" + L, 200, 104, (g) => { g.fillStyle = "#fbfaf5"; g.fillRect(0, 0, 200, 104); g.fillStyle = L === "X" ? "#b3261e" : "#1d2a44"; g.font = "bold 84px Georgia"; g.textAlign = "center"; g.fillText(L, 100, 86); });

// ---- 0:07 · LA MANTITA DEL APOYABRAZOS: la mantita tejida se desliza del brazo enrollado y deja ver la mancha oscura y brillante de veinte años de manos ----
const knitTex = () => tex.text("knit", 256, 256, (g) => { g.fillStyle = "#9e2a2b"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#1f4d34"; for (let i = 0; i < 256; i += 64) { g.fillRect(i, 0, 18, 256); g.fillRect(0, i, 256, 18); } g.strokeStyle = "#e8c9a0"; g.lineWidth = 3; for (let y = 0; y < 256; y += 12) for (let x = 0; x < 256; x += 12) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y + 10); g.lineTo(x + 12, y); g.stroke(); } });
export const HBlanketArm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#17120e" key1={[-1.0, 1.4, 1.4]}
  cam={{ at: [0, 0.5, 0.05], az: [0.55, 0.35], el: [0.18, 0.24], r: [0.95, 0.8], fov: 32 }}>{(tt) => {
  const off = eio(tt, 1.2, 3.0), glint = eio(tt, 3.0, 4.2);
  return <>
    <group position={[0, 0.52, 0]}><Arm len={0.7} /></group>
    <RBox s={[0.6, 0.14, 0.62]} p={[-0.38, 0.4, 0]} r={0.04}><meshStandardMaterial color="#efe4cf" roughness={0.9} /></RBox>
    {/* la mancha: oscura y con brillo de grasa, sobre la curva del brazo */}
    <group position={[0, 0.52, 0.0]}>
      <mesh rotation={[PI / 2, 0, 0]} scale={[1.004, 1, 1.004]}><cylinderGeometry args={[0.09, 0.09, 0.32, 40, 1, true, -1.2, 2.0]} /><meshPhysicalMaterial color="#5c4430" roughness={lerp(0.6, 0.25, glint)} clearcoat={0.7} transparent opacity={0.7} depthWrite={false} /></mesh>
    </group>
    {/* la mantita: se corre hacia atrás y cae por el costado */}
    <group position={[0, 0.52, 0]}><Drape slide={off} tt={tt} /></group>
    {/* la lámpara de la sala */}
    <group position={[0.45, 0, -0.35]}>
      <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.012, 0.03, 0.7, 12]} />{M.brass()}</mesh>
      <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[0.09, 0.14, 0.16, 24, 1, true]} /><meshStandardMaterial color="#f3e2bf" side={2} emissive="#f3c98a" emissiveIntensity={0.5} /></mesh>
    </group>
    <pointLight position={[0.45, 0.75, -0.35]} intensity={1.4} distance={2} color="#ffd59a" />
  </>;
}}</Scene3D>;

// ---- 2:21 · LA LETRA LO DECIDE TODO: la etiqueta cosida asoma bajo el almohadón y la letra gira como un tambor: W, S, WS, X; se queda en W ----
export const HTagLetter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#15110d" key1={[-0.6, 1.2, 1.4]}
  cam={{ at: [0.05, -0.02, 0.26], az: [0.2, 0.05], el: [0.18, 0.12], r: [0.55, 0.42], fov: 30 }}>{(tt) => {
  const lift = eio(tt, 0.3, 1.2), spin = eio(tt, 1.4, 4.2), L = ["W", "S", "WS", "X"], idx = Math.min(3, Math.floor(spin * 4 * 0.999)), fin = spin >= 0.999;
  const letter = fin ? "W" : L[idx], flip = (spin * 4) % 1;
  return <>
    {/* la base del sofá y el almohadón que se levanta */}
    <RBox s={[0.8, 0.06, 0.5]} p={[0, 0, 0]} r={0.02}><meshStandardMaterial color="#d8ccb2" roughness={0.95} /></RBox>
    <group position={[0, 0.08 + 0.12 * lift, -0.05 - 0.12 * lift]} rotation={[-0.7 * lift, 0, 0]}><Cushion w={0.7} d={0.42} h={0.1} /></group>
    {/* la etiqueta, cosida al borde, que gira sobre su costura */}
    <group position={[0.05, 0.02, 0.255]} rotation={[0, 0, 0]}>
      <group rotation={[fin ? 0 : (flip < 0.5 ? flip : flip - 1) * PI * 0.9, 0, 0]}>
        <mesh position={[0, -0.075, 0]}><planeGeometry args={[0.12, 0.155]} /><meshStandardMaterial color="#fbfaf5" roughness={0.9} side={2} /></mesh>
        {/* el tambor: prisma de 4 caras (W, S, WS, X) que gira con peso y frena en W */}
        <group position={[0, -0.075, 0.03]} rotation={[-(fin ? 4 : spin * 4) * PI / 2 - (fin ? 0 : Math.sin(flip * PI) * 0.15), 0, 0]}>
          {["W", "S", "WS", "X"].map((L2, j) => <group key={j} rotation={[j * PI / 2, 0, 0]}><mesh position={[0, 0, 0.026]}><planeGeometry args={[0.1, 0.052]} /><meshStandardMaterial map={letTex(L2)} roughness={0.6} /></mesh></group>)}
          <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.098, 4, 1, false, PI / 4]} /><meshStandardMaterial color="#e9e4d6" /></mesh>
        </group>
      </group>
      <mesh><boxGeometry args={[0.125, 0.006, 0.003]} /><meshStandardMaterial color="#cfc3a6" /></mesh>
    </group>
    <group position={[0.17, -0.06 + 0.01 * Math.sin(tt * 1.4), 0.33]} rotation={[0.3, -0.9, 0.6]} scale={0.8}><Hand grip={0.6} /></group>
  </>;
}}</Scene3D>;

// ---- 3:25 · MÁS GRANDE QUE UN PLATO: el sillón de terciopelo dorado; la mancha se seca y deja un aro que crece; un plato de cena baja y queda chico ----
export const HPlateRing: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" bg="#16110d" key1={[-0.8, 1.6, 1.2]}
  cam={{ at: [0, 0.32, 0.05], az: [0.3, 0.15], el: [0.6, 0.68], r: [0.95, 0.82], fov: 32 }}>{(tt) => {
  const g = eio(tt, 0.4, 3.0), plate = phys(tt, 3.2, 7, 0.45);
  return <>
    {/* el sillón dorado */}
    <RBox s={[0.7, 0.3, 0.66]} p={[0, 0.15, 0]} r={0.05}><meshStandardMaterial color="#b88a2e" roughness={0.55} metalness={0.15} /></RBox>
    <RBox s={[0.62, 0.1, 0.58]} p={[0, 0.34, 0.02]} r={0.04}><meshStandardMaterial color="#c99a3a" roughness={0.5} metalness={0.15} /></RBox>
    <RBox s={[0.7, 0.5, 0.12]} p={[0, 0.5, -0.3]} r={0.05}><meshStandardMaterial color="#b88a2e" roughness={0.55} metalness={0.15} /></RBox>
    {/* la mancha húmeda, después el aro que se expande al secarse */}
    <Spot r={lerp(0.06, 0.07, g)} col="#6b4e1c" op={0.6 * (1 - g)} p={[0, 0.391, 0.04]} />
    <Spot r={lerp(0.07, 0.2, g)} col="#7a5a1c" op={0.85 * g} ring p={[0, 0.392, 0.04]} />
    {/* el plato de comparación */}
    <group position={[0.02, 0.4 + 0.4 * (1 - cl(plate)), 0.05]}>
      <mesh><cylinderGeometry args={[0.13, 0.11, 0.012, 48]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.105, 0.112, 48]} /><meshBasicMaterial color="#3a5a8a" /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:57 · LO QUE HAY EN LA RENDIJA: la boquilla entra entre el almohadón y el brazo; salen saltando pochoclo, monedas, una horquilla y el control remoto ----
export const HCouchCrack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#15110d" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0.1, 0.46, 0.05], az: [0.5, 0.35], el: [0.38, 0.44], r: [0.62, 0.52], fov: 32 }}>{(tt) => {
  const pop = (i: number) => cl(phys(tt, 0.9 + i * 0.45, 6, 0.4));
  const items: [React.ReactNode, number[]][] = [
    [<mesh scale={[1, 0.8, 0.9]}><dodecahedronGeometry args={[0.018, 0]} /><meshStandardMaterial color="#f4e7b8" roughness={0.9} /></mesh>, [0.16, 0.12, 0.1]],
    [<mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.019, 0.019, 0.004, 28]} />{M.brass({ col: "#b8743a" })}</mesh>, [0.24, 0.1, 0.18]],
    [<mesh rotation={[PI / 2, 0.3, 0]}><torusGeometry args={[0.02, 0.0015, 6, 20, PI * 1.4]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} /></mesh>, [0.3, 0.15, 0.02]],
    [<RBox s={[0.045, 0.018, 0.16]} r={0.008}><meshStandardMaterial color="#2a2a2c" roughness={0.6} /></RBox>, [0.2, 0.2, -0.06]],
    [<mesh scale={[1, 0.8, 0.9]}><dodecahedronGeometry args={[0.016, 0]} /><meshStandardMaterial color="#f4e7b8" roughness={0.9} /></mesh>, [0.34, 0.1, 0.14]],
    [<mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.019, 0.019, 0.004, 28]} />{M.brass({ col: "#b8743a" })}</mesh>, [0.12, 0.13, 0.22]],
  ];
  return <>
    <group position={[-0.1, 0.46, 0]}><Arm len={0.6} /></group>
    <Cushion w={0.5} d={0.55} h={0.12} p={[0.2, 0.38, 0]} />
    {/* la boquilla de rendija bajando en la ranura */}
    <group position={[0.0, 0.62 - 0.12 * eio(tt, 0.2, 0.9), 0.02]} rotation={[0, 0, 0.12]}>
      <RBox s={[0.022, 0.32, 0.06]} r={0.008}>{M.plastic({ col: "#5a5f66" })}</RBox>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1, 18]} />{M.plastic({ col: "#5a5f66" })}</mesh>
    </group>
    {/* lo que sale: cada cosa salta de la ranura y cae sobre el almohadón */}
    {items.map(([n, to], i) => { const k = pop(i), up = Math.sin(cl((tt - 0.9 - i * 0.45) / 0.7) * PI) * 0.12;
      return k > 0.01 && <group key={i} position={[lerp(0.02, to[0], k), lerp(0.42, 0.46 + to[1] * 0.1, k) + up, lerp(0.02, to[2], k)]} rotation={[0, i, 0]} scale={1.9}>{n}</group>; })}
  </>;
}}</Scene3D>;

// ---- 4:14 · EL POLVO SE HACE BARRO: migas secas sobre la tela; cae una gota y todo se vuelve barro marrón que se mete entre los hilos ----
const weaveTex = () => tex.text("weave", 256, 256, (g) => { g.fillStyle = "#e9dfc9"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 256; i += 8) { g.fillStyle = "rgba(170,150,120,0.35)"; g.fillRect(i, 0, 3, 256); g.fillRect(0, i, 256, 3); } });
export const HMudPush: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#14100c" key1={[-0.8, 1.0, 1.0]}
  cam={{ at: [0, 0.0, 0], az: [0.2, 0.1], el: [0.55, 0.62], r: [0.48, 0.42], fov: 30 }}>{(tt) => {
  const drop = cl((tt - 0.4) / 0.7), mud = eio(tt, 1.1, 3.2), push = eio(tt, 2.6, 4.4);
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.7, 0.5]} /><meshStandardMaterial map={weaveTex()} roughness={0.95} /></mesh>
    {Array.from({ length: 40 }, (_, i) => { const x = (rn(i, 2) - 0.5) * 0.24, z = (rn(i, 3) - 0.5) * 0.18; return <mesh key={i} position={[x * (1 + 0.3 * mud), 0.004 * (1 - mud), z * (1 + 0.3 * mud)]} scale={[1, lerp(1, 0.2, mud), 1]}><dodecahedronGeometry args={[0.004 + 0.004 * rn(i, 4), 0]} /><meshStandardMaterial color={mud > 0.4 ? "#4a321c" : "#9a8b74"} roughness={1} /></mesh>; })}
    {drop > 0 && drop < 1 && <mesh position={[0, 0.2 - 0.2 * drop * drop, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.012, 16, 12]} />{M.water({ op: 0.8 })}</mesh>}
    <Spot r={lerp(0.02, 0.15 + 0.05 * push, mud)} col="#5a3a1c" op={0.85 * mud} p={[0, 0.002, 0]} />
    {/* el dedo que frota y lo empuja hacia adentro */}
    {push > 0 && <group position={[lerp(-0.08, 0.08, push), 0.03, 0.05]} rotation={[PI, 0.4, 0]} scale={1.2}><Hand grip={0.6} /></group>}
  </>;
}}</Scene3D>;

// ---- 4:31 · UNA TAZA, UNA CUCHARADITA, UNA CUCHARADA: la taza medidora de vidrio se llena; cae la cucharadita de detergente y después la cucharada de vinagre ----
const cupTex = () => tex.text("cupmk", 128, 256, (g) => { g.clearRect(0, 0, 128, 256); g.strokeStyle = "#c2271e"; g.fillStyle = "#c2271e"; g.lineWidth = 4; for (let i = 0; i < 4; i++) { const y = 230 - i * 55; g.beginPath(); g.moveTo(10, y); g.lineTo(i % 2 ? 40 : 60, y); g.stroke(); } g.font = "bold 26px Georgia"; g.fillText("1 CUP", 46, 70); });
export const HMixCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile" bg="#16120e" key1={[-0.8, 1.4, 1.2]}
  cam={{ at: [0, 0.12, 0], az: [0.25, 0.1], el: [0.2, 0.26], r: [0.72, 0.62], fov: 30 }}>{(tt) => {
  const fill = eio(tt, 0.2, 1.6), tsp = cl((tt - 1.8) / 0.9), tbs = cl((tt - 3.0) / 0.9);
  const spoon = (k: number, x: number, s: number, col: string) => k > 0 && k < 1 && <group position={[x - 0.05 * k, 0.32 - 0.04 * Math.sin(k * PI), 0]} rotation={[0, 0, -1.4 * eio(k, 0.3, 0.7)]} scale={s}>
    <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.006, 0.12, 8]} />{M.steel()}</mesh>
    <mesh scale={[1, 0.4, 0.8]}><sphereGeometry args={[0.022, 18, 10, 0, PI * 2, PI / 2, PI / 2]} />{M.steel()}</mesh>
    <mesh position={[0, -0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.018, 18]} /><meshPhysicalMaterial color={col} roughness={0.05} clearcoat={1} /></mesh>
  </group>;
  return <>
    {/* la taza medidora de vidrio */}
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.08, 0.075, 0.2, 40, 1, true]} />{M.glass({ op: 0.28 })}</mesh>
    <mesh position={[0, 0.1, 0.081]}><planeGeometry args={[0.07, 0.14]} /><meshBasicMaterial map={cupTex()} transparent /></mesh>
    <mesh position={[0.095, 0.12, 0]}><torusGeometry args={[0.04, 0.009, 10, 24, PI]} />{M.glass({ op: 0.4 })}</mesh>
    <mesh position={[0, 0.006 + 0.08 * fill, 0]}><cylinderGeometry args={[0.074, 0.072, 0.16 * fill, 40]} />{M.water({ col: tbs > 0.6 ? "#e2ecd8" : "#d6ecf6", op: 0.55 })}</mesh>
    {/* gotas que caen de cada cuchara */}
    {[[tsp, "#cfe8b8"], [tbs, "#f3efdf"]].map(([k, c], j) => { const ph = cl(((k as number) - 0.55) / 0.4); return ph > 0 && ph < 1 && <mesh key={j} position={[0.02, 0.3 - 0.14 * ph * ph, 0]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.008, 12, 8]} /><meshPhysicalMaterial color={c as string} roughness={0} transparent opacity={0.85} /></mesh>; })}
    {spoon(tsp, 0.08, 0.8, "#cfe8b8")}
    {spoon(tbs, 0.08, 1.15, "#f3efdf")}
    {/* el detergente transparente y el vinagre, esperando */}
    <group position={[-0.22, 0, -0.06]}><mesh position={[0, 0.09, 0]}><cylinderGeometry args={[0.03, 0.035, 0.18, 24]} />{M.glass({ col: "#e8f4e0", op: 0.5 })}</mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.012, 0.016, 0.04, 12]} />{M.plastic({ col: "#f2f2f2" })}</mesh></group>
    <group position={[0.24, 0, -0.08]}><mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.035, 0.035, 0.2, 24]} />{M.glass({ col: "#fbf7ea", op: 0.55 })}</mesh><mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.016, 0.016, 0.03, 12]} />{M.plastic({ col: "#8a1f1a" })}</mesh></group>
  </>;
}}</Scene3D>;

// ---- 5:34 · EL SOFÁ ROSA: la toalla roja sobre el almohadón crema; la plancha da vapor y el rosado se desparrama por la tela ----
export const HPinkSofa: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#15110e" key1={[-0.7, 1.4, 1.2]}
  cam={{ at: [0, 0.05, 0], az: [0.3, 0.2], el: [0.55, 0.62], r: [0.7, 0.6], fov: 30 }}>{(tt) => {
  const iron = phys(tt, 0.5, 6, 0.5), bleed = eio(tt, 1.4, 4.0), lift = eio(tt, 3.6, 4.6);
  return <>
    <RBox s={[0.7, 0.1, 0.5]} p={[0, -0.05, 0]} r={0.035}><meshStandardMaterial color="#f1e8d6" roughness={0.95} /></RBox>
    {/* el rosado que se va hacia afuera, por debajo de la toalla */}
    <Spot r={lerp(0.12, 0.24, bleed)} col="#e07a90" op={0.75 * bleed} p={[0, 0.001, 0]} />
    <group position={[0, 0.008 + 0.15 * lift, -0.1 * lift]} rotation={[-0.8 * lift, 0, 0]}>
      <RBox s={[0.3, 0.014, 0.22]} r={0.006}><meshStandardMaterial color="#c4243a" roughness={1} /></RBox>
    </group>
    <group position={[0.02, 0.03 + 0.2 * (1 - cl(iron)) + 0.15 * lift, 0]} rotation={[0, 0.3, 0]}><SteamIron /></group>
    <Steam tt={tt} k={cl(iron) * (1 - lift)} p={[0.02, 0.05, 0]} spread={0.25} h={0.15} />
  </>;
}}</Scene3D>;
void Towel;
