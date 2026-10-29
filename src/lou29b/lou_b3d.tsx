// lou29b · componentes 3D (uno por idea, ninguno repetido de lou29a): utilería simple del diner de Frank que HACE lo que Lou
// dice en ese segundo. Lección de lou29a: objetos claros > comida modelada; la comida va como FOTO real adentro de la loza.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { preload, Food, G, Label3, Plate, Pot, Pour, Sheet, Skillet, Std, Steam3, Tool, ez, lerp, rnd, sp, useTex, useFoodTex, V3 } from "./props3d";
import { R3, Cap, drop } from "./lou_r3a";
import { FONT } from "./lib";
import { HAND } from "./hkit";

preload(["lb_n15a", "lb_n14a", "lb_n13a", "lb_n12a", "lb_n11a", "lb_n10a", "lb_n09a", "lb_n08a", "lb_n07a", "lb_n06a", "lb_n05a", "lb_n04a", "lb_n03a", "lb_n02a", "lb_n01a"]);
type P = { t: number; h: H };
// materiales compartidos a nivel módulo (dentro de f no se pueden usar hooks)
const steel = new THREE.MeshStandardMaterial({ color: "#d9dde2", metalness: 1, roughness: 0.22 });
const glass = new THREE.MeshPhysicalMaterial({ color: "#eef6f4", roughness: 0.04, transparent: true, opacity: 0.25, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false });
const chrome = new THREE.MeshStandardMaterial({ color: "#eef1f4", metalness: 1, roughness: 0.12 });
const wood = new THREE.MeshStandardMaterial({ color: "#8a5a32", roughness: 0.62 });
const lathe = (pts: [number, number][]) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 64);
const BOWL = lathe([[0.001, 0], [0.2, 0], [0.32, 0.06], [0.42, 0.2], [0.44, 0.24], [0.425, 0.24], [0.4, 0.2], [0.3, 0.075], [0.19, 0.02], [0.001, 0.02]]);
const CAM: { p: V3; l: V3; fov: number } = { p: [0, 1.5, 2.4], l: [0, 0.3, 0], fov: 34 };
const k0 = (tt: number, a: number, w = 8, z = 0.42) => sp(tt, a, w, z);

// textura de dibujo con cache (componente: los hooks quedan acá adentro)
const Tex: React.FC<{ id: string; w: number; h: number; draw: (g: CanvasRenderingContext2D, w: number, h: number) => void; children: (t: THREE.Texture | null) => React.ReactNode }> = ({ id, w, h, draw, children }) => <>{children(useTex(id, w, h, draw))}</>;
// pieza con textura de comida
const FoodMesh: React.FC<{ tex: string; c?: string; cc?: number; children: React.ReactNode; p?: V3; r?: V3; s?: V3 | number }> = ({ tex, c = "#ffffff", cc = 0.2, children, p, r, s }) => {
  const ft = useFoodTex(tex);
  return <G p={p} r={r} s={s}><mesh castShadow>{children}<meshPhysicalMaterial key={ft ? "t" : "n"} map={ft ?? undefined} color={c} roughness={0.7} clearcoat={cc} /></mesh></G>;
};


// aluminio arrugado (textura de pliegues) y piel que se seca y dora
const FoilMat: React.FC = () => {
  const tx = useTex("foil", 512, 256, (g, w, hh) => { g.fillStyle = "#c9ced4"; g.fillRect(0, 0, w, hh); for (let i = 0; i < 140; i++) { g.strokeStyle = `rgba(${rnd(i, 1) > 0.5 ? "255,255,255" : "90,96,104"},${0.25 + 0.4 * rnd(i, 2)})`; g.lineWidth = 1 + 3 * rnd(i, 3); g.beginPath(); const x = rnd(i, 4) * w, y = rnd(i, 5) * hh; g.moveTo(x, y); g.lineTo(x + 70 * (rnd(i, 6) - 0.5), y + 50 * (rnd(i, 7) - 0.5)); g.lineTo(x + 90 * (rnd(i, 8) - 0.5), y + 60 * (rnd(i, 9) - 0.5)); g.stroke(); } });
  return <meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} metalness={0.85} roughness={0.38} side={THREE.DoubleSide} />;
};
const SkinMat: React.FC<{ pat: number; gold: number }> = ({ pat, gold }) => {
  const ft = useFoodTex("cooked");
  return <meshPhysicalMaterial key={ft && gold > 0.01 ? "t" : "n"} map={gold > 0.01 ? ft ?? undefined : undefined} color={new THREE.Color("#e7b9a0").lerp(new THREE.Color("#ffffff"), gold).getStyle()} roughness={Math.max(0.2, lerp(0.15, 0.8, pat) - 0.4 * gold)} clearcoat={(1 - pat) + gold * 0.9} />;
};

// b00 · 12:15 del domingo: los taburetes de la barra se llenan uno por uno de sombreros de misa
const HATS = ["#2b2d33", "#c98fa0", "#3b4a6b", "#e6dcc4", "#5a3b2a", "#9fb7c9"];
export const RStools: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="wood" cam={{ p: [0, 1.0, 2.3], l: [0, 0.45, 0], fov: 34 }} cam2={{ p: [0.05, 0.95, 2.0], l: [0, 0.47, 0], fov: 32 }} f={(tt) => <>
  {HATS.slice(0, 5).map((c, i) => {
    const x = -0.9 + i * 0.45, d = drop(tt, 0.7 + i * 0.45, 1.3), lady = i % 2 === 1;
    return <G key={i} p={[x, 0, -0.1]}>
      <mesh position={[0, 0.27, 0]} material={chrome} castShadow><cylinderGeometry args={[0.03, 0.03, 0.54, 16]} /></mesh>
      <mesh position={[0, 0.01, 0]} material={chrome}><cylinderGeometry args={[0.14, 0.16, 0.02, 32]} /></mesh>
      <mesh position={[0, 0.57, 0]} castShadow><cylinderGeometry args={[0.18, 0.17, 0.07, 40]} /><Std c="#b3241b" r={0.35} cc={1} /></mesh>
      {d.on && <G p={[0, 0.61 + d.y, 0]} s={[1, d.sq, 1]} r={[0, i * 0.7, 0]}>
        <mesh castShadow><cylinderGeometry args={[lady ? 0.17 : 0.15, lady ? 0.17 : 0.15, 0.012, 40]} /><Std c={c} r={0.8} /></mesh>
        <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[lady ? 0.08 : 0.085, 0.095, lady ? 0.07 : 0.1, 32]} /><Std c={c} r={0.8} /></mesh>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.097, 0.097, 0.022, 32]} /><Std c={lady ? "#f2e6c9" : "#141414"} r={0.5} /></mesh>
      </G>}
    </G>;
  })}
</>} over={(tt) => <Cap tt={tt} at={0.9} x={960} y={150} txt="EVERY STOOL FULL" col="#e4b23a" />} />;

// b01 · croquetas en conos sobre la placa: el timer de cuerda da 2 horas y la escarcha las cubre
const Cone: React.FC<{ p: V3; frost: number }> = ({ p, frost }) => {
  const ft = useFoodTex("breaded");
  return <G p={p}><mesh castShadow position={[0, 0.11, 0]}><coneGeometry args={[0.085, 0.22, 32]} /><meshPhysicalMaterial key={ft ? "t" : "n"} map={ft ?? undefined} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#cfe2f0"), frost * 0.55)} roughness={0.75} clearcoat={frost * 0.6} /></mesh></G>;
};
export const RColdCones: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.6, 2.2], l: [0.15, 0.2, -0.1], fov: 34 }} cam2={{ p: [0.25, 1.35, 1.8], l: [0.15, 0.2, -0.1], fov: 32 }} f={(tt) => {
  const turn = ez(tt, 1.2, 4.5), frost = ez(tt, 2.2, 6.5);
  return <>
    <mesh position={[-0.35, 0.012, 0]} material={steel} receiveShadow castShadow><boxGeometry args={[1.25, 0.024, 0.75]} /></mesh>
    {[...Array(8)].map((_, i) => { const d = drop(tt, 0.2 + i * 0.12, 0.6); return d.on ? <Cone key={i} p={[-0.8 + (i % 4) * 0.3, 0.024 + d.y, -0.15 + Math.floor(i / 4) * 0.3]} frost={frost} /> : null; })}
    {[...Array(26)].map((_, i) => { const a = 2.4 + i * 0.12; return tt > a ? <mesh key={i} position={[-0.9 + rnd(i, 1) * 1.1, 0.03 + 0.25 * rnd(i, 2), -0.3 + rnd(i, 3) * 0.6]} rotation={[rnd(i, 4) * 3, rnd(i, 5) * 3, 0]} scale={Math.min(1, (tt - a) * 3)}><octahedronGeometry args={[0.012, 0]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.4} clearcoat={1} /></mesh> : null; })}
    {/* timer de cuerda de cocina */}
    <G p={[0.72, 0, -0.05]} s={1.45}>
      <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.2, 0.22, 0.32, 48]} /><Std c="#f2efe8" r={0.3} cc={1} /></mesh>
      <G p={[0, 0.33, 0]}>
        <Tex id="timer2h" w={512} h={512} draw={(g, w) => { g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, w, w); g.fillStyle = "#1d2440"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `900 70px ${FONT}`; ["0", "30", "1H", "90", "2H"].forEach((s, i) => { const a = (i / 6) * Math.PI * 2; g.fillText(s, w / 2 + Math.sin(a) * 180, w / 2 - Math.cos(a) * 180); }); g.fillStyle = "#b3241b"; g.beginPath(); g.arc(w / 2, w / 2, 40, 0, 6.3); g.fill(); }}>
          {(tx) => <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}><circleGeometry args={[0.2, 64]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.5} /></mesh>}
        </Tex>
        <G r={[0, -turn * (Math.PI * 4 / 3), 0]}><mesh position={[0, 0.03, -0.08]}><boxGeometry args={[0.03, 0.03, 0.17]} /><Std c="#b3241b" r={0.35} cc={1} /></mesh></G>
      </G>
      <mesh position={[0, 0.34, 0.205]} rotation-x={-Math.PI / 2}><coneGeometry args={[0.025, 0.05, 3]} /><Std c="#b3241b" /></mesh>
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={0.7} x={1420} y={150} txt="2 HOURS COLD" col="#7fb6d9" />} />;

// b02 · el pan de jamón y el salero: cae un círculo rojo tachado y el salero se va
export const RNoSalt: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={CAM} cam2={{ p: [0.1, 1.3, 1.9], l: [0.1, 0.3, 0], fov: 32 }} f={(tt) => {
  const tilt = ez(tt, 0.9, 1.8) * (1 - ez(tt, 3.6, 4.4)), ring = drop(tt, 2.4, 1.4), away = ez(tt, 3.8, 5.0);
  return <>
    <mesh position={[-0.35, 0.09, 0]} material={steel} castShadow><boxGeometry args={[0.95, 0.18, 0.5]} /></mesh>
    <FoodMesh tex="cooked" c="#e6b49a" cc={1} p={[-0.35, 0.2, 0]} s={[1, 1, 1]}><boxGeometry args={[0.86, 0.14, 0.44]} /></FoodMesh>
    <mesh position={[-0.35, 0.272, 0]}><boxGeometry args={[0.84, 0.01, 0.42]} /><meshPhysicalMaterial color="#8e3410" roughness={0.15} clearcoat={1} transparent opacity={0.85} /></mesh>
    <G p={[0.45, 0.0, 0.05]} r={[0, 0, tilt * 2.1]} s={1.6}>
      <mesh position={[0, 0.16, 0]} material={glass}><cylinderGeometry args={[0.07, 0.08, 0.3, 32]} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.065, 0.075, 0.18, 32]} /><Std c="#f7f7f5" r={0.9} /></mesh>
      <mesh position={[0, 0.34, 0]} material={steel}><cylinderGeometry args={[0.055, 0.072, 0.07, 32]} /></mesh>
    </G>
    {tilt > 0.6 && [...Array(14)].map((_, i) => <mesh key={i} position={[0.12 - (i % 5) * 0.03, 0.3 - ((tt * 1.5 + i * 0.07) % 0.25), 0.05 + 0.04 * (rnd(i, 2) - 0.5)]}><boxGeometry args={[0.008, 0.008, 0.008]} /><Std c="#ffffff" r={0.3} /></mesh>)}
    {ring.on && <G p={[0.45, 0.42 + ring.y, 0.35]} s={0.8}>
      <mesh><torusGeometry args={[0.3, 0.035, 16, 64]} /><Std c="#d42a1e" r={0.3} cc={1} /></mesh>
      <mesh rotation-z={-Math.PI / 4}><boxGeometry args={[0.6, 0.06, 0.06]} /><Std c="#d42a1e" r={0.3} cc={1} /></mesh>
    </G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.6} x={1500} y={150} txt="NO SALT" col="#d42a1e" />} />;

// b03 · los dos rollos de repollo: el APRETADO se hincha y revienta, el FLOJO se infla entero
const Roll: React.FC<{ p: V3; rad: number; split: number }> = ({ p, rad, split }) => <G p={p} r={[0, 0, Math.PI / 2]}>
  {[-1, 1].map((sd) => <mesh key={sd} position={[0, sd * (0.115 + split * 0.08), 0]} rotation-z={sd * split * 0.25} castShadow><cylinderGeometry args={[rad, rad * 0.97, 0.23, 40]} /><meshPhysicalMaterial color="#a9c47a" roughness={0.45} clearcoat={0.7} sheen={0.5} /></mesh>)}
  {[...Array(5)].map((_, i) => <mesh key={i} position={[0, -0.2 + i * 0.1, 0]}><torusGeometry args={[rad * 1.005, 0.006, 6, 40]} /><Std c="#d7e6b6" r={0.4} /></mesh>)}
</G>;
export const RLooseRoll: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.05, 1.6], l: [0, 0.17, 0], fov: 34 }} cam2={{ p: [-0.1, 0.95, 1.35], l: [-0.05, 0.17, 0], fov: 32 }} f={(tt) => {
  const sw = ez(tt, 1.2, 4.2), burst = k0(tt, 3.6, 9, 0.5);
  return <>
    <mesh position={[0, 0.05, 0]} castShadow receiveShadow><boxGeometry args={[1.9, 0.1, 0.9]} /><Std c="#e9e2d2" r={0.25} cc={1} /></mesh>
    <mesh position={[0, 0.101, 0]}><boxGeometry args={[1.75, 0.004, 0.78]} /><Std c="#a8331f" r={0.25} cc={1} /></mesh>
    <Roll p={[-0.45, 0.2 + 0.03 * sw, 0]} rad={0.1 + 0.035 * sw} split={burst} />
    {burst > 0.05 && [...Array(28)].map((_, i) => <mesh key={i} position={[-0.45 + 0.35 * (rnd(i, 1) - 0.5) * burst, 0.16 + 0.12 * rnd(i, 2) * (1 - burst * 0.6), 0.25 * (rnd(i, 3) - 0.5) * burst]} rotation={[0, rnd(i, 4) * 3, Math.PI / 2]} scale={[1, 1, 1]}><capsuleGeometry args={[0.008, 0.02, 4, 8]} /><Std c="#f5f1e6" r={0.5} /></mesh>)}
    <Roll p={[0.45, 0.2 + 0.035 * sw, 0]} rad={0.115 + 0.04 * sw} split={0} />
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.8} x={620} y={190} txt="TIGHT" col="#d42a1e" /><Cap tt={tt} at={1.4} x={1300} y={190} txt="LOOSE" col="#3fae5b" /></>} />;

// b04 · el calendario del mes: el marcador rojo encierra el SEGUNDO domingo y llega el plato de albóndigas
export const RSecondSunday: React.FC<P> = ({ t, h }) => {
  return <R3 t={t} h={h} cam={{ p: [0, 1.1, 2.4], l: [0, 0.6, 0], fov: 34 }} cam2={{ p: [-0.35, 1.0, 1.9], l: [-0.35, 0.7, 0], fov: 32 }} f={(tt) => {
    const c = ez(tt, 1.2, 2.6), pl = drop(tt, 2.9, 0.9);
    return <>
      <Sheet id="calb" w={1.6} h={1.15} th={0.01} p={[0, 0.66, -0.25]} r={[-0.12, 0, 0]} draw={(g, w, hh) => {
        g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, w, hh); g.fillStyle = "#b3241b"; g.fillRect(0, 0, w, hh * 0.17);
        g.fillStyle = "#fff"; g.font = `900 70px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SUNDAYS AT FRANK'S", w / 2, hh * 0.09);
        const cw = w / 7, ch = (hh * 0.83) / 6; g.font = `900 46px ${FONT}`; g.fillStyle = "#1d2440";
        ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].forEach((d, i) => g.fillText(d, cw * (i + 0.5), hh * 0.17 + ch * 0.5));
        g.font = `700 56px ${FONT}`;
        for (let n = 1; n <= 30; n++) { const k = n + 1, col = k % 7, row = Math.floor(k / 7); g.fillStyle = col === 0 ? "#b3241b" : "#3a3a3a"; g.fillText(String(n), cw * (col + 0.5), hh * 0.17 + ch * (row + 1.5)); }
        g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 3; for (let r = 1; r < 7; r++) { g.beginPath(); g.moveTo(0, hh * 0.17 + ch * r); g.lineTo(w, hh * 0.17 + ch * r); g.stroke(); }
      }} />
      {/* 2º domingo = día 13 (columna 0, fila 2) */}
      {c > 0.01 && <mesh position={[-0.686, 0.483, -0.235 + 0.04]} rotation={[-0.12, 0, Math.PI / 2]}><torusGeometry args={[0.1, 0.012, 8, 64, Math.PI * 2 * c]} /><Std c="#d42a1e" r={0.4} /></mesh>}
      {pl.on && <G p={[0.35, 0.02 + pl.y, 0.3]}><Plate rad={0.34} photo="lb_n12a" /></G>}
    </>;
  }} over={(tt) => <Cap tt={tt} at={1.6} x={1500} y={930} txt="2ND SUNDAY" col="#d42a1e" />} />;
};

// b05 · la hornalla: la perilla va a OFF, la llama azul se apaga y RECIÉN ahí cae la crema agria
export const ROffHeat: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="steel" cam={{ p: [0.15, 1.2, 1.65], l: [0.15, 0.15, 0.1], fov: 34 }} cam2={{ p: [0.25, 1.05, 1.4], l: [0.2, 0.15, 0.1], fov: 32 }} f={(tt) => {
  const off = ez(tt, 1.0, 2.0), fl = 1 - off, dl = drop(tt, 2.6, 0.8);
  return <>
    {[0.16, 0.3].map((r) => <mesh key={r} position={[0, 0.03, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[r, 0.015, 8, 48]} /><Std c="#1a1a1a" m={0.6} r={0.5} /></mesh>)}
    {fl > 0.02 && [...Array(18)].map((_, i) => { const a = (i / 18) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 0.2, 0.05 + 0.02 * fl, Math.sin(a) * 0.2]} scale={[1, fl * (0.9 + 0.1 * Math.sin(tt * 9 + i)), 1]}><coneGeometry args={[0.018, 0.07, 10]} /><meshStandardMaterial color="#5aa0ff" emissive="#3b7bff" emissiveIntensity={1.4 * fl} transparent opacity={0.85 * fl} /></mesh>; })}
    <G p={[0, 0.07, 0]}><Skillet rad={0.42} photo="lb_n12a" /></G>
    {/* perilla */}
    <G p={[0.72, 0.06, 0.38]} s={1.9}>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.01, 40]} /><Std c="#f2efe8" r={0.4} /></mesh>
      <G r={[0, (1 - off) * 2.2, 0]}><mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.08, 0.09, 0.1, 32]} /><Std c="#1a1a1a" r={0.4} cc={1} /></mesh><mesh position={[0, 0.1, 0.04]}><boxGeometry args={[0.02, 0.01, 0.07]} /><Std c="#f2efe8" /></mesh></G>
      <Label3 txt="OFF" col="#d42a1e" w={0.34} p={[0, 0.006, 0.2]} r={[-Math.PI / 2, 0, 0]} />
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={2.0} x={500} y={170} txt="OFF THE HEAT" col="#5aa0ff" />} />;

// b06 · el pizarrón de letras: FRICASSEE se cae letra por letra y entra CHICKEN IN GRAVY; tres comandas por cada una de antes
const Letter: React.FC<{ ch: string; p: V3; r?: V3 }> = ({ ch, p, r }) => <Label3 txt={ch} col="#f7f4ee" w={1.0} p={p} r={r} />;
export const RBoardRename: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.95, 2.5], l: [0, 0.65, 0], fov: 34 }} cam2={{ p: [0.1, 0.9, 2.0], l: [0, 0.65, 0], fov: 32 }} f={(tt) => {
  const A = "FRICASSEE".split(""), B1 = "CHICKEN IN".split(""), B2 = "GRAVY".split("");
  return <>
    <mesh position={[0, 0.7, -0.3]} castShadow><boxGeometry args={[1.9, 1.0, 0.05]} /><Std c="#1b1c1f" r={0.95} /></mesh>
    <mesh position={[0, 0.7, -0.33]}><boxGeometry args={[2.0, 1.1, 0.04]} /><Std c="#7a4a26" r={0.6} /></mesh>
    {[...Array(9)].map((_, i) => <mesh key={i} position={[0, 0.3 + i * 0.1, -0.272]}><boxGeometry args={[1.86, 0.004, 0.004]} /><Std c="#2c2e33" /></mesh>)}
    {A.map((c, i) => { const f = ez(tt, 1.3 + i * 0.08, 2.1 + i * 0.08); return f < 0.99 ? <Letter key={i} ch={c} p={[-0.62 + i * 0.155, 0.75 - 1.2 * f * f, -0.25 + 0.3 * f]} r={[f * 2, 0, (rnd(i, 1) - 0.5) * 3 * f]} /> : null; })}
    {B1.map((c, i) => { const k = k0(tt, 2.4 + i * 0.06); return k > 0.01 && c !== " " ? <Letter key={"a" + i} ch={c} p={[-0.7 + i * 0.155 + (1 - k) * 1.5, 0.88, -0.25]} /> : null; })}
    {B2.map((c, i) => { const k = k0(tt, 3.1 + i * 0.06); return k > 0.01 ? <Letter key={"b" + i} ch={c} p={[-0.31 + i * 0.155 + (1 - k) * 1.5, 0.62, -0.25]} /> : null; })}
    {[0, 1, 2].map((i) => { const d = drop(tt, 4.3 + i * 0.35, 0.6); return d.on ? <G key={i} p={[0.62 + i * 0.07, 0.004 + d.y + i * 0.004, 0.42 - i * 0.03]} r={[-Math.PI / 2, 0, 0.15 - i * 0.12]}><Sheet id={"tk" + i} w={0.4} h={0.56} th={0.003} draw={(g, w, hh) => { g.fillStyle = "#f4efe0"; g.fillRect(0, 0, w, hh); g.fillStyle = "#1d3f9e"; g.font = `700 90px ${HAND}`; g.fillText("chix", 40, 160); g.fillText("gravy", 40, 280); g.fillStyle = "#b3241b"; g.font = `900 90px ${FONT}`; g.fillText("75¢", 40, 420); }} /></G> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={4.6} x={1560} y={150} txt="SOLD 3×" col="#e4b23a" />} />;

// b07 · templar la yema: el cucharón echa salsa caliente en el bol de yema (amarillo → crema) y recién ahí va a la olla
export const RTemperYolk: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={CAM} cam2={{ p: [-0.2, 1.3, 1.9], l: [-0.1, 0.3, 0], fov: 32 }} f={(tt) => {
  const lad = ez(tt, 0.8, 1.6) * (1 - ez(tt, 3.0, 3.6)), mix = ez(tt, 1.6, 3.2), lift = ez(tt, 3.8, 4.8), tip = ez(tt, 4.8, 5.5);
  const yolk = new THREE.Color("#f2b632").lerp(new THREE.Color("#ead7a6"), mix).getStyle();
  return <>
    <G p={[0.55, 0, -0.1]}><Pot rad={0.42} h={0.4} photo="lb_n11a" /></G>
    <G p={[-0.45 + 0.55 * lift, 0.0 + 0.55 * lift, 0.05 - 0.1 * lift]} r={[0, 0, -tip * 1.4]} s={0.75}>
      <mesh geometry={BOWL} material={glass} />
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.34, 0.24, 0.02, 48]} /><Std c={yolk} r={0.3} cc={0.8} /></mesh>
    </G>
    {/* cucharón */}
    <G p={[-0.3, 0.55 + 0.3 * (1 - lad), 0.0]} r={[0, 0, lad * 1.2]}>
      <mesh material={steel} castShadow><sphereGeometry args={[0.08, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
      <mesh position={[0.2, 0.1, 0]} rotation-z={-1.0} material={steel}><cylinderGeometry args={[0.012, 0.012, 0.45, 12]} /></mesh>
    </G>
    <Pour x={-0.37} z={0.0} y0={0.5} y1={0.12} c="#c9a36a" w={0.016} o={lad > 0.6 && tt < 3.0 ? 1 : 0} />
    <Pour x={0.3} z={-0.05} y0={0.45} y1={0.32} c="#ead7a6" w={0.03} o={tip > 0.6 ? 1 : 0} />
    <Steam3 tt={tt} p={[0.55, 0.42, -0.1]} n={6} />
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={480} y={170} txt="WARM THE YOLK" col="#f2b632" />} />;

// b08 · relleno que se hincha: el vaso lleno hasta el borde rebalsa, el de 3/4 queda justo
const Cubes: React.FC<{ tt: number; x: number; n: number; sw: number; over: boolean }> = ({ tt, x, n, sw, over }) => <>{[...Array(n)].map((_, i) => {
  const a = 0.6 + i * 0.05, k = ez(tt, a, a + 0.35), lay = Math.floor(i / 7), y = 0.04 + lay * 0.055 * (1 + 0.35 * sw);
  const spill = over && lay >= Math.floor(n / 7) - 1 ? ez(tt, 3.4 + (i % 7) * 0.05, 4.2) : 0;
  return tt > a ? <mesh key={i} position={[x + 0.15 * (rnd(i, 1) - 0.5) + 0, y + 0.6 * (1 - k) + 0, 0.15 * (rnd(i, 2) - 0.5)]} rotation={[rnd(i, 3) * 3, rnd(i, 5) * 3, 0]} scale={1 + 0.35 * sw} castShadow><boxGeometry args={[0.05, 0.05, 0.05]} /><Std c={i % 3 ? "#d6a560" : "#b9874a"} r={0.85} /></mesh> : null;
})}</>;
export const RThreeQuarters: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.0, 2.35], l: [0, 0.4, 0], fov: 34 }} cam2={{ p: [0, 0.95, 2.0], l: [0, 0.42, 0], fov: 32 }} f={(tt) => {
  const sw = ez(tt, 2.6, 3.8);
  return <>
    {[-0.4, 0.4].map((x) => <mesh key={x} position={[x, 0.3, 0]} material={glass}><cylinderGeometry args={[0.15, 0.13, 0.6, 48, 1, true]} /></mesh>)}
    {[-0.4, 0.4].map((x) => <mesh key={"b" + x} position={[x, 0.005, 0]} material={glass}><cylinderGeometry args={[0.13, 0.13, 0.01, 48]} /></mesh>)}
    <mesh position={[0.4, 0.3 * 0.75 * 2, 0]}><torusGeometry args={[0.155, 0.012, 8, 48]} /><Std c="#3fae5b" r={0.3} cc={1} /></mesh>
    <Cubes tt={tt} x={-0.4} n={63} sw={sw} over={true} />
    <Cubes tt={tt} x={0.4} n={42} sw={sw} over={false} />
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.8} x={760} y={150} txt="FULL" col="#d42a1e" /><Cap tt={tt} at={1.2} x={1160} y={150} txt="3/4" col="#3fae5b" /></>} />;

// b09 · tres días de marinada: el bol de ACERO se apaga con una cruz, el de VIDRIO se queda con la carne
const Roast: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <FoodMesh tex="beef" c="#ffffff" p={p} s={[s * 1.25, s * 0.75, s]}><sphereGeometry args={[0.17, 40, 24]} /></FoodMesh>;
export const RGlassBowl: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={CAM} cam2={{ p: [0.25, 1.3, 1.9], l: [0.3, 0.2, 0], fov: 32 }} f={(tt) => {
  const x = drop(tt, 2.0, 1.2), win = ez(tt, 2.6, 3.4);
  return <>
    <G p={[-0.5, 0, 0]} s={1.1}><mesh geometry={BOWL} material={steel} castShadow /><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.38, 0.3, 0.02, 48]} /><Std c={new THREE.Color("#5a1f2e").lerp(new THREE.Color("#6a6a64"), win).getStyle()} r={0.2} cc={1} /></mesh><Roast p={[0, 0.17, 0]} /></G>
    <G p={[0.5, 0, 0]} s={1.1}><mesh geometry={BOWL} material={glass} /><mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.38, 0.3, 0.02, 48]} /><Std c="#5a1f2e" r={0.15} cc={1} /></mesh><Roast p={[0, 0.17, 0]} />
      {[...Array(5)].map((_, i) => <mesh key={i} position={[0.25 * Math.cos(i * 1.3), 0.165, 0.25 * Math.sin(i * 1.3)]}><cylinderGeometry args={[0.035, 0.035, 0.008, 16]} /><Std c="#e6dcc4" r={0.5} /></mesh>)}
    </G>
    {x.on && <G p={[-0.98, 0.5 + x.y, 0.2]} s={0.5}>{[1, -1].map((s) => <mesh key={s} rotation-z={s * Math.PI / 4}><boxGeometry args={[0.55, 0.07, 0.07]} /><Std c="#d42a1e" r={0.3} cc={1} /></mesh>)}</G>}
  </>;
}} over={(tt) => <><Cap tt={tt} at={2.2} x={640} y={170} txt="METAL" col="#d42a1e" /><Cap tt={tt} at={3.0} x={1300} y={170} txt="GLASS · 3 DAYS" col="#3fae5b" /></>} />;

// b10 · las galletitas de jengibre caen a la olla y la salsa se espesa y oscurece (sin harina)
const Snap: React.FC<{ p: V3; r: V3; o: number }> = ({ p, r, o }) => {
  const tx = useTex("snap", 256, 256, (g, w) => { g.fillStyle = "#b8692c"; g.fillRect(0, 0, w, w); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(90,40,10,${0.3 + 0.4 * rnd(i, 1)})`; g.lineWidth = 2 + 3 * rnd(i, 2); g.beginPath(); const x = rnd(i, 3) * w, y = rnd(i, 4) * w; g.moveTo(x, y); g.lineTo(x + 40 * (rnd(i, 5) - 0.5), y + 40 * (rnd(i, 6) - 0.5)); g.stroke(); } for (let i = 0; i < 90; i++) { g.fillStyle = "rgba(255,240,210,.5)"; g.fillRect(rnd(i, 7) * w, rnd(i, 8) * w, 3, 3); } });
  return <G p={p} r={r}><mesh castShadow><cylinderGeometry args={[0.1, 0.1, 0.022, 32]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.8} transparent opacity={o} /></mesh></G>;
};
export const RGingersnaps: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.75, 1.9], l: [0, 0.25, 0], fov: 34 }} cam2={{ p: [0.1, 1.55, 1.5], l: [0, 0.25, 0], fov: 32 }} f={(tt) => {
  const thick = ez(tt, 1.8, 4.8), stir = ez(tt, 3.6, 4.2);
  return <>
    <Pot rad={0.5} h={0.42} fill={new THREE.Color("#6e4a2a").lerp(new THREE.Color("#3a1d0d"), thick).getStyle()} level={0.7 + 0.12 * thick} />
    {[...Array(9)].map((_, i) => { const a = 0.6 + i * 0.22, k = ez(tt, a, a + 0.45), sink = ez(tt, a + 0.45, a + 1.6); return tt > a ? <Snap key={i} p={[0.3 * (rnd(i, 1) - 0.5), 0.36 + 0.06 * thick + 0.9 * (1 - k) - 0.03 * sink, 0.3 * (rnd(i, 2) - 0.5)]} r={[(rnd(i, 3) - 0.5) * 0.6 * (1 - k), 0, (rnd(i, 4) - 0.5) * 0.6]} o={1 - sink} /> : null; })}
    {stir > 0.01 && <G p={[0.18 * Math.cos(tt * 2.4), 0.55, 0.18 * Math.sin(tt * 2.4)]} r={[0.4, -tt * 2.4, 0]}><Tool kind="wspoon" r={[Math.PI / 2 - 0.3, 0, 0]} s={1.6} /></G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={2.4} x={1460} y={170} txt="GINGER SNAPS" col="#e4b23a" />} />;

// b11 · la parmigiana: la salsa y la mozzarella caen ARRIBA del milanesa; abajo queda crocante
export const RSauceOnTop: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 1.6], l: [0, 0.15, 0], fov: 34 }} cam2={{ p: [0.1, 1.0, 1.35], l: [0, 0.16, 0], fov: 32 }} f={(tt) => {
  const s1 = drop(tt, 1.0, 0.8), s2 = drop(tt, 2.0, 0.8), melt = ez(tt, 2.6, 4.5);
  return <>
    <mesh position={[0, 0.04, 0]} castShadow receiveShadow><boxGeometry args={[1.5, 0.08, 0.95]} /><Std c="#f2ede2" r={0.25} cc={1} /></mesh>
    <Food kind="cutlet" tex="breaded" c="#ffffff" p={[0, 0.12, 0]} s={1.9} />
    <Pour x={0} z={0} y0={0.8} y1={0.18} c="#a8261a" w={0.03} o={tt > 0.9 && tt < 1.9 ? 1 : 0} />
    {tt > 1.0 && <G p={[0, 0.17, 0]} s={[ez(tt, 1.0, 1.9), 1, ez(tt, 1.0, 1.9)]}><mesh scale={[1.25, 0.06, 0.85]} castShadow><sphereGeometry args={[0.3, 40, 16]} /><Std c="#a8261a" r={0.3} cc={0.8} /></mesh></G>}
    {[...Array(70)].map((_, i) => { const a = 2.0 + i * 0.012, k = ez(tt, a, a + 0.35); return tt > a ? <mesh key={i} position={[0.55 * (rnd(i, 1) - 0.5), 0.2 + 0.6 * (1 - k) - 0.012 * melt, 0.35 * (rnd(i, 2) - 0.5)]} rotation={[0, rnd(i, 3) * 3, Math.PI / 2 * (1 - melt * 0.9)]} scale={[1, 1 - 0.5 * melt, 1 + melt]}><capsuleGeometry args={[0.007, 0.05, 4, 6]} /><Std c={new THREE.Color("#fbf3d8").lerp(new THREE.Color("#f0d78e"), melt).getStyle()} r={0.4} cc={0.5 * melt} /></mesh> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1440} y={170} txt="SAUCE ON TOP" col="#a8261a" />} />;

// b12 · el stroganoff: las tiras se sellan rápido, SALTAN al plato, y vuelven a la salsa recién al final
export const RSearFast: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.15, 1.35, 1.65], l: [0.2, 0.08, 0], fov: 34 }} cam2={{ p: [0.2, 1.2, 1.4], l: [0.2, 0.08, 0], fov: 32 }} f={(tt) => {
  const sear = ez(tt, 0.8, 2.0), out = ez(tt, 2.2, 3.0), sauce = ez(tt, 3.0, 4.0), back = ez(tt, 4.6, 5.4);
  const jump = (k: number) => 0.5 * Math.sin(Math.PI * k);
  return <>
    <G p={[-0.3, 0.02, 0]}><Skillet rad={0.45} photo={sauce > 0.02 ? "lb_n07a" : undefined} inside="#2a2a2a" /></G>
    <G p={[0.75, 0.0, 0.1]}><Plate rad={0.3} /></G>
    {[...Array(8)].map((_, i) => {
      const k = back > 0 ? 1 - back : out, x = lerp(-0.3 + 0.5 * (rnd(i, 1) - 0.5), 0.75 + 0.3 * (rnd(i, 2) - 0.5), k), z = lerp(0.5 * (rnd(i, 3) - 0.5), 0.1 + 0.25 * (rnd(i, 4) - 0.5), k);
      const y = 0.07 + 0.03 * k + jump(back > 0 ? back : out);
      return <FoodMesh key={i} tex={sear > 0.5 ? "cooked" : "beef"} p={[x, y, z]} r={[0, rnd(i, 5) * 3, 0]} s={1}><boxGeometry args={[0.26, 0.04, 0.07]} /></FoodMesh>;
    })}
    {sear > 0.05 && out < 0.5 && <Steam3 tt={tt} p={[-0.3, 0.1, 0]} n={8} spread={0.5} />}
  </>;
}} over={(tt) => <><Cap tt={tt} at={2.3} x={1400} y={160} txt="OUT" col="#e4b23a" /><Cap tt={tt} at={4.8} x={560} y={160} txt="BACK AT THE END" col="#3fae5b" /></>} />;

// b13 · descansar el asado: la carpa de papel aluminio baja sobre la pierna en la tabla
export const RRestFoil: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.15, 1.7], l: [0, 0.22, 0], fov: 34 }} cam2={{ p: [0.15, 1.3, 1.9], l: [0, 0.25, 0], fov: 32 }} f={(tt) => {
  const f = k0(tt, 1.3, 7, 0.55);
  return <>
    <mesh position={[0, 0.04, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[1.5, 0.08, 0.9]} /></mesh>
    <FoodMesh tex="cooked" c="#ffffff" cc={0.6} p={[0, 0.2, 0]} s={[1.9, 0.75, 1.05]}><sphereGeometry args={[0.2, 48, 24]} /></FoodMesh>
    <mesh position={[0.5, 0.25, 0]} rotation-z={-0.3} castShadow><cylinderGeometry args={[0.03, 0.035, 0.25, 16]} /><Std c="#efe6d4" r={0.4} /></mesh>
    {f > 0.01 && <G p={[0, 0.08 + 1.0 * (1 - f), 0]}>
      {[1, -1].map((s) => <mesh key={s} position={[0, 0.17, s * 0.19]} rotation-x={s * 0.95} castShadow><planeGeometry args={[1.2, 0.52, 18, 8]} /><FoilMat /></mesh>)}
    </G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.8} x={1440} y={170} txt={`REST ${Math.max(0, 20 - Math.floor(ez(tt, 2.2, 6.5) * 20))} MIN`} col="#c9ced4" />} />;

// b14 · error 1: carne mojada. El repasador la seca: las gotas desaparecen y la piel queda mate (crocante)
export const RDryTowel: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.2, 1.65], l: [0, 0.22, 0], fov: 34 }} cam2={{ p: [-0.05, 1.05, 1.4], l: [0, 0.24, 0], fov: 32 }} f={(tt) => {
  const pat = ez(tt, 1.0, 3.6), tw = Math.max(0, Math.sin(tt * 4.5)) * (tt > 1 && tt < 3.6 ? 1 : 0);
  return <>
    <mesh position={[0, 0.04, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[1.4, 0.08, 0.85]} /></mesh>
    <G p={[0, 0.22, 0]} s={[1.6, 0.8, 1]}><mesh castShadow><sphereGeometry args={[0.2, 48, 24]} /><SkinMat pat={pat} gold={ez(tt, 3.8, 5.2)} /></mesh></G>
    {[...Array(22)].map((_, i) => { const a = rnd(i, 1) * Math.PI, b = rnd(i, 2) * Math.PI * 2, s = 1 - ez(tt, 1.0 + rnd(i, 3) * 2.4, 1.3 + rnd(i, 3) * 2.4); return s > 0.02 ? <mesh key={i} position={[0.32 * Math.sin(a) * Math.cos(b), 0.22 + 0.16 * Math.cos(a) * 0.9 + 0.01, 0.2 * Math.sin(a) * Math.sin(b)]} scale={s}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.6} transparent opacity={0.7} clearcoat={1} /></mesh> : null; })}
    {tt > 0.7 && tt < 4.2 && <G p={[0.15 * Math.sin(tt * 2), 0.42 + 0.12 * tw + 0.5 * ez(tt, 3.6, 4.2), 0]}>
      <Tex id="towel" w={256} h={256} draw={(g, w) => { g.fillStyle = "#f3efe6"; g.fillRect(0, 0, w, w); g.fillStyle = "rgba(179,36,27,.8)"; for (let i = 0; i < 8; i++) { g.fillRect(i * 32, 0, 14, w); g.fillRect(0, i * 32, w, 14); } }}>
        {(tx) => <mesh rotation-x={-Math.PI / 2} castShadow><planeGeometry args={[0.6, 0.4, 10, 6]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.95} side={THREE.DoubleSide} /></mesh>}
      </Tex>
    </G>}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.6} x={1420} y={150} txt="DRY = CRISP" col="#e4b23a" />} />;

// b15 · los fideos caseros de la tía Ruth: tiras de masa que se cuelgan del respaldo de la silla a secar
export const RNoodleChair: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} top="wood" cam={{ p: [0.5, 1.45, 2.9], l: [0, 0.68, 0], fov: 34 }} cam2={{ p: [0.4, 1.35, 2.5], l: [0, 0.72, 0], fov: 32 }} f={(tt) => <>
  {/* silla de cocina */}
  {[[-0.3, -0.25], [0.3, -0.25], [-0.3, 0.25], [0.3, 0.25]].map(([x, z], i) => <mesh key={i} position={[x, 0.25, z]} material={wood} castShadow><boxGeometry args={[0.05, 0.5, 0.05]} /></mesh>)}
  <mesh position={[0, 0.52, 0]} material={wood} castShadow><boxGeometry args={[0.7, 0.05, 0.6]} /></mesh>
  {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, 0.85, -0.27]} material={wood} castShadow><boxGeometry args={[0.05, 0.65, 0.05]} /></mesh>)}
  <mesh position={[0, 1.15, -0.27]} material={wood} castShadow><boxGeometry args={[0.72, 0.08, 0.06]} /></mesh>
  <mesh position={[0, 1.2, -0.27]}><boxGeometry args={[0.66, 0.004, 0.2]} /><Std c="#f6f3ec" r={0.95} /></mesh>
  {[...Array(10)].map((_, i) => { const k = k0(tt, 0.7 + i * 0.3, 7, 0.5); const x = -0.28 + i * 0.062; return k > 0.01 ? <G key={i} p={[x, 1.2 + 0.6 * (1 - k), -0.27]}>
    {[1, -1].map((s) => <mesh key={s} position={[0, -0.16, s * 0.045]} rotation-x={s * 0.08} castShadow><boxGeometry args={[0.035, 0.32, 0.004]} /><Std c="#ecd59c" r={0.8} /></mesh>)}
  </G> : null; })}
  {[...Array(30)].map((_, i) => { const ph = (tt * 0.2 + rnd(i, 1)) % 1; return <mesh key={i} position={[-0.4 + rnd(i, 2) * 0.8, 1.2 - ph * 1.1, -0.2 + rnd(i, 3) * 0.3]}><sphereGeometry args={[0.005, 6, 4]} /><meshBasicMaterial color="#fffaf0" transparent opacity={0.6 * Math.sin(ph * Math.PI)} /></mesh>; })}
</>} over={(tt) => <Cap tt={tt} at={0.6} x={460} y={150} txt="DRY OVERNIGHT" col="#ecd59c" />} />;

// b16 · el lomo con termómetro de reloj: la aguja se frena en 145 (zona jugosa) y no sigue a la zona gris
export const RDial145: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.25, 2.3], l: [0.1, 0.4, 0], fov: 34 }} cam2={{ p: [0.25, 1.1, 1.8], l: [0.25, 0.5, 0], fov: 32 }} f={(tt) => {
  const v = 100 + 45 * ez(tt, 0.9, 3.4);
  return <>
    <mesh position={[-0.1, 0.03, 0]} material={steel} receiveShadow><boxGeometry args={[1.5, 0.06, 0.8]} /></mesh>
    <FoodMesh tex="crust" c="#ffffff" cc={0.5} p={[-0.1, 0.2, 0]} r={[0, 0, Math.PI / 2]} s={1}><cylinderGeometry args={[0.16, 0.16, 1.05, 48]} /></FoodMesh>
    <G p={[0.25, 0.32, 0.05]} r={[0, 0, -0.25]}>
      <mesh position={[0, 0.2, 0]} material={steel}><cylinderGeometry args={[0.008, 0.008, 0.45, 12]} /></mesh>
      <G p={[0, 0.5, 0]} r={[0, 0, 0.25]} s={1.3}>
        <mesh rotation-x={Math.PI / 2} material={chrome}><cylinderGeometry args={[0.17, 0.17, 0.04, 48]} /></mesh>
        <Tex id="dial145" w={512} h={512} draw={(g, w) => { g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, w, w); const c = w / 2; const ang = (x: number) => -Math.PI * 1.25 + ((x - 100) / 100) * Math.PI * 1.5;
          g.lineWidth = 30; g.strokeStyle = "#3fae5b"; g.beginPath(); g.arc(c, c, 190, ang(140), ang(150)); g.stroke(); g.strokeStyle = "#9a9a96"; g.beginPath(); g.arc(c, c, 190, ang(160), ang(200)); g.stroke();
          g.fillStyle = "#1d2440"; g.font = `900 52px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; [100, 125, 150, 175, 200].forEach((x) => g.fillText(String(x), c + Math.cos(ang(x)) * 140, c + Math.sin(ang(x)) * 140)); }}>
          {(tx) => <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.16, 64]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.5} /></mesh>}
        </Tex>
        <mesh position={[0, 0, 0.03]} rotation-z={-(-Math.PI * 1.25 + ((v - 100) / 100) * Math.PI * 1.5) - Math.PI / 2}><mesh position={[0, 0.06, 0]}><boxGeometry args={[0.012, 0.12, 0.006]} /><Std c="#d42a1e" /></mesh></mesh>
        <mesh position={[0, 0, 0.035]}><cylinderGeometry args={[0.012, 0.012, 0.01, 16]} /><Std c="#1d2440" /></mesh>
      </G>
    </G>
  </>;
}} over={(tt) => <Cap tt={tt} at={3.2} x={460} y={150} txt="145° + REST" col="#3fae5b" />} />;

// b17 · cortar contra la veta: el cuchillo cruza las líneas del brisket y las fetas se separan de a una
const Grain: React.FC<{ p: V3; w: number }> = ({ p, w }) => {
  const tx = useTex("grain", 512, 256, (g, ww, hh) => { g.fillStyle = "#7a3f24"; g.fillRect(0, 0, ww, hh); for (let i = 0; i < 46; i++) { g.strokeStyle = i % 3 ? "rgba(60,25,12,.55)" : "rgba(170,100,70,.5)"; g.lineWidth = 2 + 2 * rnd(i, 1); g.beginPath(); const y = (i / 46) * hh; g.moveTo(0, y); g.bezierCurveTo(ww * 0.3, y + 6 * rnd(i, 2), ww * 0.7, y - 6, ww, y + 3); g.stroke(); } });
  return <mesh position={p} castShadow><boxGeometry args={[w, 0.16, 0.5]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.6} /></mesh>;
};
export const RGrainCut: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.3, 1.4], l: [0, 0.12, 0], fov: 34 }} cam2={{ p: [0.1, 1.15, 1.2], l: [0.05, 0.12, 0], fov: 32 }} f={(tt) => {
  const N = 7, cut = ez(tt, 1.0, 4.4) * N;
  return <>
    <mesh position={[0, 0.04, 0]} material={wood} castShadow receiveShadow><boxGeometry args={[1.6, 0.08, 0.9]} /></mesh>
    {[...Array(N + 1)].map((_, i) => { const done = i < Math.floor(cut); const w = i === N ? 0.48 : 0.075; const x = i === N ? 0.06 + 0.24 : -0.58 + i * 0.09; return <G key={i} p={[x - (done ? 0.06 + 0.02 * i : 0), 0.0, 0]} r={[0, 0, done ? 0.12 : 0]}><Grain p={[0, 0.16, 0]} w={w} /></G>; })}
    <G p={[-0.58 + Math.min(cut, N) * 0.09 + 0.045, 0.3 + 0.08 * Math.abs(Math.sin(tt * 6)), 0]} r={[0, Math.PI / 2, Math.PI / 2]}><Tool kind="knife" /></G>
  </>;
}} over={(tt) => <Cap tt={tt} at={1.4} x={1420} y={170} txt="ACROSS THE GRAIN" col="#e4b23a" />} />;

// b18 · el jamón con el cuadriculado en rombos: un clavo de olor en cada rombo, uno por uno, y la salsa de pasas encima
export const RDiamondScore: React.FC<P> = ({ t, h }) => {
  return <R3 t={t} h={h} cam={{ p: [0, 1.45, 2.0], l: [0, 0.35, 0], fov: 34 }} cam2={{ p: [0.15, 1.3, 1.6], l: [0, 0.38, 0], fov: 32 }} f={(tt) => {
    const sauce = ez(tt, 4.6, 6.0);
    return <>
      <mesh position={[0, 0.03, 0]} material={steel} receiveShadow><boxGeometry args={[1.5, 0.06, 1.0]} /></mesh>
      <Tex id="ham" w={1024} h={512} draw={(g, w, hh) => { g.fillStyle = "#e9b49a"; g.fillRect(0, 0, w, hh); g.strokeStyle = "rgba(150,70,40,.85)"; g.lineWidth = 9; for (let i = -8; i < 14; i++) { g.beginPath(); g.moveTo(i * 110, 0); g.lineTo(i * 110 + hh, hh); g.stroke(); g.beginPath(); g.moveTo(i * 110, hh); g.lineTo(i * 110 + hh, 0); g.stroke(); } }}>
        {(tx) => <mesh position={[0, 0.06, 0]} scale={[1.3, 1, 1]} castShadow><sphereGeometry args={[0.42, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial key={tx ? "t" : "n"} map={tx ?? undefined} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#c46a3a"), sauce * 0.6).getStyle()} roughness={lerp(0.6, 0.35, sauce)} clearcoat={sauce * 0.4} /></mesh>}
      </Tex>
      {[...Array(22)].map((_, i) => { const th = 0.3 + (i % 4) * 0.28, ph = (i / 22) * Math.PI * 2 * 3.0, a = 0.5 + i * 0.16, k = k0(tt, a, 10, 0.5); const r = 0.42;
        return k > 0.01 ? <G key={i} p={[1.3 * r * Math.sin(th) * Math.cos(ph), 0.06 + r * Math.cos(th), r * Math.sin(th) * Math.sin(ph)]} s={k}><mesh><sphereGeometry args={[0.018, 10, 8]} /><Std c="#3b2416" r={0.7} /></mesh></G> : null; })}
      {sauce > 0.01 && sauce < 0.7 && <Pour x={0} z={0} y0={1.1} y1={0.48} c="#7a2c14" w={0.025} />}
    </>;
  }} over={(tt) => <Cap tt={tt} at={1.0} x={1180} y={170} txt="1 CLOVE · EVERY DIAMOND" col="#e4b23a" />} />;
};

// b19 · la bolsita de papel de adentro del pollo: se vuelca y salen cuello, corazón, molleja e hígado
export const RGibletBag: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0.25, 1.15, 1.45], l: [0.25, 0.08, 0.15], fov: 34 }} cam2={{ p: [0.3, 1.05, 1.3], l: [0.3, 0.08, 0.15], fov: 32 }} f={(tt) => {
  const tip = ez(tt, 0.8, 1.5);
  const it = (i: number) => ez(tt, 1.4 + i * 0.25, 2.1 + i * 0.25);
  const P4: [string, V3, React.ReactNode][] = [
    ["NECK", [-0.35, 0, 0.25], <mesh rotation-z={Math.PI / 2} castShadow><capsuleGeometry args={[0.035, 0.22, 6, 12]} /><Std c="#d79a86" r={0.55} /></mesh>],
    ["HEART", [0.05, 0, 0.3], <mesh scale={[1, 1.3, 1]} castShadow><sphereGeometry args={[0.045, 24, 16]} /><Std c="#7a1e22" r={0.35} cc={0.6} /></mesh>],
    ["GIZZARD", [0.45, 0, 0.25], <G><mesh position={[-0.03, 0, 0]} castShadow><sphereGeometry args={[0.045, 20, 12]} /><Std c="#8e3a30" r={0.4} cc={0.5} /></mesh><mesh position={[0.04, 0, 0]} castShadow><sphereGeometry args={[0.042, 20, 12]} /><Std c="#8e3a30" r={0.4} cc={0.5} /></mesh></G>],
    ["LIVER", [0.85, 0, 0.2], <mesh scale={[1.6, 0.45, 1]} castShadow><sphereGeometry args={[0.06, 24, 16]} /><Std c="#4a1418" r={0.2} cc={1} /></mesh>],
  ];
  return <>
    <mesh position={[0.2, 0.03, 0.05]} material={wood} receiveShadow castShadow><boxGeometry args={[1.9, 0.06, 0.9]} /></mesh>
    <G p={[-0.6, 0.06, -0.1]} r={[0, 0.3, tip * -1.35]}>
      <Tex id="gbag" w={256} h={256} draw={(g, w) => { g.fillStyle = "#c9a878"; g.fillRect(0, 0, w, w); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(120,90,50,${0.15 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * w, rnd(i, 3) * w, 3, 3); } g.strokeStyle = "rgba(100,70,40,.4)"; g.lineWidth = 3; g.strokeRect(10, 10, w - 20, w - 20); }}>
        {(tx) => <mesh position={[0, 0.16, 0]} castShadow><boxGeometry args={[0.24, 0.32, 0.14]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.95} /></mesh>}
      </Tex>
    </G>
    {P4.map(([n, p, m], i) => { const k = it(i); return k > 0.01 ? <G key={n}>
      <G p={[lerp(-0.4, p[0], k), 0.1 + 0.18 * Math.sin(Math.PI * k), lerp(-0.05, p[2], k)]} s={2}>{m}</G>
      <Label3 txt={n} font="hand" col="#3a2a1a" w={0.5} p={[p[0], 0.064, p[2] + 0.2]} r={[-Math.PI / 2, 0, 0]} s={Math.min(1, k * 1.3)} />
    </G> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={3.2} x={1420} y={170} txt="THAT'S THE GRAVY" col="#e4b23a" />} />;

// b20 · Frank guardaba las puntas del pan toda la semana: seis puntas caen en la bolsa, una por día
export const ROldBread: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={CAM} cam2={{ p: [0.1, 1.3, 1.9], l: [0.1, 0.3, 0], fov: 32 }} f={(tt) => <>
  <Tex id="bbag" w={512} h={512} draw={(g, w) => { g.fillStyle = "#c9a878"; g.fillRect(0, 0, w, w); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,90,50,${0.12 * rnd(i, 1)})`; g.fillRect(rnd(i, 2) * w, rnd(i, 3) * w, 3, 3); } g.fillStyle = "#6a4a2a"; g.font = `700 90px ${HAND}`; g.textAlign = "center"; g.fillText("ends", w / 2, w * 0.6); }}>
    {(tx) => <G p={[0.35, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[0.5, 0.6, 0.32]} /><meshStandardMaterial key={tx ? "t" : "n"} map={tx ?? undefined} roughness={0.95} transparent opacity={0.98} /></mesh>
      <mesh position={[0, 0.601, 0]}><boxGeometry args={[0.46, 0.004, 0.28]} /><Std c="#2a1d10" r={1} /></mesh>
    </G>}
  </Tex>
  {[...Array(6)].map((_, i) => { const a = 0.6 + i * 0.55, k = ez(tt, a, a + 0.55); const x = lerp(-0.75, 0.35 + 0.08 * (rnd(i, 1) - 0.5), k), y = lerp(0.12, 0.62, k) + 0.35 * Math.sin(Math.PI * k) - (k >= 1 ? 0.15 + i * 0.012 : 0);
    return tt > a - 0.6 && (k < 1 || y > 0) ? <G key={i} p={[x, k >= 1 ? 0.5 : y, k >= 1 ? -0.0 : 0.0]} r={[0, 0, k * 2.5]} s={k >= 1 ? 0.0001 : 1}>
      <FoodMesh tex="crust" c="#ffffff" s={[1, 1, 1]}><cylinderGeometry args={[0.2, 0.2, 0.12, 32, 1, false, 0, Math.PI]} /></FoodMesh>
    </G> : null; })}
</>} over={(tt) => <Cap tt={tt} at={1.0} x={560} y={170} txt="OLD BREAD ONLY" col="#c98a45" />} />;

// b21 · el horno de Frank: abrir la puerta cuesta 50 grados (la aguja cae) y se vuelve a cerrar
export const ROvenGlass: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 0.75, 2.6], l: [0, 0.55, 0], fov: 34 }} cam2={{ p: [0, 0.75, 2.15], l: [0, 0.6, 0], fov: 32 }} f={(tt) => {
  const op = ez(tt, 1.2, 1.9) * (1 - ez(tt, 3.6, 4.3)), deg = 350 - 50 * ez(tt, 1.5, 3.4) + 50 * ez(tt, 4.5, 6.5);
  return <>
    <mesh position={[0, 0.55, -0.35]} castShadow><boxGeometry args={[1.5, 1.1, 0.7]} /><Std c="#ece6da" r={0.3} cc={1} /></mesh>
    <mesh position={[0, 0.45, -0.001]}><boxGeometry args={[1.1, 0.7, 0.02]} /><meshStandardMaterial color="#2a1408" emissive="#ff7a2a" emissiveIntensity={0.35 + 0.1 * (1 - op)} /></mesh>
    <FoodMesh tex="cooked" c="#ffffff" cc={0.6} p={[0, 0.42, -0.12]} s={[1.9, 1.2, 1.3]}><sphereGeometry args={[0.17, 40, 24]} /></FoodMesh>
    <G p={[0, 0.1, 0.02]} r={[op * 1.25, 0, 0]}>
      <mesh position={[0, 0.36, 0]} castShadow><boxGeometry args={[1.3, 0.72, 0.05]} /><Std c="#ece6da" r={0.5} cc={0.2} /></mesh>
      <mesh position={[0, 0.38, 0.027]}><boxGeometry args={[0.8, 0.42, 0.005]} /><meshPhysicalMaterial color="#1a0d06" roughness={0.1} clearcoat={0.3} transparent opacity={0.22} /></mesh>
      <mesh position={[0, 0.64, 0.07]} rotation-z={Math.PI / 2} material={chrome}><cylinderGeometry args={[0.018, 0.018, 0.9, 16]} /></mesh>
    </G>
    <G p={[0, 0.98, 0.0]}>
      <mesh rotation-x={Math.PI / 2} material={chrome}><cylinderGeometry args={[0.1, 0.1, 0.03, 40]} /></mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.09, 40]} /><Std c="#f7f4ec" r={0.5} /></mesh>
      <mesh position={[0, 0, 0.022]} rotation-z={-((deg - 250) / 200) * Math.PI * 1.4 + Math.PI * 0.7}><mesh position={[0, 0.04, 0]}><boxGeometry args={[0.01, 0.08, 0.004]} /><Std c="#d42a1e" /></mesh></mesh>
    </G>
  </>;
}} over={(tt) => <><Cap tt={tt} at={0.8} x={1640} y={130} txt={`${Math.round(350 - 50 * ez(tt, 1.5, 3.4) + 50 * ez(tt, 4.5, 6.5))}°`} col="#e4572e" /><Cap tt={tt} at={2.0} x={700} y={90} txt="−50° EVERY PEEK" col="#d42a1e" /></>} />;

// b22 · algo verde en el plato: la ramita de perejil y las arvejas caen junto al lomo
export const RParsley: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.05, 1.0], l: [0, 0.03, 0.05], fov: 34 }} cam2={{ p: [0.05, 0.95, 0.85], l: [0.03, 0.03, 0.05], fov: 32 }} f={(tt) => {
  const d = drop(tt, 1.0, 0.8);
  return <>
    <Plate rad={0.5} photo="lb_n04a" />
    {d.on && <G p={[0.25, 0.06 + d.y, 0.15]} r={[0, 0.6, 0]} s={1.6}>
      <mesh rotation-z={Math.PI / 2} position={[-0.06, 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.2, 8]} /><Std c="#5d8f2c" /></mesh>
      {[...Array(9)].map((_, i) => <mesh key={i} position={[0.04 + 0.05 * rnd(i, 1), 0.02 + 0.02 * rnd(i, 2), 0.06 * (rnd(i, 3) - 0.5)]} scale={[1, 0.5, 1]} castShadow><sphereGeometry args={[0.03, 12, 8]} /><Std c={i % 2 ? "#3f8a25" : "#2f7a1b"} r={0.55} /></mesh>)}
    </G>}
    {[...Array(12)].map((_, i) => { const a = 2.0 + i * 0.09, k = ez(tt, a, a + 0.5); return tt > a ? <mesh key={i} position={[-0.3 + 0.12 * Math.cos(i * 2.1) + (1 - k) * 0.8, 0.04 + 0.2 * Math.sin(Math.PI * k) * (1 - k), 0.25 + 0.08 * Math.sin(i * 2.1)]} castShadow><sphereGeometry args={[0.032, 16, 12]} /><Std c="#5aa832" r={0.35} cc={0.6} /></mesh> : null; })}
  </>;
}} over={(tt) => <Cap tt={tt} at={1.6} x={1440} y={170} txt="EYES FIRST" col="#3fae5b" />} />;

// b23 · CTA: la ficha de receta en blanco — «Sunday dinner: ___ / Made by: ___» — y la birome que espera tu respuesta
export const RMadeBy: React.FC<P> = ({ t, h }) => <R3 t={t} h={h} cam={{ p: [0, 1.8, 1.6], l: [0, 0.0, -0.05], fov: 34 }} cam2={{ p: [0.05, 1.55, 1.3], l: [0, 0.0, -0.05], fov: 32 }} f={(tt) => {
  const q = k0(tt, 2.2, 7, 0.5);
  return <>
    <Sheet id="card" w={1.3} h={0.82} th={0.004} p={[0, 0.003, 0]} r={[-Math.PI / 2, 0, -0.04]} draw={(g, w, hh) => {
      g.fillStyle = "#fbf8ef"; g.fillRect(0, 0, w, hh); g.fillStyle = "#c0392b"; g.fillRect(0, hh * 0.16, w, 4); g.fillStyle = "rgba(60,120,200,.35)"; for (let i = 1; i < 6; i++) g.fillRect(0, hh * 0.16 + i * hh * 0.15, w, 3);
      g.fillStyle = "#1d3f9e"; g.font = `700 76px ${HAND}`; g.fillText("Sunday dinner:", 50, hh * 0.42); g.fillText("Made by:", 50, hh * 0.72);
    }} />
    {q > 0.01 && <><Label3 txt="?" font="hand" col="#b3241b" w={0.5} p={[0.32, 0.006, -0.1]} r={[-Math.PI / 2, 0, 0]} s={q} /><Label3 txt="?" font="hand" col="#b3241b" w={0.5} p={[0.12, 0.006, 0.15]} r={[-Math.PI / 2, 0, 0]} s={q} /></>}
    <G p={[0.55, 0.03, 0.25]} r={[0, 0.6, 0.12]}><mesh rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.018, 0.018, 0.4, 16]} /><Std c="#1d3f9e" r={0.3} cc={1} /></mesh></G>
  </>;
}} />;

export const R3X: Record<string, React.FC<P>> = {
  stoolsFill: RStools, coldCones: RColdCones, noSalt: RNoSalt, looseRoll: RLooseRoll, secondSunday: RSecondSunday, offHeat: ROffHeat,
  boardRename: RBoardRename, temperYolk: RTemperYolk, threeQuarters: RThreeQuarters, glassBowl: RGlassBowl, gingersnaps: RGingersnaps,
  sauceOnTop: RSauceOnTop, searFast: RSearFast, restFoil: RRestFoil, dryTowel: RDryTowel, noodleChair: RNoodleChair, dial145: RDial145,
  grainCut: RGrainCut, diamondScore: RDiamondScore, gibletBag: RGibletBag, oldBread: ROldBread, ovenGlass: ROvenGlass, parsley: RParsley, madeBy: RMadeBy,
};
