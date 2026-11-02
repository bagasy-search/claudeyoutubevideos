// lin01a · lote G: el uniforme del pasajero armado sobre la cama (maniqui) y la tarjeta de seguridad de los 11 puntos (recap)
import React from "react";
import * as THREE from "three";
import { Stage } from "./base";
import { HAND, Esc, M, RBox, canv, cl, fabricTex, lerp, rn, spr, Blob, Sombra, extr, Colcha, leatherTex, tartanTex, tubeG, type Pose, type V3 } from "./k3d";
import { Zapato } from "./comps_f";
import type { Fi } from "./valija";

const sm = (x: number) => { const u = cl(x); return u * u * (3 - 2 * u); };
// cámara por paradas: [t, foco x, foco z, altura, adelanto z]; entre paradas va en curva suave, llega desde la profundidad
const camK = (t: number, a: number, K: [number, number, number, number, number][], fov = 36): Pose => {
  let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const [t0, x0, z0, h0, d0] = K[i], [t1, x1, z1, h1, d1] = K[Math.min(i + 1, K.length - 1)], k = sm((t - t0) / Math.max(0.3, t1 - t0));
  const x = lerp(x0, x1, k), z = lerp(z0, z1, k), h = lerp(h0, h1, k), d = lerp(d0, d1, k);
  const arr = 1 - spr(t, a - 0.05, 0.55, 1.2), back = 1 + 0.8 * arr, sw = 0.04 * Math.sin((t - a) * 0.6);
  const hx = 0.004 * Math.sin(t * 1.7) + 0.003 * Math.sin(t * 2.9 + 1), hy = 0.003 * Math.sin(t * 1.3 + 2);
  return { p: [x + d * Math.sin(sw) * back + hx, h * back + hy, z + d * Math.cos(sw) * back], l: [x, 0, z], fov };
};
// cae desde arriba con resorte, gira un poco y asienta
const Cae: React.FC<{ t: number; at: number; p: V3; r?: number; children: React.ReactNode; blob?: [number, number] }> = ({ t, at, p, r = 0, children, blob }) => {
  if (t < at - 0.02) return null;
  const s = spr(t, at, 0.8, 1.5), u = cl(s);
  return <group position={[p[0], p[1] + 0.32 * (1 - s), p[2]]} rotation={[0.25 * (1 - u), r + 0.5 * (1 - u), 0]}>
    {children}
    {blob && <group position={[0, -p[1] - 0.32 * (1 - s) + 0.002, 0]}><Blob w={blob[0]} d={blob[1]} o={0.45 * u} /></group>}
  </group>;
};
// prenda plana: silueta extruida (blanda) con su tela, acostada sobre la cama
const Plana: React.FC<{ k: string; pts: number[][]; col: string; tela: "jersey" | "lana" | "navy" | "lino" }> = ({ k, pts, col, tela }) =>
  <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr(k, pts, 0.006, 0.006)} castShadow receiveShadow><meshStandardMaterial map={fabricTex(tela, [3, 3])} color={col} roughness={0.92} /></mesh>;

const JOG = [[-0.13, 0.25], [0.13, 0.25], [0.145, 0.06], [0.125, -0.25], [0.03, -0.25], [0.0, 0.04], [-0.03, -0.25], [-0.125, -0.25], [-0.145, 0.06]];
const REM = [[-0.13, -0.2], [0.13, -0.2], [0.13, 0.08], [0.22, 0.03], [0.265, 0.11], [0.15, 0.2], [0.06, 0.22], [0, 0.185], [-0.06, 0.22], [-0.15, 0.2], [-0.265, 0.11], [-0.22, 0.03], [-0.13, 0.08]];
const CAR = [[-0.14, -0.24], [0.14, -0.24], [0.14, 0.06], [0.2, -0.22], [0.27, -0.2], [0.17, 0.2], [0.07, 0.23], [0.0, 0.0], [-0.07, 0.23], [-0.17, 0.2], [-0.27, -0.2], [-0.2, -0.22], [-0.14, 0.06]];
const MED = [[-0.028, 0.1], [0.028, 0.1], [0.028, -0.03], [0.075, -0.06], [0.072, -0.1], [-0.015, -0.1], [-0.03, -0.06]];

// el joyero: tapa de cuero que se cierra en la palabra; adentro, terciopelo, collar de perlas y aros. Cuelga la etiqueta «AT HOME».
const Joyero: React.FC<{ t: number; wow: number }> = ({ t, wow }) => {
  const cierra = cl(spr(t, wow - 0.08, 1.1, 1.6)), tag = spr(t, wow + 0.12, 0.7, 2.2), sw = 0.35 * Math.exp(-(t - wow - 0.12) * 1.6) * Math.sin((t - wow - 0.12) * 7) * (t > wow + 0.12 ? 1 : 0);
  const cuero = leatherTex([128, 34, 46], "joy");
  return <group>
    <RBox s={[0.16, 0.05, 0.11]} r={0.01} p={[0, 0.025, 0]}><meshStandardMaterial map={cuero} roughness={0.5} /></RBox>
    <mesh position={[0, 0.0505, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.145, 0.095]} /><meshPhysicalMaterial color="#1f2f5c" roughness={1} sheen={1} sheenColor="#7f9bff" /></mesh>
    {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <mesh key={i} position={[0.04 * Math.cos(a) - 0.02, 0.056, 0.03 * Math.sin(a)]}><sphereGeometry args={[0.0055, 14, 10]} />{M.porcelain({ col: "#f6f1e6" })}</mesh>; })}
    {[0.038, 0.06].map((x) => <group key={x} position={[x, 0.056, -0.01]}><mesh position={[0, 0, -0.012]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.005, 0.0012, 8, 20]} />{M.brass({ col: "#e0b84a" })}</mesh><mesh position={[0, 0.001, 0.006]}><sphereGeometry args={[0.0085, 16, 12]} />{M.porcelain({ col: "#f6f1e6" })}</mesh></group>)}
    <group position={[0, 0.05, -0.055]} rotation={[-1.95 * (1 - cierra), 0, 0]}>
      <RBox s={[0.164, 0.022, 0.112]} r={0.01} p={[0, 0.011, 0.056]}><meshStandardMaterial map={cuero} roughness={0.5} /></RBox>
      <mesh position={[0, 0.0225, 0.11]}><boxGeometry args={[0.02, 0.006, 0.004]} />{M.brass({ col: "#d9b04a" })}</mesh>
    </group>
    {/* la etiqueta de cartulina, atada con hilo al broche */}
    {tag > 0.01 && <group position={[0.075, 0.04, 0.06]} rotation={[0, 0, sw]}>
      <mesh position={[0.01, -0.005, 0.005]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.0008, 0.0008, 0.03, 6]} /><meshStandardMaterial color="#d8cfc0" /></mesh>
      <group position={[0.06 * cl(tag), 0.002, 0.04 * cl(tag)]} rotation={[-Math.PI / 2, 0, -0.35 + 0.2 * (1 - cl(tag))]} scale={Math.max(0.001, cl(tag))}>
        <mesh castShadow><boxGeometry args={[0.1, 0.05, 0.0012]} /><meshStandardMaterial map={canv("tagHome", 400, 200, (g) => { g.fillStyle = "#efe2c4"; g.fillRect(0, 0, 400, 200); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(120,90,50,${0.06 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 400, rn(i, 3) * 200, 2, 2); } g.fillStyle = "#fff"; g.beginPath(); g.arc(34, 100, 12, 0, 6.3); g.fill(); g.strokeStyle = "#a08860"; g.lineWidth = 3; g.stroke(); g.font = `700 76px "${HAND}"`; g.fillStyle = "#2b2a5a"; g.textBaseline = "middle"; g.fillText("at home", 78, 106); })} roughness={0.9} /></mesh>
      </group>
    </group>}
  </group>;
};

// ═════════ MANIQUI: el uniforme del pasajero se arma sobre la colcha, de los pies a la cabeza, prenda por prenda a medida que Linda
// la nombra. En «your good jewelry at home» el joyero se cierra solo y le cae la etiqueta «at home». Al salir, la cámara sube. ═════════
export const Maniqui: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, mo = f.mo ?? {};
  const T = (k: string) => mo[k] ?? a;
  const cam = camK(t, a, [[a, 0, 0.5, 0.8, 0.45], [T("jog") + 0.6, 0, 0.3, 0.95, 0.5], [T("remera") + 0.5, 0, -0.22, 1.05, 0.55], [T("bolso") + 0.4, 0.1, 0.0, 1.1, 0.6],
    [T("metal") - 0.2, -0.26, 0.34, 0.7, 0.4], [wow + 1.8, -0.3, 0.44, 0.6, 0.36], [T("pen") + 0.4, 0.26, 0.4, 0.8, 0.45], [b - 1.6, 0.0, 0.08, 2.2, 0.5], [b, 0.0, 0.08, 2.45, 0.55]], 32);
  return <Stage t={t} a={a} b={b} dim={0.5} tint="#ffe2b8">
    <Esc cam={cam} key1={[-1.4, 2.4, 0.6]} warm={1.05} cool={0.9} exposure={1.05}>
      <Colcha w={3.8} d={3.2} y={-0.004} />
      <Sombra w={3.8} d={3.2} o={0.25} y={0.001} />
      {/* zapatillas (ya estaban: «sneakers you've already broken in») */}
      {[-0.07, 0.07].map((x, i) => <Cae key={x} t={t} at={a - 0.4 + i * 0.15} p={[x * 1.15, 0.004, 0.68]} r={i ? -0.08 : 0.08} blob={[0.16, 0.3]}><group rotation={[0, Math.PI, 0]} scale={1.5}><Zapato col="#a9b6c8" /></group></Cae>)}
      {[-0.06, 0.07].map((x, i) => <Cae key={x} t={t} at={T("medias") + i * 0.12} p={[x, 0.006, 0.48]} r={i ? 0.2 : -0.1}><group scale={[i ? -1 : 1, 1, 1]}><Plana k="media" pts={MED} col="#d8c9ad" tela="lana" /></group></Cae>)}
      <Cae t={t} at={T("jog")} p={[0, 0.008, 0.17]} blob={[0.4, 0.55]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("jog2", JOG, 0.012, 0.012)} castShadow receiveShadow><meshStandardMaterial map={fabricTex("jersey", [3, 3])} color="#9ea3aa" roughness={0.92} /></mesh>
        {[-0.075, 0.075].map((x) => <mesh key={x} position={[x, 0.0185, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.003, 0.36]} /><meshStandardMaterial color="#7f858d" roughness={1} /></mesh>)}
        {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.105, 0.0185, -0.17]} rotation={[-Math.PI / 2, 0, sx * 0.5]}><planeGeometry args={[0.003, 0.08]} /><meshStandardMaterial color="#7f858d" roughness={1} /></mesh>)}
        {[-1, 1].map((sx) => <mesh key={"c" + sx} position={[sx * 0.018, 0.02, -0.19]} rotation={[0, 0, sx * 0.2]}><boxGeometry args={[0.004, 0.003, 0.06]} /><meshStandardMaterial color="#f2efe8" roughness={0.6} /></mesh>)}
        <RBox s={[0.27, 0.014, 0.04]} r={0.006} p={[0, 0.012, -0.232]}><meshStandardMaterial map={fabricTex("jersey", [6, 1])} color="#8d939b" roughness={0.95} /></RBox>
        {[-0.09, 0.09].map((x) => <RBox key={x} s={[0.1, 0.014, 0.032]} r={0.006} p={[x * 0.85, 0.012, 0.24]}><meshStandardMaterial map={fabricTex("jersey", [4, 1])} color="#8d939b" roughness={0.95} /></RBox>)}
              </Cae>
      <Cae t={t} at={T("remera")} p={[0, 0.024, -0.27]} blob={[0.55, 0.45]}>
        <Plana k="rem" pts={REM} col="#f4f1ea" tela="jersey" />
        <mesh position={[0, 0.0075, -0.175]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.055, 0.005, 6, 32, Math.PI]} /><meshStandardMaterial color="#e6e1d6" roughness={0.9} /></mesh>
      </Cae>
      <Cae t={t} at={T("cardi")} p={[0, 0.034, -0.28]} blob={[0.7, 0.55]}>
        <group scale={[1.22, 1, 1.18]}>{[-1, 1].map((sx) => <group key={sx} scale={[sx, 1, 1]}><mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("carL", [[0.06, -0.24], [0.14, -0.24], [0.14, 0.06], [0.2, -0.22], [0.27, -0.2], [0.17, 0.2], [0.07, 0.23], [0.04, 0.0]], 0.006, 0.006)} castShadow receiveShadow><meshStandardMaterial map={fabricTex("lana", [3, 3])} color="#566179" roughness={0.92} /></mesh></group>)}</group>
        {[-0.2, -0.11, -0.02, 0.07].map((z) => <mesh key={z} position={[-0.085, 0.009, z + 0.04]}><cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />{M.porcelain({ col: "#e8dcc4" })}</mesh>)}
      </Cae>
      <Cae t={t} at={T("chal")} p={[0, 0.044, -0.53]} r={Math.PI / 2 + 0.06} blob={[0.8, 0.3]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("chal", [[-0.11, -0.36], [0.11, -0.36], [0.13, 0.0], [0.11, 0.36], [-0.11, 0.36], [-0.09, 0.0]], 0.008, 0.007)} castShadow receiveShadow><meshStandardMaterial map={fabricTex("lana", [3, 6])} color="#c8928a" roughness={0.95} /></mesh>
        {Array.from({ length: 9 }, (_, i) => [-1, 1].map((s) => <mesh key={i + "" + s} position={[-0.1 + i * 0.025, 0.004, s * 0.375]}><boxGeometry args={[0.004, 0.003, 0.03]} /><meshStandardMaterial color="#b98078" roughness={1} /></mesh>))}
      </Cae>
      <Cae t={t} at={T("bolso")} p={[0.27, 0.05, -0.02]} r={-0.12} blob={[0.3, 0.26]}>
        <RBox s={[0.2, 0.04, 0.15]} r={0.02} p={[0, 0.0, 0]}><meshStandardMaterial map={leatherTex([96, 62, 40], "bolso")} roughness={0.55} /></RBox>
        <mesh position={[0, 0.021, -0.045]}><boxGeometry args={[0.17, 0.002, 0.006]} />{M.steel({ col: "#b9bcc0" })}</mesh>
        <mesh position={[0.07, 0.024, -0.045]}><boxGeometry args={[0.012, 0.004, 0.02]} />{M.brass({ col: "#c9a24a" })}</mesh>
        <mesh rotation={[-Math.PI / 2, 0, 2.3]} position={[-0.2, 0.0, -0.2]} scale={[1.5, 1, 1]}><torusGeometry args={[0.2, 0.007, 8, 48, 1.3]} /><meshStandardMaterial map={leatherTex([70, 44, 28], "corr")} roughness={0.6} /></mesh>
      </Cae>
      {/* «very little metal»: un platito de loza con una sola alianza; el joyero queda al lado */}
      <Cae t={t} at={T("metal")} p={[-0.3, 0.006, 0.3]} blob={[0.18, 0.18]}>
        <mesh><cylinderGeometry args={[0.055, 0.04, 0.012, 40]} />{M.porcelain({ col: "#f3efe6" })}</mesh>
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.012, 0.0028, 12, 32]} />{M.brass({ col: "#e2b955" })}</mesh>
      </Cae>
      <Cae t={t} at={T("metal") + 0.5} p={[-0.33, 0.003, 0.5]} r={0.12} blob={[0.3, 0.26]}><group scale={1.35}><Joyero t={t} wow={wow} /></group></Cae>
      <Cae t={t} at={T("pen")} p={[0.27, 0.01, 0.36]} r={0.6}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0055, 0.0055, 0.14, 20]} />{M.plastic({ col: "#1e2a4a" })}</mesh>
        <mesh position={[0.072, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.0055, 0.012, 20]} />{M.chrome()}</mesh>
        <mesh position={[-0.045, 0.006, 0]}><boxGeometry args={[0.04, 0.002, 0.003]} />{M.chrome()}</mesh>
      </Cae>
      <Cae t={t} at={T("perf")} p={[0.3, 0.0, 0.52]} blob={[0.12, 0.12]}><group scale={1.8}>
        <mesh position={[0, 0.022, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.044, 24]} /><meshPhysicalMaterial color="#f7d9c4" transmission={0.6} roughness={0.05} thickness={0.01} clearcoat={1} /></mesh>
        <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.007, 0.007, 0.012, 16]} />{M.brass({ col: "#d4af55" })}</mesh>
      </group></Cae>
    </Esc>
  </Stage>;
};

// ── la tarjeta de seguridad: 11 paneles plastificados, cada uno con su pictograma y su número en círculo rojo
const PIC: ((g: CanvasRenderingContext2D) => void)[] = [
  (g) => { g.fillStyle = "#fff"; for (const [x, y, r] of [[128, 150, 40], [95, 175, 34], [161, 175, 34], [128, 200, 36]]) { g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); } g.strokeStyle = "#6b4a2a"; g.lineWidth = 8; g.beginPath(); g.moveTo(128, 235); g.lineTo(128, 300); g.stroke(); },
  (g) => { shoe(g, true); cross(g); },
  (g) => { g.fillStyle = "#f2c14e"; g.beginPath(); g.ellipse(128, 150, 42, 52, 0, 0, 6.3); g.ellipse(128, 250, 46, 60, 0, 0, 6.3); g.fill(); g.fillRect(92, 150, 72, 100); g.strokeStyle = "#ffffff"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(128, 120); g.lineTo(92, 190); g.moveTo(128, 120); g.lineTo(164, 190); g.stroke(); cross(g); },
  (g) => { shoe(g, false); g.fillStyle = "#ffd75a"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(70 + i * 30, 120 + 10 * Math.sin(i), 8, 0, 6.3); g.fill(); } cross(g); },
  (g) => { g.fillStyle = "#cfd6df"; g.fillRect(58, 150, 140, 150); g.fillStyle = "#1d3b66"; for (let i = 0; i < 8; i++) g.fillRect(58 + i * 18, 130, 9, 34); g.strokeStyle = "#e33"; g.lineWidth = 7; g.beginPath(); g.moveTo(40, 145); g.lineTo(70, 145); g.moveTo(186, 145); g.lineTo(216, 145); g.stroke(); },
  (g) => { g.strokeStyle = "#e2b955"; g.lineWidth = 16; g.beginPath(); g.arc(128, 200, 50, 0, 6.3); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(128, 120); g.lineTo(150, 145); g.lineTo(106, 145); g.fill(); },
  (g) => { for (let i = 0; i < 3; i++) { g.fillStyle = ["#f4f1ea", "#566179", "#c8928a"][i]; g.fillRect(70 + i * 22, 120 + i * 30, 120, 150); } },
  (g) => { g.fillStyle = "#9ea3aa"; g.fillRect(80, 100, 40, 190); g.fillRect(136, 100, 40, 190); g.fillStyle = "#1d3b66"; g.fillRect(80, 280, 40, 18); g.fillRect(136, 280, 40, 18); g.fillStyle = "#7fb8ff"; g.beginPath(); g.ellipse(128, 312, 100, 14, 0, 0, 6.3); g.fill(); },
  (g) => { g.fillStyle = "#f2c9b0"; g.fillRect(98, 150, 60, 110); g.fillStyle = "#c9a24a"; g.fillRect(114, 122, 28, 30); g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(165 + i * 10, 120 - i * 8, 6 + i * 2, 0, 6.3); g.fill(); } cross(g); },
  (g) => { g.fillStyle = "#9fb4d4"; g.fillRect(60, 110, 136, 190); g.fillStyle = "#e8eef7"; g.fillRect(80, 200, 96, 76); g.strokeStyle = "#1d3b66"; g.lineWidth = 5; g.strokeRect(80, 200, 96, 76); g.fillStyle = "#f2c14e"; g.fillRect(96, 178, 26, 40); g.fillStyle = "#ffffff"; g.fillRect(130, 184, 30, 34); },
  (g) => { g.strokeStyle = "#fff"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.arc(128, 105, 22, 0, 6.3); g.stroke(); g.beginPath(); g.moveTo(128, 135); g.lineTo(120, 215); g.lineTo(90, 290); g.moveTo(120, 215); g.lineTo(160, 285); g.moveTo(125, 160); g.lineTo(85, 195); g.moveTo(125, 160); g.lineTo(170, 185); g.stroke(); g.fillStyle = "#7fb8ff"; g.fillRect(30, 300, 196, 8); },
];
function shoe(g: CanvasRenderingContext2D, heel: boolean) {
  g.fillStyle = heel ? "#f2c14e" : "#f4f1ea"; g.beginPath();
  if (heel) { g.moveTo(58, 150); g.lineTo(80, 150); g.quadraticCurveTo(120, 215, 205, 228); g.lineTo(208, 252); g.lineTo(140, 252); g.quadraticCurveTo(100, 215, 82, 212); g.lineTo(74, 290); g.lineTo(64, 290); g.lineTo(58, 210); g.closePath(); }
  else { g.moveTo(40, 170); g.lineTo(100, 170); g.quadraticCurveTo(150, 200, 205, 212); g.quadraticCurveTo(222, 230, 210, 252); g.lineTo(40, 252); g.closePath(); }
  g.fill(); g.fillStyle = "#c9c2b0"; g.fillRect(heel ? 140 : 40, 248, heel ? 68 : 172, 8);
}
function cross(g: CanvasRenderingContext2D) { g.strokeStyle = "#e3262a"; g.lineWidth = 14; g.beginPath(); g.arc(128, 205, 105, 0, 6.3); g.moveTo(54, 131); g.lineTo(202, 279); g.stroke(); }
const panelTex = (i: number) => canv("seg" + i, 256, 384, (g) => {
  g.fillStyle = "#f3f0e6"; g.fillRect(0, 0, 256, 384);
  g.fillStyle = "#1d3b66"; g.fillRect(14, 50, 228, 300);
  PIC[i](g);
  g.fillStyle = "#d42a26"; g.beginPath(); g.arc(44, 30, 24, 0, 6.3); g.fill();
  g.font = "900 30px Montserrat, Arial"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(i + 1), 44, 31);
  g.fillStyle = "#1d3b66"; g.fillRect(80, 24, 160, 12);
  g.strokeStyle = "#c9c2b0"; g.lineWidth = 2; g.strokeRect(2, 2, 252, 380);
});
const PW = 0.17, PH = 0.255;

// ═════════ RECAP: sobre la mesada de acero del galley se despliega en acordeón una tarjeta de seguridad plastificada de 11 paneles.
// En cada número que dice Linda, un sello verde cae sobre ese panel. En «walk home» la cámara se aleja y se ve todo tildado;
// al salir, la tarjeta se vuelve a plegar. ═════════
export const Recap: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, mo = f.mo ?? {};
  const N = Array.from({ length: 11 }, (_, i) => mo["n" + (i + 1)] ?? a + 2 + i * 3.5);
  const X = (i: number) => (i - 5) * (PW + 0.006);
  const K: [number, number, number, number, number][] = [[a, X(0), 0.02, 0.42, 0.42]];
  N.forEach((n, i) => { K.push([n - 0.25, X(i), 0.02, 0.4, 0.4]); K.push([n + 0.9, X(i), 0.02, 0.4, 0.4]); });
  K.push([wow + 0.05, X(10), 0.02, 0.42, 0.42], [wow + 1.0, 0, 0.04, 1.75, 1.0], [b, 0, 0.04, 1.85, 1.05]);
  const cam = camK(t, a, K, 34);
  const brushed = canv("galley", 512, 512, (g) => { g.fillStyle = "#9aa1a8"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1400; i++) { g.strokeStyle = `rgba(${rn(i, 1) > 0.5 ? "230,235,240" : "60,66,72"},${0.08 * rn(i, 2)})`; g.lineWidth = 1; const y = rn(i, 3) * 512; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + 2); g.stroke(); } }, [3, 1]);
  const fold = b - 0.7;
  return <Stage t={t} a={a} b={b} dim={0.8} tint="#e6efff">
    <Esc cam={cam} key1={[-0.8, 2.2, 1.2]} warm={1.0} cool={1.1} exposure={1.08}>
      {/* la mesada del galley con su canto y una línea de remaches */}
      <RBox s={[2.6, 0.04, 0.8]} r={0.01} p={[0, -0.02, 0.05]}><meshPhysicalMaterial map={brushed} metalness={0.85} roughness={0.32} clearcoat={0.3} /></RBox>
      {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[-1.25 + i * 0.1, 0.0005, 0.42]}><sphereGeometry args={[0.004, 10, 6]} />{M.chrome()}</mesh>)}
      {Array.from({ length: 11 }, (_, i) => {
        // despliegue en acordeón: cada pliegue se abre con resorte, en cascada; al salir se vuelve a plegar
        const op = cl(spr(t, a + 0.15 + i * 0.09, 0.7, 1.6)) * (1 - sm((t - fold - (10 - i) * 0.03) / 0.5));
        const zig = (i % 2 ? 1 : -1) * lerp(1.35, 0.07, op), x = lerp(X(0) + i * 0.012, X(i), op);
        const st = spr(t, N[i] - 0.05, 0.9, 1.5), on = t >= N[i] - 0.05;
        const glow = cl((t - wow) / 0.3) * (1 - cl((t - wow - 1.4) / 0.6));
        return <group key={i} position={[x, 0.003 + 0.04 * (1 - op), 0.02]} rotation={[0, 0, zig]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[PW, PH, 0.0025]} /><meshPhysicalMaterial map={panelTex(i)} roughness={0.25} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
            {/* el sello verde: cae, aplasta y queda */}
            {on && <group position={[0.058, -0.098, 0.004 + 0.06 * (1 - cl(st))]} scale={Math.max(0.001, 0.42 + 0.28 * st)}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.034, 0.034, 0.005, 40]} /><meshStandardMaterial color="#2e9b52" roughness={0.4} emissive="#3cff7a" emissiveIntensity={0.25 + 0.8 * glow} /></mesh>
              <mesh position={[0, 0, 0.003]}><planeGeometry args={[0.05, 0.05]} /><meshBasicMaterial map={canv("tilde", 128, 128, (g) => { g.strokeStyle = "#fff"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(26, 66); g.lineTo(54, 94); g.lineTo(104, 36); g.stroke(); })} transparent toneMapped={false} /></mesh>
            </group>}
          </group>
          <Blob w={PW * 1.3} d={PH * 1.15} o={0.35 * op} y={-0.0015} />
        </group>;
      })}
    </Esc>
  </Stage>;
};

// ── percha de madera: hombros curvos, travesaño y gancho de alambre
const Percha3: React.FC = () => <group>
  <mesh geometry={tubeG("perchaH", [[-0.19, -0.075, 0], [-0.1, -0.03, 0], [0, -0.005, 0], [0.1, -0.03, 0], [0.19, -0.075, 0]], 0.011, 60, 12)} castShadow><meshStandardMaterial map={leatherTex([150, 98, 52], "pmad")} roughness={0.45} /></mesh>
  <mesh position={[0, -0.075, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.36, 12]} /><meshStandardMaterial color="#9a6a3a" roughness={0.45} /></mesh>
  <mesh geometry={tubeG("perchaG", [[0, -0.005, 0], [0, 0.03, 0], [0.012, 0.055, 0], [0.032, 0.05, 0], [0.034, 0.03, 0]], 0.0022, 40, 8)}>{M.chrome({ col: "#c8ccd0" })}</mesh>
</group>;
// abrigo de invierno colgado: cuerpo con volumen, solapas, botones grandes
const ABR = [[-0.07, 0.012], [0.07, 0.012], [0.17, -0.02], [0.2, -0.07], [0.19, -0.4], [0.21, -0.74], [-0.21, -0.74], [-0.19, -0.4], [-0.2, -0.07], [-0.17, -0.02]];
const Abrigo: React.FC<{ k: string; col: string; tartan?: boolean }> = ({ k, col, tartan }) => <group>
  <mesh position={[0, -0.075, 0]} geometry={extr("abr" + k, ABR, 0.07, 0.03)} castShadow receiveShadow>{tartan ? <meshStandardMaterial map={tartanTex([1.5, 1.5])} roughness={0.95} /> : <meshStandardMaterial map={fabricTex("lana", [2, 2])} color={col} roughness={0.95} />}</mesh>
  {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.05, -0.16, 0.068]} rotation={[0, 0, sx * -0.35]} castShadow><boxGeometry args={[0.07, 0.2, 0.012]} /><meshStandardMaterial map={fabricTex("lana", [1, 1])} color={new THREE.Color(col).multiplyScalar(0.8)} roughness={0.95} /></mesh>)}
  {[-1, 1].map((sx) => <group key={"m" + sx} position={[sx * 0.215, -0.13, 0.01]} rotation={[0, 0, sx * 0.07]}><RBox s={[0.075, 0.5, 0.08]} r={0.03} p={[0, -0.25, 0]}><meshStandardMaterial map={tartan ? tartanTex([0.6, 1.5]) : fabricTex("lana", [1, 2])} color={tartan ? undefined : new THREE.Color(col).multiplyScalar(0.9)} roughness={0.95} /></RBox><RBox s={[0.08, 0.05, 0.085]} r={0.02} p={[0, -0.48, 0]}><meshStandardMaterial map={fabricTex("lana", [1, 1])} color={new THREE.Color(col).multiplyScalar(0.7)} roughness={0.95} /></RBox></group>)}
  {[-1, 1].map((sx) => <mesh key={"b" + sx} position={[sx * 0.11, -0.56, 0.072]} castShadow><boxGeometry args={[0.1, 0.03, 0.01]} /><meshStandardMaterial map={fabricTex("lana", [1, 1])} color={new THREE.Color(col).multiplyScalar(0.75)} roughness={0.95} /></mesh>)}
  {[-0.13, 0.13].map((x) => <mesh key={"pl" + x} position={[x, -0.6, 0.073]}><planeGeometry args={[0.006, 0.26]} /><meshStandardMaterial color="#000" transparent opacity={0.22} /></mesh>)}
  {[-0.3, -0.42, -0.54].map((y) => <mesh key={y} position={[0.06, y, 0.07]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.008, 20]} />{M.plastic({ col: "#2a2018" })}</mesh>)}
  <Percha3 />
</group>;

// ═════════ PERCHA: el riel del placard de Carol, con la luz de la bombita. La percha de los pantalones de teatro (brillosos,
// con su etiqueta «theater only») corre por el caño hasta el fondo; en «behind» los tres abrigos de invierno se deslizan delante
// y la tapan, con un golpe de perchas. Al salir, la cadenita se sacude y se apaga la luz. ═════════
export const Percha: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, mo = f.mo ?? {};
  const t0 = (mo.moved ?? a + 1) + 0.1;
  const mv = spr(t, t0, 0.45, 1.35), co = spr(t, wow - 0.1, 0.75, 1.5), off = cl((t - (b - 0.55)) / 0.12);
  const swing = (ts: number, amp: number) => (t > ts ? amp * Math.exp(-(t - ts) * 2.2) * Math.sin((t - ts) * 9) : 0);
  const px = lerp(0.05, -0.62, cl(mv)), pz = swing(t0, 0.22) + swing(wow + 0.1, 0.14);
  const cam = camK(t, a, [[a, 0.02, 0.4, 0.5, 1.75], [t0 + 1.1, -0.3, 0.42, 0.48, 1.6], [wow + 0.6, -0.36, 0.42, 0.5, 1.62], [b, -0.4, 0.4, 0.52, 1.55]], 34);
  const glint = cl(1 - Math.abs(t - t0 - 0.6) / 0.7);
  const tc = t - (b - 0.85), chain = tc > 0 ? 0.14 * Math.sin(tc * 11) * Math.exp(-tc * 1.4) : 0, pull = tc > 0 ? 0.03 * cl(tc / 0.2) * (1 - off) : 0;
  const madera = canv("placard2", 512, 512, (g) => { g.fillStyle = "#c9a77c"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(${130 + 50 * rn(i, 7)},${85 + 35 * rn(i, 8)},${45 + 25 * rn(i, 9)},.4)`; g.fillRect(i * 64, 0, 64, 512); g.fillStyle = "rgba(70,45,20,.5)"; g.fillRect(i * 64, 0, 2, 512); for (let k = 0; k < 2; k++) { g.fillStyle = "rgba(80,50,22,.35)"; g.beginPath(); g.ellipse(i * 64 + 14 + 36 * rn(i, 10 + k), 60 + 400 * rn(i, 12 + k), 4, 9, 0, 0, 6.3); g.fill(); } } for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(110,70,35,${0.08 + 0.1 * rn(i, 1)})`; g.lineWidth = 1 + 2 * rn(i, 2); const x = rn(i, 3) * 512; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 8, 170, x - 6, 340, x + 4, 512); g.stroke(); } }, [2, 1]);
  const somb = canv("sombPared", 128, 256, (g) => { const gr = g.createRadialGradient(64, 128, 8, 64, 128, 124); gr.addColorStop(0, "rgba(40,24,10,.6)"); gr.addColorStop(1, "rgba(40,24,10,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 256); });
  const brillo = canv("glowBomb", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 4, 128, 128, 128); gr.addColorStop(0, "rgba(255,214,140,.9)"); gr.addColorStop(1, "rgba(255,214,140,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const Sp: React.FC<{ x: number; w: number; h: number }> = ({ x, w, h }) => <mesh position={[x + 0.04, 0.86 - 0.1 - h / 2, -0.214]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={somb} transparent opacity={0.5 * (1 - 0.6 * off)} depthWrite={false} /></mesh>;
  const SUET: [number, string][] = [[-0.7, "#b8c4d4"], [-0.42, "#e2d6c0"], [-0.15, "#a65e52"]];
  const ABRS: [string, string, boolean][] = [["camel", "#b8875a", false], ["plaid", "#7a4a3a", true], ["gris", "#5d6168", false]];
  return <Stage t={t} a={a} b={b} dim={0.75} tint="#ffd9a0">
    <Esc cam={cam} key1={[0.4, 2.0, 1.6]} warm={lerp(1.0, 0.22, off)} cool={lerp(0.7, 0.35, off)} exposure={lerp(1.05, 0.32, off)}>
      <group position={[0, -0.43, 0]}>
      {/* el interior del placard: fondo y lateral de madera, estante con suéteres doblados */}
      <mesh position={[-0.2, 0.25, -0.22]} receiveShadow><planeGeometry args={[2.4, 1.9]} /><meshStandardMaterial map={madera} roughness={0.75} /></mesh>
      <mesh position={[-1.1, 0.25, 0.1]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[0.7, 1.9]} /><meshStandardMaterial map={madera} roughness={0.75} color="#d8c0a0" /></mesh>
      <RBox s={[2.0, 0.025, 0.45]} r={0.006} p={[-0.2, 0.98, 0.0]}><meshStandardMaterial map={madera} roughness={0.7} /></RBox>
      {SUET.map(([x, c], i) => [0, 1].map((k) => <RBox key={i + "" + k} s={[0.24, 0.05, 0.2]} r={0.02} p={[x, 1.02 + k * 0.052, 0.02]}><meshStandardMaterial map={fabricTex("lana", [1, 1])} color={c} roughness={0.95} /></RBox>))}
      <RBox s={[2.4, 0.03, 0.6]} r={0.006} p={[-0.2, -0.3, 0.05]}><meshStandardMaterial map={madera} roughness={0.7} color="#a88a66" /></RBox>
      <mesh position={[0.25, 0.8, -0.212]}><planeGeometry args={[1.5, 1.5]} /><meshBasicMaterial map={brillo} transparent opacity={0.5 * (1 - off)} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      <Sp x={px} w={0.5} h={0.75} />
      {/* el caño cromado */}
      <mesh position={[-0.2, 0.86, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 1.95, 20]} />{M.chrome({ col: "#d0d4d8" })}</mesh>
      {/* los pantalones de teatro: brillosos, con lentejuelas; etiqueta a mano */}
      <group position={[px, 0.86 - 0.035, 0]} rotation={[pz * 0.3, 0, pz]}>
        <group position={[0, -0.06, 0]}>
          <Percha3 />
          {[-1, 1].map((sx) => <group key={sx} scale={[sx, 1, 1]}><mesh position={[0, -0.09, 0]} geometry={extr("palazzoL", [[0.004, 0], [0.17, 0], [0.19, -0.2], [0.225, -0.6], [0.018, -0.6], [0.01, -0.18]], 0.022, 0.012)} castShadow><meshPhysicalMaterial color="#0e0a12" roughness={0.28} metalness={0.45} clearcoat={1} clearcoatRoughness={0.08} sheen={0.4} sheenColor="#7a5aa8" side={THREE.DoubleSide} /></mesh>
            <mesh position={[0.11, -0.4, 0.036]}><planeGeometry args={[0.004, 0.55]} /><meshStandardMaterial color="#2a2232" roughness={0.6} /></mesh></group>)}
          <RBox s={[0.35, 0.035, 0.036]} r={0.01} p={[0, -0.09, 0.0]}><meshPhysicalMaterial color="#16101c" roughness={0.35} clearcoat={0.6} /></RBox>
          {Array.from({ length: 170 }, (_, i) => { const y = 0.13 + 0.55 * rn(i, 2), x = (rn(i, 1) < 0.5 ? -1 : 1) * (0.03 + (0.13 + 0.05 * y) * rn(i, 3)); return <mesh key={i} position={[x, -y, 0.035]}><circleGeometry args={[0.0055, 8]} /><meshStandardMaterial color="#b9a8d8" metalness={1} roughness={0.15} emissive="#f0e6ff" emissiveIntensity={(0.04 + 1.6 * Math.pow(Math.max(0, Math.sin(t * 6 + i * 2.3)), 6) + 1.4 * glint * rn(i, 5)) * (1 - 0.7 * off)} /></mesh>; })}
          <group position={[0.06, 0.0, 0.05]} rotation={[0, 0, -0.18 + 0.4 * pz]} scale={1.9}>
            <mesh position={[0.0, -0.03, 0]}><cylinderGeometry args={[0.0008, 0.0008, 0.06, 6]} /><meshStandardMaterial color="#d8cfc0" /></mesh>
            <mesh position={[0.0, -0.09, 0.002]} castShadow><boxGeometry args={[0.12, 0.06, 0.0015]} /><meshStandardMaterial map={canv("tagTeatro", 400, 200, (g) => { g.fillStyle = "#efe2c4"; g.fillRect(0, 0, 400, 200); g.fillStyle = "#fff"; g.beginPath(); g.arc(200, 26, 11, 0, 6.3); g.fill(); g.font = `700 62px "${HAND}"`; g.fillStyle = "#6a2340"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("theater only", 200, 118); })} roughness={0.9} /></mesh>
          </group>
        </group>
      </group>
      {/* los abrigos de invierno: corren por el caño y se apilan delante, con un golpe */}
      {ABRS.map(([k, c, tt], i) => {
        const ci = spr(t, wow - 0.1 + i * 0.1, 0.75, 1.5), x = lerp(1.55 + i * 0.32, -0.5 + i * 0.15, cl(ci)), sw = swing(wow + 0.1 + i * 0.1, 0.24) - 0.5 * Math.max(0, ci * (1 - ci));
        return <React.Fragment key={k}><Sp x={x} w={0.62} h={0.95} /><group position={[x, 0.86 - 0.035, 0.05 + i * 0.045]} rotation={[sw * 0.3, (i - 1) * 0.14, sw]}><group position={[0, -0.06, 0]}><Abrigo k={k} col={c} tartan={tt} /></group></group></React.Fragment>;
      })}
      {/* la bombita con su cadenita: se apaga al salir */}
      <group position={[0.3, 1.15, 0.28]}>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 20]} />{M.porcelain({ col: "#efe9dc" })}</mesh>
        <mesh><sphereGeometry args={[0.035, 24, 16]} /><meshStandardMaterial color="#fff6d8" emissive="#ffd78a" emissiveIntensity={2.2 * (1 - off)} roughness={0.2} /></mesh>
        <group rotation={[0, 0, chain]}>{Array.from({ length: 34 }, (_, i) => <mesh key={i} position={[0.02, -0.03 - i * 0.018 - pull, 0]}><sphereGeometry args={[0.0035, 8, 6]} />{M.brass({ col: "#c9a24a" })}</mesh>)}<mesh position={[0.02, -0.66 - pull, 0]} castShadow><cylinderGeometry args={[0.008, 0.012, 0.035, 16]} />{M.brass({ col: "#c9a24a" })}</mesh></group>
        <pointLight intensity={1.4 * (1 - off)} distance={2.2} color="#ffd9a0" />
      </group>
      </group>
    </Esc>
  </Stage>;
};
