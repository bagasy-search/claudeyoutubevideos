// ohf8pf · componentes únicos 1-16: del pececillo-aguja al que corre a su casa
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Tape } from "./okit";
import { CutHouse, Dr, Fish, Hygro, PI, TapeJar, V3, numTex, sv } from "./sfkit";

type P = React.FC<{ t: number; h: H }>;
export const Steam: React.FC<{ tt: number; p: V3; n?: number; w?: number; h?: number; col?: string; o?: number; dir?: [number, number] }> = ({ tt, p, n = 16, w = 0.12, h = 0.6, col = "#f2f2ee", o = 0.34, dir = [0, 0] }) => <group position={p}>
  {Array.from({ length: n }, (_, i) => { const u = (tt * 0.55 + rn(i, 7)) % 1, r = 0.02 + u * 0.06; return <mesh key={i} position={[(rn(i, 8) - 0.5) * w * (1 + u) + dir[0] * u, u * h, (rn(i, 9) - 0.5) * w + dir[1] * u]}><sphereGeometry args={[r, 12, 9]} /><meshStandardMaterial color={col} roughness={1} transparent opacity={o * Math.sin(u * PI)} depthWrite={false} /></mesh>; })}
</group>;
export const Lying: React.FC<{ children: React.ReactNode }> = ({ children }) => <group rotation={[PI / 2, 0, 0]}>{children}</group>;

const dialTx = () => tex.text("sfdial", 512, 512, (g) => {
  g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 512, 512); g.lineWidth = 34; g.lineCap = "butt";
  const arc = (a: number, b: number, c: string) => { g.strokeStyle = c; g.beginPath(); g.arc(256, 256, 196, a, b); g.stroke(); };
  arc(PI * 0.82, PI * 1.28, "#c8a65a"); arc(PI * 1.28, PI * 1.6, "#7da07a"); arc(PI * 1.6, PI * 2.18, "#3f7fb2");
  g.strokeStyle = "#2a2119"; g.lineWidth = 4; for (let i = 0; i <= 26; i++) { const a = PI * 0.82 + (i / 26) * PI * 1.36; g.beginPath(); g.moveTo(256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); g.lineTo(256 + Math.cos(a) * 172, 256 + Math.sin(a) * 172); g.stroke(); }
  g.fillStyle = "#2a2119"; g.font = "800 50px Georgia, serif"; g.textAlign = "center"; g.fillText("DRY", 118, 380); g.fillStyle = "#1f5a8c"; g.fillText("WET", 394, 380);
});

// ---- EL BICHO ES LA AGUJA: el pececillo clavado en el centro de un reloj gira de SECO a MOJADO ----
export const HNeedleBug: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" key1={[0.4, 2, 2.4]}
  cam={{ at: [0, 0.5, 0], az: [-0.2, 0.12], el: [0.1, 0.05], r: [2.0, 1.8], fov: 32 }}>{(tt) => { const a = lerp(PI * 1.02, PI * 0.16, phys(tt, 1.0, 2.2, 0.32)) + Math.sin(tt * 3) * 0.015;
  return <>
    <mesh position={[0, 0.56, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.43, 0.43, 0.04, 80]} />{M.brass()}</mesh>
    <mesh position={[0, 0.56, 0.021]}><circleGeometry args={[0.4, 70]} /><meshStandardMaterial map={dialTx()} roughness={0.55} /></mesh>
    <group position={[0, 0.56, 0.04]} rotation={[0, 0, a]}><Lying><Fish p={[0.13, 0, 0]} s={1.7} run={tt * 0.15} /></Lying></group>
    <mesh position={[0, 0.56, 0.05]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.03, 20]} />{M.brass()}</mesh>
    <Tape txt="A LIVING GAUGE" p={[0, 0.1, 0.2]} w={0.56} k={phys(tt, 3.2, 8, 0.45)} rev={cl((tt - 3.2) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- BEBE DEL AIRE: las gotitas flotan hacia el cuerpo y el lomo se enciende ----
export const HAirDrink: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="dark" key1={[-0.5, 2.2, 1.7]}
  cam={{ at: [0, 0.16, 0], az: [0.32, -0.12], el: [0.34, 0.26], r: [1.2, 1.02], fov: 32 }}>{(tt) => <>
  {Array.from({ length: 70 }, (_, i) => { const a = rn(i, 21) * PI * 2, R = 0.2 + rn(i, 22) * 0.55, Y = 0.08 + rn(i, 23) * 0.52, u = (tt * 0.42 + rn(i, 24)) % 1, k = u * u * (3 - 2 * u); return <Dr key={i} p={[lerp(Math.cos(a) * R, 0, k), lerp(Y, 0.04, k), lerp(Math.sin(a) * R, 0, k)]} s={sv(0.5 + 0.55 * (1 - k))} o={0.75 * Math.sin(u * PI)} />; })}
  <Fish s={2.9} run={tt * 0.25} />
  <Tape txt="IT DRINKS THE AIR" p={[0, 0.33, 0.1]} w={0.6} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
</>}</Scene3D>;

// ---- TRES ESPÍAS: la casa abierta recibe tres higrómetros; el del sótano marca lo peor ----
export const HThreeHygros: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" key1={[0.4, 3, 3]}
  cam={{ at: [0, 1.0, 0], az: [0.2, -0.12], el: [0.12, 0.08], r: [3.7, 3.45], fov: 32 }}>{(tt) => { const Y = (a: number, y: number) => lerp(3.4, y, phys(tt, a, 7, 0.55)), n = (a: number, v: number) => String(Math.round(v * eio(tt, a + 0.5, a + 2)));
  return <>
    <CutHouse />
    <Hygro p={[-0.45, Y(0.6, 0.5), -0.12]} s={1.5} val={n(0.6, 58)} />
    <Hygro p={[0.15, Y(1.3, 0.04), -0.08]} s={1.5} val={n(1.3, 72)} col="#a2221a" />
    <Hygro p={[0.55, Y(2.0, 0.97), -0.12]} s={1.5} val={n(2.0, 65)} />
    <Tape txt="THREE SPIES" p={[0, 1.66, 0.5]} w={0.95} k={phys(tt, 2.8, 8, 0.45)} rev={cl((tt - 2.8) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA PUERTA DEL BICHO: una puertita en el zócalo, el 70 arriba; se abre y entra la fila ----
export const HFrontDoor: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" key1={[0.6, 2.2, 2]}
  cam={{ at: [0, 0.32, 0], az: [-0.32, 0.14], el: [0.22, 0.16], r: [1.42, 1.22], fov: 32 }}>{(tt) => { const o = eio(tt, 1.4, 2.3);
  return <>
    <RBox s={[3.6, 1.4, 0.06]} p={[0, 0.7, -0.34]} r={0.004}><meshStandardMaterial color="#d7ceb5" roughness={0.9} /></RBox>
    <RBox s={[3.6, 0.26, 0.05]} p={[0, 0.13, -0.29]} r={0.01}><meshStandardMaterial color="#efeadb" roughness={0.55} /></RBox>
    <mesh position={[0, 0.17, -0.262]}><planeGeometry args={[0.22, 0.34]} /><meshBasicMaterial color="#0a0806" /></mesh>
    <group position={[-0.11, 0.17, -0.258]} rotation={[0, -o * 1.7, 0]}><RBox s={[0.22, 0.34, 0.012]} p={[0.11, 0, 0]} r={0.002}>{M.wood({ rx: 1, ry: 2, base: [132, 90, 56] })}</RBox><mesh position={[0.18, 0, 0.01]}><sphereGeometry args={[0.009, 10, 8]} />{M.brass()}</mesh></group>
    <Hygro p={[0, 0.5, -0.29]} s={1.05} val="70" col="#a2221a" />
    {[0, 1, 2, 3].map((i) => { const u = cl((tt - 2.2 - i * 0.55) / 1.5), z = lerp(0.55, -0.22, u); return u < 1 ? <Fish key={i} p={[0.02 * (i % 2), 0.002, z]} ry={PI / 2} s={1.8} run={tt + i} /> : null; })}
    <Tape txt="ITS FRONT DOOR" p={[0.42, 0.44, 0]} w={0.46} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3.0) / 0.6)} />
  </>;
}}</Scene3D>;

const fossilTx = () => tex.text("sffos", 512, 256, (g) => {
  g.fillStyle = "#b8a98e"; g.fillRect(0, 0, 512, 256); for (let i = 0; i < 800; i++) { g.fillStyle = `rgba(70,60,44,${0.1 * rn(i, 3)})`; g.fillRect(rn(i, 1) * 512, rn(i, 2) * 256, 3, 2); }
  g.fillStyle = "#6f6047"; g.beginPath(); g.ellipse(250, 158, 86, 40, 0, 0, PI * 2); g.fill();
  g.strokeStyle = "#6f6047"; g.lineCap = "round"; g.lineWidth = 19; g.beginPath(); g.moveTo(190, 148); g.quadraticCurveTo(130, 110, 104, 50); g.stroke();
  g.lineWidth = 15; g.beginPath(); g.moveTo(320, 160); g.quadraticCurveTo(410, 170, 470, 134); g.stroke();
  g.lineWidth = 20; [190, 228, 278, 312].forEach((x) => { g.beginPath(); g.moveTo(x, 186); g.lineTo(x - 4, 240); g.stroke(); });
  g.beginPath(); g.ellipse(92, 44, 24, 13, -0.2, 0, PI * 2); g.fill();
});
// ---- MÁS VIEJO QUE ESTOS: la losa con el fósil y, encima, el mismo bicho de hoy paseando ----
export const HDinoSlab: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[-0.4, 2.2, 1.8]}
  cam={{ at: [0, 0.14, 0], az: [-0.24, 0.16], el: [0.72, 0.6], r: [2.2, 2.0], fov: 32 }}>{(tt) => <>
  <RBox s={[2.1, 0.08, 1.05]} p={[0, 0.0, 0]} r={0.02}><meshStandardMaterial color="#a9997c" roughness={1} /></RBox>
  <mesh position={[0, 0.041, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[2.04, 1.0]} /><meshStandardMaterial map={fossilTx()} roughness={1} /></mesh>
  <Fish p={[lerp(0.92, -0.42, eio(tt, 0.3, 4.6)), 0.042, 0.28]} ry={PI} s={2.0} run={tt} />
  <Tape txt="OLDER THAN THESE" p={[0, 0.14, 0.42]} w={0.58} k={phys(tt, 1.9, 8, 0.45)} rev={cl((tt - 1.9) / 0.6)} />
</>}</Scene3D>;

// ---- LA ZANAHORIA QUE SE ENCOGE: la forma pasa a ser el bicho, sobre media pulgada de regla ----
export const HCarrot: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" key1={[0.4, 2.3, 1.8]}
  cam={{ at: [0, 0.1, 0], az: [0.3, -0.14], el: [0.42, 0.36], r: [1.34, 1.14], fov: 32 }}>{(tt) => { const m = eio(tt, 1.2, 2.5), r = 1 - m;
  return <>
    <RBox s={[1.5, 0.012, 0.16]} p={[0, 0.01, 0.2]} r={0.002}><meshStandardMaterial map={tex.text("sfrul", 512, 64, (g) => { g.fillStyle = "#e8cf86"; g.fillRect(0, 0, 512, 64); g.fillStyle = "#2a2119"; for (let i = 0; i <= 40; i++) g.fillRect(i * 12.8, 0, 2, i % 8 ? 18 : 40); })} roughness={0.7} /></RBox>
    {r > 0.02 && <group position={[0, 0.1, 0]} rotation={[0, 0, -PI / 2]} scale={sv(r)}><mesh castShadow><coneGeometry args={[0.1, 0.66, 28]} /><meshStandardMaterial color="#e08a2e" roughness={0.6} /></mesh><mesh position={[0, 0.38, 0]}><coneGeometry args={[0.06, 0.16, 12]} /><meshStandardMaterial color="#4e7a3a" roughness={0.8} /></mesh></group>}
    <Fish p={[0, 0.03, 0]} ry={PI} s={sv(4.4 * m)} run={tt * 0.2} />
    <Tape txt="HALF AN INCH" p={[0.16, 0.24, 0.16]} w={0.42} k={phys(tt, 3.0, 8, 0.45)} rev={cl((tt - 3.0) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- CUATRO MIEDOS TACHADOS: diente, aguijón, almohada, pastilla; a cada uno le cae el sello ----
export const HNoFangs: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="dark" key1={[0.5, 2.4, 2]}
  cam={{ at: [0, 0.2, 0], az: [-0.18, 0.1], el: [0.42, 0.34], r: [2.0, 1.78], fov: 32 }}>{(tt) => { const X = [-0.72, -0.24, 0.24, 0.72], K = (i: number) => phys(tt, 0.7 + i * 0.75, 7, 0.5);
  return <>
    {X.map((x) => <mesh key={x} position={[x, 0.02, 0]}><cylinderGeometry args={[0.2, 0.2, 0.03, 40]} />{M.wood({ rx: 1, ry: 1, base: [180, 150, 112] })}</mesh>)}
    <mesh position={[X[0], 0.1, 0]} castShadow><coneGeometry args={[0.07, 0.15, 5]} /><meshStandardMaterial color="#f6f3e9" roughness={0.3} /></mesh>
    <mesh position={[X[1], 0.12, 0]} rotation={[0, 0, 0.5]} castShadow><coneGeometry args={[0.022, 0.2, 12]} /><meshStandardMaterial color="#20201e" roughness={0.3} /></mesh>
    <RBox s={[0.26, 0.09, 0.2]} p={[X[2], 0.085, 0]} r={0.04}><meshStandardMaterial color="#f5f1e6" roughness={0.9} /></RBox>
    <group position={[X[3], 0.07, 0]} rotation={[0, 0.4, PI / 2]}><mesh castShadow><capsuleGeometry args={[0.04, 0.12, 8, 18]} /><meshStandardMaterial color="#d8483c" roughness={0.3} /></mesh></group>
    {X.map((x, i) => <group key={i} position={[x, lerp(2, 0.3, K(i)), 0]} rotation={[PI / 2, 0, 0]}><mesh><torusGeometry args={[0.19, 0.022, 10, 44]} /><meshStandardMaterial color="#b3261e" roughness={0.5} /></mesh><mesh rotation={[0, 0, PI / 4]}><boxGeometry args={[0.37, 0.036, 0.02]} /><meshStandardMaterial color="#b3261e" roughness={0.5} /></mesh></group>)}
    <Fish p={[0, 0.012, 0.42]} s={1.9} run={tt * 0.4} />
    <Tape txt="HARMLESS" col="#2c6b3c" p={[0, 0.58, 0]} w={0.5} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL LOMO ROÍDO: el bicho pasa por la tapa de la Biblia y atrás va quedando pálido ----
export const HBibleBite: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.5, 2.2, 1.9]}
  cam={{ at: [0, 0.18, 0.18], az: [0.28, -0.14], el: [0.26, 0.18], r: [1.34, 1.16], fov: 32 }}>{(tt) => { const u = eio(tt, 0.6, 4.4), q = Math.round(u * 12);
  const m = tex.text(`sfbib${q}`, 512, 128, (g) => { g.fillStyle = "#3b1f14"; g.fillRect(0, 0, 512, 128); g.strokeStyle = "#c79a44"; g.lineWidth = 3; g.strokeRect(14, 14, 484, 100); g.fillStyle = "#c79a44"; g.font = "700 62px Georgia, serif"; g.textAlign = "center"; g.fillText("HOLY BIBLE", 256, 86); for (let i = 0; i < 260; i++) { const x = rn(i, 61) * 512; if (x < q / 12 * 512) { g.fillStyle = `rgba(214,196,160,${0.5 + 0.5 * rn(i, 62)})`; g.beginPath(); g.ellipse(x, rn(i, 63) * 128, 2 + 8 * rn(i, 64), 2 + 4 * rn(i, 65), rn(i, 66) * 3, 0, PI * 2); g.fill(); } } });
  return <>
    <RBox s={[1.2, 0.2, 0.84]} p={[0, 0.14, -0.1]} r={0.02}><meshStandardMaterial color="#2c170f" roughness={0.6} /></RBox>
    <RBox s={[1.17, 0.14, 0.84]} p={[0, 0.14, -0.1]} r={0.002}><meshStandardMaterial color="#e8dfc8" roughness={0.9} /></RBox>
    <mesh position={[0, 0.14, 0.325]}><planeGeometry args={[1.2, 0.2]} /><meshStandardMaterial map={m} roughness={0.55} /></mesh>
    <group position={[lerp(-0.62, 0.62, u), 0.14, 0.335]}><Lying><Fish s={1.05} run={tt} /></Lying></group>
    <Tape txt="GRANDMA'S BIBLE" p={[0, 0.4, 0.1]} w={0.52} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL RESTAURANTE: en el rincón con moho se prende el cartel; mesa puesta, dos clientes ----
export const HRestaurant: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" key1={[0.4, 2.2, 1.7]}
  cam={{ at: [0, 0.28, 0], az: [-0.26, 0.12], el: [0.22, 0.16], r: [1.24, 1.06], fov: 32 }}>{(tt) => { const lit = eio(tt, 1.0, 1.5);
  return <>
    <RBox s={[3, 1.3, 0.06]} p={[0, 0.65, -0.4]} r={0.004}><meshStandardMaterial color="#8d8878" roughness={1} /></RBox>
    {Array.from({ length: 60 }, (_, i) => <mesh key={i} position={[(rn(i, 71) - 0.5) * 1.15, 0.12 + rn(i, 72) * 0.72, -0.366]} scale={[1, 0.8, 0.1]}><sphereGeometry args={[0.01 + rn(i, 73) * 0.022, 9, 7]} /><meshStandardMaterial color={i % 3 ? "#2e3a2b" : "#47573d"} roughness={1} /></mesh>)}
    <RBox s={[0.42, 0.16, 0.03]} p={[0, 0.48, -0.34]} r={0.008}><meshStandardMaterial color="#1a1412" /></RBox>
    <mesh position={[0, 0.48, -0.32]}><planeGeometry args={[0.36, 0.11]} /><meshBasicMaterial map={numTex("OPEN", "#1a1412", lit > 0.4 ? "#ff9b4a" : "#3a2a20", 96)} /></mesh>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.018, 0.03, 0.2, 14]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.2, 0.2, 0.016, 40]} /><meshStandardMaterial color="#efe9da" roughness={0.6} /></mesh>
    <mesh position={[0, 0.213, 0]}><cylinderGeometry args={[0.09, 0.075, 0.01, 30]} /><meshStandardMaterial color="#c8d0d6" roughness={0.3} /></mesh>
    <RBox s={[0.08, 0.018, 0.06]} p={[0, 0.222, 0]} r={0.006}><meshStandardMaterial color="#d3a868" roughness={0.9} /></RBox>
    <Fish p={[-0.15, 0.208, 0.03]} s={1.05} run={tt * 0.15} />
    <Fish p={[0.15, 0.208, -0.02]} ry={PI} s={1.05} run={tt * 0.15 + 1} />
    <Tape txt="A RESTAURANT" p={[0, 0.04, 0.34]} w={0.5} k={phys(tt, 2.4, 8, 0.45)} rev={cl((tt - 2.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL EDIFICIO DE ATRÁS: el aerosol moja a uno en la vereda; la pared está llena ----
export const HWallApt: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="none" key1={[0.4, 2.4, 2.2]}
  cam={{ at: [0, 0.48, 0], az: [0.2, -0.14], el: [0.2, 0.14], r: [1.9, 1.7], fov: 32 }}>{(tt) => { const op = eio(tt, 1.9, 3.1);
  return <>
    <RBox s={[3.4, 1.4, 0.04]} p={[0, 0.7, -0.5]} r={0.003}><meshStandardMaterial color="#3a2d22" roughness={1} /></RBox>
    {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => <RBox key={x} s={[0.08, 1.4, 0.22]} p={[x, 0.7, -0.4]} r={0.004}>{M.wood({ rx: 1, ry: 3, base: [140, 104, 66] })}</RBox>)}
    {Array.from({ length: 32 }, (_, i) => <group key={i} position={[-1.45 + rn(i, 81) * 2.9, 0.12 + rn(i, 82) * 1.1, -0.46]} rotation={[0, 0, rn(i, 83) * 6]}><Lying><Fish s={1.25} run={tt * 0.2 + i} /></Lying></group>)}
    <group position={[0, 0, lerp(0, -0.02, op)]}><group position={[lerp(0, -3.1, op), 0, 0]}><RBox s={[3.4, 1.4, 0.05]} p={[0, 0.7, -0.27]} r={0.004}><meshStandardMaterial color="#e5e1d6" roughness={0.6} /></RBox></group></group>
    <group position={[0.68, 0.64, 0.1]} rotation={[0, 0, 0.5]}><mesh castShadow><cylinderGeometry args={[0.08, 0.08, 0.36, 24]} />{M.steel({ col: "#c7ccd0" })}</mesh><RBox s={[0.08, 0.07, 0.05]} p={[0, 0.21, 0]} r={0.008}>{M.matte({ col: "#b3261e" })}</RBox></group>
    {Array.from({ length: 34 }, (_, i) => { const v = (tt * 1.05 + rn(i, 84)) % 1; return <mesh key={i} position={[lerp(0.56, 0.02, v), lerp(0.62, 0.04, v), 0.12 + (rn(i, 85) - 0.5) * 0.24]}><sphereGeometry args={[0.008, 8, 6]} /><meshStandardMaterial color="#dbe8ec" transparent opacity={0.75} /></mesh>; })}
    <Fish p={[0, 0.002, 0.12]} s={1.8} dry={eio(tt, 0.8, 2.0)} run={tt * (1 - eio(tt, 0.8, 2.0))} />
    <Tape txt="THE REST LIVE HERE" p={[0, 0.8, 0.1]} w={0.82} k={phys(tt, 3.1, 8, 0.45)} rev={cl((tt - 3.1) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- LA MIGA ADENTRO: el frasco ya envuelto y, desde arriba, la pizca que cae ----
export const HJarBread: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.4, 2.2, 1.8]}
  cam={{ at: [0, 0.26, 0], az: [0.3, -0.16], el: [1.1, 0.98], r: [1.55, 1.36], fov: 32 }}>{(tt) => { const k = phys(tt, 1.1, 6, 0.5), y = lerp(1.25, 0, k);
  return <>
    <group position={[0, y, 0]}><RBox s={[0.21, 0.09, 0.17]} p={[0, 0.1, 0]} r={0.018} rot={[0.1, 0.8, 0]}><meshStandardMaterial color="#b9793a" roughness={0.9} /></RBox></group>
    <TapeJar p={[0, 0.042, 0]} r={0.2} h={0.46} tape={0.98} bread={0} />
    {Array.from({ length: 24 }, (_, i) => { const v = cl((tt - 1.6 - rn(i, 91) * 0.7) / 0.8); return v > 0 && v < 1 ? <mesh key={i} position={[(rn(i, 92) - 0.5) * 0.28 * v, 0.08 + Math.sin(v * PI) * 0.1, (rn(i, 93) - 0.5) * 0.28 * v]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#f3ead6" transparent opacity={0.7 * (1 - v)} /></mesh> : null; })}
    <Tape txt="THAT'S THE WHOLE TRAP" p={[0, 0.5, 0.3]} w={0.56} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- EL FRASCO EN CORTE: sube agarrándose de la cinta, cae, y el vidrio liso lo devuelve ----
export const HJarClimb: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" key1={[0.4, 2.4, 2.3]}
  cam={{ at: [-0.08, 0.48, 0], az: [0.12, -0.08], el: [0.1, 0.06], r: [2.0, 1.82], fov: 32 }}>{(tt) => {
  const W = 0.3, H_ = 0.76; let x = -0.95, y = 0.044, rz = 0, ry = 0;
  if (tt < 0.9) x = lerp(-0.95, -W - 0.054, tt / 0.9);
  else if (tt < 2.5) { x = -W - 0.04; y = lerp(0.1, H_ + 0.02, (tt - 0.9) / 1.6); rz = PI / 2; }
  else if (tt < 2.85) { const a = (tt - 2.5) / 0.35; x = lerp(-W - 0.04, -W + 0.06, a); y = H_ + 0.05 + Math.sin(a * PI) * 0.03; rz = lerp(PI / 2, -PI / 2, a); }
  else if (tt < 3.3) { const a = (tt - 2.85) / 0.45; x = -W + 0.08; y = lerp(H_, 0.13, a * a); rz = -PI / 2 + a * 4; }
  else { const P = (tt - 3.3) % 1.15, up = P < 0.75 ? P / 0.75 : Math.max(0, 1 - (P - 0.75) / 0.3); x = W - 0.044; y = lerp(0.12, 0.36, up); rz = PI / 2; ry = PI; if (tt < 3.75) { const k = (tt - 3.3) / 0.45; x = lerp(-W + 0.08, W - 0.09, k); y = 0.135; rz = 0; ry = 0; } }
  return <>
    <RBox s={[0.022, H_, 0.5]} p={[-W, H_ / 2 + 0.03, 0]} r={0.004}><meshStandardMaterial color="#d6c090" roughness={1} /></RBox>
    <RBox s={[0.022, H_, 0.5]} p={[W, H_ / 2 + 0.03, 0]} r={0.004}><meshPhysicalMaterial color="#dff0f5" transparent opacity={0.5} roughness={0.05} clearcoat={1} /></RBox>
    <RBox s={[W * 2 + 0.022, 0.03, 0.5]} p={[0, 0.03, 0]} r={0.004}><meshPhysicalMaterial color="#dff0f5" transparent opacity={0.55} roughness={0.05} clearcoat={1} /></RBox>
    <RBox s={[0.2, 0.07, 0.2]} p={[-0.04, 0.08, 0]} r={0.02}><meshStandardMaterial color="#d3a868" roughness={0.9} /></RBox>
    <group position={[x, y, 0]} rotation={[0, ry, rz]}><Fish s={2.0} run={tt * 0.8} /></group>
    <Tape txt="GRIP" p={[-0.62, 0.62, 0.14]} w={0.28} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.4)} />
    <Tape txt="TOO SLICK" col="#b3261e" p={[0.56, 0.62, 0.14]} w={0.42} k={phys(tt, 3.7, 8, 0.45)} rev={cl((tt - 3.7) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL MARCADOR DE FRASCOS: seis carteles en fila, cinco ceros y un siete que enciende la gotera ----
export const HScoreJars: P = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" key1={[0.3, 2.3, 2.4]}
  cam={{ at: [0, 0.68, 0], az: [-0.12, 0.08], el: [0.14, 0.08], r: [2.7, 2.42], fov: 32 }}>{(tt) => { const X = [-1, -0.6, -0.2, 0.2, 0.6, 1], V = ["0", "0", "7", "0", "0", "0"], g = eio(tt, 3.3, 4.2);
  return <>
    <RBox s={[2.7, 0.06, 0.5]} p={[0, 0.4, 0.04]} r={0.008}>{M.wood({ rx: 3, ry: 1, base: [152, 112, 72] })}</RBox>
    {X.map((x, i) => <React.Fragment key={i}><TapeJar p={[x, 0.43, 0.05]} r={0.13} h={0.3} num={String(i + 1)} bread={0} /><group position={[x, 0.98, 0.02]} rotation={[lerp(PI / 2, 0, phys(tt, 0.6 + i * 0.45, 8, 0.5)), 0, 0]}><RBox s={[0.24, 0.26, 0.02]} r={0.006}><meshStandardMaterial map={numTex(V[i], i === 2 ? "#f6e1b8" : "#efeadb", i === 2 ? "#a2221a" : "#2a2119")} roughness={0.8} /></RBox></group></React.Fragment>)}
    <mesh position={[X[2], 0.78, -0.2]}><circleGeometry args={[0.5 * g + 0.001, 40]} /><meshBasicMaterial color="#6fb5e6" transparent opacity={0.38} depthWrite={false} /></mesh>
    <Tape txt="THE WET IS HERE" col="#b3261e" p={[-0.2, 0.2, 0.32]} w={0.72} k={phys(tt, 3.5, 8, 0.45)} rev={cl((tt - 3.5) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- EL CUADRADITO QUE CAE: la rejilla del baño no lo sostiene ----
export const HTPTest: P = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#d9d3c4" key1={[0.4, 1.0, 2.4]}
  cam={{ at: [0, 1.0, 0], az: [0.22, -0.1], el: [-0.32, -0.26], r: [2.6, 2.4], fov: 32 }}>{(tt) => { const d = eio(tt, 0.9, 4.2), y = lerp(1.33, 0.62, d), sw = Math.sin(tt * 2.4) * 0.3 * (1 - d * 0.9), r = (1 - d) * Math.sin(tt * 2) * 0.9;
  return <>
    <RBox s={[3.4, 0.06, 1.6]} p={[0, 1.48, 0]} r={0.004}><meshStandardMaterial color="#e7e2d5" roughness={0.8} /></RBox>
    <RBox s={[0.56, 0.05, 0.46]} p={[0, 1.44, 0]} r={0.01}><meshStandardMaterial color="#f4f1e8" roughness={0.5} /></RBox>
    {Array.from({ length: 9 }, (_, i) => <RBox key={i} s={[0.47, 0.012, 0.022]} p={[0, 1.412, -0.16 + i * 0.04]} r={0.002}><meshStandardMaterial color="#47423c" roughness={0.9} /></RBox>)}
    <RBox s={[4.4, 2.6, 0.04]} p={[0, 1.2, -1.0]} r={0.004}><meshStandardMaterial color="#5f6b73" roughness={0.9} /></RBox>
    <mesh position={[sw, y, 0.1]} rotation={[-PI / 2 + r + 0.5, 0, r * 0.7]} castShadow><planeGeometry args={[0.36, 0.36]} /><meshStandardMaterial color="#ffffff" emissive="#fffaf0" emissiveIntensity={0.35} roughness={1} side={2} /></mesh>
    <Tape txt="NOISY DECORATION" col="#b3261e" p={[0.5, 0.82, 0.3]} w={0.78} k={phys(tt, 3.4, 8, 0.45)} rev={cl((tt - 3.4) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 15 AÑOS DE DUCHAS: el caño suelto en el altillo; el vapor sube y gotea por los tirantes ----
export const HAtticDuct: P = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" key1={[0.3, 2.4, 2.3]}
  cam={{ at: [0, 0.54, 0], az: [-0.26, 0.12], el: [0.16, 0.12], r: [2.5, 2.3], fov: 32 }}>{(tt) => { const n = Math.floor(eio(tt, 0.5, 4.4) * 15);
  return <>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.84, 0.03, -0.05]} rotation={[0, 0, k * 0.6]}><RBox s={[0.06, 1.5, 0.6]} p={[0, 0.75, 0]} r={0.006}>{M.wood({ rx: 1, ry: 3, base: [128, 92, 58] })}</RBox></group>)}
    {Array.from({ length: 56 }, (_, i) => <mesh key={i} position={[(rn(i, 95) - 0.5) * 2.8, 0.03, (rn(i, 96) - 0.5) * 1.1]} scale={[1.1, 0.5, 1]}><sphereGeometry args={[0.12 + rn(i, 97) * 0.06, 12, 9]} /><meshStandardMaterial color="#e7a8a8" roughness={1} /></mesh>)}
    <mesh position={[-0.4, 0.16, 0.1]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.11, 0.11, 0.86, 28]} />{M.steel({ col: "#c0c4c7" })}</mesh>
    <Steam tt={tt * 1.2} p={[0.06, 0.16, 0.1]} n={28} w={0.22} h={0.9} dir={[0.28, 0]} />
    {Array.from({ length: 8 }, (_, i) => { const v = (tt * 0.55 + rn(i, 98)) % 1; return <Dr key={i} p={[0.12 + i * 0.09, lerp(1.0, 0.1, v * v), 0.02]} s={0.9} o={0.8} />; })}
    <mesh position={[-0.62, 0.9, 0.34]}><planeGeometry args={[0.42, 0.34]} /><meshBasicMaterial map={numTex(String(n), "#efeadb", "#2a2119", 170)} /></mesh>
    <Tape txt="YEARS OF SHOWERS" p={[-0.62, 0.64, 0.36]} w={0.56} k={phys(tt, 2.8, 8, 0.45)} rev={cl((tt - 2.8) / 0.5)} />
  </>;
}}</Scene3D>;

// ---- CORRÍA A SU CASA: la grieta del sellador tiene luz adentro y felpudo ----
export const HRunHome: P = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none" key1={[-0.5, 2.2, 1.9]}
  cam={{ at: [0.02, 0.1, -0.06], az: [0.3, -0.1], el: [0.2, 0.15], r: [0.95, 0.8], fov: 32 }}>{(tt) => { const u = eio(tt, 0.7, 4.9);
  return <>
    <RBox s={[3.4, 0.7, 0.7]} p={[0, 0.35, -0.55]} r={0.06}><meshPhysicalMaterial color="#f5f3ec" roughness={0.12} clearcoat={1} /></RBox>
    <RBox s={[3.4, 0.03, 0.05]} p={[0, 0.016, -0.18]} r={0.006}><meshStandardMaterial color="#d7cfbc" roughness={0.8} /></RBox>
    <mesh position={[0.2, 0.05, -0.198]}><planeGeometry args={[0.2, 0.09]} /><meshBasicMaterial color="#ffc97a" /></mesh>
    <RBox s={[0.16, 0.006, 0.11]} p={[0.2, 0.012, -0.11]} r={0.002}><meshStandardMaterial color="#7c3f2a" roughness={1} /></RBox>
    <mesh position={[0.2, 0.135, -0.198]}><planeGeometry args={[0.3, 0.085]} /><meshBasicMaterial map={numTex("HOME", "#efe6cf", "#7c3f2a", 56)} /></mesh>
    {u < 0.99 && <Fish p={[lerp(-0.9, 0.2, u), 0.004, lerp(0.5, -0.12, u)]} ry={Math.atan2(0.62, 1.1)} s={2.3} run={tt * 1.4} />}
    <Tape txt="RUNNING HOME" p={[0.02, 0.24, 0.05]} w={0.36} k={phys(tt, 2.6, 8, 0.45)} rev={cl((tt - 2.6) / 0.5)} />
  </>;
}}</Scene3D>;
