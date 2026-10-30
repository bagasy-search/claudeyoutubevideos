// len29a · 3ª vuelta en 3D (tanda 4): 25 pies, pop-up, carta, red de pelo, PVC, hierro comido, sopapo.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { DigitDrum, Hair, M, RBox, Scene3D, cl, curve, eio, hexNutG, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const sub = (c: THREE.CatmullRomCurve3, u: number, n = 40) => { const o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.001, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };

// ---- 12:27 · LOS 25 PIES: el cable sale del tambor, baja por la casa, dobla en la pared y corre por el piso; cada 5 pies una marca; en 25, la calle ----
const OP = [[-0.62, 0.42, 0], [-0.5, 0.42, 0], [-0.44, 0.38, 0], [-0.44, 0.1, 0], [-0.38, 0.04, 0], [0.75, 0.03, 0]];
export const HOdometer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="wood"
  cam={{ at: [-0.02, 0.24, 0], at1: [0.12, 0.3, 0], az: [-0.18, 0.1], el: [0.2, 0.12], r: [2.1, 1.78], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="ALL 25 FEET" col={AMB} />}>{(tt) => {
  const c = curve(OP), go = eio(tt, 0.6, 5.2), u = lerp(0.04, 1, go), ft = 25 * go, spin = tt * 8;
  return <>
    <mesh geometry={tubeG("oglass", OP, 0.032, 160, 24)}>{M.glass({ op: 0.18 })}</mesh>
    <mesh geometry={tubeG("ocab" + Math.round(u * 120), sub(c, u, 60), 0.012, 90, 10)}>{M.chrome({ col: "#d9dde1" })}</mesh>
    {(() => { const p = c.getPointAt(u); return <mesh position={[p.x, p.y, p.z]}><sphereGeometry args={[0.02, 20, 14]} />{M.chrome({ em: "#ffffff", emI: 0.15 })}</mesh>; })()}
    {/* el tambor rojo con su manivela */}
    <group position={[-0.72, 0.42, 0]}>
      <mesh rotation={[PI / 2, 0, spin * (go < 1 ? 1 : 0)]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.09, 48]} />{M.plastic({ col: "#c2302a" })}</mesh>
      <mesh position={[0, 0, 0.05]}><cylinderGeometry args={[0.03, 0.03, 0.02, 24]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.25, 0]}><boxGeometry args={[0.04, 0.34, 0.04]} />{M.matte({ col: "#1a1a1c" })}</mesh>
    </group>
    {/* la pared y el piso de la casa en corte */}
    <RBox s={[0.04, 0.6, 0.3]} r={0.004} p={[-0.36, 0.3, -0.05]}>{M.matte({ col: "#cbbfa8" })}</RBox>
    <mesh position={[0.7, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.4, 0.4]} />{M.matte({ col: "#2c2d30" })}</mesh>
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.56 + i * 0.1, 0.004, 0.12]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.05, 0.012]} />{M.glow({ col: "#f2c230", op: cl((ft - 24) / 1) })}</mesh>)}
    {/* las marcas cada 5 pies a lo largo del caño */}
    {[0.2, 0.4, 0.6, 0.8, 1].map((m, i) => { const p = c.getPointAt(Math.min(m, 0.999)), on = cl((u - m) / 0.04 + 1); return <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, PI / 2, i < 2 ? PI / 2 : 0]}><torusGeometry args={[0.042, 0.005, 8, 32]} />{M.glow({ col: on >= 1 ? AMB : "#555", op: 0.4 + 0.6 * on })}</mesh>; })}
    {/* el contador de rodillos grande: decenas y unidades */}
    <group position={[0.4, 0.44, 0.12]} scale={1.7}>
      <RBox s={[0.3, 0.17, 0.12]} r={0.016} p={[0, 0, -0.03]}>{M.brass({ col: "#b8873a" })}</RBox>
      <mesh position={[0, 0, 0.031]}><planeGeometry args={[0.24, 0.12]} />{M.matte({ col: "#121212" })}</mesh>
      <DigitDrum v={Math.floor(ft / 10) + cl((ft % 10 - 9) * 1)} p={[-0.055, 0, 0]} r={0.058} w={0.09} />
      <DigitDrum v={ft % 10} p={[0.055, 0, 0]} r={0.058} w={0.09} />
      {[-1, 1].map((k) => <RBox key={k} s={[0.27, 0.05, 0.012]} r={0.004} p={[0, k * 0.052, 0.064]}>{M.brass({ col: "#b8873a" })}</RBox>)}
    </group>
  </>;
}}</Scene3D>;

// ---- 13:16 · EL POP-UP EN CORTE: la varilla de atrás baja, el pivote se inclina y el tapón sube con su anillo de mugre; la tuerca cae y el tapón sale entero ----
export const HPopup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="tile"
  cam={{ at: [0.08, 0.3, 0], at1: [0.08, 0.38, 0], az: [0.45, 0.3], el: [0.1, 0.08], r: [0.8, 0.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE POP-UP" col={ICE} />}>{(tt) => {
  const lift = eio(tt, 0.7, 1.6), nut = cl((tt - 2.6) / 0.6), nutFall = cl((tt - 3.2) / 0.5), out = eio(tt, 4.0, 5.6);
  const tilt = -0.35 * lift * (1 - nut), up = 0.07 * lift + 0.12 * out;
  return <>
    {/* la bacha de porcelana y el caño del desagüe de vidrio */}
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.055, 0.1, 56, 1, true]} />{M.porcelain({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.045, 0.045, 0.3, 40, 1, true]} />{M.glass({ op: 0.14 })}</mesh>
    {/* el tapón: hongo cromado con su vástago y el anillo de mugre */}
    <group position={[0, 0.43 + up, 0]} scale={[1.5, 1.3, 1.5]}>
      <pointLight position={[0.1, 0.02, 0.18]} intensity={0.3} distance={0.5} color="#fff0d8" />
      <mesh castShadow><cylinderGeometry args={[0.055, 0.05, 0.016, 40]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.008, 0.008, 0.18, 16]} />{M.chrome()}</mesh>
      <mesh position={[0, -0.12, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.024, 0.017, 14, 36]} />{M.grease({ col: "#6a4a22" })}</mesh>
      {out > 0.2 && <Hair id="pop" n={14} spread={0.014} r={0.0016} pts={[[0, -0.17, 0], [0.01, -0.21, 0.01], [-0.01, -0.26, 0], [0.005, -0.3, 0.01]]} />}
    </group>
    {/* el pivote horizontal que atraviesa el caño y la varilla vertical de atrás */}
    <group position={[0.22 * out, lerp(0.27, 0.012, out), 0.06 * out]} rotation={[0, 0, tilt * (1 - out)]}>
      <mesh rotation={[0, 0, PI / 2]} position={[0.12, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.3, 12]} />{M.chrome()}</mesh>
      <mesh position={[0.05, 0, 0]}><sphereGeometry args={[0.018, 20, 14]} />{M.plastic({ col: "#222" })}</mesh>
    </group>
    <mesh position={[0.26, 0.42 - 0.08 * lift, -0.02]}><cylinderGeometry args={[0.005, 0.005, 0.3, 12]} />{M.chrome()}</mesh>
    {/* la tuerca del pivote: se desenrosca hacia afuera y cae con sombra */}
    <mesh position={[0.07 + 0.06 * nut, 0.27 - 0.255 * nutFall * nutFall + (nutFall >= 1 ? 0.01 * Math.abs(Math.sin((tt - 3.7) * 12)) * Math.exp(-(tt - 3.7) * 5) : 0), 0]} rotation={[0, 0, PI / 2 + nut * 6]} geometry={hexNutG(0.034, 0.024, 0.01)} castShadow>{M.chrome()}</mesh>
  </>;
}}</Scene3D>;

// ---- 14:40 · LA CARTA: el sobre llega girando, se abre la solapa, sale la tarjeta escrita a mano con el mechón pegado con cinta ----
const cardTex = () => tex.text("card", 512, 360, (g) => {
  g.fillStyle = "#f6f0de"; g.fillRect(0, 0, 512, 360); g.strokeStyle = "rgba(90,120,170,.35)"; g.lineWidth = 2;
  for (let y = 70; y < 360; y += 46) { g.beginPath(); g.moveTo(24, y); g.lineTo(488, y); g.stroke(); }
  g.fillStyle = "#1f2a52"; g.font = "italic 600 46px Georgia"; g.fillText("Lenny —", 40, 60); g.fillText("how much hair", 40, 152); g.fillText("is too much?", 40, 198);
});
export const HLetter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" lamp={[0.2, 0.6, 0.5]} warm={0.42}
  cam={{ at: [0, 0.22, 0], at1: [0, 0.25, 0.12], az: [0.25, -0.15], el: [0.62, 0.3], r: [1.32, 1.02], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="HOW MUCH HAIR?" col={AMB} />}>{(tt) => {
  const arr = cl(phys(tt, 0.1, 5, 0.6)), flap = eio(tt, 1.4, 2.2), card = eio(tt, 2.2, 3.6), sw = Math.sin(tt * 2.6) * 0.25 * cl(card * 2);
  return <>
    <group position={[0, 0.01, 0]} rotation={[-PI / 2 + 0.0, 0, (1 - arr) * 2.4]} scale={0.4 + 0.6 * arr}>
      <RBox s={[0.42, 0.28, 0.008]} r={0.003}>{M.matte({ col: "#e8d9b6" })}</RBox>
      <mesh position={[0.12, -0.06, 0.005]}><planeGeometry args={[0.06, 0.07]} />{M.matte({ col: "#b84a3a" })}</mesh>
      {/* la solapa triangular que gira hacia atrás sobre el borde de arriba */}
      <group position={[0, 0.14, 0.006]} rotation={[-PI * flap * 0.95, 0, 0]}>
        <mesh position={[0, -0.0, 0]} rotation={[0, 0, PI]}><circleGeometry args={[0.21, 3, -PI / 2 + PI / 3 * 0, PI * 2]} />{M.matte({ col: "#dcc9a2", side: THREE.DoubleSide })}</mesh>
      </group>
    </group>
    {/* la tarjeta sale del sobre y viene al frente, de pie */}
    <group position={[0, 0.02 + 0.22 * card, 0.06 * card]} rotation={[-PI / 2 * (1 - card) - 0.15 * card, 0, 0]}>
      <RBox s={[0.36, 0.25, 0.004]} r={0.002}>{M.matte({ col: "#e4dcc6" })}</RBox>
      <mesh position={[0, 0, 0.0025]}><planeGeometry args={[0.36, 0.25]} /><meshStandardMaterial map={cardTex()} roughness={0.95} color="#d8d0bc" /></mesh>
      {/* el mechón pegado con cinta, colgando y balanceándose */}
      <mesh position={[0.1, -0.1, 0.004]} rotation={[0, 0, 0.2]}><planeGeometry args={[0.07, 0.025]} /><meshPhysicalMaterial color="#fffbe8" transparent opacity={0.55} roughness={0.2} clearcoat={1} /></mesh>
      <group position={[0.085, -0.1, 0.008]} rotation={[0, 0, sw]}>
        <Hair id="lt" n={26} spread={0.014} r={0.0013} pts={[[0, 0, 0], [0.01, -0.06, 0.01], [-0.01, -0.13, 0.015], [0.006, -0.2, 0.01]]} />
      </group>
      <group position={[0.12, -0.1, 0.008]} rotation={[0, 0, -sw * 0.8 + 0.06]}>
        <Hair id="lt2" n={22} spread={0.012} r={0.0013} col="#6b4a2e" pts={[[0, 0, 0], [-0.008, -0.05, 0.012], [0.01, -0.11, 0.016], [-0.004, -0.17, 0.01]]} />
      </group>
    </group>
  </>;
}}</Scene3D>;

// ---- 15:11 · LA RED DE PELO: la cámara adentro del caño; las hebras se tienden de a una y tejen la red; la grasa y los granos quedan presos ----
export const HHairNet: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0b0d10" key1={[0.2, 0.6, 0.9]} warm={0.35}
  cam={{ at: [0, 0, -0.25], az: [0.12, -0.12], el: [0.08, -0.04], r: [0.62, 0.42], fov: 36 }}
  over={(tt) => <Head tt={tt} kick="" title="HAIR IS THE NET" col={AMB} />}>{(tt) => {
  const N = 12, Z = -0.22;
  const net = (i: number) => cl((tt - 0.5 - i * 0.24) / 0.35);
  const caught = cl((tt - 3.0) / 0.1);
  return <>
    <mesh position={[0, 0, -0.1]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 1.6, 48, 1, true]} />{M.glass({ op: 0.07, col: "#7d8a94", side: THREE.BackSide })}</mesh>
    <mesh position={[0, -0.13, -0.1]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.2, 1.6]} />{M.water({ op: 0.4 })}</mesh>
    <pointLight position={[0, 0.08, -0.05]} intensity={0.35} distance={0.6} color="#ffe2b0" />
    {/* las 12 hebras gruesas que cruzan el caño de pared a pared */}
    {Array.from({ length: N }, (_, i) => { const k = net(i); if (k <= 0) return null; const r = 0.155, vert = i % 2 === 1, c = (Math.floor(i / 2) / 5 - 0.5) * 0.2 + 0.012 * (rn(i, 3) - 0.5);
      const half = Math.sqrt(Math.max(r * r - c * c, 0.0004)), dz = 0.004 * (vert ? 1 : -1);
      const hit = tt > 1.9 ? Math.sin((tt - 1.9) * 7 + i * 1.3) * Math.exp(-((tt - 1.9) % 0.64) * 3) : 0, sway = Math.round((-0.03 * caught * (1 - Math.abs(c) / r) - 0.014 * hit) * 400) / 400, droop = 0.03 * (1 - k);
      const P = (u: number) => { const q = -half + 2 * half * u, b = 1 - (q / half) ** 2, sg = droop * Math.sin(PI * u); return vert ? [c + sg, q, Z + dz + sway * b] : [q, c - sg, Z + dz + sway * b]; };
      return <mesh key={i} geometry={tubeG(`hn${i}_${Math.round(k * 20)}_${sway}`, [P(0), P(0.25 * k), P(0.5 * k), P(0.75 * k), P(k)], 0.0034, 30, 6)} castShadow>{M.hair({ col: "#2a1f17" })}</mesh>; })}
    {/* la grasa dorada y los granos que bajan y quedan presos en la red; las gotas de agua apenas pasan */}
    {Array.from({ length: 22 }, (_, i) => { const a = 1.6 + i * 0.16, k = cl((tt - a) / 1.3); if (k <= 0) return null; const stop = i % 4 !== 0;
      const z = stop ? lerp(0.5, Z + 0.025 + 0.01 * rn(i, 5), Math.min(1, k * 1.3)) : lerp(0.5, -0.9, k), x = (rn(i, 6) - 0.5) * 0.2, y = (rn(i, 7) - 0.5) * 0.2;
      return <mesh key={i} position={[x, y, z]} rotation={[rn(i, 8) * 3, rn(i, 9) * 3, 0]}>{i % 4 === 0 ? <sphereGeometry args={[0.008, 12, 10]} /> : i % 3 ? <sphereGeometry args={[0.014 + 0.008 * rn(i, 10), 16, 12]} /> : <capsuleGeometry args={[0.005, 0.016, 4, 8]} />}
        {i % 4 === 0 ? M.water({ op: 0.8 }) : i % 3 ? M.grease({ col: "#a8822e" }) : M.matte({ col: "#f2efe6" })}</mesh>; })}
    {caught > 0 && null}
  </>;
}}</Scene3D>;

// ---- 16:04 · LA PAVA Y EL TERMÓMETRO: agua hirviendo en el caño blanco; el mercurio pasa la raya del PVC; el caño se comba y gotea por la junta ----
export const HThermo: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="counter" wall="tile"
  cam={{ at: [-0.16, 0.37, 0], az: [-0.26, 0.12], el: [0.2, 0.15], r: [1.9, 1.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="PVC SOFTENS" col={RED} />}>{(tt) => {
  const tilt = eio(tt, 0.6, 1.4) * (1 - eio(tt, 5.5, 6.3)), pour = tilt > 0.6, merc = eio(tt, 1.2, 4.0), sag = eio(tt, 3.6, 6.2), drip = cl((tt - 5.3) / 0.8);
  const Y = 0.2, pts = [[-0.45, Y, 0], [-0.2, Y - 0.02 * sag, 0], [0.05, Y - 0.06 * sag, 0], [0.3, Y - 0.02 * sag, 0], [0.48, Y, 0]];
  const lineH = 0.22, mh = 0.04 + 0.3 * merc, passed = cl((0.04 + 0.3 * merc - lineH) / 0.03);
  return <>
    {/* el caño blanco de PVC entre dos soportes; se comba en el medio */}
    <mesh geometry={tubeG("pvc" + Math.round(sag * 30), pts, 0.035, 80, 28)} castShadow>{M.pvc()}</mesh>
    <mesh position={[-0.45, Y + 0.08, 0]}><cylinderGeometry args={[0.04, 0.04, 0.16, 32, 1, true]} />{M.pvc({ side: THREE.DoubleSide })}</mesh>
    {[-0.42, 0.45].map((x) => <RBox key={x} s={[0.05, Y - 0.035, 0.08]} r={0.006} p={[x, (Y - 0.035) / 2, 0]}>{M.wood({ base: [140, 92, 52] })}</RBox>)}
    <mesh position={[0.48, Y, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.042, 0.042, 0.04, 32]} />{M.pvc({ col: "#dedad0" })}</mesh>
    <mesh position={[0.05, Y - 0.06 * sag, 0]} rotation={[0, 0, PI / 2 + 0.25 * sag * 0]}><cylinderGeometry args={[0.042, 0.042, 0.05, 32]} />{M.pvc({ col: "#dedad0" })}</mesh>
    {(() => { const g = cl((tt - 4.2) / 1.0), f = cl((tt - 5.2) / 0.4); return g > 0 && f < 1 ? <mesh position={[0.05, Y - 0.06 * sag - 0.05 - 0.012 * g - 0.15 * f * f, 0.01]} scale={[1, 1.25 + 0.3 * g, 1]}><sphereGeometry args={[0.006 + 0.016 * g, 20, 14]} />{M.water({ op: 0.92, emI: 0.5 })}</mesh> : null; })()}
    {[0, 1].map((j) => { const k = cl((tt - 5.7 - j * 0.5) / 0.4); return k > 0 && k < 1 ? <mesh key={"d" + j} position={[0.05, Y - 0.06 * sag - 0.05 - 0.15 * k * k, 0.01]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.014, 16, 12]} />{M.water({ op: 0.9, emI: 0.5 })}</mesh> : null; })}
    {sag > 0.4 && <mesh position={[0.05, 0.003, 0.01]} rotation={[-PI / 2, 0, 0]} scale={0.3 + 0.7 * cl((tt - 4.8) / 1.5)}><circleGeometry args={[0.05, 32]} />{M.water({ op: 0.5 })}</mesh>}
    {/* la pava cromada a la izquierda, se inclina y vuelca con vapor */}
    <group position={[-0.66, 0.5, 0]} rotation={[0, 0, -0.8 * tilt]} scale={2.1}>
      <mesh castShadow scale={[1, 0.85, 1]}><sphereGeometry args={[0.09, 32, 24]} />{M.chrome()}</mesh>
      <mesh position={[0, 0.08, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.05, 0.008, 10, 32, PI]} />{M.matte({ col: "#1a1a1a" })}</mesh>
      <mesh position={[0.1, 0.02, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.012, 0.02, 0.1, 16]} />{M.chrome()}</mesh>
    </group>
    {pour && <mesh geometry={tubeG("kpour2", [[-0.46, 0.5, 0], [-0.45, 0.38, 0], [-0.45, 0.24, 0]], 0.02, 20, 10)}>{M.water({ op: 0.85 })}</mesh>}
    {Array.from({ length: 10 }, (_, i) => { const k = ((tt * 0.5 + i / 10) % 1); return tilt > 0.3 ? <mesh key={i} position={[-0.45 + 0.03 * Math.sin(i + tt), 0.3 + 0.3 * k, 0.02 * rn(i, 2)]}><sphereGeometry args={[0.02 + 0.04 * k, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.12 * (1 - k)} depthWrite={false} /></mesh> : null; })}
    {/* el termómetro de vidrio: el mercurio rojo sube y pasa la raya del PVC */}
    <group position={[0.32, 0, 0.22]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.016, 0.016, 0.38, 24]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.02, 0]}><sphereGeometry args={[0.024, 20, 14]} />{M.plastic({ col: "#d11a1a", em: "#5a0000", emI: 0.4 })}</mesh>
      <mesh position={[0, 0.02 + mh / 2, 0]}><cylinderGeometry args={[0.006, 0.006, mh, 12]} />{M.plastic({ col: "#d11a1a", em: "#5a0000", emI: 0.4 })}</mesh>
      <mesh position={[0, lineH, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.02, 0.003, 8, 24]} />{M.glow({ col: passed > 0 ? RED : AMB })}</mesh>
      <pointLight position={[0, lineH, 0.08]} intensity={0.25 * passed} distance={0.3} color="#ff4a3a" />
    </group>
  </>;
}}</Scene3D>;

// ---- 17:14 · EL HIERRO COMIDO: el fondo del caño galvanizado en corte; las gotas verdes lo pican, humea, y se abre un agujero que gotea afuera ----
export const HRust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [0.25, -0.1], el: [1.02, 0.86], r: [0.82, 0.62], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT EATS THE PIPE" col={RED} />}>{(tt) => {
  const fall = cl((tt - 0.7) / 0.5), sit = cl((tt - 1.2) / 2.4), hole = cl((tt - 3.6) / 0.5), Y = 0.094;
  return <>
    {/* medio caño galvanizado abierto arriba: zinc por fuera, hierro oscuro por dentro */}
    <group position={[0, 0.2, 0]} rotation={[0, 0, PI / 2]}>
      <mesh><cylinderGeometry args={[0.12, 0.12, 0.62, 64, 1, true, PI, PI]} />{M.steel({ col: "#9aa1a6", side: THREE.DoubleSide })}</mesh>
      <mesh><cylinderGeometry args={[0.108, 0.108, 0.6, 64, 1, true, PI, PI]} /><meshStandardMaterial color="#5e4632" roughness={0.9} metalness={0.3} side={THREE.DoubleSide} /></mesh>
    </group>
    {[-0.3, 0.3].map((x) => <RBox key={x} s={[0.04, 0.08, 0.2]} r={0.004} p={[x, 0.04, 0]}>{M.matte({ col: "#3a3b3e" })}</RBox>)}
    {/* la gota verde gorda: cae, se aplasta y se va hundiendo en el hierro */}
    {fall > 0 && hole < 1 && <mesh position={[0, fall < 1 ? lerp(0.5, Y + 0.02, fall * fall) : Y + 0.02 - 0.03 * sit, 0]} scale={fall < 1 ? [1, 1.35, 1] : [1 + 0.4 * sit, 0.7 - 0.3 * sit, 1 + 0.4 * sit]}><sphereGeometry args={[0.05, 28, 18]} />{M.plastic({ col: "#5fd34a", em: "#1f6a10", emI: 0.7, op: 1 - hole })}</mesh>}
    {/* el cráter: anillo naranja de óxido que se abre y oscurece el centro */}
    {sit > 0 && Array.from({ length: 9 }, (_, j) => { const a = j * 0.7 + rn(j, 1), d = (0.012 + 0.016 * rn(j, 2)) * sit; return <mesh key={"rr" + j} position={[d * Math.cos(a), Y + 0.001 + 0.0002 * j, d * Math.sin(a)]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[(0.02 + 0.018 * rn(j, 3)) * sit + 0.004, 7]} />{M.matte({ col: j % 3 ? "#a5481a" : "#6a2e10" })}</mesh>; })}
    {sit > 0 && Array.from({ length: 6 }, (_, j) => { const a = j * 1.1 + 0.4, d = (0.008 + 0.01 * rn(j, 4)) * sit; return <mesh key={"rh" + j} position={[d * Math.cos(a), Y + 0.004, d * Math.sin(a)]} rotation={[-PI / 2, 0, a]}><circleGeometry args={[(0.014 + 0.01 * rn(j, 5)) * sit, 6]} />{M.matte({ col: hole > 0 ? "#050403" : "#2a1a0e" })}</mesh>; })}
    {sit > 0.3 && Array.from({ length: 7 }, (_, j) => { const k = cl((tt - 2.2 - j * 0.3) / 0.9); return k > 0 && k < 1 ? <mesh key={"fl" + j} position={[(rn(j, 6) - 0.5) * 0.08, Y + 0.01 + 0.05 * k - 0.07 * k * k, (rn(j, 7) - 0.5) * 0.08]} rotation={[k * 5, k * 3, 0]}><boxGeometry args={[0.008, 0.001, 0.006]} />{M.matte({ col: "#b5561e" })}</mesh> : null; })}
    {/* el humo que sale mientras come */}
    {sit > 0 && hole < 1 && Array.from({ length: 6 }, (_, j) => { const k = ((tt * 0.7 + j / 6) % 1); return <mesh key={j} position={[0.02 * Math.sin(j * 2 + tt), Y + 0.04 + 0.22 * k, 0.02 * Math.cos(j)]}><sphereGeometry args={[0.02 + 0.04 * k, 14, 10]} /><meshBasicMaterial color="#d8ead0" transparent opacity={0.28 * (1 - k) * Math.min(1, sit * 3)} depthWrite={false} /></mesh>; })}
    {/* perforado: la luz pasa y por abajo cae una gota marrón que mancha el piso */}
    {hole > 0 && <mesh position={[0, 0.079, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.018, 24]} />{M.glow({ col: "#ff8a3a", op: 0.7 * hole })}</mesh>}
    {[0, 1, 2].map((j) => { const k = cl((tt - 4.0 - j * 0.8) / 0.45); return k > 0 && k < 1 ? <mesh key={j} position={[0, 0.075 - 0.07 * k * k, 0]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.02, 16, 12]} />{M.water({ col: "#7a4a22", op: 0.95 })}</mesh> : null; })}
    {tt > 4.4 && <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.02 + 0.05 * cl((tt - 4.4) / 2), 32]} />{M.water({ col: "#6a3a1a", op: 0.85 })}</mesh>}
    {tt > 4.4 && Array.from({ length: 5 }, (_, j) => { const k = ((tt * 0.6 + j / 5) % 1); return <mesh key={"hs" + j} position={[0.02 * Math.sin(j * 2 + tt), 0.02 + 0.08 * k, 0.03 + 0.02 * Math.cos(j)]}><sphereGeometry args={[0.015 + 0.03 * k, 12, 10]} /><meshBasicMaterial color="#d8c8b0" transparent opacity={0.2 * (1 - k)} depthWrite={false} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 18:01 · EL SOPAPO DE VUELTA: el sopapo empuja de un lado; el químico amarillo sube por la OTRA pileta y salta hacia la cámara ----
export const HPlunger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="tile"
  cam={{ at: [0.05, 0.38, 0], at1: [0.15, 0.42, 0.05], az: [-0.12, 0.1], el: [0.3, 0.22], r: [1.45, 1.15], fov: 30 }}
  over={(tt) => <>
    <Head tt={tt} kick="" title="IT CAME BACK UP" col={RED} />
    {/* salpicadura en la lente: manchas amarillas que llegan y se escurren */}
    {Array.from({ length: 10 }, (_, i) => { const k = cl((tt - 2.9 - i * 0.05) / 0.2), dr = cl((tt - 3.4) / 2.2); return k > 0 ? <div key={i} style={{ position: "absolute", left: 1100 + 520 * rn(i, 2) - 200, top: 300 + 500 * rn(i, 3) + 60 * dr, width: 160 + 220 * rn(i, 4), height: (160 + 220 * rn(i, 4)) * (1 + 0.4 * dr), borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(255,240,150,.75), rgba(220,180,30,.55) 60%, transparent 72%)", opacity: k * (1 - 0.6 * dr), filter: "blur(1.5px)" }} /> : null; })}
  </>}>{(tt) => {
  const push = Math.max(eio(tt, 0.8, 1.3) * (1 - eio(tt, 1.3, 1.8)), eio(tt, 1.9, 2.3) * (1 - eio(tt, 2.3, 2.8)));
  const jet = cl((tt - 2.25) / 0.6) * (1 - cl((tt - 4.4) / 0.8));
  return <>
    {[-0.24, 0.24].map((x) => <group key={x}>
      {[-1, 1].map((sd) => <mesh key={"a" + sd} position={[x + sd * 0.17, 0.5, 0]}><boxGeometry args={[0.1, 0.02, 0.36]} />{M.steel({ col: "#b9bec3" })}</mesh>)}{[-1, 1].map((sd) => <mesh key={"b" + sd} position={[x, 0.5, sd * 0.15]}><boxGeometry args={[0.24, 0.02, 0.06]} />{M.steel({ col: "#b9bec3" })}</mesh>)}
      <mesh position={[x, 0.44, 0]}><cylinderGeometry args={[0.17, 0.05, 0.12, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
      <mesh position={[x, 0.28, 0]}><cylinderGeometry args={[0.035, 0.035, 0.22, 32, 1, true]} />{M.glass({ op: 0.24 })}</mesh>
      <mesh position={[x, 0.22, 0]}><cylinderGeometry args={[0.03, 0.03, 0.1 + (x > 0 ? 0.12 * jet : 0), 24]} />{M.plastic({ col: "#e6c22a", op: 0.85, em: "#5a4a00", emI: 0.3 })}</mesh>
    </group>)}
    <mesh geometry={tubeG("pjoin", [[-0.24, 0.17, 0], [-0.2, 0.12, 0], [0.2, 0.12, 0], [0.24, 0.17, 0]], 0.035, 40, 24)}>{M.glass({ op: 0.24 })}</mesh>
    <mesh geometry={tubeG("pjoinw", [[-0.24, 0.17, 0], [-0.2, 0.12, 0], [0.2, 0.12, 0], [0.24, 0.17, 0]], 0.03, 40, 16)}>{M.plastic({ col: "#e6c22a", op: 0.85, em: "#5a4a00", emI: 0.3 })}</mesh>
    {/* el sopapo rojo empuja en la pileta izquierda */}
    <group position={[-0.24, 0.47 - 0.04 * push, 0]}>
      <mesh scale={[1, 0.75 - 0.2 * push, 1]} castShadow><sphereGeometry args={[0.1, 40, 24, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c2302a", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.075 - 0.02 * push, 0]}><cylinderGeometry args={[0.022, 0.03, 0.03, 20]} />{M.matte({ col: "#9a2420" })}</mesh>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.016, 0.016, 0.46, 16]} />{M.wood({ base: [170, 112, 60] })}</mesh>
    </group>
    {/* el chorro sale por la pileta derecha y viene hacia la cámara */}
    {jet > 0 && <mesh geometry={tubeG("pjet" + Math.round(jet * 20), [[0.24, 0.42, 0], [0.25, 0.5 + 0.25 * jet, 0.12 * jet], [0.22, 0.55 + 0.3 * jet, 0.8 * jet]], (u) => 0.07 * (1 - 0.3 * u), 40, 16)}>{M.plastic({ col: "#e6c22a", op: 0.9, em: "#5a4a00", emI: 0.35 })}</mesh>}
    {jet > 0 && Array.from({ length: 18 }, (_, i) => { const k = cl((tt - 2.4 - i * 0.06) / 0.9); return k > 0 && k < 1 ? <mesh key={i} position={[0.24 + (rn(i, 2) - 0.5) * 0.2 * k, 0.5 + 0.4 * k - 0.3 * k * k, 1.1 * k * (0.6 + 0.4 * rn(i, 3))]}><sphereGeometry args={[0.02 + 0.026 * rn(i, 4), 12, 10]} />{M.plastic({ col: "#f0d23a", em: "#5a4a00", emI: 0.35 })}</mesh> : null; })}
  </>;
}}</Scene3D>;
