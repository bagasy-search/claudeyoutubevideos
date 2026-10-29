// rk29a · 5º y 6º bloque de componentes 3D (29-oct). Cada uno UNA vez en toda la tanda.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, Stage, Tag } from "./hkit";
import { Studio, Fob3, Car3, Rings3, Wall3, Pouch3, RB, sm, spr, c01 } from "./studio3d";

type P = { t: number; h: H };
const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd3ff", TX0 = "#f2ead8";

// textura con texto (tablero, tarjetas de comentario, reloj)
const useTxt = (lines: string[], w = 512, hh = 256, bg = "#0b0f14", fg = "#ffb257", size = 54) => useMemo(() => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = hh; const g = cv.getContext("2d")!;
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.textAlign = "center"; g.font = `bold ${size}px Arial`;
  lines.forEach((l, i) => g.fillText(l, w / 2, hh / 2 + (i - (lines.length - 1) / 2) * size * 1.25 + size * 0.35));
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}, [lines.join("|"), w, hh, bg, fg, size]);

// 21 · el botón de arranque: la llave sin pila se apoya contra START; la bobina de adentro se enciende con la energía del auto
export const H3StartBtn: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const go = c01(spr(tt, 0.8, 6, 0.55)), touch = tt > 2.2, coil = c01((tt - 2.4) / 0.6), on = tt > 3.8;
  return <>
    <Studio tt={tt} night={0.6} floor="none" keys={[{ t: 0, p: [0.7, 0.55, 1.1], l: [0.05, 0.05, 0], fov: 32 }, { t: 10, p: [0.3, 0.42, 0.9], l: [0.05, 0.06, 0], arc: 0.08 }]}>
      <RB p={[0, -0.2, -0.1]} s={[2.6, 0.4, 1.4]} rad={0.12} c="#1e2024" r={0.5} m={0.2} />
      <RB p={[0, 0.35, -0.9]} s={[3.2, 1.2, 0.3]} rad={0.15} c="#26282d" r={0.55} m={0.15} />
      {[-0.6, 0.6].map((x) => <mesh key={x} position={[x, 0.45, -0.74]}><circleGeometry args={[0.22, 40]} /><meshBasicMaterial color="#0b0f14" /></mesh>)}
      {[-0.6, 0.6].map((x) => <mesh key={"r" + x} position={[x, 0.45, -0.735]}><ringGeometry args={[0.2, 0.215, 40]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>)}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.03, 16, 48]} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.2} emissive={on ? "#ffb257" : "#000"} emissiveIntensity={on ? 1.2 : 0} /></mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.18, 0.18, 0.06, 48]} /><meshStandardMaterial color="#2a2c31" roughness={0.3} metalness={0.4} /></mesh>
      <group position={[0.15 + 0.9 * (1 - go), 0.12 + 0.5 * (1 - go), 0.05]} rotation={[0, -0.4, -0.25 * (1 - go)]}>
        <Fob3 s={1.0} />
        <mesh position={[0, 0.06, 0.05]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.012, 8, 32]} /><meshBasicMaterial color={coil > 0 ? "#ffcf7a" : "#3a2a1a"} toneMapped={false} transparent opacity={0.25 + 0.75 * coil} /></mesh>
      </group>
      {touch && <Rings3 p={[0, 0.05, 0]} k={(tt - 2.2) * 0.9} n={2} r={0.34} col={AMB} rot={[Math.PI / 2, 0, 0]} op={0.6} />}
      <pointLight position={[0, 0.3, 0.2]} intensity={on ? 1.0 : coil * 0.6} distance={1.2} color={AMB} />
    </Studio>
    <Tag tt={tt} at={1.0} x={1400} y={190} txt="KEY TO THE BUTTON" col={AMB} size={58} />
    <Tag tt={tt} at={3.0} x={560} y={880} txt="IT STARTS" col={TX0} size={64} />
  </>;
}}</Stage>;

// 22 · sábado de sol contra las 2 de la mañana: el mismo auto, mitad de día tibio, mitad de noche fría y con lluvia
export const H3Sunny: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const cut = 960 + 140 * Math.sin(tt * 0.5) * c01(tt - 1), k: [{ t: number; p: [number, number, number]; l: [number, number, number]; fov: number }, { t: number; p: [number, number, number]; l: [number, number, number]; fov: number; arc: number }] = [{ t: 0, p: [2.8, 1.5, 3.6], l: [0, 0.5, 0], fov: 34 }, { t: 12, p: [1.9, 1.3, 3.4], l: [0, 0.5, 0], fov: 34, arc: 0.06 }];
  return <>
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${1920 - cut}px 0 0)` }}>
      <Studio tt={tt} floor="concrete" photo={0} bg="#9cc6e8" warm={1.1} kl={[4, 7, 2]} keys={k}>
        <Car3 p={[0, 0, 0]} rot={[0, 0.8, 0]} col="#8a929c" blink={tt > 2 && tt < 3 ? 1 : 0} />
        <directionalLight position={[5, 8, 3]} intensity={2.2} color="#fff1d0" />
        <Fob3 p={[1.4, 0.9, 1.3]} rot={[0.4, -0.6, 0]} s={0.8} />
      </Studio>
    </div>
    <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${cut}px)` }}>
      <Studio tt={tt} floor="concrete" photo={0} night={1} bg="#05070c" keys={k}>
        <Car3 p={[0, 0, 0]} rot={[0, 0.8, 0]} col="#8a929c" head={0} />
        <pointLight position={[2.2, 2.6, 1.6]} intensity={4} distance={5} color="#ffb85a" />
        {Array.from({ length: 60 }, (_, i) => { const x = -3 + ((i * 37) % 60) / 10, z = -2 + ((i * 53) % 40) / 10, y = 3 - (((tt * 3 + i * 0.37) % 3)); return <mesh key={i} position={[x, y, z]}><boxGeometry args={[0.006, 0.16, 0.006]} /><meshBasicMaterial color="#9fb6d8" transparent opacity={0.5} /></mesh>; })}
      </Studio>
    </div>
    <div style={{ position: "absolute", left: cut - 2, top: 0, width: 4, height: 1080, background: "#f2ead8" }} />
    <Tag tt={tt} at={0.8} x={480} y={170} txt="SATURDAY, 2 PM" col={AMB} size={60} />
    <Tag tt={tt} at={1.4} x={1440} y={170} txt="TUESDAY, 2 AM" col={ICE} size={60} />
  </>;
}}</Stage>;

// 23 · la bolsa Faraday en corte: forro de malla de metal; las ondas pegan y rebotan, la llave adentro duerme
export const H3Faraday: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const waves = Array.from({ length: 5 }, (_, i) => (tt - 0.8 - i * 0.8)), FAB = "#3a3d44";
  const lining = (p: [number, number, number], r: [number, number, number], s: [number, number]) => <group position={p} rotation={r}>
    <mesh><planeGeometry args={s} /><meshStandardMaterial color="#c9ced4" metalness={1} roughness={0.28} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0, 0.002]}><planeGeometry args={[s[0], s[1], Math.round(s[0] * 40), Math.round(s[1] * 40)]} /><meshBasicMaterial color="#5b6068" wireframe /></mesh>
  </group>;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.1, 0.9, 2.7], l: [0.2, 0.25, 0], fov: 30 }, { t: 11, p: [0.7, 0.85, 1.9], l: [0.1, 0.25, 0], arc: 0.06 }]}>
      <group position={[0.35, 0, 0]}>
        <RB p={[0, 0.03, 0]} s={[1.1, 0.06, 0.7]} rad={0.03} c={FAB} r={0.95} />
        <RB p={[0, 0.3, -0.33]} s={[1.1, 0.6, 0.06]} rad={0.03} c={FAB} r={0.95} />
        <RB p={[-0.53, 0.3, 0]} s={[0.06, 0.6, 0.7]} rad={0.03} c={FAB} r={0.95} />
        <RB p={[0.53, 0.3, 0]} s={[0.06, 0.6, 0.7]} rad={0.03} c={FAB} r={0.95} />
        {lining([0, 0.3, -0.295], [0, 0, 0], [1.0, 0.54])}
        {lining([-0.495, 0.3, 0], [0, Math.PI / 2, 0], [0.62, 0.54])}
        {lining([0.495, 0.3, 0], [0, -Math.PI / 2, 0], [0.62, 0.54])}
        {lining([0, 0.065, 0], [-Math.PI / 2, 0, 0], [1.0, 0.62])}
        <Fob3 p={[0, 0.07, 0.05]} rot={[0, 0.4, 0]} s={0.9} led={0} dim={1} />
      </group>
      {waves.map((w, i) => w > 0 && w < 2.0 ? <mesh key={i} position={[-1.7 + Math.min(w, 1.0) * 1.35 - Math.max(0, w - 1.0) * 1.2, 0.3, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.32 + 0.08 * w, 0.018, 8, 40, Math.PI]} /><meshBasicMaterial color={w > 1.0 ? RED : ICE} toneMapped={false} transparent opacity={1 - w / 2.0} />
      </mesh> : null)}
    </Studio>
    <Tag tt={tt} at={0.8} x={1300} y={180} txt="METAL FABRIC INSIDE" col={TX0} size={60} />
    <Tag tt={tt} at={2.0} x={520} y={900} txt="BOUNCES OFF" col={ICE} size={62} />
  </>;
}}</Stage>;

// 24 · dos maneras de hablar: el botón manda UN golpe y se calla; la escucha late todo el tiempo
export const H3Channels: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split" three>{(tt) => {
  const press = c01(1 - Math.abs(tt - 1.4) / 0.25), shot = tt - 1.5, beat = (tt % 1.1) / 1.1;
  return <>
    <Studio tt={tt} night={0.4} keys={[{ t: 0, p: [0, 1.4, 3.4], l: [0, 0.3, 0], fov: 34 }, { t: 12, p: [0.4, 1.2, 3.0], l: [0, 0.35, 0], arc: 0.05 }]}>
      <Fob3 p={[-1.1, 0.0, 0.2]} rot={[0, 0.3, 0]} s={1.2} press={[press, 0, 0]} led={press} />
      {shot > 0 && shot < 1.6 && <mesh position={[-1.1 + shot * 1.0, 0.35, 0.2]}><sphereGeometry args={[0.07, 16, 16]} /><meshBasicMaterial color={AMB} toneMapped={false} /></mesh>}
      <Fob3 p={[1.1, 0.0, 0.2]} rot={[0, -0.3, 0]} s={1.2} led={beat < 0.15 ? 0.7 : 0} />
      <Rings3 p={[1.1, 0.12, 0.2]} k={tt * 0.9} n={3} r={1.0} col={ICE} rot={[Math.PI / 2, 0, 0]} op={0.8} />
      <RB p={[0, 0.3, -0.3]} s={[0.03, 0.6, 0.6]} rad={0.01} c="#f2ead8" r={0.6} />
    </Studio>
    <Tag tt={tt} at={1.6} x={480} y={180} txt="BUTTON: ONE SHOT" col={AMB} size={54} />
    <Tag tt={tt} at={2.4} x={1440} y={180} txt="HANDS-FREE: ALWAYS" col={ICE} size={54} />
  </>;
}}</Stage>;

// 25 · la manija no abre: la manija se tira y vuelve, la puerta queda trabada y por el vidrio el tablero dice que no encuentra la llave
export const H3Handle: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" three>{(tt) => {
  const pull = c01(spr(tt, 0.8, 9, 0.35)) * (1 - c01((tt - 2.0) / 0.3)), shake = tt > 1.0 && tt < 2.0 ? Math.sin(tt * 40) * 0.006 : 0, dash = useTxt(["KEY NOT", "DETECTED"], 512, 256, "#0b0f14", "#ff6a55", 64), showDash = sm(tt, 3.0, 3.8);
  return <>
    <Studio tt={tt} floor="concrete" keys={[{ t: 0, p: [1.2, 0.85, 2.4], l: [-0.1, 0.75, 0], fov: 34 }, { t: 3.0, p: [0.7, 0.9, 2.1], l: [-0.3, 0.85, 0], arc: 0.05 }, { t: 9, p: [0.3, 0.95, 1.9], l: [-0.4, 0.9, 0] }]}>
      <Wall3 p={[0, 1.5, -1.6]} s={[7, 3, 0.1]} kind="brick" />
      <group position={[shake, 0, 0]}>
        <RB p={[-0.3, 0.45, -0.05]} s={[2.2, 0.9, 0.1]} rad={0.04} c="#8a929c" r={0.25} m={0.6} />
        <RB p={[-0.3, 1.12, -0.07]} s={[2.0, 0.46, 0.04]} rad={0.04} c="#0d1116" r={0.05} m={0.6} op={0.55} />
        <RB p={[-0.3, 0.9, -0.03]} s={[2.2, 0.03, 0.12]} rad={0.01} c="#c9ced4" r={0.2} m={1} />
        <group position={[0.25, 0.7, 0.03 + 0.07 * pull]} rotation={[0.25 * pull, 0, 0]}><RB s={[0.36, 0.08, 0.06]} rad={0.03} c="#c9ced4" r={0.2} m={1} /></group>
      </group>
      <group position={[-0.45, 1.1, -0.02]} scale={0.6 + 0.4 * showDash}>
        <mesh><planeGeometry args={[0.6, 0.3]} /><meshBasicMaterial map={dash} toneMapped={false} transparent opacity={showDash} /></mesh>
      </group>
      <Pouch3 p={[0.9, 0.0, 0.5]} rot={[0, -0.5, 0]} s={0.6} />
    </Studio>
    <Tag tt={tt} at={1.4} x={1300} y={900} txt="STAYS LOCKED" col={RED} size={66} />
  </>;
}}</Stage>;

// 26 · la costura: una lupa pasa por la bolsa barata; en la costura hay un hueco y por ahí se escapa la señal
export const H3SeamLeak: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const mx = -0.6 + 0.85 * sm(tt, 0.6, 2.6), found = tt > 2.7, leak = tt - 3.0;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.0, 1.5, 2.2], l: [0, 0.2, 0], fov: 32 }, { t: 2.8, p: [0.3, 1.0, 1.4], l: [0.25, 0.2, 0.1], arc: 0.06 }, { t: 9, p: [0.6, 0.9, 1.6], l: [0.4, 0.3, 0.1] }]}>
      <Pouch3 p={[0, 0, 0]} s={1.6} col="#4a4d55" />
      <mesh position={[0.25, 0.16, 0.18]}><boxGeometry args={[0.025, 0.12, 0.02]} /><meshBasicMaterial color={found ? "#ffcf7a" : "#222"} toneMapped={false} /></mesh>
      <group position={[mx, 0.45, 0.25]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
        <mesh><torusGeometry args={[0.16, 0.025, 12, 40]} /><meshStandardMaterial color="#d6d9de" metalness={1} roughness={0.2} /></mesh>
        <mesh><circleGeometry args={[0.15, 40]} /><meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.02} thickness={0.1} transparent opacity={0.35} /></mesh>
        <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.025, 0.03, 0.18, 12]} /><meshStandardMaterial color="#6b4a2e" roughness={0.5} /></mesh>
      </group>
      {leak > 0 && <Rings3 p={[0.25, 0.16, 0.2]} k={leak * 0.9} n={2} r={0.4} col={RED} rot={[0, 0, 0]} />}
      <pointLight position={[0.25, 0.2, 0.3]} intensity={found ? 2 : 0} distance={0.8} color="#ffcf7a" />
    </Studio>
    <Tag tt={tt} at={2.9} x={1250} y={190} txt="A GAP IN THE SEAM" col={RED} size={60} />
    <Tag tt={tt} at={3.6} x={540} y={880} txt="$15 BAG" col={TX0} size={60} />
  </>;
}}</Stage>;

// 27 · cuatro guiños: LOCK sostenido, UNLOCK dos veces, la luz cuenta 1-2-3-4 y la llave se duerme
export const H3Blink4: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const hold = tt > 0.8 && tt < 3.2 ? 1 : 0, u1 = c01(1 - Math.abs(tt - 2.0) / 0.12), u2 = c01(1 - Math.abs(tt - 2.4) / 0.12);
  const n = tt < 3.4 ? 0 : Math.min(4, Math.floor((tt - 3.4) / 0.55) + 1), ledOn = tt > 3.4 && tt < 5.6 && ((tt - 3.4) % 0.55) < 0.22, sleep = sm(tt, 5.8, 6.8);
  return <>
    <Studio tt={tt} night={0.3 + 0.4 * sleep} keys={[{ t: 0, p: [0.0, 1.5, 1.8], l: [0, 0.1, 0], fov: 30 }, { t: 10, p: [0.4, 1.4, 1.7], l: [0, 0.1, 0], arc: 0.06 }]}>
      <Fob3 p={[0, 0, 0]} rot={[0, 0.1, 0]} s={2.0} press={[hold, u1 + u2, 0]} led={ledOn ? 1 : 0} dim={sleep} />
    </Studio>
    <div style={{ position: "absolute", left: 1500, top: 330, transform: "translateX(-50%)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 34 }}>
      {[1, 2, 3, 4].map((i) => <div key={i} style={{ width: 120, height: 120, borderRadius: 60, border: `7px solid ${AMB}`, background: n >= i ? AMB : "transparent", color: n >= i ? "#1a1208" : AMB, fontWeight: 900, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${n >= i ? 1 + 0.15 * c01(1 - ((tt - 3.4 - (i - 1) * 0.55) / 0.2)) : 0.85})`, boxShadow: "0 8px 26px rgba(0,0,0,.7)" }}>{i}</div>)}
    </div>
    {tt < 5.8 && <Tag tt={tt} at={1.0} x={420} y={800} txt="HOLD LOCK" col={TX0} size={60} />}
    {tt < 5.8 && <Tag tt={tt} at={2.0} x={420} y={900} txt="UNLOCK TWICE" col={TX0} size={60} />}
    <Tag tt={tt} at={6.0} x={420} y={860} txt="ASLEEP" col={ICE} size={72} />
  </>;
}}</Stage>;

// 28 · la llave quieta se duerme: un reloj de quietud da la vuelta; cada vez que se mueve, vuelve a cero
export const H3Still: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const bump = 2.6, since = tt < bump ? tt : tt - bump, frac = c01(since / (tt < bump ? 3.0 : 4.0)), jolt = c01(1 - Math.abs(tt - bump) / 0.25), sleep = tt > bump + 4.0;
  const ring = useMemo(() => new THREE.RingGeometry(0.5, 0.56, 64, 1, Math.PI / 2, -Math.PI * 2 * Math.max(0.001, frac)), [Math.round(frac * 120)]);
  return <>
    <Studio tt={tt} night={sleep ? 0.6 : 0.2} keys={[{ t: 0, p: [0.0, 1.9, 2.1], l: [0, 0.15, 0], fov: 32 }, { t: 10, p: [0.4, 1.9, 2.1], l: [0, 0.15, 0], arc: 0.06 }]}>
      <RB p={[0, -0.03, 0]} s={[1.8, 0.06, 1.2]} rad={0.02} c="#6b4a2e" r={0.6} />
      <group position={[0, 0.05 + 0.08 * jolt, 0]} rotation={[0, 0.2 + 0.4 * jolt, 0.2 * jolt]}><Fob3 s={1.4} led={sleep ? 0 : 0.3} dim={sleep ? 1 : 0} /></group>
      <mesh geometry={ring} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><meshBasicMaterial color={sleep ? ICE : AMB} toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </Studio>
    {tt < bump + 3.8 && <Tag tt={tt} at={bump + 0.1} x={960} y={160} txt="MOVED: BACK TO ZERO" col={RED} size={60} />}
    <Tag tt={tt} at={bump + 4.1} x={960} y={160} txt="STILL = ASLEEP" col={ICE} size={66} />
  </>;
}}</Stage>;

// 29 · los comentarios: las tarjetas de ustedes caen sobre la mesa y la respuesta de Ray se apoya encima
export const H3Comments: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop" three>{(tt) => {
  const c1 = useTxt(["Didn't work on", "my Honda."], 512, 256, "#f6f3ec", "#2a2c31", 56), c2 = useTxt(["The light never", "blinked."], 512, 256, "#f6f3ec", "#2a2c31", 56), c3 = useTxt(["Can't be shut", "off at night?"], 512, 256, "#f6f3ec", "#2a2c31", 56), ray = useTxt(["I LOOKED", "INTO IT."], 512, 256, "#1a1208", "#ffb257", 58);
  const cards = [{ m: c1, a: 0.4, p: [-0.62, 0.0, -0.32], r: 0.08 }, { m: c2, a: 1.2, p: [0.62, 0.0, -0.32], r: -0.08 }, { m: c3, a: 2.0, p: [-0.62, 0.0, 0.3], r: 0.05 }, { m: ray, a: 3.6, p: [0.62, 0.0, 0.3], r: -0.04 }];
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [0.0, 2.4, 1.4], l: [0, 0, -0.05], fov: 34 }, { t: 10, p: [0.3, 2.1, 1.3], l: [0, 0, 0], arc: 0.05 }]}>
      <RB p={[0, -0.04, 0]} s={[3.2, 0.06, 2.0]} rad={0.02} c="#7a5a3c" r={0.6} />
      {cards.map((c, i) => { const d = c01(spr(tt, c.a, 7, 0.5)); return d <= 0 ? null : <group key={i} position={[c.p[0], 0.01 + i * 0.006 + 0.9 * (1 - d), c.p[2]]} rotation={[-Math.PI / 2 + 0.6 * (1 - d), 0, c.r + 0.8 * (1 - d)]}>
        <mesh castShadow><boxGeometry args={[1.05, 0.52, 0.008]} /><meshStandardMaterial map={c.m} roughness={0.7} /></mesh>
      </group>; })}
    </Studio>
    <Tag tt={tt} at={0.6} x={960} y={150} txt="YOU ASKED" col={AMB} size={68} />
  </>;
}}</Stage>;

// 30 · el microondas: la llave adentro, la puerta cierra; el botón de encender queda tachado y la junta pierde
export const H3Microwave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris" three>{(tt) => {
  const door = 1 - sm(tt, 1.2, 2.2), xOn = sm(tt, 2.6, 3.2), leak = tt - 4.2;
  return <>
    <Studio tt={tt} keys={[{ t: 0, p: [1.3, 1.0, 2.6], l: [0, 0.4, 0], fov: 32 }, { t: 10, p: [0.7, 0.95, 2.5], l: [0.05, 0.4, 0], arc: 0.06 }]}>
      <RB p={[0, 0.4, -0.1]} s={[1.4, 0.8, 0.9]} rad={0.05} c="#b9b9b4" r={0.55} m={0.2} />
      <pointLight position={[-0.12, 0.6, 0.1]} intensity={1.2} distance={0.9} color="#ffe2b0" />
      <RB p={[-0.12, 0.4, -0.2]} s={[0.92, 0.66, 0.06]} rad={0.02} c="#3a3d44" r={0.6} />
      <Fob3 p={[-0.12, 0.08, 0.05]} rot={[0, 0.4, 0]} s={0.9} />
      <group position={[-0.58, 0.4, 0.38]} rotation={[0, -door * 1.6, 0]}><group position={[0.47, 0, 0]}>
        <RB p={[0, 0.3, 0]} s={[0.94, 0.1, 0.04]} rad={0.02} c="#1a1c20" r={0.3} m={0.4} /><RB p={[0, -0.3, 0]} s={[0.94, 0.1, 0.04]} rad={0.02} c="#1a1c20" r={0.3} m={0.4} /><RB p={[-0.42, 0, 0]} s={[0.1, 0.7, 0.04]} rad={0.02} c="#1a1c20" r={0.3} m={0.4} /><RB p={[0.42, 0, 0]} s={[0.1, 0.7, 0.04]} rad={0.02} c="#1a1c20" r={0.3} m={0.4} />
        <mesh position={[0, 0, 0.022]}><planeGeometry args={[0.7, 0.5]} /><meshStandardMaterial color="#0d0f12" roughness={0.1} metalness={0.3} transparent opacity={0.3} /></mesh>
      </group></group>
      <RB p={[0.55, 0.25, 0.37]} s={[0.18, 0.12, 0.04]} rad={0.02} c="#3a8a4a" r={0.4} e="#3a8a4a" ei={0.3} />
      <group position={[0.55, 0.25, 0.4]} scale={xOn}>
        <mesh rotation={[0, 0, 0.7]}><boxGeometry args={[0.28, 0.035, 0.01]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
        <mesh rotation={[0, 0, -0.7]}><boxGeometry args={[0.28, 0.035, 0.01]} /><meshBasicMaterial color={RED} toneMapped={false} /></mesh>
      </group>
      {leak > 0 && <Rings3 p={[-0.12, 0.74, 0.42]} k={leak * 0.8} n={2} r={0.7} col={ICE} rot={[0, Math.PI / 2, 0]} op={0.8} />}
    </Studio>
    <Tag tt={tt} at={2.8} x={1400} y={190} txt="NEVER TURN IT ON" col={RED} size={58} />
    <Tag tt={tt} at={4.4} x={520} y={880} txt="THE SEAL LEAKS" col={ICE} size={56} />
  </>;
}}</Stage>;

export const HEROES_3D: Record<string, React.FC<P>> = { startbtn: H3StartBtn, sunny: H3Sunny, faraday: H3Faraday, channels: H3Channels, handle: H3Handle, seamleak: H3SeamLeak, blink4: H3Blink4, still: H3Still, comments: H3Comments, microwave: H3Microwave };

