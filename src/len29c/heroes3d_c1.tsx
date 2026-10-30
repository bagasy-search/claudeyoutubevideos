// len29c · 2ª vuelta en 3D real (kit h3d): regla plegable, café, capas, tejido, soga, gato, pistón, mano, tapas, pinzas.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };
const tileTex = () => tex.text("c_tile", 512, 512, (g) => {
  g.fillStyle = "#e9e6df"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#b9b3a8";
  for (let i = 0; i <= 8; i++) { g.fillRect(i * 64 - 2, 0, 4, 512); g.fillRect(0, i * 64 - 2, 512, 4); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,110,95,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 3, 3); }
});
// la rejilla con cruz de la ducha: aro cromado + dos barras
const Cross: React.FC<{ r?: number; y?: number }> = ({ r = 0.07, y = 0 }) => <group position={[0, y, 0]}>
  <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[r, 0.007, 12, 56]} />{M.chrome()}</mesh>
  {[0, PI / 2].map((a) => <mesh key={a} rotation={[0, a, 0]}><boxGeometry args={[r * 2, 0.008, 0.009]} />{M.chrome()}</mesh>)}
</group>;
// una bola de pelo enmarañado
const HairBall: React.FC<{ id: string; s?: number; col?: string }> = ({ id, s = 1, col = "#3a2618" }) => <group scale={s}>
  <mesh><sphereGeometry args={[0.03, 20, 16]} />{M.grease({ col: "#6e5a44" })}</mesh>
  {[0, 1, 2, 3].map((i) => <Hair key={i} id={id + i} n={14} spread={0.03} r={0.0014} col={col} pts={[[-0.04, 0.01 * i, 0], [-0.01, 0.03, 0.02 * (i - 1.5)], [0.02, -0.02, 0.03], [0.045, 0.012 * i, -0.01]]} />)}
</group>;

// ---- 0:39 · LA REGLA PLEGABLE: el piso de la ducha en corte; una regla amarilla se despliega tramo a tramo dentro del desagüe; en la 6ª pulgada toca la mata y la mata se prende ----
const foldTex = (i: number) => tex.text("fold" + i, 256, 40, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 256, 40); g.fillStyle = "#1e1a12"; g.font = "bold 20px Arial"; g.textAlign = "center";
  for (let k = 0; k <= 16; k++) { const x = 4 + k * 15.5; g.fillRect(x - 1, 0, 2, k % 4 === 0 ? 18 : 9); }
  g.fillText(String(i * 2 + 2), 128, 36);
});
export const HSixInch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, -0.16, 0], at1: [0, -0.2, 0], az: [0.42, 0.2], el: [0.3, 0.2], r: [1.7, 1.45], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT'S CLOSER THAN YOU THINK" col={AMB} />}>{(tt) => {
  const seg = (i: number) => cl(phys(tt, 0.7 + i * 0.42, 8, 0.4)), L = 0.09, hit = cl((tt - 2.4) / 0.3), glow = hit * (0.75 + 0.25 * Math.sin(tt * 6));
  return <>
    {/* la losa de la ducha cortada: azulejo arriba, mortero gris al costado, el agujero en el medio */}
    {[-1, 1].map((s) => <group key={s}>
      <mesh position={[s * 0.4, 0.0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.66, 0.6]} /><meshStandardMaterial map={tileTex()} roughness={0.35} /></mesh>
      <mesh position={[s * 0.4, -0.06, 0.3]}><planeGeometry args={[0.66, 0.12]} />{M.matte({ col: "#7d7a74" })}</mesh>
    </group>)}
    <Cross r={0.068} y={0.004} />
    {/* el caño de vidrio que baja */}
    <mesh position={[0, -0.36, 0]}><cylinderGeometry args={[0.07, 0.07, 0.72, 48, 1, true]} />{M.glass({ op: 0.18, side: THREE.DoubleSide })}</mesh>
    {/* la mata atorada a 6 pulgadas */}
    <group position={[0, -0.33, 0]}>
      <HairBall id="six" s={1.3} />
      <mesh rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.072, 0.006, 10, 48]} />{M.glow({ col: AMB, op: 0.85 * hit })}</mesh>
      <pointLight position={[0.12, 0.02, 0.18]} intensity={0.3 * glow} distance={0.35} color="#ffb24a" />
    </group>
    {/* la regla de carpintero: cada tramo se despliega desde la bisagra de arriba */}
    {Array.from({ length: 4 }, (_, i) => { const k = seg(i); if (k <= 0.001) return null; const y0 = 0.04 - i * L, sgn = i % 2 ? 1 : -1;
      return <group key={i} position={[0.03, y0, 0.02]} rotation={[0, 0, sgn * (1 - k) * PI * 0.9]}>
        <mesh position={[0, -L / 2, 0]} castShadow><boxGeometry args={[0.028, L, 0.005]} /><meshStandardMaterial color="#f2c230" roughness={0.45} /></mesh>
        <mesh position={[0, -L / 2, 0.0027]} rotation={[0, 0, PI / 2]}><planeGeometry args={[L, 0.028]} /><meshStandardMaterial map={foldTex(i)} roughness={0.45} /></mesh>
        <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.006, 12]} />{M.brass()}</mesh>
      </group>; })}
    {/* gotitas que caen del pelo cuando la regla la toca */}
    {[0, 1, 2].map((j) => { const k = cl((tt - 2.6 - j * 0.5) / 0.6); return k > 0 && k < 1 ? <mesh key={j} position={[-0.02 + 0.02 * j, -0.37 - 0.3 * k * k, 0.01]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.007, 12, 10]} />{M.water({ op: 0.9 })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 1:11 · MENOS QUE UN CAFÉ: un vaso de café humeante cae en el mostrador; la tira plástica y el ganchito vuelan y entran parados en el vaso, como sorbetes ----
export const HCoffeeCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="tile"
  cam={{ at: [0, 0.14, 0], at1: [0, 0.17, 0], az: [-0.3, 0.2], el: [0.26, 0.2], r: [0.95, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="CHEAPER THAN A COFFEE" col={AMB} />}>{(tt) => {
  const cupY = 0.45 * (1 - phys(tt, 0.4, 8, 0.35)), wob = (k: number) => 0.06 * Math.sin((tt - k) * 16) * Math.exp(-(tt - k) * 4) * (tt > k ? 1 : 0);
  const tool = (a: number, x0: number) => { const k = eio(tt, a, a + 0.8); return { x: lerp(x0, 0, k), y: lerp(0.5, 0.13, k) + 0.12 * Math.sin(PI * k), r: (1 - k) * 2.6 }; };
  const s1 = tool(1.6, -0.6), s2 = tool(2.6, 0.6), tilt = wob(2.4) + wob(3.4);
  return <>
    <group position={[0, cupY, 0]} rotation={[0, 0, tilt]}>
      {/* el vaso de cartón con su faja y la tapa */}
      <mesh position={[0, 0.075, 0]} castShadow><cylinderGeometry args={[0.058, 0.044, 0.15, 48, 1, true]} />{M.matte({ col: "#f2ede2", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0545, 0.05, 0.055, 48, 1, true]} />{M.matte({ col: "#8a5a32" })}</mesh>
      <mesh position={[0, 0.001, 0]}><cylinderGeometry args={[0.044, 0.044, 0.002, 40]} />{M.matte({ col: "#e6dfd0" })}</mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.055, 0.055, 0.004, 40]} />{M.water({ col: "#3a2414", op: 0.95, em: "#1a0d05", emI: 0.2 })}</mesh>
    </group>
    {/* el vapor que sube del café */}
    {Array.from({ length: 9 }, (_, i) => { const k = (tt * 0.45 + i / 9) % 1; return tt > 0.9 ? <mesh key={i} position={[0.02 * Math.sin(i * 2 + tt * 2), cupY + 0.17 + 0.25 * k, 0.01 * Math.cos(i)]} scale={0.5 + 1.5 * k}><sphereGeometry args={[0.018, 12, 10]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.13 * (1 - k)} depthWrite={false} /></mesh> : null; })}
    {/* la tira plástica negra con dientes: entra parada en el vaso */}
    {tt > 1.5 && <group position={[s1.x - 0.018, s1.y + cupY, 0.01]} rotation={[0, 0, s1.r + tilt]}>
      <mesh position={[0, 0.1, 0]} castShadow><boxGeometry args={[0.012, 0.24, 0.002]} />{M.plastic({ col: "#1d1e20" })}</mesh>
      {Array.from({ length: 9 }, (_, i) => [-1, 1].map((s) => <mesh key={i + "_" + s} position={[s * 0.009, 0.02 + i * 0.022, 0]} rotation={[0, 0, s * -0.7]}><boxGeometry args={[0.008, 0.003, 0.002]} />{M.plastic({ col: "#1d1e20" })}</mesh>))}
      <mesh position={[0, 0.235, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.003, 8, 24]} />{M.plastic({ col: "#1d1e20" })}</mesh>
    </group>}
    {/* el ganchito de alambre con mango rojo */}
    {tt > 2.5 && <group position={[s2.x + 0.02, s2.y + cupY, -0.01]} rotation={[0, 0, -s2.r + tilt]}>
      <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.008, 0.008, 0.08, 16]} />{M.plastic({ col: RED })}</mesh>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.0018, 0.0018, 0.13, 8]} />{M.steel()}</mesh>
      <mesh position={[0.006, -0.004, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.006, 0.0018, 6, 16, PI]} />{M.steel()}</mesh>
    </group>}
  </>;
}}</Scene3D>;

// ---- 1:45 · EL PISO EN CAPAS: una cuña del piso de la ducha se levanta como porción de torta; abajo, rejilla, cruz, caño y sifón bajan de a uno a su piso ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="dark"
  cam={{ at: [0, -0.1, 0], at1: [0, -0.2, 0], az: [0.55, 0.3], el: [0.26, 0.18], r: [1.15, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="WHAT'S DOWN THERE" col={AMB} />}>{(tt) => {
  const lift = eio(tt, 0.4, 1.6), lay = (i: number) => cl(phys(tt, 1.7 + i * 0.6, 7, 0.4)), Y = [0.0, -0.05, -0.13, -0.24];
  const wedge = 0.85;
  return <>
    {/* la losa: un disco de azulejo con mortero, al que le falta una cuña */}
    <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.3, 0.3, 0.06, 64, 1, false, wedge, 2 * PI - wedge]} />{M.matte({ col: "#8b877f" })}</mesh>
    <mesh position={[0, 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 64, wedge + PI / 2, 2 * PI - wedge]} /><meshStandardMaterial map={tileTex()} roughness={0.35} /></mesh>
    {/* la cuña que se levanta y se aparta */}
    <group position={[0.18 * lift, 0.32 * lift, 0.22 * lift]} rotation={[-0.5 * lift, 0, 0.35 * lift]}>
      <mesh position={[0, -0.03, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.06, 32, 1, false, 0, wedge]} />{M.matte({ col: "#8b877f" })}</mesh>
      <mesh position={[0, 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.3, 32, PI / 2, wedge]} /><meshStandardMaterial map={tileTex()} roughness={0.35} /></mesh>
    </group>
    <group scale={1.7}>
    {/* las capas, cada una cae a su piso y rebota */}
    <group position={[0, Y[0] + 0.25 * (1 - lay(0)), 0]} scale={0.001 + lay(0)}>
      <mesh rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.02, 0.075, 48]} />{M.chrome({ side: THREE.DoubleSide })}</mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.628) * 0.05, 0.002, Math.sin(i * 0.628) * 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.007, 12]} />{M.matte({ col: "#111" })}</mesh>)}
    </group>
    <group position={[0, Y[1] + 0.25 * (1 - lay(1)), 0]} scale={0.001 + lay(1)}><Cross r={0.06} /></group>
    <group position={[0, Y[2] + 0.25 * (1 - lay(2)), 0]} scale={[1, 0.001 + lay(2), 1]}><mesh><cylinderGeometry args={[0.05, 0.05, 0.16, 40, 1, true]} />{M.pvc({ side: THREE.DoubleSide })}</mesh></group>
    <group position={[0, Y[3] + 0.25 * (1 - lay(3)), 0]} scale={0.001 + lay(3)}>
      <mesh geometry={tubeG("ltrap", [[0, 0.06, 0], [0, -0.02, 0], [0.05, -0.08, 0], [0.11, -0.02, 0], [0.11, 0.05, 0], [0.24, 0.05, 0]], 0.04, 80, 24)} castShadow>{M.pvc()}</mesh>
    </group>
    {/* las líneas de piso: guías punteadas a cada nivel */}
    {Y.map((y, i) => <mesh key={i} position={[-0.3, y, 0]} rotation={[0, 0, PI / 2]} scale={[1, cl(lay(i) * 2), 1]}><cylinderGeometry args={[0.002, 0.002, 0.2, 6]} />{M.glow({ col: AMB, op: 0.7 })}</mesh>)}
  </group>
  </>;
}}</Scene3D>;

// ---- 2:20 · EL TEJIDO: cenital sobre la cruz; los pelos gruesos llegan de a uno, se enganchan en la barra y se enroscan; una gota de jabón cae y los pega ----
export const HWeave: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="tile" wall="none"
  cam={{ at: [0, 0, 0], az: [0.1, -0.15], el: [1.32, 1.2], r: [0.6, 0.42], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT CATCHES ON THE CROSS" col={AMB} />}>{(tt) => {
  const soap = cl((tt - 4.6) / 0.5), coat = cl((tt - 5.1) / 0.9);
  return <>
    <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 48]} />{M.matte({ col: "#0b0c0e" })}</mesh>
    <Cross r={0.07} y={0.006} />
    {/* cada pelo: viaja desde afuera, cuelga de una barra y se enrosca alrededor */}
    {Array.from({ length: 7 }, (_, i) => { const a = 0.4 + i * 0.5, k = eio(tt, a, a + 0.9), cur = eio(tt, a + 0.9, a + 1.6), ang = i * 0.9;
      const ca = Math.cos(ang), sa = Math.sin(ang), d = lerp(0.3, 0.0, k);
      const pts = Array.from({ length: 9 }, (_, j) => { const u = j / 8, rr = lerp(0.11, 0.005, u) + d, w = cur * u * 3.5 * PI;
        return [ca * rr + Math.cos(w + ang) * 0.012 * cur * u - sa * 0.01 * Math.sin(u * 6 + i), 0.008 + 0.004 * Math.sin(u * 9 + i) + 0.006 * cur * u, sa * rr + Math.sin(w + ang) * 0.012 * cur * u + ca * 0.01 * Math.sin(u * 6 + i)]; });
      return tt > a ? <mesh key={i} geometry={tubeG(`wv${i}_${Math.round(k * 20)}_${Math.round(cur * 20)}`, pts, 0.0024, 60, 6)} castShadow>{M.hair({ col: i % 2 ? "#2a1f17" : "#4a3322" })}</mesh> : null; })}
    {/* la gota de jabón: cae, se aplasta y cubre todo con una capa blanca brillante */}
    {soap > 0 && soap < 1 && <mesh position={[0.005, 0.3 * (1 - soap * soap) + 0.01, 0.005]} scale={[1, 1.3, 1]}><sphereGeometry args={[0.014, 16, 12]} /><meshPhysicalMaterial color="#f8f6f0" roughness={0.05} clearcoat={1} /></mesh>}
    {coat > 0 && <mesh position={[0, 0.012, 0]} scale={[0.001 + coat, 0.1, 0.001 + coat]}><sphereGeometry args={[0.07, 40, 20]} /><meshPhysicalMaterial color="#fdfbf4" roughness={0.08} clearcoat={1} transparent opacity={0.16} depthWrite={false} /></mesh>}
  </>;
}}</Scene3D>;

// ---- 2:51 · LA SOGA QUE CRECE: caño de vidrio en corte; la mata cuelga de la cruz y se alarga a tirones, una semana por tirón; en la pared de azulejo, una raya de tiza por semana ----
export const HRopeGrow: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="tile"
  cam={{ at: [0.05, -0.2, -0.2], at1: [0.05, -0.3, -0.2], az: [0.0, 0.18], el: [0.04, 0.02], r: [1.35, 1.2], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="UNTIL IT'S A ROPE" col={AMB} />}>{(tt) => {
  const wk = (i: number) => cl(phys(tt, 0.6 + i * 0.75, 7, 0.45)), grow = [0, 1, 2, 3, 4, 5].reduce((a, i) => a + wk(i), 0) / 6;
  const P = [[0, 0, 0], [0, -0.2, 0], [0, -0.42, 0], [0.04, -0.52, 0], [0.12, -0.54, 0], [0.18, -0.48, 0], [0.18, -0.36, 0], [0.38, -0.36, 0]];
  const len = lerp(0.04, 0.5, grow);
  const rope: number[][] = []; for (let i = 0; i <= 20; i++) { const u = i / 20, y = -u * len; rope.push([0.01 * Math.sin(u * 9 + tt), y, 0.008 * Math.cos(u * 7)]); }
  return <>
    <mesh geometry={tubeG("rg_glass", P, 0.06, 140, 30)}>{M.glass({ op: 0.18 })}</mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.065, 0.32, 48]} />{M.matte({ col: "#d9d4ca" })}</mesh>
    <Cross r={0.06} y={0.004} />
    {/* la soga de pelo y jabón: gruesa arriba, se afina abajo */}
    <mesh geometry={tubeG("rg_rope" + Math.round(len * 100), rope, (u: number) => lerp(0.026, 0.01, u), 60, 14)} castShadow>{M.grease({ col: "#6b5440" })}</mesh>
    <Hair id="rgh" n={30} spread={0.03} r={0.0013} pts={rope.filter((_, i) => i % 4 === 0)} />
    {/* las rayas de tiza en la pared, una por semana */}
    {[0, 1, 2, 3, 4, 5].map((i) => { const k = cl((tt - 0.6 - i * 0.75) / 0.25); return k > 0 ? <mesh key={i} position={[-0.32 + i * 0.045 + (i === 4 ? 0.09 : 0), -0.12 - (i === 4 ? 0.0 : 0), -1.58]} rotation={[0, 0, i === 4 ? 1.1 : 0.06]} scale={[1, 0.001 + k, 1]}><boxGeometry args={[0.008, i === 4 ? 0.24 : 0.14, 0.002]} />{M.matte({ col: "#f7f5ef" })}</mesh> : null; })}
  </>;
}}</Scene3D>;

// ---- 3:25 · DEL TAMAÑO DE UN GATO: del desagüe sale la mata, crece y crece; al lado un gato de fieltro se sienta, la mira y es igual de grande ----
export const HCatSize: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile"
  cam={{ at: [0.1, 0.14, 0], az: [-0.25, 0.15], el: [0.2, 0.14], r: [1.15, 0.98], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT KEPT COMING" col={AMB} />}>{(tt) => {
  const g = eio(tt, 0.4, 3.6), cat = cl(phys(tt, 3.2, 6, 0.5)), look = eio(tt, 4.2, 4.9);
  const blob: number[][] = Array.from({ length: 12 }, (_, i) => { const u = i / 11; return [-0.12 + 0.03 * Math.sin(u * 7), 0.01 + u * 0.3 * g, 0.02 * Math.cos(u * 5)]; });
  return <>
    <group position={[-0.12, 0, 0]}><mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.075, 40]} />{M.matte({ col: "#0b0c0e" })}</mesh><Cross r={0.075} y={0.004} /></group>
    {/* la mata que sale: un cuerpo de grasa con cientos de pelos */}
    {g > 0.02 && <mesh geometry={tubeG("cat_blob" + Math.round(g * 40), blob, (u: number) => (0.035 + 0.05 * Math.sin(PI * u * 0.9)) * (0.4 + 0.6 * g), 50, 20)} castShadow>{M.grease({ col: "#5e4a38" })}</mesh>}
    {g > 0.05 && [0, 1, 2, 3, 4, 5].map((i) => <Hair key={i} id={"cbh" + i + "_" + Math.round(g * 20)} n={16} spread={0.06 * g} r={0.0016} col={i % 2 ? "#2a1f17" : "#4a3322"} pts={blob.filter((_, j) => j % 3 === i % 3).map((p) => [p[0] + 0.02 * Math.sin(i), p[1], p[2] + 0.02 * Math.cos(i)])} />)}
    {/* el gato de fieltro gris, sentado */}
    <group position={[0.24, 0, 0.02]} scale={0.001 + cat} rotation={[0, -0.35 - 0.5 * look, 0]}>
      <mesh position={[0, 0.1, 0]} scale={[0.85, 1.1, 0.75]} castShadow><sphereGeometry args={[0.1, 32, 24]} />{M.matte({ col: "#8c8f94" })}</mesh>
      <mesh position={[0, 0.25, 0.02]} castShadow><sphereGeometry args={[0.065, 32, 24]} />{M.matte({ col: "#8c8f94" })}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.04, 0.31, 0.01]} rotation={[0, 0, -s * 0.3]} castShadow><coneGeometry args={[0.022, 0.05, 12]} />{M.matte({ col: "#80838a" })}</mesh>)}
      {[-1, 1].map((s) => <mesh key={"e" + s} position={[s * 0.024, 0.262, 0.078]}><sphereGeometry args={[0.009, 14, 10]} /><meshPhysicalMaterial color="#d6c23a" roughness={0.1} clearcoat={1} emissive="#4a3a00" emissiveIntensity={0.4} /></mesh>)}
      <mesh position={[0, 0.245, 0.085]}><sphereGeometry args={[0.006, 10, 8]} />{M.matte({ col: "#c98a8a" })}</mesh>
      {[-1, 1].map((s) => <mesh key={"p" + s} position={[s * 0.035, 0.015, 0.07]} scale={[1, 0.6, 1.4]}><sphereGeometry args={[0.022, 16, 12]} />{M.matte({ col: "#8c8f94" })}</mesh>)}
      <mesh geometry={tubeG("cattail", [[-0.05, 0.03, -0.06], [-0.14, 0.02, -0.02], [-0.15, 0.06, 0.06], [-0.1, 0.12, 0.09]], 0.012, 30, 10)} castShadow>{M.matte({ col: "#80838a" })}</mesh>
    </group>
    {/* la marca de altura: una línea de luz que une las dos cabezas */}
    {cat > 0.9 && <mesh position={[0.06, 0.31, 0.0]} rotation={[0, 0, PI / 2]} scale={[1, cl((tt - 4.0) / 0.5), 1]}><cylinderGeometry args={[0.0025, 0.0025, 0.4, 8]} />{M.glow({ col: AMB, op: 0.8 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 4:02 · EL PISTÓN: caño en U de vidrio; el sopapo rojo baja como émbolo por la rama izquierda; la soga amarilla se aprieta como acordeón y se clava en la curva ----
const UP = [[-0.14, 0.4, 0], [-0.14, 0.05, 0], [-0.1, -0.06, 0], [0, -0.1, 0], [0.1, -0.06, 0], [0.14, 0.05, 0], [0.14, 0.32, 0]];
export const HPiston: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.12, 0], az: [0.15, -0.1], el: [0.08, 0.04], r: [1.3, 1.15], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="IT PUSHES IT DOWN" col={AMB} />}>{(tt) => {
  const push = eio(tt, 0.8, 1.6) * 0.6 + eio(tt, 2.2, 2.9) * 0.4, pY = lerp(0.5, 0.2, push), squash = push;
  const top = pY - 0.06, bot = lerp(0.0, -0.1, squash);
  const rope: number[][] = []; for (let i = 0; i <= 40; i++) { const u = i / 40; const y = lerp(top, bot, u); const amp = 0.025 * squash; rope.push([-0.14 + amp * Math.sin(u * 14 * PI) + (y < 0.02 ? lerp(0, 0.1, cl((0.02 - y) / 0.12)) : 0), y, 0]); }
  const stuck = cl((tt - 3.0) / 0.3), pulse = stuck * (0.6 + 0.4 * Math.sin(tt * 7));
  return <>
    <mesh geometry={tubeG("pi_glass", UP, 0.048, 140, 30)}>{M.glass({ op: 0.2 })}</mesh>
    <mesh geometry={tubeG("pi_water", UP.slice(2, 6), 0.042, 60, 20)}>{M.water({ op: 0.45 })}</mesh>
    {/* la soga de pelo amarilla, apretada */}
    <mesh geometry={tubeG("pi_rope" + Math.round(squash * 30), rope, 0.017, 120, 12)} castShadow>{M.grease({ col: "#d9b24a", em: "#4a3300", emI: 0.15 })}</mesh>
    {/* el sopapo: copa roja y mango de madera */}
    <group position={[-0.14, pY, 0]}>
      <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.03, 0.046, 0.06, 32, 1, true]} />{M.rubber({ col: "#c2261e" })}</mesh>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.03, 24, 12, 0, 2 * PI, 0, PI / 2]} />{M.rubber({ col: "#c2261e" })}</mesh>
      <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.34, 16]} />{M.wood({ base: [180, 126, 70] })}</mesh>
    </group>
    {/* donde se clava: aro rojo que late */}
    <mesh position={[0, -0.1, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.055, 0.005, 10, 48]} />{M.glow({ col: RED, op: 0.9 * pulse })}</mesh>
    <pointLight position={[0, -0.05, 0.15]} intensity={0.4 * pulse} distance={0.5} color="#ff5a4a" />
  </>;
}}</Scene3D>;

// ---- 4:30 · LA MANO Y LA DISTANCIA: una mano baja los dedos a la boca del desagüe; el tapón está a 3 pulgadas; el sopapo lo empuja hasta el aro de un pie ----
const Hand: React.FC<{ curl?: number }> = ({ curl = 0 }) => <group>
  <RBox s={[0.09, 0.1, 0.03]} r={0.014} p={[0, 0.05, 0]}>{M.matte({ col: "#d8a888" })}</RBox>
  {[-0.032, -0.011, 0.011, 0.032].map((x, i) => <group key={i} position={[x, 0.0, 0]} rotation={[curl * 0.6, 0, 0]}>
    <mesh position={[0, -0.035 + (i === 0 || i === 3 ? 0.008 : 0), 0]} castShadow><capsuleGeometry args={[0.0095, 0.05, 6, 12]} />{M.matte({ col: "#d4a283" })}</mesh>
  </group>)}
  <mesh position={[0.055, 0.05, 0.01]} rotation={[0, 0, -0.7]} castShadow><capsuleGeometry args={[0.011, 0.04, 6, 12]} />{M.matte({ col: "#d4a283" })}</mesh>
  <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.04, 0.045, 0.09, 24]} />{M.matte({ col: "#3a5a8a" })}</mesh>
</group>;
export const HHandReach: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, -0.1, 0], at1: [0, -0.2, 0], az: [0.4, 0.2], el: [0.1, 0.06], r: [1.3, 1.15], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="3 INCHES → 1 FOOT" col={AMB} />}>{(tt) => {
  const hand = eio(tt, 0.3, 1.3) * (1 - eio(tt, 2.6, 3.2)), push = cl(phys(tt, 3.6, 7, 0.4)), plugY = lerp(-0.08, -0.32, push);
  const ring1 = cl((tt - 1.3) / 0.4), ring2 = cl((tt - 3.5) / 0.4);
  return <>
    {[-1, 1].map((s) => <mesh key={s} position={[s * 0.38, 0, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.62, 0.6]} /><meshStandardMaterial map={tileTex()} roughness={0.35} /></mesh>)}
    <mesh position={[0, -0.24, 0]}><cylinderGeometry args={[0.07, 0.07, 0.48, 48, 1, true]} />{M.glass({ op: 0.18, side: THREE.DoubleSide })}</mesh>
    {/* los dos aros de profundidad: 3 pulgadas (blanco) y un pie (ámbar) */}
    <mesh position={[0, -0.08, 0]} rotation={[PI / 2, 0, 0]} scale={0.001 + ring1}><torusGeometry args={[0.074, 0.004, 10, 48]} />{M.glow({ col: "#f7f4ee", op: 0.85 })}</mesh>
    <mesh position={[0, -0.32, 0]} rotation={[PI / 2, 0, 0]} scale={0.001 + ring2}><torusGeometry args={[0.074, 0.005, 10, 48]} />{M.glow({ col: AMB, op: 0.95 })}</mesh>
    {/* el tapón de pelo */}
    <group position={[0, plugY, 0]}><HairBall id="hr" s={1.25} /></group>
    {/* la mano: baja hasta rozarlo con la punta de los dedos */}
    {hand > 0.01 && <group position={[0.0, lerp(0.42, 0.06, hand), 0.02]} rotation={[0.15, 0.3, 0]}><Hand curl={0.3 * hand} /></group>}
    {/* el sopapo que entra y empuja */}
    {tt > 3.0 && <group position={[0, lerp(0.5, 0.03, cl(phys(tt, 3.0, 7, 0.45))), 0]}>
      <mesh castShadow><cylinderGeometry args={[0.055, 0.075, 0.07, 32, 1, true]} />{M.rubber({ col: "#c2261e", side: THREE.DoubleSide })}</mesh>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.01, 0.01, 0.34, 16]} />{M.wood({ base: [180, 126, 70] })}</mesh>
    </group>}
    {/* el pelo que se arrastra marca el recorrido */}
    {push > 0.05 && <mesh position={[0, (plugY - 0.08) / 2, 0]}><cylinderGeometry args={[0.004, 0.004, Math.abs(plugY + 0.08) + 0.001, 8]} />{M.glow({ col: AMB, op: 0.6 })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 5:08 · TRES TAPAS: tres rejillas cromadas suben del piso y se dan vuelta hacia cámara una tras otra: la de tornillo, la de presión, la de rosca ----
const coverTop = (k: number) => <>
  <mesh><cylinderGeometry args={[0.075, 0.078, 0.008, 56]} />{M.chrome()}</mesh>
  {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i * PI / 6) * 0.05, 0.0045, Math.sin(i * PI / 6) * 0.05]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.0065, 12]} />{M.matte({ col: "#101112" })}</mesh>)}
  <mesh position={[0, 0.0045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012 + 0.0 * k, 16]} />{M.matte({ col: "#101112" })}</mesh>
</>;
export const HCovers3: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="dark"
  cam={{ at: [0, 0.14, 0], at1: [0, 0.15, 0], az: [-0.12, 0.12], el: [0.22, 0.16], r: [1.05, 0.95], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THREE KINDS OF COVERS" col={AMB} />}>{(tt) => {
  const st = (i: number) => ({ up: cl(phys(tt, 0.5 + i * 1.6, 6, 0.5)), flip: eio(tt, 1.1 + i * 1.6, 1.9 + i * 1.6) });
  return <>
    {[0, 1, 2].map((i) => { const { up, flip } = st(i), x = (i - 1) * 0.28;
      return <group key={i} position={[x, 0.01 + 0.15 * up, 0]} rotation={[PI / 2 * 0.92 * flip, 0.25 * Math.sin(tt * 1.2 + i) * flip, 0]}>
        {coverTop(i)}
        {/* abajo de cada tapa: lo que la sujeta */}
        {i === 0 && [-1, 1].map((s) => <group key={s} position={[s * 0.035, -0.02, 0]}>
          <mesh><cylinderGeometry args={[0.004, 0.004, 0.04, 10]} />{M.steel()}</mesh>
          <mesh position={[0, 0.019, 0]}><cylinderGeometry args={[0.009, 0.009, 0.004, 16]} />{M.chrome()}</mesh>
          {Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[0, -0.016 + j * 0.006, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.0042, 0.0012, 4, 12]} />{M.steel()}</mesh>)}
        </group>)}
        {i === 1 && [0, 1, 2, 3].map((j) => <mesh key={j} position={[Math.cos(j * PI / 2) * 0.058, -0.018, Math.sin(j * PI / 2) * 0.058]} rotation={[0, -j * PI / 2, 0]}><boxGeometry args={[0.004, 0.03, 0.018]} />{M.steel({ col: "#d9dde1" })}</mesh>)}
        {i === 2 && <>
          <mesh position={[0, -0.022, 0]}><cylinderGeometry args={[0.062, 0.062, 0.036, 48, 1, true]} />{M.chrome({ side: THREE.DoubleSide })}</mesh>
          {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[0, -0.036 + j * 0.007, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.063, 0.0018, 6, 56]} />{M.chrome()}</mesh>)}
        </>}
      </group>; })}
    {[0, 1, 2].map((i) => <mesh key={"h" + i} position={[(i - 1) * 0.28, 0.0015, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} />{M.matte({ col: "#0b0c0e" })}</mesh>)}
  </>;
}}</Scene3D>;

// ---- 6:10 · LA X DE PINZAS: la rejilla de la bañera; dos pinzas de punta entran cruzadas en la cruz y giran juntas contra reloj; la rejilla sube con ellas ----
const Pliers: React.FC<{ open?: number }> = ({ open = 0.12 }) => <group>
  {[-1, 1].map((s) => <group key={s} rotation={[0, 0, s * open]}>
    <mesh position={[s * 0.004, 0.06, 0]} castShadow><boxGeometry args={[0.006, 0.12, 0.005]} />{M.steel({ col: "#b8bec4" })}</mesh>
    <mesh geometry={tubeG("plh" + s, [[0, 0, 0], [s * 0.01, -0.06, 0], [s * 0.022, -0.16, 0]], 0.0075, 30, 12)} castShadow>{M.rubber({ col: "#c2261e" })}</mesh>
  </group>)}
  <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.007, 0.007, 0.012, 16]} />{M.chrome()}</mesh>
</group>;
export const HXPliers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0e1013"
  cam={{ at: [0, 0.05, 0], az: [0.2, -0.2], el: [0.7, 0.55], r: [0.82, 0.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="TWO PLIERS IN AN X" col={AMB} />}>{(tt) => {
  const inP = eio(tt, 0.4, 1.6), spin = eio(tt, 2.0, 5.2), lift = eio(tt, 4.6, 5.8);
  return <>
    {/* el fondo de la bañera de porcelana, curvo hacia los bordes */}
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><ringGeometry args={[0.075, 0.6, 64]} />{M.porcelain()}</mesh>
    <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.075, 0.075, 0.08, 40, 1, true]} />{M.matte({ col: "#1a1b1d", side: THREE.DoubleSide })}</mesh>
    {/* la rejilla con cruz: gira con las pinzas y sube al final */}
    <group position={[0, 0.006 + 0.08 * lift, 0]} rotation={[0, spin * PI * 1.5, 0]}>
      <Cross r={0.075} />
      {[0, PI / 2].map((a, i) => <group key={a} rotation={[0, a + PI / 4, 0]}>
        <group position={[0, 0.02 + (1 - inP) * 0.35, 0]} rotation={[0.28 * (i ? 1 : -1), 0, 0]}><Pliers open={0.1 + 0.05 * (1 - inP)} /></group>
      </group>)}
      {/* el giro: un arco de luz que sigue la vuelta */}
      {spin > 0 && spin < 1 && <mesh position={[0, 0.03, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.15, 0.158, 64, 1, 0, 1.4 * PI * cl(spin * 3)]} />{M.glow({ col: AMB, op: 0.7 * (1 - spin) })}</mesh>}
    </group>
    {/* la flecha curva contra reloj, fija al piso */}
    {spin > 0 && spin < 0.95 && <group position={[0, 0.012, 0]} rotation={[-PI / 2, 0, 0]}>
      <mesh><ringGeometry args={[0.2, 0.212, 64, 1, 0.3, PI * 1.1]} />{M.glow({ col: AMB, op: 0.8 })}</mesh>
      <mesh position={[Math.cos(0.3 + PI * 1.1) * 0.206, Math.sin(0.3 + PI * 1.1) * 0.206, 0]} rotation={[0, 0, 0.3 + PI * 1.1]}><coneGeometry args={[0.016, 0.034, 3]} />{M.glow({ col: AMB })}</mesh>
    </group>}
  </>;
}}</Scene3D>;
