// ohf8pf · componentes únicos 30-43: del vidrio empañado al 84 de Pennsylvania
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Tape } from "./okit";
import { Dr, Fish, Hygro, PI, TapeJar, numTex, sv } from "./sfkit";
import { Lying, Steam } from "./heroes_a1";

type P = React.FC<{ t: number; h: H }>;

// ---- EL BICHO EN EL VIDRIO: un dedo le dibuja la forma a la ventana empañada ----
export const HFogBug: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.3, 2.2, 2.4]}
  cam={{ at: [0, 0.64, 0], az: [-0.16, 0.1], el: [0.04, 0.0], r: [2.1, 1.9], fov: 32 }}>{(tt) => { const q = Math.round(eio(tt, 0.8, 3.6) * 16);
  const fog = tex.text(`sffog${q}`, 512, 640, (g) => { g.fillStyle = "rgba(226,234,236,.93)"; g.fillRect(0, 0, 512, 640); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(190,206,214,${0.4 * rn(i, 21)})`; g.beginPath(); g.arc(rn(i, 22) * 512, rn(i, 23) * 640, 3 + 9 * rn(i, 24), 0, PI * 2); g.fill(); }
    g.globalCompositeOperation = "destination-out"; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#000"; const pts: [number, number, number][] = []; for (let i = 0; i <= q; i++) { const u = i / 16; pts.push([lerp(120, 392, u), 170 + Math.sin(u * 12) * 10, lerp(14, 44, Math.sin(u * PI))]); }
    pts.forEach(([x, y, w], i) => { if (!i) return; g.lineWidth = w; g.beginPath(); g.moveTo(pts[i - 1][0], pts[i - 1][1]); g.lineTo(x, y); g.stroke(); }); if (q >= 16) { g.lineWidth = 6; [-1, 0, 1].forEach((k) => { g.beginPath(); g.moveTo(120, 170); g.lineTo(46, 170 + k * 46); g.stroke(); }); [-1, 1].forEach((k) => { g.beginPath(); g.moveTo(392, 170); g.lineTo(466, 170 + k * 58); g.stroke(); }); } g.globalCompositeOperation = "source-over"; });
  return <>
    <mesh position={[0, 0.64, -0.3]}><planeGeometry args={[1.6, 1.8]} /><meshBasicMaterial color="#8db37c" /></mesh>
    <RBox s={[1.3, 1.46, 0.05]} p={[0, 0.66, -0.2]} r={0.01}>{M.wood({ rx: 2, ry: 2, base: [226, 220, 204] })}</RBox>
    <mesh position={[0, 0.66, -0.17]}><planeGeometry args={[1.12, 1.26]} /><meshBasicMaterial color="#8db37c" /></mesh>
    <mesh position={[0, 0.66, -0.165]}><planeGeometry args={[1.12, 1.26]} /><meshBasicMaterial map={fog} transparent depthWrite={false} /></mesh>
    <RBox s={[1.12, 0.03, 0.04]} p={[0, 0.66, -0.15]} r={0.004}>{M.wood({ rx: 2, ry: 1, base: [226, 220, 204] })}</RBox>
    {Array.from({ length: 9 }, (_, i) => { const v = (tt * 0.32 + rn(i, 25)) % 1; return <Dr key={i} p={[-0.48 + rn(i, 26) * 0.96, lerp(1.24, 0.08, v), -0.15]} s={0.8} o={0.8} />; })}
    <Tape txt="SAME MESSAGE" p={[0, 0.22, 0.1]} w={0.6} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- TRES EN UNA: la caja de cartón se abre en comida, casa y agua ----
export const HCardThree: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" key1={[0.5, 2.4, 2.1]}
  cam={{ at: [0, 0.54, 0], az: [-0.24, 0.1], el: [0.24, 0.18], r: [2.5, 2.3], fov: 32 }}>{(tt) => { const sag = eio(tt, 2.8, 4.2), T = ["FOOD", "HOUSE", "WATER"];
  return <>
    <RBox s={[0.96, 0.74 - sag * 0.1, 0.78]} p={[0, 0.39 - sag * 0.05, 0]} rot={[0, 0, sag * 0.03]} r={0.02}><meshStandardMaterial color="#b98f5e" roughness={0.95} /></RBox>
    <RBox s={[0.97, 0.02, 0.1]} p={[0, 0.74 - sag * 0.1, 0]} r={0.003}><meshStandardMaterial color="#d6c090" roughness={0.9} /></RBox>
    <mesh position={[0, 0.1 + sag * 0.05, 0.394]}><planeGeometry args={[0.92, 0.2 + sag * 0.12]} /><meshBasicMaterial color="#3e2f1f" transparent opacity={0.55 * sag} depthWrite={false} /></mesh>
    {[-0.72, 0, 0.72].map((x, i) => <Tape key={i} txt={T[i]} col={i === 2 ? "#1f5a8c" : "#1c2a3a"} p={[x, 1.0, 0.3]} w={0.5} rot={[0, 0, (i - 1) * -0.06]} k={phys(tt, 0.7 + i * 0.85, 7, 0.45)} rev={cl((tt - 0.7 - i * 0.85) / 0.45)} />)}
    <Fish p={[0.62, 0.002, 0.62]} ry={2.6} s={1.8} run={tt * 0.6} />
  </>;
}}</Scene3D>;

// ---- LA FOTO EN LA BOLSA: entra mordida, la bolsa se cierra de punta a punta ----
export const HChewBag: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark" key1={[-0.4, 2.3, 1.8]}
  cam={{ at: [0, 0.12, 0.05], az: [0.18, -0.1], el: [1.0, 0.86], r: [1.28, 1.1], fov: 32 }}>{(tt) => { const sl = eio(tt, 0.6, 2.0), z = eio(tt, 2.4, 4.0);
  return <>
    <group position={[lerp(-1.3, 0, sl), 0.03, 0.06]}><mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.72, 0.5]} /><meshStandardMaterial map={tex.text("sfph", 384, 256, (g) => { g.fillStyle = "#c7ae88"; g.fillRect(0, 0, 384, 256); g.fillStyle = "#6f5a3e"; g.beginPath(); g.arc(150, 118, 34, 0, PI * 2); g.fill(); g.fillRect(114, 148, 72, 108); g.beginPath(); g.arc(246, 128, 28, 0, PI * 2); g.fill(); g.fillRect(216, 152, 60, 104); g.strokeStyle = "#efe6d0"; g.lineWidth = 14; g.strokeRect(0, 0, 384, 256); for (let i = 0; i < 30; i++) { g.fillStyle = "#e4d6b8"; g.beginPath(); g.arc(310 + rn(i, 1) * 74, rn(i, 2) * 256, 3 + rn(i, 3) * 11, 0, PI * 2); g.fill(); } })} roughness={0.85} /></mesh></group>
    <RBox s={[1.06, 0.03, 0.86]} p={[0, 0.03, 0]} r={0.008}><meshPhysicalMaterial color="#eef6f8" transparent opacity={0.22} roughness={0.05} clearcoat={1} depthWrite={false} /></RBox>
    <RBox s={[Math.max(0.001, z * 1.06), 0.022, 0.05]} p={[-0.53 + z * 0.53, 0.05, -0.4]} r={0.003}><meshStandardMaterial color="#3f7fb2" roughness={0.4} /></RBox>
    <RBox s={[0.08, 0.05, 0.08]} p={[-0.53 + z * 1.06, 0.07, -0.4]} r={0.008}>{M.matte({ col: "#3f7fb2" })}</RBox>
    <Tape txt="SEAL IT. FREEZE IT." p={[0.04, 0.26, 0.26]} w={0.68} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL CAMINO DE POLVO: soplado en el hueco del zócalo, el bicho lo cruza y se apaga ----
export const HPuffVoid: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[0.4, 2.2, 2.1]}
  cam={{ at: [0, 0.3, 0], az: [-0.24, 0.1], el: [0.18, 0.14], r: [1.5, 1.32], fov: 32 }}>{(tt) => { const d = eio(tt, 3.2, 4.8), f = eio(tt, 0.4, 1.8), x = lerp(-1.0, 0.25, eio(tt, 1.6, 4.3));
  return <>
    <RBox s={[3.4, 1.3, 0.05]} p={[0, 0.65, -0.44]} r={0.004}><meshStandardMaterial color="#3a2e24" roughness={1} /></RBox>
    {[-0.9, 0.9].map((a) => <RBox key={a} s={[0.09, 1.3, 0.3]} p={[a, 0.65, -0.3]} r={0.004}>{M.wood({ rx: 1, ry: 3, base: [136, 100, 62] })}</RBox>)}
    <RBox s={[3.4, 0.02, 0.32]} p={[0, 0.1, -0.28]} r={0.002}>{M.wood({ rx: 4, ry: 1, base: [118, 84, 52] })}</RBox>
    <mesh position={[0, 0.115, -0.26]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[1.7, 0.3]} /><meshBasicMaterial color="#ece8dc" transparent opacity={0.55 * f} depthWrite={false} /></mesh>
    <group position={[0.62, 0.42, -0.1]} rotation={[0, 0, 1.0]}><mesh castShadow><cylinderGeometry args={[0.1, 0.1, 0.34, 24]} /><meshStandardMaterial color="#f0ece2" roughness={0.45} /></mesh><mesh position={[0, 0.25, 0]}><coneGeometry args={[0.05, 0.2, 18]} /><meshStandardMaterial color="#c7c2b4" roughness={0.45} /></mesh></group>
    {Array.from({ length: 34 }, (_, i) => { const v = (tt * 0.6 + rn(i, 31)) % 1; return <mesh key={i} position={[lerp(0.44, -0.9, v), lerp(0.36, 0.14, v) + rn(i, 32) * 0.08, -0.24 + (rn(i, 33) - 0.5) * 0.2]}><sphereGeometry args={[0.012 + v * 0.016, 8, 6]} /><meshStandardMaterial color="#ece8dc" transparent opacity={0.5 * f * Math.sin(v * PI)} depthWrite={false} /></mesh>; })}
    <Fish p={[x, 0.122, -0.27]} s={2.1} dry={d} run={tt * (1 - d)} />
    <Tape txt="A FILM YOU CAN'T SEE" p={[0, 0.58, 0.1]} w={0.86} k={phys(tt, 2.8, 8, 0.45)} rev={cl((tt - 2.8) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL PRIMO MOTEADO: la válvula llora y la toalla seca se oscurece ----
export const HFirebratDrip: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" key1={[0.4, 2.2, 1.9]}
  cam={{ at: [0, 0.26, 0.1], az: [0.3, -0.12], el: [0.34, 0.28], r: [1.8, 1.6], fov: 32 }}>{(tt) => { const a = eio(tt, 2.6, 3.8), v = (tt * 0.7) % 1;
  return <>
    <mesh position={[-0.05, 0.62, -0.26]} castShadow><cylinderGeometry args={[0.46, 0.46, 1.1, 40]} />{M.steel({ col: "#a9adb0" })}</mesh>
    <mesh position={[-0.05, 0.3, 0.1]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.38, 20]} />{M.brass()}</mesh>
    <mesh position={[-0.05, 0.3, 0.3]}><cylinderGeometry args={[0.06, 0.06, 0.05, 6]} />{M.brass()}</mesh>
    <Dr p={[-0.05, lerp(0.27, 0.03, v * v), 0.32]} s={1.3} o={0.9} />
    <mesh position={[-0.05, 0.012, 0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.2, 30]} /><meshPhysicalMaterial color="#8fc3e2" transparent opacity={0.62} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
    <Fish brat p={[0.2, 0.013, 0.3]} ry={PI} s={1.8} run={tt * 0.3} />
    <Fish brat p={[-0.32, 0.013, 0.34]} ry={0.2} s={1.6} run={tt * 0.26 + 2} />
    <group position={[lerp(0.9, 0.24, eio(tt, 1.4, 2.6)), 0.3, 0.32]}><RBox s={[0.34, 0.26, 0.01]} r={0.004}><meshStandardMaterial color={a > 0.5 ? "#a59d8b" : "#f7f4ec"} roughness={1} /></RBox></group>
    <Tape txt="THE LITTLE DRIP" p={[0.34, 0.6, 0.34]} w={0.5} k={phys(tt, 2.0, 8, 0.45)} rev={cl((tt - 2.0) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL PAPEL RASPADO: por donde pasa, las flores se van como con lija ----
export const HGrazedPaper: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.4, 2.2, 2.2]}
  cam={{ at: [0, 0.62, 0], az: [0.2, -0.12], el: [0.05, 0.02], r: [1.5, 1.34], fov: 32 }}>{(tt) => { const u = eio(tt, 0.7, 4.3), q = Math.round(u * 14);
  const w = tex.text(`sfwp${q}`, 512, 512, (g) => { g.fillStyle = "#d8c7a0"; g.fillRect(0, 0, 512, 512); for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) { const x = c * 88 + (r % 2 ? 44 : 0), y = r * 88 + 40; g.fillStyle = "#8d4a3f"; for (let k = 0; k < 6; k++) { const a = k * PI / 3; g.beginPath(); g.ellipse(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 10, 6, a, 0, PI * 2); g.fill(); } g.fillStyle = "#3f5f3a"; g.beginPath(); g.arc(x, y, 6, 0, PI * 2); g.fill(); }
    g.fillStyle = "rgba(226,214,188,.95)"; for (let i = 0; i < 620; i++) { const x = (i / 620) * (q / 14) * 512; g.beginPath(); g.ellipse(x, 256 + Math.sin(i * 0.4) * 44 + (rn(i, 41) - 0.5) * 120, 3 + rn(i, 42) * 9, 2 + rn(i, 43) * 6, rn(i, 44) * 3, 0, PI * 2); g.fill(); } });
  return <>
    <mesh position={[0, 0.64, -0.1]}><planeGeometry args={[2.4, 1.36]} /><meshStandardMaterial map={w} roughness={0.85} /></mesh>
    <group position={[lerp(-1.18, 1.18, u), 0.64 + Math.sin(u * 28) * 0.1, -0.08]}><Lying><Fish s={2.2} run={tt} /></Lying></group>
    <Tape txt="AFTER THE PASTE" p={[0, 0.3, 0.1]} w={0.62} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- DE LA BOLSA AL FRASCO: la harina se vuelca y la tapa gira hasta cerrar ----
export const HPantryJars: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" key1={[-0.4, 2.3, 2]}
  cam={{ at: [0, 0.68, 0], az: [-0.2, 0.1], el: [0.14, 0.09], r: [1.8, 1.6], fov: 32 }}>{(tt) => { const tp = eio(tt, 0.5, 1.4) * (1 - eio(tt, 2.6, 3.2)), lev = eio(tt, 1.0, 2.8), lid = phys(tt, 3.2, 7, 0.55), spin = eio(tt, 3.4, 4.3) * 7;
  return <>
    <RBox s={[3, 0.06, 0.56]} p={[0, 0.34, 0.04]} r={0.008}>{M.wood({ rx: 3, ry: 1, base: [152, 112, 72] })}</RBox>
    <group position={[-0.5, 0.37, 0.05]} rotation={[0, 0, -tp * 1.15]}><RBox s={[0.34, 0.52, 0.24]} p={[0, 0.26, 0]} r={0.02}><meshStandardMaterial color="#c9a673" roughness={1} /></RBox><mesh position={[0, 0.27, 0.122]}><planeGeometry args={[0.3, 0.18]} /><meshBasicMaterial map={numTex("FLOUR", "#c9a673", "#3a2a18", 62)} /></mesh></group>
    {Array.from({ length: 40 }, (_, i) => { const v = (tt * 1.2 + rn(i, 51)) % 1; return tp > 0.5 ? <mesh key={i} position={[lerp(-0.14, 0.32, v) + (rn(i, 52) - 0.5) * 0.06, lerp(0.92, 0.42 + lev * 0.3, v * v), 0.05 + (rn(i, 53) - 0.5) * 0.08]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#f1e7cf" /></mesh> : null; })}
    <mesh position={[0.34, 0.38 + 0.28, 0.05]}><cylinderGeometry args={[0.2, 0.2, 0.56, 36, 1, true]} /><meshPhysicalMaterial color="#eef6f8" transparent opacity={0.28} roughness={0.06} clearcoat={1} side={2} depthWrite={false} /></mesh>
    <mesh position={[0.34, 0.38 + 0.26 * lev, 0.05]}><cylinderGeometry args={[0.185, 0.185, sv(0.52 * lev), 34]} /><meshStandardMaterial color="#f1e7cf" roughness={0.95} /></mesh>
    <group position={[0.34, lerp(2.0, 0.96, lid), 0.05]} rotation={[0, spin, 0]}><mesh><cylinderGeometry args={[0.215, 0.215, 0.05, 36]} />{M.steel({ col: "#b8bcbf" })}</mesh><mesh position={[0.15, 0.028, 0]}><boxGeometry args={[0.1, 0.006, 0.02]} /><meshStandardMaterial color="#6f7377" /></mesh></group>
    <Tape txt="GOOD LIDS" p={[-0.56, 0.98, 0.22]} w={0.44} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA HOJA DE LAUREL: a la olla, que para eso está; el cedro rebota en la pared mojada ----
export const HBayLeaf: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" key1={[0.4, 2.3, 2]}
  cam={{ at: [0, 0.34, 0], az: [0.2, -0.1], el: [0.3, 0.22], r: [1.64, 1.44], fov: 32 }}>{(tt) => { const y = lerp(1.5, 0.42, eio(tt, 0.6, 2.2)), w = 1 - eio(tt, 2.2, 2.6);
  return <>
    <mesh position={[-0.28, 0.21, 0]} castShadow><cylinderGeometry args={[0.36, 0.32, 0.4, 44, 1, true]} />{M.steel({ col: "#a9adb0" })}</mesh>
    <mesh position={[-0.28, 0.36, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.35, 40]} /><meshStandardMaterial color="#c88a42" roughness={0.3} /></mesh>
    {[-1, 1].map((k) => <mesh key={k} position={[-0.28 + k * 0.4, 0.34, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.014, 10, 24]} />{M.steel({ col: "#a9adb0" })}</mesh>)}
    <Steam tt={tt} p={[-0.28, 0.4, 0]} n={18} w={0.3} h={0.6} />
    <group position={[-0.28 + Math.sin(tt * 2.2) * 0.1 * w, y + 0.02, 0]} rotation={[-PI / 2 + Math.sin(tt * 3) * 0.3 * w, 0, 0.5]} scale={[1, 2.1, 1]}><mesh><circleGeometry args={[0.07, 18]} /><meshStandardMaterial color="#5d7a3e" roughness={0.7} side={2} /></mesh></group>
    <RBox s={[0.04, 0.72, 0.64]} p={[0.62, 0.36, 0]} r={0.006}><meshStandardMaterial color="#a8b8c2" roughness={0.9} /></RBox>
    <RBox s={[0.18, 0.1, 0.1]} p={[lerp(0.2, 0.5, Math.abs(Math.sin(tt * 1.4))), 0.09, 0.05]} rot={[0, tt * 0.4, 0]} r={0.008}>{M.wood({ rx: 1, ry: 1, base: [168, 88, 62] })}</RBox>
    <Tape txt="FOR SOUP" p={[-0.28, 0.68, 0.14]} w={0.42} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.5)} />
    <Tape txt="WALL'S STILL WET" col="#1f5a8c" p={[0.34, 0.5, 0.16]} w={0.6} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA ESCALERA DE TRES PELDAÑOS: en cada día sube un objeto ----
export const HLadderPlan: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" key1={[0.4, 2.6, 2.3]}
  cam={{ at: [0, 0.72, 0], az: [0.24, -0.12], el: [0.1, 0.07], r: [2.46, 2.22], fov: 32 }}>{(tt) => { const K = (i: number) => phys(tt, 0.7 + i * 1.3, 7, 0.55), Y = [0.42, 0.82, 1.22], D = ["DAY 1", "DAY 2", "DAY 3"];
  return <>
    {[-0.55, 0.55].map((x) => <RBox key={x} s={[0.07, 1.5, 0.07]} p={[x, 0.75, 0]} r={0.008}>{M.wood({ rx: 1, ry: 3, base: [172, 132, 88] })}</RBox>)}
    {Y.map((y) => <RBox key={y} s={[1.14, 0.05, 0.22]} p={[0, y, 0.02]} r={0.006}>{M.wood({ rx: 2, ry: 1, base: [172, 132, 88] })}</RBox>)}
    <Hygro p={[-0.2, lerp(2.3, Y[0] + 0.03, K(0)), 0.02]} s={1.1} val="65" />
    <TapeJar p={[0.24, lerp(2.3, Y[0] + 0.03, K(0)), 0.02]} r={0.08} h={0.2} bread={0} />
    <RBox s={[0.3, 0.3, 0.008]} p={[0, lerp(2.5, Y[1] + 0.18, K(1)), 0.02]} r={0.002}>{M.steel({ col: "#d7dadc" })}</RBox>
    <RBox s={[0.38, 0.02, 0.28]} p={[0, lerp(2.7, Y[2] + 0.045, K(2)), 0.02]} r={0.003}><meshStandardMaterial map={tex.paper()} roughness={0.9} /></RBox>
    {Y.map((y, i) => <Tape key={i} txt={D[i]} p={[0.9, y + 0.02, 0.1]} w={0.32} k={phys(tt, 0.9 + i * 1.3, 8, 0.45)} rev={cl((tt - 0.9 - i * 1.3) / 0.4)} />)}
  </>;
}}</Scene3D>;

// ---- DE VARIOS A NINGUNO: el cartel de frascos baja y el higrómetro se acomoda ----
export const HFewToNone: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[-0.4, 2.3, 2]}
  cam={{ at: [0, 0.6, 0], az: [-0.16, 0.1], el: [0.14, 0.1], r: [2.1, 1.9], fov: 32 }}>{(tt) => { const V = ["7", "3", "1", "0"], i = Math.min(3, Math.floor(cl((tt - 0.7) / 3.2) * 4)), hu = Math.round(lerp(68, 48, eio(tt, 0.7, 3.9)));
  return <>
    <RBox s={[3.4, 1.8, 0.05]} p={[0, 0.9, -0.5]} r={0.004}><meshStandardMaterial color="#ded6c2" roughness={0.9} /></RBox>
    <RBox s={[0.9, 0.9, 0.03]} p={[-0.48, 0.74, -0.46]} r={0.008}><meshStandardMaterial map={numTex(V[i], i === 3 ? "#d7ecd8" : "#efeadb", i === 3 ? "#1d6a3a" : "#2a2119", 200)} roughness={0.8} /></RBox>
    <TapeJar p={[-0.48, 0.02, 0.12]} r={0.13} h={0.26} bread={0} />
    <group position={[0.54, 0, 0]}><Hygro p={[0, 0.62, -0.42]} s={2.4} val={String(hu)} col={hu <= 50 ? "#1d6a3a" : "#a2221a"} /></group>
    <Tape txt="30 DAYS. NONE." col="#1d6a3a" p={[0.54, 0.34, 0.16]} w={0.62} k={phys(tt, 3.8, 8, 0.45)} rev={cl((tt - 3.8) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL FRASCO BRÚJULA: gira en el piso y se clava apuntando a la mancha ----
export const HJarPoints: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" key1={[0.5, 2.3, 2]}
  cam={{ at: [0, 0.24, 0], az: [0.22, -0.14], el: [0.56, 0.46], r: [1.76, 1.56], fov: 32 }}>{(tt) => { const a = lerp(9, 0.56, 1 - Math.pow(1 - cl((tt - 0.5) / 3.2), 3)), g = eio(tt, 3.3, 4.1);
  return <>
    <RBox s={[3.2, 1.0, 0.06]} p={[0, 0.5, -0.8]} r={0.004}><meshStandardMaterial color="#e7e2d5" roughness={0.8} /></RBox>
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0.66 + (rn(i, 71) - 0.5) * 0.46, 0.14 + rn(i, 72) * 0.44, -0.765]} scale={[1, 0.9, 0.02]}><sphereGeometry args={[0.05 + rn(i, 73) * 0.08, 10, 8]} /><meshStandardMaterial color="#4e5a44" transparent opacity={0.3 + 0.5 * g} /></mesh>)}
    <TapeJar p={[-0.3, 0.012, 0.1]} r={0.14} h={0.3} num="3" bread={0} />
    <group position={[-0.3, 0.33, 0.1]} rotation={[0, a, 0]}><mesh rotation={[0, 0, -PI / 2]} position={[0.2, 0, 0]}><coneGeometry args={[0.07, 0.34, 20]} /><meshStandardMaterial color="#b3261e" roughness={0.45} /></mesh><mesh rotation={[0, 0, -PI / 2]} position={[-0.08, 0, 0]}><cylinderGeometry args={[0.026, 0.026, 0.34, 14]} /><meshStandardMaterial color="#b3261e" roughness={0.45} /></mesh></group>
    <Tape txt="IT'S POINTING AT WATER" p={[0.1, 0.66, 0.14]} w={0.86} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- PARED DE POR MEDIO: la biblioteca en 38, el placard en 71 ----
export const HTwinRooms: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[0.4, 2.4, 2.3]}
  cam={{ at: [0, 0.54, 0], az: [0.14, -0.1], el: [0.14, 0.1], r: [2.6, 2.36], fov: 32 }}>{(tt) => { const a = Math.round(38 * eio(tt, 0.5, 1.7)), b = Math.round(71 * eio(tt, 1.9, 3.3)), p = eio(tt, 3.3, 4.2);
  return <>
    <RBox s={[3, 1.3, 0.05]} p={[0, 0.65, -0.5]} r={0.003}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[0.08, 1.3, 1.0]} p={[0, 0.65, -0.02]} r={0.004}><meshStandardMaterial color="#c8bfa6" roughness={0.9} /></RBox>
    {Array.from({ length: 36 }, (_, i) => <RBox key={i} s={[0.05, 0.3 + rn(i, 81) * 0.1, 0.1]} p={[-1.12 + (i % 18) * 0.06, i < 18 ? 0.22 : 0.68, -0.4]} r={0.004}><meshStandardMaterial color={["#7a3e2a", "#2f4a58", "#6a6236", "#8d6a3a"][i % 4]} roughness={0.7} /></RBox>)}
    {[0.05, 0.5].map((y) => <RBox key={y} s={[1.2, 0.03, 0.2]} p={[-0.72, y, -0.38]} r={0.004}>{M.wood({ rx: 2, ry: 1, base: [120, 84, 52] })}</RBox>)}
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.3, 0.7 - i * 0.06, 0.03]} p={[0.46 + i * 0.26, 0.74, -0.38]} r={0.004}><meshStandardMaterial color={["#54483a", "#3a3f46", "#6a5840"][i]} roughness={1} /></RBox>)}
    <mesh position={[0.76, 0.56, -0.45]}><circleGeometry args={[0.42 * p + 0.001, 36]} /><meshBasicMaterial color="#6fb5e6" transparent opacity={0.34} depthWrite={false} /></mesh>
    <Hygro p={[-0.7, 0.04, 0.2]} s={2.1} val={String(a)} col="#1d6a3a" />
    <Hygro p={[0.72, 0.04, 0.2]} s={2.1} val={String(b)} col="#a2221a" />
    <Tape txt="ONE WALL APART" p={[0, 1.08, 0.64]} w={0.66} k={phys(tt, 3.3, 8, 0.45)} rev={cl((tt - 3.3) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- GRACIAS: el bicho se para en el felpudo, dobla la cabeza y se va ----
export const HThankYou: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none" key1={[-0.3, 2.2, 1.9]}
  cam={{ at: [0, 0.14, 0], az: [0.3, -0.1], el: [0.3, 0.22], r: [1.0, 0.88], fov: 32 }}>{(tt) => { const bow = eio(tt, 1.6, 2.2) * (1 - eio(tt, 3.0, 3.5)), x = eio(tt, 4.3, 5.7);
  return <>
    <RBox s={[0.72, 0.012, 0.46]} p={[0, 0.008, 0]} r={0.003}><meshStandardMaterial color="#7c3f2a" roughness={1} /></RBox>
    <group position={[-0.02 + x * 1.5, 0.016, 0]} rotation={[0, 0, -bow * 0.35]}><Fish s={2.5} run={x > 0 ? tt : tt * 0.1} /></group>
    <Tape txt="SAY THANK YOU" p={[0, 0.36, -0.02]} w={0.5} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL TANQUE DE AIRE BAJA: cuando pasa la raya del 50 el bicho agarra sus cosas ----
export const HBelow50: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark" key1={[0.4, 2.4, 2.2]}
  cam={{ at: [0, 0.6, 0], az: [-0.2, 0.1], el: [0.12, 0.08], r: [2.5, 2.3], fov: 32 }}>{(tt) => { const v = lerp(74, 44, eio(tt, 0.5, 2.8)), Y = 1.1 * v / 100, x = eio(tt, 3.1, 4.6);
  return <>
    <RBox s={[1.5, 1.14, 0.5]} p={[0, 0.6, -0.1]} r={0.01}><meshPhysicalMaterial color="#eef6f8" transparent opacity={0.2} roughness={0.06} clearcoat={1} depthWrite={false} /></RBox>
    <RBox s={[1.46, Y, 0.46]} p={[0, 0.04 + Y / 2, -0.1]} r={0.006}><meshPhysicalMaterial color="#79b8e1" transparent opacity={0.45} roughness={0.15} depthWrite={false} /></RBox>
    <RBox s={[1.56, 0.012, 0.52]} p={[0, 0.04 + 0.55, -0.08]} r={0.002}><meshBasicMaterial color="#b3261e" /></RBox>
    <group position={[lerp(-0.1, 1.05, x), 0.02, 0.26]}><Fish s={2.0} run={x > 0 ? tt : tt * 0.2} /><RBox s={[0.1, 0.07, 0.03]} p={[0.0, 0.08, 0]} r={0.008}><meshStandardMaterial color="#7a4e2c" roughness={0.65} /></RBox></group>
    <Hygro p={[-0.62, 0.02, 0.3]} s={1.3} val={String(Math.round(v))} col={v <= 50 ? "#1d6a3a" : "#a2221a"} />
    <Tape txt="UNDER 50" col="#b3261e" p={[0.72, 0.84, 0.2]} w={0.4} k={phys(tt, 1.4, 8, 0.45)} rev={cl((tt - 1.4) / 0.4)} />
  </>;
}}</Scene3D>;

// ---- EL RÉCORD: el 84 en una cinta dorada, y la silla vacía para el que lo gane ----
export const HTop84: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[0.3, 2.4, 2]}
  cam={{ at: [0, 0.42, 0], az: [0.22, -0.14], el: [0.16, 0.1], r: [1.72, 1.54], fov: 32 }}>{(tt) => { const n = Math.round(84 * eio(tt, 0.5, 2.4)), r = phys(tt, 2.5, 7, 0.5);
  return <>
    <RBox s={[0.9, 0.2, 0.6]} p={[0, 0.1, 0]} r={0.008}>{M.wood({ rx: 2, ry: 1, base: [132, 94, 60] })}</RBox>
    <Hygro p={[0, 0.2, 0.02]} s={2.8} val={String(n)} col="#a2221a" />
    <group position={[0.46, 0.72, 0.16]} scale={sv(r)} rotation={[0, 0, 0.1]}><mesh><circleGeometry args={[0.15, 30]} /><meshStandardMaterial color="#d9a93a" metalness={0.6} roughness={0.35} /></mesh><mesh position={[0, 0, 0.002]}><planeGeometry args={[0.2, 0.2]} /><meshBasicMaterial map={numTex("1", "#d9a93a", "#3a2a10", 170)} /></mesh></group>
    <Tape txt="BEAT THIS NUMBER" p={[0, 0.98, 0.14]} w={0.68} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL DORMITORIO DE LA COSTURA: el papel se despega y detrás hay cama tendida; baja la brocha y lo cierra ----
export const HSeamBed: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark" key1={[0.4, 2.2, 2.3]}
  cam={{ at: [0.12, 0.6, 0], az: [-0.24, 0.12], el: [0.08, 0.05], r: [1.1, 0.96], fov: 32 }}>{(tt) => { const op = eio(tt, 0.5, 1.5) * (1 - eio(tt, 3.3, 4.2)), br = eio(tt, 2.5, 3.3) * (1 - eio(tt, 4.3, 4.9));
  return <>
    <mesh position={[0, 0.62, -0.1]}><planeGeometry args={[2.6, 1.5]} /><meshStandardMaterial color="#c9b78e" roughness={0.85} /></mesh>
    <mesh position={[0.16, 0.62, -0.095]}><planeGeometry args={[0.36, 0.96]} /><meshStandardMaterial color="#3a2c20" roughness={1} /></mesh>
    {op > 0.03 && <group><RBox s={[0.24, 0.024, 0.05]} p={[0.16, 0.42, -0.07]} r={0.008}><meshStandardMaterial color="#f1ece0" roughness={0.9} /></RBox>
    <RBox s={[0.17, 0.016, 0.05]} p={[0.19, 0.44, -0.07]} r={0.006}><meshStandardMaterial color="#b3261e" roughness={0.9} /></RBox>
    <Fish p={[0.15, 0.462, -0.07]} s={1.2} run={tt * 0.12} /></group>}
    <mesh position={[0.16, 0.76, -0.085]}><circleGeometry args={[0.016, 12]} /><meshBasicMaterial color="#ffc97a" /></mesh>
    <group position={[-0.02, 0.62, -0.08]} rotation={[0, -op * 1.25, 0]}><mesh position={[0.2, 0, 0]}><planeGeometry args={[0.4, 1.0]} /><meshStandardMaterial map={tex.paper(1, 2)} color="#d8c7a0" roughness={0.85} side={2} /></mesh></group>
    <group position={[lerp(1.2, 0.3, br), 0.78 - br * 0.2, 0.08]} rotation={[0, 0, 1.1]}><RBox s={[0.05, 0.42, 0.03]} p={[0, 0.2, 0]} r={0.008}>{M.wood({ rx: 1, ry: 2, base: [176, 132, 84] })}</RBox><RBox s={[0.1, 0.1, 0.03]} p={[0, -0.05, 0]} r={0.006}><meshStandardMaterial color="#e5dcc4" roughness={1} /></RBox></group>
    <Tape txt="GLUE IT SHUT" p={[0.14, 0.46, 0.14]} w={0.5} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.5)} />
  </>;
}}</Scene3D>;

export const _unused = [TapeJar];
