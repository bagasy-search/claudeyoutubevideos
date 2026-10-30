// len29a · 3ª vuelta en 3D (tanda 5): libreta, casa entera, colador, almanaque, noche, caja de Stan, remolino.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, RED, H } from "./hkit";
import { Hair, M, RBox, Scene3D, cl, curve, eio, lerp, phys, rn, tex, tubeG } from "./h3d";

const PI = Math.PI;
const sub = (pts: number[][], u: number, n = 30) => { const c = curve(pts), o: number[][] = []; for (let i = 0; i <= n; i++) { const p = c.getPointAt(Math.max(0.002, u) * i / n); o.push([p.x, p.y, p.z]); } return o; };

// ---- 19:45 · LA LIBRETA DE STAN: la tapa gira sobre el lomo; la cámara baja al renglón y el lápiz escribe la regla ----
const LINES = ["Never mix two", "drain chemicals.", "— Stan, 1976"];
const pageTex = (n: number) => tex.text("page" + n, 512, 360, (g) => {
  g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 512, 360);
  for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(140,110,70,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 360, 2, 2); }
  g.strokeStyle = "rgba(80,110,160,.35)"; g.lineWidth = 2; for (let y = 90; y < 360; y += 76) { g.beginPath(); g.moveTo(20, y); g.lineTo(492, y); g.stroke(); }
  g.strokeStyle = "rgba(190,70,60,.4)"; g.beginPath(); g.moveTo(60, 0); g.lineTo(60, 360); g.stroke();
  g.fillStyle = "#3a3a3e"; g.font = "italic 600 44px Georgia"; let left = n;
  LINES.forEach((l, i) => { const k = Math.max(0, Math.min(l.length, left)); left -= l.length; g.fillText(l.slice(0, k), 72, 80 + i * 76); });
});
let MC: CanvasRenderingContext2D | null = null;
const measW = (str: string) => { if (!MC) { MC = document.createElement("canvas").getContext("2d")!; MC.font = "italic 600 44px Georgia"; } return MC.measureText(str).width; };
export const HNotebook: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" warm={0.75}
  cam={{ at: [0, 0.02, 0], at1: [0.02, 0.02, 0.01], az: [0.1, -0.08], el: [1.05, 0.85], r: [0.95, 0.55], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="STAN'S RULE" col={AMB} />}>{(tt) => {
  const open = eio(tt, 0.4, 1.5), total = LINES.join("").length, wr = eio(tt, 1.8, 5.6), n = Math.round(wr * total);
  // dónde está el lápiz: renglón y avance dentro del renglón
  let left = n, li = 0; while (li < 2 && left > LINES[li].length) { left -= LINES[li].length; li++; }
  const wpx = measW(LINES[li].slice(0, Math.max(0, Math.min(LINES[li].length, left)))), px = -0.175 + (72 + wpx) / 512 * 0.35, pz = -0.1225 + (66 + li * 76) / 360 * 0.245;
  const lift = 0.012 * Math.abs(Math.sin(tt * 9)) * (wr > 0 && wr < 1 ? 1 : 0) + 0.06 * (1 - cl(tt - 1.6)) + 0.06 * cl((tt - 5.8) * 2);
  return <>
    {/* la página de la derecha con la regla escrita */}
    <RBox s={[0.36, 0.012, 0.25]} r={0.004} p={[0, 0.006, 0]}>{M.matte({ col: "#e9dfc4" })}</RBox>
    <mesh position={[0, 0.0125, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.35, 0.245]} /><meshStandardMaterial map={pageTex(n)} roughness={0.95} /></mesh>
    {/* la tapa de cuero gastado: gira sobre el lomo de la izquierda */}
    <group position={[-0.18, 0.014, 0]} rotation={[0, 0, PI * 0.98 * open]}>
      <RBox s={[0.37, 0.006, 0.26]} r={0.003} p={[0.185, 0.003, 0]}>{M.matte({ col: "#5a3a22" })}</RBox>
      <mesh position={[0.185, 0.0065, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.2]} />{M.matte({ col: "#6b4528" })}</mesh>
      {[[0.185, 0.104, 0.32, 0.002], [0.185, -0.104, 0.32, 0.002], [0.03, 0, 0.002, 0.21], [0.34, 0, 0.002, 0.21]].map((b, i) => <mesh key={"st" + i} position={[b[0], 0.0068, b[1]]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[b[2], b[3]]} />{M.matte({ col: "#c9a77a" })}</mesh>)}
    </group>
    {Array.from({ length: 9 }, (_, i) => <mesh key={"sp" + i} position={[-0.18, 0.012, -0.11 + i * 0.0275]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.012, 0.0018, 8, 24]} />{M.chrome()}</mesh>)}
    {/* el lápiz amarillo que escribe, con su sombra */}
    <group position={[px, 0.02 + lift, pz]} rotation={[0.9, 0.5, 0.25]}>
      <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.007, 0.007, 0.16, 6]} />{M.plastic({ col: "#f2c230" })}</mesh>
      <mesh position={[0, 0.0, 0]}><coneGeometry args={[0.007, 0.02, 6]} />{M.wood({ base: [222, 188, 140] })}</mesh>
      <mesh position={[0, -0.008, 0]}><coneGeometry args={[0.0025, 0.006, 6]} />{M.matte({ col: "#222" })}</mesh>
      <mesh position={[0, 0.175, 0]}><cylinderGeometry args={[0.0072, 0.0072, 0.014, 12]} />{M.rubber({ col: "#e88a8a" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 21:06 · LA CASA ENTERA: pileta, bañera e inodoro bajan a un mismo caño; el agua sube en los tres a la vez y el caño grande late rojo contra la calle ----
export const HMainLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#101215" lamp={[0, 0.5, 0.5]}
  cam={{ at: [0.04, 0.3, 0], az: [-0.14, 0.12], el: [0.24, 0.18], r: [1.75, 1.55], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE WHOLE HOUSE" col={RED} />}>{(tt) => {
  const rise = eio(tt, 1.4, 4.6), pulse = cl((tt - 1.2) / 0.5) * (0.5 + 0.5 * Math.sin(tt * 2 * PI * 1.1)), roots = cl(phys(tt, 0.6, 5, 0.6));
  const F = 0.14;
  return <>
    {/* el corte de la casa: piso de madera, pared, y la tierra con el caño principal debajo */}
    <RBox s={[1.5, 0.03, 0.5]} r={0.004} p={[0, F - 0.015, 0]}>{M.wood({ base: [150, 98, 56], rx: 4, ry: 1 })}</RBox>
    <mesh position={[0, 0.5, -0.25]}><planeGeometry args={[1.5, 0.75]} />{M.matte({ col: "#d9cdb5" })}</mesh>
    <mesh position={[0.1, -0.08, 0]}><boxGeometry args={[1.8, 0.4, 0.5]} />{M.matte({ col: "#4a3a2a" })}</mesh>
    <mesh position={[0.1, F - 0.0, 0.251]}><planeGeometry args={[1.8, 0.001]} />{M.matte({ col: "#000" })}</mesh>
    {/* el caño principal: atraviesa la tierra hasta la calle; late rojo donde está tapado */}
    <mesh geometry={tubeG("main2", [[-0.62, 0.02, 0.26], [0.2, 0.0, 0.26], [0.95, -0.03, 0.26]], 0.065, 60, 24)}>{M.pvc({ col: "#8e9296" })}</mesh>
    <mesh position={[0.74, -0.025, 0.26]} rotation={[0, 0, PI / 2]} scale={[1 + 0.08 * pulse, 1, 1 + 0.08 * pulse]}><cylinderGeometry args={[0.072, 0.072, 0.3, 32]} /><meshStandardMaterial color="#b03028" emissive="#ff3a2a" emissiveIntensity={0.35 + 0.65 * pulse} transparent opacity={0.8} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} geometry={tubeG("root" + i, [[0.7 + 0.03 * i, -0.28, 0.26 + (rn(i, 2) - 0.5) * 0.2], [0.72 + 0.02 * i, -0.12, 0.26 + (rn(i, 3) - 0.5) * 0.1], [0.75 + 0.02 * i, -0.03, 0.26]], (u) => 0.014 * (1 - 0.6 * u), 24, 8)} scale={[1, roots, 1]}>{M.matte({ col: "#7a5a36" })}</mesh>)}
    {/* tres bajadas desde los artefactos */}
    {[-0.45, 0.0, 0.42].map((x, i) => <group key={i}><mesh geometry={tubeG("drop" + i, [[x, F + 0.05, 0.12], [x, F - 0.05, 0.2], [x, 0.03, 0.26]], 0.026, 20, 16)}>{M.glass({ op: 0.3 })}</mesh>
      {rise > 0.01 && <mesh geometry={tubeG("dropw" + i + Math.round(rise * 20), sub([[x, 0.03, 0.26], [x, F - 0.05, 0.2], [x, F + 0.05, 0.12]], rise), 0.021, 20, 12)}>{M.water({ op: 0.8, emI: 0.6 })}</mesh>}</group>)}
    {/* pileta sobre mueble */}
    <group position={[-0.45, F, 0.05]} scale={1.3}>
      <RBox s={[0.26, 0.24, 0.2]} r={0.01} p={[0, 0.12, 0]}>{M.wood({ base: [120, 80, 46] })}</RBox>
      <RBox s={[0.28, 0.02, 0.22]} r={0.006} p={[0, 0.25, 0]}>{M.matte({ col: "#cfc7b8" })}</RBox>
      <mesh position={[0, 0.2 + 0.05 * rise, 0]}><boxGeometry args={[0.22, 0.004 + 0.04 * rise, 0.16]} />{M.water({ col: "#4aa8e8", op: 0.85 * cl(rise * 3), emI: 0.8 })}</mesh>
      <mesh position={[0.1, 0.33, -0.08]} rotation={[0, 0, -0.4]}><cylinderGeometry args={[0.008, 0.008, 0.14, 12]} />{M.chrome()}</mesh>
    </group>
    {/* bañera de porcelana con patas */}
    <group position={[0.0, F, 0.04]} scale={1.3}>
      <RBox s={[0.42, 0.16, 0.2]} r={0.05} p={[0, 0.1, 0]}>{M.porcelain()}</RBox>
      <mesh position={[0, 0.06 + 0.06 * rise, 0]}><boxGeometry args={[0.38, 0.004 + 0.11 * rise, 0.17]} />{M.water({ col: "#4aa8e8", op: 0.85 * cl(rise * 3), emI: 0.8 })}</mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.16, 0.012, 0.06]}><sphereGeometry args={[0.014, 14, 10]} />{M.brass()}</mesh>)}
    </group>
    {/* inodoro */}
    <group position={[0.44, F, 0.04]} scale={1.3}>
      <mesh position={[0, 0.07, 0.03]} castShadow><cylinderGeometry args={[0.08, 0.05, 0.14, 32]} />{M.porcelain()}</mesh>
      <RBox s={[0.16, 0.18, 0.07]} r={0.012} p={[0, 0.2, -0.06]}>{M.porcelain()}</RBox>
      <mesh position={[0, 0.1 + 0.04 * rise, 0.035]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.065 + 0.012 * rise, 32]} />{M.water({ col: "#4aa8e8", op: 0.9, emI: 0.8 })}</mesh>
    </group>
    <pointLight position={[0.74, 0.1, 0.45]} intensity={0.3 * pulse} distance={0.7} color="#ff4a3a" />
  </>;
}}</Scene3D>;

// ---- 21:38 · EL COLADOR DE $2: canasto de malla sobre el desagüe; llueven agua, arroz, borra y pelo; el agua cruza y todo lo demás queda arriba ----
export const HStrainer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#0f1114"
  cam={{ at: [0, -0.01, 0], az: [0.3, -0.15], el: [0.72, 0.6], r: [0.56, 0.46], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="EVERYTHING ELSE STAYS" col={ICE} />}>{(tt) => {
  const R = 0.12, Y = 0.02;
  const fallTo = (a: number, y0: number, y1: number, d = 0.5) => { const k = cl((tt - a) / d); return lerp(y0, y1, k * k); };
  return <>
    {/* el fondo de la pileta de acero con el agujero del desagüe */}
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><ringGeometry args={[0.128, 0.6, 64]} />{M.steel({ col: "#8f959a" })}</mesh>
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.128, 0.128, 0.24, 40, 1, true]} />{M.steel({ col: "#5a5e62", side: THREE.DoubleSide })}</mesh>
    {/* el canasto de malla: media esfera de alambre con aro cromado */}
    <mesh position={[0, Y + 0.0, 0]} rotation={[PI, 0, 0]}><sphereGeometry args={[R, 28, 12, 0, PI * 2, 0, PI / 2.2]} /><meshStandardMaterial color="#d9dde1" metalness={1} roughness={0.25} wireframe /></mesh>
    <mesh position={[0, Y + 0.0, 0]} rotation={[PI, 0, 0]}><sphereGeometry args={[R * 0.995, 28, 12, 0, PI * 2, 0, PI / 2.2]} /><meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.4} transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, Y + 0.002, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[R, 0.007, 12, 64]} />{M.chrome()}</mesh>
    {/* el agua: gotas que atraviesan la malla y se van por el caño */}
    {tt > 0.5 && tt < 5.6 && <mesh position={[0.01, 0.26, 0]}><cylinderGeometry args={[0.024, 0.018, 0.5, 20, 1, true]} />{M.water({ op: 0.7 * cl((tt - 0.5) * 3) * cl((5.6 - tt) * 3), emI: 0.6 })}</mesh>}
    {tt > 0.5 && tt < 5.6 && <mesh position={[0.01, -0.12, 0]}><cylinderGeometry args={[0.016, 0.01, 0.2, 16, 1, true]} />{M.water({ op: 0.6, emI: 0.6 })}</mesh>}
    {tt > 0.6 && tt < 5.6 && Array.from({ length: 14 }, (_, i) => { const k = ((tt * 1.6 + i / 14) % 1), a = i * 0.45 + rn(i, 11); return <mesh key={"sp" + i} position={[0.01 + Math.cos(a) * 0.1 * k, Y + 0.01 + 0.06 * k - 0.09 * k * k, Math.sin(a) * 0.1 * k]}><sphereGeometry args={[0.005 + 0.004 * rn(i, 12), 10, 8]} />{M.water({ op: 0.8 * (1 - k), emI: 0.6 })}</mesh>; })}
    {Array.from({ length: 16 }, (_, i) => { const a = 0.6 + i * 0.12, k = cl((tt - a) / 0.7); return k > 0 && k < 1 ? <mesh key={"w" + i} position={[(rn(i, 2) - 0.5) * 0.06, lerp(0.5, -0.2, k * k), (rn(i, 3) - 0.5) * 0.06]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.008, 12, 10]} />{M.water({ op: 0.85, emI: 0.6 })}</mesh> : null; })}
    {/* el arroz: granos que caen y se quedan en el canasto */}
    {Array.from({ length: 12 }, (_, i) => { const a = 1.6 + i * 0.11, ang = rn(i, 4) * 2 * PI, rr = 0.07 * Math.sqrt(rn(i, 5)); return tt > a - 0.5 ? <mesh key={"r" + i} position={[Math.cos(ang) * rr, Math.max(fallTo(a - 0.5, 0.5, Y - 0.07 + 0.012 * rn(i, 6)), Y - 0.08 + rr * 0.6), Math.sin(ang) * rr]} rotation={[rn(i, 7) * 3, rn(i, 8) * 3, 0]}><capsuleGeometry args={[0.0045, 0.014, 4, 8]} />{M.porcelain({ col: "#f6f2e6" })}</mesh> : null; })}
    {/* la borra del café: puntitos oscuros */}
    {Array.from({ length: 14 }, (_, i) => { const a = 3.0 + i * 0.07, ang = rn(i, 9) * 2 * PI, rr = 0.06 * Math.sqrt(rn(i, 10)); return tt > a - 0.5 ? <mesh key={"c" + i} position={[Math.cos(ang) * rr, Math.max(fallTo(a - 0.5, 0.5, Y - 0.06), Y - 0.075 + rr * 0.6), Math.sin(ang) * rr]}><sphereGeometry args={[0.006, 8, 6]} />{M.matte({ col: "#2a1c12" })}</mesh> : null; })}
    {/* el pelo: un mechón que cae último y queda colgando del borde */}
    {tt > 4.0 && <group position={[0, Math.max(fallTo(4.0, 0.45, Y - 0.04, 0.6), Y - 0.04), 0]}><Hair id="str" n={16} spread={0.012} r={0.0009} pts={[[-0.08, 0.02, 0.0], [-0.03, -0.02, 0.02], [0.03, -0.03, -0.01], [0.09, 0.0, 0.02], [0.13, 0.015, 0.03]]} /></group>}
  </>;
}}</Scene3D>;

// ---- 22:12 · EL ALMANAQUE: colgado de un clavo; el lápiz encierra cada domingo; la hoja se arranca, gira y cae; el mes siguiente igual ----
const calTex = (m: string) => tex.text("cal" + m, 512, 512, (g) => {
  g.fillStyle = "#f7f2e4"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#b8342a"; g.fillRect(0, 0, 512, 92);
  g.fillStyle = "#fff"; g.font = "900 58px Arial"; g.textAlign = "center"; g.fillText(m, 256, 66);
  g.fillStyle = "#333"; g.font = "700 30px Arial";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const d = r * 7 + c + 1; if (d > 31) continue; g.fillStyle = c === 0 ? "#b8342a" : "#3a3a3a"; g.fillText(String(d), 40 + c * 72, 150 + r * 76); }
});
export const HCalendar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.5, -1.4], az: [-0.2, 0.14], el: [0.06, 0.03], r: [0.84, 0.72], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="ONCE A WEEK" col={AMB} />}>{(tt) => {
  const W = 0.36, X0 = -W / 2, Z = -1.57;
  const circ = (a: number, k: number, d = 0.4) => cl((tt - a) / d) * k;
  const tear = eio(tt, 3.2, 3.9), fall = cl((tt - 3.8) / 0.9) ** 2;
  const sun = (r: number) => [X0 + (40 / 512) * W, 0.5 + W / 2 - (140 / 512) * W - r * (76 / 512) * W];
  const marks = (a0: number, gap: number) => [0, 1, 2, 3].map((r) => { const [x, y] = sun(r), k = circ(a0 + r * gap, 1); return k > 0 ? <mesh key={r} position={[x, y, 0.004]}><ringGeometry args={[0.019, 0.024, 40, 1, PI / 2, 2 * PI * k]} />{M.glow({ col: "#2a5bd7" })}</mesh> : null; });
  const pen = tt < 3.0 ? Math.min(3, Math.floor((tt - 0.8) / 0.55)) : Math.min(3, Math.floor((tt - 4.6) / 0.4));
  const pp = sun(Math.max(0, pen)), pk = (tt < 3.0 ? (tt - 0.8) / 0.55 : (tt - 4.6) / 0.4) % 1, pa = 2 * PI * pk + PI / 2;
  return <>
    {/* el clavo y el hilo */}
    <mesh position={[0, 0.5 + W / 2 + 0.06, Z + 0.02]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.005, 0.005, 0.04, 10]} />{M.steel()}</mesh>
    <group position={[0, 0, Z]}>
      {/* el mes de abajo (noviembre) y sus domingos marcados después */}
      <RBox s={[W, W, 0.006]} r={0.002} p={[0, 0.5, -0.004]}>{M.matte({ col: "#efe9da" })}</RBox>
      <mesh position={[0, 0.5, 0.0]}><planeGeometry args={[W, W]} /><meshStandardMaterial map={calTex("NOVEMBER")} roughness={0.9} /></mesh>
      {tt > 4.4 && marks(4.6, 0.4)}
      {/* la hoja de octubre: marcas, después se arranca desde arriba, gira y cae */}
      {fall < 1 && <group position={[0.3 * fall, 0.5 + W / 2 - 1.1 * fall, 0.03 * tear + 0.1 * fall + 0.002]} rotation={[0.9 * fall, 0.4 * fall, -1.1 * tear - 1.3 * fall]}>
        <group position={[0, -W / 2, 0]}>
          <mesh castShadow><planeGeometry args={[W, W]} /><meshStandardMaterial map={calTex("OCTOBER")} roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <group position={[0, -0.5, 0.001]}>{marks(0.8, 0.55)}</group>
        </group>
      </group>}
    </group>
    {/* el lápiz que dibuja cada círculo */}
    {(tt > 0.8 && tt < 3.0) || (tt > 4.6 && tt < 6.4) ? <group position={[pp[0] + Math.cos(pa) * 0.022, pp[1] + Math.sin(pa) * 0.022, Z + 0.04]} rotation={[0.3, -0.4, 0.5]}>
      <mesh position={[0.06, 0.06, 0]} rotation={[0, 0, PI / 4]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.15, 6]} />{M.plastic({ col: "#2a5bd7" })}</mesh>
    </group> : null}
  </>;
}}</Scene3D>;

// ---- 22:47 · LA NOCHE DE LA ENZIMA: cocina a oscuras; un chorrito del frasco en la pileta; la luna cruza la ventana, el reloj gira 8 horas y amanece ----
export const HNight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="tile" warm={0.35}
  cam={{ at: [0, 0.55, -1.0], az: [-0.2, 0.12], el: [0.1, 0.08], r: [1.55, 1.38], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="EIGHT HOURS ALONE" col={ICE} />}>{(tt) => {
  const pour = eio(tt, 0.4, 1.0) * (1 - eio(tt, 2.4, 2.9)), night = eio(tt, 2.0, 5.0), dawn = eio(tt, 4.3, 5.6);
  const sky = new THREE.Color("#0c1838").lerp(new THREE.Color("#f2a25a"), dawn), Z = -1.59;
  return <>
    {/* la ventana con marco de madera; afuera el cielo cambia; la luna cruza con su halo */}
    <mesh position={[-0.3, 0.75, Z]}><planeGeometry args={[0.5, 0.4]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    {[[-0.3, 0.95, 0.54, 0.03], [-0.3, 0.55, 0.54, 0.03], [-0.3, 0.75, 0.02, 0.4]].map((b, i) => <RBox key={i} s={[b[2], b[3], 0.03]} r={0.004} p={[b[0], b[1], Z + 0.015]}>{M.wood({ base: [140, 96, 58] })}</RBox>)}
    {[-0.56, -0.04].map((x) => <RBox key={x} s={[0.03, 0.43, 0.03]} r={0.004} p={[x, 0.75, Z + 0.015]}>{M.wood({ base: [140, 96, 58] })}</RBox>)}
    {(() => { const mx = lerp(-0.48, -0.12, night), my = 0.62 + 0.24 * Math.sin(PI * night); return <group position={[mx, my, Z + 0.005]}>
      <mesh><circleGeometry args={[0.055, 32]} /><meshBasicMaterial color="#f4f0dc" toneMapped={false} transparent opacity={1 - dawn} /></mesh>
      <mesh><ringGeometry args={[0.06, 0.12, 40]} /><meshBasicMaterial color="#b9c8f0" transparent opacity={0.2 * (1 - dawn)} depthWrite={false} /></mesh>
    </group>; })()}
    <pointLight position={[-0.3, 0.72, Z + 0.35]} intensity={0.25 + 0.75 * dawn} distance={2.5} color={dawn > 0.5 ? "#ffc88a" : "#9ab4ff"} />
    {/* el reloj de pared: las agujas giran ocho horas */}
    <group position={[0.36, 0.72, Z + 0.01]} scale={2.4}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.02, 48]} />{M.porcelain()}</mesh>
      <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.002]}><torusGeometry args={[0.09, 0.008, 12, 48]} />{M.brass()}</mesh>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.sin(i * PI / 6) * 0.075, Math.cos(i * PI / 6) * 0.075, 0.012]}><boxGeometry args={[0.004, 0.012, 0.002]} />{M.matte({ col: "#222" })}</mesh>)}
      <group position={[0, 0, 0.014]} rotation={[0, 0, -(PI / 6) * (10 + 8 * night)]}><mesh position={[0, 0.025, 0]}><boxGeometry args={[0.007, 0.05, 0.002]} />{M.matte({ col: "#111" })}</mesh></group>
      <group position={[0, 0, 0.016]} rotation={[0, 0, -2 * PI * 8 * night]}><mesh position={[0, 0.035, 0]}><boxGeometry args={[0.004, 0.07, 0.002]} />{M.matte({ col: "#111" })}</mesh></group>
    </group>
    {/* la mesada con la pileta y el frasco que vierte */}
    <RBox s={[1.2, 0.04, 0.45]} r={0.006} p={[0, 0.3, -1.3]}>{M.matte({ col: "#7a7268" })}</RBox>
    <RBox s={[1.2, 0.28, 0.42]} r={0.006} p={[0, 0.14, -1.3]}>{M.wood({ base: [96, 64, 40] })}</RBox>
    <mesh position={[0, 0.3, -1.3]}><cylinderGeometry args={[0.15, 0.1, 0.045, 4, 1, true, PI / 4]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    <group position={[0.15, 0.45, -1.12]} rotation={[0, 0, 1.6 * pour]} scale={2.2}>
      <mesh castShadow><cylinderGeometry args={[0.04, 0.04, 0.12, 32]} />{M.glass({ op: 0.4, col: "#cfe8d0" })}</mesh>
      <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.036, 0.036, 0.07, 32]} />{M.water({ col: "#8fd38a", op: 0.7, em: "#1a4a16" })}</mesh>
      <mesh position={[0, 0.068, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02, 24]} />{M.plastic({ col: "#2a6a3a" })}</mesh>
    </group>
    {pour > 0.7 && <mesh geometry={tubeG("npour2", [[0.02, 0.46, -1.12], [0.0, 0.4, -1.2], [-0.01, 0.31, -1.27]], 0.012, 16, 8)}>{M.water({ col: "#8fd38a", op: 0.85, em: "#1a4a16" })}</mesh>}
  </>;
}}</Scene3D>;

// ---- 23:37 · LA CAJA DE STAN: caja de chapa roja; la tapa gira, las bandejas se abren en escalera y los objetos del video suben de a uno ----
export const HToolbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.24, 0], at1: [0.02, 0.32, 0], az: [-0.65, -0.3], el: [0.42, 0.34], r: [1.5, 1.38], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE SHORT VERSION" col={AMB} />}>{(tt) => {
  const lid = eio(tt, 0.4, 1.3), tr = eio(tt, 1.3, 2.3);
  const W = 0.5, D = 0.22, Hh = 0.18;
  const obj = (i: number, ch: React.ReactNode, p: number[]) => { const a = 2.5 + i * 0.6, k = cl(phys(tt, a, 6, 0.45)); return k > 0.01 ? <group key={i} position={[p[0], p[1] + 0.16 * (1 - k), p[2]]} scale={1.7 * k}>{ch}</group> : null; };
  const trayY = (j: number) => Hh + 0.02 + tr * (0.05 + j * 0.065), trayZ = (j: number) => (j - 1) * tr * 0.085;
  return <>
    <RBox s={[W, Hh, D]} r={0.012} p={[0, Hh / 2, 0]}>{M.plastic({ col: "#b8241e" })}</RBox>
    <mesh position={[0, Hh - 0.02, D / 2 + 0.002]}><boxGeometry args={[0.06, 0.02, 0.01]} />{M.chrome()}</mesh>
    {/* la tapa gira hacia atrás sobre la bisagra */}
    <group position={[0, Hh, -D / 2]} rotation={[-1.9 * lid, 0, 0]}>
      <RBox s={[W, 0.03, D]} r={0.01} p={[0, 0.015, D / 2]}>{M.plastic({ col: "#c42a22" })}</RBox>
    </group>
    {/* las dos bandejas que suben en escalera, con sus brazos */}
    {[0, 1, 2].map((j) => <group key={j} position={[0, trayY(j), trayZ(j)]}>
      <RBox s={[W - 0.03, 0.035, D / 2 - 0.01]} r={0.006} p={[0, 0, 0]}>{M.plastic({ col: ["#9a1e18", "#a8241d", "#b52b22"][j] })}</RBox>
      {[-1, 1].map((s) => <mesh key={s} position={[s * (W / 2 - 0.02), -0.04 * tr, -trayZ(j) / 2]} rotation={[(j - 1) * 0.8 * tr, 0, 0]}><boxGeometry args={[0.008, 0.11 * tr + 0.001, 0.012]} />{M.steel()}</mesh>)}
    </group>)}
    {/* los objetos del video, de a uno, apoyados con sombra */}
    {obj(0, <><mesh position={[0, 0.03, 0]} castShadow><sphereGeometry args={[0.04, 24, 16, 0, PI * 2, 0, PI / 2]} />{M.matte({ col: "#c2302a", side: THREE.DoubleSide })}</mesh><mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.007, 0.007, 0.14, 12]} />{M.wood({ base: [170, 112, 60] })}</mesh></>, [-0.16, trayY(1) + 0.0, trayZ(1)])}
    {obj(1, <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.06, 24]} />{M.glass({ col: "#cfe8d0", op: 0.5 })}</mesh>, [-0.04, trayY(1), trayZ(1)])}
    {obj(2, <mesh position={[0, 0.012, 0]} rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[0.035, 0.006, 10, 40]} />{M.chrome()}</mesh>, [0.1, trayY(2), trayZ(2)])}
    {obj(3, <mesh position={[0, 0.03, 0]} rotation={[PI / 2, 0, 0]} castShadow><torusGeometry args={[0.03, 0.012, 12, 40]} />{M.plastic({ col: "#c2302a" })}</mesh>, [-0.1, trayY(0), trayZ(0)])}
    {obj(4, <RBox s={[0.05, 0.07, 0.03]} r={0.004} p={[0, 0.035, 0]}>{M.plastic({ col: "#f08a24" })}</RBox>, [0.04, trayY(0), trayZ(0)])}
    {obj(5, <mesh position={[0, 0.012, 0]} castShadow><cylinderGeometry args={[0.045, 0.04, 0.02, 32]} /><meshStandardMaterial color="#d9dde1" metalness={1} roughness={0.25} wireframe /></mesh>, [-0.1, trayY(2), trayZ(2)])}
  </>;
}}</Scene3D>;

// ---- 24:40 · EL REMOLINO: la pileta vista desde arriba con el colador; el agua gira en espiral y se va limpia; los pelos quedan en la malla y la malla brilla ----
const spiralTex = () => tex.text("spiral", 512, 512, (g) => {
  g.fillStyle = "#2f6f9a"; g.fillRect(0, 0, 512, 512); g.translate(256, 256);
  for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(220,245,255,${0.35 + 0.08 * k})`; g.lineWidth = 10 - k; g.beginPath(); for (let a = 0; a < 14; a += 0.05) { const r = 250 - a * 17; const aa = a + k * PI / 3; g.lineTo(Math.cos(aa) * r, Math.sin(aa) * r); } g.stroke(); }
});
export const HSwirl: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0f1114"
  cam={{ at: [0, -0.12, 0], az: [0.0, 0.6], el: [1.25, 1.08], r: [0.85, 0.5], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE ONE THAT SAVES YOU" col={ICE} />}>{(tt) => {
  const rot = tt * 2.4 + tt * tt * 0.12, lvl = 1 - eio(tt, 2.5, 5.2), shine = cl(phys(tt, 4.4, 6, 0.5)) * (1 - cl((tt - 5.4) / 0.6));
  return <>
    {/* la mesada con la cubeta hundida */}
    <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><ringGeometry args={[0.3, 0.9, 64]} />{M.steel({ col: "#b9bec3" })}</mesh>
    <mesh position={[0, -0.07, 0]}><cylinderGeometry args={[0.3, 0.27, 0.14, 64, 1, true]} />{M.steel({ col: "#8d9297", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.006, 10, 72]} />{M.chrome()}</mesh>
    <mesh position={[0, -0.14, 0]} rotation={[-PI / 2, 0, 0]} receiveShadow><circleGeometry args={[0.27, 64]} />{M.steel({ col: "#9da2a7" })}</mesh>
    <group position={[0, -0.138, 0]}>
    {/* el agua con la espiral que gira y va bajando */}
    {lvl > 0.02 && <mesh position={[0, 0.002 + 0.012 * lvl, 0]} rotation={[-PI / 2, 0, rot]}><circleGeometry args={[0.268, 64]} /><meshPhysicalMaterial map={spiralTex()} roughness={0.05} clearcoat={1} transparent opacity={0.75 * lvl + 0.1} emissive="#1d4a6a" emissiveIntensity={0.4} /></mesh>}
    {/* el colador: aro cromado y malla de alambre */}
    <mesh position={[0, 0.004, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.06, 0.006, 12, 48]} />{M.chrome()}</mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.058, 32]} />{M.matte({ col: "#0b0e11" })}</mesh>
    {Array.from({ length: 18 }, (_, i) => { const v = i >= 9, c = ((i % 9) / 8 - 0.5) * 0.104, L = 2 * Math.sqrt(0.058 * 0.058 - c * c); return <mesh key={"m" + i} position={[v ? c : 0, 0.005, v ? 0 : c]} rotation={[0, v ? 0 : PI / 2, 0]}><boxGeometry args={[0.0022, 0.0022, L]} /><meshStandardMaterial color="#e6eaee" metalness={1} roughness={0.2} emissive="#ffffff" emissiveIntensity={0.5 * shine} /></mesh>; })}
    {/* hebras largas que el remolino arrastra hasta la malla y quedan enganchadas */}
    {Array.from({ length: 10 }, (_, i) => { const k = eio(tt, 0.4 + i * 0.22, 2.4 + i * 0.22), a0 = i * 0.9 + rot * (1 - k) * 0.5, r0 = lerp(0.24, 0.035, k);
      const pts = Array.from({ length: 6 }, (_, j) => { const aa = a0 + j * 0.35, rr = r0 + j * 0.01 * (1 - k) + j * 0.004; return [Math.cos(aa) * rr, 0.012 + 0.002 * j, Math.sin(aa) * rr]; });
      return <mesh key={i} geometry={tubeG(`sw${i}_${Math.round(k * 30)}_${Math.round(a0 * 10)}`, pts, 0.0042, 30, 6)}>{M.hair({ col: i % 2 ? "#7a5634" : "#4a3220" })}</mesh>; })}
    {shine > 0 && <group position={[0.03, 0.02, -0.02]} scale={0.04 * shine}>{[0, PI / 2].map((r) => <mesh key={r} rotation={[-PI / 2, 0, r]}><planeGeometry args={[2, 0.12]} />{M.glow({ col: "#ffffff", op: shine })}</mesh>)}</group>}
    </group>
    <pointLight position={[0, 0.05, 0]} intensity={0.25 * shine} distance={0.4} color="#ffffff" />
  </>;
}}</Scene3D>;
