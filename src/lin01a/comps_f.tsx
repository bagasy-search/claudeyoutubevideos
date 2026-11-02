// lin01a · lote F: tarjeta de la puerta del placard, termómetro de cabina, tarjeta con flor prensada, bodega, pista bajo la lluvia, las alas
import React from "react";
import * as THREE from "three";
import { Stage } from "./base";
import { HAND, Esc, M, RBox, camA, canv, cl, fabricTex, lerp, printTex, rn, spr, Blob, Sombra, extr, geo } from "./k3d";
import type { Fi } from "./valija";

const handOk = () => typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);
// pintura cremosa de una puerta de placard (con vetas que asoman y el polvo del borde)
const puertaTex = () => canv("puertaF", 512, 1024, (g) => {
  g.fillStyle = "#e9e2d2"; g.fillRect(0, 0, 512, 1024);
  for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(150,128,96,${0.05 + 0.05 * rn(i, 1)})`; g.lineWidth = 1 + 2 * rn(i, 2); g.beginPath(); const x = rn(i, 3) * 512; g.moveTo(x, 0); g.bezierCurveTo(x + 10, 300, x - 8, 700, x + 6, 1024); g.stroke(); }
  for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(${rn(i, 4) > 0.5 ? "255,255,255" : "90,80,60"},${0.04 * rn(i, 5)})`; g.fillRect(rn(i, 6) * 512, rn(i, 7) * 1024, 2, 2); }
});

// ═════════ INDEXCARD: la puerta del placard de Carol. La ficha llega volando desde el fondo, se apoya en la puerta y en
// «closet door» le caen las dos tiras de cinta. Las dos listas: «ON ME» y «IN BAG», con renglones a mano. Al salir, la puerta se cierra. ═════════
export const IndexCard: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const fly = spr(t, a + 0.3, 0.6, 1.4), tape1 = spr(t, wow - 0.04, 1.4, 1.6), tape2 = spr(t, wow + 0.12, 1.4, 1.6);
  const close = cl((t - (b - 0.7)) / 0.65), shut = close * close, write = cl((t - a - 0.6) / 1.6), ok = handOk();
  const cam = camA(t, a, b, { p: [0.55, 0.3, 2.3], l: [0.05, 0.2, 0], fov: 34 }, { p: [0.15, 0.36, 1.55], l: [0.08, 0.34, 0], fov: 34 });
  const card = printTex("idx|" + Math.round(write * 20) + "|" + ok, 640, 400, "#fbf8ef", [], (g) => {
    g.strokeStyle = "rgba(90,130,190,.45)"; g.lineWidth = 2; for (let y = 120; y < 400; y += 46) { g.beginPath(); g.moveTo(0, y); g.lineTo(640, y); g.stroke(); }
    g.strokeStyle = "rgba(210,70,70,.6)"; g.beginPath(); g.moveTo(0, 82); g.lineTo(640, 82); g.stroke(); g.beginPath(); g.moveTo(320, 30); g.lineTo(320, 380); g.stroke();
    if (!ok) return;
    g.fillStyle = "#1d2a4a"; g.font = `700 64px "${HAND}"`; g.textBaseline = "alphabetic";
    g.save(); g.beginPath(); g.rect(0, 0, 640 * cl(write * 2), 100); g.clip(); g.fillText("ON ME", 70, 70); g.fillText("IN BAG", 380, 70); g.restore();
    g.strokeStyle = "#1d2a4a"; g.lineWidth = 4; g.lineCap = "round";
    for (let c = 0; c < 2; c++) for (let i = 0; i < 5; i++) {   // renglones a mano (garabatos, sin palabras)
      const q = cl(write * 2 - 0.6 - i * 0.12 - c * 0.08) ; if (q <= 0) continue;
      const x0 = 30 + c * 320, y = 140 + i * 46, L = (180 + 70 * rn(i + c * 7, 3)) * q;
      g.beginPath(); g.moveTo(x0, y - 10); for (let x = 0; x < L; x += 6) g.lineTo(x0 + x, y - 10 - 7 * Math.abs(Math.sin(x * 0.11 + i)) ); g.stroke();
      g.beginPath(); g.arc(x0 - 12, y - 14, 3, 0, 6.3); g.fillStyle = "#1d2a4a"; g.fill();
    }
  });
  const cinta = canv("cinta", 256, 96, (g) => { g.fillStyle = "rgba(250,244,220,.82)"; g.fillRect(0, 0, 256, 96); for (let i = 0; i < 14; i++) { g.strokeStyle = `rgba(255,255,255,${0.25 + 0.3 * rn(i, 1)})`; g.lineWidth = 1 + 2 * rn(i, 2); g.beginPath(); const x = rn(i, 3) * 256; g.moveTo(x, 0); g.lineTo(x + 30 * (rn(i, 4) - 0.5), 96); g.stroke(); } g.fillStyle = "rgba(0,0,0,.08)"; for (let x = 0; x < 256; x += 8) { g.fillRect(x, 0, 4, 5); g.fillRect(x + 2, 91, 4, 5); } });
  const Tape = ({ q, x, y, r }: { q: number; x: number; y: number; r: number }) => q > 0.01 ? <group position={[x, y, 0.0014 + 0.08 * (1 - cl(q))]} rotation={[0, 0, r]} scale={[cl(q * 1.3), 1, 1]}>
    <mesh position={[0.002, -0.002, -0.0004]}><planeGeometry args={[0.11, 0.042]} /><meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} /></mesh>
    <mesh><planeGeometry args={[0.11, 0.042]} /><meshPhysicalMaterial map={cinta} transparent roughness={0.3} clearcoat={0.8} depthWrite={false} /></mesh></group> : null;
  return <Stage t={t} a={a} b={b} dim={1.05} tint="#ffe2b8">
    <Esc cam={cam} key1={[-1.2, 1.4, 1.6]} warm={1.1} cool={0.8}>
      {/* la puerta gira sobre la bisagra izquierda al cerrarse */}
      <group position={[-0.5, 0, 0]} rotation={[0, -1.25 * shut, 0]}><group position={[0.5, 0, 0]}>
        <RBox s={[1.0, 1.8, 0.04]} r={0.01} p={[0, 0, -0.022]}><meshStandardMaterial map={puertaTex()} roughness={0.55} /></RBox>
        {[[0, 0.45, 0.72, 0.62], [0, -0.42, 0.72, 0.8]].map(([x, y, w, h], i) => <group key={i} position={[x, y, 0]}>
          {[[0, h / 2, w, 0.02], [0, -h / 2, w, 0.02], [w / 2, 0, 0.02, h], [-w / 2, 0, 0.02, h]].map(([px, py, ww, hh], j) => <RBox key={j} s={[ww, hh, 0.012]} r={0.005} p={[px, py, 0.004]}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>)}
        </group>)}
        <group position={[0.42, -0.05, 0.02]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.026, 0.02, 32]} />{M.brass({ col: "#c9a24a" })}</mesh><mesh position={[0, 0, 0.022]}><sphereGeometry args={[0.03, 24, 16]} />{M.brass({ col: "#d4ad57" })}</mesh></group>
        {/* la ficha: llega desde el fondo girando y se asienta en la puerta */}
        <group position={[0.02 + 0.5 * (1 - cl(fly)), 0.43 + 0.25 * (1 - cl(fly)), 0.004 + 0.9 * (1 - cl(fly))]} rotation={[0.6 * (1 - cl(fly)), -0.8 * (1 - cl(fly)), -0.05 + 0.5 * (1 - fly)]}>
          <mesh position={[0.004, -0.004, -0.003]}><planeGeometry args={[0.3, 0.19]} /><meshBasicMaterial color="#000" transparent opacity={0.25 * cl(fly)} depthWrite={false} /></mesh>
          <mesh castShadow><boxGeometry args={[0.3, 0.188, 0.0012]} /><meshStandardMaterial attach="material" map={card} roughness={0.9} /></mesh>
          <Tape q={tape1} x={-0.13} y={0.085} r={0.55} /><Tape q={tape2} x={0.13} y={0.085} r={-0.55} />
        </group>
      </group></group>
      {/* el marco del placard */}
      <RBox s={[0.06, 1.9, 0.08]} r={0.01} p={[-0.53, 0, -0.03]}><meshStandardMaterial color="#d9d0bd" roughness={0.6} /></RBox>
      <RBox s={[1.12, 0.06, 0.08]} r={0.01} p={[0, 0.93, -0.03]}><meshStandardMaterial color="#d9d0bd" roughness={0.6} /></RBox>
      {shut > 0.01 && <mesh position={[0, 0, -0.3]}><planeGeometry args={[1.0, 1.8]} /><meshStandardMaterial color="#3a3128" roughness={0.9} /></mesh>}
    </Esc>
  </Stage>;
};

// ═════════ TERMOMETRO: el termómetro de vidrio sobre una tablita, debajo de la boquilla de aire de la cabina. En la palabra
// se abre el chorro frío: el líquido baja del rojo al azul, el vidrio se escarcha. Placa «CABIN». Al salir, se inclina hacia atrás. ═════════
export const Termometro: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const air = cl((t - wow) / 0.4), fall = spr(t, wow + 0.2, 0.32, 1.1), frost = cl((t - wow - 0.6) / 2.4);
  const lvl = lerp(0.82, 0.18, cl(fall)), tilt = cl((t - (b - 0.6)) / 0.55);
  const cam = camA(t, a, b, { p: [0.4, 0.16, 1.6], l: [0.12, 0.12, 0], fov: 34 }, { p: [-0.12, 0.12, 1.42], l: [0.08, 0.08, 0], fov: 34 });
  const col = new THREE.Color("#d8352a").lerp(new THREE.Color("#2f7fd6"), cl(fall));
  const H = 0.46, y0 = -0.2;
  return <Stage t={t} a={a} b={b} dim={0.85} tint="#d8ecff">
    <Esc cam={cam} key1={[-1.0, 1.8, 1.4]} warm={0.85} cool={1.25}>
      <group rotation={[-0.9 * tilt * tilt, 0, 0]} position={[0, 0, -0.4 * tilt]}>
        {/* tablita de madera con la escala grabada */}
        <RBox s={[0.16, 0.62, 0.025]} r={0.012} p={[0, 0.04, -0.02]}><meshPhysicalMaterial map={canv("tabla", 256, 1024, (g) => { g.fillStyle = "#a8743f"; g.fillRect(0, 0, 256, 1024); for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(70,40,15,${0.1 + 0.12 * rn(i, 1)})`; g.lineWidth = 1 + 2 * rn(i, 2); g.beginPath(); const x = rn(i, 3) * 256; g.moveTo(x, 0); g.bezierCurveTo(x + 14, 340, x - 10, 680, x + 8, 1024); g.stroke(); } })} roughness={0.4} clearcoat={0.7} /></RBox>
        {Array.from({ length: 21 }, (_, i) => <mesh key={i} position={[0.034, y0 + (i / 20) * H, -0.006]}><boxGeometry args={[i % 5 === 0 ? 0.034 : 0.018, 0.0028, 0.002]} /><meshStandardMaterial color="#2a1a0c" roughness={0.6} /></mesh>)}
        {/* sol arriba, copo abajo (grabados en bronce) */}
        <mesh position={[0, 0.3, -0.005]}><circleGeometry args={[0.022, 32]} />{M.brass({ col: "#e0a83a", em: "#ff9a2a", emI: 0.6 * (1 - cl(fall)) })}</mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.785) * 0.034, 0.3 + Math.sin(i * 0.785) * 0.034, -0.005]} rotation={[0, 0, i * 0.785]}><boxGeometry args={[0.012, 0.004, 0.002]} />{M.brass({ col: "#e0a83a" })}</mesh>)}
        {[0, 1, 2].map((i) => <mesh key={i} position={[0, -0.27, -0.005]} rotation={[0, 0, i * 1.047]}><boxGeometry args={[0.06, 0.007, 0.003]} />{M.chrome({ col: "#bfe2ff", em: "#7fc4ff", emI: 1.4 * cl(fall) })}</mesh>)}
        {/* el tubo de vidrio, el bulbo y el líquido */}
        <mesh position={[0, y0 + H / 2, 0.012]}><cylinderGeometry args={[0.017, 0.017, H + 0.02, 32]} /><meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.4} roughness={0.04} clearcoat={1} depthWrite={false} /></mesh>
        <mesh position={[0, y0 + H / 2 + 0.01, 0.012]}><sphereGeometry args={[0.017, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.4} roughness={0.04} clearcoat={1} depthWrite={false} /></mesh>
        <mesh position={[-0.008, y0 + H / 2, 0.029]}><planeGeometry args={[0.0035, H]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.75} toneMapped={false} depthWrite={false} /></mesh>
        <mesh position={[0, y0 - 0.012, 0.012]}><sphereGeometry args={[0.033, 32, 24]} /><meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.35} roughness={0.04} clearcoat={1} depthWrite={false} /></mesh>
        <mesh position={[-0.012, y0 - 0.002, 0.044]}><circleGeometry args={[0.006, 16]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} toneMapped={false} /></mesh>
        <mesh position={[0, y0 - 0.012, 0.008]}><sphereGeometry args={[0.024, 32, 24]} /><meshPhysicalMaterial color={col} roughness={0.15} clearcoat={1} emissive={col} emissiveIntensity={0.35} /></mesh>
        <mesh position={[0, y0 + (lvl * H) / 2, 0.008]}><cylinderGeometry args={[0.0055, 0.0055, lvl * H, 16]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.45} roughness={0.2} /></mesh>
        {/* escarcha sobre el vidrio */}
        {frost > 0 && <mesh position={[0, y0 + H * 0.55, 0.021]}><planeGeometry args={[0.07, H * 0.95]} /><meshBasicMaterial map={canv("frost", 128, 512, (g) => { for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(235,248,255,${0.35 * rn(i, 1)})`; const x = rn(i, 2) * 128, y = rn(i, 3) * 512; g.beginPath(); g.arc(x, y, 1 + 3 * rn(i, 4), 0, 6.3); g.fill(); } for (let i = 0; i < 40; i++) { g.strokeStyle = "rgba(240,250,255,.8)"; g.lineWidth = 1.5; const x = rn(i, 7) * 128, y = rn(i, 8) * 512, L = 6 + 10 * rn(i, 9); for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + L * Math.cos(k * 1.047), y + L * Math.sin(k * 1.047)); g.stroke(); } } })} transparent opacity={0.85 * frost} depthWrite={false} toneMapped={false} /></mesh>}
        {/* placa de bronce CABIN */}
        <RBox s={[0.12, 0.034, 0.006]} r={0.004} p={[0, -0.22 - 0.03, 0.003]}>{M.brass({ col: "#c9a24a" })}</RBox>
        <mesh position={[0, -0.25, 0.0065]}><planeGeometry args={[0.11, 0.03]} /><meshBasicMaterial map={printTex("cabinpl", 440, 120, "#c9a24a", [["CABIN", 120, 62, 74, "#3b2a0c", "900"]])} toneMapped={false} /></mesh>
      </group>
      {/* boquilla de aire arriba: gira al abrirse y suelta el chorro frío */}
      <group position={[0.0, 0.5, 0.14]} rotation={[0.35, 0, 0]}>
        <RBox s={[0.34, 0.035, 0.22]} r={0.015} p={[0, 0.03, 0]}>{M.plastic({ col: "#d4d2cc" })}</RBox>
        <mesh position={[0, -0.005, 0]}><cylinderGeometry args={[0.04, 0.044, 0.02, 32]} />{M.plastic({ col: "#c3c6c9" })}</mesh>
        <mesh position={[0, -0.025, 0]} rotation={[0, (t - a) * 0.5 + air * 2, 0]}><sphereGeometry args={[0.028, 24, 16]} />{M.chrome({ col: "#dfe3e6" })}</mesh>
        {air > 0 && Array.from({ length: 36 }, (_, i) => { const u = ((t - a) * 1.1 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.36 * u, -0.05 - 0.4 * u, 0.06 + (rn(i, 3) - 0.5) * 0.12 * u]}><planeGeometry args={[0.0025 + 0.003 * u, 0.05]} /><meshBasicMaterial color="#cfeaff" transparent opacity={0.4 * air * (1 - u) * cl(u * 6)} depthWrite={false} toneMapped={false} /></mesh>; })}
        {air > 0 && Array.from({ length: 24 }, (_, i) => { const u = ((t - a) * 0.8 + rn(i, 5)) % 1; return <mesh key={"c" + i} position={[(rn(i, 6) - 0.5) * 0.46 * u, -0.06 - 0.42 * u, 0.04]} rotation={[0, 0, u * 6]}><octahedronGeometry args={[0.006]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * air * (1 - u)} toneMapped={false} /></mesh>; })}
      </group>
    </Esc>
  </Stage>;
};

// ═════════ CARTA: sobre el cárdigan azul marino doblado, la tarjeta de agradecimiento («Thank you» a mano) y su sobre.
// En «pressed flower» la tapa se abre y adentro está la flor prensada. Al salir, la tarjeta se cierra y se va hacia el fondo. ═════════
const petG = () => geo("petalo", () => new THREE.ShapeGeometry(new THREE.Shape([[0, 0], [0.006, 0.01], [0.004, 0.022], [0, 0.026], [-0.004, 0.022], [-0.006, 0.01]].map(([x, y]) => new THREE.Vector2(x, y)))));
const Petalo: React.FC<{ r: number; col: string }> = ({ r, col }) => <mesh geometry={petG()} rotation={[-Math.PI / 2, 0, r]} position={[0, 0.0012, 0]}><meshStandardMaterial color={col} map={canv("vena", 64, 128, (g) => { g.fillStyle = "#fff"; g.fillRect(0, 0, 64, 128); g.strokeStyle = "rgba(90,40,70,.35)"; g.lineWidth = 1.2; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(32, 128); g.quadraticCurveTo(32 + i * 6, 64, 32 + i * 9, 6); g.stroke(); } })} roughness={0.8} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>;
const Flor: React.FC = () => <group scale={1.6}>
  {Array.from({ length: 6 }, (_, i) => <Petalo key={i} r={i * 1.047} col={i % 2 ? "#b77fa6" : "#c98bb4"} />)}
  <mesh position={[0, 0.0016, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.005, 16]} /><meshStandardMaterial color="#d8b84a" roughness={0.7} /></mesh>
  <mesh position={[0.012, 0.001, 0.04]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[0.0018, 0.07]} /><meshStandardMaterial color="#6f7a3e" roughness={0.8} /></mesh>
  {[[0.02, 0.05, 0.7], [0.004, 0.06, -0.6]].map(([x, z, r], i) => <mesh key={i} position={[x, 0.0011, z]} rotation={[-Math.PI / 2, 0, r]} scale={[0.6, 1, 1]}><circleGeometry args={[0.009, 16]} /><meshStandardMaterial color="#7d8a4a" roughness={0.8} /></mesh>)}
</group>;
export const Carta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const ent = spr(t, a + 0.2, 0.55, 1.3), open = spr(t, wow - 0.15, 0.7, 1.25), shut = cl((t - (b - 0.75)) / 0.45);
  const ang = -Math.PI * 0.92 * cl(open) * (1 - shut), away = cl((t - (b - 0.35)) / 0.35), ok = handOk();
  const cam = camA(t, a, b, { p: [0.2, 0.62, 0.52], l: [0, 0, 0.0], fov: 34 }, { p: [-0.06, 0.5, 0.38], l: [-0.01, 0, 0], fov: 34 });
  const front = printTex("ty|" + ok, 400, 560, "#f3ead6", [], (g) => {
    g.strokeStyle = "#b9965a"; g.lineWidth = 6; g.strokeRect(24, 24, 352, 512);
    if (!ok) return; g.fillStyle = "#3b2a4a"; g.font = `700 92px "${HAND}"`; g.textAlign = "center"; g.fillText("Thank", 200, 250); g.fillText("you", 200, 350);
  });
  return <Stage t={t} a={a} b={b} dim={1.15} tint="#ffd9c8">
    <Esc cam={cam} key1={[-1.0, 2.0, 1.0]} warm={1.15} cool={0.75}>
      {/* el cárdigan azul marino doblado */}
      <group position={[0.03, 0, 0.02]} rotation={[0, 0.15, 0]}>
        <RBox s={[0.42, 0.04, 0.34]} r={0.018} p={[0, 0.02, 0]}><meshStandardMaterial map={fabricTex("lana", [2, 2])} color="#24324f" roughness={0.95} /></RBox>
        <RBox s={[0.4, 0.02, 0.1]} r={0.009} p={[0, 0.045, -0.11]}><meshStandardMaterial map={fabricTex("lana", [2, 0.6])} color="#2a3a5a" roughness={0.95} /></RBox>
        {[-0.12, -0.04, 0.04, 0.12].map((x) => <mesh key={x} position={[x, 0.042, 0.13]}><sphereGeometry args={[0.008, 12, 8]} /><meshStandardMaterial color="#d8cdb6" roughness={0.4} /></mesh>)}
        <Blob w={0.6} d={0.5} o={0.45} />
      </group>
      {/* el sobre */}
      <group position={[-0.12, 0.043, -0.05]} rotation={[0, 0.35, 0]}><RBox s={[0.2, 0.004, 0.14]} r={0.003} p={[0, 0.002, 0]}><meshStandardMaterial color="#e9dcc0" roughness={0.9} /></RBox>
        <mesh position={[0, 0.0045, -0.02]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.1]} /><meshBasicMaterial map={canv("solapa", 256, 128, (g) => { g.fillStyle = "#0000"; g.clearRect(0, 0, 256, 128); g.fillStyle = "#dfd0b0"; g.beginPath(); g.moveTo(0, 0); g.lineTo(256, 0); g.lineTo(128, 110); g.closePath(); g.fill(); })} transparent /></mesh></group>
      {/* la tarjeta: llega desde arriba; la tapa gira sobre el lomo izquierdo */}
      <group position={[0.03, 0.05 + 0.3 * (1 - cl(ent)) + 0.2 * away, 0.03 - 0.4 * away]} rotation={[0, -0.12 + 0.4 * (1 - cl(ent)), 0.3 * (1 - cl(ent))]} scale={1 - 0.6 * away}>
        <mesh position={[0.07, 0.0011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.14, 0.2]} /><meshStandardMaterial color="#f6efe0" roughness={0.9} /></mesh>
        {open > 0.05 && <group position={[0.07, 0, 0]}><Flor /></group>}
        <group rotation={[0, 0, -ang]}>
          <group position={[0.07, 0.0025, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow><boxGeometry args={[0.14, 0.2, 0.0015]} /><meshStandardMaterial map={front} roughness={0.85} /></mesh>
            <mesh position={[0, -0.0009, 0]} rotation={[Math.PI / 2, 0, Math.PI]}><planeGeometry args={[0.14, 0.2]} /><meshStandardMaterial map={printTex("tyin|" + ok, 400, 560, "#f6efe0", [], (g) => { if (!ok) return; g.fillStyle = "#3b2a4a"; g.font = `700 70px "${HAND}"`; g.textAlign = "center"; g.fillText("Love,", 200, 300); g.fillText("Carol", 200, 380); })} roughness={0.9} /></mesh>
          </group>
        </group>
      </group>
      <Sombra w={1.4} d={1.2} o={0.3} y={0.0} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow><planeGeometry args={[1.4, 1.0]} /><meshPhysicalMaterial map={canv("mesaF", 512, 512, (g) => { g.fillStyle = "#7a5233"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(40,22,10,${0.1 + 0.1 * rn(i, 1)})`; g.lineWidth = 1 + 3 * rn(i, 2); g.beginPath(); const y = rn(i, 3) * 512; g.moveTo(0, y); g.bezierCurveTo(170, y + 12, 340, y - 10, 512, y + 6); g.stroke(); } })} roughness={0.45} clearcoat={0.4} /></mesh>
    </Esc>
  </Stage>;
};

// ═════════ BODEGA: el avión en corte de costado: arriba la cabina con sus asientos, abajo la bodega con las valijas.
// La de Mr. Delgado brilla (la lapicera de insulina adentro). En «nobody can go» el piso se pone rojo y cae el candado:
// «OUT OF REACH». Al salir, el corte se aleja hacia el fondo. ═════════
export const Bodega: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const glow = cl((t - a - 0.8) / 0.6), lock = spr(t, wow - 0.05, 1.0, 1.5), red = cl((t - wow + 0.05) / 0.25), sl = (t - a) * 0.06;
  const cam = camA(t, a, b, { p: [0.4, 0.05, 2.15], l: [0.1, -0.05, 0], fov: 36 }, { p: [-0.15, -0.05, 1.7], l: [0.05, -0.12, 0], fov: 36 });
  const R = 0.42, estadio = (hw: number, r: number) => { const p: number[][] = []; for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + (i / 20) * Math.PI; p.push([hw + r * Math.cos(a), r * Math.sin(a)]); } for (let i = 0; i <= 20; i++) { const a = Math.PI / 2 + (i / 20) * Math.PI; p.push([-hw + r * Math.cos(a), r * Math.sin(a)]); } return p; };
  return <Stage t={t} a={a} b={b} dim={1.1} tint="#cfe0f2">
    <Esc cam={cam} key1={[-1.2, 1.6, 1.8]} warm={0.95} cool={1.1}>
      <group rotation={[0, -0.12, 0]}>
        {/* fuselaje: medio cilindro abierto hacia la cámara */}
        <mesh position={[0, 0, 0.2]} geometry={extr("fus", estadio(0.86, R + 0.03), 0.03, 0.006, [estadio(0.82, R)])} castShadow>{M.plastic({ col: "#eef1f4" })}</mesh>
        <mesh position={[0, 0, -0.2]} geometry={extr("fusb", estadio(0.86, R + 0.03), 0.02, 0)}><meshStandardMaterial color="#c9cfd6" roughness={0.7} /></mesh>
        <mesh position={[0, -0.25, -0.18]}><planeGeometry args={[1.8, 0.33]} /><meshStandardMaterial color={new THREE.Color("#5a6068").lerp(new THREE.Color("#b8423a"), 0.75 * red)} emissive="#ff3a2a" emissiveIntensity={0.25 * red} roughness={0.9} /></mesh>
        {/* cola para que se lea avión */}
        <mesh position={[1.22, 0.2, 0.2]} geometry={extr("cola", [[0, 0], [0.3, 0.05], [0.42, 0.42], [0.3, 0.42], [0.05, 0.12]], 0.02, 0.006)}>{M.plastic({ col: "#e6eaee" })}</mesh>
        {Array.from({ length: 9 }, (_, i) => <mesh key={"v" + i} position={[-0.8 + i * 0.2, 0.16, 0.217]}><circleGeometry args={[0.018, 20]} /><meshStandardMaterial color="#7fa8d0" emissive="#bfe0ff" emissiveIntensity={0.4} roughness={0.2} /></mesh>)}
        {/* el piso que separa cabina y bodega */}
        <RBox s={[2.4, 0.025, 0.4]} r={0.006} p={[0, -0.08, 0]}><meshStandardMaterial color={red > 0 ? new THREE.Color("#8a8f96").lerp(new THREE.Color("#c4302b"), red) : "#8a8f96"} emissive="#ff2a1a" emissiveIntensity={0.5 * red} roughness={0.5} /></RBox>
        {/* asientos de la cabina */}
        {Array.from({ length: 6 }, (_, i) => <group key={i} position={[-0.6 + i * 0.24, -0.068, -0.1]}>
          <RBox s={[0.1, 0.03, 0.12]} r={0.01} p={[0, 0.06, 0]}><meshStandardMaterial map={fabricTex("navy", [1, 1])} color="#6f8fd0" roughness={0.8} /></RBox>
          <RBox s={[0.03, 0.15, 0.12]} r={0.01} p={[-0.05, 0.13, 0]} rot={[0, 0, 0.12]}><meshStandardMaterial map={fabricTex("navy", [1, 1])} color="#6f8fd0" roughness={0.8} /></RBox>
          <mesh position={[0, 0.025, 0]}><boxGeometry args={[0.01, 0.05, 0.1]} />{M.steel()}</mesh>
        </group>)}
        {/* portaequipajes y ventanillas */}
        <RBox s={[1.5, 0.07, 0.14]} r={0.02} p={[0, 0.28, -0.12]}>{M.plastic({ col: "#f2f2ef" })}</RBox>
        {Array.from({ length: 6 }, (_, i) => <RBox key={i} s={[0.05, 0.08, 0.01]} r={0.022} p={[-0.6 + i * 0.24, 0.16, -0.185]}><meshStandardMaterial color="#9fc6ea" emissive="#d8ecff" emissiveIntensity={0.6} /></RBox>)}
        {/* bodega: contenedores y valijas */}
        {Array.from({ length: 5 }, (_, i) => { const me = i === 2; const x = -0.56 + i * 0.28 + (me ? sl * 0 : 0); return <group key={i} position={[x, -0.3, -0.08]}>
          <RBox s={[0.2, 0.15, 0.1]} r={0.014} p={[0, 0, 0]}>{me ? <meshStandardMaterial color="#5a3a24" roughness={0.6} emissive="#ffb050" emissiveIntensity={0.55 * glow} /> : M.plastic({ col: ["#4d5560", "#6c4a3a", "#3e4a5c", "#71675a", "#4a5446"][i] })}</RBox>
          <mesh position={[0, 0.085, 0]}><torusGeometry args={[0.03, 0.006, 8, 20, Math.PI]} />{M.steel()}</mesh>
          {me && <group position={[0, 0, 0.056]}>
            <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.12, 20]} /><meshStandardMaterial color="#e9eef3" roughness={0.3} emissive="#ffffff" emissiveIntensity={0.3 * glow} /></mesh>
            <mesh position={[0.065, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.013, 0.013, 0.025, 20]} /><meshStandardMaterial color="#f08a2a" roughness={0.3} emissive="#f08a2a" emissiveIntensity={0.6 * glow} /></mesh>
            <mesh position={[0, 0, 0.002]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial map={canv("haloI", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 6, 64, 64, 64); gr.addColorStop(0, "rgba(255,190,110,.8)"); gr.addColorStop(1, "rgba(255,170,80,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); })} transparent opacity={0.8 * glow} depthWrite={false} toneMapped={false} /></mesh>
          </group>}
        </group>; })}
        {/* el candado cae sobre el piso, justo arriba de la valija; la placa en el canto del piso */}
        <RBox s={[0.36, 0.014, 0.02]} r={0.005} p={[0.0, -0.205, 0.228]}>{M.plastic({ col: "#cfd5db" })}</RBox>
        {lock > 0.01 && <group position={[0, -0.24 + 0.4 * (1 - cl(lock)), 0.25]} rotation={[0, 0.25 * (1 - cl(lock)), 0]}>
          <RBox s={[0.1, 0.08, 0.04]} r={0.012} p={[0, 0.0, 0]}>{M.brass({ col: "#d1a64a" })}</RBox>
          <mesh position={[0, 0.05, 0]}><torusGeometry args={[0.032, 0.008, 12, 32, Math.PI]} />{M.chrome()}</mesh>
          <mesh position={[0, -0.005, 0.021]}><circleGeometry args={[0.008, 16]} /><meshBasicMaterial color="#2a1c06" /></mesh>
        </group>}
        <group position={[0, -0.34, 0.25]} scale={[1, cl(red * 1.2), 1]}>
          <RBox s={[0.42, 0.06, 0.012]} r={0.006} p={[0, 0, 0]}><meshStandardMaterial color="#c4302b" roughness={0.4} /></RBox>
          <mesh position={[0, 0, 0.0065]}><planeGeometry args={[0.4, 0.052]} /><meshBasicMaterial map={printTex("oor", 800, 104, "#c4302b", [["OUT OF REACH", 105, 56, 74, "#ffffff", "900"]])} toneMapped={false} /></mesh>
        </group>
      </group>
      <Sombra w={2.4} d={1.6} o={0.3} y={-0.45} />
    </Esc>
  </Stage>;
};

// ═════════ CAMINATA: una pista de noche bajo la lluvia, la línea amarilla y las luces del borde. Unos zapatos cómodos
// cruzan dejando huellas mojadas; en la palabra se ilumina el cartel de pista: «COULD YOU WALK IT?». Al salir, la cámara sube. ═════════
export const Zapato: React.FC<{ col?: string }> = ({ col = "#8fa6c4" }) => <group>
  <RBox s={[0.054, 0.016, 0.12]} r={0.008} p={[0, 0.008, 0]}>{M.rubber({ col: "#f3efe6" })}</RBox>
  {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.006, -0.05 + i * 0.017]}><boxGeometry args={[0.0555, 0.003, 0.004]} /><meshStandardMaterial color="#c9c3b6" roughness={0.9} /></mesh>)}
  <RBox s={[0.048, 0.032, 0.075]} r={0.015} p={[0, 0.03, -0.018]}><meshStandardMaterial map={fabricTex("jersey", [1, 1])} color={col} roughness={0.75} /></RBox>
  <mesh position={[0, 0.02, 0.032]} scale={[0.024, 0.018, 0.03]}><sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={fabricTex("jersey", [1, 1])} color={col} roughness={0.75} /></mesh>
  <mesh position={[0, 0.0175, 0.032]} scale={[0.026, 0.006, 0.032]}><sphereGeometry args={[1, 24, 12]} />{M.rubber({ col: "#f3efe6" })}</mesh>
  <RBox s={[0.026, 0.006, 0.05]} r={0.003} p={[0, 0.047, -0.004]} rot={[0.35, 0, 0]}><meshStandardMaterial map={fabricTex("jersey", [1, 1])} color={col} roughness={0.75} /></RBox>
  {[-0.016, -0.004, 0.008, 0.02].map((z) => <mesh key={z} position={[0, 0.0475 - (z + 0.02) * 0.32, z]} rotation={[0.35, 0, 0]}><boxGeometry args={[0.03, 0.003, 0.0035]} /><meshStandardMaterial color="#ffffff" roughness={0.5} /></mesh>)}
  <mesh position={[0, 0.044, -0.042]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.3, 1]}><circleGeometry args={[0.014, 24]} /><meshStandardMaterial color="#20252c" roughness={0.9} /></mesh>
  <RBox s={[0.022, 0.024, 0.006]} r={0.003} p={[0, 0.04, -0.058]}><meshStandardMaterial color="#d8603a" roughness={0.5} /></RBox>
</group>;
export const Caminata: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const sign = spr(t, wow - 0.05, 0.9, 1.4), lit = cl((t - wow + 0.05) / 0.2), walk = (t - a) * 0.11;
  const cam = camA(t, a, b, { p: [0.2, 0.42, 1.5], l: [0.3, 0.08, -0.1], fov: 36 }, { p: [-0.25, 0.6, 1.35], l: [0.35, 0.06, -0.15], fov: 36 });
  const steps = Array.from({ length: 12 }, (_, i) => i), stepT = (i: number) => a + 0.4 + i * 0.42;
  const wet = canv("asfalto", 512, 512, (g) => { g.fillStyle = "#2b2d30"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "200,200,200" : "0,0,0"},${0.08 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 2, 2); } }, [3, 3]);
  return <Stage t={t} a={a} b={b} dim={0.45} tint="#bcd2ea">
    <Esc cam={cam} key1={[-1.6, 1.8, 0.8]} warm={0.9} cool={1.3} exposure={1.3}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[3.2, 1.6]} /><meshPhysicalMaterial map={wet} transparent alphaMap={canv("borde", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 60, 128, 128, 128); gr.addColorStop(0, "#fff"); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }, [1, 1], false)} color="#7a8088" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} metalness={0.2} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0.12]}><planeGeometry args={[3, 0.025]} /><meshStandardMaterial color="#e6b31e" roughness={0.4} emissive="#e6b31e" emissiveIntensity={0.15} /></mesh>
      {/* luces del borde de pista y su reflejo en el agua */}
      {Array.from({ length: 9 }, (_, i) => <group key={i} position={[-1.2 + i * 0.32, 0, -0.35]}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.006, 0.008, 0.06, 12]} />{M.steel({ col: "#6d747b" })}</mesh>
        <mesh position={[0, 0.07, 0]}><sphereGeometry args={[0.014, 16, 12]} />{M.glow({ col: "#7fb8ff" })}</mesh>
        <mesh position={[0, 0.0015, 0.08]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.03, 0.18]} /><meshBasicMaterial color="#7fb8ff" transparent opacity={0.35} depthWrite={false} toneMapped={false} /></mesh>
      </group>)}
      {/* charcos */}
      {[[-0.3, 0.3, 0.22], [0.5, 0.05, 0.3], [0.9, 0.4, 0.18]].map(([x, z, r], i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.0015, z]} scale={[1, 0.6, 1]}><circleGeometry args={[r, 40]} /><meshPhysicalMaterial color="#20262e" roughness={0.02} metalness={0.6} clearcoat={1} transparent opacity={0.85} /></mesh>)}
      {/* pisadas: el zapato apoya, levanta y avanza; queda la huella mojada */}
      {steps.map((i) => { const ts = stepT(i), x = -0.9 + i * 0.22, z = 0.22 + (i % 2 ? 0.05 : -0.05); if (t < ts) return null; const q = cl((t - ts) / 0.42), fade = 1 - cl((t - ts - 2.5) / 2);
        return <group key={i}>
          <group position={[x, 0.0018, z]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={2.2}>
            <mesh position={[0, 0.02, 0]} scale={[1, 1.6, 1]}><circleGeometry args={[0.024, 24]} /><meshBasicMaterial map={canv("charcoH", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, "rgba(170,200,235,.75)"); gr.addColorStop(0.8, "rgba(210,230,255,.9)"); gr.addColorStop(1, "rgba(210,230,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); })} transparent opacity={0.75 * fade * cl(q * 3)} depthWrite={false} toneMapped={false} /></mesh>
            <mesh position={[0, -0.035, 0.0001]} scale={[1, 1.1, 1]}><circleGeometry args={[0.02, 24]} /><meshBasicMaterial map={canv("charcoH", 128, 128, () => {})} transparent opacity={0.75 * fade * cl(q * 3)} depthWrite={false} toneMapped={false} /></mesh>
          </group>
          {q < 1 && i === Math.floor((t - a - 0.4) / 0.42) && <group position={[x + 0.22 * q, 0.05 * Math.sin(q * Math.PI), z]} rotation={[0, Math.PI / 2, -0.3 * Math.sin(q * Math.PI)]}><group scale={2.2}><Zapato /></group></group>}
          {i === Math.floor((t - a - 0.4) / 0.42) - 1 && <group position={[x, 0, z]} rotation={[0, Math.PI / 2, 0]}><group scale={2.2}><Zapato /></group></group>}
        </group>; })}
      {/* lluvia y salpicaduras */}
      {Array.from({ length: 140 }, (_, i) => { const u = ((t - a) * 1.6 + rn(i, 1)) % 1; return <mesh key={i} position={[-1.2 + 2.6 * rn(i, 2), 1.2 - 1.2 * u, -0.6 + 1.3 * rn(i, 3)]} rotation={[0, 0, 0.12]}><planeGeometry args={[0.0018, 0.07]} /><meshBasicMaterial color="#cfe2f7" transparent opacity={0.45} depthWrite={false} toneMapped={false} /></mesh>; })}
      {Array.from({ length: 24 }, (_, i) => { const u = ((t - a) * 1.4 + rn(i, 7)) % 1; return <mesh key={"s" + i} rotation={[-Math.PI / 2, 0, 0]} position={[-1 + 2.2 * rn(i, 8), 0.002, -0.4 + 1.0 * rn(i, 9)]} scale={0.01 + 0.04 * u}><ringGeometry args={[0.8, 1, 24]} /><meshBasicMaterial color="#dfeeff" transparent opacity={0.6 * (1 - u)} depthWrite={false} toneMapped={false} /></mesh>; })}
      {/* el cartel de pista (letras amarillas sobre negro), se levanta y se enciende en la palabra */}
      <group position={[0.6, 0, -0.2]} rotation={[0, -0.2, 0]} scale={[1, Math.max(0.001, cl(sign)), 1]}>
        {[-0.2, 0.2].map((x) => <group key={x}><mesh position={[x, 0.05, 0]}><cylinderGeometry args={[0.012, 0.014, 0.1, 12]} />{M.steel({ col: "#9aa1a9" })}</mesh><mesh position={[x, 0.006, 0]}><cylinderGeometry args={[0.03, 0.034, 0.012, 20]} />{M.steel({ col: "#6d747b" })}</mesh></group>)}
        <mesh position={[0, 0.0016, 0.08]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.56, 0.2]} /><meshBasicMaterial map={canv("refl", 256, 128, (g) => { const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "rgba(255,210,58,.6)"); gr.addColorStop(1, "rgba(255,210,58,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 128); })} transparent opacity={0.6 * lit} depthWrite={false} toneMapped={false} /></mesh>
        <Blob w={0.7} d={0.16} o={0.6} y={0.0014} />
        <group position={[0.06, 0, -0.16]}><Blob w={0.62} d={0.3} o={0.5} y={0.0013} /></group>
        <RBox s={[0.56, 0.15, 0.06]} r={0.012} p={[0, 0.17, 0]}>{M.plastic({ col: "#15171a" })}</RBox>
        <mesh position={[0, 0.17, 0.031]}><planeGeometry args={[0.53, 0.125]} /><meshBasicMaterial map={printTex("walk", 1060, 250, "#111214", [["COULD YOU WALK IT?", 60, 128, 80, "#ffd23a", "900"]], (g) => { g.strokeStyle = "#ffd23a"; g.lineWidth = 8; g.strokeRect(14, 14, 1032, 222); })} toneMapped={false} color={new THREE.Color("#777").lerp(new THREE.Color("#fff"), lit)} /></mesh>
        {lit > 0 && <pointLight position={[0, 0.17, 0.25]} intensity={0.2 * lit} distance={0.6} color="#ffd23a" />}
        
      </group>
    </Esc>
  </Stage>;
};

// ═════════ ALAS: sobre terciopelo azul marino, las alas doradas de azafata de Linda; desde el fondo llegan las alas plateadas
// de piloto. Se acercan, y en «the same rule» encastran una al lado de la otra con un brillo; abajo, la plaquita «SAME RULE». ═════════
const ALA = [[0, 0.004], [0.02, 0.012], [0.05, 0.02], [0.09, 0.03], [0.13, 0.034], [0.15, 0.03], [0.12, 0.022], [0.14, 0.016], [0.11, 0.011], [0.125, 0.004], [0.09, 0.001], [0.1, -0.006], [0.06, -0.006], [0.03, -0.01], [0, -0.008]];
const Alas: React.FC<{ metal: "oro" | "plata"; centro: string }> = ({ metal, centro }) => {
  const mat = metal === "oro" ? M.brass({ col: "#d6a93e" }) : M.chrome({ col: "#d9dee4" });
  return <group rotation={[-Math.PI / 2, 0, 0]}>
    <mesh geometry={extr("ala", ALA, 0.004, 0.0015)} castShadow>{mat}</mesh>
    <mesh geometry={extr("ala", ALA, 0.004, 0.0015)} scale={[-1, 1, 1]} castShadow>{mat}</mesh>
    {[0.03, 0.06, 0.09, 0.12].map((x) => [1, -1].map((sx) => <mesh key={x + "" + sx} position={[sx * x, 0.012 + x * 0.08, 0.0045]} rotation={[0, 0, sx * 0.25]}><boxGeometry args={[0.0015, 0.018, 0.001]} /><meshStandardMaterial color="#5a4a2a" roughness={0.6} /></mesh>))}
    <mesh position={[0, 0.006, 0.002]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.008, 32]} />{mat}</mesh>
    <mesh position={[0, 0.006, 0.0065]}><circleGeometry args={[0.014, 32]} /><meshStandardMaterial color={centro} roughness={0.25} metalness={0.3} /></mesh>
  </group>;
};
export const AlasPar: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const mine = spr(t, a + 0.1, 0.5, 1.3), his = spr(t, a + 1.4, 0.32, 1.2), cq = cl((t - wow + 0.12) / 0.25), click = 1 - (1 - cq) ** 3, shine = cl((t - wow) / 0.5);
  const gap = lerp(0.95, 0.6, click), plate = spr(t, wow + 0.05, 0.9, 1.4);
  const cam = camA(t, a, b, { p: [0.08, 1.05, 0.72], l: [0, 0, 0.06], fov: 36 }, { p: [-0.04, 0.92, 0.6], l: [0, 0, 0.06], fov: 36 });
  return <Stage t={t} a={a} b={b} dim={1.15} tint="#ffe2a8">
    <Esc cam={cam} key1={[-1.0, 2.0, 0.8]} warm={1.05} cool={0.95}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.4, 1.6]} /><meshPhysicalMaterial map={canv("terciopelo", 512, 512, (g) => { g.fillStyle = "#2c3f74"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 26000; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "140,165,230" : "10,16,40"},${0.18 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 1, 2); } for (let i = 0; i < 6; i++) { const y = rn(i, 5) * 512, gr = g.createLinearGradient(0, y - 40, 0, y + 40); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(120,150,220,.18)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, y - 40, 512, 80); } }, [2, 2])} color="#8fa6e0" roughness={0.95} sheen={1} sheenColor="#9fb8ff" sheenRoughness={0.4} /></mesh>
      <group position={[-gap / 2, 0.006 + 0.3 * (1 - cl(mine)), 0]} rotation={[0, 0.5 * (1 - cl(mine)), 0]}><group scale={[2.0, 2.0, 3.4]}><Alas metal="oro" centro="#2a4a8a" /></group><Blob w={0.68} d={0.3} o={0.8 * cl(mine)} y={-0.004} /></group>
      <group position={[gap / 2 + 0.6 * (1 - cl(his)), 0.006 + 0.2 * (1 - cl(his)), -0.5 * (1 - cl(his))]} rotation={[0, -0.6 * (1 - cl(his)), 0]}><group scale={[2.0, 2.0, 3.4]}><Alas metal="plata" centro="#1f2a3a" /></group><Blob w={0.68} d={0.3} o={0.8 * cl(his)} y={-0.004} /></group>
      {/* destello al encastrar */}
      {shine > 0 && shine < 1 && <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05 + 0.5 * shine}><planeGeometry args={[1, 0.08]} /><meshBasicMaterial color="#fff3cf" transparent opacity={0.9 * (1 - shine)} depthWrite={false} toneMapped={false} /></mesh>}
      {shine > 0 && shine < 1 && <pointLight position={[0, 0.12, 0.05]} intensity={1.2 * (1 - shine)} distance={0.8} color="#ffe2a0" />}
      {/* la plaquita grabada */}
      <group position={[0, 0.004, 0.2 + 0.15 * (1 - cl(plate))]} scale={Math.max(0.001, 1.6 * cl(plate))}>
        <RBox s={[0.22, 0.008, 0.05]} r={0.004} p={[0, 0.004, 0]}>{M.brass({ col: "#c9a24a" })}</RBox>
        <mesh position={[0, 0.0085, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.21, 0.044]} /><meshBasicMaterial map={printTex("samerule", 840, 176, "#c9a24a", [["SAME RULE", 170, 92, 104, "#3b2a0c", "900"]])} toneMapped={false} /></mesh>
        <Blob w={0.3} d={0.09} o={0.45} y={-0.002} />
      </group>
    </Esc>
  </Stage>;
};
