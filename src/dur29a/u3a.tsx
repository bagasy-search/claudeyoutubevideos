// dur29a · 2ª vuelta de los componentes únicos en 3D real (kit h3d + k3), tras el evaluador («¿por qué no lo hacés en 3D?»).
// Bloque A: el pozo, el cuadro velado, la marca de la cuadrilla, la montaña queso, el hilito de tierra, los pisones, la cadena de relevos.
import React from "react";
import * as THREE from "three";
import { M, RBox, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { U3, dirtT, sec, useImg } from "./k3";
import { F } from "./ukit";
import { Stickman } from "../stickman3d";

type UP = { d: number; p: any };
const PI = Math.PI;
const rock = (key: string, base: number[], rx = 2, ry = 2) => tex.text("rock" + key + rx + ry, 512, 512, (g) => {
  g.fillStyle = `rgb(${base.join(",")})`; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2200; i++) { const v = (rn(i, 1) - 0.5) * 60; g.fillStyle = `rgba(${base[0] + v},${base[1] + v * 0.8},${base[2] + v * 0.6},.5)`; const r = 1 + rn(i, 2) * 5; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, r, r); }
  for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(20,10,5,${0.15 + 0.2 * rn(i, 5)})`; g.lineWidth = 1 + 2 * rn(i, 6); g.beginPath(); let x = rn(i, 7) * 512, y = rn(i, 8) * 512; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (rn(i, 9 + k) - 0.5) * 80; y += (rn(i, 19 + k) - 0.3) * 60; g.lineTo(x, y); } g.stroke(); }
});
const rockT = (key: string, base: number[], rx: number, ry: number) => { const t = rock(key, base, rx, ry); t.repeat.set(rx, ry); return t; };

// ---------- contador mecánico de rodillos (HTML sobre la escena, latón): el número rueda, nunca salta ----------
export const Drums: React.FC<{ v: number; n?: number; x: number; y: number; s?: number; unit?: string; op?: number }> = ({ v, n = 3, x, y, s = 1, unit, op = 1 }) => {
  const digs = Array.from({ length: n }, (_, i) => { const p = Math.pow(10, n - 1 - i), raw = v / p; const d = Math.floor(raw) % 10, fr = raw - Math.floor(raw); const roll = i === n - 1 ? raw % 10 : d + (fr > 0.9 && (v % p) > p - p / 10 - 1e-6 ? (fr - 0.9) * 10 : 0); return roll; });
  return <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "left top", opacity: op, display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 18,
    background: "linear-gradient(180deg,#d9b260,#8a6424 55%,#c99a46)", boxShadow: "0 18px 40px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,240,200,.6), inset 0 -3px 0 rgba(60,35,10,.6)" }}>
    {digs.map((r, i) => <div key={i} style={{ width: 70, height: 96, overflow: "hidden", borderRadius: 8, background: "#141210", boxShadow: "inset 0 10px 14px rgba(0,0,0,.9), inset 0 -10px 14px rgba(0,0,0,.9)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: -r * 96, width: 70 }}>{Array.from({ length: 11 }, (_, k) => <div key={k} style={{ height: 96, lineHeight: "96px", textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: 70, color: "#f3ead6" }}>{k % 10}</div>)}</div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.55),transparent 30%,transparent 70%,rgba(0,0,0,.55))" }} />
    </div>)}
    {unit && <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: "#2a1a08", marginLeft: 6 }}>{unit}</div>}
  </div>;
};

// ---- PozoCorte · «Te despiertas a doscientos metros»: bajás por el pozo de Potosí agarrado a la escalera de cuero; el cuadradito de luz
// de arriba se achica y los rodillos de bronce cuentan los metros hasta 200 ----
export const PozoCorte3D: React.FC<UP> = ({ d, p }) => {
  const D = d / 30, Ld = 9;
  return <U3 d={d} bg={p.bg} ground={0 as any} floor="none" sky="#0b0806" mode="drop" key1={[0.3, 3.2, 0.2]}
    cam={{ at: [0, 0.32, -0.2], at1: [0, 0.32, -0.2], az: [0.3, 0.12], el: [0.12, 0.06], r: [2.3, 2.0], fov: 40 }}
    over={(tt) => { const k = 0.55 * eio(tt, 0, D + 0.6) + 0.45 * cl(tt / (D + 0.6)); return <Drums v={Math.min(200, Math.round(200 * k * 1.04))} x={1430} y={110} s={0.95} unit="m" />; }}>{(tt) => {
    const k = 0.55 * eio(tt, 0, D + 0.6) + 0.45 * cl(tt / (D + 0.6)), cy = lerp(0.2, -Ld + 0.6, k);
    return <group position={[0, 0.45 - cy, 0]}>
      {/* el pozo: cilindro de roca visto por dentro, la boca de luz arriba */}
      {/* el pozo: roca en capas (arenisca arriba, caliza, pizarra abajo) vista por dentro */}
      {[[1.4, 2.4, [196, 146, 92]], [-1.6, 3.6, [176, 150, 116]], [-5.2, 3.6, [126, 74, 50]], [-8.4, 2.8, [84, 76, 84]]].map(([y, h, c], i) =>
        <group key={i} position={[0, y as number, 0]}>
          <mesh><cylinderGeometry args={[0.62, 0.62, h as number, 48, 1, true, PI / 2, PI]} /><meshStandardMaterial map={rockT("pozo" + i, c as number[], 4, 3)} roughness={0.95} side={THREE.DoubleSide} /></mesh>
          {/* la cara del corte: el estrato a cada lado del tiro */}
          {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 1.81, 0, 0]}><boxGeometry args={[2.38, h as number, 0.06]} /><meshStandardMaterial map={rockT("corte" + i, (c as number[]).map((v) => v * 0.9), 3, 2)} roughness={0.95} /></mesh>)}
          <mesh position={[0, 0, -1.0]}><boxGeometry args={[6, h as number, 0.1]} /><meshStandardMaterial map={rockT("fondo" + i, (c as number[]).map((v) => v * 0.6), 4, 2)} roughness={1} /></mesh>
        </group>)}
      {/* el piso del fondo del tiro */}
      <mesh position={[0, -9.75, -0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.62, 40, 0, PI]} /><meshStandardMaterial map={dirtT([96, 80, 70])} roughness={1} /></mesh>
      <pointLight position={[0, -9.2, 0.2]} intensity={2.2} distance={2.4} color="#ffb45e" />
      {/* candiles clavados en la pared, cada 0,9 m hasta el fondo */}
      {Array.from({ length: 12 }, (_, i) => { const a = 0.9 + i * 2.1, y = 0.6 - i * 0.9; return <group key={i} position={[Math.cos(a) * 0.56, y, Math.sin(a) * 0.56]}>
        <mesh><sphereGeometry args={[0.022, 12, 10]} />{M.glow({ col: "#ffc46a" })}</mesh>
        <mesh position={[0, 0, 0]} scale={[1, 1, 1]}><sphereGeometry args={[0.07, 12, 10]} />{M.glow({ col: "#ff9a40", op: 0.18 })}</mesh>
      </group>; })}
      {/* el minero baja por la escalera, un poco más abajo que vos, con su candil */}
      <group position={[0, cy - 0.45 + 0.03 * Math.sin(tt * 2 * PI * 0.8), -0.36]}>
        <Stickman escala={0.24} rotY={180} guion={[{ t: 0, accion: "idle", expr: "nervioso" }]} semilla={3} />
        <mesh position={[0.12, 0.5, 0.06]}><sphereGeometry args={[0.018, 12, 10]} />{M.glow({ col: "#ffcf7a" })}</mesh>
      </group>
      <pointLight position={[0.12, cy - 0.5, -0.3]} intensity={1.5 + 0.1 * Math.sin(tt * 2 * PI * 1.1)} distance={2.6} color="#ffb45e" />
      <pointLight position={[0, cy + 0.1, 0.1]} intensity={1.6} distance={2.2} color="#ffd9a8" />
      <mesh position={[0, 2.05, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.6, 40]} />{M.glow({ col: "#e8c89a", op: 0.6 })}</mesh>
      <spotLight position={[0, 2, 0]} target-position={[0, -4, 0]} angle={0.4} penumbra={1} intensity={1.8} distance={7} color="#fff0d8" />
      {/* la vela que bajás con vos: siempre montada, titila lento */}
      <pointLight position={[0.15, cy + 0.12, 0.25]} intensity={1.6 + 0.12 * Math.sin(tt * 2 * PI * 1.4)} distance={2.4} color="#ffb45e" />
      {/* escalera de cuero y palos pegada a la pared */}
      {[-0.13, 0.13].map((x, i) => <mesh key={i} position={[x, -Ld / 2 + 0.8, -0.56]}><boxGeometry args={[0.025, Ld + 2.2, 0.025]} />{M.matte({ col: "#4a2e1a" })}</mesh>)}
      {Array.from({ length: 46 }, (_, i) => <mesh key={i} position={[0, 1.6 - i * 0.24, -0.555]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.3, 10]} /><meshStandardMaterial map={tex.wood(1, 1, [120, 84, 50])} roughness={0.8} /></mesh>)}
    </group>;
  }}</U3>;
};

// ---- CuadroVelado · «número ocho tiene un trabajo»: el lienzo tapado con tela; una cuerda levanta la tela desde la esquina y la luz
// barre el cuadro; del marco cuelga una chapa de madera con un 8 tallado ----
const ochoT = () => tex.text("ocho", 256, 256, (g) => {
  g.fillStyle = "#8a5a2e"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(50,25,8,${0.1 + 0.15 * rn(i, 1)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(0, rn(i, 2) * 256); g.bezierCurveTo(90, rn(i, 3) * 256, 170, rn(i, 4) * 256, 256, rn(i, 5) * 256); g.stroke(); }
  g.font = "900 210px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,230,190,.35)"; g.fillText("8", 132, 140); g.fillStyle = "#2a1406"; g.fillText("8", 128, 134);
});
const clothG = new Map<number, THREE.PlaneGeometry>();
export const CuadroVelado3D: React.FC<UP> = ({ d, p }) => {
  const paint = useImg(p.img, 0), aP = sec(p, "pintor", 2.2), W = 1.3, Hh = 0.86;
  return <U3 d={d} bg={p.bg} floor="wood" wall="wood" mode="iris" key1={[-1.4, 2.2, 1.8]}
    cam={{ at: [0, 0.72, -1.5], az: [-0.3, 0.12], el: [0.06, 0.02], r: [3.0, 2.45], fov: 32 }}>{(tt) => {
    const lift = eio(tt, aP - 0.4, Math.max(aP + 4.2, d / 30 * 0.62)), sweep = cl((tt - Math.max(aP + 4.2, d / 30 * 0.62) + 1.2) / 2.4), sw = Math.sin(tt * 2.1) * 0.12 * (1 - 0.5 * lift);
    const fr = Math.round(tt * 30), key = Math.round(lift * 60) * 1000 + (fr % 64);
    let g = clothG.get(key);
    if (!g) {
      g = new THREE.PlaneGeometry(W + 0.08, Hh + 0.08, 36, 26); const pos = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); const L = -Hh / 2 - 0.06 + lift * (Hh + 0.2) * 1.1 + 0.22 * lift * (x / W);
        let ny = y, nz = 0.03 + 0.012 * Math.sin(x * 9 + fr * 0.08) * Math.cos(y * 7);
        if (y < L) { ny = 2 * L - y; nz = 0.05 + (L - y) * 0.35 + 0.02 * Math.sin(x * 11 + fr * 0.1); }
        pos.setXYZ(i, x, ny, nz); }
      pos.needsUpdate = true; g.computeVertexNormals(); if (clothG.size > 400) clothG.clear(); clothG.set(key, g);
    }
    return <>
      {/* marco dorado */}
      <group position={[0, 0.85, -1.56]}>
        {[[0, Hh / 2 + 0.05, W + 0.2, 0.1], [0, -Hh / 2 - 0.05, W + 0.2, 0.1], [-W / 2 - 0.05, 0, 0.1, Hh + 0.2], [W / 2 + 0.05, 0, 0.1, Hh + 0.2]].map(([x, y, w, h], i) => <RBox key={i} s={[w, h, 0.07]} r={0.02} p={[x, y, 0.03]}>{M.brass({ col: "#c99a46" })}</RBox>)}
        <mesh position={[0, 0, 0.01]}><planeGeometry args={[W, Hh]} />{paint ? <meshStandardMaterial map={paint} roughness={0.7} emissive="#ffffff" emissiveMap={paint} emissiveIntensity={0.12 + 0.5 * Math.sin(PI * sweep)} /> : M.matte({ col: "#3a2a1a" })}</mesh>
        {/* la tela: se pliega hacia arriba desde la esquina, y al final sale por arriba */}
        <mesh geometry={g} position={[0, lift > 0.98 ? (lift - 0.98) * 30 : 0, 0.01]} castShadow><meshPhysicalMaterial color="#6e1c22" roughness={0.75} sheen={1} sheenColor="#ff9a8a" sheenRoughness={0.4} side={THREE.DoubleSide} /></mesh>
        {/* la cuerda que tira de la esquina */}
        <mesh geometry={tubeG("cuerda" + Math.round(lift * 40), [[W / 2 + 0.04, -Hh / 2 + lift * (Hh + 0.3) * 1.1, 0.08], [W / 2 + 0.2, Hh / 2 + 0.4, 0.1], [W / 2 + 0.25, 1.8, 0.1]], 0.008, 30, 6)}>{M.matte({ col: "#c9a46a" })}</mesh>
        {/* la chapa del 8 que cuelga del marco y se hamaca */}
        <group position={[0, -Hh / 2 - 0.1, 0.06]} rotation={[0, 0, sw]}>
          {[-0.08, 0.08].map((x, i) => <mesh key={i} position={[x * 0.6, -0.08, 0]} rotation={[0, 0, -x * 2]}><cylinderGeometry args={[0.004, 0.004, 0.17, 6]} />{M.matte({ col: "#3a2a1a" })}</mesh>)}
          <RBox s={[0.26, 0.26, 0.03]} r={0.02} p={[0, -0.2, 0]}><meshStandardMaterial map={ochoT()} roughness={0.8} /></RBox>
        </group>
      </group>
      {/* la luz que barre el cuadro cuando se destapa: siempre montada, en rampa */}
      <spotLight position={[lerp(-1.6, 1.6, sweep), 1.9, -0.4]} target-position={[0, 0.85, -1.56]} angle={0.35} penumbra={0.9} intensity={10 * Math.sin(PI * sweep)} distance={4} color="#ffe2b0" />
    </>;
  }}</U3>;
};

// ---- MarcaCuadrilla · «se volvieron a romper… Los Amigos del Rey Keops»: un bloque de caliza con luz rasante; un pincel de ocre pinta
// el cartucho de la cuadrilla trazo a trazo; al nombrarla, la traducción aparece tallada en la piedra ----
const STROKES: number[][][] = [
  [[-0.3, 0.12], [0.3, 0.12], [0.36, 0.06], [0.36, -0.06], [0.3, -0.12], [-0.3, -0.12], [-0.36, -0.06], [-0.36, 0.06], [-0.3, 0.12]],
  [[-0.28, -0.03], [-0.25, 0.0], [-0.22, -0.03], [-0.19, 0.0], [-0.16, -0.03], [-0.13, 0.0], [-0.1, -0.03]],
  [[-0.04, -0.08], [-0.04, 0.08], [0.0, 0.05]],
  [[0.06, 0.05], [0.1, 0.08], [0.14, 0.05], [0.1, 0.02], [0.06, 0.05]], [[0.1, 0.02], [0.1, -0.08]], [[0.06, -0.02], [0.14, -0.02]],
  [[0.22, 0.03], [0.26, 0.07], [0.3, 0.03], [0.26, -0.01], [0.22, 0.03]], [[0.26, 0.03], [0.26, 0.03]],
];
const markT = (k: number) => tex.text("marca" + k, 1024, 512, (g) => {
  g.clearRect(0, 0, 1024, 512); g.strokeStyle = "#a8321e"; g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = 22;
  const tot = STROKES.length, kk = k / 40 * tot;
  STROKES.forEach((st, i) => { const u = cl(kk - i); if (u <= 0) return; g.beginPath(); const n = st.length - 1; st.forEach(([x, y], j) => { if (j / Math.max(n, 1) > u + 1e-6) return; const X = 512 + x * 1300, Y = 256 - y * 1300; j ? g.lineTo(X, Y) : g.moveTo(X, Y); }); if (st.length === 2 && st[0][0] === st[1][0] && st[0][1] === st[1][1]) { g.arc(512 + st[0][0] * 1300, 256, 16, 0, 7); g.fillStyle = "#a8321e"; g.fill(); } g.stroke(); });
});
const carveT = (q: number) => tex.text("carveP" + q, 1024, 160, (g) => { g.clearRect(0, 0, 1024, 160); g.save(); g.beginPath(); g.rect(0, 0, 1024 * q / 20, 160); g.clip(); g.font = "italic 900 54px Georgia"; g.textAlign = "center";
  for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(${150 + 10 * rn(k, 1)},${38 + 8 * rn(k, 2)},20,${0.28 + 0.1 * rn(k, 3)})`; g.fillText("LOS AMIGOS DEL REY KEOPS", 512 + (rn(k, 4) - 0.5) * 5, 100 + (rn(k, 5) - 0.5) * 4); }
  for (let i = 0; i < 14; i++) { const x = 70 + rn(i, 6) * 880; if (x < 1024 * q / 20) { g.fillStyle = "rgba(150,40,20,.55)"; g.fillRect(x, 104, 3, 14 + 26 * rn(i, 7)); } } g.restore(); });
export const MarcaCuadrilla3D: React.FC<UP> = ({ d, p }) => {
  const aA = sec(p, "amigos", 3.4), p0 = 0.5, p1 = aA - 0.2;
  return <U3 d={d} bg={p.bg} ground={[150, 126, 92]} mode="wipe" key1={[-2.2, 1.0, 0.8]}
    cam={{ at: [0, 0.38, 0], az: [-0.42, 0.14], el: [0.2, 0.08], r: [2.1, 1.65], fov: 30 }}>{(tt) => {
    const k = cl((tt - p0) / (p1 - p0)), kq = Math.round(k * 40), carve = eio(tt, aA - 0.2, aA + 1.6);
    const si = Math.min(STROKES.length - 1, Math.floor(k * STROKES.length)), st = STROKES[si], u = cl(k * STROKES.length - si), j = Math.min(st.length - 1, Math.floor(u * (st.length - 1)));
    const a0 = st[j], a1 = st[Math.min(st.length - 1, j + 1)], uu = u * (st.length - 1) - j, bx = lerp(a0[0], a1[0], uu), by = lerp(a0[1], a1[1], uu);
    const brushOut = eio(tt, p1, p1 + 0.6);
    return <>
      <RBox s={[1.2, 0.72, 0.7]} r={0.03} p={[0, 0.36, 0]}><meshStandardMaterial map={rockT("caliza", [206, 192, 160], 1, 1)} roughness={0.9} bumpMap={rockT("caliza", [206, 192, 160], 1, 1)} bumpScale={0.6} /></RBox>
      <mesh position={[0, 0.42, 0.352]}><planeGeometry args={[1.0, 0.5]} /><meshStandardMaterial map={markT(kq)} transparent roughness={0.95} depthWrite={false} /></mesh>
      <mesh position={[0, 0.17, 0.352]}><planeGeometry args={[1.0, 0.156]} /><meshStandardMaterial map={carveT(Math.round(carve * 20))} transparent roughness={0.95} depthWrite={false} /></mesh>
      {/* el pincel: caña + cerdas cargadas de ocre */}
      <group position={[bx * 0.77 + 0.02, 0.42 + by * 0.77 + 0.05 + brushOut * 0.6, 0.39 + 0.02 * Math.sin(tt * 9)]} rotation={[0.5, 0, -0.5 - 0.2 * brushOut]}>
        <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.02, 0.024, 0.34, 14]} /><meshStandardMaterial map={tex.wood(1, 1, [170, 140, 90])} roughness={0.7} /></mesh>
        <mesh position={[0, 0.035, 0]} castShadow><cylinderGeometry args={[0.026, 0.02, 0.04, 14]} />{M.brass({ col: "#8a6a3a" })}</mesh>
        <mesh position={[0, -0.01, 0]} rotation={[PI, 0, 0]} castShadow><coneGeometry args={[0.03, 0.07, 14]} />{M.matte({ col: "#5a3a22" })}</mesh>
        <mesh position={[0, -0.04, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.016, 0.02, 12]} />{M.matte({ col: "#9a2a16" })}</mesh>
      </group>
      {/* el cuenco de ocre al costado del bloque */}
      <mesh position={[0.78, 0.04, 0.3]} castShadow><cylinderGeometry args={[0.1, 0.07, 0.08, 28]} /><meshStandardMaterial color="#a77a52" roughness={0.8} /></mesh>
      <mesh position={[0.78, 0.075, 0.3]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.085, 28]} />{M.matte({ col: "#a8321e" })}</mesh>
    </>;
  }}</U3>;
};

// ---- MontanaQueso · «El plan es este: galerías y galerías… sueltan un torrente… se desploma» (ruina montium): la montaña cortada al medio,
// las galerías se abren en el corte, el agua del canal las llena de abajo arriba y la montaña se hunde en bloques con polvo ----
const HOLES = [[150, 380], [260, 400], [370, 380], [200, 300], [320, 300], [250, 220], [180, 150], [330, 160], [260, 90], [120, 250], [400, 250], [260, 330]]
  .map(([x, y]) => [(x / 512 - 0.5) * 1.5, 0.5 - y / 512 * 0.95]);
const faceG = new Map<number, THREE.ExtrudeGeometry>();
const strataT = () => { const t = tex.text("strata", 256, 512, (g) => { const C = ["#b8623a", "#c98a5a", "#9a4a2e", "#d8a674", "#a8583a", "#7e3e26"]; for (let i = 0; i < 16; i++) { g.fillStyle = C[i % 6]; g.fillRect(0, i * 32, 256, 32); }
  for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(40,20,10,${0.08 + 0.1 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 512, 2 + rn(i, 4) * 3, 2); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); return t; };
const cutFace = (gk: number) => { let g = faceG.get(gk); if (!g) {
  const sh = new THREE.Shape([new THREE.Vector2(-0.95, -0.5), new THREE.Vector2(0.95, -0.5), new THREE.Vector2(0, 0.5)]);
  HOLES.slice(0, gk).forEach(([x, y]) => { const h = new THREE.Path(); h.absellipse(x, y, 0.07, 0.042, 0, PI * 2, true, 0); sh.holes.push(h); });
  g = new THREE.ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: false, curveSegments: 18 }); g.translate(0, 0, -0.28); faceG.set(gk, g); } return g; };
export const MontanaQueso3D: React.FC<UP> = ({ d, p }) => {
  const aG = sec(p, "galerias", 1.2), aW = sec(p, "agua", 4), aC = sec(p, "cae", 6.5);
  return <U3 d={d} bg={p.bg} ground={[120, 100, 70]} mode="iris" key1={[-2.4, 2.6, 0.6]}
    cam={{ at: [0, 0.42, 0], az: [-1.15, -1.45], el: [0.16, 0.1], r: [2.6, 2.2], fov: 32 }}>{(tt) => {
    const gk = Math.round(12 * cl((tt - aG) / 1.6)), wk = Math.round(12 * cl((tt - aW) / Math.max(1, aC - aW - 0.2))), fall = eio(tt, aC, aC + 1.4), shake = (tt > aC - 0.5 && tt < aC + 1.4 ? 0.012 * Math.sin(tt * 47) : 0);
    const flow = cl((tt - aW + 0.3) / 0.6), crack = cl((tt - aC + 1.2) / 1.0);
    return <>
      {/* media montaña: medio cono de tierra roja + la cara del corte con las galerías */}
      <group position={[shake, -fall * 0.55, 0]} scale={[1, 1 - 0.55 * fall, 1]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow><coneGeometry args={[0.95, 1.0, 64, 8, true, 0, PI]} /><meshStandardMaterial map={strataT()} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <group position={[0, 0.5, 0]} rotation={[0, -PI / 2, 0]}>
          <mesh geometry={cutFace(gk)} castShadow receiveShadow><meshStandardMaterial map={strataT()} roughness={0.92} /></mesh>
          {/* fondo oscuro de las galerías y el agua que las llena de abajo arriba */}
          <mesh position={[0, 0, -0.27]} scale={0.97}><shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-0.95, -0.5), new THREE.Vector2(0.95, -0.5), new THREE.Vector2(0, 0.5)])]} /><meshBasicMaterial color="#160b06" /></mesh>
          {HOLES.slice(0, gk).map(([x, y], i) => { const wet = cl((wk / 12) * 1.35 - (0.5 - y)); return <mesh key={i} position={[x, y - 0.042 + 0.042 * wet, -0.14]} scale={[1, Math.max(0.02, wet), 1]}><boxGeometry args={[0.13, 0.084, 0.26]} />{M.water({ op: 0.8 * cl(wet * 4) })}</mesh>; })}
          {/* las rajaduras que avisan antes de caer */}
          {[[-0.2, 0.05, 0.9], [0.25, -0.1, -0.7], [0.0, 0.25, 0.2]].map(([x, y, r], i) => <mesh key={i} position={[x, y, 0.003]} rotation={[0, 0, r]} scale={[1, Math.max(0.01, crack), 1]}><planeGeometry args={[0.012, 0.5]} /><meshBasicMaterial color="#120804" /></mesh>)}
        </group>
        {/* castaños en la ladera */}
        {Array.from({ length: 9 }, (_, i) => { const a = 0.2 + rn(i, 1) * (PI - 0.4), r = 0.35 + rn(i, 2) * 0.5, y = 1 - r / 0.95; return <mesh key={i} position={[Math.sin(a) * r, y * 1.0 + 0.02, Math.cos(a) * r]} castShadow><sphereGeometry args={[0.05 + 0.03 * rn(i, 3), 12, 10]} />{M.matte({ col: "#2f5a2a" })}</mesh>; })}
      </group>
      {/* el canal de agua que baja por detrás y entra en la montaña */}
      <mesh geometry={tubeG("canal", [[1.2, 1.5, -1.4], [0.8, 1.15, -0.9], [0.4, 0.85, -0.4], [0.05, 0.4, 0.0]], 0.035, 80, 12)}>{M.water({ op: 0.75 * flow })}</mesh>
      {/* piedras que ruedan por la ladera al hundirse */}
      {Array.from({ length: 9 }, (_, i) => { const k = cl((tt - aC - 0.1 * i) / 1.3); if (k <= 0) return null; const a = 0.3 + rn(i, 7) * 2.4, r = lerp(0.2, 1.25, k);
        return <mesh key={i} position={[Math.sin(a) * r, Math.max(0.05, 0.85 * (1 - k) - 0.1 * k), Math.cos(a) * r]} rotation={[k * 6, k * 4, 0]} castShadow><dodecahedronGeometry args={[0.05 + 0.04 * rn(i, 8), 0]} /><meshStandardMaterial map={rockT("monte", [150, 76, 40], 1, 1)} roughness={0.95} /></mesh>; })}
      {/* el polvo del derrumbe: bolas que suben y se abren (sin aparecer de golpe) */}
      {Array.from({ length: 22 }, (_, i) => { const k = cl((tt - aC - 0.2 - rn(i, 1) * 0.5) / 1.6); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 2, 0.15 + k * (0.5 + rn(i, 3) * 0.6), 0.1 + (rn(i, 4) - 0.5) * 0.8]} scale={0.08 + k * (0.3 + 0.2 * rn(i, 5))}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#a89480" roughness={1} transparent opacity={0.22 * Math.sin(PI * k)} depthWrite={false} /></mesh>; })}
    </>;
  }}</U3>;
};

// ---- HiloTierra · «un hilito de tierra… se corre»: el túnel con dos puntales; la vela alumbra; del techo cae un hilito de granos que
// arma un montoncito; cuando «se corre», el chorro engorda, la viga cede y la llama se acuesta ----
export const HiloTierra3D: React.FC<UP> = ({ d, p }) => {
  const aH = sec(p, "hilo", 1.2), aR = sec(p, "corre", 4.5);
  return <U3 d={d} bg={p.bg} floor="none" sky="#0d0907" mode="iris" key1={[-0.8, 1.6, 1.4]} warm={0.35}
    cam={{ at: [0.0, 0.42, 0.1], az: [-0.3, 0.08], el: [0.14, 0.06], r: [1.75, 1.35], fov: 36 }}>{(tt) => {
    const run0 = eio(tt, aR, aR + 0.8), run = run0, mid = eio(tt, (aH + aR) / 2, (aH + aR) / 2 + 0.6), rate = (tt > aH ? 1 : 0) + 3 * run, pile = cl((tt - aH) / 6) * 0.06 + 0.07 * run * cl((tt - aR) / 2), sag = 0.09 * run, lean = 0.5 * run;
    const flick = 0.08 * Math.sin(tt * 2 * PI * 1.3) + 0.04 * Math.sin(tt * 2 * PI * 0.7);
    return <>
      <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[4, 4]} /><meshStandardMaterial map={rockT("suelo", [92, 60, 40], 3, 3)} roughness={1} /></mesh>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.95, 0.95, 4, 40, 1, true, PI * 0.15, PI * 1.7]} /><meshStandardMaterial map={rockT("tunel", [110, 64, 40], 4, 3)} roughness={1} side={THREE.BackSide} /></mesh>
      {/* dos puntales con su viga; la viga del fondo cede */}
      {[[-0.45, 0.2], [0.45, -0.5]].map(([x, z], i) => <group key={i} position={[0, 0, z]}>
        {[-0.42, 0.42].map((px, j) => <mesh key={j} position={[px, 0.42, 0]} rotation={[0, 0, i === 0 && j === 1 ? -0.16 * run : 0]} castShadow><cylinderGeometry args={[0.035, 0.04, 0.84, 14]} /><meshStandardMaterial map={tex.wood(1, 2, [120, 82, 48])} roughness={0.8} /></mesh>)}
        <mesh position={[0, 0.86 - (i === 0 ? sag : 0), 0]} rotation={[0, 0, PI / 2 + (i === 0 ? 0.02 * run : 0)]} castShadow><cylinderGeometry args={[0.04, 0.04, 1.0, 14]} /><meshStandardMaterial map={tex.wood(1, 2, [120, 82, 48])} roughness={0.8} /></mesh>
      </group>)}
      {/* el hilito: granos que caen del techo en fila y rebotan en el montón */}
      {Array.from({ length: 140 }, (_, i) => { const ph = ((tt * (0.9 + 0.5 * run) + i / 140) % 1), on = rn(i, 1) < cl(rate / 4) * 0.9 + 0.1 * (tt > aH ? 1 : 0); if (!on || tt < aH) return null; return <mesh key={i} position={[0.06 + (rn(i, 2) - 0.5) * 0.02 * (1 + 2 * run), 0.92 - ph * (0.92 - pile), 0.2 + (rn(i, 3) - 0.5) * 0.02]}><sphereGeometry args={[0.005 + 0.004 * rn(i, 4), 6, 5]} /><meshStandardMaterial color="#b9875a" roughness={0.95} /></mesh>; })}
      {/* el chorro sólido que aparece y engorda */}
      <mesh position={[0.06, (0.92 + pile) / 2, 0.2]} scale={[0.3 + 0.7 * mid + 1.6 * run, 1, 0.3 + 0.7 * mid + 1.6 * run]}><cylinderGeometry args={[0.009, 0.012, 0.92 - pile, 12]} /><meshStandardMaterial color="#c08a58" roughness={0.9} transparent opacity={0.85 * mid} depthWrite={false} /></mesh>
      <mesh position={[0.06, 0, 0.2]} scale={[1, Math.max(0.001, pile / 0.1), 1]} castShadow><coneGeometry args={[0.09 + 0.6 * pile, 0.1, 28]} /><meshStandardMaterial map={rockT("arena", [176, 122, 76], 1, 1)} roughness={1} /></mesh>
      {/* la vela: cuerpo de cera, llama que se acuesta cuando la tierra se corre, luz siempre montada */}
      <mesh position={[-0.16, 0.06, 0.32]} castShadow><cylinderGeometry args={[0.022, 0.024, 0.12, 16]} />{M.porcelain({ col: "#efe3c4" })}</mesh>
      <mesh position={[-0.16 + 0.02 * lean, 0.15, 0.32]} rotation={[0, 0, -lean]} scale={[1, 1 + flick, 1]}><sphereGeometry args={[0.014, 12, 10]} />{M.glow({ col: "#ffcf7a" })}</mesh>
      <pointLight position={[-0.12, 0.22, 0.32]} intensity={2.2 * (1 + flick)} distance={2.6} color="#ffb060" castShadow />
    </>;
  }}</U3>;
};

// ---- RitmoPisones · «Todos al mismo tiempo… se sale del ritmo»: seis pisones de madera con cabeza de piedra en el cajón de tierra;
// golpean juntos y levantan polvo; uno llega tarde y la luz lo encuentra ----
export const RitmoPisones3D: React.FC<UP> = ({ d, p }) => {
  const aF = sec(p, "fuera", 4.5);
  return <U3 d={d} bg={p.bg} ground={[140, 104, 70]} mode="split" key1={[-1.5, 2.4, 1.2]}
    cam={{ at: [0.0, 0.38, 0], az: [-0.42, -0.2], el: [0.2, 0.15], r: [2.9, 2.6], fov: 34 }}>{(tt) => {
    const beat = 1.1, late = cl((tt - aF + 0.6) / 0.4) * 0.5, glow = eio(tt, aF - 0.2, aF + 0.4);
    const ram = (i: number) => { const ph = ((tt + (i === 4 ? late : 0)) / beat) % 1; return ph < 0.7 ? eio(ph, 0, 0.7) * 0.32 : 0.32 * (1 - cl((ph - 0.7) / 0.12)); };
    return <>
      {/* el cajón de tablas con la tierra adentro */}
      <RBox s={[2.2, 0.16, 0.5]} r={0.01} p={[0, 0.08, 0]}><meshStandardMaterial map={rockT("tierra", [160, 112, 70], 3, 1)} roughness={1} /></RBox>
      {[-0.27, 0.27].map((z, i) => <RBox key={i} s={[2.3, 0.26, 0.03]} r={0.008} p={[0, 0.13, z]}>{M.wood({ base: [138, 98, 58], rx: 4 })}</RBox>)}
      {Array.from({ length: 6 }, (_, i) => { const x = -0.9 + i * 0.36, y = ram(i), hit = y < 0.02; return <group key={i}>
        <group position={[x, 0.18 + y, 0]}>
          <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.11, 0.12, 0.13, 24]} /><meshStandardMaterial map={rockT(i === 4 ? "cabezaR" : "cabeza", i === 4 ? [168, 70, 44] : [120, 116, 110], 1, 1)} roughness={0.85} /></mesh>
          <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.028, 0.028, 0.84, 12]} /><meshStandardMaterial map={tex.wood(1, 2, [150, 108, 64])} roughness={0.75} /></mesh>
        </group>
        {/* polvo del golpe (anillo que se abre) */}
        {(() => { const ph = (((tt + (i === 4 ? late : 0)) / beat) % 1), k = cl((ph - 0.82) / 0.18); return k > 0 && k < 1 ? <mesh position={[x, 0.165, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.08 + 0.1 * k, 0.1 + 0.16 * k, 32]} /><meshBasicMaterial color="#d9b48a" transparent opacity={0.55 * (1 - k)} depthWrite={false} /></mesh> : null; })()}
        {/* nube de polvo que se levanta en cada golpe */}
        {(() => { const ph = (((tt + (i === 4 ? late : 0)) / beat) % 1), k = cl((ph - 0.78) / 0.22); return k > 0 && k < 1 ? Array.from({ length: 8 }, (_, j) => <mesh key={j} position={[x + (rn(j, i + 1) - 0.5) * 0.25 * (0.4 + k), 0.18 + 0.12 * k * rn(j, 9), (rn(j, i + 7) - 0.5) * 0.25 * (0.4 + k)]} scale={0.05 + 0.1 * k}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#d8bc96" roughness={1} transparent opacity={0.6 * (1 - k)} depthWrite={false} /></mesh>) : null; })()}
      </group>; })}
      {/* la luz cálida que encuentra al que se salió del ritmo (siempre montada, en rampa) */}
      <spotLight position={[-0.9 + 4 * 0.36, 1.8, 0.6]} target-position={[-0.9 + 4 * 0.36, 0.2, 0]} angle={0.16} penumbra={0.7} intensity={14 * glow} distance={3} color="#ffb070" />
    </>;
  }}</U3>;
};

// ---- CadenaRelevos · «Los tamemes se pasaban la carga… en relevos»: seis cargadores de arcilla en diagonal por el camino;
// el mismo fardo vuela de espalda en espalda en arco, con peso, del pueblo de origen al de destino ----
export const CadenaRelevos3D: React.FC<UP> = ({ d, p }) => {
  const aR = Math.min(sec(p, "relevos", 1.0), 0.9), N = 6, P = Array.from({ length: N }, (_, i) => [-1.4 + i * 0.56, 0, 0.5 - i * 0.22]);
  return <U3 d={d} bg={p.bg} ground={[150, 112, 76]} mode="wipe" key1={[-1.6, 2.6, 1.6]}
    cam={{ at: [-0.5, 0.45, 0.2], at1: [0.6, 0.45, -0.25], az: [0.4, 0.25], el: [0.2, 0.15], r: [3.3, 3.0], fov: 34 }}>{(tt) => {
    const per = Math.max(0.7, (d / 30 - aR - 1.2) / (N - 1)), seg = Math.max(0, Math.min(N - 2, Math.floor((tt - aR) / per))), u = cl((tt - aR - seg * per) / (per * 0.6));
    const a = P[seg], b = P[seg + 1], arc = Math.sin(PI * u) * 0.35, bx = lerp(a[0], b[0], eio(u, 0, 1)), bz = lerp(a[2], b[2], eio(u, 0, 1)), by = 0.8 + arc;
    const holder = u < 0.02 ? seg : u > 0.98 ? seg + 1 : -1;
    return <>
      {/* el camino de tierra */}
      <mesh geometry={tubeG("camino", P.map(([x, , z]) => [x, 0.002, z]), 0.16, 60, 2)} scale={[1, 0.02, 1]}>{M.matte({ col: "#9b7650" })}</mesh>
      {P.map(([x, , z], i) => <group key={i} position={[x, 0, z]}>
        <Stickman escala={0.22} rotY={70} guion={[{ t: 0, accion: "cargar_caja" }]} semilla={i + 3} contacto={0.5} colorContacto="#2a1a10" />
      </group>)}
      {/* el fardo de cacao con la banda del mecapal */}
      <group position={[bx, by, bz]} rotation={[0.2 * Math.sin(PI * u), u * 0.8, 0]}>
        <RBox s={[0.26, 0.2, 0.2]} r={0.04}><meshStandardMaterial map={tex.wood(1, 1, [176, 140, 92])} roughness={0.9} /></RBox>
        <mesh rotation={[0, 0, PI / 2]}><torusGeometry args={[0.13, 0.012, 8, 30]} />{M.matte({ col: "#5a3a20" })}</mesh>
      </group>
      {holder >= 0 && null}
      {/* los dos pueblos: casas de adobe con techo de paja y humo, en los extremos del camino */}
      {[[-2.05, 0.85], [2.05, -0.95]].map(([x, z], i) => <group key={i} position={[x, 0, z]}>
        {Array.from({ length: 5 }, (_, j) => { const hx = (j % 3) * 0.36 - 0.36, hz = Math.floor(j / 3) * 0.4 - 0.2, hh = 0.24 + 0.06 * rn(j + i * 5, 1); return <group key={j} position={[hx, 0, hz]}>
          <RBox s={[0.3, hh, 0.28]} r={0.02} p={[0, hh / 2, 0]}><meshStandardMaterial map={dirtT(i ? [214, 196, 160] : [200, 168, 122])} roughness={1} /></RBox>
          <mesh position={[0, hh + 0.09, 0]} rotation={[0, PI / 4, 0]} castShadow><coneGeometry args={[0.25, 0.18, 4]} /><meshStandardMaterial color="#9a7a3e" roughness={0.95} /></mesh>
          <mesh position={[0, hh * 0.35, 0.141]}><planeGeometry args={[0.07, 0.12]} /><meshStandardMaterial color="#2a1a10" /></mesh>
        </group>; })}
        {Array.from({ length: 6 }, (_, j) => { const k = ((tt * 0.25 + j / 6) % 1); return <mesh key={j} position={[0.1 * Math.sin(k * 5 + j), 0.5 + k * 0.9, 0.1 * k]} scale={0.05 + 0.1 * k}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#cfc8be" roughness={1} transparent opacity={0.35 * Math.sin(PI * k)} depthWrite={false} /></mesh>; })}
      </group>)}
    </>;
  }}</U3>;
};
