// rosa29e · bloque 5 en 3D: los cuatro tápers, la olla de regalo, la empanada, la ficha que pasa, el billete partido, la funda tejida, la cuchara.
import React, { useMemo } from "react";
import * as THREE from "three";
import { H, cl } from "./hkit";
import { C3, Stage3, Kitchen, Cam, orbit, Pot, Lid, Spoon, Steam, Plate, Card, M, T, V, ease, ramp, spr, rnd, lerp, rbox } from "./k3d";

type P = { t: number; h: H };
const mtex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const lv3 = (a: V, b: V, k: number): V => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const labelTex = (s: string, bg = "#f3ead6", fg = "#2b2118") => mtex(512, 192, (g) => { g.fillStyle = bg; g.fillRect(0, 0, 512, 192); g.fillStyle = fg; g.font = "italic 700 112px Georgia, serif"; g.textAlign = "center"; g.fillText(s, 256, 136); });

// táper de vidrio con guiso adentro y tapa de color
const Tub: React.FC<{ p: V; frost?: number; lid?: string; tag?: THREE.Texture }> = ({ p, frost = 0, lid = "#3f7a6a", tag }) => (
  <group position={p}>
    <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.34, 0.12, 0.24]} /><meshPhysicalMaterial color="#7a3a1a" roughness={0.2} clearcoat={1} /></mesh>
    <mesh position={[0, 0.08, 0]} geometry={rbox(0.37, 0.16, 0.27, 0.03)} castShadow><meshPhysicalMaterial color={new THREE.Color("#e9e2d4").lerp(new THREE.Color("#f4fbff"), frost).getStyle()} roughness={lerp(0.3, 0.8, frost)} clearcoat={1 - frost} /></mesh>
    <mesh position={[0, 0.17, 0]} geometry={rbox(0.38, 0.03, 0.28, 0.012)} castShadow><meshStandardMaterial color={lid} roughness={0.4} /></mesh>
    {tag && <mesh position={[0, 0.09, 0.137]}><planeGeometry args={[0.3, 0.11]} /><meshStandardMaterial map={tag} roughness={0.9} /></mesh>}
  </group>
);

// ───────── 1 · CUATRO TÁPERS: el domingo y el miércoles van a la heladera; dos al congelador y se escarchan
export const WeekTubs3: React.FC<P> = ({ t, h }) => {
  const tags = useMemo(() => ["DOM", "MIÉ"].map((s) => labelTex(s)), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const go = [0.5, 1.4, 2.4, 2.8].map((a) => ramp(tt, a, a + 0.7)), frost = ramp(tt, 3.3, 4.6);
    const c = orbit(tt, [0, 1.0, 1.75], [0, 0.42, -0.1], 0.12, 0.01);
    const from: V[] = [[-0.6, 0.0, 0.3], [-0.2, 0.0, 0.3], [0.2, 0.0, 0.3], [0.6, 0.0, 0.3]];
    const to: V[] = [[-0.55, 0.62, -0.35], [-0.55, 0.22, -0.35], [0.55, 0.62, -0.35], [0.55, 0.22, -0.35]];
    return <C3 bloom={0.12}><Cam p={c.p} l={c.l} fov={46} /><Kitchen />
      {/* la heladera (izquierda, luz cálida) y el congelador (derecha, luz fría), abiertos */}
      {[-1, 1].map((d) => <group key={d} position={[d * 0.55, 0, -0.42]}>
        {/* caja abierta por delante: fondo, laterales, techo y estantes */}
        <mesh position={[0, 0.5, -0.2]} receiveShadow><boxGeometry args={[0.5, 1.0, 0.02]} /><meshStandardMaterial color={d < 0 ? "#f2ede2" : "#cfe2f0"} roughness={0.6} /></mesh>
        {[-1, 1].map((e) => <mesh key={e} position={[e * 0.25, 0.5, 0]} receiveShadow><boxGeometry args={[0.02, 1.0, 0.42]} /><meshStandardMaterial color={d < 0 ? "#e8e2d4" : "#c4d8e8"} roughness={0.6} /></mesh>)}
        <mesh position={[0, 1.0, 0]}><boxGeometry args={[0.52, 0.02, 0.42]} /><meshStandardMaterial color={d < 0 ? "#e8e2d4" : "#c4d8e8"} roughness={0.6} /></mesh>
        {[0.2, 0.6].map((y) => <mesh key={y} position={[0, y, 0]} receiveShadow><boxGeometry args={[0.48, 0.015, 0.4]} /><meshStandardMaterial color={d < 0 ? "#d8d0c0" : "#b8d0e4"} roughness={0.4} /></mesh>)}
        <pointLight position={[0, 0.85, 0.05]} intensity={0.8} distance={1.2} color={d < 0 ? "#ffe8c0" : "#cfe6ff"} />
      </group>)}
      {[0, 1, 2, 3].map((i) => { const k = go[i], arc = Math.sin(Math.PI * k) * 0.25; const p = lv3(from[i], to[i], k); return <Tub key={i} p={[p[0], p[1] + arc, p[2]]} frost={i > 1 ? frost : 0} lid={i > 1 ? "#4a6a8a" : "#3f7a6a"} tag={i < 2 ? tags[i] : undefined} />; })}
      {/* la escarcha que brilla en el congelador */}
      {frost > 0 && Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[0.55 + (rnd(i, 1) - 0.5) * 0.4, 0.25 + rnd(i, 2) * 0.55, -0.2]} scale={frost * (0.5 + rnd(i, 3))}><octahedronGeometry args={[0.008]} /><meshStandardMaterial color="#ffffff" emissive="#dff0ff" emissiveIntensity={0.6} /></mesh>)}
    </C3>;
  }}</Stage3>;
};

// ───────── 2 · LA OLLA DE REGALO: la caja de cartón con moño; las cintas caen, las solapas se abren y sube la olla de hierro con su tarjeta
export const GiftPot3: React.FC<P> = ({ t, h }) => {
  const card = useMemo(() => labelTex("Para Rosa", "#f6efe0", "#8a1a14"), []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const rib = ramp(tt, 0.4, 1.0), flap = ramp(tt, 1.1, 1.9), rise = spr(tt, 1.9, 6, 0.5), cardIn = ramp(tt, 2.8, 3.6);
    const c = orbit(tt, [0.1, 1.15, 2.0], [0, 0.6, 0], 0.12, 0.01);
    const B = 0.62, Hh = 0.5;
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={42} /><Kitchen />
      {/* la caja (cuatro paredes) */}
      {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * Math.PI / 2, 0]}>
        <mesh position={[0, Hh / 2, B / 2]} castShadow receiveShadow><boxGeometry args={[B, Hh, 0.012]} /><meshStandardMaterial color="#b88a56" roughness={0.9} /></mesh>
        {/* la solapa de arriba, bisagra en el borde */}
        <group position={[0, Hh, B / 2]} rotation={[lerp(-Math.PI / 2, 0.5, flap), 0, 0]}>
          <mesh position={[0, 0.0, -B / 4]} rotation={[Math.PI / 2, 0, 0]} castShadow><planeGeometry args={[B, B / 2]} /><meshStandardMaterial color="#c49866" roughness={0.9} side={THREE.DoubleSide} /></mesh>
        </group>
      </group>)}
      {/* la cinta roja: cruz sobre la caja que se desliza y cae al costado */}
      {[0, 1].map((i) => <mesh key={i} position={[lerp(0, 0.62 + i * 0.05, rib), Hh + 0.012 - rib * (Hh - 0.006), lerp(0, 0.25 - i * 0.12, rib)]} rotation={[0, i * Math.PI / 2 + rib * 0.6, 0]} castShadow><boxGeometry args={[B + 0.04, 0.008, 0.06]} /><meshStandardMaterial color="#b3241c" roughness={0.45} /></mesh>)}
      <mesh position={[lerp(0, 0.64, rib), Hh + 0.04 - rib * (Hh - 0.022), lerp(0, 0.2, rib)]} rotation={[rib * Math.PI / 2, 0, 0]} castShadow><torusKnotGeometry args={[0.04, 0.014, 48, 8, 2, 3]} /><meshStandardMaterial color="#c42a20" roughness={0.45} /></mesh>
      {/* la olla de hierro sube */}
      <group position={[0, lerp(0.02, 0.4, cl(rise)), 0]}>
        <Pot s={0.5} fill={0} col="#2a2420" />
        {/* la tarjeta colgada del asa */}
        <group position={[0.1, 0.2, 0.3]} rotation={[0, 0, (1 - cardIn) * 0.8 + Math.sin(tt * 2) * 0.05]} scale={cardIn * 1.4}>
          <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.002, 0.08, 6]} /><meshStandardMaterial color="#c42a20" /></mesh>
          <mesh position={[0, -0.05, 0.002]} castShadow><boxGeometry args={[0.24, 0.09, 0.003]} /><meshStandardMaterial map={card} roughness={0.85} /></mesh>
        </group>
      </group>
    </C3>;
  }}</Stage3>;
};

// ───────── 3 · LA EMPANADA: el relleno cae sobre la tapa de masa, la masa se dobla en media luna y el repulgue se marca pliegue a pliegue
export const Crimp3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const fill = spr(tt, 0.3, 8, 0.45), fold = ramp(tt, 1.4, 2.3), crimp = ramp(tt, 2.6, 4.8);
    const c = orbit(tt, [0.0, 0.62, 0.55], [0, 0.04, 0], 0.15, 0.01);
    const R = 0.2, N = 11;
    return <C3 bloom={0.08} exposure={0.88}><Cam p={c.p} l={c.l} fov={40} /><Kitchen />
      {/* tabla enharinada */}
      <mesh position={[0, 0.012, 0]} geometry={rbox(0.9, 0.024, 0.6, 0.012)} material={M.wood("#c49a6a")} castShadow receiveShadow />
      {Array.from({ length: 40 }, (_, i) => <mesh key={i} position={[(rnd(i, 1) - 0.5) * 0.8, 0.025, (rnd(i, 2) - 0.5) * 0.5]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.004 + rnd(i, 3) * 0.01, 8]} /><meshStandardMaterial color="#f4efe4" transparent opacity={0.8} /></mesh>)}
      {/* mitad de abajo de la tapa */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><circleGeometry args={[R, 48, Math.PI, Math.PI]} /><meshStandardMaterial color="#ecd6a8" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      {/* el relleno */}
      <mesh position={[0, 0.03 + 0.03 * cl(fill), 0.07]} scale={[1.6 * cl(fill), 0.6 * cl(fill), 1 * cl(fill)]} castShadow><sphereGeometry args={[0.06, 24, 16]} /><meshStandardMaterial color="#7a3a1a" roughness={0.6} /></mesh>
      {/* la mitad de arriba que se dobla sobre el relleno (bisagra en el diámetro) */}
      <group position={[0, 0.031, 0]} rotation={[Math.PI * 0.94 * fold, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><circleGeometry args={[R, 48, 0, Math.PI]} /><meshStandardMaterial color="#efdcb0" roughness={0.85} side={THREE.DoubleSide} /></mesh>
      </group>
      {/* el repulgue: pliegues que aparecen uno por uno por el borde */}
      {Array.from({ length: N }, (_, i) => { const a = Math.PI * (i + 0.5) / N, k = cl((crimp * N) - i); if (k <= 0) return null;
        return <mesh key={i} position={[Math.cos(a) * R * 0.96, 0.05, Math.sin(a) * R * 0.96]} rotation={[0, -a + Math.PI / 2, 0]} scale={[0.026 * k, 0.012 * k, 0.016 * k]} castShadow><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#d8b47a" roughness={0.8} /></mesh>; })}
    </C3>;
  }}</Stage3>;
};

// mano 3D simple: palma hacia arriba, dedos hacia -z, antebrazo con manga hacia +z (age 0 joven … 1 arrugada)
const Hand: React.FC<{ p: V; r?: V; s?: number; age?: number; sleeve?: string; curl?: number; left?: boolean }> = ({ p, r = [0, 0, 0], s = 1, age = 0, sleeve = "#4a6a8a", curl = 0.25, left }) => {
  const skin = new THREE.Color("#e2b48e").lerp(new THREE.Color("#c08a66"), age).getStyle();
  const mat = <meshPhysicalMaterial color={skin} roughness={0.55 + age * 0.25} clearcoat={0.15} sheen={0.4} sheenColor="#ffd8c0" />;
  const sx = left ? -1 : 1;
  return <group position={p} rotation={r} scale={s}>
    <mesh geometry={rbox(0.09, 0.03, 0.1, 0.014)} castShadow>{mat}</mesh>
    {[-0.031, -0.011, 0.01, 0.03].map((x, i) => <group key={i} position={[x * sx, 0.004, -0.048]} rotation={[curl + i * 0.05, 0, 0]}>
      <mesh position={[0, 0, -0.03 + (i === 0 || i === 3 ? 0.006 : 0)]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.0095 - (i === 3 ? 0.0015 : 0), 0.045 - (i === 3 ? 0.012 : 0), 6, 12]} />{mat}</mesh>
    </group>)}
    <group position={[0.05 * sx, 0.0, -0.005]} rotation={[0.3, 0.7 * sx, 0]}><mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.011, 0.04, 6, 12]} />{mat}</mesh></group>
    {age > 0.5 && [0, 1, 2].map((i) => <mesh key={'m' + i} position={[(rnd(i, 7) - 0.5) * 0.06, 0.016, (rnd(i, 8) - 0.5) * 0.06]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.004 + rnd(i, 9) * 0.003, 10]} /><meshStandardMaterial color="#9a6448" transparent opacity={0.6} /></mesh>)}
    <mesh position={[0, -0.003, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.034, 0.03, 0.5, 20]} />{mat}</mesh>
    <mesh position={[0, -0.003, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.4, 20]} /><meshStandardMaterial color={sleeve} roughness={0.85} /></mesh>
  </group>;
};

// ───────── 4 · DE MANO EN MANO: cuatro manos en fila, de la más vieja a la más joven; la ficha salta de palma en palma
export const Relay3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    const T0 = [0.4, 1.6, 2.8], X = [-0.6, -0.2, 0.2, 0.6];
    let seg = 0; for (let i = 0; i < 3; i++) if (tt > T0[i] + 0.9) seg = i + 1;
    const k = seg < 3 ? ramp(tt, T0[seg], T0[seg] + 0.9) : 1;
    const from = X[Math.min(seg, 3)], to = X[Math.min(seg + 1, 3)];
    const cx = seg < 3 ? lerp(from, to, k) : X[3], cy = 0.29 + Math.sin(Math.PI * (seg < 3 ? k : 0)) * 0.16;
    const c = orbit(tt, [0, 0.75, 0.95], [0, 0.22, 0.05], 0.12, 0.01);
    const sleeves = ["#5a4a6a", "#7a5a3a", "#3f6a5a", "#a8584a"];
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={46} /><Kitchen />
      {X.map((x, i) => { const has = Math.abs(cx - x) < 0.05 && (seg < 3 ? k < 0.1 || k > 0.9 : true); return <Hand key={i} p={[x, 0.22 + (has ? -0.01 : 0) + Math.sin(tt * 1.3 + i) * 0.005, 0.1]} r={[0.15, (i - 1.5) * -0.12, 0]} s={1.25} age={1 - i / 3} sleeve={sleeves[i]} curl={has ? 0.35 : 0.2} />; })}
      {/* la ficha de Carmen que pasa */}
      <group position={[cx, cy, 0.05]} rotation={[-Math.PI / 2 + 0.25, 0, Math.sin(Math.PI * (seg < 3 ? k : 0)) * 0.6]}>
        <Card lines={["Guiso", "de Carmen"]} w={0.16} h={0.1} />
      </group>
    </C3>;
  }}</Stage3>;
};

// ───────── 5 · CUATRO DE UNO: un billete de 4 dólares se rasga en cruz y los cuatro pedazos caen girando en cuatro platos de guiso
const billTex = (s: string) => mtex(512, 256, (g) => {
  g.fillStyle = "#cfe0c4"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#3e6a40"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 228);
  g.fillStyle = "#3e6a40"; g.beginPath(); g.ellipse(256, 128, 70, 80, 0, 0, 6.3); g.fill(); g.fillStyle = "#cfe0c4"; g.font = "900 96px Georgia, serif"; g.textAlign = "center"; g.fillText(s, 256, 160);
  g.fillStyle = "#3e6a40"; g.font = "900 56px Georgia, serif"; g.fillText(s, 70, 80); g.fillText(s, 442, 220);
});
export const BillSplit3: React.FC<P> = ({ t, h }) => {
  const tx = useMemo(() => { const b = billTex("4"); return [0, 1, 2, 3].map((i) => { const c = b.clone(); c.repeat.set(0.5, 0.5); c.offset.set(i % 2 ? 0.5 : 0, i < 2 ? 0.5 : 0); c.needsUpdate = true; return c; }); }, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const rip = ramp(tt, 1.2, 1.6), fall = [2.0, 2.2, 2.4, 2.6].map((a) => ramp(tt, a, a + 0.8));
    const c = orbit(tt, [0, 1.3, 1.5], [0, 0.32, 0.1], 0.12, 0.01);
    const plates: V[] = [[-0.72, 0, 0.2], [-0.24, 0, 0.32], [0.24, 0, 0.32], [0.72, 0, 0.2]];
    return <C3 bloom={0.08} exposure={0.88}><Cam p={c.p} l={c.l} fov={44} /><Kitchen />
      {plates.map((p, i) => <Plate key={i} p={p} s={0.7} col="#7a3a1a" />)}
      {/* los cuatro cuartos del billete: juntos, se separan y caen girando cada uno a su plato */}
      {[0, 1, 2, 3].map((i) => {
        const qx = i % 2 ? 1 : -1, qy = i < 2 ? 1 : -1, f = fall[i];
        const start: V = [qx * (0.24 + 0.08 * rip), 0.62 + qy * (0.12 + 0.06 * rip), 0.15];
        const p = lv3(start, [plates[i][0], 0.075, plates[i][2]], f);
        p[1] += Math.sin(Math.PI * f) * 0.1;
        return <group key={i} position={p} rotation={[0, f * Math.PI * 2 * (i % 2 ? 1 : -1), 0]}><group rotation={[-Math.PI / 2 * f, 0, 0]}>
          <mesh castShadow scale={lerp(2, 1.3, f)}><planeGeometry args={[0.24, 0.12]} /><meshStandardMaterial map={tx[i]} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        </group></group>;
      })}
    </C3>;
  }}</Stage3>;
};

// ───────── 6 · REPOSA TAPADO: la funda tejida terracota baja sobre la olla y el reloj de arena grande marca los diez minutos
const knitTex = () => mtex(512, 256, (g) => {
  g.fillStyle = "#b85a34"; g.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y += 16) for (let x = 0; x < 512; x += 16) { g.fillStyle = (x / 16 + y / 16) % 2 ? "rgba(255,220,180,.12)" : "rgba(60,20,10,.15)"; g.beginPath(); g.ellipse(x + 8, y + 8, 6, 8, 0.5, 0, 6.3); g.fill(); }
  g.fillStyle = "#e8d2a8"; for (let x = 0; x < 512; x += 32) { g.fillRect(x, 120, 16, 16); }
});
export const Cozy3: React.FC<P> = ({ t, h }) => {
  const kt = useMemo(knitTex, []);
  return <Stage3 t={t} h={h}>{(tt) => {
    const down = spr(tt, 0.5, 6, 0.55), sand = ramp(tt, 2.2, 6.0);
    const c = orbit(tt, [0.25, 0.95, 1.6], [0.2, 0.45, 0], 0.12, 0.01);
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={42} /><Kitchen />
      <Pot s={0.75} fill={0.7} col="#6a3018" />
      {/* la funda: un domo tejido que baja y tapa la olla */}
      <group position={[0, lerp(1.6, 0.22, cl(down)), 0]} rotation={[0, 0, Math.sin(Math.max(0, tt - 1.2) * 3) * 0.04 * Math.exp(-Math.max(0, tt - 1.2))]}>
        <mesh position={[0, 0.22, 0]} scale={[1, 1.15, 1]} castShadow><sphereGeometry args={[0.46, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial map={kt} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.46, 0.47, 0.22, 48, 1, true]} /><meshStandardMaterial map={kt} roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.76, 0]} castShadow><sphereGeometry args={[0.05, 16, 12]} /><meshStandardMaterial color="#e8d2a8" roughness={1} /></mesh>
      </group>
      {/* el reloj de arena grande al lado */}
      <group position={[0.85, 0.0, 0.1]} scale={1.6}>
        {[0.32, 0.0].map((y) => <mesh key={y} position={[0, y, 0]} material={M.wood("#5a3418")} castShadow><cylinderGeometry args={[0.1, 0.1, 0.02, 24]} /></mesh>)}
        {[0.24, 0.08].map((y, i) => <mesh key={y} position={[0, y, 0]} rotation={[i ? 0 : Math.PI, 0, 0]}><coneGeometry args={[0.085, 0.15, 24, 1, true]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.22} roughness={0.05} side={THREE.DoubleSide} /></mesh>)}
        <mesh position={[0, 0.2 + 0.03 * (1 - sand), 0]} rotation={[Math.PI, 0, 0]} scale={Math.max(0.05, 1 - sand)}><coneGeometry args={[0.07, 0.1, 24]} /><meshStandardMaterial color="#e0b46a" roughness={0.9} /></mesh>
        <mesh position={[0, 0.03 + 0.03 * sand, 0]} scale={0.1 + sand * 0.9}><coneGeometry args={[0.075, 0.1, 24]} /><meshStandardMaterial color="#e0b46a" roughness={0.9} /></mesh>
        {sand > 0 && sand < 1 && <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.003, 0.003, 0.1, 6]} /><meshStandardMaterial color="#e0b46a" /></mesh>}
        {[1, -1].map((d) => <mesh key={d} position={[d * 0.09, 0.16, 0]} material={M.wood("#5a3418")} castShadow><cylinderGeometry args={[0.008, 0.008, 0.32, 8]} /></mesh>)}
      </group>
      <Steam tt={tt} p={[0, 0.98, 0]} o={0.35} n={6} h={0.7} w={0.06} />
    </C3>;
  }}</Stage3>;
};

// ───────── 7 · LA CUCHARA: la cuchara gastada de Carmen, sobre su delantal floreado, se desliza por la mesa hasta la olla de Rosa y revuelve
const floralTex = () => mtex(512, 512, (g) => {
  g.fillStyle = "#e6d6b8"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 140; i++) { const x = rnd(i, 1) * 512, y = rnd(i, 2) * 512, c = ["#c46a5a", "#d89a5a", "#7a9a6a"][i % 3]; g.fillStyle = c; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.28; g.beginPath(); g.ellipse(x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, 4, a, 0, 6.3); g.fill(); } g.fillStyle = "#f2d27a"; g.beginPath(); g.arc(x, y, 4, 0, 6.3); g.fill(); }
});
export const Handover3: React.FC<P> = ({ t, h }) => {
  return <Stage3 t={t} h={h}>{(tt) => {
    // la mano arrugada de Carmen (izq.) le pasa la cuchara gastada a la de Rosa (der.), que la hunde en la olla y revuelve
    const pass = ramp(tt, 0.5, 1.7), go = ramp(tt, 1.9, 2.8), stir = Math.max(0, tt - 2.8), sk = cl(stir);
    const carmen: V = [-0.5 + 0.12 * ramp(tt, 0.1, 0.5) - 0.1 * go, 0.34, 0.28];
    const rosa: V = [lerp(0.52, 0.42, pass) - 0.1 * go + Math.cos(stir * 2.4) * 0.03 * sk, lerp(0.34, 0.5, go), lerp(0.28, -0.05, go) + Math.sin(stir * 2.4) * 0.03 * sk];
    const tipC: V = [carmen[0] + 0.1, carmen[1] + 0.02, carmen[2]], tipR: V = [rosa[0] - 0.1, rosa[1] + 0.02, rosa[2]];
    const sp: V = pass < 1 ? [lerp(tipC[0], tipR[0], pass), lerp(tipC[1], tipR[1], pass) + Math.sin(Math.PI * pass) * 0.08, lerp(tipC[2], tipR[2], pass)] : tipR;
    const tilt = go * 0.75 + Math.sin(stir * 2.4) * 0.05 * sk;
    const c = orbit(tt, [0, 1.0, 1.35], [0, 0.35, 0.0], 0.12, 0.01);
    return <C3 bloom={0.1}><Cam p={c.p} l={c.l} fov={46} /><Kitchen />
      <Pot p={[0.0, 0, -0.1]} s={0.7} fill={0.8} col="#7a3a1a" lidOff />
      <Steam tt={tt} p={[0.0, 0.4, -0.1]} o={0.35} n={12} h={1.0} w={0.25} />
      <Hand p={carmen} r={[0.15, -Math.PI / 2, 0]} s={1.0} age={1} sleeve="#5a4a6a" left curl={pass < 0.5 ? 0.5 : 0.2} />
      <Hand p={rosa} r={[0.15, Math.PI / 2, 0]} s={1.0} age={0.15} sleeve="#a8584a" curl={pass > 0.6 ? 0.5 : 0.2} />
      <group position={sp} rotation={[0, 0, tilt]}><group position={[-0.09, 0, 0]}><Spoon p={[0, 0, 0]} r={[0, Math.PI / 2, 0]} s={0.6} wear={0.8} c="#a8743e" /></group></group>
    </C3>;
  }}</Stage3>;
};
