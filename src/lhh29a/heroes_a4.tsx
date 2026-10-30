// lhh29a · componentes únicos 25-32 (kit h3d): la compresa fría, la escarcha que crece en el vidrio, el termómetro de la calefacción,
// el frasco del bazar con sus tres precios, la hoja esqueleto, la cucharadita en el galón, el rosal medido por pie y la alfombra de flores.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";

const PI = Math.PI;
const lathe = (pts: number[][], seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
const SERIF = "Georgia, 'Times New Roman', serif";

// ---- 15:11 · EL TRAPO DE LA PICAZÓN: el paño se hunde en el bol de agua helada, sube, se retuerce y se apoya sobre el antebrazo; las gotas corren por la piel ----
export const HWashcloth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="tile"
  cam={{ at: [0.1, 0.1, 0], az: [-0.3, 0.1], el: [0.38, 0.42], r: [0.8, 0.7], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="GRANDMA'S ITCH RAG" col={ICE} />}>{(tt) => {
  const dip = Math.sin(cl((tt - 0.3) / 1.2) * PI), wr = eio(tt, 1.6, 3.0), mv = eio(tt, 3.0, 3.8), lay = eio(tt, 3.6, 4.2);
  const cloth = tex.text("waffle", 128, 128, (g) => { g.fillStyle = "#f4f6f8"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(120,150,190,.45)"; g.lineWidth = 2; for (let i = 0; i < 16; i++) { g.beginPath(); g.moveTo(i * 8, 0); g.lineTo(i * 8, 128); g.stroke(); g.beginPath(); g.moveTo(0, i * 8); g.lineTo(128, i * 8); g.stroke(); } g.fillStyle = "#6f9fd6"; g.fillRect(0, 108, 128, 10); });
  const cx = lerp(-0.1, 0.18, mv), cy = lerp(0.24 - 0.14 * dip + 0.04 * wr, 0.14, mv);
  return <>
    <group position={[-0.1, 0, 0]}>
      <mesh geometry={lathe([[0, 0], [0.09, 0], [0.13, 0.07], [0.135, 0.075], [0.125, 0.075], [0.085, 0.006], [0, 0.006]])} castShadow receiveShadow>{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.12, 0.09, 0.004, 48]} />{M.water({ op: 0.5, col: "#cfeaf7" })}</mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i * 1.1) * 0.06, 0.055 + 0.004 * Math.sin(tt * 2 + i), Math.sin(i * 1.1) * 0.06]} rotation={[i, i * 0.7, 0]}><boxGeometry args={[0.025, 0.022, 0.025]} /><meshPhysicalMaterial color="#e9f7ff" roughness={0.05} transmission={0.6} thickness={0.03} clearcoat={1} /></mesh>)}
    </group>
    {/* el antebrazo apoyado en la mesada, con la piel enrojecida que se calma */}
    <group position={[0.2, 0.05, 0.02]} rotation={[0, 0.25, PI / 2]}>
      <mesh castShadow receiveShadow><capsuleGeometry args={[0.045, 0.3, 12, 32]} /><meshPhysicalMaterial color={new THREE.Color("#e2907a").lerp(new THREE.Color("#e8b09a"), eio(tt, 4.2, 6.0))} roughness={0.55} sheen={0.5} sheenColor="#ffd9c8" /></mesh>
    </group>
    {/* el paño: retorcido mientras cuelga, después cae doblado sobre el brazo */}
    {lay < 1 && <group position={[cx, cy, 0]} rotation={[0, wr * PI * 2.5, mv * 0.6]} scale={[1 - 0.55 * wr + 0.3 * mv, 1 - 0.25 * wr, 1 - 0.55 * wr + 0.3 * mv]}>
      <mesh><cylinderGeometry args={[0.04, 0.05, 0.16, 24, 6, true]} /><meshStandardMaterial map={cloth} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    </group>}
    {lay > 0 && <group position={[0.19, 0.1 + (1 - lay) * 0.05, 0.02]} rotation={[0, 0.25, 0]}>
      <mesh rotation={[0, 0, PI / 2]} scale={[1, 1, 1]}><cylinderGeometry args={[0.052, 0.052, 0.14, 24, 1, true, -PI * 0.55, PI * 1.1]} /><meshStandardMaterial map={cloth} roughness={0.95} side={THREE.DoubleSide} /></mesh>
    </group>}
    {/* gotas: del paño retorcido al bol, y después por la piel con su sombra */}
    {wr > 0.1 && wr < 1 && Array.from({ length: 10 }, (_, i) => { const d = ((tt * 1.6 + rn(i, 3)) % 1); return <mesh key={i} position={[cx - 0.02 + rn(i, 4) * 0.04, cy - 0.07 - d * 0.12, -0.02 + rn(i, 5) * 0.04]}><sphereGeometry args={[0.0045, 8, 6]} />{M.water({ op: 0.9 })}</mesh>; })}
    {lay > 0.5 && Array.from({ length: 8 }, (_, i) => { const d = ((tt * 0.7 + rn(i, 6)) % 1); return <mesh key={"a" + i} position={[0.12 + rn(i, 7) * 0.14, 0.095 - d * 0.05, 0.05 + 0.01 * rn(i, 8)]} castShadow scale={[1, 1.4, 1]}><sphereGeometry args={[0.005, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 16:22 · PLUMAS Y ESTRELLAS: en el vidrio de la ventana de la cocina crecen ramas de cristal de sal (plumas) y estrellas de seis puntas ----
type Seg = { a: number[]; b: number[]; d: number };
const feather = (x: number, y: number, ang: number, len: number, depth: number, t0: number, out: Seg[]) => {
  const bx = x + Math.cos(ang) * len, by = y + Math.sin(ang) * len; out.push({ a: [x, y], b: [bx, by], d: t0 });
  if (depth <= 0) return;
  for (let i = 1; i <= 4; i++) { const k = i / 5, px = x + (bx - x) * k, py = y + (by - y) * k, l = len * 0.32 * (1 - k * 0.5);
    feather(px, py, ang + 0.75, l, depth - 1, t0 + k * 0.6 + 0.15, out); feather(px, py, ang - 0.75, l, depth - 1, t0 + k * 0.6 + 0.15, out); }
};
const FROST: Seg[] = (() => { const o: Seg[] = []; feather(-0.34, -0.22, 0.75, 0.32, 2, 0.6, o); feather(0.34, -0.22, 2.4, 0.3, 2, 1.1, o); feather(-0.3, 0.24, -0.6, 0.26, 2, 1.6, o); feather(0.06, -0.24, 1.5, 0.22, 2, 2.0, o); return o; })();
export const HFrost: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark"
  cam={{ at: [0, 0.3, 0], az: [-0.18, 0.12], el: [0.05, 0.02], r: [0.85, 0.72], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="FEATHERS AND STARS" col={ICE} />}>{(tt) => {
  return <>
    {/* marco de ventana de madera blanca con cruz */}
    {[[0, 0.58, 0.82, 0.04], [0, 0.02, 0.82, 0.04], [-0.41, 0.3, 0.04, 0.6], [0.41, 0.3, 0.04, 0.6], [0, 0.3, 0.02, 0.56], [0, 0.3, 0.8, 0.02]].map((b, i) =>
      <RBox key={i} s={[b[2], b[3], 0.03]} p={[b[0], b[1], 0]} r={0.004}>{M.porcelain({ col: "#efede6" })}</RBox>)}
    <mesh position={[0, 0.3, -0.005]}><planeGeometry args={[0.8, 0.56]} /><meshPhysicalMaterial color="#1b2a3a" roughness={0.05} clearcoat={1} emissive="#0c1a2a" emissiveIntensity={0.6} /></mesh>
    <group position={[0, 0.3, 0.004]}>
      {FROST.map((s, i) => { const k = cl((tt - s.d) / 0.5); if (k <= 0) return null;
        const dx = (s.b[0] - s.a[0]) * k, dy = (s.b[1] - s.a[1]) * k, L = Math.hypot(dx, dy);
        return <mesh key={i} position={[s.a[0] + dx / 2, s.a[1] + dy / 2, 0]} rotation={[0, 0, Math.atan2(dy, dx)]}><boxGeometry args={[L, 0.0022, 0.001]} />{M.glow({ col: "#eaf6ff", op: 0.85 })}</mesh>; })}
      {/* estrellas de seis puntas */}
      {Array.from({ length: 9 }, (_, i) => { const k = phys(tt, 2.4 + i * 0.25, 7, 0.5), x = -0.3 + rn(i, 2) * 0.6, y = -0.2 + rn(i, 3) * 0.42, r = 0.018 + 0.016 * rn(i, 4);
        return k > 0 && <group key={i} position={[x, y, 0.001]} scale={Math.max(0.001, cl(k))} rotation={[0, 0, tt * 0.2 + i]}>
          {[0, 1, 2].map((j) => <mesh key={j} rotation={[0, 0, j * PI / 3]}><boxGeometry args={[r * 2, 0.002, 0.001]} />{M.glow({ col: "#ffffff", op: 0.95 })}</mesh>)}
        </group>; })}
    </group>
    <pointLight position={[0, 0.3, 0.3]} color="#bfe4ff" intensity={0.8} distance={1.2} />
  </>;
}}</Scene3D>;

// ---- 17:29 · EL FONDO DE LA CALEFACCIÓN: la lata de colecta de la iglesia; caen monedas y billetes y la aguja del medidor de madera sube hasta 300 de 1.100 y tiembla; la caldera vieja, apagada ----
const gaugeTex = () => tex.text("gauge1100", 512, 300, (g) => {
  g.fillStyle = "#f3ead6"; g.fillRect(0, 0, 512, 300); g.translate(256, 270);
  for (let i = 0; i <= 11; i++) { const a = PI + (i / 11) * PI; g.strokeStyle = i >= 11 ? "#b8322a" : "#3a2a1a"; g.lineWidth = i % 2 ? 4 : 7; g.beginPath(); g.moveTo(Math.cos(a) * 200, Math.sin(a) * 200); g.lineTo(Math.cos(a) * (i % 2 ? 222 : 236), Math.sin(a) * (i % 2 ? 222 : 236)); g.stroke(); }
  g.fillStyle = "#3a2a1a"; g.font = "900 34px Georgia"; g.textAlign = "center";
  [[0, "0"], [3, "300"], [11, "1,100"]].forEach(([i, s]) => { const a = PI + ((i as number) / 11) * PI; g.fillStyle = i === 11 ? "#b8322a" : "#3a2a1a"; g.fillText(s as string, Math.cos(a) * 160, Math.sin(a) * 160 + 12); });
  g.fillStyle = "rgba(184,50,42,.25)"; g.beginPath(); g.arc(0, 0, 236, PI + (10.5 / 11) * PI, 2 * PI); g.arc(0, 0, 200, 2 * PI, PI + (10.5 / 11) * PI, true); g.fill();
});
export const HFurnaceJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="wood"
  cam={{ at: [0.06, 0.18, 0.08], az: [0.3, 0.12], el: [0.16, 0.2], r: [1.2, 1.05], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="THE FURNACE FUND · 1994" col={RED} />}>{(tt) => {
  const fill = eio(tt, 0.8, 5.4), shake = 0.03 * Math.sin(tt * 22) * cl((tt - 3.2) * 2) * (1 - cl((tt - 5) / 1.5));
  const needle = PI - (fill * 3 / 11) * PI;
  return <>
    {/* la lata de colecta con ranura */}
    <group position={[0.14, 0, 0.14]} scale={1.45} rotation={[0, PI + 0.3 + PI / 2, 0]}>
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 0.16, 40]} /><meshStandardMaterial map={tex.text("tincan4", 512, 128, (g) => { g.fillStyle = "#2f5fa8"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#f3ead6"; g.fillRect(0, 36, 512, 56); for (const cx of [128, 384]) { g.save(); g.translate(cx, 0); g.scale(0.55, 1); g.fillStyle = "#2f5fa8"; g.font = "900 44px Georgia"; g.textAlign = "center"; g.fillText("FURNACE", 0, 79); g.restore(); } })} metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[0, 0.162, 0]}><cylinderGeometry args={[0.071, 0.071, 0.006, 40]} />{M.steel()}</mesh>
      <mesh position={[0, 0.166, 0]}><boxGeometry args={[0.05, 0.002, 0.008]} /><meshBasicMaterial color="#111" /></mesh>
    </group>
    {/* monedas y billetes que caen a la ranura */}
    {Array.from({ length: 10 }, (_, i) => { const a = 0.5 + i * 0.52, f = cl((tt - a) / 0.45); const bill = i % 3 === 1;
      return f > 0 && f < 1 && <group key={i} position={[0.14, 0.46 - 0.22 * f * f, 0.14]} rotation={[bill ? 0.2 * Math.sin(tt * 9) : PI / 2, f * 3, 0]}>
        {bill ? <mesh><planeGeometry args={[0.12, 0.052]} /><meshStandardMaterial color="#9cbf8a" side={THREE.DoubleSide} roughness={0.8} /></mesh> : <mesh><cylinderGeometry args={[0.024, 0.024, 0.004, 24]} /><meshStandardMaterial color={i % 2 ? "#d8dade" : "#d08a52"} metalness={0.45} roughness={0.32} /></mesh>}
      </group>; })}
    {/* el medidor de madera colgado: aguja que sube hasta 300 y tiembla, lejos de la zona roja */}
    <group position={[-0.12, 0.28, -0.06]}>
      <RBox s={[0.3, 0.2, 0.02]} p={[0, 0.0, -0.012]} r={0.012}>{M.wood({ base: [120, 80, 46], rx: 1, ry: 1 })}</RBox>
      <mesh position={[0, 0.0, 0.0]}><planeGeometry args={[0.27, 0.16]} /><meshStandardMaterial map={gaugeTex()} roughness={0.8} /></mesh>
      <group position={[0, -0.065, 0.006]} rotation={[0, 0, needle - PI / 2 + shake]}>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.005, 0.1, 0.003]} /><meshStandardMaterial color="#b8322a" /></mesh>
      </group>
      <mesh position={[0, -0.065, 0.008]}><cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />{M.brass()}</mesh>
    </group>
    {/* la caldera vieja: la llamita azul se apaga */}
    <group position={[-0.36, 0, 0.06]}>
      <RBox s={[0.2, 0.34, 0.18]} p={[0, 0.17, 0]} r={0.02}>{M.steel({ col: "#6d7177" })}</RBox>
      <mesh position={[0, 0.1, 0.092]}><circleGeometry args={[0.035, 24]} /><meshStandardMaterial color="#1a1a1a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.1, 0.093]}><circleGeometry args={[0.012, 16]} />{M.glow({ col: "#4aa3ff", op: 0.6 * Math.max(0, Math.sin(tt * 7)) * (1 - cl(tt - 1.5)) })}</mesh>
      <mesh position={[0.05, 0.42, 0]}><cylinderGeometry args={[0.03, 0.03, 0.16, 16]} />{M.steel({ col: "#55595e" })}</mesh>
      {/* meta cumplida: la caldera se enciende, boca naranja y resplandor en el piso */}
      <mesh position={[0, 0.1, 0.0935]}><circleGeometry args={[0.034, 24]} />{M.glow({ col: "#ff8a2a", op: 0.95 * eio(tt, 3.4, 4.2) })}</mesh>
      <mesh position={[0, 0.002, 0.2]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} />{M.glow({ col: "#ff9a3a", op: 0.35 * eio(tt, 3.4, 4.2) })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 18:01 · UN FRASCO, TRES PRECIOS: el frasco del bazar sobre la mesa y, delante, tres columnas de monedas que crecen: 1 (lo que costó), 6 (lo que lo vendimos), 12 (la tienda del pueblo) ----
export const HPriceJars: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0.02, 0.12, 0], az: [0.3, -0.18], el: [0.24, 0.3], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="THE BAZAAR BATH JAR" col={AMB} />}>{(tt) => {
  const land = phys(tt, 0.1, 6, 0.5);
  const calico = tex.text("calico", 128, 128, (g) => { g.fillStyle = "#c85a6a"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 70; i++) { g.fillStyle = i % 2 ? "#fff3d6" : "#7aa860"; g.beginPath(); g.arc(rn(i, 2) * 128, rn(i, 3) * 128, 3, 0, 7); g.fill(); } });
  const cols: [number, number, string, string][] = [[1, 0.6, "$1.10", "#2f6fa8"], [6, 1.4, "$6", "#2e8a4a"], [12, 2.8, "$12", "#b8322a"]];
  return <>
    <group position={[-0.22, (1 - cl(land)) * 0.3, -0.05]} rotation={[0, 0.3 * Math.sin(tt * 0.5), 0]} scale={1.5}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.055, 0.055, 0.14, 40, 1, true]} />{M.glass({ op: 0.28 })}</mesh>
      <mesh position={[0, 0.065, 0]}><cylinderGeometry args={[0.052, 0.052, 0.12, 40]} /><meshPhysicalMaterial color="#c9b2e6" roughness={0.55} /></mesh>
      <mesh position={[0, 0.148, 0]}><cylinderGeometry args={[0.058, 0.058, 0.014, 40]} />{M.brass({ col: "#c9a24a" })}</mesh>
      <mesh position={[0, 0.157, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.075, 24]} /><meshStandardMaterial map={calico} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.075, 0.062, 0.025, 24, 1, true]} /><meshStandardMaterial map={calico} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.137, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.063, 0.003, 8, 40]} /><meshStandardMaterial color="#7a3fa0" roughness={0.5} /></mesh>
    </group>
    {cols.map(([n, a, lbl, col], c) => { const bk = phys(tt, a - 0.3, 7, 0.45); return <group key={c} position={[-0.02 + c * 0.15, 0, 0.06]} scale={[1.3, 1.3, 1.3]}>
      {/* tacuito de madera con el precio grabado */}
      <RBox s={[0.1, 0.03, 0.04]} p={[0, 0.015 + (1 - cl(bk)) * 0.25, 0.06]} r={0.006}>{M.wood({ base: [190, 150, 100], rx: 1, ry: 1 })}</RBox>
      <mesh position={[0, 0.015 + (1 - cl(bk)) * 0.25, 0.0805]}><planeGeometry args={[0.09, 0.026]} /><meshStandardMaterial map={tex.text("pr" + lbl, 256, 72, (g) => { g.clearRect(0, 0, 256, 72); g.fillStyle = col; g.font = "900 60px Georgia"; g.textAlign = "center"; g.fillText(lbl, 128, 58); })} transparent /></mesh>
      {Array.from({ length: n }, (_, i) => { const k = phys(tt, a + i * 0.1, 9, 0.35); return <mesh key={i} position={[0.003 * Math.sin(i * 2), 0.004 + i * 0.0075 + (1 - cl(k)) * 0.25, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.0065, 32]} />{M.brass({ col: "#d8b452" })}</mesh>; })}
    </group>; })}
  </>;
}}</Scene3D>;

// ---- 19:31 · EL ESQUELETO VERDE: hoja grande con nervaduras en relieve; el amarillo avanza ENTRE ellas y la lupa pasa y las agranda ----
const leafTex = (yel: boolean) => tex.text(yel ? "leafY" : "leafG", 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512);
  g.save(); g.beginPath(); g.moveTo(256, 20); g.bezierCurveTo(470, 140, 460, 380, 256, 500); g.bezierCurveTo(52, 380, 42, 140, 256, 20); g.closePath(); g.clip();
  g.fillStyle = yel ? "#e9cf3c" : "#2f7a35"; g.fillRect(0, 0, 512, 512);
  if (yel) { g.strokeStyle = "#2f7a35"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(256, 30); g.lineTo(256, 495); g.stroke();
    for (let i = 0; i < 7; i++) { const y = 80 + i * 58; g.lineWidth = 14; g.beginPath(); g.moveTo(256, y); g.quadraticCurveTo(330, y - 10, 420 - i * 8, y - 50); g.stroke(); g.beginPath(); g.moveTo(256, y); g.quadraticCurveTo(182, y - 10, 92 + i * 8, y - 50); g.stroke(); } }
  else { g.strokeStyle = "#3f8f44"; g.lineWidth = 6; g.beginPath(); g.moveTo(256, 30); g.lineTo(256, 495); g.stroke(); }
  g.restore();
});
// nervaduras 3D en las mismas posiciones que la textura (hoja de 0,46 m: 512 px → 0,46)
const VEINS: number[][][] = (() => { const S = 0.46 / 512, P = (x: number, y: number) => [(x - 256) * S, (256 - y) * S, 0.004]; const o: number[][][] = [[P(256, 30), P(256, 260), P(256, 495)]];
  for (let i = 0; i < 7; i++) { const y = 80 + i * 58; o.push([P(256, y), P(330, y - 14), P(420 - i * 8, y - 50)]); o.push([P(256, y), P(182, y - 14), P(92 + i * 8, y - 50)]); } return o; })();
export const HSkeleton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0, 0.25, 0], az: [-0.3, 0.15], el: [0.2, 0.12], r: [0.78, 0.64], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="A GREEN SKELETON IN A YELLOW LEAF" col={GRN} />}>{(tt) => {
  const y = eio(tt, 0.8, 3.4), sw = Math.sin(tt * 1.3) * 0.06, lx = lerp(-0.18, 0.12, eio(tt, 2.8, 5.6)), ly = lerp(0.1, -0.08, eio(tt, 2.8, 5.6));
  return <group position={[0, 0.25, 0]} rotation={[0.1, sw, 0.05]}>
    <mesh><planeGeometry args={[0.46, 0.46]} /><meshStandardMaterial map={leafTex(false)} transparent alphaTest={0.4} roughness={0.6} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.46, 0.46]} /><meshStandardMaterial map={leafTex(true)} transparent opacity={y} alphaTest={0.02} roughness={0.6} side={THREE.DoubleSide} /></mesh>
    {VEINS.map((v, i) => <mesh key={i} geometry={tubeG("vein" + i, v, i === 0 ? 0.0045 : 0.003, 24, 8)} castShadow><meshStandardMaterial color="#2f7a35" roughness={0.45} /></mesh>)}
    <mesh position={[0, -0.27, 0]}><cylinderGeometry args={[0.006, 0.008, 0.1, 10]} /><meshStandardMaterial color="#2f6b30" roughness={0.7} /></mesh>
    {/* la lupa pasa por encima */}
    <group position={[lx, ly, 0.09]} scale={cl(phys(tt, 2.5, 6, 0.5))}>
      <mesh><torusGeometry args={[0.075, 0.006, 12, 48]} />{M.chrome({ col: "#2a2a2a" })}</mesh>
      <mesh scale={[1, 1, 0.16]}><sphereGeometry args={[0.075, 40, 20]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transmission={1} thickness={0.06} ior={1.5} transparent opacity={0.9} /></mesh>
      <mesh position={[0.11, -0.07, 0]} rotation={[0, 0, 0.9]}><cylinderGeometry args={[0.009, 0.011, 0.1, 12]} /><meshStandardMaterial color="#1a1a1a" roughness={0.5} /></mesh>
    </group>
  </group>;
}}</Scene3D>;

// ---- 19:45 · UNA CUCHARADITA EN UN GALÓN: el bidón azul translúcido sobre fondo oscuro; la cucharita vuelca, la sal baja en hilo y el agua se tiñe en capas de abajo hacia arriba ----
export const HTspGallon: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark"
  cam={{ at: [0, 0.17, 0], az: [0.35, -0.1], el: [0.08, 0.16], r: [0.95, 0.84], fov: 30 }}
  over={(tt) => <Head tt={tt} kick="" title="1 TEASPOON · 1 GALLON" col={GRN} />}>{(tt) => {
  const sp = phys(tt, 0.4, 6, 0.5), tip = [1.4, 2.8, 4.2].reduce((a, s) => Math.max(a, eio(tt, s, s + 0.4) * (1 - eio(tt, s + 0.8, s + 1.1))), 0), sink = cl((tt - 1.8) / 1.0), tint = eio(tt, 1.9, 5.4);
  return <>
    {/* bidón de plástico azul translúcido con asa */}
    <RBox s={[0.17, 0.26, 0.17]} p={[0, 0.13, 0]} r={0.03}><meshPhysicalMaterial color="#cfe4ff" roughness={0.25} transparent opacity={0.28} /></RBox>
    {/* el agua en cuatro capas que se van tiñendo de verde claro desde el fondo */}
    {(() => { const lv = 0.12 + [1.6, 3.0, 4.4].reduce((a, s) => a + 0.035 * eio(tt, s, s + 0.7), 0); return <mesh position={[0, 0.012 + lv / 2, 0]}><boxGeometry args={[0.152, lv, 0.152]} />{M.water({ op: 0.85, col: "#" + new THREE.Color("#bfe2f0").lerp(new THREE.Color("#3fb86a"), tint).getHexString() })}</mesh>; })()}
    <mesh position={[0, 0.29, 0]}><cylinderGeometry args={[0.025, 0.03, 0.04, 20]} />{M.plastic({ col: "#3a7bd5" })}</mesh>
    <mesh position={[0.075, 0.2, 0]} rotation={[0, PI / 2, 0]}><torusGeometry args={[0.04, 0.012, 10, 24, PI]} /><meshPhysicalMaterial color="#8fc4ff" roughness={0.3} transparent opacity={0.6} /></mesh>
    {/* cucharita grande en cuadro */}
    <group position={[-0.03 - (1 - cl(sp)) * 0.45, 0.35, 0.03]} rotation={[0, 0.3, -1.4 * tip]} scale={2.6}>
      <mesh position={[0.05, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.0025, 0.003, 0.08, 10]} />{M.steel()}</mesh>
      <mesh scale={[1, 0.35, 0.7]}><sphereGeometry args={[0.013, 16, 8, 0, PI * 2, PI / 2, PI / 2]} />{M.steel({ side: THREE.DoubleSide })}</mesh>
    </group>
    {/* el montoncito de sal que se junta en el fondo y se disuelve */}
    <mesh position={[0, 0.012, 0]} scale={[1, Math.max(0.001, cl(sink * 2) * (1 - tint * 0.9)), 1]}><coneGeometry args={[0.04, 0.03, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0.3} clearcoat={1} /></mesh>
    {/* el chorrito de sal que cae de la cucharita a la boca del bidón */}
    {tip > 0.4 && <mesh position={[-0.01, 0.31, 0.03]}><cylinderGeometry args={[0.004, 0.006, 0.08, 10]} /><meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} transparent opacity={0.9 * Math.sin(cl(tip * 1.2 + sink) * PI)} /></mesh>}
    {/* la sal que baja girando dentro del agua */}
    {sink > 0 && Array.from({ length: 16 }, (_, i) => { const f = cl(sink * 1.4 - rn(i, 4) * 0.4); return f < 1 && <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.03 + 0.01 * Math.sin(f * 6 + i), 0.33 - f * 0.3, (rn(i, 3) - 0.5) * 0.03]}><boxGeometry args={[0.008, 0.011, 0.008]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>; })}
  </>;
}}</Scene3D>;

// ---- 20:35 · UNA CUCHARADA POR PIE: el rosal alto contra la vara de medir; en cada pie se engancha una cuchara de madera que vuelca su sal al pie de la planta ----
export const HPerFoot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark"
  cam={{ at: [0.02, 0.38, 0], az: [0.35, 0.12], el: [0.12, 0.18], r: [1.5, 1.35], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="ONE TABLESPOON PER FOOT" col={AMB} />}>{(tt) => {
  return <>
    <mesh position={[0, 0.0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.4, 40]} /><meshStandardMaterial color="#4a3222" roughness={1} /></mesh>
    {/* tallos del rosal con hojas de a pares */}
    {[[-0.1, 0], [-0.05, 0.03], [-0.12, -0.03]].map(([x, z], s) => <mesh key={s} geometry={tubeG("rstem" + s, [[x, 0, z], [x + 0.02, 0.2, z], [x - 0.01, 0.42, z + 0.01], [x + 0.01, 0.62 - s * 0.04, z]], 0.006)}><meshStandardMaterial color="#3a6a2a" roughness={0.7} /></mesh>)}
    {Array.from({ length: 22 }, (_, i) => <mesh key={i} position={[-0.09 + (rn(i, 2) - 0.5) * 0.12, 0.08 + (i / 22) * 0.54, (rn(i, 4) - 0.5) * 0.1]} rotation={[rn(i, 5) * 2, rn(i, 6) * 3, 0.6]} scale={[1, 0.22, 0.55]}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color="#2f6b34" roughness={0.7} /></mesh>)}
    {Array.from({ length: 5 }, (_, i) => <mesh key={"r" + i} position={[-0.08 + Math.cos(i * 2.3) * 0.07, 0.3 + rn(i, 7) * 0.32, 0.05]}><sphereGeometry args={[0.022, 14, 10]} /><meshPhysicalMaterial color="#e86f92" roughness={0.5} sheen={1} /></mesh>)}
    {/* un pimpollo nuevo por cada cucharada: se abre a la altura de su marca */}
    {[0, 1, 2].map((i) => { const g = phys(tt, 0.8 + i * 1.5 + 1.3, 6, 0.5); return <group key={"bud" + i} position={[-0.02, 0.2 + i * 0.17, 0.07]} scale={Math.max(0.001, cl(g) * 1.2)}>
      <mesh scale={[1, 1.25, 1]}><sphereGeometry args={[0.024, 16, 12]} /><meshPhysicalMaterial color="#d84a78" roughness={0.45} sheen={1} sheenColor="#ffc0d0" /></mesh>
      {[0, 1, 2, 3].map((p) => <mesh key={p} position={[0, -0.018, 0]} rotation={[0.5, (p / 4) * PI * 2, 0]}><coneGeometry args={[0.01, 0.03, 6]} /><meshStandardMaterial color="#4f7a3a" roughness={0.8} /></mesh>)}</group>; })}
    {/* vara de medir con muescas: tres pies */}
    <RBox s={[0.03, 0.7, 0.01]} p={[0.1, 0.35, 0.05]} r={0.003}>{M.wood({ base: [222, 190, 120], rx: 1, ry: 1 })}</RBox>
    {[1, 2, 3].map((i) => <group key={i}><mesh position={[0.1, 0.21 * i, 0.056]}><boxGeometry args={[0.1, 0.024, 0.008]} /><meshStandardMaterial color="#3a2a1a" /></mesh><mesh position={[0.1, 0.21 * i - 0.04, 0.0565]}><planeGeometry args={[0.04, 0.05]} /><meshStandardMaterial map={tex.text("ft" + i, 64, 80, (g) => { g.clearRect(0, 0, 64, 80); g.fillStyle = "#3a2a1a"; g.font = "900 60px Georgia"; g.textAlign = "center"; g.fillText(String(i), 32, 62); })} transparent /></mesh></group>)}
    {[0, 1, 2].map((i) => { const a = 0.8 + i * 1.5, k = phys(tt, a, 7, 0.45), tip = eio(tt, a + 0.8, a + 1.2), f = cl((tt - a - 1.0) / 0.5);
      return <group key={i}>
        {/* la cuchara de madera llega a la muesca de su pie */}
        <group visible={tt > a && tt < a + 1.6} position={[0.16 + (1 - cl(k)) * 0.3 + 0.45 * eio(tt, a + 1.25, a + 1.6), 0.21 * (i + 1), 0.07]} rotation={[0, 0, -0.2 - 1.4 * tip]} scale={1.8}>
          <mesh position={[0.06, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.005, 0.006, 0.11, 10]} />{M.wood({ base: [196, 150, 96], rx: 1, ry: 1 })}</mesh>
          <mesh scale={[1.3, 0.4, 1]}><sphereGeometry args={[0.018, 16, 8, 0, PI * 2, PI / 2, PI / 2]} />{M.wood({ base: [196, 150, 96], rx: 1, ry: 1 })}</mesh>
          {tip < 0.5 && <mesh position={[0, 0.004, 0]} scale={[1.2, 0.4, 1]}><sphereGeometry args={[0.015, 12, 8, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#fbfdff" roughness={0.3} /></mesh>}
        </group>
        {/* el hilo de sal y el montoncito al pie */}
        {f > 0 && f < 1 && <mesh position={[0.15, 0.21 * (i + 1) * (1 - f) / 2 + 0.01, 0.07]}><cylinderGeometry args={[0.003, 0.004, 0.21 * (i + 1) * (1 - f) + 0.01, 8]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.7} /></mesh>}
        <mesh position={[-0.22 + i * 0.07, 0.006, 0.2]} scale={[1, Math.max(0.001, 0.5 * cl(f * 2)), 1]}><sphereGeometry args={[0.024, 16, 10, 0, PI * 2, 0, PI / 2]} /><meshPhysicalMaterial color="#fbfdff" roughness={0.3} clearcoat={0.8} /></mesh>
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 21:31 · TODO FLOR, NI UN MORRÓN: dos plantas frente a frente; la de la izquierda suelta sus flores al suelo; en la de la derecha, donde cae la flor crece un morrón rojo ----
const PepPlant: React.FC<{ tt: number; side: number; fruit: boolean }> = ({ tt, side, fruit }) => {
  const N = 9;
  return <group position={[side * 0.2, 0, 0]}>
    <mesh position={[0, 0, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.16, 32]} /><meshStandardMaterial color="#5a3d26" roughness={1} /></mesh>
    <mesh geometry={tubeG("pepStem" + side, [[0, 0, 0], [0.01, 0.12, 0], [-0.01, 0.24, 0.01], [0, 0.32, 0]], 0.007)}><meshStandardMaterial color="#3d7a3a" roughness={0.7} /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.07, 0.1 + i * 0.02, Math.sin(i * 2.1) * 0.07]} rotation={[0.6, i * 2.1, 0.3]} scale={[1, 1, 2.2]}><sphereGeometry args={[0.028, 12, 8]} /><meshStandardMaterial color="#3f8a3d" roughness={0.6} /></mesh>)}
    {Array.from({ length: N }, (_, i) => { const a = i * 2.4, r = 0.06 + 0.04 * rn(i, 2), y0 = 0.13 + rn(i, 3) * 0.18, t0 = 0.6 + i * 0.4, k = cl((tt - t0) / 0.7), ky = k * k;
      const gx = Math.cos(a) * (r + 0.07 * rn(i, 4)), gz = Math.sin(a) * (r + 0.07 * rn(i, 4)), pep = fruit ? eio(tt, t0 + 0.4, t0 + 1.6) : 0;
      return <group key={i}>
        <group position={[lerp(Math.cos(a) * r, gx, k), lerp(y0, 0.005, ky), lerp(Math.sin(a) * r, gz, k)]} rotation={[k * 4 * rn(i, 5), k * 3, k >= 1 ? -PI / 2 : 0]}>
          {Array.from({ length: 5 }, (_, j) => <mesh key={j} position={[Math.cos(j * 1.256) * 0.008, 0, Math.sin(j * 1.256) * 0.008]} rotation={[0, -j * 1.256, 0]} scale={[1.6, 0.25, 1]}><sphereGeometry args={[0.007, 8, 6]} /><meshStandardMaterial color="#fbfbf4" roughness={0.6} /></mesh>)}
          <mesh><sphereGeometry args={[0.003, 6, 4]} /><meshStandardMaterial color="#e8c43a" /></mesh>
        </group>
        {/* el morrón colgando donde estaba la flor */}
        {fruit && pep > 0 && <group position={[Math.cos(a) * r, y0 - 0.02 * pep, Math.sin(a) * r]} scale={Math.max(0.001, pep)}>
          <mesh scale={[1, 1.25, 1]}><sphereGeometry args={[0.036, 16, 12]} /><meshPhysicalMaterial color="#d62f22" roughness={0.25} clearcoat={1} /></mesh>
          <mesh position={[0, 0.048, 0]}><cylinderGeometry args={[0.004, 0.006, 0.018, 8]} /><meshStandardMaterial color="#3d7a3a" /></mesh>
        </group>}
      </group>; })}
  </group>;
};
export const HBlossoms: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [-0.2, 0.1], el: [0.28, 0.34], r: [0.88, 0.74], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="ALL FLOWERS · NO PEPPERS" col={RED} />}>{(tt) => <>
  <PepPlant tt={tt} side={-1} fruit={false} />
  <PepPlant tt={tt} side={1} fruit />
</>}</Scene3D>;
