// lhh29d · componentes únicos 37-47: la receta 2-1-¾ de la masa de sal, bajo y lento, el ángel de 1962, la semana de la sal en la bandeja giratoria,
// la parrilla de Gus, la salmuera del frasco, la carne que guarda su jugo, la suela de zapato, los 145 grados, los 30 años pagando y la próxima: maicena.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn } from "./h3d";
import { Bowl, Carafe, Grains, Iron, Ornament, PorkChop, SERIF, Skillet, Stream, card, dialAng, dialFace, lg, saltMat } from "./saltkit";

const PI = Math.PI;
const flourTex = () => tex.text("flour", 64, 64, (g) => { g.fillStyle = "#f3ecdc"; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 200; i++) { g.fillStyle = "rgba(200,190,170,.5)"; g.fillRect(rn(i, 2) * 64, rn(i, 3) * 64, 1, 1); } });

// ---- 16:52 · DOS, UNO Y TRES CUARTOS: tres tazas medidoras se vuelcan en el bol: dos de harina, una de sal, y el agua al final ----
export const HRecipe211: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [-0.25, 0.1], el: [0.36, 0.3], r: [0.72, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="2 FLOUR · 1 SALT" col={AMB} /><Tag tt={tt} at={4.6} x={1450} y={840} txt="¾ CUP WATER" col={ICE} size={42} /></>}>{(tt) => {
  const cups = [{ x: -0.2, a: 0.4, col: "#f3ecdc", n: "2" }, { x: 0, a: 2.0, col: "#ffffff", n: "1" }, { x: 0.2, a: 3.6, col: "#bfe2f2", n: "¾" }];
  const fill = eio(tt, 0.6, 5.2);
  return <>
    <Bowl p={[0, 0, 0.12]} s={1.15} col="#e9dcc2" />
    <mesh position={[0, 0.02 + 0.05 * fill, 0.12]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07 + 0.06 * fill, 48]} /><meshStandardMaterial map={flourTex()} color={new THREE.Color("#ffffff").lerp(new THREE.Color("#e8dcc4"), eio(tt, 4.0, 5.4))} roughness={0.9} /></mesh>
    {cups.map((c, i) => { const tip = eio(tt, c.a, c.a + 0.6) * (1 - eio(tt, c.a + 1.2, c.a + 1.6)), lift = eio(tt, c.a - 0.3, c.a);
      return <group key={i} position={[lerp(c.x, c.x * 0.4, lift), 0.0 + 0.16 * lift, lerp(-0.12, 0.04, lift)]} rotation={[tip * 1.9, 0, 0]}>
        <mesh geometry={lg("mc" + i, [[0, 0], [0.04, 0], [0.045, 0.06], [0.047, 0.06], [0.042, 0]], 40)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
        {tip < 0.4 && <mesh position={[0, 0.028, 0]}><cylinderGeometry args={[0.041, 0.039, 0.05, 32]} />{i === 2 ? M.water({ op: 0.6 }) : i === 1 ? saltMat() : <meshStandardMaterial map={flourTex()} roughness={0.95} />}</mesh>}
        <mesh position={[0, 0.03, 0.047]}><planeGeometry args={[0.05, 0.04]} /><meshStandardMaterial map={card("cup" + c.n, 128, 100, [c.n + " CUP"], 40, "#2a1e12", "#f4ead2")} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 17:28 · BAJO Y LENTO: dos estrellas de masa; a 350 se inflan y se rajan; a 250 por dos horas quedan planas y duras ----
export const HLowSlow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.05, 0], az: [-0.05, 0.05], el: [0.42, 0.36], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="LOW AND SLOW" col={GRN} /><Tag tt={tt} at={0.8} x={560} y={860} txt="350° · TOO HOT" col={RED} size={42} />
    <Tag tt={tt} at={1.4} x={1360} y={860} txt="250° · 2 HOURS" col={GRN} size={42} /></>}>{(tt) => {
  const k = eio(tt, 1.0, 4.6);
  return <>{[-1, 1].map((s) => { const hot = s < 0;
    return <group key={s} position={[s * 0.16, 0, 0]}>
      <RBox s={[0.26, 0.008, 0.2]} p={[0, 0.004, 0]} r={0.003}>{M.steel({ col: "#9aa0a6" })}</RBox>
      <mesh position={[0, 0.0085, 0.05]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.012]} /><meshStandardMaterial color="#331008" emissive="#ff4a14" emissiveIntensity={hot ? 0.7 : 0.3} /></mesh>
      <Ornament kind="star" p={[0, 0.02, 0]} rot={[-PI / 2, 0, 0.2]} s={1.1} puff={hot ? k : 0} paint={0} />
      {hot && k > 0.6 && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0, 0.03 + 0.02 * k, 0]} rotation={[-PI / 2, 0, i * 1.26 + 0.3]}><planeGeometry args={[0.07 * (k - 0.6) * 2.5, 0.002]} /><meshBasicMaterial color="#5a3a1a" /></mesh>)}
      <pointLight position={[0, 0.12, 0.05]} color="#ff6a2a" intensity={hot ? 0.7 : 0.3} distance={0.4} />
    </group>; })}</>;
}}</Scene3D>;

// ---- 17:46 · SESENTA Y CUATRO AÑOS: el ángel de masa de 1962 cuelga de la rama del árbol y gira despacio entre las lucecitas ----
export const HAngel64: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#0e140f"
  cam={{ at: [0, 0.11, 0], az: [-0.2, 0.2], el: [0.08, 0.06], r: [0.5, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="64 YEARS OLD" col={AMB} /><Tag tt={tt} at={1.0} x={1450} y={840} txt="MY SON · 1962" col={AMB} size={42} /></>}>{(tt) => <>
  {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 2) * 6.28, y = 0.25 - rn(i, 3) * 0.3; return <mesh key={i} position={[Math.cos(a) * 0.22, y, -0.12 + Math.sin(a) * 0.08]} rotation={[0, a, -0.6]}><coneGeometry args={[0.03, 0.18, 6]} /><meshStandardMaterial color="#1f4a2a" roughness={0.9} /></mesh>; })}
  {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[(rn(i, 5) - 0.5) * 0.5, 0.3 - rn(i, 6) * 0.35, -0.08 + rn(i, 7) * 0.05]}><sphereGeometry args={[0.006, 10, 8]} />{M.glow({ col: ["#ffcf4a", "#ff6a4a", "#7ad0ff"][i % 3], op: 0.6 + 0.4 * Math.sin(tt * 2 + i) })}</mesh>)}
  <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.0008, 0.0008, 0.08, 4]} /><meshStandardMaterial color="#c8322a" /></mesh>
  <Ornament kind="angel" p={[0, 0.12, 0]} rot={[0, Math.sin(tt * 0.8) * 0.8, 0]} s={0.8} paint={0.85} col="#e8c46a" />
  <pointLight position={[0.28, 0.16, 0.06]} color="#ffcf8a" intensity={0.5} distance={0.6} />
</>}</Scene3D>;

// ---- 18:02 · LA SEMANA DE LA SAL: una bandeja giratoria de madera; cada cosa de la rutina rota al frente y se enciende con su día ----
const WEEK = ["EVERY MORNING", "MONDAY", "WEDNESDAY", "ONCE A MONTH", "SATURDAY"];
export const HSaltWeek: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.08, 0.05], az: [-0.05, 0.05], el: [0.42, 0.36], r: [0.82, 0.7], fov: 30 }}
  over={(tt) => { const i = Math.min(4, Math.max(0, Math.floor((tt - 0.3) / 2.0)));
    return <><Head tt={tt} kick="" title="MY SALT WEEK" col={AMB} /><Tag key={i} tt={tt - i * 2.0} at={0.4} x={1450} y={840} txt={WEEK[i]} col={GRN} size={44} /></>; }}>{(tt) => {
  const step = Math.min(4, Math.max(0, (tt - 0.3) / 2.0)), si = Math.floor(step), frac = step - si, rot = -(si + eio(frac, 0.0, 0.35)) * (PI * 2 / 5);
  const items = [<Skillet key="s" s={0.45} />, <group key="d"><mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.045, 32]} />{M.steel({})}</mesh>{[-0.015, 0, 0.015].map((x, j) => <mesh key={j} position={[x, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.005, 0.05]} /><meshBasicMaterial color="#222" /></mesh>)}</group>,
    <Carafe key="c" s={0.6} />, <Iron key="i" s={0.5} p={[0, 0.005, 0]} />, <PorkChop key="p" s={0.6} cook={0.8} juice={0.6} p={[0, 0.005, 0]} />];
  return <>
    <group rotation={[0, rot, 0]}>
      <mesh position={[0, 0.012, 0]}><cylinderGeometry args={[0.3, 0.3, 0.024, 64]} />{M.wood({ base: [150, 104, 64] })}</mesh>
      {items.map((it, i) => { const a = (i / 5) * PI * 2, on = i === si ? 1 : 0;
        return <group key={i} position={[Math.sin(a) * 0.2, 0.025, Math.cos(a) * 0.2]} rotation={[0, a, 0]}>
          {it}
          <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.075, 0.08, 40]} />{M.glow({ col: "#ffcf4a", op: 0.85 * on })}</mesh>
        </group>; })}
    </group>
    <Grains n={30} r={0.06} p={[0, 0.025, 0]} seed={31} />
  </>;
}}</Scene3D>;

// ---- 18:42 · EL SECRETO DE GUS: la parrilla del restaurante con llamas; el gorro blanco colgado y el cartel rojo encendido ----
export const HGus: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#120c0a"
  cam={{ at: [0, 0.1, 0], az: [0.3, 0.15], el: [0.32, 0.26], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="GUS TOLD ME THE SECRET" col={AMB} /><Tag tt={tt} at={1.4} x={1450} y={840} txt="DES MOINES" col={RED} size={42} /></>}>{(tt, u) => {
  const sign = cl((tt - 0.5) * 2) * (0.85 + 0.15 * Math.sin(tt * 13));
  return <>
    <RBox s={[0.5, 0.1, 0.3]} p={[0, 0.05, 0]} r={0.008}><meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.4} /></RBox>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-0.22 + i * 0.04, 0.102, 0]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.28, 8]} />{M.steel({ col: "#4a4a4a" })}</mesh>)}
    {Array.from({ length: 14 }, (_, i) => { const f = 0.5 + 0.5 * Math.sin(tt * 9 + i * 1.7); return <mesh key={i} position={[-0.2 + (i % 7) * 0.065, 0.085 + f * 0.01, i < 7 ? -0.06 : 0.06]} scale={[1, 0.6 + f * 0.6, 1]}><coneGeometry args={[0.014, 0.04, 8]} />{M.glow({ col: f > 0.5 ? "#ffb04a" : "#ff6a2a", op: 0.8 })}</mesh>; })}
    <PorkChop p={[0.02, 0.112, 0]} cook={eio(tt, 0.3, 4.0)} juice={0.7} s={1.1} />
    <pointLight position={[0, 0.16, 0.1]} color="#ff7a2a" intensity={0.55} distance={0.6} />
    {Array.from({ length: 14 }, (_, i) => { const q = ((tt * 0.9 + rn(i, 71)) % 1); return <mesh key={"sp" + i} position={[-0.15 + rn(i, 72) * 0.3 + Math.sin(q * 9 + i) * 0.02, 0.11 + q * 0.22, (rn(i, 73) - 0.5) * 0.2]}><sphereGeometry args={[0.009, 8, 6]} />{M.glow({ col: "#ffb04a", op: 0.95 * (1 - q) })}</mesh>; })}
    <mesh position={[-0.3, 0.24, -0.14]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.002, 8, 20, PI]} />{M.steel({})}</mesh>
    <group position={[-0.3, 0.1 + 0.006 * Math.sin(tt * 2), -0.14]} rotation={[0, 0, 0.06 * Math.sin(tt * 1.5)]} scale={1.15}>
      <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.045, 0.035, 0.08, 24]} /><meshStandardMaterial color="#f8f6f0" roughness={0.9} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.03, 0.09, Math.sin(i) * 0.03]}><sphereGeometry args={[0.03, 16, 12]} /><meshStandardMaterial color="#f8f6f0" roughness={0.9} /></mesh>)}
    </group>
    <mesh position={[0.12, 0.38, -0.2]}><planeGeometry args={[0.34, 0.08]} /><meshBasicMaterial map={tex.text("stk", 512, 120, (g) => { g.fillStyle = "#120c0a"; g.fillRect(0, 0, 512, 120); g.strokeStyle = "#ff3a2a"; g.lineWidth = 6; g.strokeRect(8, 8, 496, 104); g.fillStyle = "#ff4a3a"; g.font = "bold 64px " + SERIF; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("STEAKHOUSE", 256, 64); })} transparent opacity={sign} toneMapped={false} /></mesh>
    <pointLight position={[0.12, 0.38, -0.1]} color="#ff3a2a" intensity={1.2 * sign} distance={0.6} />
  </>;
}}</Scene3D>;

// ---- 18:53 · UN CUARTO DE GALÓN Y UN CUARTO DE TAZA: el frasco se llena hasta la marca, cae la sal, la cuchara revuelve y desaparece; a la heladera una hora ----
export const HBrine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [0.3, 0.1], el: [0.18, 0.14], r: [0.56, 0.46], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="1 QUART · ¼ CUP SALT" col={ICE} /><Tag tt={tt} at={2.0} x={1450} y={840} txt="1 HOUR · FRIDGE" col={AMB} size={42} /></>}>{(tt, u) => {
  const w = eio(u, 0.04, 0.2), s = cl((u - 0.2) / 0.14), stir = cl((u - 0.58) / 0.3), dis = eio(u, 0.58, 0.88), sp = tt * 6, dunk = eio(u, 0.36, 0.52);
  return <>
    <mesh geometry={lg("jar", [[0, 0], [0.075, 0], [0.08, 0.01], [0.08, 0.2], [0.065, 0.22], [0.065, 0.235]], 48)}>{M.glass({ op: 0.25 })}</mesh>
    <mesh position={[0, 0.003 + 0.085 * w, 0]} scale={[1, w + 0.01, 1]}><cylinderGeometry args={[0.077, 0.077, 0.17, 48]} />{M.water({ col: "#8cc4dc", op: 0.38 })}</mesh>
    {[0.17].map((y) => <mesh key={y} position={[0, y, 0.081]}><planeGeometry args={[0.05, 0.003]} /><meshBasicMaterial color="#2a1e12" /></mesh>)}
    <Stream tt={tt} p={[0.0, 0.42, 0]} y1={0.18} on={s > 0 && s < 1 ? 1 : 0} n={30} spread={0.02} />
    <Grains n={50} r={0.06} p={[0, 0.005, 0]} k={s} seed={33} s={0.004 * (1 - dis) + 0.0001} />
    {stir > 0 && stir < 1 && <group position={[Math.cos(sp) * 0.03, 0.17, Math.sin(sp) * 0.03]} rotation={[0.2 * Math.cos(sp), 0, 0.2 * Math.sin(sp)]}>
      <mesh><cylinderGeometry args={[0.004, 0.004, 0.25, 10]} />{M.steel({})}</mesh></group>}
    <PorkChop p={[lerp(0.22, 0, dunk), lerp(0.01, 0.07, dunk) + 0.12 * Math.sin(PI * dunk), lerp(0.04, 0, dunk)]} s={lerp(0.9, 0.75, dunk)} rot={[lerp(0, PI / 2, dunk), lerp(-0.6, 0, dunk), 0]} />
  </>;
}}</Scene3D>;

// ---- 19:15 · GUARDA SU PROPIO JUGO: corte de las fibras de la carne; entra la sal (chispitas), las fibras se hinchan y agarran las gotas; viene el calor y las gotas se quedan ----
export const HHoldJuice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, 0.03, 0], az: [0.15, 0.05], el: [0.2, 0.16], r: [0.42, 0.36], fov: 28 }}
  over={(tt) => <><Head tt={tt} kick="" title="IT HOLDS ITS OWN JUICE" col={GRN} /><Tag tt={tt} at={3.6} x={1450} y={840} txt="THEN THE HEAT" col={RED} size={42} /></>}>{(tt) => {
  const salt = eio(tt, 0.4, 2.0), swell = eio(tt, 1.2, 3.0), heat = eio(tt, 3.4, 4.4);
  return <>
    {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[-0.12 + i * 0.04, 0.03, 0]} rotation={[PI / 2, 0, 0]} scale={[1 + 0.18 * swell, 1, 1 + 0.18 * swell]}>
      <cylinderGeometry args={[0.016, 0.016, 0.2, 24]} /><meshPhysicalMaterial color={new THREE.Color("#e3a093").lerp(new THREE.Color("#c4843f"), heat)} roughness={0.5} clearcoat={0.5} /></mesh>)}
    {Array.from({ length: 30 }, (_, i) => { const st = 0.4 + rn(i, 2) * 1.2, u = cl((tt - st) / 0.8); if (u <= 0) return null;
      return <mesh key={i} position={[-0.13 + rn(i, 3) * 0.26, lerp(0.12, 0.05, u), (rn(i, 4) - 0.5) * 0.18]}><sphereGeometry args={[0.0022, 8, 6]} />{M.glow({ col: "#ffffff", op: 0.9 * (1 - u * 0.6) * salt })}</mesh>; })}
    {Array.from({ length: 18 }, (_, i) => { const x = -0.1 + (i % 6) * 0.04, z = -0.06 + Math.floor(i / 6) * 0.06, k = cl(swell * 2 - rn(i, 5));
      return <mesh key={i} position={[x, 0.052 + 0.004 * Math.sin(tt * 3 + i), z]} scale={k}><sphereGeometry args={[0.006, 12, 10]} />{M.water({ col: "#7fc8f0", op: 0.85 })}</mesh>; })}
    {heat > 0 && Array.from({ length: 8 }, (_, i) => { const u = ((tt * 0.8 + i / 8) % 1); return <mesh key={i} position={[-0.12 + i * 0.035, -0.04 + u * 0.03, 0.12]} scale={[1, 1 + u, 1]}><coneGeometry args={[0.01, 0.03, 8]} />{M.glow({ col: "#ff7a2a", op: 0.7 * heat * (1 - u) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 19:31 · NO MÁS SUELA DE ZAPATO: a la izquierda la costeleta gris y enroscada junto a una suela de zapato vieja; a la derecha la de la salmuera, jugosa ----
export const HShoeLeather: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.3]}
  cam={{ at: [0, 0.03, 0], az: [-0.05, 0.05], el: [0.5, 0.42], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NOT SHOE LEATHER" col={AMB} /><Tag tt={tt} at={0.6} x={560} y={860} txt="NO BRINE" col={RED} size={42} />
    <Tag tt={tt} at={1.4} x={1360} y={860} txt="ONE HOUR BRINE" col={GRN} size={42} /></>}>{(tt, u) => <>
  <group position={[-0.17, 0, 0]}>
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.13, 48]} />{M.porcelain({})}</mesh>
    <PorkChop p={[0, 0.012, 0]} rot={[0.12 * Math.sin(1), 0, 0.15]} cook={1} dry={eio(tt, 0.2, 1.8)} s={1.05} />
    <group position={[0.02, 0.0, -0.13]} rotation={[0, 0.3, 0]} scale={cl(phys(tt, 1.4, 6, 0.5))}>
      <RBox s={[0.15, 0.012, 0.055]} p={[0, 0.006, 0]} r={0.02}><meshStandardMaterial color="#4a3020" roughness={0.9} bumpMap={tex.paper(3, 2)} bumpScale={4} /></RBox></group>
  </group>
  <group position={[0.17, 0, 0]}>
    <mesh position={[0, 0.006, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.13, 48]} />{M.porcelain({})}</mesh>
    <PorkChop p={[0, 0.012, 0]} cook={0.9} juice={eio(tt, 0.6, 2.2)} s={1.1} />
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.1, 0.035, (rn(i, 3) - 0.5) * 0.06]}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ col: "#f3d68a", op: 0.9 * eio(tt, 1.0, 2.0) })}</mesh>)}
    {(() => { const d = eio(u, 0.62, 0.74), pd = eio(u, 0.72, 0.86); return <><mesh position={[0.04, lerp(0.07, 0.03, d), 0.02]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.018 * cl(u * 3), 18, 12]} /><meshPhysicalMaterial color="#f3c66a" roughness={0.05} clearcoat={1} transmission={0.3} emissive="#7a5010" emissiveIntensity={0.4} /></mesh>
      <mesh position={[0.04, 0.029, 0.02]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, pd)}><circleGeometry args={[0.03, 24]} />{M.water({ col: "#e8b44a", op: 0.9 })}</mesh></>; })()}
  </group>
</>}</Scene3D>;

// ---- 19:46 · 145 Y A DESCANSAR: el pinche entra en la costeleta; la aguja sube y se clava en la marca verde de 145; después cinco minutos de reposo ----
export const HPork145: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.07, 0], az: [0.35, 0.2], el: [0.3, 0.24], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="145° · THEN REST 5" col={GRN} /><Tag tt={tt} at={3.8} x={1450} y={840} txt="DON'T OVERCOOK" col={AMB} size={42} /></>}>{(tt) => {
  const ins = eio(tt, 0.2, 0.8), v = lerp(60, 145, eio(tt, 0.9, 3.2));
  return <>
    <RBox s={[0.4, 0.02, 0.26]} p={[0, 0.01, 0]} r={0.008}>{M.wood({ base: [170, 120, 74] })}</RBox>
    <PorkChop p={[0, 0.022, 0]} cook={0.95} juice={0.6} s={1.2} />
    <group position={[0.02, lerp(0.25, 0.05, ins), 0.01]}>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.12, 8]} />{M.steel({})}</mesh>
      <group position={[0, 0.13, 0]} rotation={[0.25, 0, 0]}>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.012, 48]} />{M.chrome({})}</mesh>
        <mesh position={[0, 0, 0.0065]}><circleGeometry args={[0.036, 48]} /><meshStandardMaterial map={dialFace("pork", 0, 200, 145)} roughness={0.5} /></mesh>
        <group position={[0, 0, 0.008]} rotation={[0, 0, -dialAng(v, 0, 200) + PI]}><mesh position={[0.014, 0, 0]}><boxGeometry args={[0.03, 0.002, 0.001]} /><meshBasicMaterial color="#b8322a" /></mesh></group>
      </group>
    </group>
    <group position={[-0.16, 0.06, -0.06]} rotation={[0, 0.5, 0]}><RBox s={[0.08, 0.06, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={5 * eio(tt, 3.6, 5.6)} p={[0, 0, 0.021]} r={0.022} w={0.03} /></group>
  </>;
}}</Scene3D>;

// ---- 20:03 · TREINTA AÑOS PAGÁNDOLE: el tenedor se apoya en el plato; al lado se apilan las cuentas de 30 aniversarios y el contador llega a 30 ----
export const HThirtyYears: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.06, 0], az: [-0.35, -0.1], el: [0.36, 0.3], r: [0.66, 0.56], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="30 YEARS OF PAYING" col={AMB} /><Tag tt={tt} at={5.4} x={1450} y={840} txt="MINE WERE BETTER" col={GRN} size={42} /></>}>{(tt) => {
  const n = 30 * eio(tt, 0.8, 5.0), fork = eio(tt, 0.2, 0.8);
  return <>
    <mesh position={[0.1, 0.006, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.12, 48]} />{M.porcelain({})}</mesh>
    <PorkChop p={[0.1, 0.012, 0.02]} cook={0.9} juice={0.6} s={0.9} />
    <group position={[0.22, 0.03 - fork * 0.018, 0.08]} rotation={[0, 0.5, 0.2 * (1 - fork)]}>
      <RBox s={[0.13, 0.004, 0.012]} p={[-0.05, 0.004, 0]} r={0.002}>{M.steel({})}</RBox>
      {[-1, 0, 1].map((k) => <RBox key={k} s={[0.04, 0.003, 0.003]} p={[0.04, 0.006, k * 0.006]} r={0.001}>{M.steel({})}</RBox>)}</group>
    {Array.from({ length: 30 }, (_, i) => { const k = cl(n - i); if (k <= 0) return null;
      return <RBox key={i} s={[0.09, 0.0035, 0.12]} p={[-0.16 + (rn(i, 2) - 0.5) * 0.01, 0.002 + i * 0.0036 + (1 - k) * 0.15, -0.02 + (rn(i, 3) - 0.5) * 0.01]} rot={[0, (rn(i, 4) - 0.5) * 0.2, 0]} r={0.001}>
        <meshStandardMaterial map={card("rcpt", 128, 170, ["STEAKHOUSE", "PORK CHOP · $"], 18, "#3a2a18", "#f6f1e2")} roughness={0.9} /></RBox>; })}
    <group position={[-0.16, 0.2, -0.1]}><RBox s={[0.09, 0.06, 0.04]} r={0.008}>{M.wood({ base: [120, 80, 50] })}</RBox>
      <DigitDrum v={Math.floor(n / 10) + Math.max(0, (n % 10) - 9)} p={[-0.019, 0, 0.021]} r={0.022} w={0.03} /><DigitDrum v={n % 10} p={[0.019, 0, 0.021]} r={0.022} w={0.03} /></group>
  </>;
}}</Scene3D>;

// ---- 21:39 · LA PRÓXIMA: MAICENA: la caja amarilla de almidón de maíz cae con peso, se abre la tapa y sale una nubecita blanca ----
const cornTex = () => tex.text("cornbox", 512, 640, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#1f3f7a"; g.fillRect(0, 60, 512, 150); g.fillStyle = "#ffffff"; g.font = "bold 92px " + SERIF; g.textAlign = "center"; g.fillText("CORN", 256, 165);
  g.fillStyle = "#1f3f7a"; g.font = "bold 84px " + SERIF; g.fillText("STARCH", 256, 330); g.fillStyle = "#b8322a"; g.font = "bold 40px " + SERIF; g.fillText("PURE · 16 OZ", 256, 420);
});
export const HNextCorn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.1, 0], az: [-0.3, 0.1], el: [0.24, 0.2], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="NEXT TIME" title="A BOX OF CORNSTARCH" col={AMB} /><Tag tt={tt} at={2.6} x={1450} y={840} txt="15 MORE JOBS" col={GRN} size={44} /></>}>{(tt) => {
  const k = phys(tt, 0.3, 7, 0.4), lid = eio(tt, 1.4, 2.0), puff = cl((tt - 1.8) / 2.5);
  return <>
    <group position={[0, (1 - cl(k)) * 0.4, 0]}>
      <RBox s={[0.12, 0.16, 0.06]} p={[0, 0.08, 0]} r={0.004}><meshStandardMaterial map={cornTex()} roughness={0.6} /></RBox>
      <group position={[0, 0.16, -0.03]} rotation={[-lid * 1.8, 0, 0]}><RBox s={[0.12, 0.004, 0.06]} p={[0, 0, 0.03]} r={0.002}><meshStandardMaterial color="#f2c230" roughness={0.6} /></RBox></group>
    </group>
    {puff > 0 && Array.from({ length: 14 }, (_, i) => { const u = cl(puff * 1.2 - i * 0.03); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.08 * (1 + u), 0.17 + u * 0.12 * rn(i, 3), (rn(i, 4) - 0.5) * 0.05]} scale={0.4 + u * 1.4}>
      <sphereGeometry args={[0.02, 12, 10]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.45 * (1 - u)} depthWrite={false} roughness={1} /></mesh>; })}
    <mesh position={[0.15, 0.003, 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.04, 32]} /><meshStandardMaterial color="#fbfaf7" roughness={1} /></mesh>
  </>;
}}</Scene3D>;
