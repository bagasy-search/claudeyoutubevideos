// ohf30d · componentes únicos 1-9 (kit h3d + okit + bbkit: el zócalo de agua caliente real, cámara que orbita en curva)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Bubbles, Gauge, Puffs, Tape, dialTex } from "./okit";
import { BD, BH, Baseboard, Boiler, CU, Coin, Cu, FlowDots, PY, RoomWall } from "./bbkit";

const PI = Math.PI;
type V3 = [number, number, number];

// ---- 0:08 · UN ARROYITO DETRÁS DEL ZÓCALO (rehecho r3): pared de ladrillo, zócalo verde de tapa vidriada, cámara baja desde la derecha; el agua corre y una burbuja grande de aire viaja por el caño gorgoteando ----
const brick = (k: string, base: number[], mort: string) => tex.text("br_" + k, 1024, 512, (g) => {
  g.fillStyle = mort; g.fillRect(0, 0, 1024, 512);
  for (let r = 0; r < 32; r++) for (let c = -1; c < 17; c++) { const x = c * 64 + (r % 2) * 32 + 2, y = r * 16 + 2, v = rn(r * 13 + c, 7) * 34 - 17, w2 = rn(r * 7 + c, 3);
    g.fillStyle = `rgb(${base[0] + v},${base[1] + v * 0.6},${base[2] + v * 0.5})`; g.fillRect(x, y, 60, 13);
    g.fillStyle = `rgba(0,0,0,${0.08 + w2 * 0.12})`; g.fillRect(x, y + 10, 60, 3); g.fillStyle = "rgba(255,240,220,.08)"; g.fillRect(x, y, 60, 2);
    for (let s = 0; s < 8; s++) { g.fillStyle = `rgba(0,0,0,${0.12 * rn(s, r + c)})`; g.fillRect(x + rn(s, c) * 58, y + rn(s + 3, r) * 11, 2, 2); } }
});
export const HCreek: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#1a1210" key1={[1.0, 1.4, 1.3]} warm={0.9}
  cam={{ at: [0.1, 0.2, 0.06], az: [0.62, 0.3], el: [0.2, 0.14], r: [1.3, 1.05], fov: 32 }}>{(tt) => {
  const g = 1 - 0.78 * eio(tt, 0.3, 1.3), bx = lerp(-0.5, 0.42, eio(tt, 1.9, 5.5)), bk = cl((tt - 1.7) * 3) * cl((6.2 - tt) * 3);
  return <>
    <mesh position={[0, 0.6, -0.012]} receiveShadow><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial map={brick("creek", [150, 62, 44], "#cbbfae")} roughness={0.95} /></mesh>
    <Baseboard len={1.3} ghost={g} col="#35594a" heat={(u) => 0.75 - 0.2 * Math.sin(u * 6 + tt)} />
    <FlowDots tt={tt} pts={[[-0.72, PY, BD / 2 + 0.002], [0.72, PY, BD / 2 + 0.002]]} n={34} v={0.16} r={0.006} col="#ffb070" k={cl(tt - 0.6)} />
    {/* la burbuja grande que viaja: se estira, tiembla y arrastra burbujitas */}
    <group position={[bx, PY + 0.003, BD / 2 + 0.037]} visible={bk > 0.01}>
      <mesh scale={[Math.max(0.001, bk * (2.6 + 0.5 * Math.sin(tt * 9))), Math.max(0.001, bk), Math.max(0.001, bk)]}><sphereGeometry args={[0.021, 18, 12]} /><meshPhysicalMaterial color="#f4f9ff" emissive="#9fd2ff" emissiveIntensity={0.5} roughness={0.02} metalness={0.45} clearcoat={1} /></mesh>
      {[1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.03 * i - 0.01, 0.002 * Math.sin(tt * 8 + i), 0]} scale={Math.max(0.001, bk * (1 - i * 0.18))}><sphereGeometry args={[0.007, 10, 8]} /><meshPhysicalMaterial color="#eef6ff" emissive="#9fd2ff" emissiveIntensity={0.3} roughness={0.03} metalness={0.4} clearcoat={1} /></mesh>)}
      {/* el gorgoteo sale justo donde está la burbuja */}
      {[0, 1].map((i) => { const q = (tt * 1.3 + i * 0.5) % 1; return <mesh key={i} position={[0, BH - PY + 0.04 + q * 0.06, BD / 2 + 0.03]}><ringGeometry args={[0.02 + q * 0.06, 0.026 + q * 0.06, 40]} /><meshBasicMaterial color="#d8ecff" transparent opacity={0.6 * (1 - q) * bk} depthWrite={false} side={THREE.DoubleSide} /></mesh>; })}
    </group>
    <Tape txt="THAT GURGLE IS AIR" col="#23493c" p={[0.24, 0.27, 0.17]} rot={[0, 0.4, 0]} w={0.5} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 0:22 · TIBIO EN UNA PUNTA, FRÍO EN LA OTRA (rehecho r2): una cámara térmica en primer plano apunta al zócalo del fondo; en su
// pantalla el calor avanza desde la izquierda y frena en seco; la mira recorre el tramo y la lectura cae de 140° a 60° justo donde está el aire ----
const irPal = (v: number) => { const S: [number, number[]][] = [[0, [12, 6, 40]], [0.25, [70, 20, 120]], [0.45, [190, 30, 90]], [0.62, [240, 90, 30]], [0.8, [255, 180, 40]], [1, [255, 250, 220]]];
  for (let i = 1; i < S.length; i++) if (v <= S[i][0]) { const [a, ca] = S[i - 1], [b, cb] = S[i], k = (v - a) / (b - a); return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k)).join(",")})`; } return "rgb(255,250,220)"; };
const irTex = (fq: number, rq: number, mark: number) => tex.text(`ir${fq}_${rq}_${mark}`, 640, 416, (g) => {
  const W = 640, f = fq / 24, r = rq / 30;
  const bgG = g.createLinearGradient(0, 0, 0, 416); bgG.addColorStop(0, "#160a36"); bgG.addColorStop(1, "#2a1450"); g.fillStyle = bgG; g.fillRect(0, 0, W, 416);
  const v = (x: number) => { const u = x / W, d = (u - f) / 0.035; return u < f - 0.035 ? 0.86 - 0.12 * (u / Math.max(0.05, f)) : u > f + 0.035 ? 0.24 + 0.03 * Math.sin(u * 20) : lerp(0.74, 0.27, (d + 1) / 2); };
  // aire tibio que sube sobre la parte caliente
  for (let x = 0; x < W * f; x += 6) { const gr = g.createLinearGradient(0, 120, 0, 250); gr.addColorStop(0, "rgba(190,30,90,0)"); gr.addColorStop(1, `rgba(220,60,60,${0.35 * (1 - x / (W * f + 1)) + 0.12})`); g.fillStyle = gr; g.fillRect(x, 120, 6, 130); }
  for (let x = 0; x < W; x += 4) { g.fillStyle = irPal(v(x)); g.fillRect(x, 232, 4, 104); g.fillStyle = irPal(Math.min(1, v(x) + 0.1)); g.fillRect(x, 278, 4, 14); }
  g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, 336, W, 80);
  // la mira y su lectura
  const rx = 40 + r * (W - 80), hot = rx / W < f, temp = hot ? Math.round(142 - 6 * (rx / W)) : 61;
  g.strokeStyle = "#ffffff"; g.lineWidth = 4; g.strokeRect(rx - 28, 256, 56, 56); g.beginPath(); g.moveTo(rx, 234); g.lineTo(rx, 252); g.moveTo(rx, 316); g.lineTo(rx, 334); g.stroke();
  g.font = "900 46px Arial"; g.textAlign = "center"; g.fillStyle = hot ? "#ffd27a" : "#9cc8ff"; g.fillText(`${temp}°F`, Math.min(W - 80, Math.max(80, rx)), 218);
  g.font = "800 30px Arial"; g.fillStyle = "#ffffff"; g.textAlign = "left"; g.fillText("WARM", 24, 380); g.textAlign = "right"; g.fillText("COLD", W - 24, 380);
  if (mark) { const ax = f * W; g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(ax - 14, 92); g.lineTo(ax + 14, 92); g.lineTo(ax, 112); g.fill(); g.font = "900 34px Arial"; g.textAlign = "center"; g.fillText("THE AIR IS HERE", Math.min(W - 150, Math.max(150, ax)), 74); }
  g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.strokeRect(6, 6, W - 12, 404);
});
export const HHalfWarm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#14100d" key1={[-0.9, 1.4, 1.6]} warm={0.8}
  cam={{ at: [0.06, 0.19, 0.52], az: [-0.34, -0.14], el: [0.16, 0.1], r: [0.62, 0.54], fov: 32 }}>{(tt) => {
  const fq = Math.round(24 * lerp(0.08, 0.5, eio(tt, 0.3, 2.3))), rq = Math.round(30 * lerp(0.05, 0.92, eio(tt, 2.0, 5.2))), mark = tt > 2.6 ? 1 : 0;
  const aim = 0.02 * Math.sin(tt * 0.7);
  return <>
    {/* el cuarto del fondo: pared, zócalo cerrado y una ventana con luz fría */}
    <mesh position={[0, 0.8, -0.005]} receiveShadow><planeGeometry args={[4, 1.6]} /><meshStandardMaterial color="#cbbfa8" roughness={0.92} /></mesh>
    <Baseboard len={1.6} p={[0, 0, 0]} heat={() => 0.5} />
    {/* la cámara térmica: cuerpo de goma, paragolpes amarillos, pantalla viva y empuñadura */}
    <group position={[0.06, 0.19, 0.6]} rotation={[-0.06 + aim * 0.5, -0.18 + aim, 0.03]}>
      <RBox s={[0.25, 0.18, 0.05]} p={[0, 0, 0]} r={0.018}><meshStandardMaterial color="#2b2e33" roughness={0.6} /></RBox>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <RBox key={i} s={[0.036, 0.036, 0.056]} p={[sx * 0.117, sy * 0.082, 0]} r={0.012}>{M.plastic({ col: "#e6b422" })}</RBox>)}
      <RBox s={[0.214, 0.146, 0.004]} p={[0, 0.002, 0.026]} r={0.006}><meshStandardMaterial color="#0c0d10" roughness={0.3} /></RBox>
      <mesh position={[0, 0.002, 0.0285]}><planeGeometry args={[0.2, 0.13]} /><meshBasicMaterial map={irTex(fq, rq, mark)} toneMapped={false} /></mesh>
      <mesh position={[0, 0.002, 0.029]}><planeGeometry args={[0.2, 0.13]} />{M.glass({ op: 0.08 })}</mesh>
      <RBox s={[0.07, 0.15, 0.045]} p={[0.0, -0.15, -0.01]} rot={[0.25, 0, 0]} r={0.016}><meshStandardMaterial color="#25282c" roughness={0.7} /></RBox>
      <RBox s={[0.026, 0.04, 0.02]} p={[0.0, -0.1, 0.022]} rot={[0.25, 0, 0]} r={0.006}>{M.plastic({ col: "#d33a2c" })}</RBox>
      <mesh position={[0.0, 0.0, -0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.025, 0.028, 0.02, 32]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} /></mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 1:49 · DOS ZÓCALOS IGUALES, SÓLO UNO TIENE AGUA (rehecho r3): un rincón empapelado visto en diagonal, un zócalo en cada pared;
// las tapas se vuelven vidrio: en uno corre agua con una burbuja que viaja, en el otro un pulso de corriente recorre la resistencia ----
const tbPaper = (k: string, a: string, b: string, c: string) => tex.text("tb_" + k, 1024, 512, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 1024, 512);
  for (let x = 0; x < 1024; x += 64) { g.fillStyle = b; g.fillRect(x, 0, 22, 512); g.fillStyle = "rgba(0,0,0,.06)"; g.fillRect(x + 22, 0, 2, 512); }
  for (let i = 0; i < 16 * 8; i++) { const cx = (i % 16) * 64 + 43, y = Math.floor(i / 16) * 64 + 32 + (i % 2) * 32; g.fillStyle = c; g.beginPath(); g.moveTo(cx, y - 7); g.lineTo(cx + 5, y); g.lineTo(cx, y + 7); g.lineTo(cx - 5, y); g.fill(); }
});
export const HTwoBoards: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="none" bg="#151a1c" key1={[-1.2, 1.6, 1.4]} warm={0.85}
  cam={{ at: [-0.3, 0.17, 0.3], az: [-0.95, -0.7], el: [0.3, 0.24], r: [1.5, 1.22], fov: 32 }}>{(tt) => {
  const g = 1 - 0.8 * eio(tt, 0.7, 1.8), bu = eio(tt, 2.0, 5.4), bk = cl((tt - 1.8) * 3) * cl((6.0 - tt) * 3), pu = (tt * 0.45) % 1, ek = cl((tt - 1.9) * 2);
  return <>
    <mesh position={[-0.55, 0.55, -0.012]} receiveShadow><planeGeometry args={[1.1, 1.1]} /><meshStandardMaterial map={tbPaper("a", "#2f5e5a", "rgba(255,255,255,.07)", "rgba(240,200,120,.45)")} roughness={0.85} /></mesh>
    <mesh position={[0.012, 0.55, 0.55]} rotation={[0, -PI / 2, 0]} receiveShadow><planeGeometry args={[1.1, 1.1]} /><meshStandardMaterial map={tbPaper("a", "#2f5e5a", "rgba(255,255,255,.07)", "rgba(240,200,120,.45)")} roughness={0.85} /></mesh>
    <RBox s={[1.1, 0.05, 0.015]} p={[-0.55, 0.025, 0.0]} r={0.003}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>
    <RBox s={[0.015, 0.05, 1.1]} p={[0.0, 0.025, 0.55]} r={0.003}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>
    {/* pared del fondo: el de AGUA */}
    <group position={[-0.5, 0.03, 0.008]}>
      <Baseboard len={0.7} ghost={g} col="#e9e2d2" heat={() => 0.85} risers={false} />
      <FlowDots tt={tt} pts={[[-0.4, PY, BD / 2 + 0.036], [0.4, PY, BD / 2 + 0.036]]} n={22} v={0.3} r={0.007} col="#5fb4ff" k={cl(tt - 1.2)} />
      <group position={[lerp(-0.33, 0.33, bu), PY + 0.002, BD / 2 + 0.038]} visible={bk > 0.01}>
        <mesh scale={[Math.max(0.001, bk * (2.4 + 0.4 * Math.sin(tt * 9))), Math.max(0.001, bk), Math.max(0.001, bk)]}><sphereGeometry args={[0.02, 18, 12]} /><meshPhysicalMaterial color="#f4f9ff" emissive="#9fd2ff" emissiveIntensity={0.5} roughness={0.02} metalness={0.45} clearcoat={1} /></mesh>
      </group>
    </group>
    {/* pared del costado: el ELÉCTRICO */}
    <group position={[-0.008, 0.03, 0.5]} rotation={[0, -PI / 2, 0]}>
      <Baseboard len={0.7} ghost={g} col="#e9e2d2" elec />
      {[0, 1, 2, 3, 4, 5].map((i) => { const x = lerp(-0.29, 0.29, (pu + i / 6) % 1); return <mesh key={i} position={[x, PY, BD / 2 + 0.03]} scale={Math.max(0.001, ek)}><sphereGeometry args={[0.009, 10, 8]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>; })}
      <mesh position={[0, PY, BD / 2 + 0.017]}><boxGeometry args={[0.58, 0.004, 0.004]} /><meshStandardMaterial color="#3a2a14" emissive="#ff8a2a" emissiveIntensity={ek * (0.8 + 0.2 * Math.sin(tt * 2.5))} /></mesh>
    </group>
    <Tape txt="WATER" col="#1f5fa8" p={[-0.52, 0.37, 0.14]} rot={[0, -0.45, 0]} w={0.44} k={phys(tt, 0.8, 8, 0.45)} />
    <Tape txt="WIRES" col="#b5461e" p={[-0.12, 0.37, 0.52]} rot={[0, -PI / 2 + 0.55, 0]} w={0.44} k={phys(tt, 1.4, 8, 0.45)} />
    {/* chispas en la resistencia: saltan de a una, cambian de lugar cada medio segundo */}
    {[0, 1, 2].map((j) => { const s = Math.floor(tt * 2 + j * 0.33), z = 0.2 + 0.6 * rn(s, j + 11), k2 = ek * Math.sin(PI * ((tt * 2 + j * 0.33) % 1)); return <group key={"sp" + j} position={[-0.06, 0.03 + PY + 0.02 * rn(s, j + 4), z]} scale={Math.max(0.001, k2)}>{[0, 1, 2, 3].map((q) => <mesh key={q} rotation={[q * 0.8, 0, q * 0.8]}><boxGeometry args={[0.035, 0.003, 0.003]} /><meshBasicMaterial color="#ffe28a" toneMapped={false} /></mesh>)}</group>; })}
  </>;
}}</Scene3D>;

// ---- 2:04 · CAÑO DE COBRE CON ALETAS: el tubo gira en primer plano, el calor pasa del cobre a las aletas y el aire sube entre ellas ----
export const HFinTube: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[-0.8, 1.2, 1.4]}
  cam={{ at: [0.0, 0.02, 0.0], az: [-0.7, -0.35], el: [0.28, 0.2], r: [0.95, 0.85], fov: 32 }}>{(tt) => {
  const hk = eio(tt, 0.8, 2.6), N = 30;
  return <group rotation={[0, 0.2 * Math.sin(tt * 0.3), 0]}>
    <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.62, 28]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.28} emissive="#ff5a1a" emissiveIntensity={0.25 * hk} /></mesh>
    {Array.from({ length: N }, (_, i) => { const x = -0.24 + i * (0.48 / (N - 1)), hot = cl(hk * 1.3 - Math.abs(x) * 0.6);
      return <RBox key={i} s={[0.003, 0.13, 0.13]} p={[x, 0, 0]} r={0.003}><meshStandardMaterial color={new THREE.Color("#b9bec4").lerp(new THREE.Color("#ff9a52"), hot * 0.4)} metalness={0.6} roughness={0.32} /></RBox>; })}
    <Puffs tt={tt} n={10} a={[-0.12, -0.12, 0]} b={[-0.12, 0.2, 0]} r={0.008} col="#ffd0a0" op={0.22 * hk} v={0.45} />
    <Puffs tt={tt + 0.4} n={10} a={[0.12, -0.12, 0]} b={[0.12, 0.2, 0]} r={0.008} col="#ffd0a0" op={0.22 * hk} v={0.45} />
    <Tape txt="COPPER PIPE" p={[-0.1, -0.11, 0.1]} rot={[0, -0.5, 0]} w={0.16} k={phys(tt, 1.6, 8, 0.45)} />
    <Tape txt="ALUMINUM FINS" p={[0.06, 0.11, 0.1]} rot={[0, -0.5, 0]} w={0.18} k={phys(tt, 2.4, 8, 0.45)} />
  </group>;
}}</Scene3D>;

// ---- 3:29 · CABLES Y NINGÚN CAÑO = ELÉCTRICO (rehecho r2): de cerca sobre empapelado azul; la tapa de punta se abre, adentro hay
// cables con capuchones naranjas y una resistencia negra; el buscapolo se acerca y late rojo, y la moneda llega, no tiene dónde entrar y se va ----
const pkPaper = () => tex.text("pk_wp2", 1024, 512, (g) => {
  g.fillStyle = "#56708a"; g.fillRect(0, 0, 1024, 512);
  for (let x = 0; x < 1024; x += 40) { g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(x, 0, 18, 512); g.fillStyle = "rgba(20,30,50,.14)"; g.fillRect(x + 18, 0, 2, 512); }
  for (let i = 0; i < 26 * 13; i++) { const cx = (i % 26) * 40 + 29, y = Math.floor(i / 26) * 40 + 20 + ((i % 26) % 2) * 20; g.fillStyle = "rgba(230,214,170,.32)"; g.beginPath(); g.ellipse(cx, y, 3, 6, 0, 0, 6.3); g.fill(); }
});
export const HPeekCap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#16191e" key1={[-0.6, 1.3, 1.3]} warm={0.8}
  cam={{ at: [-0.2, 0.12, 0.06], az: [-0.78, -0.46], el: [0.22, 0.15], r: [0.66, 0.58], fov: 32 }}>{(tt) => {
  const cap = eio(tt, 0.3, 1.3), pen = eio(tt, 1.4, 2.6), beep = cl((tt - 2.5) * 3) * (1 - eio(tt, 4.6, 5.2)), pulse = 0.5 + 0.5 * Math.sin((tt - 2.5) * PI * 2 * 1.5);
  const coinIn = eio(tt, 3.0, 3.9), coinOut = eio(tt, 4.5, 5.6), no = phys(tt, 3.9, 7, 0.5) * (1 - eio(tt, 5.6, 6.0));
  const L = 0.6, X0 = 0.1, ex = X0 - L / 2;
  return <>
    <mesh position={[-0.1, 0.45, -0.006]} receiveShadow><planeGeometry args={[2.0, 1.0]} /><meshStandardMaterial map={pkPaper()} roughness={0.85} /></mesh>
    <RBox s={[3, 0.05, 0.012]} p={[0, 0.025, 0.0]} r={0.003}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>
    <Baseboard len={L} p={[X0, 0, 0]} elec capL={cap} col="#f1ece2">
      {/* capuchones naranjas en las puntas de los cables y el cable de cobre desnudo */}
      {[[-L / 2 + 0.005, PY + 0.072, BD / 2 + 0.034, 0.5], [-L / 2 + 0.03, PY + 0.07, BD / 2 + 0.04, -0.3]].map(([x, y, z, r], i) => <group key={i} position={[x, y, z]} rotation={[0, 0, r]}>
        <mesh><coneGeometry args={[0.009, 0.022, 16]} />{M.plastic({ col: "#e8742a" })}</mesh></group>)}
      <mesh geometry={tubeG("pkcu", [[-L / 2 + 0.04, PY + 0.02, BD / 2 + 0.02], [-L / 2 + 0.02, PY + 0.05, BD / 2 + 0.045], [-L / 2 - 0.01, PY + 0.035, BD / 2 + 0.04], [-L / 2 - 0.025, 0.0, BD / 2 + 0.01]], 0.0022)}><meshStandardMaterial color="#c47a3e" metalness={0.9} roughness={0.3} /></mesh>
    </Baseboard>
    {/* buscapolo: entra desde la derecha y su punta late roja (1,5 Hz) junto al cable negro */}
    <group position={[lerp(0.35, ex + 0.06, pen), lerp(0.3, PY + 0.1, pen), lerp(0.25, BD / 2 + 0.07, pen)]} rotation={[0, 0, 1.25]}>
      <RBox s={[0.022, 0.13, 0.022]} p={[0, 0.07, 0]} r={0.009}>{M.plastic({ col: "#f2c418" })}</RBox>
      <RBox s={[0.023, 0.03, 0.023]} p={[0, 0.0, 0]} r={0.008}>{M.plastic({ col: "#2c2e31" })}</RBox>
      <mesh position={[0, -0.025, 0]}><coneGeometry args={[0.009, 0.03, 18]} /><meshStandardMaterial color="#ff3a2a" emissive="#ff2a1a" emissiveIntensity={0.2 + 1.1 * beep * pulse} toneMapped={false} transparent opacity={0.9} /></mesh>
      <RBox s={[0.006, 0.04, 0.003]} p={[0.0, 0.1, 0.012]} r={0.002}>{M.steel()}</RBox>
      <pointLight position={[0, -0.04, 0.02]} intensity={0.05 * beep * pulse} distance={0.35} color="#ff3a2a" />
    </group>
    {/* la moneda llega buscando una purga que no existe, y se va */}
    <group position={[lerp(0.45, ex + 0.2, coinIn) + 0.4 * coinOut, PY + 0.1 + 0.02 * Math.sin(tt * 2.2), BD / 2 + 0.13]} visible={coinIn > 0.001 && coinOut < 0.999}>
      <Coin rot={[PI / 2, 0, tt * 1.5]} s={2.6} />
      <group position={[0, 0, 0.012]} scale={Math.max(0.001, no)} visible={no > 0.01}>
        <mesh><ringGeometry args={[0.034, 0.043, 40]} /><meshBasicMaterial color="#d33a2c" toneMapped={false} side={THREE.DoubleSide} /></mesh>
        <mesh rotation={[0, 0, -PI / 4]}><planeGeometry args={[0.076, 0.008]} /><meshBasicMaterial color="#d33a2c" toneMapped={false} side={THREE.DoubleSide} /></mesh>
      </group>
    </group>
    <Tape txt="WIRES, NO PIPE = ELECTRIC" p={[-0.13, 0.25, 0.02]} w={0.3} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.8)} />
    <Tape txt="NOTHING TO BLEED" col="#b3261e" p={[0.19, 0.25, 0.02]} w={0.18} k={phys(tt, 3.9, 8, 0.45)} rev={cl((tt - 3.9) / 0.6)} />
  </>;
}}</Scene3D>;

// ---- 3:49 · UN SOLO LAZO, UNO DETRÁS DEL OTRO: plano de la planta; el agua sale de la caldera y recorre los zócalos en fila ----
const ROOMS: [number, number, number, number][] = [[-0.55, 0.3, 0.5, 0.4], [0.0, 0.3, 0.5, 0.4], [0.55, 0.3, 0.5, 0.4], [-0.27, -0.15, 0.6, 0.45], [0.38, -0.15, 0.6, 0.45]];
const LOOP: V3[] = [[0.62, 0.02, -0.38], [0.62, 0.02, -0.06], [0.75, 0.02, -0.06], [0.75, 0.02, 0.45], [0.2, 0.02, 0.45], [-0.2, 0.02, 0.45], [-0.75, 0.02, 0.45], [-0.75, 0.02, 0.1], [-0.55, 0.02, 0.1], [-0.55, 0.02, -0.36], [0.55, 0.02, -0.36]];
export const HLoopZone: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" key1={[0, 2.4, 1.0]}
  cam={{ at: [0.0, 0.0, 0.04], az: [-0.3, 0.2], el: [1.02, 0.86], r: [1.8, 1.56], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.6, 1.4), lit = tt * 0.13;
  const BB: V3[] = [[0.75, 0.02, 0.2], [0.45, 0.02, 0.45], [-0.15, 0.02, 0.45], [-0.75, 0.02, 0.3], [-0.55, 0.02, -0.15]];
  return <>
    <mesh rotation={[-PI / 2, 0, 0]} receiveShadow><planeGeometry args={[2.0, 1.2]} /><meshStandardMaterial color="#d9cdb4" roughness={0.9} /></mesh>
    {ROOMS.map((r, i) => <group key={i}>{[[r[0], r[1] + r[3] / 2, r[2], 0.012], [r[0], r[1] - r[3] / 2, r[2], 0.012], [r[0] - r[2] / 2, r[1], 0.012, r[3]], [r[0] + r[2] / 2, r[1], 0.012, r[3]]].map((w, j) =>
      <RBox key={j} s={[w[2], 0.06, w[3]]} p={[w[0], 0.03, -w[1]]} r={0.003}><meshStandardMaterial color="#efe7d6" roughness={0.8} /></RBox>)}</group>)}
    <Boiler p={[0.5, 0, -0.42]} s={0.28} fire={0.6} />
    {/* el caño del lazo */}
    {LOOP.slice(1).map((b, i) => <Cu key={i} a={LOOP[i]} b={b} r={0.009} />)}
    {BB.map((p, i) => <RBox key={i} s={i === 1 || i === 2 ? [0.22, 0.035, 0.04] : [0.04, 0.035, 0.22]} p={[p[0], 0.02, p[2]]} r={0.006}><meshStandardMaterial color="#e7dfcf" roughness={0.4} emissive="#ff7a2e" emissiveIntensity={1.6 * cl((lit * 6 - i) * 1.5) * k} /></RBox>)}
    <FlowDots tt={tt} pts={LOOP.map((p) => [p[0], 0.04, p[2]] as V3)} n={40} v={0.1} r={0.008} col="#ff9a4a" k={k} />
    <Tape txt="ONE LOOP, ONE AFTER ANOTHER" p={[0.06, 0.12, 0.2]} rot={[-1.0, 0, 0]} w={0.9} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 4:34 · LA BURBUJA TAPA EL AGUA PARA TODOS LOS QUE SIGUEN (rehecho r2): un caño de vidrio en diagonal, a ras del caño; el agua
// caliente corre en granitos naranjas, una burbuja plateada entra y se clava; detrás se amontona el agua y, adelante, las tres
// tandas de aletas se apagan una tras otra de naranja a azul ----
const BA = [-0.95, 0.12, 0.32], BB = [0.95, 0.12, -0.42];
const bAt = (s: number): V3 => [lerp(BA[0], BB[0], s), lerp(BA[1], BB[1], s), lerp(BA[2], BB[2], s)];
const BANG = Math.atan2(-(BB[2] - BA[2]), BB[0] - BA[0]);
export const HBubbleBlock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="dark" wall="none" bg="#0d1620" key1={[-0.4, 1.5, 1.2]}
  cam={{ at: [-0.08, 0.14, 0.0], az: [-0.62, -0.44], el: [0.2, 0.15], r: [1.05, 0.95], fov: 32 }}>{(tt) => {
  const TS = 2.0, SB = 0.42, bs = tt < TS ? lerp(0.0, SB, eio(tt, 0.4, TS)) : SB, wob = tt > TS ? 0.12 * Math.exp(-(tt - TS) * 1.2) * Math.sin((tt - TS) * 9) : 0;
  const N = 34, v = 0.16;
  const nat = (i: number, x: number) => (x * v + i / N) % 1;
  const dots = Array.from({ length: N }, (_, i) => {
    if (tt < TS) return { s: nat(i, tt), op: 1 };
    const s0 = nat(i, TS);
    if (s0 > SB) { const s = s0 + (tt - TS) * v * Math.exp(-(tt - TS) * 0.6); return { s, op: cl(1 - (tt - TS) * 0.35) * (s < 1 ? 1 : 0) }; }
    return { s: s0, op: 1, up: true };
  });
  const up = dots.map((d, i) => ({ d, i })).filter((o) => o.d.up).sort((a, b) => b.d.s - a.d.s);
  up.forEach((o, k) => { const fin = SB - 0.035 - 0.016 * k, q = 1 - Math.exp(-(tt - TS) * 1.3); o.d.s = Math.max(0.0, lerp(o.d.s, Math.max(0.02, fin), q)); });
  const FS = [0.2, 0.6, 0.74, 0.88], heat = (j: number) => j === 0 ? 1 : 1 - eio(tt, TS + 0.4 + (j - 1) * 0.7, TS + 1.5 + (j - 1) * 0.7);
  return <>
    {/* caño de vidrio con agua y cuplas de bronce */}
    <group position={bAt(0.5)} rotation={[0, BANG, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.036, 0.036, 2.1, 40, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.031, 0.031, 2.08, 32]} />{M.water({ op: 0.22, col: "#6fb4e6" })}</mesh>
      {[-0.5, 0.05, 0.55].map((x, i) => <mesh key={i} position={[x * 2.1 * 0.5 * 1.6, 0, 0]} rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.043, 0.043, 0.05, 32]} />{M.brass({ col: "#c99a45" })}</mesh>)}
      {/* tandas de aletas: la de antes de la burbuja sigue caliente; las de después se enfrían en cadena */}
      {FS.map((s, j) => { const x = (s - 0.5) * 2.1 * 0.9, k = heat(j); return <group key={j} position={[x, 0, 0]}>
        {Array.from({ length: 11 }, (_, q) => <RBox key={q} s={[0.0025, 0.12, 0.12]} p={[-0.07 + q * 0.014, 0, 0]} r={0.003}>
          <meshStandardMaterial color={new THREE.Color("#6f9be0").lerp(new THREE.Color("#ff8a3a"), k)} metalness={0.55} roughness={0.32} emissive={k > 0.5 ? "#ff5a12" : "#1c3c7a"} emissiveIntensity={k > 0.5 ? 0.35 * k : 0.3 * (1 - k)} /></RBox>)}
      </group>; })}
    </group>
    {/* el agua caliente: granitos que corren, se amontonan detrás de la burbuja y adelante se van */}
    {dots.map((d, i) => d.op > 0.02 && d.s >= 0 && d.s <= 1 ? <mesh key={i} position={bAt(d.s * 0.9 + 0.05)}><sphereGeometry args={[0.011, 10, 8]} /><meshBasicMaterial color="#ffa25a" transparent opacity={d.op} toneMapped={false} /></mesh> : null)}
    {/* la burbuja de aire: llena el caño de lado a lado */}
    <group position={bAt(bs * 0.9 + 0.05)} rotation={[0, BANG, 0]} scale={[1 + wob, 1 - wob * 0.5, 1 - wob * 0.5]} visible={tt > 0.4}>
      <mesh rotation={[0, 0, PI / 2]}><capsuleGeometry args={[0.028, 0.09, 10, 24]} /><meshPhysicalMaterial color="#f4f9ff" metalness={0.55} roughness={0.03} clearcoat={1} /></mesh>
    </group>
    <Tape txt="THE WATER STOPS WHERE THE AIR IS" p={[0.12, 0.3, -0.12]} rot={[0, -0.5, 0]} w={0.5} k={phys(tt, 1.3, 8, 0.45)} rev={cl((tt - 1.3) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 4:53 · EL AIRE SUBE AL PUNTO MÁS ALTO (rehecho r3): pared de ladrillo encalado con una puerta; el caño la rodea por arriba;
// las burbujas entran por los dos lados, trepan por los caños verticales y se juntan arriba en una bolsa de aire que crece ----
export const HHighPoint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#14171b" key1={[-0.8, 2.0, 1.6]} warm={0.85}
  cam={{ at: [0.0, 0.6, 0.0], az: [-0.36, -0.12], el: [0.06, 0.12], r: [2.1, 1.86], fov: 32 }}>{(tt) => {
  const Y = 0.98, P: V3[] = [[-0.9, 0.1, 0.05], [-0.4, 0.1, 0.05], [-0.4, Y, 0.05], [0.4, Y, 0.05], [0.4, 0.1, 0.05], [0.9, 0.1, 0.05]];
  const path = (side: number, q: number, xs: number): V3 => { const s = side < 0 ? -1 : 1, a = 0.5, b = Y - 0.1, c = Math.abs(0.4 - Math.abs(xs)), tot = a + b + c, d = q * tot;
    if (d < a) return [s * (0.9 - d), 0.1, 0.05]; if (d < a + b) return [s * 0.4, 0.1 + (d - a), 0.05]; return [s * (0.4 - (d - a - b)), Y, 0.05]; };
  const N = 10, arrived = Array.from({ length: N }, (_, i) => cl((tt - 0.5 - i * 0.38) / 1.7)).filter((q) => q >= 1).length, pocket = Math.max(0.001, 0.25 + arrived * 0.12);
  return <>
    <mesh position={[0, 0.7, -0.03]} receiveShadow><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={brick("hp", [200, 204, 210], "#ece9e2")} roughness={0.95} /></mesh>
    {/* la puerta con su marco */}
    <RBox s={[0.6, 0.86, 0.02]} p={[0, 0.43, -0.012]} r={0.005}><meshStandardMaterial map={tex.wood(1, 3, [70, 46, 30])} roughness={0.55} /></RBox>
    {[-0.12, 0.12].map((x, i) => <RBox key={"p" + i} s={[0.2, 0.32, 0.01]} p={[x, 0.6, 0.0]} r={0.01}><meshStandardMaterial color="#5a3c26" roughness={0.5} /></RBox>)}
    {[-1, 1].map((s) => <RBox key={s} s={[0.06, 0.9, 0.04]} p={[s * 0.33, 0.45, 0.01]} r={0.006}><meshStandardMaterial color="#2f3e4a" roughness={0.5} /></RBox>)}
    <RBox s={[0.72, 0.06, 0.04]} p={[0, 0.9, 0.01]} r={0.006}><meshStandardMaterial color="#2f3e4a" roughness={0.5} /></RBox>
    <mesh position={[0.2, 0.42, 0.02]}><sphereGeometry args={[0.022, 16, 12]} />{M.brass()}</mesh>
    {P.slice(1).map((b, i) => <Cu key={i} a={P[i]} b={b} r={0.02} />)}
    <FlowDots tt={tt} pts={P.map((p) => [p[0], p[1], p[2] + 0.022] as V3)} n={40} v={0.1} r={0.006} col="#ffa060" k={cl(tt - 0.3)} />
    {/* burbujas que trepan por los dos lados */}
    {Array.from({ length: N }, (_, i) => { const q = cl((tt - 0.5 - i * 0.38) / 1.7), side = i % 2 ? 1 : -1, xs = side * (0.03 + 0.03 * (i >> 1));
      if (q <= 0 || q >= 1) return null; const p = path(side, eio(q, 0, 1), xs);
      return <mesh key={i} position={[p[0], p[1], 0.075]}><sphereGeometry args={[0.024, 14, 12]} /><meshPhysicalMaterial color="#eef6ff" emissive="#9fd2ff" emissiveIntensity={0.45} metalness={0.5} roughness={0.04} clearcoat={1} /></mesh>; })}
    {/* la bolsa de aire arriba: crece con cada burbuja que llega */}
    <mesh position={[0, Y + 0.004, 0.072]} scale={[pocket * 4, 1, 1]} visible={arrived > 0}><sphereGeometry args={[0.024, 24, 14]} /><meshPhysicalMaterial color="#f4f9ff" emissive="#b5dcff" emissiveIntensity={0.5} metalness={0.4} roughness={0.03} clearcoat={1} transparent opacity={0.9} /></mesh>
    <Puffs tt={tt} n={8} a={[-0.4, 0.12, 0.08]} b={[-0.4, 0.96, 0.08]} r={0.01} col="#eef6ff" op={0.8 * cl(tt - 0.4)} v={0.45} wob={0.004} />
    <Puffs tt={tt + 0.5} n={8} a={[0.4, 0.12, 0.08]} b={[0.4, 0.96, 0.08]} r={0.01} col="#eef6ff" op={0.8 * cl(tt - 0.4)} v={0.45} wob={0.004} />
    <Tape txt="AIR CLIMBS TO THE HIGH SPOT" col="#23384a" p={[0.0, 0.3, 0.07]} w={0.86} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 5:09 · EL AGUA NUEVA TRAE AIRE: una olla al fuego hace burbujitas en el fondo, y el caño con agua nueva hace las mismas ----
export const HPotBubbles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile" key1={[-0.8, 1.6, 1.3]}
  cam={{ at: [0.0, 0.14, 0.0], az: [-0.22, 0.05], el: [0.3, 0.24], r: [1.05, 0.92], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.4, 2.0);
  return <>
    {/* hornalla y olla de vidrio para ver adentro */}
    <group position={[-0.24, 0, 0]}>
      <mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.12, 0.12, 0.012, 36]} /><meshStandardMaterial color="#1b1b1c" roughness={0.5} /></mesh>
      <mesh position={[0, 0.014, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.1, 40]} /><meshBasicMaterial color="#ff5a2a" toneMapped={false} transparent opacity={0.6 * k} /></mesh>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.11, 0.1, 0.17, 40, 1, true]} />{M.glass({ op: 0.18 })}</mesh>
      <mesh position={[0, 0.16, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.108, 36]} />{M.water({ op: 0.45 })}</mesh>
      <Bubbles tt={tt} n={Math.round(30 * k) + 2} box={[0.17, 0.14, 0.17]} p={[0, 0.02, 0]} v={0.05} r={0.004} />
    </group>
    {/* caño de vidrio con agua recién llenada: las mismas burbujitas se pegan arriba */}
    <group position={[0.22, 0.12, 0]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.035, 0.035, 0.34, 32, 1, true]} />{M.glass({ op: 0.2 })}</mesh>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.032, 0.032, 0.34, 32]} />{M.water({ op: 0.35 })}</mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-0.15 + rn(i, 1) * 0.3, lerp(-0.02, 0.026, cl(k * 1.5 - rn(i, 2) * 0.5)), (rn(i, 3) - 0.5) * 0.03]} scale={k}><sphereGeometry args={[0.004 + 0.003 * rn(i, 4), 10, 8]} /><meshPhysicalMaterial color="#f2f8ff" roughness={0.04} clearcoat={1} transparent opacity={0.85} /></mesh>)}
    </group>
    <Tape txt="NEW WATER BRINGS AIR" p={[0.0, 0.33, 0.04]} w={0.42} k={phys(tt, 1.1, 8, 0.45)} rev={cl((tt - 1.1) / 0.8)} />
  </>;
}}</Scene3D>;
