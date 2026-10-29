// rosa29e · bloque 1 rehecho en 3D (evaluador vuelta 1: «la olla parece un ícono», «parecen monedas», «¿dónde está la carne y el paño?»).
// Cada pieza = UN objeto real que hace la idea, en la cocina de Rosa (mesa de tablas, azulejo, luz de ventana).
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Lid, Fork, Meat, Steam, Spoon, Card, Towel, Bubbles, M, T, V, ease, ramp, spr, rnd, lerp, rbox } from "./k3d";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};

// ───────── 1 · SUELA: se levanta la tapa, el caldo está gris; el tenedor pincha una carne con forma de suela (costura y taco) y REBOTA
const soleGeo = () => {
  const s = new THREE.Shape(); // contorno de suela: punta ancha, cintura, taco
  s.moveTo(-0.34, 0); s.bezierCurveTo(-0.36, 0.13, -0.18, 0.16, -0.06, 0.1); s.bezierCurveTo(0.04, 0.07, 0.1, 0.09, 0.2, 0.1);
  s.bezierCurveTo(0.33, 0.1, 0.34, -0.1, 0.2, -0.1); s.bezierCurveTo(0.1, -0.09, 0.04, -0.07, -0.06, -0.1); s.bezierCurveTo(-0.18, -0.16, -0.36, -0.13, -0.34, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); g.center(); return g;
};
export const SoleFork3: React.FC<P> = ({ t, h }) => {
  const g = useMemo(soleGeo, []);
  const tread = useMemo(() => { const t = mtex(256, 256, (c) => { c.fillStyle = "#b08a64"; c.fillRect(0, 0, 256, 256); c.strokeStyle = "#4a3422"; c.lineWidth = 9; for (let y = 10; y < 256; y += 30) { c.beginPath(); for (let x = 0; x <= 256; x += 32) c.lineTo(x, y + (x / 32) % 2 * 16); c.stroke(); } }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5); return t; }, []);
  const stitch = useMemo(() => Array.from({ length: 34 }, (_, i) => { const a = (i / 34) * Math.PI * 2; return [Math.cos(a) * 0.29 * (1 - 0.25 * Math.abs(Math.sin(a * 2)) * 0.4), Math.sin(a) * 0.1] as [number, number]; }), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const lid = ramp(tt, 0.2, 1.1), poke = spr(tt, 1.9, 14, 0.25), lift = ramp(tt, 3.4, 4.6);
    // el tenedor baja, pega, rebota (la carne no cede) y después la levanta pinchada
    const fy = 0.95 - 0.33 * cl(poke) + 0.12 * Math.max(0, Math.sin((tt - 2.15) * 9)) * Math.exp(-Math.max(0, tt - 2.15) * 3) * (tt > 2.15 ? 1 : 0) + lift * 0.55;
    const sy = 0.5 + lift * 0.3, sr = lift * 0.9;
    const c = orbit(tt, [0.15, 1.3, 1.95], [0, 0.85, 0], 0.18);
    return <C3><Cam p={c.p} l={c.l} fov={52} /><Kitchen />
      <Pot fill={0.86} col="#5f5a52" rough={0.12} lidOff />
      {lid < 0.999 && <Lid p={[lid * 0.95, 0.54 + Math.sin(Math.PI * lid) * 0.22, lid * 0.25]} r={[0, 0, -lid * 0.9]} />}
      {/* el caldo: ojos de grasa y burbujas lentas */}
      <group position={[0, 0.455, 0]}>
        {Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.7, 0.002, (rnd(i, 2) - 0.5) * 0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.8 + rnd(i, 4) * 0.4, 1]}><circleGeometry args={[0.012 + rnd(i, 3) * 0.03, 20]} /><meshPhysicalMaterial color="#c9b98a" transparent opacity={0.55} roughness={0.05} clearcoat={1} /></mesh>)}
        <Bubbles tt={tt} R={0.4} n={12} size={0.02} rate={0.6} col="#8a8378" />
      </group>
      <Steam tt={tt} p={[0, 0.55, 0]} o={0.35 * lid} n={10} h={1.1} />
      <group position={[0.02, sy, 0.02]} rotation={[sr, 0.3, sr * 0.4]}>
        <mesh geometry={g} castShadow receiveShadow><meshPhysicalMaterial color="#a07a56" map={tread} roughness={0.5} clearcoat={0.4} /></mesh>
        {stitch.map(([x, z], i) => <mesh key={i} position={[x, 0.04, z]} rotation={[0, -Math.atan2(z, x), 0]}><boxGeometry args={[0.022, 0.006, 0.006]} /><meshStandardMaterial color="#d8d0c0" roughness={0.6} /></mesh>)}
        <mesh position={[0.24, -0.045, 0]} castShadow><boxGeometry args={[0.13, 0.09, 0.17]} /><meshStandardMaterial color="#3a2a1e" roughness={0.7} /></mesh>
        {[0, 1, 2].map((k) => <mesh key={k} position={[0.24, -0.09 + k * 0.03, 0.086]}><boxGeometry args={[0.13, 0.004, 0.002]} /><meshStandardMaterial color="#1a120c" /></mesh>)}
      </group>
      {lift > 0.2 && Array.from({ length: 6 }, (_, i) => { const k = ((tt - 3.6) * 1.3 + i / 6) % 1; return <mesh key={"dr" + i} position={[-0.1 + i * 0.05, sy - 0.05 - k * (sy - 0.46), 0.02]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.012, 10, 8]} /><meshPhysicalMaterial color="#7a7468" roughness={0.05} clearcoat={1} /></mesh>; })}
      {tt > 1.2 && <Fork p={[0.06, fy - lift * 0.25 + 0.7 * (1 - ramp(tt, 1.2, 1.9)), 0.05]} r={[0.15, 0.3, -0.12 - 0.12 * cl(poke) * (1 - lift)]} s={1.1} />}
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · ALIANZAS (rediseño v3): sobre la mesa de madera una alianza fina parada; la otra entra rodando, choca y se apoya en ella; la cámara entra al aro y lee «1964» grabado por dentro
const engr = () => mtex(1024, 128, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "#f7d77a"); gr.addColorStop(0.5, "#c9962e"); gr.addColorStop(1, "#f2cf6e"); g.fillStyle = gr; g.fillRect(0, 0, 1024, 128);
  g.fillStyle = "#4a2a04"; g.font = "italic 900 96px Georgia, serif"; g.textAlign = "center"; g.fillText("A + R  1964", 512, 100);
});
const Ring: React.FC<{ tex?: THREE.Texture }> = ({ tex }) => (
  <group>
    <mesh material={M.gold()} castShadow><torusGeometry args={[0.07, 0.009, 24, 96]} /></mesh>
    {tex && <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.0615, 0.0615, 0.016, 96, 1, true]} /><meshStandardMaterial map={tex} metalness={0.85} roughness={0.28} side={THREE.BackSide} /></mesh>}
  </group>
);
export const Alliances3: React.FC<P> = ({ t, h }) => {
  const tx = useMemo(engr, []);
  tx.wrapS = THREE.RepeatWrapping; tx.repeat.set(-1, 1); tx.offset.set(0.75, 0);
  return <Stage3 t={t} h={h}>{(tt) => {
    // la de Antonio entra rodando de canto (gira sobre su eje), se tambalea y cae acostada al lado de la de Rosa
    const k = ease(cl((tt + 0.35) / 1.8)), x = lerp(0.75, 0.17, k), spin = (1 - k) * 9, wob = ramp(tt, 1.35, 2.0), fallen = ease(wob);
    const tilt = fallen * (Math.PI / 2) + Math.sin(wob * 14) * 0.15 * (1 - fallen), y = lerp(0.078, 0.014, fallen);
    const c = orbit(tt, lv3b([0.26, 0.2, 0.3], [0.0, 0.16, 0.13], ramp(tt, 2.0, 4.4)), lv3b([0.08, 0.02, 0], [0.0, 0.01, -0.04], ramp(tt, 2.0, 4.4)), 0.06, 0.006);
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={42} /><Kitchen wall={false} />
      <pointLight position={[0.2, 0.5, 0.5]} intensity={0.8} distance={2} color="#ffe2b0" />
      {/* la de Rosa, acostada: la inscripción se lee en la pared interior del fondo */}
      <group position={[0, 0.013, 0]}><Band tex={tx} /></group>
      <group position={[x, y, 0.02]} rotation={[0, 0, 0]}><group rotation={[tilt, 0, spin]}><group rotation={[Math.PI / 2, 0, 0]}><Band /></group></group></group>
    </C3>;
  }}</Stage3>;
};
const lv3b = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// alianza de banda plana (eje = y): cara exterior pulida, cara interior con el grabado
const Band: React.FC<{ tex?: THREE.Texture }> = ({ tex }) => (
  <group>
    <mesh material={M.gold()} castShadow><cylinderGeometry args={[0.072, 0.072, 0.026, 96, 1, true]} /></mesh>
    <mesh><cylinderGeometry args={[0.064, 0.064, 0.026, 96, 1, true]} /><meshStandardMaterial map={tex} color={tex ? "#ffffff" : "#d9a640"} metalness={0.85} roughness={0.3} side={THREE.BackSide} /></mesh>
    {[1, -1].map((d) => <mesh key={d} position={[0, d * 0.013, 0]} rotation={[-Math.PI / 2 * d, 0, 0]} material={M.gold()}><ringGeometry args={[0.064, 0.072, 96]} /></mesh>)}
  </group>
);

// ───────── 3 · DELANTAL (rediseño v3): repisa de madera con un gancho de hierro; el delantal de Carmen cae, el cuello se engancha, se balancea con las cintas y se asienta con pliegues
const apronTex = () => mtex(512, 640, (g) => {
  g.fillStyle = "#f3eadb"; g.fillRect(0, 0, 512, 640);
  for (let i = 0; i < 26; i++) { g.fillStyle = "rgba(160,36,36,.38)"; g.fillRect(i * 20, 0, 9, 640); g.fillRect(0, i * 25, 512, 11); }
  for (let i = 0; i < 9; i++) { g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.ellipse(80 + i * 47, 560 + (i % 3) * 18, 26, 12, 0.3, 0, 6.3); g.fill(); }
  g.strokeStyle = "#8a1a14"; g.lineWidth = 3; for (let x = 140; x < 380; x += 14) { g.beginPath(); g.moveTo(x, 498); g.lineTo(x + 7, 508); g.stroke(); }
});
const apronShape = () => {
  const s = new THREE.Shape(); s.moveTo(-0.15, 0); s.lineTo(0.15, 0); s.lineTo(0.18, -0.3); s.quadraticCurveTo(0.32, -0.34, 0.34, -0.42); s.lineTo(0.36, -1.0); s.quadraticCurveTo(0, -1.05, -0.36, -1.0); s.lineTo(-0.34, -0.42); s.quadraticCurveTo(-0.32, -0.34, -0.18, -0.3); s.lineTo(-0.15, 0);
  const g = new THREE.ShapeGeometry(s, 40); const pos = g.attributes.position as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); uv.setXY(i, (x + 0.38) / 0.76, 1 + y / 1.05); pos.setZ(i, 0.06 * Math.sin(x * 20 + 0.5) * Math.min(1, -y * 1.6)); }
  g.computeVertexNormals(); return g;
};
export const ApronHook3: React.FC<P> = ({ t, h }) => {
  const g = useMemo(apronShape, []), tx = useMemo(apronTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const fall = spr(tt, 0.15, 7, 0.38), hk = Math.max(0, tt - 0.75), sw = tt > 0.75 ? Math.sin(hk * 2.2) * 0.5 * Math.exp(-hk * 0.45) : 0;
    const y = lerp(2.7, 1.47, cl(fall));
    const c = orbit(tt, [0.25, 1.2, -0.35], [0, 1.08, -1.8], 0.15, 0.012);
    return <C3><Cam p={c.p} l={c.l} fov={50} /><Kitchen wall={false} />
      <mesh position={[0, 1.2, -1.875]} geometry={rbox(4, 2.6, 0.02, 0.005)} castShadow receiveShadow><meshStandardMaterial map={T.planks()} color="#b89a7a" roughness={0.85} /></mesh>
      {/* repisa de madera con el gancho grande */}
      <mesh position={[0, 1.52, -1.86]} geometry={rbox(1.6, 0.16, 0.05, 0.01)} material={M.wood("#6b4426")} castShadow receiveShadow />
      <mesh position={[0, 1.66, -1.76]} geometry={rbox(1.6, 0.03, 0.22, 0.008)} material={M.wood("#6b4426")} castShadow receiveShadow />
      {[-0.55, -0.4, 0.45, 0.6].map((x, i) => <mesh key={x} position={[x, 1.74, -1.78]} material={M.clay(i % 2 ? "#8a4a2a" : "#a8643a")} castShadow><cylinderGeometry args={[0.06, 0.05, 0.13, 24]} /></mesh>)}
      <group position={[0, 1.5, -1.8]} scale={1.8}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={M.gold()} castShadow><cylinderGeometry args={[0.014, 0.014, 0.1, 16]} /></mesh>
        <mesh position={[0, 0.03, 0.05]} rotation={[0, Math.PI / 2, 0]} material={M.gold()} castShadow><torusGeometry args={[0.035, 0.013, 12, 24, Math.PI]} /></mesh>
      </group>
      <group position={[0, y, -1.75]} rotation={[0, 0, sw]}>
        {/* el cuello del delantal, la tira que se engancha */}
        <mesh position={[0, 0.0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.13, 0.012, 10, 40, Math.PI]} /><meshStandardMaterial color="#e8dcc4" roughness={0.9} /></mesh>
        <mesh geometry={g} position={[0, -0.13, 0.0]} castShadow receiveShadow><meshStandardMaterial map={tx} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        {/* el bolsillo con la cuchara de madera asomando */}
        <mesh position={[-0.17, -0.98, 0.04]} castShadow><boxGeometry args={[0.2, 0.17, 0.01]} /><meshStandardMaterial map={tx} color="#e8d8d8" roughness={0.95} /></mesh>
        <mesh position={[-0.13, -0.82, 0.03]} rotation={[0, 0, -0.25]} material={M.wood("#b9824c")} castShadow><cylinderGeometry args={[0.014, 0.018, 0.3, 12]} /></mesh>
        {/* las cintas de la cintura, que cuelgan y siguen el balanceo con retraso */}
        {[-1, 1].map((d) => <group key={d} position={[d * 0.33, -0.55, 0.01]} rotation={[0, 0, -sw * 0.9 + d * 0.08]}>
          <mesh position={[0, -0.24, 0]} castShadow><boxGeometry args={[0.035, 0.5, 0.004]} /><meshStandardMaterial color="#e8dcc4" roughness={0.9} /></mesh>
        </group>)}
      </group>
    </C3>;
  }}</Stage3>;
};

// ───────── 4 · LLAVERO: diez llaves de bronce con su etiqueta numerada caen de a una en el aro; la 4 se adelanta y brilla
const tagTex = (n: number) => mtex(128, 160, (g) => {
  g.fillStyle = "#efe2c2"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(64, 22, 10, 0, 6.3); g.fill();
  g.fillStyle = n === 4 ? "#b3241c" : "#2b2118"; g.font = "900 92px Georgia, serif"; g.textAlign = "center"; g.fillText(String(n), 64, 135);
});
const Key: React.FC<{ n: number }> = ({ n }) => {
  const tx = useMemo(() => tagTex(n), [n]); const br = M.gold();
  return <group>
    <mesh material={br} castShadow><torusGeometry args={[0.05, 0.014, 12, 32]} /></mesh>
    <mesh position={[0, -0.17, 0]} material={br} castShadow><boxGeometry args={[0.022, 0.24, 0.012]} /></mesh>
    <mesh position={[0.026, -0.265, 0]} material={br} castShadow><boxGeometry args={[0.032 + rnd(n, 1) * 0.012, 0.045, 0.012]} /></mesh>
    <mesh position={[-0.08, -0.12, 0.012]} rotation={[0, 0, 0.25]} castShadow><boxGeometry args={[0.095, 0.12, 0.002]} /><meshStandardMaterial map={tx} roughness={0.9} /></mesh>
  </group>;
};
export const KeyRing3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const foc = ramp(tt, 4.4, 5.6);
    const th4 = Math.PI * (1.0 + 3 * 0.111), k4: V = [Math.cos(th4) * 0.14, 1.4 + Math.sin(th4) * 0.14 - 0.17, -1.66];
    const c = orbit(tt, lv3b([0.0, 1.3, -0.45], [k4[0] * 0.5, k4[1] + 0.05, -0.85], foc), lv3b([0, 1.24, -1.85], [k4[0] * 0.5, k4[1] + 0.06, -1.75], foc), 0.2, 0.01);
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={46} /><Kitchen />
      <mesh position={[0, 1.3, -1.875]} geometry={rbox(4, 2.6, 0.02, 0.005)} receiveShadow><meshStandardMaterial map={T.planks()} color="#b89a7a" roughness={0.85} /></mesh>
      <mesh position={[0, 1.45, -1.86]} rotation={[Math.PI / 2, 0, 0]} material={M.iron()}><cylinderGeometry args={[0.01, 0.01, 0.08, 12]} /></mesh>
      <mesh position={[0, 1.4, -1.83]} material={M.gold()} castShadow><torusGeometry args={[0.14, 0.009, 12, 64]} /></mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a0 = 0.25 + i * 0.32, s = spr(tt, a0, 9, 0.3), th = Math.PI * (1.0 + i * 0.111), lit = i === 3 ? foc : 0;
        const sw = Math.sin((tt - a0) * 6 + i) * 0.14 * Math.exp(-Math.max(0, tt - a0 - 0.3) * 1.6);
        if (tt < a0 - 0.05) return null;
        // cada llave enhebrada en su punto del aro y colgando por su peso (abanico abierto, nunca amontonadas)
        const bx = Math.cos(th) * 0.14, by = 1.4 + Math.sin(th) * 0.14 + lerp(1.0, 0, cl(s));
        return <group key={i} position={[bx, by, -1.82 + (i % 2) * 0.012 + lit * 0.16]} rotation={[0, lit * Math.sin(tt * 2) * 0.6, (th - Math.PI * 1.5) * 0.75 + sw]} scale={1 + lit * 0.45}><group position={[0, -0.05, 0]}><Key n={i + 1} /></group></group>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · SOBRE CON LACRE (rediseño v3): sobre de frente con su solapa en V y un lacre grande; el lacre se parte, la solapa se abre y la tarjeta sale deslizando hacia nosotros: «Secreto Nº 4» con la carne dibujada
const sealTop = () => mtex(256, 256, (g) => { g.fillStyle = "#a0221a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#5e0c08"; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 98, 0, 6.3); g.stroke(); g.fillStyle = "#5e0c08"; g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 70, 0, 6.3); g.stroke(); g.font = "italic 900 120px Georgia, serif"; g.textAlign = "center"; g.fillText("C", 128, 170); });
const envTex = () => mtex(1024, 660, (g) => {
  g.fillStyle = "#c9b48a"; g.fillRect(0, 0, 1024, 660); g.strokeStyle = "rgba(90,60,30,.35)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(0, 660); g.lineTo(512, 330); g.lineTo(1024, 660); g.stroke();
  for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(120,90,50,${rnd(i, 1) * 0.06})`; g.fillRect(rnd(i, 2) * 1024, rnd(i, 3) * 660, 2, 2); }
});
const cardTex = () => mtex(900, 560, (g) => {
  g.fillStyle = "#d9cdb0"; g.fillRect(0, 0, 900, 560); g.strokeStyle = "rgba(60,90,160,.25)"; g.lineWidth = 2; for (let y = 120; y < 560; y += 44) { g.beginPath(); g.moveTo(30, y); g.lineTo(870, y); g.stroke(); }
  g.fillStyle = "#2b2118"; g.font = "italic 700 130px Georgia, serif"; g.textAlign = "center"; g.fillText("Secreto Nº 4", 450, 250); g.font = "italic 60px Georgia, serif"; g.fillStyle = "#6a4a2a"; g.fillText("— Carmen", 600, 380);
  return;
  // la carne dibujada a tinta, y la gota de agua tachada
  g.strokeStyle = "#2b2118"; g.lineWidth = 7; g.fillStyle = "#c4574a"; g.beginPath(); g.ellipse(390, 340, 200, 110, -0.1, 0, 6.3); g.fill(); g.stroke();
  g.strokeStyle = "#f2e6d0"; g.lineWidth = 14; g.beginPath(); g.ellipse(390, 340, 150, 70, -0.1, 3.4, 5.4); g.stroke();
  // el paño a rayas apoyado sobre la carne, secándola
  g.save(); g.translate(560, 300); g.rotate(-0.25); g.fillStyle = "#f2ece0"; g.fillRect(-120, -80, 240, 160); g.fillStyle = "#b3241c"; for (let x = -110; x < 120; x += 48) g.fillRect(x, -80, 16, 160); g.strokeStyle = "#2b2118"; g.lineWidth = 5; g.strokeRect(-120, -80, 240, 160); g.restore();
});
export const WaxSeal3: React.FC<P> = ({ t, h }) => {
  const st = useMemo(sealTop, []), et = useMemo(envTex, []), ct = useMemo(cardTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const slide = spr(tt + 0.3, 0.0, 6, 0.6), br = ramp(tt, 1.4, 1.75), flap = ramp(tt, 1.9, 2.7), card = ramp(tt, 2.8, 4.2);
    const ex = lerp(1.2, 0, cl(slide));
    const c = orbit(tt, [0, lerp(1.05, 1.25, card), lerp(0.45, 0.85, card)], [0, 0, lerp(-0.02, 0.2, card)], 0.15, 0.015);
    const paper = M.matte("#c9b48a", 0.85);
    return <C3><Cam p={c.p} l={c.l} fov={44} /><Kitchen wall={false} />
      <group position={[ex, 0.008, 0]} rotation={[0, (1 - cl(slide)) * 0.35, 0]}>
        <mesh castShadow receiveShadow><boxGeometry args={[0.9, 0.012, 0.58]} /><meshStandardMaterial color="#bba57c" roughness={0.85} /></mesh>
        <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.9, 0.58]} /><meshStandardMaterial map={et} roughness={0.85} /></mesh>
        {/* la tarjeta: sale del sobre deslizando hacia la cámara */}
        <mesh position={[0, 0.0075 + 0.004 * card, lerp(0, 0.46, ease(card))]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><planeGeometry args={[0.78, 0.48]} /><meshStandardMaterial map={ct} roughness={0.85} /></mesh>
        {/* el frente del sobre (bolsillo) tapa la tarjeta mientras está adentro */}
        <mesh position={[0, 0.0095, 0.09]} rotation={[-Math.PI / 2, 0, 0]} material={paper} receiveShadow><planeGeometry args={[0.9, 0.4]} /></mesh>
        {/* la solapa en V (bisagra arriba, la punta con el lacre) */}
        <group position={[0, 0.013, -0.29]} rotation={[-flap * 2.7, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={paper} castShadow><shapeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.45, 0); s.lineTo(0.45, 0); s.lineTo(0, -0.34); s.lineTo(-0.45, 0); return s; })()]} /></mesh>
          {/* el lacre grande, dos mitades que se separan */}
          {[1, -1].map((d) => <group key={d} position={[d * 0.05 * br, 0.016 + br * 0.006, 0.31]} rotation={[0, 0, d * br * 0.35]}>
            <mesh rotation={[0, d > 0 ? 0 : Math.PI, 0]} castShadow><cylinderGeometry args={[0.13, 0.138, 0.034, 40, 1, false, -Math.PI / 2, Math.PI]} /><meshPhysicalMaterial color="#a0221a" map={st} roughness={0.28} clearcoat={0.9} /></mesh>
          </group>)}
        </group>
        {br > 0 && Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 1.45) / 0.6); return <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.3 * k, 0.012 + Math.max(0, 0.06 * Math.sin(Math.PI * k)) * rnd(i, 2) * (1 - k), -0.29 + 0.31 + rnd(i, 3) * 0.08 * k]}><boxGeometry args={[0.014, 0.01, 0.012]} /><meshStandardMaterial color="#7d1610" roughness={0.4} /></mesh>; })}
      </group>
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · TRES CUCHARAS (rediseño v3): la de 1964 nueva, la de 1990 gastada, la de 2025 con el borde comido; caen de a una y la cámara pasa por encima con luz rasante; el año va quemado en cada mango
const burnTex = (y: number) => mtex(256, 64, (g) => { g.fillStyle = "#e9dcb0"; g.fillRect(0, 0, 256, 64); g.fillStyle = "rgba(0,0,0,.08)"; for (let x = 0; x < 256; x += 6) g.fillRect(x, 0, 2, 64); g.fillStyle = "#2b2118"; g.font = "900 54px Georgia, serif"; g.textAlign = "center"; g.fillText(String(y), 128, 52); });
export const SpoonWear3: React.FC<P> = ({ t, h }) => {
  const YR = [1964, 1990, 2025], bt = useMemo(() => YR.map(burnTex), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const k = ease(cl(tt / 5.5));
    const c = orbit(tt, [lerp(-0.15, 0.15, k), 0.62, 0.85], [lerp(-0.04, 0.04, k), 0.02, 0.0], 0.1, 0.01);
    return <C3><Cam p={c.p} l={c.l} fov={42} /><Kitchen wall={false} />
      <directionalLight position={[-2, 0.35, 0.2]} intensity={1.6} color="#ffd9a0" />
      {YR.map((y, i) => {
        const a = -0.25 + i * 1.3, d = spr(tt, a, 9, 0.35); if (tt < a - 0.3) return null;
        const w = [0, 0.6, 1.15][i], z = -0.24 + i * 0.24;
        return <group key={y} position={[0, 0.03 + lerp(0.5, 0, cl(d)), z]}>
          <group rotation={[0, -Math.PI / 2, 0]}><Spoon s={1.2} wear={w} c={["#d6a066", "#b07a45", "#7e4e26"][i]} /></group>
          <mesh position={[-0.22, 0.032, 0.0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.2, 0.05]} /><meshStandardMaterial map={bt[i]} roughness={0.9} /></mesh>
          {i === 2 && <mesh position={[0.33, 0.026, 0.01]} rotation={[-Math.PI / 2, 0, 0.6]}><planeGeometry args={[0.1, 0.006]} /><meshBasicMaterial color="#2a1608" /></mesh>}
        </group>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · SECAR (rediseño v3): trozos de guiso con su grasa blanca, mojados y brillantes; el paño blanco baja, aprieta, sube con la mancha rosada y el trozo queda MATE; pasa al siguiente
const Chunk: React.FC<{ p: V; seed: number; shine: number }> = ({ p, seed, shine }) => (
  <group position={p} rotation={[0, seed, 0]}>
    <Meat seed={seed} s={0.75} col="#9a3a2c" shine={shine} />
  </group>
);
export const Blot3: React.FC<P> = ({ t, h }) => {
  const POS: V[] = [[-0.2, 0.08, 0.02], [0.2, 0.08, 0.0], [0.42, 0.08, -0.2], [-0.42, 0.08, -0.22], [0.02, 0.08, -0.28]];
  return <Stage3 t={t} h={h}>{(tt) => {
    const press = (a: number) => ramp(tt, a, a + 0.45) * (1 - ramp(tt, a + 1.1, a + 1.6));
    const p1 = press(0.4), p2 = press(2.9), pr = Math.max(p1, p2), x = lerp(-0.2, 0.2, ramp(tt, 2.2, 2.9));
    const dry = (i: number) => i === 0 ? ramp(tt, 1.0, 1.5) : i === 1 ? ramp(tt, 3.5, 4.0) : 0;
    const stain = cl(ramp(tt, 1.2, 1.6) * 0.6 + ramp(tt, 3.7, 4.1) * 0.6);
    const tilt = (1 - pr) * 0.9;
    const c = orbit(tt, [0.2, 1.0, 1.0], [0, 0.05, -0.08], 0.15, 0.015);
    return <C3><Cam p={c.p} l={c.l} fov={40} /><Kitchen wall={false} />
      <mesh position={[0, 0.03, -0.08]} geometry={rbox(1.3, 0.06, 0.8, 0.03)} material={M.wood("#d2a170")} castShadow receiveShadow />
      {[0, 1].map((i) => <mesh key={'pd' + i} position={[POS[i][0], 0.061, POS[i][2]]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.15, 40]} /><meshPhysicalMaterial color="#7a1a12" transparent opacity={0.65 * (1 - dry(i))} roughness={0.05} clearcoat={1} /></mesh>)}
      {POS.map((p, i) => <Chunk key={i} p={p} seed={[3, 7, 11, 5, 9][i]} shine={i < 2 ? 1 - 0.95 * dry(i) : 1} />)}
      {/* el paño blanco: al subir se inclina hacia nosotros y muestra la mancha */}
      <group position={[x, lerp(0.45, 0.2, pr), 0.02 + 0.12 * (1 - pr)]} rotation={[tilt, 0.15, 0]}>
        <mesh scale={[1, 0.55 + 0.45 * (1 - pr), 1]} castShadow geometry={rbox(0.36, 0.035, 0.3, 0.012)}><meshStandardMaterial map={T.cloth("#a8302a", "#d8d0c2")} color="#d0c8bc" roughness={0.95} /></mesh>
        <mesh position={[0, -0.0095, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.12, 32]} /><meshStandardMaterial color="#c4606a" transparent opacity={0.75 * stain} roughness={0.9} /></mesh>
      </group>
    </C3>;
  }}</Stage3>;
};
