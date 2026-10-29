// rk29a · 3er y 4º bloque de componentes 3D (tras EVALUADOR r2, 29-oct). Cada uno UNA vez en toda la tanda.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, Tag } from "./hkit";
import { Studio, Fob3, Car3, Rings3, Wall3, Drawer3, Coin3, RB, sm, spr, c01, rnd } from "./studio3d";

type P = { t: number; h: H };
const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd3ff";
const blinkOn = (tt: number, a: number, f = 11) => (tt > a ? (Math.sin(tt * f) > 0 ? 1 : 0.2) : 0);

// textura con texto grabado (pila, foto)
const useLabelTex = (txt: string, bg = "#d6d8dc", fg = "#3a3d44") => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256; const g = cv.getContext("2d")!;
  const gr = g.createRadialGradient(110, 100, 10, 128, 128, 140); gr.addColorStop(0, "#f4f5f7"); gr.addColorStop(1, bg); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = fg; g.font = "bold 46px Arial"; g.textAlign = "center"; g.fillText(txt, 128, 140); g.font = "bold 22px Arial"; g.fillText("3V  LITHIUM", 128, 176);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, [txt, bg, fg]);

// 11 · la cinta métrica: sale de la llave hasta la pared de afuera; menos de 10 pies = alcanzable (el contador gira)
export const H3Tape: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const ext = 0.55 * sm(tt, 0.6, 2.6) + 0.45 * sm(tt, 2.6, 7.5), L = 2.75 * ext, hit = tt > 5.0;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [-0.4, 1.6, 2.6], l: [0.4, 0.45, 0], fov: 34 }, { t: 12, p: [0.7, 1.8, 2.7], l: [0.9, 0.45, 0], arc: 0.08 }]}>
      <RB p={[-0.6, 0.25, 0]} s={[1.6, 0.5, 1.0]} c="#6b4a2e" r={0.7} />
      <Fob3 p={[-0.95, 0.5, 0.1]} rot={[0, 0.5, 0]} s={0.9} led={blinkOn(tt, 0.4, 7)} />
      <RB p={[-0.5, 0.64, 0.1]} s={[0.28, 0.28, 0.14]} rad={0.05} c="#f2c230" r={0.4} />
      <mesh position={[-0.5, 0.64, 0.175]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.01, 24]} /><meshStandardMaterial color="#2b2d33" roughness={0.5} /></mesh>
      <group position={[-0.36, 0.56, 0.1]}>
        <mesh position={[L / 2, 0, 0]} castShadow><boxGeometry args={[L + 0.001, 0.012, 0.11]} /><meshStandardMaterial color="#f2d24a" roughness={0.4} metalness={0.3} /></mesh>
        {Array.from({ length: Math.floor(L / 0.13) }, (_, i) => <mesh key={i} position={[0.065 + i * 0.13, 0.005, -0.01]}><boxGeometry args={[0.006, 0.002, i % 2 ? 0.025 : 0.04]} /><meshBasicMaterial color="#1a1a1a" /></mesh>)}
      </group>
      <Wall3 p={[2.4, 0.9, 0]} s={[0.25, 1.8, 2.2]} kind="brick" />
      <pointLight position={[2.1, 0.7, 0.4]} intensity={hit ? 2.2 + Math.sin(tt * 8) : 0} distance={1.6} color={RED} />
    </Studio>
    <div style={{ position: "absolute", left: 960, top: 210, transform: "translateX(-50%)", fontWeight: 900, fontSize: 150, color: hit ? RED : "#fff", textShadow: "0 4px 0 rgba(0,0,0,.8), 0 14px 40px rgba(0,0,0,.8)", fontVariantNumeric: "tabular-nums" }}>{(9 * ext).toFixed(0)} FT</div>
    <Tag tt={tt} at={5.0} x={960} y={900} txt="WITHIN REACH" col={RED} size={72} />
  </>;
}}</Stage>;

// 12 · sin pila no contesta: la llave abierta, la pila afuera; las ondas del auto llegan, golpean y se apagan sin respuesta
export const H3NoBatt: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const out = sm(tt, 0.6, 2.0);
  return <>
    <Studio tt={tt} night={0.5} keys={[{ t: 0, p: [1.4, 1.1, 2.4], l: [0.4, 0.2, 0], fov: 30 }, { t: 9, p: [0.2, 1.6, 2.8], l: [-0.2, 0.2, -0.2], arc: 0.1 }]}>
      <Car3 p={[-1.8, 0, -1.4]} rot={[0, 0.6, 0]} col="#5a6470" />
      <Fob3 p={[0.6, 0, 0.3]} rot={[0, -0.4, 0]} s={1.6} open={0.85} batt={false} led={0} />
      <Coin3 p={[1.2 + 0.4 * out, 0.25 + 0.35 * out + 0.03 * Math.sin(tt * 2), 0.6]} rot={[1.2, tt * 0.6, 0]} d={0.42} glow={0.02} c="#a9adb3" />
      {tt > 1.2 && <Rings3 p={[-1.2, 0.5, -0.8]} k={(tt - 1.2) * 0.8} n={3} r={2.0} col={ICE} rot={[0, 0.9, 0]} op={0.9} />}
    </Studio>
    <Tag tt={tt} at={3.4} x={1250} y={180} txt="NOBODY ANSWERS" col={ICE} size={66} />
  </>;
}}</Stage>;

// 13 · la ranura: primer plano del canto de la llave, la ranura brilla y una moneda de diez centavos rueda y entra justo
export const H3Notch: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const glow = c01((tt - 1.0) / 0.6), roll = sm(tt, 2.4, 4.4), x = 1.3 - 0.85 * roll;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [1.0, 1.0, 1.5], l: [0.3, 0.1, 0], fov: 30 }, { t: 10, p: [0.7, 0.75, 1.15], l: [0.4, 0.1, 0.05], arc: 0.08 }]}>
      <Fob3 p={[-0.25, 0, 0]} rot={[0, Math.PI / 2, 0]} s={2.2} />
      <mesh position={[0.4, 0.105, 0]}><boxGeometry args={[0.02, 0.022, 0.12]} /><meshBasicMaterial color={glow > 0 ? "#ffb257" : "#111"} toneMapped={false} /></mesh>
      <pointLight position={[0.5, 0.12, 0]} intensity={glow * 0.5} distance={0.5} color={AMB} />
      <group position={[x, 0.16, 0]} rotation={[0, 0, roll * 6]}><Coin3 rot={[0, 0, Math.PI / 2]} d={0.34} c="#e2e5ea" glow={0.3} /></group>
    </Studio>
    <Tag tt={tt} at={1.4} x={1180} y={840} txt="THE NOTCH" col={AMB} size={64} />
    <Tag tt={tt} at={4.6} x={960} y={160} txt="A DIME FITS" col={AMB} size={64} />
  </>;
}}</Stage>;
const TX0 = "#f2ead8";

// 14 · un giro, no palanca: la moneda gira 90° en la ranura, las mitades se separan con un clic y aparece la pila
export const H3Twist: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const tw = c01(spr(tt, 1.2, 7, 0.5)), op = c01(spr(tt, 3.2, 6, 0.55)), flash = c01(1 - Math.abs(tt - 3.25) / 0.2), bup = c01(spr(tt, 3.8, 6, 0.5));
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.9, 0.9, 1.6], l: [0, 0.15, 0], fov: 30 }, { t: 12, p: [0.4, 1.3, 1.3], l: [0, 0.2, 0.05], arc: 0.08 }]}>
      <Fob3 p={[0, 0, 0]} rot={[0, 0.3, 0]} s={2.0} open={op} />
      <group position={[0.42, 0.12 + op * 0.25, 0.25]} rotation={[0, 0.3, tw * Math.PI / 2]}><Coin3 rot={[Math.PI / 2, 0, 0]} d={0.34} c="#e2e5ea" glow={0.3} /></group>
      <Coin3 p={[-0.1, 0.1 + 0.45 * bup, 0.1]} rot={[0.5 * bup, 0, 0.3 * bup]} d={0.26} glow={0.35} />
      <pointLight position={[0, 0.5, 0.3]} intensity={flash * 2} distance={2} color="#fff6dc" />
    </Studio>
    <Tag tt={tt} at={1.6} x={1400} y={200} txt="JUST A TWIST" col={AMB} size={58} />
  </>;
}}</Stage>;

// 15 · la foto del número: el celular baja sobre la pila, flash, y la foto queda en la pantalla; la llave se vuelve a cerrar
export const H3Snap: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const lab = useLabelTex("CR2025"), down = sm(tt, 0.4, 1.6), flash = c01(1 - Math.abs(tt - 2.0) / 0.3) ** 2, shot = tt > 2.05, close = sm(tt, 5.6, 6.6), aside = sm(tt, 2.6, 3.6);
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.0, 1.9, 1.5], l: [0, 0.1, 0], fov: 32 }, { t: 9, p: [0.5, 1.5, 1.4], l: [0.1, 0.2, 0], arc: 0.06 }]}>
      <Fob3 p={[-0.55, 0, 0]} rot={[0, 0.2, 0]} s={1.3} open={0.8 * (1 - close)} batt={false} />
      <mesh position={[0.35, 0.02, 0.1]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.03, 48]} /><meshStandardMaterial color="#d6d8dc" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0.35, 0.036, 0.1]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.19, 48]} /><meshStandardMaterial map={lab} metalness={0.5} roughness={0.35} /></mesh>
      <group position={[0.35 + 0.55 * aside, 1.2 - 0.85 * down + 0.15 * aside, 0.1 - 0.2 * aside]} rotation={[-0.5 * aside, 0, -0.3 * aside]} scale={0.8}>
        <RB s={[0.5, 0.04, 0.95]} rad={0.05} c="#111216" r={0.2} m={0.3} />
        <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.44, 0.86]} />{shot ? <meshBasicMaterial map={lab} toneMapped={false} /> : <meshBasicMaterial color="#1c2a3a" toneMapped={false} />}</mesh>
      </group>
      <pointLight position={[0.35, 0.5, 0.1]} intensity={flash * 1.6} distance={2.5} color="#ffffff" />
    </Studio>
    <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.12 }} />
    <Tag tt={tt} at={3.6} x={560} y={900} txt="KNOW WHAT TO BUY" col={TX0} size={62} />
  </>;
}}</Stage>;

// 16 · tres clases: tres llaves en fila sobre una bandeja clara; cada una sube y se ilumina cuando se la nombra (ranura, navaja, tapa)
export const H3Kinds3: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const sel = tt < 4.6 ? 0 : tt < 8.6 ? 1 : 2, blade = sm(tt, 5.0, 5.8), plate = sm(tt, 9.0, 9.8), slot = c01((tt - 1.0) / 0.5);
  const lift = (i: number) => (sel === i ? c01(spr(tt, [0.4, 4.8, 8.8][i], 6, 0.5)) * 0.22 : 0);
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0, 1.7, 2.3], l: [0, 0.1, 0], fov: 34 }, { t: 12, p: [0.25, 1.55, 2.1], l: [0, 0.12, 0], arc: 0.04 }]}>
      <RB p={[0, -0.03, 0]} s={[2.6, 0.06, 1.3]} rad={0.03} c="#c9a77c" r={0.6} />
      {[0, 1, 2].map((i) => <group key={i} position={[-0.8 + i * 0.8, 0.0 + lift(i), 0.15]} rotation={[0, 0, 0]}>
        <Fob3 s={1.05} ring={false} col={["#17181c", "#2a2420", "#1c2024"][i]} led={sel === i ? 0.3 : 0} />
        {i === 0 && <mesh position={[0.185, 0.06, 0]}><boxGeometry args={[0.012, 0.03, 0.12]} /><meshBasicMaterial color={sel === 0 ? AMB : "#111"} toneMapped={false} transparent opacity={0.3 + 0.7 * slot} /></mesh>}
        {i === 1 && <group position={[0, 0.06, -0.32]} rotation={[0, -blade * 3.0, 0]}><mesh position={[0, 0, -0.28]} castShadow><boxGeometry args={[0.07, 0.02, 0.52]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.2} /></mesh></group>}
        {i === 2 && <group position={[0, 0.02, 0.32]} rotation={[plate * 0.6, 0, 0]}><RB p={[0, 0, -0.3]} s={[0.34, 0.02, 0.6]} rad={0.01} c="#2a2d33" r={0.35} /></group>}
        {sel === i && <spotLight position={[-0.8 + i * 0.8, 2.2, 1.0]} angle={0.22} penumbra={0.6} intensity={14} distance={4} color="#fff2dc" />}
      </group>)}
    </Studio>
    {["1 · COIN SLOT", "2 · FLIP KEY", "3 · BACK PLATE"].map((n, i) => sel === i ? <Tag key={i} tt={tt} at={[0.6, 4.8, 8.8][i]} x={960} y={150} txt={n} col={AMB} size={66} /> : null)}
  </>;
}}</Stage>;

// 17 · el tornillito: el destornillador de relojero gira el tornillo grande, sube en espiral y cae en la taza; la tapa se abre
export const H3Screw: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const turn = sm(tt, 0.8, 3.0), lift = sm(tt, 3.0, 3.6), arc = sm(tt, 3.6, 4.6), bounce = tt > 4.6 ? Math.abs(Math.sin((tt - 4.6) * 9)) * Math.exp(-4 * (tt - 4.6)) : 0, plate = sm(tt, 5.0, 6.0);
  const sx = 0.0 + 0.85 * arc, sy = 0.16 + 0.06 * turn + 0.12 * lift + 0.35 * Math.sin(Math.PI * arc) - 0.1 * arc + 0.12 * bounce, sz = 0.2 * arc;
  return <>
    <Studio tt={tt} floor="concrete" keys={[{ t: 0, p: [0.3, 0.75, 1.05], l: [0.15, 0.18, 0], fov: 32 }, { t: 10, p: [0.7, 0.8, 1.1], l: [0.4, 0.15, 0], arc: 0.05 }]}>
      <group position={[0, 0.0, -0.1]}><RB s={[0.5, 0.06, 0.8]} p={[0, 0.03, 0]} rad={0.03} c="#17181c" r={0.3} /></group>
      <group position={[0, 0.07, -0.49]} rotation={[-plate * 0.45, 0, 0]}><RB p={[0, 0.01, 0.39]} s={[0.48, 0.02, 0.78]} rad={0.01} c="#26282d" r={0.9} /></group>
      <group position={[sx, sy, sz]} rotation={[0, turn * 18, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.06, 0.06, 0.022, 24]} /><meshStandardMaterial color="#d6d9de" metalness={1} roughness={0.2} /></mesh>
        <mesh position={[0, 0.012, 0]}><boxGeometry args={[0.1, 0.006, 0.014]} /><meshBasicMaterial color="#222" /></mesh>
        <mesh position={[0, -0.05, 0]} castShadow><cylinderGeometry args={[0.022, 0.016, 0.09, 12]} /><meshStandardMaterial color="#b9bec5" metalness={1} roughness={0.3} /></mesh>
      </group>
      <group position={[0, 0.2 + 0.06 * turn + 0.6 * lift, 0]} rotation={[0, turn * 18, 0]}>
        <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.12, 8]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.2} /></mesh>
        <mesh position={[0, 0.27, 0]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.3, 20]} /><meshStandardMaterial color="#c8202a" roughness={0.35} /></mesh>
      </group>
      <mesh position={[0.85, 0.11, 0.2]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.13, 0.22, 40, 1, true]} /><meshStandardMaterial color="#efe9de" roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0.85, 0.005, 0.2]}><cylinderGeometry args={[0.13, 0.13, 0.01, 40]} /><meshStandardMaterial color="#e2dccf" roughness={0.3} /></mesh>
    </Studio>
    <Tag tt={tt} at={4.6} x={1450} y={220} txt="INTO A CUP" col={TX0} size={62} />
  </>;
}}</Stage>;

// 18 · la pila suelta: rueda en el cajón entre los clips; una manito entra por el borde y la pila se pone roja
export const H3Loose: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const op = c01(spr(tt, 0.3, 6, 0.55)) * 0.85, ang = tt * 1.3, bx = -0.25 + 0.35 * Math.sin(ang), bz = 0.05 + 0.18 * Math.sin(ang * 0.7), warn = tt > 5.4;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.1, 2.5, 2.6], l: [0, 0.5, 0.6], fov: 32 }, { t: 12, p: [0.3, 2.3, 1.9], l: [-0.1, 0.45, 0.75], arc: 0.05 }]}>
      <Drawer3 open={op}>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.6 + rnd(i, 3) * 1.2, 0.01, -0.38 + rnd(i, 4) * 0.76]} rotation={[Math.PI / 2, 0, rnd(i, 5) * 3]} scale={[1, 0.45, 1]}><torusGeometry args={[0.075, 0.008, 6, 20]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.3} /></mesh>)}
        <group position={[bx, 0.03, bz]}><Coin3 d={0.26} rot={[0, ang * 3, 0]} glow={0.35} /></group>
        {warn && <Rings3 p={[bx, 0.03, bz]} k={tt * 1.1} n={2} r={0.35} col={RED} />}
      </Drawer3>
    </Studio>
    <Tag tt={tt} at={5.6} x={960} y={150} txt="NOT NEAR LITTLE HANDS" col={RED} size={56} />
  </>;
}}</Stage>;

// 19 · arriba, en la puerta del mueble: la bolsita con la pila sube con inercia, dos tiras de cinta la fijan; el bracito no llega
export const H3TapeUp: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const up = c01(spr(tt, 0.6, 6, 0.5)), t1 = c01(spr(tt, 2.0, 9, 0.45)), t2 = c01(spr(tt, 2.5, 9, 0.45)), y = 0.45 + 0.85 * up;
  return <>
    <Studio tt={tt} floor="tile" keys={[{ t: 0, p: [0.3, 1.0, 2.6], l: [0, 1.0, 0], fov: 36 }, { t: 10, p: [-0.3, 1.2, 2.3], l: [0, 1.15, 0], arc: 0.06 }]}>
      <Wall3 p={[0, 1.2, -0.1]} s={[1.6, 2.4, 0.06]} kind="wood" /><Wall3 p={[0, 1.6, -0.4]} s={[6, 3.4, 0.1]} kind="drywall" />
      {[-0.82, 0.82].map((x) => <RB key={x} p={[x, 1.2, 0.05]} s={[0.06, 2.4, 0.3]} c="#7a5a3c" r={0.6} />)}
      {[0.2, 2.35].map((yy) => <RB key={yy} p={[0, yy, 0.05]} s={[1.7, 0.06, 0.3]} c="#7a5a3c" r={0.6} />)}
      <mesh position={[0.62, 1.2, 0.0]}><sphereGeometry args={[0.04, 16, 16]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.25} /></mesh>
      <group position={[0.1, y, 0.0]}>
        <mesh castShadow><boxGeometry args={[0.42, 0.3, 0.03]} /><meshPhysicalMaterial color="#e8f0f6" transparent opacity={0.45} roughness={0.08} clearcoat={1} /></mesh>
        <Coin3 p={[0, -0.02, 0.0]} rot={[Math.PI / 2, 0, 0]} d={0.2} glow={0.4} />
        <mesh position={[-0.16, 0.14 + 0.5 * (1 - t1), 0.025]} rotation={[0, 0, 0.5]}><boxGeometry args={[0.08, 0.26, 0.006]} /><meshStandardMaterial color="#f2ead2" roughness={0.6} transparent opacity={0.92 * t1} /></mesh>
        <mesh position={[0.16, 0.14 + 0.5 * (1 - t2), 0.025]} rotation={[0, 0, -0.5]}><boxGeometry args={[0.08, 0.26, 0.006]} /><meshStandardMaterial color="#f2ead2" roughness={0.6} transparent opacity={0.92 * t2} /></mesh>
      </group>
    </Studio>
    <Tag tt={tt} at={2.8} x={1420} y={200} txt="UP HIGH" col={AMB} size={66} />
  </>;
}}</Stage>;

// 20 · la llave escondida: el pulgar aprieta el botón, la hoja de metal sale con resorte y la tapita de la manija salta girando
export const H3Blade: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const press = c01((tt - 2.2) / 0.3) * (1 - c01((tt - 2.8) / 0.3)), out = c01(spr(tt, 2.6, 8, 0.4)), cap = c01(spr(tt, 4.4, 6, 0.5));
  return <>
    <Studio tt={tt} floor="concrete" keys={[{ t: 0, p: [0.7, 1.6, 2.2], l: [0, 0.1, -0.3], fov: 32 }, { t: 10, p: [-0.4, 1.6, 2.1], l: [0, 0.12, -0.35], arc: 0.08 }]}>
      <Fob3 p={[0, 0, 0.1]} rot={[0, 0.25, 0]} s={1.5} press={[0, press, 0]} ring={false} />
      <group position={[-0.05, 0.08, -0.45]} rotation={[0, 0.25, 0]}><mesh position={[0, 0, -0.36 * out]} castShadow><boxGeometry args={[0.1, 0.03, 0.6]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.22} /></mesh></group>
      <group position={[0.55 * cap, 0.12 + 0.5 * Math.sin(Math.PI * cap), -0.6 - 0.2 * cap]} rotation={[cap * 4, cap * 2, 0]}><RB s={[0.2, 0.06, 0.28]} rad={0.02} c="#3a3d44" r={0.3} m={0.3} /></group>
    </Studio>
    <Tag tt={tt} at={2.2} x={1350} y={200} txt="A REAL METAL KEY" col={TX0} size={56} />
  </>;
}}</Stage>;

export const HEROES_3C: Record<string, React.FC<P>> = { tape: H3Tape, nobatt: H3NoBatt, notch: H3Notch, twist: H3Twist, snap: H3Snap, kinds3: H3Kinds3, screw: H3Screw, loose: H3Loose, tapeup: H3TapeUp, blade: H3Blade };
void Wall3; void ICE;
