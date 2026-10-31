// ohf30d · componentes únicos 37-43 (cuándo llamar, el frío de verdad, el hábito de cada otoño y el cierre)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Card, Cup, Gauge, Puffs, Rag, Tape, dialTex } from "./okit";
import { BD, BH, BallValve, Baseboard, Boiler, Coin, CoinVent, Cu, PY } from "./bbkit";

const PI = Math.PI;
type V3 = [number, number, number];

// ---- 22:54 · SI HAY QUE AGREGAR AGUA UNA Y OTRA VEZ, HAY UNA PÉRDIDA (rehecho r2): el sótano en corte bajo el piso; la aguja cae, la
// llave azul rellena y una tiza suma rayitas en la caldera; una linterna barre las vigas y encuentra la junta que gotea sobre un charco ----
const lhTally = (n: number) => tex.text("lh_tally" + n, 256, 160, (g) => {
  g.fillStyle = "#2a2d2b"; g.fillRect(0, 0, 256, 160); g.strokeStyle = "#8a6a44"; g.lineWidth = 10; g.strokeRect(5, 5, 246, 150);
  g.fillStyle = "#f2f0e6"; g.font = "700 30px Arial"; g.textAlign = "center"; g.fillText("REFILLS", 128, 46);
  g.strokeStyle = "#f2f0e6"; g.lineWidth = 7; g.lineCap = "round";
  for (let i = 0; i < n; i++) { if (i === 4) { g.beginPath(); g.moveTo(40, 120); g.lineTo(178, 72); g.stroke(); continue; } const x = 52 + i * 34; g.beginPath(); g.moveTo(x, 70); g.lineTo(x + 4, 130); g.stroke(); }
});
const D30L = () => dialTex("lh30", 30, 12, 15, "PSI", 27);
export const HLeakHunt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#0c0d10" key1={[-0.7, 1.6, 1.5]} warm={0.7}
  cam={{ at: [-0.03, 0.12, 0.0], az: [-0.18, -0.04], el: [0.12, 0.08], r: [1.4, 1.3], fov: 32 }}>{(tt) => {
  // la presión cae y se rellena: tres ciclos; cada relleno suma una rayita
  const cyc = [0.9, 2.3, 3.7], fills = cyc.filter((c) => tt > c + 0.25).length + 1;
  let p = 12; for (const c of cyc) { if (tt > c - 1.1 && tt <= c) p = lerp(12, 6, eio(tt, c - 1.1, c)); else if (tt > c && tt <= c + 0.3) p = lerp(6, 12, eio(tt, c, c + 0.3)); }
  const lever = cyc.reduce((m, c) => Math.max(m, cl(1 - Math.abs(tt - c - 0.12) / 0.2)), 0);
  const sweep = lerp(-0.9, 0.0, eio(tt, 2.4, 4.0)), found = phys(tt, 4.1, 7, 0.5), pud = eio(tt, 0.4, 5.6), drip = (tt * 1.1) % 1;
  const JX = 0.42, JY = 0.2;
  return <>
    {/* el piso de arriba en corte: tablas, vigas y la pared del sótano en bloques */}
    <RBox s={[1.6, 0.03, 0.4]} p={[0.1, 0.36, 0]} r={0.004}><meshStandardMaterial map={tex.wood(4, 1, [150, 104, 64])} roughness={0.6} /></RBox>
    {[-0.5, -0.1, 0.3, 0.7].map((x, i) => <RBox key={i} s={[0.05, 0.12, 0.4]} p={[x, 0.29, 0]} r={0.003}><meshStandardMaterial map={tex.wood(1, 1, [176, 132, 84])} roughness={0.8} /></RBox>)}
    <mesh position={[0.1, 0.18, -0.2]}><planeGeometry args={[1.6, 0.5]} /><meshStandardMaterial map={tex.tile(8, 3, "#8c8a84", "#5a5852")} roughness={0.9} /></mesh>
    <mesh rotation={[-PI / 2, 0, 0]} position={[0.1, -0.07, 0.1]} receiveShadow><planeGeometry args={[1.6, 0.8]} /><meshStandardMaterial color="#5d5b57" roughness={0.85} /></mesh>
    {/* la caldera con su manómetro y la pizarra de tiza */}
    <Boiler p={[-0.5, -0.07, 0.0]} s={0.5} fire={0.5} />
    <Gauge v={p} max={30} tx={D30L()} p={[-0.5, 0.2, 0.135]} r={0.07} />
    <mesh position={[-0.26, 0.05, 0.03]}><planeGeometry args={[0.16, 0.1]} /><meshStandardMaterial map={lhTally(fills)} roughness={0.9} /></mesh>
    {/* la llave de llenado azul que se abre en cada relleno */}
    <Cu a={[-0.38, 0.12, 0.05]} b={[JX + 0.3, 0.12, 0.05]} r={0.014} />
    <group position={[-0.3, 0.12, 0.05]}><mesh castShadow><sphereGeometry args={[0.022, 16, 12]} />{M.brass()}</mesh>
      <group position={[0, 0.025, 0]} rotation={[0, lever * PI / 2, 0]}><RBox s={[0.07, 0.008, 0.014]} p={[0.03, 0, 0]} r={0.004}>{M.rubber({ col: "#2a62b0" })}</RBox></group></group>
    <Cu a={[JX - 0.1, 0.12, 0.05]} b={[JX - 0.1, JY, 0.05]} r={0.012} /><Cu a={[JX - 0.1, JY, 0.05]} b={[JX + 0.2, JY, 0.05]} r={0.012} />
    {/* la junta que pierde, la gota y el charco que crece */}
    <mesh position={[JX, JY, 0.05]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.035, 20]} />{M.brass({ col: "#b8892f" })}</mesh>
    <mesh position={[JX, JY - 0.025 - drip * drip * 0.24, 0.05]} scale={[1, 1 + drip, 1]}><sphereGeometry args={[0.007, 12, 10]} />{M.water({ op: 0.9 })}</mesh>
    <mesh position={[JX, -0.068, 0.05]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, 0.3 + 0.7 * pud)}><circleGeometry args={[0.1, 40]} /><meshPhysicalMaterial color="#6a8aa6" transparent opacity={0.6} roughness={0.05} clearcoat={1} /></mesh>
    <mesh position={[JX, -0.067, 0.05]} rotation={[-PI / 2, 0, 0]} scale={0.02 + drip * 0.06} visible={drip > 0.05}><ringGeometry args={[0.8, 1, 32]} /><meshBasicMaterial color="#cfe6ff" transparent opacity={0.5 * (1 - drip)} /></mesh>
    {/* el círculo de la linterna barre las vigas y se queda en la junta */}
    <mesh position={[lerp(-0.4, JX, cl((sweep + 0.9) / 0.9)), JY + 0.01, 0.05]} rotation={[0, 0, 0]}><circleGeometry args={[0.08, 32]} /><meshBasicMaterial color="#fff2c8" transparent opacity={0.22} toneMapped={false} depthWrite={false} /></mesh>
    <group position={[JX, JY, 0.08]} scale={Math.max(0.001, found)} visible={found > 0.01}><mesh><ringGeometry args={[0.045, 0.055, 40]} /><meshBasicMaterial color="#d33a2c" toneMapped={false} side={THREE.DoubleSide} /></mesh></group>
    <Tape txt="ADDING WATER OVER AND OVER = A LEAK" p={[0.06, 0.44, 0.05]} w={0.62} k={phys(tt, 0.8, 8, 0.45)} rev={cl((tt - 0.8) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 23:34 · UNA ETIQUETA EN CADA VÁLVULA (rehecho r2): el múltiple sobre un tablero de terciado; de cada válvula cuelga una
// etiqueta de cartón con ojal, y un marcador negro salta de una a otra y las escribe en letra grande, una por una ----
const TAGS = [["ZONE 1", "DOWNSTAIRS"], ["ZONE 2", "UPSTAIRS"], ["PURGE", "HOSE HERE"]];
const vtTag = (i: number, q: number) => tex.text(`vt2_${i}_${q}`, 512, 340, (g) => {
  g.fillStyle = "#e3c98f"; g.beginPath(); g.moveTo(70, 0); g.lineTo(512, 0); g.lineTo(512, 340); g.lineTo(70, 340); g.lineTo(0, 260); g.lineTo(0, 80); g.closePath(); g.fill();
  g.fillStyle = "rgba(120,80,30,.18)"; for (let k = 0; k < 40; k++) g.fillRect((k * 53) % 512, (k * 97) % 340, 3, 3);
  g.fillStyle = "#f6efdc"; g.beginPath(); g.arc(48, 170, 22, 0, 6.3); g.fill(); g.strokeStyle = "#b08a4a"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "#1b1b1b"; g.font = "900 78px Arial"; g.textAlign = "center";
  TAGS[i].forEach((s, j) => { const part = cl(q / 8 * 2 - j); if (part <= 0) return; g.save(); g.beginPath(); g.rect(90, 0, 422 * part, 340); g.clip(); g.font = j === 0 ? "900 92px Arial" : "800 52px Arial"; g.fillText(s, 300, j === 0 ? 150 : 250); g.restore(); });
});
export const HValveTags: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#15130f" key1={[-0.6, 1.4, 1.4]} warm={0.85}
  cam={{ at: [0.0, 0.24, 0.0], az: [-0.3, -0.1], el: [0.12, 0.08], r: [0.98, 0.9], fov: 32 }}>{(tt) => {
  const X = [-0.27, 0.0, 0.27], W0 = (i: number) => 0.5 + i * 1.4;
  const wr = (i: number) => cl((tt - W0(i)) / 1.0);
  // el marcador: escribe cada etiqueta y salta en arco a la siguiente
  const seg = Math.min(2, Math.max(0, Math.floor((tt - 0.5) / 1.4))), lt = tt - W0(seg), writing = lt < 1.0;
  const tx0 = X[seg] + 0.01 + 0.12 * cl(lt), hop = cl((lt - 1.0) / 0.4), nx = seg < 2 ? X[seg + 1] + 0.01 : X[seg] + 0.2;
  const mx = writing ? tx0 + 0.01 * Math.sin(lt * 40) : lerp(X[seg] + 0.13, nx, eio(hop, 0, 1)), my = writing ? 0.22 - 0.05 * (lt > 0.5 ? 1 : 0) : 0.22 + 0.12 * Math.sin(PI * hop);
  const gone = eio(tt, 4.6, 5.4);
  return <>
    <RBox s={[1.3, 0.62, 0.02]} p={[0, 0.27, -0.06]} r={0.004}><meshStandardMaterial map={tex.wood(3, 1, [196, 160, 112])} roughness={0.75} /></RBox>
    <Cu a={[-0.5, 0.42, 0]} b={[0.5, 0.42, 0]} r={0.02} />
    {X.map((x, i) => { const sw = 0.12 * Math.sin(tt * 2.2 + i) * Math.exp(-Math.max(0, tt - 0.3 - i * 0.3) * 0.5), k = phys(tt, 0.2 + i * 0.25, 8, 0.5);
      return <group key={i}>
        <Cu a={[x, 0.42, 0]} b={[x, -0.05, 0]} r={0.016} />
        <BallValve p={[x, 0.33, 0]} rot={[0, 0, PI / 2]} open={1} s={1.2} col={i === 2 ? "#2a62b0" : "#c2302a"} />
        <group position={[x + 0.02, 0.29, 0.035]} rotation={[0, 0, sw]} scale={Math.max(0.001, k)}>
          <mesh geometry={tubeG("vt2str" + i, [[0, 0, 0], [0.004, -0.04, 0.003], [-0.009, -0.088, 0]], 0.0013, 16, 6)}><meshStandardMaterial color="#d8d0bd" /></mesh>
          <mesh position={[0.06, -0.09, 0]} castShadow><planeGeometry args={[0.17, 0.113]} /><meshStandardMaterial map={vtTag(i, Math.round(wr(i) * 8))} roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>; })}
    {/* marcador negro de punta gruesa */}
    <group position={[mx + 0.02, my + 0.02 + 0.3 * gone, 0.07]} rotation={[0.3, 0, -0.5]} visible={gone < 0.99}>
      <RBox s={[0.022, 0.12, 0.022]} p={[0, 0.06, 0]} r={0.009}>{M.plastic({ col: "#1d1e20" })}</RBox>
      <RBox s={[0.024, 0.012, 0.024]} p={[0, 0.12, 0]} r={0.006}>{M.plastic({ col: "#e8e4da" })}</RBox>
      <mesh position={[0, -0.006, 0]}><coneGeometry args={[0.009, 0.018, 14]} />{M.plastic({ col: "#111" })}</mesh>
    </group>
    <Tape txt="TAG THEM WHILE THE TECH IS THERE" p={[0.0, 0.035, 0.06]} w={0.5} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.9)} />
  </>;
}}</Scene3D>;

// ---- 24:25 · LA PARED DE AFUERA: corte de la esquina; la nieve afuera, la escarcha entra por la pared y el tramo de caño pegado al exterior se congela ----
export const HColdWall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#11151a" key1={[-0.6, 1.6, 1.4]} warm={0.9}
  cam={{ at: [0.05, 0.3, 0.1], az: [-0.95, -0.7], el: [0.12, 0.08], r: [1.25, 1.05], fov: 32 }}>{(tt) => {
  const fr = eio(tt, 0.5, 5.4), fall = cl((tt - 0.4) * 2);
  return <>
    {/* pared exterior gris-azulada con una ventana fría arriba del zócalo */}
    <mesh position={[0, 0.5, -0.012]}><planeGeometry args={[2, 1.0]} /><meshStandardMaterial color="#c9c3b6" roughness={0.9} /></mesh>
    <RBox s={[0.5, 0.36, 0.04]} p={[0.1, 0.62, -0.01]} r={0.008}><meshStandardMaterial color="#f1ece2" roughness={0.5} /></RBox>
    <mesh position={[0.1, 0.62, 0.012]}><planeGeometry args={[0.44, 0.3]} /><meshBasicMaterial color="#1c2a40" toneMapped={false} /></mesh>
    {Array.from({ length: 16 }, (_, i) => <mesh key={"s" + i} position={[-0.11 + rn(i, 2) * 0.42, 0.76 - ((tt * 0.1 + rn(i, 3)) % 1) * 0.28, 0.013]}><circleGeometry args={[0.004, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>)}
    <RBox s={[0.012, 0.3, 0.012]} p={[0.1, 0.62, 0.016]} r={0.003}><meshStandardMaterial color="#f1ece2" /></RBox>
    {/* la escarcha: una mancha blanca que baja por la pared desde la ventana hasta el zócalo */}
    <mesh position={[0.1, 0.44 - 0.2 * fr, 0.002]} scale={[1, Math.max(0.001, fr), 1]}><planeGeometry args={[0.62, 0.46]} /><meshBasicMaterial map={tex.text("cw_frost", 256, 256, (g) => { const gr = g.createRadialGradient(128, 0, 10, 128, 60, 190); gr.addColorStop(0, "rgba(235,246,255,.95)"); gr.addColorStop(0.6, "rgba(200,228,255,.55)"); gr.addColorStop(1, "rgba(200,228,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 260; i++) { g.strokeStyle = "rgba(255,255,255,.5)"; const x = rn(i, 1) * 256, y = rn(i, 2) * 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8 * (rn(i, 3) - 0.5), y + 8); g.stroke(); } })} transparent depthWrite={false} /></mesh>
    {/* aire frío que cae del vidrio, baja por la pared y corre por el piso */}
    <Puffs tt={tt} n={12} a={[0.1, 0.5, 0.06]} b={[0.12, 0.08, 0.12]} r={0.022} col="#8fc4ff" op={0.5 * fall} v={0.35} wob={0.02} />
    <Puffs tt={tt + 0.7} n={10} a={[0.0, 0.05, 0.16]} b={[-0.5, 0.02, 0.45]} r={0.02} col="#8fc4ff" op={0.45 * fall} v={0.3} wob={0.015} />
    <Baseboard len={1.0} cover={1} capL={1} capR={1} risers={false} heat={(u) => lerp(0.85, 0.85 - fr * 0.85, cl(u * 1.4 - 0.2))} />
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0.15 + i * 0.035, PY - 0.016, BD / 2 + 0.01]} scale={[1, Math.max(0.001, fr * (0.6 + rn(i, 9))), 1]}><coneGeometry args={[0.005, 0.03, 6]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0.05} transmission={0.5} /></mesh>)}
    <Tape txt="OUTSIDE WALLS FREEZE FIRST" col="#2a5c9a" p={[0.42, 0.3, 0.22]} rot={[0, -0.6, 0]} w={0.58} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 24:52 · NUNCA MENOS DE 55: el termostato redondo baja de 68, choca contra el tope en 55 y rebota ----
const thermoTex = () => tex.text("thermo55", 512, 512, (g) => {
  g.fillStyle = "#f1ead9"; g.beginPath(); g.arc(256, 256, 250, 0, PI * 2); g.fill(); g.strokeStyle = "#1b1b1b"; g.fillStyle = "#1b1b1b"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let v = 45; v <= 85; v += 5) { const a = -PI / 2 + (v - 65) * 0.075; g.lineWidth = 6; g.beginPath(); g.moveTo(256 + Math.cos(a) * 200, 256 + Math.sin(a) * 200); g.lineTo(256 + Math.cos(a) * 235, 256 + Math.sin(a) * 235); g.stroke();
    if (v % 10 === 5) { g.font = "700 40px Arial"; g.fillStyle = v === 55 ? "#b3261e" : "#1b1b1b"; g.fillText(String(v), 256 + Math.cos(a) * 160, 256 + Math.sin(a) * 160); } }
});
export const HFiftyFive: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="none" bg="#101318" key1={[-0.5, 1.2, 1.3]}
  cam={{ at: [-0.1, -0.01, 0.0], az: [-0.42, -0.12], el: [0.12, 0.05], r: [0.98, 0.84], fov: 32 }}>{(tt) => {
  const k = eio(tt, 0.6, 4.8), set = lerp(70, 55, k) - (tt > 4.8 ? 1.6 * Math.exp(-(tt - 4.8) * 3) * Math.sin((tt - 4.8) * 14) : 0), a = -(set - 65) * 0.075;
  const wc = "#" + new THREE.Color("#d9c7a6").lerp(new THREE.Color("#a9bccb"), k).getHexString();
  return <>
    {/* la pared se enfría y la escarcha avanza desde la ventana */}
    <mesh position={[0, 0, -0.04]}><planeGeometry args={[2, 1.2]} /><meshStandardMaterial color={wc} roughness={0.9} /></mesh>
    <RBox s={[0.26, 0.34, 0.03]} p={[-0.42, 0.04, -0.03]} r={0.006}><meshStandardMaterial color="#efe9dc" roughness={0.5} /></RBox>
    <mesh position={[-0.42, 0.04, -0.012]}><planeGeometry args={[0.22, 0.3]} /><meshBasicMaterial color="#1d2c44" toneMapped={false} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <mesh key={"s" + i} position={[-0.52 + rn(i, 2) * 0.2, 0.18 - ((tt * 0.09 + rn(i, 3)) % 1) * 0.28, -0.01]}><circleGeometry args={[0.004, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>)}
    <mesh position={[-0.42, 0.04, -0.009]}><planeGeometry args={[0.22, 0.3]} /><meshPhysicalMaterial color="#eef6ff" transparent opacity={0.08 + 0.6 * k} roughness={0.7} /></mesh>
    {Array.from({ length: 34 }, (_, i) => { const d = rn(i, 4) * 0.42, an = rn(i, 5) * PI - PI / 2, on = k * 1.4 - d * 2.2; return on > 0 ? <mesh key={"f" + i} position={[-0.29 + Math.cos(an) * d * 0.4 + d * 0.15, 0.04 + Math.sin(an) * d * 0.5, -0.01]} rotation={[0, 0, rn(i, 6) * 3]} scale={Math.max(0.001, Math.min(1, on) * (0.5 + rn(i, 7)))}><circleGeometry args={[0.012, 6]} /><meshBasicMaterial color="#f2f9ff" transparent opacity={0.75} /></mesh> : null; })}
    <mesh position={[0, 0, -0.03]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 48]} /><meshStandardMaterial color="#d8d2c4" /></mesh>
    <mesh rotation={[PI / 2, 0, 0]} position={[0, 0, -0.02]}><cylinderGeometry args={[0.13, 0.13, 0.03, 48]} /><meshStandardMaterial color="#2a2c30" metalness={0.4} roughness={0.4} /></mesh>
    <mesh position={[0, 0, 0.0]}><circleGeometry args={[0.11, 48]} /><meshStandardMaterial map={thermoTex()} roughness={0.5} /></mesh>
    {/* el aro que barre de 70 a 55, y el tope rojo en 55 */}
    <group rotation={[0, 0, a]}><mesh position={[0, 0.0, 0.006]}><ringGeometry args={[0.113, 0.13, 48]} /><meshStandardMaterial color="#c9b98f" metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[0, 0.122, 0.01]}><coneGeometry args={[0.01, 0.022, 3]} /><meshBasicMaterial color="#b3261e" toneMapped={false} /></mesh></group>
    <group rotation={[0, 0, -(55 - 65) * 0.075]}><RBox s={[0.012, 0.022, 0.02]} p={[0, 0.142, 0.01]} r={0.003}>{M.rubber({ col: "#b3261e" })}</RBox></group>
    <Tape txt={`${Math.round(set)}°`} col="#1f4f8a" p={[0.22, 0.08, 0.04]} w={0.1} k={phys(tt, 0.5, 8, 0.45)} />
    <Tape txt="NEVER BELOW 55°" col="#b3261e" p={[0.0, -0.18, 0.05]} w={0.36} k={phys(tt, 1.4, 8, 0.45)} rev={cl((tt - 1.4) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 25:09 · UNA HORA CADA OTOÑO (rehecho r2): mesa de madera junto a la ventana con el árbol rojo; el timer de cocina arranca en 60
// y gira, y las tres herramientas del ritual (cepillo, manómetro, moneda) saltan una por una y quedan marcadas con su aro verde ----
const fhDial = () => tex.text("fh_dial", 512, 512, (g) => {
  g.fillStyle = "#f4efe4"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill(); g.fillStyle = "#1b1b1b"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let m = 0; m < 60; m += 1) { const a = -PI / 2 + (m / 60) * PI * 2, L = m % 5 === 0 ? 34 : 14; g.lineWidth = m % 5 === 0 ? 7 : 3; g.strokeStyle = "#1b1b1b"; g.beginPath(); g.moveTo(256 + Math.cos(a) * 236, 256 + Math.sin(a) * 236); g.lineTo(256 + Math.cos(a) * (236 - L), 256 + Math.sin(a) * (236 - L)); g.stroke();
    if (m % 10 === 0) { g.font = "900 58px Arial"; g.fillText(String(m === 0 ? 60 : m), 256 + Math.cos(a) * 160, 256 + Math.sin(a) * 160); } }
});
const FH_TOOLS = [["FINS", -0.22], ["PRESSURE", 0.0], ["BLEED", 0.22]] as const;
const D30F = () => dialTex("fh30", 30, 12, 15, "PSI", 27);
export const HFallHour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#1a120c" key1={[-0.5, 1.3, 1.0]} warm={1.0}
  cam={{ at: [-0.02, 0.09, 0.02], az: [-0.2, -0.04], el: [0.42, 0.36], r: [1.08, 0.98], fov: 32 }}>{(tt) => {
  const turn = eio(tt, 0.4, 6.0) * 0.85, act = (i: number) => 1.6 + i * 1.2, hop = (i: number) => tt > act(i) ? Math.max(0, Math.sin((tt - act(i)) * 6)) * 0.06 * Math.exp(-(tt - act(i)) * 2.4) : 0;
  return <>
    {/* mesa de roble y la pared con la ventana de otoño */}
    <RBox s={[1.2, 0.04, 0.6]} p={[0, -0.02, 0.05]} r={0.008}><meshStandardMaterial map={tex.wood(4, 1, [168, 112, 62])} roughness={0.55} /></RBox>
    <mesh position={[0, 0.4, -0.26]}><planeGeometry args={[1.6, 0.9]} /><meshStandardMaterial color="#cdbb98" roughness={0.9} /></mesh>
    <group position={[0.05, 0.36, -0.25]}>
      <mesh><planeGeometry args={[0.5, 0.36]} /><meshBasicMaterial color="#e9b46a" toneMapped={false} /></mesh>
      {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.12 + rn(i, 1) * 0.3, 0.02 + rn(i, 2) * 0.14, 0.002]}><circleGeometry args={[0.04 + 0.03 * rn(i, 3), 12]} /><meshBasicMaterial color={["#b8441c", "#d0742a", "#8e2e18"][i % 3]} toneMapped={false} /></mesh>)}
      <mesh position={[-0.02, -0.08, 0.001]}><planeGeometry args={[0.03, 0.2]} /><meshBasicMaterial color="#4a2e1c" toneMapped={false} /></mesh>
      {[[0, 0.19, 0.54, 0.025], [0, -0.19, 0.54, 0.025], [-0.26, 0, 0.025, 0.4], [0.26, 0, 0.025, 0.4], [0, 0, 0.014, 0.36]].map(([x, y, w, hh], i) => <RBox key={i} s={[w, hh, 0.03]} p={[x, y, 0.012]} r={0.004}><meshStandardMaterial color="#f1ead9" roughness={0.5} /></RBox>)}
      {Array.from({ length: 8 }, (_, i) => { const u = (tt * 0.18 + rn(i, 5)) % 1; return <mesh key={"l" + i} position={[-0.22 + rn(i, 6) * 0.44 + 0.03 * Math.sin(tt * 2 + i), 0.17 - u * 0.34, 0.004]} rotation={[0, 0, tt * 2 + i]}><circleGeometry args={[0.011, 5]} /><meshBasicMaterial color={["#c2571c", "#d99a2b"][i % 2]} toneMapped={false} /></mesh>; })}
    </group>
    {/* el timer de cocina: arranca en 60 y gira */}
    <group position={[-0.36, 0.0, 0.14]}>
      <mesh position={[0, 0.045, 0]} castShadow><cylinderGeometry args={[0.075, 0.08, 0.09, 40]} />{M.plastic({ col: "#d33a2c" })}</mesh>
      <group position={[0, 0.0905, 0]} rotation={[0, turn * PI * 2, 0]}>
        <mesh rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.07, 48]} /><meshStandardMaterial map={fhDial()} roughness={0.4} /></mesh>
        <RBox s={[0.012, 0.02, 0.07]} p={[0, 0.01, 0]} r={0.004}>{M.plastic({ col: "#f1ead9" })}</RBox>
      </group>
      <mesh position={[0, 0.095, -0.075]}><coneGeometry args={[0.008, 0.016, 3]} /><meshBasicMaterial color="#1b1b1b" /></mesh>
    </group>
    {/* las tres herramientas, que saltan cuando les toca */}
    <group position={[FH_TOOLS[0][1], 0.012 + hop(0), 0.17]} rotation={[0, 0.4, 0]}>
      <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.022, 0.022, 0.07, 24]} />{M.plastic({ col: "#3a3d42" })}</mesh>
      {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[-0.03 + (i % 7) * 0.01, -0.024, (i < 7 ? -1 : 1) * 0.008]}><cylinderGeometry args={[0.0018, 0.001, 0.016, 5]} /><meshStandardMaterial color="#d9c49a" roughness={0.8} /></mesh>)}
      <mesh position={[0.06, 0.0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.016, 0.06, 18]} />{M.plastic({ col: "#8a9098" })}</mesh>
    </group>
    <group position={[FH_TOOLS[1][1], 0.03 + hop(1), 0.15]} rotation={[-1.1, 0, 0]}><Gauge v={lerp(6, 12.5, eio(tt, act(1), act(1) + 0.8))} max={30} tx={D30F()} p={[0, 0, 0]} r={0.05} /></group>
    <group position={[FH_TOOLS[2][1], 0.006 + hop(2), 0.17]}><Coin rot={[0, (tt > act(2) ? (tt - act(2)) * 4 : 0), 0]} s={3.2} /></group>
    {FH_TOOLS.map(([w, x], i) => { const k = phys(tt, act(i) + 0.2, 8, 0.5); return <group key={i}>
      <mesh position={[x, 0.002, 0.17]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, k)} visible={k > 0.01}><ringGeometry args={[0.07, 0.08, 40]} /><meshBasicMaterial color="#3aa864" toneMapped={false} /></mesh>
      <Tape txt={w} p={[x, 0.003, 0.29]} rot={[-PI / 2, 0, 0]} w={[0.09, 0.15, 0.1][i]} k={phys(tt, act(i) + 0.1, 8, 0.45)} col={tt > act(i) + 0.3 ? "#1f6a3a" : "#1c2a3a"} />
    </group>; })}
    <Tape txt="ONE HOUR, EVERY FALL" p={[0.05, 0.3, -0.22]} w={0.36} k={phys(tt, 0.8, 8, 0.45)} rev={cl((tt - 0.8) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 26:34 · UNA MONEDA, UN TRAPO Y UN VASO (rehecho r3): sobre el banco, una purga grande en su caño; por turnos: la moneda vuela,
// se para en la ranura y gira la purga; cae el trapo y se acomoda en el caño; el vaso se llena con el chorrito ----
export const HCoinRagCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#171b20" key1={[-0.8, 1.5, 1.3]} warm={0.85}
  cam={{ at: [0.0, 0.17, 0.0], az: [-0.5, -0.22], el: [0.3, 0.24], r: [1.08, 0.92], fov: 32 }}>{(tt) => {
  const VP: V3 = [0, 0.2, -0.05], ck = eio(tt, 0.8, 1.7), va = eio(tt, 1.9, 2.7) * PI * 0.5, rk = phys(tt, 2.8, 9, 0.4), fl = eio(tt, 3.3, 5.6) * 0.85;
  const cx = lerp(-0.22, VP[0], ck), cy = lerp(0.004, VP[1] + 0.12, ck) + 0.16 * Math.sin(PI * ck), cz = lerp(0.12, VP[2], ck);
  const air = cl((tt - 2.4) * 3) * cl((3.2 - tt) * 3), wet = cl((tt - 3.0) * 2), act = [cl((tt - 0.8) * 2) * cl((3.0 - tt) * 2), cl((tt - 2.7) * 3) * cl((3.9 - tt) * 2), cl((tt - 3.4) * 2)];
  return <>
    <mesh position={[0, 0.55, -0.32]} receiveShadow><planeGeometry args={[2.4, 1.2]} /><meshStandardMaterial color="#5b6f80" roughness={0.9} /></mesh>
    <RBox s={[0.16, 0.05, 0.12]} p={[0, 0.025, -0.05]} r={0.008}>{M.wood({ rx: 1, ry: 1, base: [120, 80, 46] })}</RBox>
    <Cu a={[0, 0.05, -0.05]} b={[0, 0.2, -0.05]} r={0.016} />
    <CoinVent p={VP} a={va} s={4} />
    {/* moneda: vuela desde la mesa, se para en la ranura y gira con la purga */}
    <group position={[cx, cy, cz]} rotation={[0, ck > 0.99 ? va : 0, 0]}><Coin rot={[PI / 2 * ck, 0, 0]} s={3} /></group>
    {/* el aire sale primero (siseo), después el agua */}
    <Puffs tt={tt} n={6} a={[0.036, 0.25, -0.05]} b={[0.12, 0.33, -0.02]} r={0.012} col="#ffffff" op={0.55 * air} v={1.2} />
    {Array.from({ length: 6 }, (_, i) => { const u = (tt * 1.6 + i / 6) % 1; return <mesh key={i} position={[0.07, 0.245 - u * 0.15, -0.05]} scale={Math.max(0.001, wet)} visible={wet > 0.01}><sphereGeometry args={[0.0045, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
    <Cup p={[0.07, 0, -0.05]} s={1.15} fill={fl} />
    {/* trapo: cae desde arriba y queda colgado del caño, bajo la purga */}
    <group position={[0, 0.17 + (1 - rk) * 0.35, -0.05]} scale={1.8} visible={tt > 2.75}>
      <RBox s={[0.05, 0.004, 0.09]} p={[-0.022, -0.01, 0]} rot={[0, 0, 0.9]} r={0.002}><meshStandardMaterial map={tex.text("crc_rag", 64, 64, (g) => { g.fillStyle = "#c7352c"; g.fillRect(0, 0, 64, 64); g.fillStyle = "rgba(255,255,255,.55)"; for (let i = 0; i < 64; i += 16) { g.fillRect(i, 0, 5, 64); g.fillRect(0, i, 64, 5); } })} roughness={0.95} /></RBox>
      <RBox s={[0.05, 0.004, 0.09]} p={[-0.045, -0.04, 0]} rot={[0, 0, 1.4]} r={0.002}><meshStandardMaterial map={tex.text("crc_rag", 64, 64, () => {})} roughness={0.95} /></RBox>
    </group>
    {/* aros de luz bajo el objeto que está actuando, de a uno */}
    {[[-0.22, 0.12], [0, -0.05], [0.07, -0.05]].map(([x, z], i) => <mesh key={i} position={[x, 0.002, z]} rotation={[-PI / 2, 0, 0]} visible={act[i] > 0.01}><ringGeometry args={[0.06, 0.075, 40]} /><meshBasicMaterial color="#ffd27a" transparent opacity={0.6 * act[i]} toneMapped={false} depthWrite={false} /></mesh>)}
    <Tape txt="COIN" p={[-0.33, 0.11, 0.1]} rot={[0, -0.3, 0]} w={0.13} k={phys(tt, 0.9, 8, 0.45)} />
    <Tape txt="RAG" col="#b3261e" p={[-0.17, 0.2, 0.06]} rot={[0, -0.3, 0]} w={0.12} k={phys(tt, 2.9, 8, 0.45)} />
    <Tape txt="CUP" col="#2a5c9a" p={[0.2, 0.05, 0.12]} rot={[-0.2, -0.3, 0]} w={0.12} k={phys(tt, 3.5, 8, 0.45)} />
    <Tape txt="THAT'S THE WHOLE KIT" p={[0.26, 0.31, -0.08]} rot={[0, -0.3, 0]} w={0.34} k={phys(tt, 4.0, 8, 0.45)} rev={cl((tt - 4.0) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 27:04 · LO QUE TRAE EL INVIERNO: cuatro maquetitas en un estante (caño con carámbanos, ventana con chiflete, techo con dique de hielo, llama de la caldera) se encienden una a una ----
export const HWinterFour: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" key1={[0, 1.6, 1.6]}
  cam={{ at: [0.0, 0.22, 0.0], az: [-0.18, 0.12], el: [0.16, 0.1], r: [1.78, 1.62], fov: 32 }}>{(tt) => {
  const T0 = (i: number) => 1.2 + i * 1.05, on = (i: number) => cl((tt - T0(i)) * 1.8), sp = (i: number) => Math.max(0.001, phys(tt, 0.2 + i * 0.3, 7, 0.38)), X = [-0.5, -0.17, 0.17, 0.5];
  const bump = (i: number) => Math.sin(PI * cl((tt - T0(i)) / 0.7)), act = (i: number) => on(i) * (1 - on(i + 1) * 0.6);
  return <>
    <RBox s={[1.25, 0.03, 0.22]} p={[0, -0.01, 0]} r={0.006}><meshStandardMaterial color="#6b4a2c" roughness={0.7} /></RBox>
    {X.map((x, i) => <group key={i} position={[x, 0.005 + 0.03 * bump(i) + 0.35 * (1 - cl(phys(tt, 0.2 + i * 0.3, 7, 0.38))), 0.05 * act(i)]} rotation={[0, 0.5 * bump(i) * Math.sin(tt * 3), 0]} scale={sp(i) * (1 + 0.16 * bump(i))}>
      <mesh position={[0, 0.14, -0.06]}><circleGeometry args={[0.13, 32]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.1 + 0.35 * act(i)} toneMapped={false} depthWrite={false} /></mesh>
      <pointLight position={[0, 0.2, 0.15]} intensity={0.25 * act(i)} distance={0.5} color="#ffd9a0" />
      {i === 0 && <><Cu a={[-0.1, 0.16, 0]} b={[0.1, 0.16, 0]} r={0.018} />{Array.from({ length: 6 }, (_, j) => <mesh key={j} position={[-0.075 + j * 0.03, 0.145 - 0.025 * on(0), 0.0]} rotation={[PI, 0, 0]} scale={[1, Math.max(0.001, on(0)), 1]} visible={on(0) > 0.01}><coneGeometry args={[0.007, 0.05 + 0.02 * rn(j, 1), 6]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0.05} transmission={0.5} /></mesh>)}
        <mesh position={[-0.01, 0.17, 0.0185]} scale={[1, 1, Math.max(0.001, on(0))]}><boxGeometry args={[0.2, 0.024, 0.002]} /><meshStandardMaterial color="#e9f4ff" roughness={0.9} transparent opacity={0.7 * on(0)} /></mesh>
        {[0, 1].map((j) => { const u = (tt * 0.9 + j * 0.5) % 1; return <mesh key={"d" + j} position={[-0.045 + j * 0.06, 0.09 - u * 0.09, 0]} visible={on(0) > 0.5}><sphereGeometry args={[0.004, 8, 6]} />{M.water({ op: 0.9 })}</mesh>; })}</>}
      {i === 1 && <><RBox s={[0.16, 0.2, 0.02]} p={[0, 0.12, 0]} r={0.004}><meshStandardMaterial color="#ece5d6" roughness={0.5} /></RBox><mesh position={[0, 0.12, 0.0105]}><planeGeometry args={[0.12, 0.16]} /><meshBasicMaterial color="#26385a" toneMapped={false} /></mesh>{Array.from({ length: 10 }, (_, j) => <mesh key={j} position={[-0.05 + rn(j, 2) * 0.1, 0.19 - ((tt * 0.1 + rn(j, 3)) % 1) * 0.14, 0.011]}><circleGeometry args={[0.003, 6]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>)}<mesh position={[0, 0.12, 0.012]}><planeGeometry args={[0.12, 0.16]} /><meshPhysicalMaterial color="#eef6ff" transparent opacity={0.05 + 0.55 * on(1)} roughness={0.6} /></mesh><RBox s={[0.008, 0.16, 0.01]} p={[0, 0.12, 0.014]} r={0.002}><meshStandardMaterial color="#ece5d6" /></RBox>
        <Puffs tt={tt} n={6} a={[0.08, 0.06, 0.02]} b={[-0.06, 0.2, 0.08]} r={0.01} col="#9cc8ff" op={0.5 * on(i)} v={0.5} /></>}
      {i === 2 && <><RBox s={[0.16, 0.012, 0.12]} p={[-0.04, 0.16, 0]} rot={[0, 0, 0.5]} r={0.003}><meshStandardMaterial color="#5a3c28" roughness={0.7} /></RBox><RBox s={[0.16, 0.012, 0.12]} p={[0.04, 0.16, 0]} rot={[0, 0, -0.5]} r={0.003}><meshStandardMaterial color="#5a3c28" roughness={0.7} /></RBox>
        <RBox s={[0.04 * Math.max(0.001, on(2)), 0.03 * Math.max(0.001, on(2)), 0.13]} p={[0.11, 0.115, 0]} r={0.004}><meshPhysicalMaterial color="#e6f4ff" roughness={0.05} transmission={0.4} /></RBox><RBox s={[0.13, 0.1, 0.1]} p={[0, 0.05, 0]} r={0.004}><meshStandardMaterial color="#d9cdb8" roughness={0.8} /></RBox></>}
      {i === 3 && <><RBox s={[0.14, 0.16, 0.1]} p={[0, 0.08, 0]} r={0.01}><meshStandardMaterial color="#2f4a5c" metalness={0.35} roughness={0.45} /></RBox>
        <mesh position={[0, 0.06 + 0.012 * on(i), 0.052]} scale={[0.6 + 0.5 * on(i), Math.max(0.001, 0.4 + 0.8 * on(i) + 0.12 * Math.sin(tt * 9)), 1]}><coneGeometry args={[0.022, 0.06, 16]} /><meshBasicMaterial color="#5aa0ff" toneMapped={false} transparent opacity={0.25 + 0.65 * on(i)} /></mesh>
        <Puffs tt={tt} n={5} a={[0.0, 0.17, 0.0]} b={[0.02, 0.27, 0.02]} r={0.012} col="#d9d4cc" op={0.45 * on(i)} v={0.6} /></>}
      <Tape txt={["FROZEN PIPES", "DRAFTY WINDOWS", "ICE DAMS", "THE FURNACE"][i]} p={[0, i % 2 ? 0.39 : 0.3, 0.02]} w={[0.4, 0.43, 0.31, 0.38][i]} k={phys(tt, i ? T0(i) - 0.5 : 0.5, 8, 0.45)} />
    </group>)}
  </>;
}}</Scene3D>;
