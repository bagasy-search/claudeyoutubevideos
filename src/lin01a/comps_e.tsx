// lin01a · LOTE E: libreta (19:50, 5 tramos) · pregunta (20:58, 6 tramos) · tsa (21:46) · mapa (23:19) · postal (23:49).
// Mismas reglas: objeto físico con material real y sombra de contacto, el clip del momento hundido detrás (Stage), cámara en
// curva, golpe en la palabra exacta, texto ≤5 palabras DENTRO del objeto.
import React from "react";
import * as THREE from "three";
import { Stage, at } from "./base";
import { HAND, Esc, M, RBox, camA, canv, cl, fabricTex, leatherTex, lerp, printTex, rn, spr, tubeG, useImg, Ready, Blob, Sombra, geo } from "./k3d";
import { Lentes } from "./comps_c";
import type { Fi } from "./valija";

// escritura a mano en varias líneas que se va escribiendo (p 0..1); papel crema rayado con margen rojo
const nota = (key: string, lines: string[], p: number, opts: { size?: number; extra?: (g: CanvasRenderingContext2D) => void } = {}) => {
  const q = Math.round(cl(p) * 30) / 30, ready = typeof document !== "undefined" && document.fonts.check(`700 40px "${HAND}"`);
  return canv(`nota|${key}|${q}|${ready}`, 512, 720, (g) => {
    g.fillStyle = "#f1e8d2"; g.fillRect(0, 0, 512, 720);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(140,110,70,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 720, 2, 2); }
    g.strokeStyle = "rgba(110,135,175,.35)"; g.lineWidth = 2; for (let y = 120; y < 720; y += 52) { g.beginPath(); g.moveTo(24, y); g.lineTo(500, y); g.stroke(); }
    g.strokeStyle = "rgba(200,70,70,.4)"; g.beginPath(); g.moveTo(64, 0); g.lineTo(64, 720); g.stroke();
    opts.extra?.(g);
    const sz = opts.size ?? 108; g.font = `700 ${sz}px "${HAND}"`; g.textBaseline = "alphabetic"; g.fillStyle = "#1d2a4a";
    const tot = lines.reduce((s, l) => s + l.length, 0); let left = q * tot;
    lines.forEach((l, i) => {
      const n = Math.min(l.length, Math.max(0, left)); left -= l.length; if (n <= 0) return;
      const w = g.measureText(l).width, x0 = 256 - w / 2, y = 230 + i * (sz * 1.12);
      g.save(); g.beginPath(); g.rect(0, y - sz * 1.2, n >= l.length ? 512 : x0 + w * (n / l.length) + 2, sz * 1.7); g.clip(); g.fillText(l, x0, y); g.restore();
    });
  });
};

// ═════════ LIBRETA: la libreta de cuero de Marguerite sobre la mesita rebatible del asiento. Al entrar se da vuelta una hoja;
// en la palabra, la regla se escribe a mano en la página derecha. Al lado, el objeto de esa regla. Al salir, la tapa se cierra. ═════════
const REGLAS: { l: string[]; sz?: number }[] = [{ l: ["never", "white"], sz: 140 }, { l: ["must kneel", "in it"], sz: 74 }, { l: ["no dangling", "earrings"], sz: 100 }, { l: ["sunglasses", "not on", "your head"], sz: 78 }, { l: ["always", "a pen"], sz: 140 }];
const izq = () => canv("libIzq", 512, 720, (g) => {   // página izquierda: anotaciones viejas y el aro de café
  g.fillStyle = "#efe5cd"; g.fillRect(0, 0, 512, 720);
  for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(140,110,70,${0.06 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 720, 2, 2); }
  g.strokeStyle = "rgba(110,135,175,.35)"; g.lineWidth = 2; for (let y = 120; y < 720; y += 52) { g.beginPath(); g.moveTo(24, y); g.lineTo(500, y); g.stroke(); }
  g.strokeStyle = "rgba(29,42,74,.55)"; g.lineWidth = 3; g.lineCap = "round";
  for (let r = 0; r < 9; r++) { const y = 112 + r * 52, L = 180 + 240 * rn(r, 4); g.beginPath(); g.moveTo(60, y); for (let x = 60; x < 60 + L; x += 9) g.lineTo(x, y - 10 + 7 * Math.sin(x * 0.21 + r) * rn(x, r)); g.stroke(); }
  const ring = (x: number, y: number, R: number, a: number) => { g.strokeStyle = `rgba(120,72,30,${a})`; g.lineWidth = 7; g.beginPath(); g.arc(x, y, R, 0.3, 5.9); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(x + 3, y + 2, R - 6, 0, 6.3); g.stroke(); };
  ring(350, 560, 78, 0.32); ring(330, 590, 74, 0.12);
});
const lomo = () => canv("libLomo", 256, 256, (g) => { const gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.42, "rgba(0,0,0,.35)"); gr.addColorStop(0.5, "rgba(0,0,0,.55)"); gr.addColorStop(0.58, "rgba(0,0,0,.35)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
const bandejaTex = () => canv("trayTex", 512, 512, (g) => {
  g.fillStyle = "#9aa0a6"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 12000; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,255,255" : "30,34,38"},${0.07 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 512, 1.5, 1.5); }
  for (let i = 0; i < 30; i++) { g.strokeStyle = `rgba(255,255,255,${0.06 + 0.06 * rn(i, 5)})`; g.lineWidth = 1; g.beginPath(); const x = rn(i, 6) * 512, y = rn(i, 7) * 512; g.moveTo(x, y); g.lineTo(x + 60 * rn(i, 8), y + 20 * (rn(i, 9) - 0.5)); g.stroke(); }
});
const Pluma: React.FC = () => <group>
  <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0055, 0.0055, 0.13, 20]} /><meshPhysicalMaterial color="#14213d" roughness={0.25} clearcoat={1} /></mesh>
  <mesh position={[0.072, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.0055, 0.016, 20]} />{M.brass()}</mesh>
  <mesh position={[-0.066, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.0058, 0.0058, 0.008, 20]} />{M.brass()}</mesh>
  <RBox s={[0.05, 0.002, 0.003]} r={0.001} p={[-0.04, 0.007, 0]}>{M.brass()}</RBox>
</group>;
const Hebilla: React.FC = () => <group>
  <mesh position={[-0.075, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.09, 0.042]} /><meshStandardMaterial color="#5c6470" roughness={0.75} map={fabricTex("navy", [2, 0.5])} /></mesh>
  <RBox s={[0.07, 0.008, 0.05]} r={0.006} p={[0, 0.005, 0]}>{M.chrome({ col: "#d8dde2" })}</RBox>
  <RBox s={[0.035, 0.004, 0.03]} r={0.003} p={[0.005, 0.01, 0]}>{M.steel({ col: "#9aa1a8" })}</RBox>
  <RBox s={[0.05, 0.004, 0.034]} r={0.004} p={[0.055, 0.003, 0]}>{M.chrome()}</RBox>
</group>;
const Aro: React.FC<{ sw: number }> = ({ sw }) => <group rotation={[0, 0, sw]}>
  <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.008, 0.0015, 8, 24]} />{M.brass({ col: "#e6be6a" })}</mesh>
  <mesh position={[0, -0.03, 0]}><cylinderGeometry args={[0.0008, 0.0008, 0.044, 6]} />{M.brass({ col: "#e6be6a" })}</mesh>
  <mesh position={[0, -0.058, 0]} scale={[0.75, 1.5, 0.5]}><sphereGeometry args={[0.008, 20, 14]} /><meshPhysicalMaterial color="#a8d8ef" roughness={0.02} transmission={0.7} thickness={0.01} clearcoat={1} /></mesh>
</group>;
const Vaso: React.FC = () => <group>
  <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.032, 0.024, 0.09, 32, 1, true]} /><meshStandardMaterial color="#f4f1ea" roughness={0.7} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.0325, 0.0285, 0.03, 32, 1, true]} /><meshStandardMaterial color="#8a5a34" roughness={0.9} side={THREE.DoubleSide} /></mesh>
  <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.03, 32]} /><meshPhysicalMaterial color="#3a1e0e" roughness={0.1} clearcoat={1} /></mesh>
  <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.0315, 0.002, 8, 40]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>
</group>;
export const Libreta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, k = f.k ?? 0, wow = f.wow!, R = REGLAS[k];
  const flip = cl((t - a - 0.05) / 0.55), fl = Math.PI * (flip < 0.5 ? 2 * flip * flip : 1 - 2 * (1 - flip) * (1 - flip));
  const write = cl((t - wow) / 0.95), close = cl((t - (b - 0.8)) / 0.5), cz = -Math.PI * close * close;
  const pop = spr(t, wow - 0.05, 1.2, 1.4);
  const cam = camA(t, a, b, { p: [0.12 - 0.04 * k, 0.6, 0.42], l: [0.0, 0.0, -0.01], fov: 32 }, { p: [-0.06 + 0.03 * k, 0.48, 0.36], l: [0.02, 0.0, -0.01], fov: 32 });
  const pg = (map: THREE.Texture) => <meshStandardMaterial map={map} roughness={0.92} />;
  return <Stage t={t} a={a} b={b} dim={0.72} tint="#ffe4c0">
    <Esc cam={cam} key1={[-0.9, 1.8, 0.9]} warm={1.05}>
      {/* la mesita rebatible: plástico gris texturado, ranura del vaso, borde redondeado */}
      <RBox s={[0.62, 0.02, 0.36]} r={0.02} p={[0.03, -0.012, 0]}><meshStandardMaterial map={bandejaTex()} roughness={0.7} /></RBox>
      <mesh position={[0.25, 0.0, -0.11]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.036, 0.042, 40]} /><meshStandardMaterial color="#7e858c" roughness={0.6} /></mesh>
      <RBox s={[0.62, 0.3, 0.03]} r={0.02} p={[0.03, 0.12, -0.2]} rot={[-0.15, 0, 0]}><meshStandardMaterial map={fabricTex("navy", [2, 1])} color="#5a6f96" roughness={0.9} /></RBox>
      <RBox s={[0.06, 0.016, 0.02]} r={0.006} p={[0.03, 0.2, -0.17]} rot={[-0.15, 0, 0]}>{M.plastic({ col: "#b9bec4" })}</RBox>
      <Blob w={0.4} d={0.3} o={0.45} y={0.0005} />
      {/* la libreta abierta: lomo en x=0 */}
      <group position={[-0.02, 0.0, 0.02]} rotation={[0, 0.06, 0]}>
        <RBox s={[0.136, 0.006, 0.19]} r={0.006} p={[0.068, 0.003, 0]}><meshStandardMaterial map={leatherTex([92, 52, 30], "lib")} roughness={0.6} /></RBox>
        {/* bloque derecho de hojas + página con la regla */}
        <RBox s={[0.124, 0.008, 0.176]} r={0.003} p={[0.066, 0.009, 0]}><meshStandardMaterial color="#e9dfc6" roughness={0.95} /></RBox>
        <mesh position={[0.066, 0.0132, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.122, 0.172]} />{pg(nota("r" + k, R.l, write, { size: R.sz }))}</mesh>
        {/* hoja que se da vuelta al entrar (pivote en el lomo) */}
        {flip > 0 && flip < 1 && <group position={[0, 0.0136, 0]} rotation={[0, 0, fl]}>
          <mesh position={[0.062, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.122, 0.172, 8, 1]} /><meshStandardMaterial color="#efe6cf" roughness={0.95} side={THREE.DoubleSide} /></mesh>
        </group>}
        {/* mitad izquierda (se cierra encima al salir) */}
        <group position={[0, 0.0, 0]} rotation={[0, 0, cz]}>
          <RBox s={[0.124, 0.008, 0.176]} r={0.003} p={[-0.066, 0.009, 0]}><meshStandardMaterial color="#e9dfc6" roughness={0.95} /></RBox>
          <mesh position={[-0.066, 0.0132, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.122, 0.172]} />{pg(izq())}</mesh>
          <RBox s={[0.136, 0.006, 0.19]} r={0.006} p={[-0.068, 0.003, 0]}><meshStandardMaterial map={leatherTex([92, 52, 30], "lib")} roughness={0.6} /></RBox>
        </group>
        <mesh position={[0, 0.0138, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.04, 0.176]} /><meshBasicMaterial map={lomo()} transparent depthWrite={false} /></mesh>
        {/* elástico de la libreta y cinta señaladora */}
        <mesh position={[0.122, 0.014, 0]}><boxGeometry args={[0.004, 0.004, 0.19]} /><meshStandardMaterial color="#2a1a10" roughness={0.6} /></mesh>
        <mesh geometry={tubeG("cinta", [[0.002, 0.014, 0.08], [0.01, 0.013, 0.1], [0.02, 0.006, 0.12], [0.03, 0.001, 0.135]], 0.0025, 30, 6)}><meshStandardMaterial color="#8c1f2a" roughness={0.6} /></mesh>
      </group>
      {/* la pluma cruzada (en «always a pen» se levanta y queda parada) */}
      <group position={[-0.06 + (k === 4 ? 0.12 * pop : 0), 0.02 + (k === 4 ? 0.06 * pop : 0), 0.13]} rotation={[0, 0.5 - (k === 4 ? 0.5 * pop : 0), k === 4 ? 1.35 * pop : 0]}><Pluma /></group>
      {/* el objeto de cada regla, a la derecha */}
      <group position={[0.205, 0, 0.07]} scale={lerp(0.001, 0.8, cl(pop))}>
        {k !== 4 && <Blob w={0.12} d={0.1} o={0.5} />}
        {k === 0 && <group rotation={[0, 0.3, 0]}><Vaso /></group>}
        {k === 1 && <group rotation={[0, -0.4, 0]}><Hebilla /></group>}
        {k === 2 && <group>
          <mesh position={[0, 0.004, 0]} castShadow><cylinderGeometry args={[0.03, 0.034, 0.008, 32]} />{M.brass({ col: "#b98f45" })}</mesh>
          <mesh position={[0, 0.085, 0]} castShadow><cylinderGeometry args={[0.0025, 0.0025, 0.16, 12]} />{M.brass({ col: "#c9a24a" })}</mesh>
          <mesh position={[0, 0.163, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0022, 0.0022, 0.11, 12]} />{M.brass({ col: "#c9a24a" })}</mesh>
        </group>}
        {k === 2 && <group position={[-0.042, 0.163, 0]} scale={2.4}><Aro sw={0.5 * Math.sin((t - wow) * 4) * Math.exp(-(t - wow) * 1.2)} /><group position={[0.035, 0, 0]}><Aro sw={0.4 * Math.sin((t - wow) * 4 + 1) * Math.exp(-(t - wow) * 1.2)} /></group></group>}
        {k === 3 && <group position={[0, 0.012, 0]} rotation={[0, -0.5, 0]} scale={1.6}><Lentes /></group>}
      </group>
      <Sombra w={1.2} d={1} o={0.3} y={0.0008} />
    </Esc>
  </Stage>;
};

// ═════════ PREGUNTA: el panel de servicio sobre el asiento (luces de lectura, ventilación, botón de llamada). En la palabra
// suena el «ding», se enciende el botón y del panel baja la tarjeta con la pregunta escrita a mano. Al salir, sube y se guarda. ═════════
const PREG = ["too casual?", "safety first.", "why so cold?", "shoes off?", "stand up now?", "watch the demo?"];
const panelTex = () => canv("psu", 512, 256, (g) => {
  g.fillStyle = "#d9dbdc"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${rn(i, 1) > 0.5 ? "255,255,255" : "40,40,40"},${0.05 * rn(i, 2)})`; g.fillRect(rn(i, 3) * 512, rn(i, 4) * 256, 1.5, 1.5); }
  g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 3; g.strokeRect(6, 6, 500, 244);
});
const iconTex = (kind: "persona" | "cinto") => canv("ico" + kind, 128, 128, (g) => {
  g.fillStyle = "#0000"; g.clearRect(0, 0, 128, 128); g.fillStyle = "#fff";
  if (kind === "persona") { g.beginPath(); g.arc(64, 36, 16, 0, 6.3); g.fill(); g.beginPath(); g.moveTo(36, 110); g.quadraticCurveTo(38, 60, 64, 58); g.quadraticCurveTo(90, 60, 92, 110); g.closePath(); g.fill(); }
  else { g.lineWidth = 10; g.strokeStyle = "#fff"; g.beginPath(); g.moveTo(20, 64); g.lineTo(48, 64); g.moveTo(80, 64); g.lineTo(108, 64); g.stroke(); g.fillRect(44, 48, 40, 32); }
});
export const Pregunta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, k = f.k ?? 0, wow = f.wow!;
  const ding = spr(t, wow - 0.05, 1.6, 1.3), lit = cl((t - wow + 0.05) / 0.08) * (1 - cl((t - b + 0.3) / 0.3));
  const drop = spr(t, wow + 0.05, 0.75, 1.0) * (1 - cl((t - (b - 0.5)) / 0.42)), write = cl((t - wow - 0.3) / 0.7);
  const ring = cl((t - wow) / 0.6), ring2 = cl((t - wow - 0.25) / 0.6), sway = t > wow ? 0.18 * Math.sin((t - wow) * 4.2) * Math.exp(-(t - wow) * 1.6) : 0;
  const cam = camA(t, a, b, { p: [0.5 - 0.05 * k, -0.62, 1.0], l: [0.02, -0.1, 0], fov: 33 }, { p: [0.26 - 0.03 * k, -0.55, 0.86], l: [0.02, -0.12, 0], fov: 33 });
  const ringM = (q: number) => q > 0 && q < 1 ? <mesh position={[0, 0, 0.012]} scale={0.035 + 0.16 * q}><ringGeometry args={[0.8, 1, 48]} /><meshBasicMaterial color="#ffc04a" transparent opacity={0.95 * (1 - q)} depthWrite={false} toneMapped={false} /></mesh> : null;
  return <Stage t={t} a={a} b={b} dim={1.0} tint="#e8eef6">
    <Esc cam={cam} key1={[-0.6, -0.9, 1.6]} warm={0.9} cool={1.1}>
      <group rotation={[0.25, 0, 0]}>
        {/* el techo de la cabina: fondo, portaequipajes arriba con su traba, tira de luz y el panel encastrado */}
        <RBox s={[1.5, 0.75, 0.04]} r={0.02} p={[0, 0.05, -0.07]}><meshStandardMaterial color="#cdc9c0" roughness={0.6} /></RBox>
        <RBox s={[1.5, 0.22, 0.12]} r={0.05} p={[0, 0.26, 0.0]}><meshStandardMaterial map={panelTex()} color="#e4e1da" roughness={0.45} /></RBox>
        <RBox s={[0.16, 0.035, 0.03]} r={0.012} p={[0.1, 0.165, 0.06]}>{M.plastic({ col: "#8e9196" })}</RBox>
        <mesh position={[0, 0.142, 0.03]}><boxGeometry args={[1.5, 0.008, 0.01]} />{M.glow({ col: "#fff2d8", op: 0.9 })}</mesh>
        <RBox s={[0.74, 0.21, 0.05]} r={0.02} p={[0, 0, -0.025]}><meshStandardMaterial map={panelTex()} roughness={0.55} /></RBox>
        {[-0.24, -0.1].map((x, i) => <group key={x} position={[x, 0.02, 0.004]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.032, 0.012, 32]} />{M.plastic({ col: "#c9cccf" })}</mesh>
          <mesh position={[0, 0, 0.0065]}><circleGeometry args={[0.022, 32]} /><meshPhysicalMaterial color={i === 1 && k === 0 ? "#fff6dc" : "#e9ecef"} emissive="#ffe7b0" emissiveIntensity={i === 1 && k === 0 ? 1.2 : 0} roughness={0.2} clearcoat={1} /></mesh>
          <RBox s={[0.022, 0.016, 0.008]} r={0.004} p={[0, -0.055, 0.003]}>{M.plastic({ col: "#9da3a9" })}</RBox>
        </group>)}
        {/* boquilla de aire: en «why so cold» sale un chorro frío bien visible */}
        <group position={[0.05, 0.02, 0.006]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.034, 0.014, 32]} />{M.plastic({ col: "#c3c6c9" })}</mesh>
          <mesh position={[0, 0, 0.012]}><sphereGeometry args={[0.02, 24, 16]} />{M.chrome({ col: "#dfe3e6" })}</mesh>
          <mesh position={[0, 0, 0.03]}><cylinderGeometry args={[0.006, 0.006, 0.01, 16]} />{M.plastic({ col: "#333" })}</mesh>
          {k === 2 && t > wow - 0.1 && Array.from({ length: 46 }, (_, i) => { const u = ((t - a) * 1.3 + rn(i, 1)) % 1; return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.1 * u, -0.3 * u - 0.02, 0.04 + 0.26 * u]} rotation={[0.9, 0, 0]}><planeGeometry args={[0.005, 0.07]} /><meshBasicMaterial color="#bfe4ff" transparent opacity={0.85 * (1 - u) * cl(u * 5) * cl((t - wow + 0.1) * 3)} depthWrite={false} toneMapped={false} /></mesh>; })}
          {k === 2 && t > wow - 0.1 && Array.from({ length: 18 }, (_, i) => { const u = ((t - a) * 0.9 + rn(i, 5)) % 1; return <mesh key={"cr" + i} position={[(rn(i, 6) - 0.5) * 0.14 * u, -0.34 * u - 0.03, 0.05 + 0.3 * u]}><octahedronGeometry args={[0.005]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.9 * (1 - u)} toneMapped={false} /></mesh>; })}
        </group>
        {/* cartel del cinturón: grande, se enciende con luz propia en «stand up» */}
        <group position={[0.17, 0.03, 0.003]}>
          <RBox s={[0.085, 0.06, 0.01]} r={0.007} p={[0, 0, 0]}>{M.plastic({ col: "#22262c" })}</RBox>
          <mesh position={[0, 0, 0.0056]}><planeGeometry args={[0.07, 0.048]} /><meshBasicMaterial color={k === 4 && t > wow ? "#3a2a00" : "#14171b"} toneMapped={false} /></mesh>
          <mesh position={[0, 0, 0.006]}><planeGeometry args={[0.05, 0.05]} /><meshBasicMaterial map={iconTex("cinto")} transparent color={k === 4 && t > wow ? "#ffd24a" : "#4d535b"} toneMapped={false} /></mesh>
          {k === 4 && t > wow && <pointLight position={[0, 0, 0.05]} intensity={0.35} distance={0.4} color="#ffc94a" />}
        </group>
        {/* el botón de llamada: se hunde, se enciende ámbar, halo y dos anillos del «ding» */}
        <group position={[0.27, 0.03, 0.004]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.026, 0.028, 0.012 - 0.004 * ding, 32]} />{M.plastic({ col: lit > 0.5 ? "#ffd27a" : "#b9bdc2", em: "#ffb340", emI: 2.2 * lit })}</mesh>
          <mesh position={[0, 0, 0.0075]}><planeGeometry args={[0.03, 0.03]} /><meshBasicMaterial map={iconTex("persona")} transparent color={lit > 0.5 ? "#6b3d00" : "#6d737a"} /></mesh>
          {lit > 0.01 && <mesh position={[0, 0, 0.009]}><planeGeometry args={[0.16, 0.16]} /><meshBasicMaterial map={canv("haloB", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 8, 64, 64, 64); gr.addColorStop(0, "rgba(255,200,90,.9)"); gr.addColorStop(1, "rgba(255,180,60,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); })} transparent opacity={0.8 * lit} depthWrite={false} toneMapped={false} /></mesh>}
          {ringM(ring)}{ringM(ring2)}
          {lit > 0.01 && <pointLight position={[0, 0, 0.06]} intensity={0.5 * lit} distance={0.5} color="#ffb340" />}
        </group>
        {/* la tarjeta baja colgada de dos cordones, rebota y se mece; lejos del botón */}
        {drop > 0.01 && <group position={[-0.08, -0.105, 0.012]} rotation={[-0.25 + 0.1 * sway, 0, sway * 0.6]}>
          {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, -0.045 * drop, 0]}><cylinderGeometry args={[0.0012, 0.0012, 0.09 * drop, 6]} /><meshStandardMaterial color="#c9b27a" roughness={0.7} /></mesh>)}
          <group position={[0, -0.09 * drop - 0.08, 0]} scale={[1, Math.max(0.01, cl(drop * 1.4)), 1]}>
            <RBox s={[0.27, 0.16, 0.003]} r={0.006} p={[0, 0, 0]}><meshStandardMaterial color="#efe5cd" roughness={0.9} /></RBox>
            {[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.066, 0.0018]}><ringGeometry args={[0.004, 0.0065, 16]} />{M.brass()}</mesh>)}
            <mesh position={[0, 0, 0.0017]}><planeGeometry args={[0.26, 0.15]} /><meshStandardMaterial map={printTex("q2" + k + "|" + Math.round(write * 24), 640, 370, "#efe5cd", [[`Q${k + 1}`, 28, 64, 66, "#c0392b", "900"]], (g) => {
              if (!document.fonts.check(`700 40px "${HAND}"`)) return;
              g.font = `700 124px "${HAND}"`; g.fillStyle = "#1d2a4a"; g.textBaseline = "middle"; const w = g.measureText(PREG[k]).width, x0 = 320 - w / 2;
              g.save(); g.beginPath(); g.rect(0, 0, x0 + w * write + 2, 370); g.clip(); g.fillText(PREG[k], x0, 215); g.restore();
            })} roughness={0.9} /></mesh>
          </group>
        </group>}
      </group>
    </Esc>
  </Stage>;
};

// ═════════ TSA: el control de seguridad en miniatura. El arco del escáner sobre la alfombra con las huellas amarillas; las
// zapatillas pisan las huellas y en «leave on your shoes» se encienden en verde con la placa «SHOES STAY ON» y el «75+». Llega
// la campera liviana a la primera bandeja; en «sit down» entra la silla; en «bulky» baja el cárdigan y en «in the bin» cae en
// la bandeja y las bandejas entran al túnel de rayos. ═════════
const huellas = () => canv("huellas", 512, 512, (g) => {
  g.fillStyle = "#2b2f36"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(255,255,255,${0.04 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 512, rn(i, 3) * 512, 2, 2); }
  g.fillStyle = "#f2c230"; [[200, 300, -0.12], [312, 300, 0.12]].forEach(([x, y, r]) => { g.save(); g.translate(x, y); g.rotate(r); g.beginPath(); g.ellipse(0, -40, 32, 58, 0, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(0, 50, 26, 34, 0, 0, 6.3); g.fill(); g.restore(); });
});
const Zapa: React.FC = () => <group>
  <RBox s={[0.1, 0.028, 0.27]} r={0.012} p={[0, 0.014, 0.03]}>{M.rubber({ col: "#ece8df" })}</RBox>
  <mesh position={[0, 0.045, 0.14]} castShadow><sphereGeometry args={[0.047, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e9e5dc" roughness={0.6} /></mesh>
  <mesh position={[0, 0.05, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.045, 0.16, 8, 20]} /><meshStandardMaterial map={fabricTex("jersey", [1, 1])} color="#f0eee8" roughness={0.8} /></mesh>
  {[0.06, 0.085, 0.11].map((z) => <mesh key={z} position={[0, 0.093, z]}><boxGeometry args={[0.05, 0.004, 0.006]} /><meshStandardMaterial color="#9aa3b2" roughness={0.8} /></mesh>)}
  <mesh position={[0, 0.07, -0.06]}><cylinderGeometry args={[0.046, 0.05, 0.06, 32]} /><meshStandardMaterial color="#d9c6ad" roughness={0.6} /></mesh>
  <RBox s={[0.03, 0.04, 0.012]} r={0.005} p={[0, 0.09, -0.1]}>{M.rubber({ col: "#2a3346" })}</RBox>
</group>;
const Bin: React.FC<{ children?: React.ReactNode }> = ({ children }) => <group>
  <RBox s={[0.42, 0.012, 0.3]} r={0.01} p={[0, 0.006, 0]}>{M.plastic({ col: "#8d949c" })}</RBox>
  {[[0, 0.04, 0.145, 0.42, 0.08, 0.012], [0, 0.04, -0.145, 0.42, 0.08, 0.012], [0.205, 0.04, 0, 0.012, 0.08, 0.3], [-0.205, 0.04, 0, 0.012, 0.08, 0.3]].map(([x, y, z, w, h, d], i) => <RBox key={i} s={[w, h, d]} r={0.005} p={[x, y, z]}>{M.plastic({ col: "#9aa1a8" })}</RBox>)}
  {children}
</group>;
const Silla: React.FC = () => <group>
  <RBox s={[0.32, 0.04, 0.3]} r={0.015} p={[0, 0.3, 0]}>{M.plastic({ col: "#2d4f7c" })}</RBox>
  <RBox s={[0.32, 0.3, 0.035]} r={0.015} p={[0, 0.47, -0.14]} rot={[-0.1, 0, 0]}>{M.plastic({ col: "#2d4f7c" })}</RBox>
  {[[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]].map(([x, z]) => <mesh key={x + "" + z} position={[x, 0.14, z]} castShadow><cylinderGeometry args={[0.009, 0.009, 0.28, 12]} />{M.steel()}</mesh>)}
</group>;
// prenda doblada de verdad: tela con pliegues que se apoya en la bandeja y cae por los bordes, con una manga cruzada
const ropaG = (k: string, w: number, d: number) => geo("ropa" + k + w + d, () => {
  const g = new THREE.PlaneGeometry(w, d, 40, 28), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), ex = Math.max(0, Math.abs(x) / (w / 2) - 0.75) / 0.25;
    p.setZ(i, 0.012 * Math.sin(x * 38 + y * 9) * Math.cos(y * 22) + 0.008 * Math.sin(y * 55 + 1) + 0.03 * (1 - ex) - 0.025 * ex * ex); }
  g.rotateX(-Math.PI / 2); g.computeVertexNormals(); return g;
});
const Prenda: React.FC<{ kind: "nylon" | "lana"; col: string; w: number; d: number }> = ({ kind, col, w, d }) => <group>
  <mesh geometry={ropaG(kind, w, d)} castShadow receiveShadow>{kind === "nylon" ? <meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} sheen={1} sheenColor="#cfe0ff" side={THREE.DoubleSide} /> : <meshStandardMaterial map={fabricTex("lana", [2, 2])} color={col} roughness={0.95} side={THREE.DoubleSide} />}</mesh>
  <mesh geometry={tubeG("manga" + kind, [[-w * 0.42, 0.03, -d * 0.3], [-w * 0.1, 0.05, -d * 0.05], [w * 0.15, 0.045, d * 0.15], [w * 0.4, 0.03, d * 0.32]], 0.022, 40, 14)} castShadow>{kind === "nylon" ? <meshPhysicalMaterial color={col} roughness={0.35} clearcoat={0.6} /> : <meshStandardMaterial map={fabricTex("lana", [1, 3])} color={col} roughness={0.95} />}</mesh>
  {kind === "nylon" && <mesh position={[0.02, 0.044, 0]} rotation={[0, 0.1, 0]}><boxGeometry args={[0.005, 0.004, d * 0.9]} />{M.steel({ col: "#d0d4d8" })}</mesh>}
  {kind === "lana" && [-0.32, -0.1, 0.12, 0.34].map((u) => <mesh key={u} position={[0.03, 0.046, d * u]}><sphereGeometry args={[0.009, 12, 8]} /><meshStandardMaterial color="#e9dcc0" roughness={0.5} /></mesh>)}
</group>;
export const Tsa: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, mo = f.mo ?? {};
  const walk = cl((t - a - 0.4) / 2.2), ok = spr(t, wow - 0.05, 1.1, 1.35), jk = spr(t, mo.jacket - 0.1, 0.9, 1.4), sit = spr(t, mo.sit - 0.1, 0.8, 1.4);
  const bulky = spr(t, mo.bulky - 0.1, 0.8, 1.4), drop = spr(t, mo.bulky + 1.3, 1.1, 1.5), go = cl((t - mo.bulky - 2.0) / 2.6);
  const cam = camA(t, a, b, { p: [-0.2, 1.95, 3.4], l: [0.72, 0.42, -0.3], fov: 36 }, { p: [1.55, 1.85, 3.2], l: [0.8, 0.42, -0.3], fov: 36 });
  const binX = (i: number) => 0.75 + i * 0.48 + 1.4 * go;
  return <Stage t={t} a={a} b={b} dim={0.6} tint="#e4ecf4">
    <Esc cam={cam} key1={[-1.0, 2.6, 1.6]} warm={1} cool={1.2}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[5, 3]} /><meshStandardMaterial color="#8d939a" roughness={0.45} metalness={0.05} alphaMap={canv("edgeT", 256, 256, (g) => { const gr = g.createRadialGradient(128, 128, 50, 128, 128, 128); gr.addColorStop(0, "#fff"); gr.addColorStop(0.7, "#fff"); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }, [1, 1], false)} transparent /></mesh>
      {/* el arco del escáner: dos columnas redondeadas, techo, franja de luz azul */}
      <group position={[-0.25, 0, 0]}>
        <RBox s={[0.9, 0.006, 0.7]} r={0.003} p={[0, 0.003, 0]}><meshStandardMaterial map={huellas()} roughness={0.85} /></RBox>
        {[-0.42, 0.42].map((x) => <group key={x}>
          <RBox s={[0.12, 1.15, 0.62]} r={0.05} p={[x, 0.575, 0]}>{M.plastic({ col: "#e4e7ea" })}</RBox>
          <mesh position={[x - Math.sign(x) * 0.061, 0.6, 0]}><boxGeometry args={[0.004, 0.9, 0.5]} /><meshPhysicalMaterial color="#cfe4f5" roughness={0.1} clearcoat={1} transparent opacity={0.6} /></mesh>
          <mesh position={[x - Math.sign(x) * 0.063, 0.6, 0.252]}><boxGeometry args={[0.004, 0.86, 0.01]} />{M.glow({ col: ok > 0.5 ? "#4cff9a" : "#6fb8ff" })}</mesh>
        </group>)}
        <RBox s={[0.98, 0.1, 0.62]} r={0.04} p={[0, 1.2, 0]}>{M.plastic({ col: "#d6dadd" })}</RBox>
        {/* las zapatillas entran y pisan las huellas; en la palabra, anillo verde */}
        {[-0.056, 0.056].map((x, i) => <group key={x} position={[x, 0.006, lerp(0.9, 0.02, walk) + (i ? 0.03 * Math.sin(walk * Math.PI) : 0)]} rotation={[0, i ? 0.12 : -0.12, 0]} scale={0.85}>
          <Blob w={0.16} d={0.32} o={0.85} y={0.002} /><Zapa />
        </group>)}
        {ok > 0.01 && <mesh position={[0, 0.012, 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={ok}><ringGeometry args={[0.2, 0.22, 64]} />{M.glow({ col: "#4cff9a" })}</mesh>}
        {/* placa «SHOES STAY ON» en el techo del arco, con el disco «75+» */}
        {ok > 0.01 && <group position={[0, 1.2 + 0.2 * (1 - cl(ok)), 0.32]} scale={lerp(0.5, 1, cl(ok))}>
          <RBox s={[0.62, 0.13, 0.016]} r={0.01} p={[0, 0, 0]}>{M.porcelain({ col: "#f6f3ec" })}</RBox>
          <mesh position={[0.05, 0, 0.0085]}><planeGeometry args={[0.5, 0.11]} /><meshStandardMaterial map={printTex("shoesOn", 900, 200, "#f6f3ec", [["SHOES STAY ON", 48, 104, 96, "#13824a", "900"]])} roughness={0.6} /></mesh>
          <group position={[-0.27, 0, 0.02]}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.016, 40]} />{M.plastic({ col: "#13824a" })}</mesh>
            <mesh position={[0, 0, 0.0085]}><circleGeometry args={[0.064, 40]} /><meshStandardMaterial map={printTex("75mas", 256, 256, "#13824a", [["75+", 34, 130, 96, "#ffffff", "900"]])} roughness={0.5} /></mesh></group>
        </group>}
      </group>
      {/* la silla para sentarse */}
      <group position={[-1.3 + 0.4 * sit, 0, 0.55]} rotation={[0, 0.7, 0]} scale={lerp(0.001, 1, cl(sit))}><Blob w={0.45} d={0.45} o={0.4} /><Silla /></group>
      {/* la cinta transportadora con rodillos y el túnel de rayos */}
      <group position={[0, 0, -0.75]}>
        <RBox s={[2.6, 0.06, 0.42]} r={0.015} p={[1.0, 0.42, 0]}>{M.steel({ col: "#9da4ab" })}</RBox>
        {Array.from({ length: 26 }, (_, i) => <mesh key={i} position={[-0.25 + i * 0.1, 0.46, 0]} rotation={[Math.PI / 2, -(t - a) * 6, 0]}><cylinderGeometry args={[0.018, 0.018, 0.4, 16]} />{M.steel({ col: "#c9ced3" })}</mesh>)}
        {[-0.2, 2.2].map((x) => <mesh key={x} position={[x, 0.2, 0]}><boxGeometry args={[0.05, 0.4, 0.36]} />{M.steel({ col: "#6d747b" })}</mesh>)}
        <RBox s={[0.9, 0.5, 0.56]} r={0.04} p={[2.1, 0.7, 0]}>{M.plastic({ col: "#cfd3d7" })}</RBox>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[1.645, 0.62, -0.2 + i * 0.08]}><boxGeometry args={[0.004, 0.32, 0.075]} /><meshStandardMaterial color="#2a2f36" roughness={0.6} transparent opacity={0.85} /></mesh>)}
        {/* bandeja 1: la campera liviana; bandeja 2: el cárdigan */}
        <group position={[binX(0) - 1.0, 0.48, 0]}><Bin>
          {jk > 0.01 && <group position={[0, 0.012 + 0.6 * (1 - cl(jk)), 0]} rotation={[0, 0.2 + 0.8 * (1 - cl(jk)), 0.4 * (1 - cl(jk))]}><group scale={1.25}><Prenda kind="nylon" col="#4f79a8" w={0.38} d={0.27} /></group></group>}
        </Bin></group>
        <group position={[binX(1) - 1.0, 0.48, 0]}><Bin>
          {bulky > 0.01 && <group position={[0, 0.012 + lerp(0.7, 0.18, cl(bulky)) * (1 - cl(drop)), 0]} rotation={[0, 0.3 * (1 - cl(drop)), 0.15 * Math.sin((t - mo.bulky) * 2) * (1 - cl(drop))]}><group scale={1.25}><Prenda kind="lana" col="#b8574a" w={0.38} d={0.27} /></group></group>}
        </Bin></group>
      </group>
      <Sombra w={4} d={2.6} o={0.32} y={0.001} />
    </Esc>
  </Stage>;
};

// ═════════ MAPA: el avión visto desde arriba, en corte: fuselaje blanco, 30 filas 3+3, el pasillo. El alfiler sale de la
// puerta de la manga; en «from her seat» recorre el pasillo, en «row 23» la fila 23 se enciende y el alfiler se clava en la C;
// en «aisle» corren las flechas por el pasillo al lado del asiento. Placa «23C» sobre el asiento. ═════════
const PITCH = 0.06, FX0 = -0.9, filaX = (r: number) => FX0 + (r - 1) * PITCH;
const seatZ = (c: number) => (c < 3 ? -0.21 + c * 0.065 : 0.08 + (c - 3) * 0.065);   // A B C | pasillo | D E F
const fuseG = () => {
  const s = new THREE.Shape(); const L = 1.1, W = 0.32;
  s.moveTo(-L, -W); s.lineTo(L * 0.86, -W); s.quadraticCurveTo(L * 1.08, -W, L * 1.12, 0); s.quadraticCurveTo(L * 1.08, W, L * 0.86, W); s.lineTo(-L, W); s.quadraticCurveTo(-L * 1.22, W, -L * 1.26, 0); s.quadraticCurveTo(-L * 1.22, -W, -L, -W);
  return s;
};
const Pin: React.FC<{ glow: number }> = ({ glow }) => <group>
  <mesh position={[0, 0.06, 0]} castShadow><sphereGeometry args={[0.024, 28, 20]} /><meshPhysicalMaterial color="#e2342b" roughness={0.25} clearcoat={1} emissive="#ff3b2e" emissiveIntensity={0.6 * glow} /></mesh>
  <mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.0025, 0.0008, 0.05, 10]} />{M.steel()}</mesh>
</group>;
export const Mapa: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, mo = f.mo ?? {};
  const z23 = filaX(23), aisleZ = 0.0115;
  // recorrido del alfiler: puerta → pasillo → fila 23 → asiento C
  const u = cl((t - mo.sube) / Math.max(0.6, wow - mo.sube - 0.1)), ue = u * u * (3 - 2 * u), into = spr(t, wow + 0.05, 1.2, 1.4);
  const px = lerp(FX0 - 0.12, z23, ue), pz = lerp(lerp(-0.36, aisleZ, cl(u * 6)), seatZ(2), cl(into));
  const hop = Math.abs(Math.sin(ue * Math.PI * 7)) * 0.025 * (1 - cl(into));
  const row = spr(t, wow - 0.05, 1.3, 1.3), arr = cl((t - Math.min(mo.aisle, wow + 1.0)) / 1.2);
  const cam = camA(t, a, b, { p: [0.0, 2.3, 1.15], l: [0.0, 0, 0], fov: 36 }, { p: [z23 + 0.1, 1.3, 0.78], l: [z23 - 0.05, 0, -0.02], fov: 34 });
  return <Stage t={t} a={a} b={b} dim={1.2} tint="#dde8f4">
    <Esc cam={cam} key1={[-0.4, 2.8, 1.2]} warm={1} cool={1.1}>
      {/* fuselaje: piso alfombrado dentro de un casco blanco con ventanillas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><shapeGeometry args={[fuseG()]} /><meshStandardMaterial color="#3d4f6e" roughness={0.95} map={fabricTex("navy", [6, 2])} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} scale={[1.03, 1.12, 1]}><shapeGeometry args={[fuseG()]} /><meshStandardMaterial color="#eef0f2" roughness={0.4} /></mesh>
      {[-1, 1].map((sg) => <mesh key={sg} position={[0.1, 0.03, sg * 0.335]} castShadow><boxGeometry args={[2.0, 0.06, 0.026]} />{M.plastic({ col: "#f2f3f4" })}</mesh>)}
      {Array.from({ length: 30 }, (_, i) => [-1, 1].map((sg) => <mesh key={i + "w" + sg} position={[filaX(i + 1), 0.04, sg * 0.349]}><boxGeometry args={[0.022, 0.026, 0.002]} /><meshStandardMaterial color="#9cc4e8" emissive="#bfe0ff" emissiveIntensity={0.5} /></mesh>))}
      {/* pasillo más claro */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.0, 0.0015, aisleZ]}><planeGeometry args={[1.95, 0.07]} /><meshStandardMaterial color="#56688a" roughness={0.95} /></mesh>
      {/* las 30 filas */}
      {Array.from({ length: 30 }, (_, i) => { const r = i + 1, on = r === 23 ? row : 0; return <group key={r} position={[filaX(r), 0, 0]}>
        {[0, 1, 2, 3, 4, 5].map((c) => { const me = r === 23 && c === 2; return <group key={c} position={[0, 0, seatZ(c)]}>
          <RBox s={[0.04, 0.02, 0.055]} r={0.008} p={[0, 0.012, 0]} shadow={false}>{M.plastic({ col: me && on > 0.5 ? "#ffcf4a" : on > 0.5 ? "#7da2d8" : "#4d6ea8", em: me ? "#ffb300" : "#000", emI: me ? 0.9 * on : 0 })}</RBox>
          <RBox s={[0.012, 0.045, 0.055]} r={0.005} p={[-0.022, 0.03, 0]} shadow={false}>{M.plastic({ col: me && on > 0.5 ? "#ffcf4a" : "#3d5a8f" })}</RBox>
        </group>; })}
        {(r % 5 === 0 || r === 23 || r === 1) && <mesh position={[0, 0.003, aisleZ]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[0.068, 0.068]} /><meshBasicMaterial map={printTex("fila" + r, 128, 128, "#56688a", [[String(r), r < 10 ? 46 : 20, 66, 64, r === 23 ? "#ffd75a" : "#c9d6ea", "900"]])} transparent opacity={0.95} toneMapped={false} /></mesh>}
        {r === 23 && on > 0.01 && <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.058, 0.62 * cl(on)]} />{M.glow({ col: "#ffd75a", op: 0.35 })}</mesh>}
      </group>; })}
      {/* la manga: se acopla en la puerta delantera izquierda */}
      <group position={[FX0 - 0.12, 0, 0]}>
        <mesh position={[0, 0.03, -0.336]}><boxGeometry args={[0.07, 0.05, 0.03]} /><meshStandardMaterial color="#1a1d22" roughness={0.9} /></mesh>
        <RBox s={[0.09, 0.075, 0.42]} r={0.015} p={[0, 0.06, -0.58]}>{M.steel({ col: "#c8cdd2" })}</RBox>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.0455, 0.07, -0.42 - i * 0.06]}><boxGeometry args={[0.002, 0.022, 0.035]} /><meshStandardMaterial color="#9cc4e8" emissive="#bfe0ff" emissiveIntensity={0.5} /></mesh>)}
        <mesh position={[0, 0.06, -0.84]}><cylinderGeometry args={[0.09, 0.09, 0.1, 32]} />{M.steel({ col: "#b9bfc5" })}</mesh>
        <mesh position={[0, 0.02, -0.84]}><cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />{M.steel({ col: "#6d747b" })}</mesh>
      </group>
      {/* flechas por el pasillo en «aisle» */}
      {arr > 0 && Array.from({ length: 5 }, (_, i) => { const x = z23 - 0.24 + ((i * 0.12 + arr * 0.3) % 0.6); return <group key={i} position={[x, 0.004, aisleZ]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={2.1}>
        <mesh><shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-0.018, -0.012), new THREE.Vector2(0, 0.012), new THREE.Vector2(0.018, -0.012), new THREE.Vector2(0.008, -0.012), new THREE.Vector2(0, -0.0)/* punta */, new THREE.Vector2(-0.008, -0.012)])]} />{M.glow({ col: "#4cff9a", op: 0.9 * Math.sin(Math.PI * ((x - z23 + 0.24) / 0.6)) })}</mesh>
      </group>; })}
      {/* el alfiler */}
      {t > mo.sube - 0.6 && <group position={[px, 0.005 + hop + 0.12 * (1 - spr(t, mo.sube - 0.6, 1.2, 1.3)), pz]}><Blob w={0.05} d={0.05} o={0.5} y={-0.004} /><group scale={1.5}><Pin glow={row} /></group></group>}
      {/* placa «23C» parada sobre el asiento */}
      {row > 0.01 && <group position={[z23 + 0.02, 0.17 + 0.06 * (1 - cl(row)), seatZ(2) - 0.1]} rotation={[-0.45, 0, 0]} scale={lerp(0.4, 1, cl(row))}>
        <RBox s={[0.14, 0.065, 0.008]} r={0.008} p={[0, 0, 0]}>{M.porcelain({ col: "#fbf7ee" })}</RBox>
        <mesh position={[0, 0, 0.0045]}><planeGeometry args={[0.13, 0.058]} /><meshStandardMaterial map={printTex("23c", 400, 180, "#fbf7ee", [["23C", 92, 96, 120, "#1d2a4a", "900"]])} roughness={0.6} /></mesh>
      </group>}
      <Sombra w={3} d={1.4} o={0.3} y={0.0005} />
    </Esc>
  </Stage>;
};

// ═════════ POSTAL: esa noche, el teléfono sobre la colcha vibra; la pantalla se enciende y entra la foto (Carol con el bebé
// de manta rosa). Al salir, el teléfono sube hacia la cámara, como cuando una lo levanta para mirar. ═════════
const madera = () => canv("madera", 512, 512, (g) => {
  g.fillStyle = "#6b3f22"; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y++) { const v = 0.5 + 0.5 * Math.sin(y * 0.09 + 3 * Math.sin(y * 0.013)); g.fillStyle = `rgba(${v > 0.5 ? "150,92,52" : "60,32,16"},${0.12 + 0.15 * Math.abs(v - 0.5)})`; g.fillRect(0, y, 512, 1); }
  for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(30,14,4,${0.12 * rn(i, 1)})`; g.fillRect(rn(i, 2) * 512, rn(i, 3) * 512, 6 + 20 * rn(i, 4), 1); }
}, [1, 1]);
const puntilla = () => canv("puntilla", 256, 256, (g) => {   // carpetita tejida bajo el velador
  g.clearRect(0, 0, 256, 256); g.fillStyle = "#f3ead8"; g.beginPath(); g.arc(128, 128, 118, 0, 6.3); g.fill();
  g.globalCompositeOperation = "destination-out"; for (let rr = 30; rr < 118; rr += 18) for (let i = 0; i < Math.floor(rr / 3); i++) { const an = i / Math.floor(rr / 3) * 6.283; g.beginPath(); g.arc(128 + rr * Math.cos(an), 128 + rr * Math.sin(an), 3.2, 0, 6.3); g.fill(); }
  g.globalCompositeOperation = "source-over";
}, [1, 1]);
export const Postal: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const [tex, done] = useImg("lin01a/prendas/postal_foto.jpg");
  const buzz = t > a && t < wow + 0.7 ? Math.sin((t - a) * 90) * 0.006 * (1 - cl((t - wow - 0.3) / 0.4)) : 0;
  const foto = React.useMemo(() => { if (!tex) return null; const tx = tex.clone(); tx.needsUpdate = true; tx.repeat.set(0.3, 1); tx.offset.set(0.33, 0); return tx; }, [tex]);
  const on = cl((t - wow) / 0.15), ph = spr(t, wow + 0.25, 0.9, 1.3), up = cl((t - (b - 1.0)) / 0.9), ue = up * up;
  const cam = camA(t, a, b, { p: [0.0, 0.36, 0.42], l: [0.06, 0.04, -0.04], fov: 34 }, { p: [-0.04, 0.32, 0.36], l: [0.05, 0.04, -0.04], fov: 34 });
  return <Stage t={t} a={a} b={b} dim={1.35} tint="#ffc890">
    <Esc cam={cam} key1={[-1.2, 1.6, 0.8]} warm={1.15} cool={0.7} exposure={0.95}>
      <Ready dep={tex} done={done} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.0, 0.7]} /><meshPhysicalMaterial map={madera()} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.3} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.001, -0.1]}><circleGeometry args={[0.11, 48]} /><meshStandardMaterial map={puntilla()} transparent alphaTest={0.3} roughness={0.95} /></mesh>
      <group position={[0.21, 0, -0.1]} scale={0.72}><mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.035, 0.035, 0.012, 32]} />{M.porcelain({ col: "#eadfcd" })}</mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.005, 0.005, 0.18, 16]} />{M.brass()}</mesh>
        <mesh position={[0, 0.215, 0]}><cylinderGeometry args={[0.055, 0.085, 0.1, 40, 1, true]} /><meshStandardMaterial color="#f4e6cc" roughness={0.9} side={THREE.DoubleSide} emissive="#ffcf8a" emissiveIntensity={0.55} /></mesh>
        <mesh position={[0, 0.17, 0]}><sphereGeometry args={[0.018, 16, 12]} />{M.glow({ col: "#fff1d0" })}</mesh></group>
      <pointLight position={[0.25, 0.25, -0.12]} intensity={0.9} distance={1.2} color="#ffc98a" />
      <group position={[buzz, 0.012 + 0.07 * ue, 0.02 + 0.06 * ue]} rotation={[0.62 * ue, 0.18 * (1 - ue) + buzz * 6, 0]} scale={0.82}>
        <Blob w={0.14} d={0.22} o={0.55 * (1 - ue)} y={-0.01} />
        <RBox s={[0.082, 0.009, 0.165]} r={0.009} p={[0, 0, 0]}><meshPhysicalMaterial color="#1a1c20" roughness={0.3} metalness={0.4} clearcoat={1} /></RBox>
        {/* pantalla: negra → se enciende; la foto entra desde abajo; bordes de vidrio */}
        <mesh position={[0, 0.0047, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.074, 0.155]} /><meshStandardMaterial color="#05060a" roughness={0.1} /></mesh>
        {foto && on > 0 && <mesh position={[0, 0.0049, 0.155 * 0.5 * (1 - cl(ph)) * 0.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.072, 0.135]} /><meshBasicMaterial map={foto!} transparent opacity={on * cl(ph * 1.5)} toneMapped={false} /></mesh>}
        {on > 0 && <mesh position={[0, 0.0048, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.074, 0.155]} /><meshBasicMaterial map={printTex("lock", 300, 620, "#22304f", [], (g) => { const gr = g.createLinearGradient(0, 0, 0, 620); gr.addColorStop(0, "#3b4f7d"); gr.addColorStop(1, "#c98a7a"); g.fillStyle = gr; g.fillRect(0, 0, 300, 620); g.fillStyle = "#ffffff"; g.font = "300 84px Montserrat, Arial"; g.textAlign = "center"; g.fillText("8:14", 150, 160); g.textAlign = "left"; g.fillStyle = "rgba(255,255,255,.88)"; g.fillRect(18, 250, 264, 74); g.fillStyle = "#e88aa8"; g.beginPath(); g.arc(52, 287, 18, 0, 6.3); g.fill(); g.fillStyle = "#1d2430"; g.font = "800 26px Montserrat, Arial"; g.fillText("Carol", 82, 280); g.font = "500 20px Montserrat, Arial"; g.fillText("sent a photo", 82, 306); })} transparent opacity={on * (1 - cl(ph * 1.5))} toneMapped={false} /></mesh>}
        <mesh position={[0, 0.0052, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.076, 0.158]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.08} roughness={0.02} clearcoat={1} depthWrite={false} /></mesh>
        <mesh position={[0, 0.0048, -0.071]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.02, 0.004]} /><meshBasicMaterial color="#000" /></mesh>
      </group>
      {/* el brillo de la pantalla sobre la colcha */}
      {on > 0 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.02]}><planeGeometry args={[0.4, 0.45]} /><meshBasicMaterial map={canv("halo", 128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, "rgba(255,225,235,.6)"); gr.addColorStop(1, "rgba(255,225,235,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); })} transparent opacity={on * (1 - ue)} depthWrite={false} toneMapped={false} /></mesh>}
      {/* ondas de la vibración */}
      {t < wow + 0.6 && [0, 0.33, 0.66].map((d) => { const q = ((t - a) * 2.2 + d) % 1; return <mesh key={d} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.02]} scale={[0.09 + 0.12 * q, 0.14 + 0.12 * q, 1]}><ringGeometry args={[0.9, 1, 48]} /><meshBasicMaterial color="#fff6ea" transparent opacity={0.8 * (1 - q)} depthWrite={false} toneMapped={false} /></mesh>; })}
      <Sombra w={1.2} d={1} o={0.3} y={0.001} />
    </Esc>
  </Stage>;
};
