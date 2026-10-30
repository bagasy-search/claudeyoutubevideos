// len29b · 2ª vuelta en 3D real (kit h3d): plano, dos codos, sismógrafo, taladro, dos remolinos, subte, mesa,
// reloj, hierro, lata, alfileres, ventilación, tres razones, sartén.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, coilTex, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const at = (pts: number[][], u: number) => { const p = curve(pts).getPointAt(cl(u)); return [p.x, p.y, p.z] as [number, number, number]; };
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };
const helix = (len: number, r: number, turns: number, ph = 0, n = 200) => { const o: number[][] = []; for (let i = 0; i <= n; i++) { const u = i / n, a = u * turns * 2 * PI + ph; o.push([u * len, r * Math.cos(a), r * Math.sin(a)]); } return o; };

// ---- 10:22 · UNA ESPIRAL DE MANO: sobre el plano azul se dibuja el contorno en tiza y la herramienta de verdad se materializa encima; el cable sale girando ----
const bpTex = () => tex.text("bp", 512, 512, (g) => {
  g.fillStyle = "#1d4f8f"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(220,235,255,.22)"; g.lineWidth = 1;
  for (let i = 0; i <= 512; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); }
  g.strokeStyle = "rgba(230,240,255,.55)"; g.lineWidth = 2; g.strokeRect(20, 20, 472, 472);
});
export const HBlueprint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f1a2a"
  cam={{ at: [0.05, 0.05, 0], az: [-0.35, 0.1], el: [0.78, 0.55], r: [1.32, 1.08], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A HAND AUGER" col={ICE} />}>{(tt) => {
  const draw = eio(tt, 0.4, 1.8), real = cl(phys(tt, 1.8, 6, 0.6)), spin = tt * 5 * cl((tt - 2.6) / 0.4), out = eio(tt, 2.6, 5.6);
  const ring: number[][] = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * 2 * PI * draw; ring.push([-0.2 + 0.16 * Math.cos(a), 0.003, 0.16 * Math.sin(a)]); }
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 1.0]} /><meshStandardMaterial map={bpTex()} roughness={0.9} /></mesh>
    {/* el contorno en tiza: círculo del tambor y la línea del cable */}
    {draw > 0.02 && <mesh geometry={tubeG("bpr" + Math.round(draw * 30), ring, 0.003, 64, 6)}>{M.glow({ col: "#eaf3ff", op: 0.85 * (1 - real * 0.7) })}</mesh>}
    {draw > 0.5 && <mesh geometry={tubeG("bpl" + Math.round(draw * 30), [[-0.04, 0.003, 0], [lerp(-0.04, 0.55, (draw - 0.5) * 2), 0.003, 0]], 0.003, 4, 6)}>{M.glow({ col: "#eaf3ff", op: 0.85 })}</mesh>}
    {/* la espiral de mano real: tambor rojo con manija que gira y el cable que sale por la nariz */}
    <group position={[-0.2, 0.09 * real, 0]} scale={real} rotation={[0, 0, 0]}>
      <group rotation={[0, 0, PI / 2]}><group rotation={[0, spin, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.15, 0.15, 0.1, 48]} />{M.plastic({ col: "#c2302a" })}</mesh>
        <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 24]} />{M.chrome()}</mesh>
        <mesh position={[0.09, -0.12, 0]}><cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />{M.chrome()}</mesh>
        <mesh position={[0.09, -0.19, 0]}><cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />{M.plastic({ col: "#222" })}</mesh>
      </group></group>
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.022, 0.035, 0.1, 24]} />{M.chrome()}</mesh>
    </group>
    {out > 0.01 && <mesh position={[-0.05, 0.09, 0]} geometry={tubeG("bpc" + Math.round(out * 40), helix(0.6 * out, 0.006, 60 * out, spin), 0.0045, 400, 6)} castShadow>{M.steel({ col: "#d0d4d8" })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 11:00 · EL GIRO ENCUENTRA LA CURVA: dos codos de vidrio iguales; en uno el cable entra derecho y se dobla contra la curva; en el otro gira y la pasa ----
const ELB = [[-0.3, 0, 0], [0.02, 0, 0], [0.1, 0.02, 0], [0.14, 0.1, 0], [0.15, 0.35, 0]];
export const HCorkscrew: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.3, 0], az: [-0.12, 0.12], el: [0.12, 0.08], r: [1.55, 1.42], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE TURN FINDS THE BEND" col={AMB} />}>{(tt) => {
  const push = eio(tt, 0.8, 2.2), jam = cl((tt - 2.2) / 0.3), shake = jam * (1 - cl((tt - 2.8) / 0.6)) * 0.008 * Math.sin(tt * 70);
  const go = eio(tt, 1.2, 4.6), spin = tt * 14;
  return <>
    {[-0.32, 0.32].map((x, side) => <group key={side} position={[x, 0.12, 0]}>
      <mesh geometry={tubeG("elb", ELB, 0.04, 60, 24)}>{M.glass({ op: 0.22 })}</mesh>
      {side === 0 ? <>
        {/* empujado sin girar: llega a la curva, se arquea y tiembla */}
        <mesh position={[shake, 0, 0]} geometry={tubeG("cs0" + Math.round(push * 20) + "_" + Math.round(jam * 6), [[-0.3, 0, 0], [lerp(-0.25, 0.02, push), 0.0 + 0.04 * jam, 0], [lerp(-0.2, 0.08, push), 0.01 - 0.02 * jam, 0]], 0.01, 30, 8)}>{M.steel({ col: "#d0d4d8" })}</mesh>
        {jam > 0 && <mesh position={[0.1, 0.02, 0.045]}><ringGeometry args={[0.02, 0.026, 32]} />{M.glow({ col: RED, op: 0.8 * (1 - cl((tt - 2.4) / 1.2)) })}</mesh>}
      </> : <>
        {/* girando: la punta de espiral entra en la curva y sube */}
        <mesh geometry={tubeG("cs1" + Math.round(go * 30), sub(ELB, go * 0.96, 40), 0.016, 60, 8)}><meshStandardMaterial map={coilTex()} metalness={0.9} roughness={0.25} color="#d0d4d8" /></mesh>
        <group position={at(ELB, go * 0.96)} rotation={[0, 0, 0]}><mesh rotation={[0, spin, 0]}><torusKnotGeometry args={[0.02, 0.006, 48, 6, 2, 3]} />{M.chrome()}</mesh></group>
        {go > 0.95 && <mesh position={[0.15, 0.36, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.05, 40]} />{M.glow({ col: ICE, op: 0.7 * (1 - cl((tt - 4.6) / 0.8)) })}</mesh>}
      </>}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 11:32 · BLANDO, COMO JABÓN MOJADO: un sismógrafo de tambor anota lo que siente el cable: recto liso, la curva dura, el tapón blando ----
const seisTex = (k: number) => tex.text("seis" + k, 1024, 256, (g) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 1024, 256); g.strokeStyle = "rgba(60,90,140,.25)"; g.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  g.strokeStyle = "#1b1b1b"; g.lineWidth = 3; g.beginPath();
  const N = Math.round(k / 40 * 1000);
  for (let x = 0; x <= N; x += 2) { const u = x / 1000; const y = u < 0.35 ? 2 * Math.sin(x * 0.4) : u < 0.55 ? 70 * Math.sin(x * 0.35) * Math.sin(PI * (u - 0.35) / 0.2) : 30 * Math.sin(x * 0.045); x ? g.lineTo(1024 - x, 128 + y) : g.moveTo(1024, 128 + y); }
  g.stroke();
});
export const HSeismo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" warm={0.9}
  cam={{ at: [0, 0.16, 0], az: [-0.35, -0.1], el: [0.3, 0.22], r: [0.9, 0.75], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="SOFT, LIKE WET SOAP" col={AMB} />}>{(tt) => {
  const k = Math.round(40 * eio(tt, 0.6, 5.8)), u = k / 40;
  const amp = u < 0.35 ? 0.002 * Math.sin(tt * 60) : u < 0.55 ? 0.03 * Math.sin(tt * 55) : 0.014 * Math.sin(tt * 7);
  return <>
    {/* el tambor de papel que gira */}
    <group position={[0, 0.16, 0]} rotation={[0, 0, PI / 2]}>
      <mesh rotation={[0, -u * 2 * PI * 0.9, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.42, 64, 1, true]} /><meshStandardMaterial map={seisTex(k)} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[0, s * 0.215, 0]}><cylinderGeometry args={[0.105, 0.105, 0.012, 48]} />{M.brass()}</mesh>)}
    </group>
    {[-1, 1].map((s) => <RBox key={s} s={[0.02, 0.2, 0.08]} r={0.004} p={[s * 0.24, 0.1, 0]}>{M.wood({ base: [96, 60, 32] })}</RBox>)}
    {/* el brazo de la aguja, que tiembla según lo que siente */}
    <group position={[0.0, 0.16 + amp, 0.26]}>
      <mesh position={[0, 0, -0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.16, 10]} />{M.brass()}</mesh>
      <mesh position={[0, 0, -0.155]} rotation={[-PI / 2, 0, 0]}><coneGeometry args={[0.006, 0.02, 12]} />{M.matte({ col: "#111" })}</mesh>
      <mesh position={[0, 0, 0.02]}><sphereGeometry args={[0.014, 16, 12]} />{M.brass()}</mesh>
    </group>
    <RBox s={[0.06, 0.18, 0.04]} r={0.006} p={[0, 0.09, 0.3]}>{M.wood({ base: [96, 60, 32] })}</RBox>
  </>;
}}</Scene3D>;

// ---- 12:40 · DESPACIO: el taladro sube al rojo y el cable latiguea contra la bacha; baja a lento y el cable gira prolijo ----
export const HDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="tile"
  cam={{ at: [0.1, 0.2, 0], az: [-0.35, -0.2], el: [0.3, 0.22], r: [1.1, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="GO SLOW" col={RED} />}>{(tt) => {
  const fast = eio(tt, 0.7, 1.5) * (1 - eio(tt, 3.4, 4.2)), v = 0.15 + 0.8 * fast;
  const whip: number[][] = []; for (let i = 0; i <= 40; i++) { const u = i / 40; whip.push([-0.12 + 0.55 * u, 0.2 - 0.12 * u + (0.02 + 0.12 * fast) * Math.sin(u * PI) * Math.sin(tt * (6 + 30 * fast) + u * 5), (0.1 * fast) * Math.sin(u * PI) * Math.cos(tt * (6 + 30 * fast) + u * 4)]); }
  return <>
    {/* la bacha de acero */}
    <group position={[0.42, 0.06, 0]}><mesh><cylinderGeometry args={[0.18, 0.1, 0.12, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh></group>
    {/* el taladro amarillo con su perilla de velocidad */}
    <group position={[-0.25, 0.2, 0]}>
      <RBox s={[0.22, 0.08, 0.07]} r={0.02} p={[0, 0, 0]}>{M.plastic({ col: "#f2c13a" })}</RBox>
      <RBox s={[0.06, 0.16, 0.06]} r={0.02} p={[-0.05, -0.1, 0]} rot={[0, 0, -0.2]}>{M.plastic({ col: "#222" })}</RBox>
      <mesh position={[0.13, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.02, 0.026, 0.05, 24]} />{M.chrome()}</mesh>
      <group position={[0.0, 0.0, 0.037]}>
        <mesh><circleGeometry args={[0.03, 40]} />{M.matte({ col: "#f4efe2" })}</mesh>
        <mesh position={[0.01, 0.017, 0.001]}><ringGeometry args={[0.02, 0.026, 40, 1, 0, PI * 0.45]} />{M.glow({ col: RED, op: 0.8 })}</mesh>
        <mesh position={[0, 0, 0.002]} rotation={[0, 0, PI * 1.2 - v * PI * 1.4]}><mesh position={[0.012, 0, 0]}><boxGeometry args={[0.025, 0.003, 0.001]} />{M.matte({ col: "#111" })}</mesh></mesh>
      </group>
      <pointLight position={[0.05, 0.06, 0.1]} intensity={0.4 * fast} distance={0.4} color="#ff6a4a" />
    </group>
    <mesh geometry={tubeG("dw" + Math.round(tt * 30), whip, 0.006, 80, 8)} castShadow>{M.steel({ col: "#d0d4d8" })}</mesh>
    {/* los golpes del cable en el borde de la bacha */}
    {fast > 0.6 && [0, 1, 2].map((i) => { const k = ((tt * 3 + i / 3) % 1); return <mesh key={i} position={[0.3, 0.12, 0.05]} rotation={[0, -0.6, 0]}><ringGeometry args={[0.01 + 0.06 * k, 0.014 + 0.06 * k, 32]} />{M.glow({ col: "#ffd38a", op: 0.6 * (1 - k) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 13:28 · LAS DOS A LA VEZ: la pileta doble en corte, llena; se destapan juntas y en cada una baja un embudo de remolino ----
const swirlTexB = () => tex.text("swirlb", 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512); g.translate(256, 256);
  for (let k = 0; k < 5; k++) { g.strokeStyle = `rgba(235,250,255,${0.3 + 0.1 * k})`; g.lineWidth = 9 - k; g.beginPath(); for (let a = 0; a < 13; a += 0.05) { const r = 250 - a * 18; const aa = a + k * 2 * PI / 5; g.lineTo(Math.cos(aa) * r, Math.sin(aa) * r); } g.stroke(); }
});
export const HTwinVortex: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="tile"
  cam={{ at: [0, 0.07, 0], az: [-0.1, 0.12], el: [0.24, 0.18], r: [1.3, 1.12], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="BOTH SIDES AT ONCE" col={ICE} />}>{(tt) => {
  const go = eio(tt, 0.8, 5.6), lvl = lerp(-0.02, -0.112, go), fun = cl((tt - 0.9) / 0.8) * (1 - cl((tt - 5.4) / 0.4)), W = 0.42, D = 0.36, FL = -0.12;
  return <group position={[0, 0.125, 0]}>
    <pointLight position={[0, 0.3, 0.1]} intensity={0.32} distance={1.2} color="#eef6ff" />
    {/* la mesada de acero con el divisor del medio */}
    {[[0, D / 2 + 0.05, 1.0, 0.1], [0, -D / 2 - 0.05, 1.0, 0.1]].map((b, i) => <RBox key={"m" + i} s={[b[2], 0.02, b[3]]} r={0.006} p={[b[0], 0.0, b[1]]}>{M.steel({ col: "#c3c8cc" })}</RBox>)}
    {[-0.47, 0, 0.47].map((x) => <RBox key={x} s={[x === 0 ? 0.06 : 0.06, 0.02, D]} r={0.006} p={[x, 0.0, 0]}>{M.steel({ col: "#c3c8cc" })}</RBox>)}
    {[-0.22, 0.22].map((x, i) => { const k = eio(tt, 1.0 + i * 0.2, 4.8 + i * 0.2), r = lerp(0.15, 0.0, k), a = tt * (5 + 2 * k) * (i ? -1 : 1) + i, sink = cl((tt - 4.8 - i * 0.2) / 0.4);
      return <group key={i} position={[x, 0, 0]}>
        {/* la bacha: piso y paredes de acero cepillado */}
        <mesh position={[0, FL, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[W, D]} />{M.steel({ col: "#a9aeb3" })}</mesh>
        {[-1, 1].map((s) => <mesh key={"x" + s} position={[s * W / 2, FL / 2, 0]} rotation={[0, s * PI / 2, 0]}><planeGeometry args={[D, -FL]} />{M.steel({ col: "#9da2a7", side: THREE.DoubleSide })}</mesh>)}
        {[-1].map((s) => <mesh key={"z" + s} position={[0, FL / 2, s * D / 2]}><planeGeometry args={[W, -FL]} />{M.steel({ col: "#9da2a7", side: THREE.DoubleSide })}</mesh>)}
        {/* el desagüe: aro cromado y boca oscura */}
        <mesh position={[0, FL + 0.003, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.032, 0.005, 10, 36]} />{M.chrome()}</mesh>
        <mesh position={[0, FL + 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.03, 32]} />{M.matte({ col: "#050607" })}</mesh>
        {/* el agua que baja sin parar, con la espiral que gira y el hoyuelo del centro */}
        {go < 0.995 && <mesh position={[0, (lvl + FL) / 2, 0]}><boxGeometry args={[W - 0.004, Math.max(0.002, lvl - FL), D - 0.004]} />{M.water({ col: "#5ab4ea", op: 0.55, emI: 0.35 })}</mesh>}
        {go < 0.995 && <mesh position={[0, lvl + 0.002, 0]} rotation={[-PI / 2, 0, a * 0.6]}><circleGeometry args={[0.17, 64]} /><meshBasicMaterial map={swirlTexB()} transparent opacity={0.75 * (1 - go * 0.6)} depthWrite={false} /></mesh>}
        {fun > 0 && <mesh position={[0, lvl - 0.025 * fun, 0]} rotation={[PI, a, 0]}><coneGeometry args={[0.06, 0.05 * fun + 0.001, 32, 1, true]} /><meshStandardMaterial map={coilTex()} color="#8fd0f4" transparent opacity={0.7} side={THREE.DoubleSide} roughness={0.08} /></mesh>}
        {/* lo que gira hasta el agujero: una moneda en una, un mechón en la otra */}
        {sink < 1 && <group position={[Math.cos(a) * r, Math.max(FL + 0.004, lvl - 0.004) - 0.04 * sink, Math.sin(a) * r]} rotation={[0, -a, 0]} scale={1 - sink}>
          {i === 0 ? <mesh rotation={[0.3, 0, 0.2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.003, 32]} />{M.brass({ col: "#c9a34a" })}</mesh>
            : <Hair id="tvh" n={16} spread={0.012} r={0.0015} pts={[[-0.04, 0, 0], [-0.01, 0.004, 0.012], [0.02, 0, -0.008], [0.045, 0.003, 0.01]]} />}
        </group>}
      </group>; })}
  </group>;
}}</Scene3D>;

// ---- 14:06 · TRES LÍNEAS, UNA TRAMPA: de la pileta, el triturador y el lavavajillas bajan tres caños; por cada uno viaja lo suyo y todo para en el sifón, que se enciende ----
const L3 = [[[-0.5, 0.6, 0], [-0.5, 0.35, 0], [-0.25, 0.18, 0], [0, 0.12, 0]], [[0, 0.6, 0], [0, 0.12, 0]], [[0.5, 0.6, 0], [0.5, 0.35, 0], [0.25, 0.18, 0], [0, 0.12, 0]]];
export const HTransit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="dark"
  cam={{ at: [0, 0.34, 0], az: [-0.15, 0.15], el: [0.12, 0.08], r: [1.92, 1.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THREE LINES, ONE TRAP" col={AMB} />}>{(tt) => {
  const cols = ["#5a3a1c", "#f2ecd8", "#e3cf8c"], lite = cl((tt - 4.2) / 0.6);
  return <>
    {L3.map((p, i) => <mesh key={i} geometry={tubeG("l3" + i, p, 0.03, 60, 20)}>{M.glass({ op: 0.22 })}</mesh>)}
    <mesh position={[-0.5, 0.64, 0]}><cylinderGeometry args={[0.12, 0.04, 0.08, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <group position={[0, 0.66, 0]}><mesh><cylinderGeometry args={[0.07, 0.06, 0.12, 32]} />{M.steel({ col: "#55595e" })}</mesh></group>
    <RBox s={[0.2, 0.16, 0.16]} r={0.01} p={[0.5, 0.68, 0]}>{M.steel({ col: "#b9bec3" })}</RBox>
    {/* el sifón: una U abajo que se enciende cuando todo llega */}
    <mesh geometry={tubeG("l3u", [[0, 0.12, 0], [0, 0.04, 0], [0.04, 0.0, 0], [0.1, 0.0, 0], [0.14, 0.04, 0], [0.14, 0.09, 0], [0.4, 0.09, 0]], 0.034, 60, 20)}>{M.chrome({ em: "#ffb040", emI: 0.6 * lite })}</mesh>
    {/* lo que viaja por cada caño: borra, arroz, grasa, en fila */}
    {L3.map((p, i) => Array.from({ length: 5 }, (_, j) => { const u = cl((tt - 0.8 - i * 0.35 - j * 0.32) / 1.6); if (u <= 0) return null; const q = u < 1 ? at(p, u) : [0.0 + 0.012 * (j - 2), 0.045 + 0.012 * i, 0.01 * (i - 1)] as [number, number, number]; return <mesh key={i + "_" + j} position={q}>{i === 1 ? <capsuleGeometry args={[0.006, 0.014, 4, 8]} /> : <sphereGeometry args={[i === 2 ? 0.014 : 0.01, 14, 10]} />}{M.grease({ col: cols[i] })}</mesh>; }))}
  </>;
}}</Scene3D>;

// ---- 14:49 · LA MESA DEL PLOMERO: vista desde arriba con luz cálida; caen de a uno el pavo, la salsera, las cáscaras y la sartén con grasa ----
export const HDinnerTable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#120d09" warm={0.55}
  cam={{ at: [0, 0.03, 0.02], az: [0.2, -0.05], el: [1.0, 1.12], r: [1.25, 1.08], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="THE PLUMBER'S TABLE" col={AMB} />}>{(tt) => {
  const land = (a: number) => { const k = cl(phys(tt, a, 8, 0.45)); return { y: 0.12 * (1 - k), s: 0.7 + 0.3 * k, on: tt > a }; };
  const fl = 0.9 + 0.1 * Math.sin(tt * 2 * PI * 1.6) * Math.sin(tt * 2 * PI * 0.7);
  const tk = land(0.6), gv = land(1.5), pl = land(2.3), pn = land(3.1);
  return <>
    {/* la mesa de madera oscura y la vela que la ilumina */}
    <RBox s={[1.3, 0.04, 0.9]} r={0.01} p={[0, -0.02, 0]}>{M.wood({ base: [86, 52, 30] })}</RBox>
    <group position={[-0.42, 0, -0.28]}>
      <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.04, 0.045, 0.012, 32]} />{M.brass()}</mesh>
      <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 0.12, 20]} />{M.matte({ col: "#efe3c6" })}</mesh>
      <mesh position={[0, 0.145, 0]} scale={[1, 1.8 * fl, 1]}><sphereGeometry args={[0.009, 14, 10]} />{M.glow({ col: "#ffc46a" })}</mesh>
      <pointLight position={[0, 0.2, 0]} intensity={0.34 * fl} distance={1.6} color="#ffb060" castShadow />
    </group>
    {/* el pavo asado en su fuente: cuerpo dorado, alas y patas con hueso */}
    {tk.on && <group position={[0, tk.y, 0]} scale={tk.s}>
      <mesh position={[0, 0.01, 0]} scale={[1, 0.1, 0.72]}><sphereGeometry args={[0.24, 48, 20]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.075, 0]} scale={[1.25, 0.72, 0.95]} castShadow><sphereGeometry args={[0.11, 48, 28]} /><meshPhysicalMaterial color="#9a5a24" roughness={0.38} clearcoat={0.9} /></mesh>
      <mesh position={[-0.02, 0.105, 0]} scale={[1.0, 0.5, 0.75]}><sphereGeometry args={[0.1, 40, 24]} /><meshPhysicalMaterial color="#b8742e" roughness={0.35} clearcoat={0.9} /></mesh>
      {[-1, 1].map((s) => <group key={s}>
        <mesh position={[-0.03, 0.07, s * 0.1]} scale={[1.2, 0.5, 0.45]} castShadow><sphereGeometry args={[0.06, 28, 16]} /><meshPhysicalMaterial color="#8e4f1e" roughness={0.4} clearcoat={0.8} /></mesh>
        <mesh position={[0.13, 0.07, s * 0.05]} rotation={[0, s * 0.2, -1.2]} castShadow><capsuleGeometry args={[0.03, 0.06, 8, 16]} /><meshPhysicalMaterial color="#a25e24" roughness={0.38} clearcoat={0.85} /></mesh>
        <mesh position={[0.19, 0.095, s * 0.06]} rotation={[0, 0, -1.2]}><cylinderGeometry args={[0.008, 0.008, 0.04, 12]} />{M.matte({ col: "#f2ead8" })}</mesh>
        <mesh position={[0.205, 0.103, s * 0.062]}><sphereGeometry args={[0.012, 14, 10]} />{M.matte({ col: "#f6f0e2" })}</mesh>
      </group>)}
    </group>}
    {/* la salsera con asa y pico, llena de grasa que brilla */}
    {gv.on && <group position={[0.36, gv.y, -0.18]} scale={gv.s}>
      <mesh position={[0, 0.035, 0]} scale={[1.5, 0.7, 1]} castShadow><sphereGeometry args={[0.05, 32, 16, 0, PI * 2, PI / 2, PI / 2]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]} scale={[1.45, 0.95, 1]}><circleGeometry args={[0.046, 32]} />{M.grease({ col: "#8a5a22" })}</mesh>
      <mesh position={[0.085, 0.04, 0]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.018, 0.04, 16, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[-0.08, 0.04, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.006, 10, 24, PI]} />{M.porcelain()}</mesh>
      <mesh position={[0, 0.002, 0]} scale={[1, 0.1, 0.7]}><sphereGeometry args={[0.1, 32, 12]} />{M.porcelain()}</mesh>
    </group>}
    {/* el montón de cáscaras de papa en su plato */}
    {pl.on && <group position={[-0.34, pl.y, 0.16]} scale={pl.s}>
      <mesh position={[0, 0.008, 0]} castShadow><cylinderGeometry args={[0.11, 0.09, 0.014, 48]} />{M.porcelain()}</mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.12, 0.022 + 0.008 * rn(i, 4), (rn(i, 2) - 0.5) * 0.12]} rotation={[PI / 2 + (rn(i, 5) - 0.5), 0, rn(i, 3) * 6]} castShadow><torusGeometry args={[0.02, 0.006, 6, 16, PI * 1.3]} />{M.matte({ col: i % 3 ? "#b08850" : "#8a6638" })}</mesh>)}
    </group>}
    {/* la sartén de hierro con la grasa blanca cuajada */}
    {pn.on && <group position={[0.3, pn.y, 0.2]} scale={pn.s}>
      <mesh position={[0, 0.022, 0]} castShadow><cylinderGeometry args={[0.11, 0.095, 0.044, 48, 1, true]} />{M.steel({ col: "#2a2a2a", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.095, 0.095, 0.004, 48]} />{M.steel({ col: "#2a2a2a" })}</mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.096, 40]} />{M.grease({ col: "#e8d898" })}</mesh>
      <mesh position={[-0.19, 0.035, 0]} rotation={[0, 0, PI / 2 + 0.1]} castShadow><cylinderGeometry args={[0.013, 0.013, 0.17, 12]} />{M.matte({ col: "#1a1a1a" })}</mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 15:39 · ONCE PILETAS EN UNA NOCHE: un reloj de pared con vidrio corre de las 4 de la tarde a las 2 de la mañana; once chinches rojas caen sobre el aro ----
export const HClockPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="wood" bg="#1a1410"
  cam={{ at: [0, 0.6, -1.5], az: [-0.18, 0.12], el: [0.04, 0.02], r: [1.02, 1.0], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="11 SINKS IN ONE NIGHT" col={RED} />}>{(tt) => {
  const hrs = 4 + 10 * eio(tt, 0.6, 6.0), Z = -1.56;
  return <group position={[0, 0.6, Z]}>
    <mesh rotation={[PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.04, 64]} />{M.matte({ col: "#3a2a1c" })}</mesh>
    <mesh position={[0, 0, 0.021]}><circleGeometry args={[0.215, 64]} />{M.matte({ col: "#f4efe2" })}</mesh>
    {Array.from({ length: 12 }, (_, i) => { const a = PI / 2 - i / 12 * 2 * PI; return <mesh key={i} position={[Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0.023]} rotation={[0, 0, a]}><planeGeometry args={[i % 3 ? 0.014 : 0.03, 0.006]} />{M.matte({ col: "#1b1b1b" })}</mesh>; })}
    <mesh position={[0, 0, 0.026]} rotation={[0, 0, -hrs / 12 * 2 * PI]}><mesh position={[0, 0.05, 0]}><boxGeometry args={[0.012, 0.1, 0.002]} />{M.matte({ col: "#1b1b1b" })}</mesh></mesh>
    <mesh position={[0, 0, 0.028]} rotation={[0, 0, -hrs * 2 * PI]}><mesh position={[0, 0.075, 0]}><boxGeometry args={[0.006, 0.15, 0.002]} />{M.matte({ col: "#1b1b1b" })}</mesh></mesh>
    <mesh position={[0, 0, 0.03]}><circleGeometry args={[0.01, 20]} />{M.brass()}</mesh>
    <mesh position={[0, 0, 0.045]} scale={[1, 1, 0.12]}><sphereGeometry args={[0.218, 48, 16, 0, PI * 2, 0, PI / 2]} />{M.glass({ op: 0.14 })}</mesh>
    {/* las once chinches: caen de a una sobre el aro, en la hora de cada llamada */}
    {Array.from({ length: 11 }, (_, i) => { const a0 = 0.9 + i * 0.46, k = cl(phys(tt, a0, 9, 0.35)); if (tt < a0) return null; const hh = 4.5 + i * 0.85, a = PI / 2 - hh / 12 * 2 * PI, R = 0.245;
      return <group key={i} position={[Math.cos(a) * R, Math.sin(a) * R + 0.25 * (1 - k), 0.05]}>
        <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, 0.012]} castShadow><cylinderGeometry args={[0.014, 0.018, 0.018, 20]} />{M.plastic({ col: "#d2302a" })}</mesh>
        <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.004]}><cylinderGeometry args={[0.002, 0.001, 0.016, 8]} />{M.steel()}</mesh>
      </group>; })}
  </group>;
}}</Scene3D>;

// ---- 16:27 · EL PELO ES EL ESQUELETO: un bloque de grasa traslúcido se parte en dos y adentro el pelo corre como varillas de hormigón ----
export const HRebar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0, 0.1, 0], az: [-0.45, -0.2], el: [0.35, 0.28], r: [0.98, 0.84], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="HAIR IS THE BONES" col={AMB} />}>{(tt) => {
  const sp = eio(tt, 1.6, 3.0) * 0.14, glow = cl((tt - 3.0) / 0.6);
  return <>
    {[-1, 1].map((s) => <group key={s} position={[s * (0.0 + sp), 0.1, 0]} rotation={[0, 0, s * 0.08 * sp / 0.14]}>
      <RBox s={[0.2, 0.18, 0.18]} r={0.02} p={[s * 0.1, 0, 0]}>{M.grease({ col: "#e8d79c", op: 0.55 })}</RBox>
    </group>)}
    {/* el pelo: hebras largas que atraviesan el bloque de punta a punta */}
    {Array.from({ length: 7 }, (_, i) => { const y = 0.05 + 0.1 * rn(i, 2), z = (rn(i, 3) - 0.5) * 0.12; return <Hair key={i} id={"rb" + i} pts={[[-0.22, y, z], [-0.1, y + 0.02 * Math.sin(i), z + 0.01], [0, y - 0.01, z], [0.1, y + 0.015, z - 0.01], [0.22, y, z]]} n={4} spread={0.006} r={0.0018} col={glow > 0 ? "#4a2e18" : "#3a2618"} />; })}
    {glow > 0 && <mesh position={[0, 0.1, 0.095]}><planeGeometry args={[0.02 + 0.2 * glow, 0.004]} />{M.glow({ col: AMB, op: 0.6 * (1 - glow * 0.5) })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 17:20 · LA PILETA ES PARA EL AGUA: la lata de café de Stan en corte, bajo la pileta; mes a mes la grasa sube en capas y se pone blanca y dura ----
export const HStanCan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" warm={0.9}
  cam={{ at: [0, 0.14, 0], az: [0.5, 0.25], el: [0.22, 0.18], r: [0.86, 0.8], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE SINK IS FOR WATER" col={AMB} />}>{(tt) => {
  const lay = ["#c9963c", "#d6aa52", "#e0c070", "#ead296", "#f1e2b8", "#f6efdc"], hgt = 0.035;
  return <>
    {/* la lata: cuerpo con un cuarto cortado para ver adentro */}
    <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.1, 0.1, 0.26, 64, 1, true, PI * 0.25, PI * 1.5]} />{M.steel({ col: "#9aa0a6", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.1005, 0.1005, 0.14, 64, 1, true, PI * 0.25, PI * 1.5]} />{M.matte({ col: "#2f5f9a", side: THREE.DoubleSide })}</mesh>
    {[0.004, 0.256].map((y, i) => <mesh key={i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.004, 8, 64]} />{M.steel()}</mesh>)}
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.1, 0.1, 0.004, 64]} />{M.steel({ col: "#80868c" })}</mesh>
    {/* las capas de sebo: una por mes, de ámbar líquido a blanco duro */}
    {lay.map((c, i) => { const k = cl(phys(tt, 0.7 + i * 0.75, 7, 0.6)); if (k <= 0.01) return null; return <mesh key={i} position={[0, 0.004 + hgt * i + hgt * k / 2, 0]}><cylinderGeometry args={[0.096, 0.096, hgt * k, 64, 1, false, PI * 0.25, PI * 1.5]} />{M.grease({ col: c, side: THREE.DoubleSide })}</mesh>; })}
    {/* los dos cortes planos de la capa, para que se lean de frente */}
    {lay.map((c, i) => { const k = cl(phys(tt, 0.7 + i * 0.75, 7, 0.6)); if (k <= 0.01) return null; return [PI * 0.25, PI * 1.75].map((a, j) => <mesh key={i + "_" + j} position={[Math.sin(a) * 0.048, 0.004 + hgt * i + hgt * k / 2, Math.cos(a) * 0.048]} rotation={[0, a + PI / 2, 0]}><planeGeometry args={[0.096, hgt * k]} />{M.grease({ col: c, side: THREE.DoubleSide })}</mesh>); })}
  </>;
}}</Scene3D>;

// ---- 18:24 · LA CURVA DE LA PARED: la pared de yeso en corte con el caño de cobre; caen diez alfileres y nueve quedan clavados en la curva ----
const CU = [[-0.6, 0.3, 0], [-0.1, 0.3, 0], [0.05, 0.28, 0], [0.12, 0.2, 0], [0.14, 0.0, 0]];
export const HPins10: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#16181b"
  cam={{ at: [0, 0.22, 0], az: [-0.2, 0.15], el: [0.18, 0.12], r: [1.12, 1.0], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE TURN IN THE WALL" col={AMB} />}>{(tt) => {
  return <>
    {/* la pared en corte: yeso, montantes de madera */}
    <mesh position={[0, 0.25, -0.08]}><planeGeometry args={[1.6, 0.9]} />{M.matte({ col: "#e8e3d8" })}</mesh>
    {[-0.5, 0.3].map((x, i) => <RBox key={i} s={[0.05, 0.9, 0.1]} r={0.004} p={[x, 0.25, -0.03]}>{M.wood({ base: [190, 150, 100] })}</RBox>)}
    <mesh geometry={tubeG("cu", CU, 0.035, 80, 24)} castShadow>{M.brass({ col: "#c87a4a" })}</mesh>
    {/* diez alfileres caen; nueve se clavan en la curva, uno pasa de largo */}
    {Array.from({ length: 10 }, (_, i) => { const a = 0.8 + i * 0.4, k = cl(phys(tt, a, 9, 0.35)); if (tt < a) return null;
      const miss = i === 6, u = 0.55 + 0.4 * (i / 9), p = at(CU, u), y = miss ? lerp(0.9, -0.3, cl((tt - a) / 0.8)) : p[1] + 0.035 + 0.5 * (1 - k);
      return <group key={i} position={[miss ? -0.3 : p[0] + 0.01 * (rn(i, 1) - 0.5), y, 0.03 + 0.01 * (rn(i, 2) - 0.5)]} rotation={[0, 0, (rn(i, 3) - 0.5) * 0.5]}>
        <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.002, 0.0006, 0.06, 8]} />{M.chrome()}</mesh>
        <mesh position={[0, 0.062, 0]}><sphereGeometry args={[0.009, 16, 12]} />{M.plastic({ col: ["#d2302a", "#2b6fd6", "#e6c23a"][i % 3] })}</mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 19:20 · MIRÁ LA VENTILACIÓN: la casa en corte; el aire entra por el caño del techo y baja, hasta que un nido de pájaro tapa la boca y el aire se corta ----
export const HRoofVent: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#1c2430"
  cam={{ at: [0, 0.6, 0], at1: [0.1, 0.86, 0], az: [-0.2, 0.1], el: [0.2, 0.34], r: [2.1, 1.5], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="CHECK THE VENT" col={ICE} />}>{(tt) => {
  const nest = cl(phys(tt, 3.0, 8, 0.45)), flow = 1 - cl((tt - 3.1) / 0.5);
  const VP = [[0.1, 1.14, 0], [0.1, 0.2, 0]];
  return <>
    {/* la casa: paredes de madera, techo a dos aguas, piso */}
    <mesh position={[0, 0.4, -0.15]}><planeGeometry args={[1.0, 0.8]} />{M.wood({ base: [176, 132, 86], rx: 3, ry: 1 })}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.27, 0.93, 0]} rotation={[0, 0, -s * 0.55]} castShadow><boxGeometry args={[0.62, 0.03, 0.4]} />{M.matte({ col: "#5a3226" })}</mesh>)}
    <RBox s={[1.04, 0.03, 0.4]} r={0.004} p={[0, 0.0, 0]}>{M.wood({ base: [120, 80, 46] })}</RBox>
    {/* la pileta abajo y el caño de ventilación que sube hasta el techo */}
    <RBox s={[0.26, 0.2, 0.2]} r={0.01} p={[-0.1, 0.11, 0]}>{M.wood({ base: [140, 96, 56] })}</RBox>
    <mesh geometry={tubeG("rv", VP, 0.025, 20, 20)}>{M.pvc()}</mesh>
    <mesh geometry={tubeG("rvs", [[-0.1, 0.2, 0], [0.1, 0.2, 0]], 0.022, 10, 16)}>{M.pvc()}</mesh>
    {/* el aire: anillitos que bajan por el caño mientras está abierto */}
    {Array.from({ length: 8 }, (_, i) => { const k = ((tt * 0.6 + i / 8) % 1); return <mesh key={i} position={[0.1, lerp(1.14, 0.24, k), 0.026]}><ringGeometry args={[0.014, 0.022, 20]} />{M.glow({ col: "#cfe8ff", op: 0.8 * flow * Math.sin(PI * k) })}</mesh>; })}
    {/* el nido: ramitas que caen y tapan la boca */}
    {tt > 2.9 && <group position={[0.1, 1.16 + 0.3 * (1 - nest), 0]} scale={2.2}>
      {Array.from({ length: 22 }, (_, i) => <mesh key={i} rotation={[PI / 2 + (rn(i, 1) - 0.5) * 0.6, 0, rn(i, 2) * 6]}><torusGeometry args={[0.03 + 0.012 * rn(i, 3), 0.002, 5, 20, PI * (1 + rn(i, 4))]} />{M.matte({ col: ["#7a5a32", "#9a7442", "#5a4024"][i % 3] })}</mesh>)}
      {[0, 1].map((j) => <mesh key={j} position={[-0.008 + j * 0.016, 0.012, 0]} scale={[1, 1.25, 1]}><sphereGeometry args={[0.009, 14, 10]} />{M.porcelain({ col: "#cfe0e6" })}</mesh>)}
    </group>}
    {nest > 0.9 && <mesh position={[0.1, 0.6, 0.03]}><ringGeometry args={[0.03, 0.036, 32]} />{M.glow({ col: RED, op: 0.6 * Math.abs(Math.sin(tt * 4)) })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 20:52 · TRES RAZONES: tres pedestales con foco; de a uno gira hacia cámara su objeto: la otra pileta, la manguera del lavavajillas y la ventilación ----
const plateTex = (n: number) => tex.text("ped" + n, 128, 128, (g) => { g.fillStyle = "#1b1b1b"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#e0bc62"; g.font = "900 96px Georgia"; g.textAlign = "center"; g.fillText(String(n), 64, 100); });
export const HThreeReasons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" key1={[0, 2.4, 1.2]}
  cam={{ at: [0, 0.24, 0], az: [-0.12, 0.12], el: [0.14, 0.1], r: [1.5, 1.3], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="3 REASONS IT FAILS" col={RED} />}>{(tt) => {
  const X = [-0.42, 0, 0.42];
  return <>
    {X.map((x, i) => { const a = 0.8 + i * 1.3, k = cl(phys(tt, a, 6, 0.55)), on = cl((tt - a) / 0.4), spin = (1 - k) * PI * 1.5 + 0.3 * Math.sin(tt * 0.8);
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.1, 0.11, 0.14, 48]} />{M.matte({ col: "#2a2c30" })}</mesh>
        <mesh position={[0, 0.07, 0.106]}><planeGeometry args={[0.07, 0.07]} /><meshStandardMaterial map={plateTex(i + 1)} roughness={0.4} metalness={0.3} /></mesh>
        <pointLight position={[0, 0.45, 0.22]} intensity={0.4 * on} distance={0.6} color="#fff0dc" />
        <group position={[0, 0.14 + 0.25 * (1 - k), 0]} rotation={[0, spin, 0]} scale={on}>
          {i === 0 && <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.09, 0.04, 0.08, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>}
          {i === 1 && <mesh position={[0, 0.06, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.055, 0.012, 12, 40]} />{M.rubber({ col: "#3a3d42" })}</mesh>}
          {i === 2 && <group><mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.025, 0.025, 0.12, 24]} />{M.pvc()}</mesh><mesh position={[0, 0.125, 0]}><cylinderGeometry args={[0.04, 0.03, 0.02, 24]} />{M.pvc({ col: "#d8d4c8" })}</mesh></group>}
        </group>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 21:40 · LIMPIÁ LA SARTÉN PRIMERO: una servilleta arrugada barre la grasa de la sartén y se va al tacho; la sartén queda brillando ----
export const HPanWipe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.14, 0.05, 0], az: [-0.2, 0.15], el: [0.7, 0.55], r: [1.2, 1.08], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="WIPE THE PAN FIRST" col={AMB} />}>{(tt) => {
  const sw = eio(tt, 1.0, 3.0), toss = eio(tt, 3.3, 4.3), shine = cl((tt - 3.0) / 0.8);
  const nx = lerp(-0.1, 0.1, sw), napk = toss > 0 ? [lerp(0.1, 0.42, toss), 0.05 + 0.2 * Math.sin(PI * toss), lerp(0, 0.05, toss)] : [nx, 0.035, 0.04 * Math.sin(sw * PI * 3)];
  return <>
    {/* la sartén negra */}
    <group position={[-0.05, 0, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.15, 0.13, 0.04, 64, 1, true]} />{M.matte({ col: "#262626", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.13, 0.13, 0.004, 64]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.5 - 0.35 * shine} /></mesh>
      <mesh position={[-0.25, 0.03, 0]} rotation={[0, 0, PI / 2 + 0.08]}><cylinderGeometry args={[0.014, 0.014, 0.2, 16]} />{M.matte({ col: "#1a1a1a" })}</mesh>
      {/* la grasa: se achica a medida que la servilleta pasa */}
      {sw < 0.98 && <mesh position={[lerp(0, 0.06, sw), 0.0055, 0]} rotation={[-PI / 2, 0, 0]} scale={[1 - sw, 1 - sw * 0.6, 1]}><circleGeometry args={[0.12, 48]} />{M.grease({ col: "#e3cf8c" })}</mesh>}
    </group>
    {/* la servilleta arrugada, que se mancha de amarillo */}
    {tt > 0.6 && <group position={napk as [number, number, number]} rotation={[0.3 * toss, toss * 4, 0.2]} scale={cl(phys(tt, 0.6, 7, 0.5))}>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.04, (rn(i, 2) - 0.5) * 0.02, (rn(i, 3) - 0.5) * 0.04]} rotation={[rn(i, 4) * 3, rn(i, 5) * 3, 0]} castShadow><icosahedronGeometry args={[0.028, 0]} />{M.matte({ col: sw > 0.5 ? "#f0e2b0" : "#f6f3ea" })}</mesh>)}
    </group>}
    {/* el tacho */}
    <group position={[0.45, 0, 0.05]}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.09, 0.08, 0.16, 40, 1, true]} />{M.steel({ col: "#7d8288", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.08, 0.08, 0.004, 40]} />{M.steel({ col: "#6a6e72" })}</mesh>
    </group>
    {shine > 0 && <mesh position={[0.0, 0.007, -0.03]} rotation={[-PI / 2, 0, -0.6]}><planeGeometry args={[0.18 * shine, 0.012]} />{M.glow({ col: "#ffffff", op: 0.35 * shine })}</mesh>}
  </>;
}}</Scene3D>;
