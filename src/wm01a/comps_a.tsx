// wm01a · componentes 1-5: cuello (se para solo) · ballenas (la punta que se enrosca como papa frita) · pliegue (el pellizco
// del padre que baja y el filo que brilla) · tirantes (el reloj se va, caen los tiradores) · pisacorbata (la corbata vuela y clic).
// Todo es f(t). Objetos físicos 3D, sin rótulos: la forma es la idea.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { Blob, Cuarto, Esc, M, RBox, Ready, Sombra, camA, canv, cl, edgeAlpha, extr, geo, lerp, rn, spr, tubeG, useImg, win, type V3 } from "./k3d";
import type { Fi } from "./perchero";

// ---------- materiales ----------
// algodón blanco almidonado: tejido fino + brillo de sheen
const popelin = (rep: [number, number] = [2, 2]) => canv("popelin", 256, 256, (g) => {
  g.fillStyle = "#f4f1ea"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) { g.fillStyle = `rgba(150,145,135,${0.08 + 0.05 * rn(y, 1)})`; g.fillRect(0, y, 256, 1); }
  for (let x = 0; x < 256; x += 3) { g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x, 0, 1, 256); }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(120,110,95,${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 1); }
}, rep);
const Algodon: React.FC<{ rep?: [number, number]; side?: THREE.Side; alpha?: THREE.Texture }> = ({ rep, side = THREE.DoubleSide, alpha }) =>
  <meshPhysicalMaterial map={popelin(rep)} color="#ffffff" roughness={0.62} sheen={0.8} sheenColor="#ffffff" sheenRoughness={0.4} side={side} alphaMap={alpha} alphaTest={alpha ? 0.5 : 0} />;
// franela gris: lana cardada con espiguilla tenue
const franela = (rep: [number, number] = [2, 3]) => canv("franela", 256, 256, (g) => {
  g.fillStyle = "#7d7f84"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 6000; i++) { const v = rn(i, 1) > 0.5; g.fillStyle = v ? `rgba(220,222,228,${0.12 * rn(i, 2)})` : `rgba(30,32,38,${0.16 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 1 + 2 * rn(i, 5), 1); }
  for (let c = 0; c < 16; c++) for (let y = 0; y < 256; y += 8) { g.strokeStyle = "rgba(255,255,255,.05)"; g.lineWidth = 2; g.beginPath(); const x = c * 16; g.moveTo(x, y); g.lineTo(x + 8, y + (c % 2 ? 8 : -8)); g.stroke(); }
}, rep);
// lana azul marino de la corbata (sarga diagonal)
const sarga = (rep: [number, number] = [1, 6]) => canv("sarga", 128, 256, (g) => {
  g.fillStyle = "#1b2340"; g.fillRect(0, 0, 128, 256);
  for (let i = -256; i < 256; i += 4) { g.strokeStyle = "rgba(90,110,160,.22)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); }
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "140,160,210" : "0,0,10"},${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 128, rn(i, 4) * 256, 1, 2); }
}, rep);
// tablero de la mesa de planchar: funda de cutí (crema con rayitas azules), finita y fundida en el borde
const cuti = () => canv("cuti", 256, 256, (g) => {
  g.fillStyle = "#e9e0cb"; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(60,80,130,.55)"; g.fillRect(x + 4, 0, 3, 256); g.fillStyle = "rgba(60,80,130,.3)"; g.fillRect(x + 11, 0, 1, 256); }
  for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(110,90,60,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 256, rn(i, 4) * 256, 2, 1); }
}, [3, 1.5]);
const madera = () => canv("madera_c", 512, 512, (g) => {
  g.fillStyle = "#5c3a20"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 110; i++) { g.strokeStyle = `rgba(${rn(i, 1) > 0.6 ? "150,100,58" : "30,15,5"},${0.1 + 0.16 * rn(i, 2)})`; g.lineWidth = 1 + 2.5 * rn(i, 3); g.beginPath(); const y = rn(i, 4) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 14 * rn(i, 5) - 7, 340, y - 10 * rn(i, 6) + 5, 512, y + 8 * rn(i, 7) - 4); g.stroke(); }
}, [1.5, 1.5]);
const Tablero: React.FC<{ w?: number; d?: number; kind?: "cuti" | "madera" }> = ({ w = 1.4, d = 0.9, kind = "madera" }) =>
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} />
    {kind === "cuti" ? <meshStandardMaterial map={cuti()} roughness={0.95} alphaMap={edgeAlpha()} transparent /> : <meshPhysicalMaterial map={madera()} roughness={0.4} clearcoat={0.6} clearcoatRoughness={0.3} alphaMap={edgeAlpha()} transparent />}
  </mesh>;
// vapor: bocanadas blandas que suben y se abren
const Vapor: React.FC<{ t: number; a: number; p: V3; n?: number; o?: number }> = ({ t, a, p, n = 7, o = 0.4 }) => <>
  {Array.from({ length: n }, (_, i) => {
    const d = t - a - i * 0.18; if (d < 0 || d > 2.4) return null; const k = d / 2.4;
    return <mesh key={i} position={[p[0] + 0.03 * Math.sin(i * 2.1 + d * 1.5), p[1] + 0.22 * k, p[2] + 0.02 * Math.cos(i)]} scale={0.012 + 0.035 * k}>
      <sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.5 * o * (1 - k) * cl(d * 4)} roughness={1} depthWrite={false} /></mesh>;
  })}
</>;

export const estrella = () => canv("estrella", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.2, "rgba(255,245,220,.6)"); gr.addColorStop(1, "rgba(255,240,210,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(0, 62, 128, 4); g.fillRect(62, 0, 4, 128); });

// ================= 1 · CUELLO: la plancha pasa, se va, y la tira almidonada se enrosca y se para sola =================
// la tira del cuello: plano L×H; q=0 tira plana, q=1 anillo (radio R0) con la abertura adelante. La máscara recorta la banda
// arriba y las dos puntas que bajan en los extremos.
const R0 = 0.07, LC = 2 * Math.PI * R0 * 0.93, HC = 0.06;
const tiraAlpha = () => canv("tiraA", 512, 128, (g) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#fff";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(512, 0); g.lineTo(512, 128); g.lineTo(470, 52); g.lineTo(42, 52); g.lineTo(0, 128); g.closePath(); g.fill();
}, [1, 1], false);
const tiraMap = () => canv("tiraM", 512, 128, (g) => {
  g.drawImage(popelin().image as HTMLCanvasElement, 0, 0, 512, 128);
  g.strokeStyle = "rgba(120,115,105,.75)"; g.setLineDash([6, 5]); g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(4, 6); g.lineTo(508, 6); g.moveTo(10, 46); g.lineTo(502, 46); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#e9e4d8"; g.beginPath(); g.arc(30, 26, 7, 0, 6.3); g.fill(); g.strokeStyle = "rgba(0,0,0,.25)"; g.stroke();
}, [1, 1]);
const tiraG = (q: number) => geo(`tira|${Math.round(q * 60) / 60}`, () => {
  const g = new THREE.PlaneGeometry(LC, HC, 64, 6), p = g.attributes.position as THREE.BufferAttribute, k = Math.max(1e-4, q) / R0;
  for (let i = 0; i < p.count; i++) {
    const s = p.getX(i), y = p.getY(i), a = s * k;
    p.setXYZ(i, Math.sin(a) / k, y, -(1 - Math.cos(a)) / k);
  }
  g.translate(0, 0, R0 * cl(q)); g.computeVertexNormals(); return g;
});
// la plancha pesada: suela en punta, cuerpo, manija de madera
const Plancha: React.FC = () => <group>
  <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("suela", [[-0.06, -0.045], [0.07, -0.045], [0.12, 0], [0.07, 0.045], [-0.06, 0.045]], 0.012, 0.003)} position={[0, 0.006, 0]} castShadow>{M.steel({ col: "#c7ccd1" })}</mesh>
  <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={extr("cuerpo", [[-0.055, -0.04], [0.06, -0.04], [0.105, 0], [0.06, 0.04], [-0.055, 0.04]], 0.03, 0.008)} position={[0, 0.03, 0]} castShadow><meshStandardMaterial color="#2b2e33" metalness={0.6} roughness={0.35} /></mesh>
  <mesh castShadow geometry={tubeG("manija_pl", [[-0.05, 0.045, 0], [-0.04, 0.09, 0], [0.04, 0.095, 0], [0.07, 0.05, 0]], 0.009, 40, 12)}><meshStandardMaterial color="#3a2414" roughness={0.45} /></mesh>
</group>;
// media rebanada de pan (miga)
const Rebanada: React.FC<{ half: number }> = ({ half }) =>
  <mesh castShadow geometry={extr("pan" + half, half < 0 ? [[-0.05, -0.045], [0, -0.045], [0, 0.05], [-0.03, 0.055], [-0.052, 0.03]] : [[0, -0.045], [0.05, -0.045], [0.052, 0.03], [0.03, 0.055], [0, 0.05]], 0.012, 0.002)}>
    <meshStandardMaterial color="#efdcae" roughness={0.95} /></mesh>;
const Corteza: React.FC<{ half: number }> = ({ half }) =>
  <mesh position={[0, 0, -0.0005]} scale={[1.08, 1.08, 1.1]} geometry={extr("pan" + half, half < 0 ? [[-0.05, -0.045], [0, -0.045], [0, 0.05], [-0.03, 0.055], [-0.052, 0.03]] : [[0, -0.045], [0.05, -0.045], [0.052, 0.03], [0.03, 0.055], [0, 0.05]], 0.012, 0.002)}>
    <meshStandardMaterial color="#8a5428" roughness={0.8} /></mesh>;
export const CuelloFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tDone = at("done", a - 1), tPan = at("cut bread", a);
  const pasa = win(t, a, tDone - 0.2);                         // la plancha recorre la tira
  const lift = spr(t, tDone - 0.2, 0.8, 1.4);                  // y se va
  const up = cl(spr(t, wow - 0.1, 0.5, 2.0));                  // la tira se para y se cierra
  const pl: V3 = [lerp(-0.12, 0.1, pasa) + 0.45 * cl(lift), 0.002 + 0.14 * Math.sin(Math.PI * cl(lift * 0.8)), 0.06 + 0.1 * cl(lift)];
  const cae = win(t, tPan - 0.5, tPan), parte = win(t, tPan, tPan + 0.5);
  const cam = camA(t, a, b, { p: [0.05, 0.3, 0.36], l: [0, 0.01, 0.03], fov: 32 }, { p: [0.16, 0.14, 0.3], l: [0, 0.035, 0], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe6c4">
    <Esc cam={cam} key1={[-0.9, 1.4, 0.8]} warm={1.0} exposure={1.0}>
      <Cuarto z={-0.9} y={0.3} col="#6c5844" />
      <Tablero kind="cuti" w={1.6} d={1.0} />
      {/* tumbada: la tira acostada (su alto mira a la cámara); parada: anillo de pie */}
      <group position={[0, 0.003 + (HC / 2) * up, 0.03 * (1 - up)]} rotation={[-(Math.PI / 2) * (1 - up), 0, 0]}>
        <mesh geometry={tiraG(up)} castShadow receiveShadow><meshPhysicalMaterial map={tiraMap()} alphaMap={tiraAlpha()} alphaTest={0.5} roughness={0.55} sheen={0.8} sheenColor="#fff" side={THREE.DoubleSide} /></mesh>
      </group>
      <Blob w={0.26} d={0.22} o={0.2 + 0.25 * up} />
      <group position={pl} rotation={[0, -0.2 + 0.5 * cl(lift), 0]}><Plancha /></group>
      <Vapor t={t} a={a + 0.3} p={[0, 0.02, 0.05]} o={0.3} />
    </Esc>
  </Stage>;
};

// ================= 2 · BALLENAS: entran las dos varillas; se pierde una y la punta se enrosca =================
// punta del cuello vista de arriba: plano segmentado con máscara de punta; curl la enrolla de verdad (papa frita)
const puntaAlpha = () => canv("puntaA", 128, 256, (g) => {
  g.fillStyle = "#000"; g.fillRect(0, 0, 128, 256); g.fillStyle = "#fff";
  g.beginPath(); g.moveTo(6, 0); g.lineTo(122, 0); g.lineTo(122, 120); g.lineTo(64, 252); g.lineTo(6, 120); g.closePath(); g.fill();
}, [1, 1], false);
const puntaMap = () => canv("puntaM", 128, 256, (g) => {
  g.drawImage(popelin().image as HTMLCanvasElement, 0, 0, 128, 256);
  g.strokeStyle = "rgba(120,115,105,.7)"; g.setLineDash([5, 4]); g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(14, 4); g.lineTo(14, 118); g.lineTo(64, 236); g.lineTo(114, 118); g.lineTo(114, 4); g.stroke();
  g.setLineDash([]); g.fillStyle = "rgba(90,85,75,.45)"; g.fillRect(52, 60, 24, 3);
}, [1, 1]);
const PL = 0.13;
const puntaG = (curl: number) => {
  const q = Math.round(curl * 40) / 40;
  return geo(`punta2|${q}`, () => {
    const g = new THREE.PlaneGeometry(0.07, PL, 12, 30), p = g.attributes.position as THREE.BufferAttribute, k = Math.max(1e-4, q * 19);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), s = PL / 2 - p.getY(i);             // s: distancia desde la banda
      const a = s * k, y = PL / 2 - Math.sin(a) / k, z = (1 - Math.cos(a)) / k;
      p.setXYZ(i, x * (1 - 0.15 * q * s / PL) + q * 0.012 * Math.sin(s * 70), y, z + q * 0.01 * Math.sin(x * 70 + s * 40));
    }
    g.computeVertexNormals(); return g;
  });
};
const Ballena: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => <group position={p} rotation={[0, 0, ry]} scale={1.5}>
  <mesh castShadow geometry={extr("ballena", [[-0.0035, 0.032], [0.0035, 0.032], [0.0035, -0.026], [0, -0.034], [-0.0035, -0.026]], 0.0009, 0.0003)}>{M.chrome({ col: "#e9edf2" })}</mesh>
</group>;
export const BallenasFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const tDos = at("two little stays", a), tLose = at("Lose one", a), tCurl = at("curled", a);
  const in1 = spr(t, tDos - 0.05, 0.9, 1.6), in2 = spr(t, tDos + 0.5, 0.9, 1.6);
  const out = win(t, tLose, tLose + 0.5), fallK = win(t, tLose + 0.45, tLose + 1.2);
  const curl = cl(win(t, tCurl - 0.1, wow + 0.1) * 0.7 + 0.3 * cl(spr(t, wow, 1.0, 2.4)));
  const cam = camA(t, a, b, { p: [0.0, 0.5, 0.26], l: [0, 0, 0.0], fov: 34 }, { p: [0.34, 0.1, 0.12], l: [0.04, 0.02, 0.0], fov: 34 });
  const am = puntaAlpha(), mp = puntaMap();
  return <Stage t={t} a={a} b={b} dim={0.65} tint="#ffe6c4">
    <Esc cam={cam} key1={[-0.6, 1.2, 0.5]} warm={1.0}>
      <Cuarto z={-0.9} y={0.2} col="#6c5844" />
      <Tablero w={1.6} d={1.1} />
      <group position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* la banda del cuello, de revés, y las dos puntas */}
        <mesh position={[0, 0.085, 0]} receiveShadow castShadow><planeGeometry args={[0.42, 0.04]} /><Algodon rep={[6, 0.5]} /></mesh>
        {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.075, 0.0, 0.0005]} rotation={[0, 0, sx * 0.16]} geometry={puntaG(sx > 0 ? curl : 0)} castShadow receiveShadow>
          <meshPhysicalMaterial map={mp} alphaMap={am} alphaTest={0.5} roughness={0.6} sheen={0.8} sheenColor="#fff" side={THREE.DoubleSide} /></mesh>)}
        {/* varillas: entran por el bolsillito; la derecha se escapa y cae de la mesa */}
        <group position={[-0.075, 0.0, 0.004]} rotation={[0, 0, -0.16]}><Ballena p={[0, lerp(0.2, 0.012, cl(in1)), 0]} /></group>
        {fallK < 1 && <group position={[0.075, 0.0, 0.004]} rotation={[0, 0, 0.16]}>
          <Ballena p={[lerp(0, 0.25, fallK), lerp(0.2, 0.012, cl(in2)) + out * 0.15, fallK * 0.06 - fallK * fallK * 0.4]} ry={fallK * 2.4} /></group>}
      </group>
      <Blob w={0.55} d={0.35} o={0.3} y={0.002} />
    </Esc>
  </Stage>;
};

// ================= 3 · PLIEGUE: el pellizco del padre baja por la raya y el filo brilla entero =================
const piernaG = () => geo("pierna", () => {
  // corte del pantalón: lágrima con el filo adelante (+z); extruida a lo largo de y
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2, r = 0.075 + 0.012 * Math.cos(a); pts.push(new THREE.Vector2(Math.sin(a) * r * (a < Math.PI ? 1 : 1), -Math.cos(a) * r * 0.75)); }
  pts[0] = new THREE.Vector2(0, 0.088); pts[40] = pts[0];
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.slice(1)), { depth: 0.85, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(Math.PI / 2); g.translate(0, 0.85, 0); g.computeVertexNormals(); return g;
});
export const PliegueFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tRun = at("run it down", a), tBot = at("bottom", a, true), tNada = at("said nothing", a);
  const k = win(t, tRun - 0.1, tBot);           // el pellizco baja de arriba abajo
  const yP = lerp(0.82, 0.06, k), filo = win(t, wow - 0.05, wow + 0.35) * (1 - 0.45 * win(t, tNada, tNada + 0.8));
  const cam = camA(t, a, b, { p: [0.42, 0.72, 0.85], l: [0, 0.55, 0.05], fov: 32 }, { p: [0.3, 0.38, 0.72], l: [0, 0.36, 0.06], fov: 32 });
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe2bd">
    <Esc cam={cam} key1={[-1.2, 2.0, 1.4]} warm={1.0} exposure={1.02}>
      <group position={[0, 0.05, 0]}>
        <mesh geometry={piernaG()} castShadow receiveShadow><meshPhysicalMaterial map={franela([2, 6])} roughness={0.86} sheen={0.6} sheenColor="#d0d4dc" /></mesh>
        {/* botamanga */}
        <mesh position={[0, 0.035, 0]} scale={[1.04, 1, 1.05]}><cylinderGeometry args={[0.079, 0.079, 0.07, 48, 1, true]} /><meshPhysicalMaterial map={franela([3, 1])} roughness={0.86} side={THREE.DoubleSide} /></mesh>
        {/* el filo: una línea que se enciende detrás del pellizco y, en «sharp», corre entera como una hoja */}
        <mesh position={[0, lerp(0.85, yP, 0.5), 0.0885]} scale={[1, Math.max(0.001, 0.85 - yP), 1]}><planeGeometry args={[0.0022, 1]} />{M.glow({ col: "#fff1d6", op: 0.55 })}</mesh>
        {filo > 0.01 && <mesh position={[0, 0.45, 0.089]}><planeGeometry args={[0.004, 0.8]} />{M.glow({ col: "#ffffff", op: 0.9 * filo })}</mesh>}
        {/* el pellizco: dos yemas de luz cálida que bajan apretando la tela */}
        {k > 0 && k < 1 && [-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.012, yP, 0.083]}><sphereGeometry args={[0.009, 16, 12]} /><meshStandardMaterial color="#e8b48c" roughness={0.6} /></mesh>)}
        {k > 0 && k < 1 && <pointLight position={[0.05, yP, 0.2]} intensity={0.6} distance={0.5} color="#ffd9a8" />}
        {/* destello del filo, abajo, en «sharp» */}
      </group>
      <Sombra w={1.2} d={1.2} o={0.3} />
    </Esc>
  </Stage>;
};

// ================= 4 · TIRANTES: «not the clock» — el reloj de la cocina se va; «the braces» — caen los tiradores =================
const esfera = () => canv("esfera", 512, 512, (g) => {
  g.fillStyle = "#f1e8d4"; g.beginPath(); g.arc(256, 256, 256, 0, 6.3); g.fill();
  g.fillStyle = "#1e1a16"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "700 64px Georgia, serif";
  for (let h = 1; h <= 12; h++) { const a = (h / 12) * Math.PI * 2; g.fillText(String(h), 256 + Math.sin(a) * 190, 256 - Math.cos(a) * 190); }
  for (let m = 0; m < 60; m++) { const a = (m / 60) * Math.PI * 2, r0 = m % 5 ? 232 : 222; g.strokeStyle = "#2a241e"; g.lineWidth = m % 5 ? 2 : 5; g.beginPath(); g.moveTo(256 + Math.sin(a) * r0, 256 - Math.cos(a) * r0); g.lineTo(256 + Math.sin(a) * 244, 256 - Math.cos(a) * 244); g.stroke(); }
}, [1, 1]);
const Aguja: React.FC<{ ang: number; L: number; w: number; z: number; col?: string }> = ({ ang, L, w, z, col = "#15120f" }) =>
  <group rotation={[0, 0, -ang]} position={[0, 0, z]}><mesh position={[0, L / 2 - 0.01, 0]}><boxGeometry args={[w, L, 0.002]} /><meshStandardMaterial color={col} roughness={0.5} metalness={0.3} /></mesh></group>;
export const TirantesFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, tNot = at("Not the clock", a);
  const [tex, done] = useImg("wm01a/prendas/p04_tirantes.png");
  const im = tex?.image as HTMLImageElement | undefined, th = im ? (0.36 * im.height) / im.width : 0.5;
  const go = win(t, tNot + 0.15, tNot + 0.9), cae = spr(t, wow - 0.1, 0.95, 1.7), d = t - wow;
  const sw = d > 0 ? 0.16 * Math.exp(-d * 1.4) * Math.sin(d * 6.5) : 0;
  const cam = camA(t, a, b, { p: [0.05, 0.02, 1.05], l: [0, 0.0, 0], fov: 32 }, { p: [-0.1, 0.0, 0.95], l: [0, -0.02, 0], fov: 32 });
  const sec = Math.floor((t - a) * 1) / 60;
  return <Stage t={t} a={a} b={b} dim={0.65} tint="#ffd9a8">
    <Esc cam={cam} key1={[-1.0, 1.4, 1.6]} warm={1.0}>
      {tex && <Ready dep={tex} done={done} />}
      <mesh position={[0, 0, -0.06]} receiveShadow><planeGeometry args={[1.8, 1.2]} /><meshStandardMaterial color="#c9b896" roughness={0.95} alphaMap={edgeAlpha()} transparent /></mesh>
      {/* el reloj de la cocina: caja crema, bisel cromado; marca las cinco y media (fin del turno) */}
      <group position={[lerp(0, -0.55, go), 0.02, lerp(0, -0.25, go)]} rotation={[0, go * 0.7, -go * 0.25]} scale={1 - 0.25 * go}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.05, 64]} /><meshPhysicalMaterial color="#efe6d2" roughness={0.3} clearcoat={0.8} /></mesh>
        <mesh position={[0, 0, 0.0255]}><circleGeometry args={[0.145, 64]} /><meshStandardMaterial map={esfera()} roughness={0.6} /></mesh>
        <mesh position={[0, 0, 0.027]}><torusGeometry args={[0.152, 0.009, 16, 64]} />{M.chrome()}</mesh>
        <Aguja ang={(5.5 / 12) * Math.PI * 2} L={0.075} w={0.009} z={0.029} />
        <Aguja ang={(30 / 60) * Math.PI * 2} L={0.11} w={0.006} z={0.031} />
        <Aguja ang={sec * Math.PI * 2 * 1} L={0.12} w={0.002} z={0.033} col="#a3281f" />
        <mesh position={[0, 0, 0.034]}><cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />{M.brass()}</mesh>
        <mesh position={[0, 0, 0.04]}><circleGeometry args={[0.15, 64]} /><meshPhysicalMaterial color="#fff" transparent opacity={0.07} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>
      </group>
      {/* los tiradores caen de la clavija y se mecen */}
      {t > wow - 0.15 && tex && <group position={[0.06, 0.38 + (1 - cae) * 0.7, 0.02]} rotation={[0, 0, sw]}>
        <mesh position={[0, -th / 2, 0]} castShadow><planeGeometry args={[0.36, th]} /><meshStandardMaterial map={tex} alphaTest={0.4} roughness={0.8} side={THREE.DoubleSide} /></mesh>
      </group>}
      <mesh position={[0.06, 0.4, 0.0]} rotation={[Math.PI / 2 - 0.3, 0, 0]} castShadow><cylinderGeometry args={[0.012, 0.014, 0.08, 16]} />{M.wood()}</mesh>
    </Esc>
  </Stage>;
};

// ================= 5 · PISACORBATA: la corbata vuela con el viento de Flatbush; en «Click» el clip la muerde =================
const BTN = [0.25, 0.14, 0.03, -0.08, -0.19];   // botones 1..5 (y)
const corbataG = (q: number, pin: number, tq: number) => geo(`corb|${q}|${pin}|${tq}`, () => {
  const g = new THREE.PlaneGeometry(1, 1, 1, 48), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const sx = p.getX(i) * 2, v = 0.5 - p.getY(i);    // v 0 arriba → 1 abajo
    const y = 0.3 - v * 0.62, w = lerp(0.032, 0.07, v) * (v > 0.93 ? (1 - v) / 0.07 : 1);
    const free = pin > 0 ? cl((v - 0.4) / 0.6) * (1 - pin * 0.85) : 1;   // con el clip, sólo se mueve la punta y poco
    const fl = q * free * Math.pow(v, 1.4);
    const x = sx * w / 2 + fl * 0.09 * Math.sin(tq * 9 + v * 6), z = 0.012 + fl * (0.12 * v + 0.02 * Math.sin(tq * 13 + v * 9));
    p.setXYZ(i, x, y + fl * 0.03 * v, z);
  }
  g.computeVertexNormals(); return g;
});
export const PisacorbataFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const t3 = at("third and fourth", a), tFly = at("fly into", a), tWind = at("wind", a);
  const viento = Math.max(0.35 * win(t, t3 - 0.4, t3 + 0.4), win(t, tFly - 0.3, tFly + 0.3) * 0.8, win(t, tWind - 0.3, tWind + 0.2));
  const pin = spr(t, wow - 0.02, 1.6, 1.4), q = Math.round(viento * (1 - cl(pin)) * 20) / 20, tq = Math.round((t - a) * 15) / 15;
  const clip = spr(t, wow - 0.35, 1.25, 1.5);
  const g34 = win(t, t3, t3 + 0.3) * (1 - win(t, tFly + 1.2, tFly + 1.8));
  const cam = camA(t, a, b, { p: [0.2, 0.14, 0.78], l: [0, 0.06, 0], fov: 32 }, { p: [0.1, -0.02, 0.36], l: [0, -0.03, 0.02], fov: 30 });
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#ffe2bd">
    <Esc cam={cam} key1={[-1.0, 1.4, 1.4]} warm={1.0}>
      {/* el pecho: pechera curva (cilindro abierto), tapeta, y las solapas del saco gris que la enmarcan */}
      <mesh position={[0, 0.02, -0.3]} receiveShadow><cylinderGeometry args={[0.3, 0.3, 0.8, 48, 8, true, -0.8, 1.6]} /><Algodon rep={[3, 4]} /></mesh>
      <mesh position={[0, 0.02, 0.002]} receiveShadow><planeGeometry args={[0.036, 0.8]} /><Algodon rep={[0.4, 4]} /></mesh>
      {[0.012, -0.012].map((x) => <mesh key={x} position={[x * 1.5, 0.02, 0.0025]}><planeGeometry args={[0.0012, 0.8]} /><meshBasicMaterial color="#cfc9bd" /></mesh>)}
      {[1, -1].map((sx) => <group key={sx} position={[sx * 0.17, 0, -0.045]} rotation={[0, sx * 0.62, 0]}>
        <mesh castShadow receiveShadow geometry={extr("solapa" + sx, [[sx * -0.035, 0.36], [sx * 0.12, 0.36], [sx * 0.12, -0.4], [sx * 0.0, -0.4], [sx * -0.02, -0.1], [sx * -0.05, 0.2], [sx * -0.02, 0.24]], 0.012, 0.004)}>
          <meshPhysicalMaterial map={franela([2, 4])} color="#8a8c92" roughness={0.88} sheen={0.5} sheenColor="#c8ccd4" /></mesh></group>)}
      {BTN.map((y, i) => <group key={i} position={[0, y, 0.006]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.0075, 0.0075, 0.0025, 24]} />{M.porcelain({ col: "#f6f3ec" })}</mesh>
        {(i === 2 || i === 3) && g34 > 0.01 && <mesh position={[0, 0, 0.002]}><ringGeometry args={[0.011, 0.014, 32]} />{M.glow({ col: "#ffcf8a", op: 0.9 * g34 })}</mesh>}
      </group>)}
      {/* cuello y nudo */}
      {[1, -1].map((sx) => <mesh key={sx} position={[sx * 0.035, 0.33, 0.02]} rotation={[0.25, 0, sx * 0.5]} geometry={extr("cuellop" + sx, [[0, 0.04], [sx * 0.07, 0.03], [sx * 0.012, -0.05]], 0.003, 0.001)} castShadow><Algodon /></mesh>)}
      <mesh position={[0, 0.315, 0.03]} castShadow geometry={extr("nudo", [[-0.022, 0.022], [0.022, 0.022], [0.013, -0.02], [-0.013, -0.02]], 0.02, 0.006)}><meshPhysicalMaterial map={sarga([0.3, 0.3])} roughness={0.6} sheen={0.5} sheenColor="#7a8ac0" /></mesh>
      <mesh geometry={corbataG(q, cl(pin), tq)} castShadow receiveShadow><meshPhysicalMaterial map={sarga()} roughness={0.62} sheen={0.5} sheenColor="#7a8ac0" side={THREE.DoubleSide} /></mesh>
      {/* el pisacorbata: entra de costado entre el 3 y el 4 y muerde (clic) */}
      <group position={[lerp(0.32, 0, clip), (BTN[2] + BTN[3]) / 2, 0.03]}>
        <RBox s={[0.075, 0.007, 0.004]} r={0.0015}>{M.chrome({ col: "#e4e7ea" })}</RBox>
        <RBox s={[0.072, 0.0055, 0.003]} r={0.0012} p={[0.002, 0, -0.016]}>{M.chrome({ col: "#c9ced3" })}</RBox>
      </group>
    </Esc>
  </Stage>;
};
