// lhh29b · componentes únicos 17-24 (kit h3d): la carrera de las dos pavas, la hora que afloja el sarro, las cáscaras que caen como monedas,
// la manzana que se oxida al lado de la que no, la lonchera de Tyler, el pentagrama del bajo, la taza de limón y miel y la miel prohibida al bebé.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { DigitDrum, M, RBox, Scene3D, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { LemonHalf, lathe, SERIF } from "./lemonkit";

const PI = Math.PI;
const kettleG = () => lathe([[0, 0], [0.075, 0], [0.085, 0.03], [0.08, 0.1], [0.05, 0.13], [0.02, 0.135], [0.02, 0.14], [0, 0.14]]);
const Kettle: React.FC<{ p: number[]; crust?: number }> = ({ p, crust = 0 }) => <group position={p as [number, number, number]}>
  <mesh geometry={kettleG()} castShadow>{M.steel({ col: crust > 0.5 ? "#b8b2a6" : "#d9dde1" })}</mesh>
  <mesh position={[0.1, 0.08, 0]} rotation={[0, 0, -0.9]}><cylinderGeometry args={[0.008, 0.014, 0.07, 16]} />{M.steel({})}</mesh>
  <mesh position={[0, 0.15, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.045, 0.006, 10, 28, PI]} /><meshStandardMaterial color="#1b1b1b" roughness={0.5} /></mesh>
</group>;

// ---- 8:40 · EL DOBLE DE TIEMPO: dos pavas en dos hornallas; sobre cada una sube un termómetro; la limpia hierve primero, la del sarro tarda el doble ----
export const HKettleRace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="tile"
  cam={{ at: [0, 0.12, 0], az: [-0.1, 0.12], el: [0.2, 0.14], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="TWICE AS LONG TO BOIL" col={RED} />
    <Tag tt={tt} at={0.8} x={620} y={230} txt="CRUSTED" col={RED} size={42} />
    <Tag tt={tt} at={0.8} x={1300} y={230} txt="CLEAN" col={GRN} size={42} /></>}>{(tt) => {
  const fc = cl((tt - 0.5) / 2.6), fk = cl((tt - 0.5) / 5.2);
  return <>
    {[[-0.17, fk, 1], [0.17, fc, 0]].map(([x, f, cr], i) => <group key={i}>
      <mesh position={[x as number, 0.002, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.05, 0.08, 40]} />{M.glow({ col: "#ff6a2a", op: 0.35 + 0.2 * Math.sin(tt * 6 + i) })}</mesh>
      <Kettle p={[x as number, 0.005, 0]} crust={cr as number} />
      <group position={[(x as number) - 0.11, 0.1, 0.05]}>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.009, 0.009, 0.14, 16]} />{M.glass({ op: 0.35 })}</mesh>
        <mesh position={[0, -0.005 + 0.065 * (f as number), 0]}><cylinderGeometry args={[0.006, 0.006, 0.01 + 0.13 * (f as number), 12]} />{M.glow({ col: (f as number) >= 1 ? "#ff3b2a" : "#ff8a3a" })}</mesh>
        <mesh position={[0, -0.012, 0]}><sphereGeometry args={[0.013, 16, 12]} />{M.glow({ col: "#ff3b2a" })}</mesh></group>
      {(f as number) >= 1 && Array.from({ length: 10 }, (_, j) => { const d = ((tt * 0.8 + rn(j + i * 10, 2)) % 1); return <mesh key={j} position={[(x as number) + 0.13 + d * 0.06, 0.13 + d * 0.12, (rn(j, 3) - 0.5) * 0.03]}><sphereGeometry args={[0.008 + 0.014 * d, 10, 8]} />{M.glow({ col: "#ffffff", op: 0.3 * (1 - d) })}</mesh>; })}
    </group>)}
  </>;
}}</Scene3D>;

// ---- 9:05 · UNA HORA Y SE AFLOJA: corte de la pava con costras blancas en la pared; un aro de 60 minutos se completa y las costras se sueltan y bajan ----
export const HHourCrust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark" lamp={[0.2, 0.4, 0.4]}
  cam={{ at: [0.07, 0.08, 0], az: [0.15, -0.15], el: [0.24, 0.18], r: [0.52, 0.44], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="ONE LEMON, ONE HOUR" col={AMB} />
    </>}>{(tt, u) => {
  const hr = eio(u, 0.06, 0.8), fall = eio(u, 0.35, 0.96);
  return <>
    <mesh geometry={new THREE.LatheGeometry([[0, 0], [0.075, 0], [0.085, 0.03], [0.08, 0.1], [0.05, 0.13], [0, 0.13]].map(([x, y]) => new THREE.Vector2(x, y)), 48, PI * 0.5, PI)}>{M.steel({ side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.078, 0.074, 0.08, 40, 1, false, PI * 0.5, PI]} />{M.water({ op: 0.4, col: "#fff2b8" })}</mesh>
    {Array.from({ length: 28 }, (_, i) => { const a = PI * 0.5 + 0.2 + rn(i, 2) * (PI - 0.4), y0 = 0.02 + rn(i, 3) * 0.08, dly = rn(i, 4) * 0.8, f = cl(fall * 1.8 - dly);
      const r = 0.079 - 0.02 * f, y = lerp(y0, 0.008, f);
      return <mesh key={i} position={[Math.sin(a) * r, y, Math.cos(a) * r]} rotation={[rn(i, 5) * 2 + f * 3, a, f * 2.4]}><boxGeometry args={[0.024, 0.016, 0.004]} /><meshStandardMaterial color="#e9e2cf" roughness={0.95} emissive="#3a3428" emissiveIntensity={0.2} /></mesh>; })}
    <LemonHalf p={[0.02, 0.07 + 0.003 * Math.sin(tt * 3), 0.02]} rot={[0.4, 0, 0.3]} s={0.9} />
    {/* reloj de arena: una hora de arena que se vacía */}
    <group position={[0.2, 0, -0.02]}>
      {[-1, 1].map((k) => <RBox key={k} s={[0.08, 0.008, 0.08]} p={[0, k > 0 ? 0.184 : 0.004, 0]} r={0.004}>{M.wood({ base: [150, 100, 60] })}</RBox>)}
      {[0, 1, 2].map((k) => <mesh key={"c" + k} position={[Math.cos(k * 2.1) * 0.034, 0.094, Math.sin(k * 2.1) * 0.034]}><cylinderGeometry args={[0.003, 0.003, 0.18, 8]} />{M.wood({ base: [150, 100, 60] })}</mesh>)}
      <mesh position={[0, 0.137, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.026, 0.085, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.051, 0]}><coneGeometry args={[0.026, 0.085, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.137 + 0.02 * (1 - hr), 0]} rotation={[PI, 0, 0]} scale={Math.max(0.001, 0.95 * Math.cbrt(1 - hr))}><coneGeometry args={[0.025, 0.06, 32]} /><meshStandardMaterial color="#d8b46a" roughness={0.9} /></mesh>
      <mesh position={[0, 0.012 + 0.012 * hr, 0]} scale={Math.max(0.001, 0.95 * Math.cbrt(hr))}><coneGeometry args={[0.025, 0.03, 32]} /><meshStandardMaterial color="#d8b46a" roughness={0.9} /></mesh>
      {hr > 0 && hr < 1 && <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.0025, 0.0025, 0.08, 8]} /><meshStandardMaterial color="#e2b85a" emissive="#5a3a00" emissiveIntensity={0.4} /></mesh>}
    </group>
  </>;
}}</Scene3D>;

// ---- 10:34 · PLATA A LA BASURA: un tacho de pedal con la tapa abierta; caen cáscaras de limón y cada una se vuelve una moneda antes de tocar el fondo ----
export const HPeelTrash: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" lamp={[0.1, 0.5, 0.4]}
  cam={{ at: [0.04, 0.12, 0], az: [0.35, 0.15], el: [0.18, 0.12], r: [1.0, 0.88], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="MONEY IN THE TRASH" col={RED} />
    </>}>{(tt, u) => {
  // tres cáscaras caen al tacho; después saltan de nuevo afuera y se vuelven jabón, vela y frasco de aroma
  const lid = Math.max(eio(u, 0.2, 0.3), ...[0, 1, 2].map((i) => Math.sin(PI * cl((u - 0.02 - i * 0.04) / 0.16))), ...[0, 1, 2].map((i) => Math.sin(PI * cl((u - 0.2 - i * 0.2) / 0.24))));
  const peel = <mesh><sphereGeometry args={[0.045, 16, 8, 0, 2.2, 0, 1.3]} /><meshPhysicalMaterial color="#f3d23a" roughness={0.45} side={THREE.DoubleSide} /></mesh>;
  return <>
    <group position={[-0.2, 0, 0]} scale={0.75}>
      <mesh geometry={lathe([[0, 0], [0.12, 0], [0.13, 0.3], [0.125, 0.3], [0.115, 0.006], [0, 0.006]])} castShadow><meshPhysicalMaterial color="#2f7d5b" roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>
      {[0.06, 0.24].map((y, i) => <mesh key={"rb" + i} position={[0, y, 0]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.124 + y * 0.03, 0.006, 8, 48]} /><meshPhysicalMaterial color="#25664a" roughness={0.3} clearcoat={0.8} /></mesh>)}
      <mesh position={[0, 0.3, -0.135]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.01, 0.01, 0.12, 12]} />{M.steel({})}</mesh>
      <RBox s={[0.08, 0.02, 0.06]} p={[0, 0.012, 0.15 - 0.006 * lid]} rot={[-0.15 * lid, 0, 0]} r={0.006}>{M.steel({})}</RBox>
      <mesh position={[0, 0.001, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.17, 40]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh>
      <group position={[0, 0.3, -0.13]} rotation={[-lid * 1.7, 0, 0]}><mesh position={[0, 0.005, 0.13]}><cylinderGeometry args={[0.132, 0.132, 0.012, 40]} /><meshPhysicalMaterial color="#2f7d5b" roughness={0.3} clearcoat={0.8} /></mesh></group>
    </group>
    {[0, 1, 2].map((i) => { const fin = cl((u - 0.04 - i * 0.04) / 0.1), out = eio(u, 0.22 + i * 0.2, 0.32 + i * 0.2), mo = eio(u, 0.32 + i * 0.2, 0.4 + i * 0.2), fl = Math.sin(PI * cl((u - 0.31 - i * 0.2) / 0.1));
      const tx = 0.04 + i * 0.13, x = lerp(-0.2, tx, out), y = fin < 1 ? lerp(0.5, 0.12, fin * fin) : 0.12 + Math.sin(out * PI) * 0.22 - 0.1 * out;
      if (fin <= 0) return null;
      return <group key={i} position={[x, Math.max(0.02, y), 0.02]}>
        {fl > 0 && <><mesh scale={0.02 + 0.05 * fl}><sphereGeometry args={[1, 16, 12]} />{M.glow({ col: "#fff1b0", op: 0.55 * fl })}</mesh>
          <pointLight intensity={1.2 * fl} distance={0.35} color="#ffd36a" /></>}
        {mo < 1 && <group rotation={[tt * 3 + i, i, tt * 2]} scale={Math.max(0.001, 1 - mo)}>{peel}</group>}
        {mo > 0 && <group scale={Math.max(0.001, mo)}>
          {i === 0 && <RBox s={[0.08, 0.035, 0.05]} p={[0, 0.0, 0]} r={0.008}><meshPhysicalMaterial color="#f4e39a" roughness={0.35} clearcoat={0.6} /></RBox>}
          {i === 1 && <><mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.022, 0.024, 0.09, 24]} /><meshStandardMaterial color="#f6eccb" roughness={0.6} /></mesh>
            <mesh position={[0, 0.088, 0]} scale={[1, 1.6 + 0.2 * Math.sin(tt * 2 * PI * 1.5), 1]}><sphereGeometry args={[0.007, 12, 8]} />{M.glow({ col: "#ffb43a", op: 0.85 })}</mesh></>}
          {i === 2 && <><mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.03, 0.03, 0.08, 28, 1, true]} />{M.glass({ op: 0.35 })}</mesh>
            <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.028, 0.028, 0.055, 28]} /><meshPhysicalMaterial color="#f1d24a" roughness={0.1} transmission={0.4} transparent opacity={0.85} /></mesh>
            <mesh position={[0, 0.074, 0]}><cylinderGeometry args={[0.032, 0.032, 0.012, 28]} />{M.brass({})}</mesh></>}
        </group>}
      </group>; })}
    <pointLight position={[0.15, 0.2, 0.1]} color="#ffb43a" intensity={0.25 * eio(u, 0.6, 0.7)} distance={0.4} />
  </>;
}}</Scene3D>;

// ---- 11:04 · LA MANZANA SE OXIDA: dos rodajas de manzana; la de la izquierda se pone marrón con el reloj; la de la derecha, pasada por agua con limón, sigue blanca ----
const appleSlice = () => { const s = new THREE.Shape(); s.absarc(0, 0, 0.07, 0, PI, false); s.lineTo(-0.07, 0); return new THREE.ExtrudeGeometry(s, { depth: 0.014, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003, bevelSegments: 2, curveSegments: 32 }); };
export const HBrowning: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark"
  cam={{ at: [0.05, 0.04, 0.03], az: [0.1, -0.12], el: [0.44, 0.36], r: [0.68, 0.6], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="BROWN BY THE 2ND SERVICE" col={RED} />
    </>}>{(tt, u) => {
  const pulp = tex.text("pulp", 256, 256, (g) => { g.fillStyle = "#ffffff"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(120,90,40,${0.12 * rn(i, 2)})`; g.beginPath(); g.ellipse(rn(i, 3) * 256, rn(i, 4) * 256, 2 + 5 * rn(i, 5), 1 + 2 * rn(i, 6), rn(i, 7) * 3, 0, 6.3); g.fill(); } });
  const dial = tex.text("dial12", 256, 256, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#222"; g.font = "bold 30px " + SERIF; for (let k = 1; k <= 12; k++) { const a = k / 12 * 6.283; g.fillText(String(k), 128 + Math.sin(a) * 96 - (k > 9 ? 16 : 8), 138 - Math.cos(a) * 96); } });
  const br = eio(u, 0.1, 0.92), flesh = new THREE.Color("#f6eccb").lerp(new THREE.Color("#a8723a"), br).getStyle();
  return <>
    {[[-0.12, flesh], [0.12, "#f6eccb"]].map(([x, c], i) => <group key={i} position={[x as number, 0.012, 0]} rotation={[-PI / 2, 0, 0]}>
      <mesh geometry={appleSlice()} castShadow><meshPhysicalMaterial color={c as string} map={pulp} bumpMap={pulp} bumpScale={2} roughness={0.5} clearcoat={0.3} /></mesh>
      <mesh position={[0, 0, 0.0005]}><torusGeometry args={[0.072, 0.004, 8, 40, PI]} /><meshPhysicalMaterial color="#b3241c" roughness={0.4} clearcoat={0.6} /></mesh>
      <mesh position={[0, 0.02, 0.0175]} rotation={[0, 0, 0]}><circleGeometry args={[0.006, 12]} /><meshStandardMaterial color="#4a2b14" /></mesh></group>)}
    <group position={[0, 0.12, -0.16]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.085, 0.085, 0.016, 48]} />{M.brass({})}</mesh>
      <mesh position={[0, 0, 0.0085]}><circleGeometry args={[0.077, 48]} /><meshStandardMaterial map={dial} roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.0095]}><circleGeometry args={[0.078, 48]} />{M.glass({ op: 0.15 })}</mesh>
      <group position={[0, 0, 0.01]} rotation={[0, 0, -u * PI * 2 * 3]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[0.004, 0.06, 0.002]} />{M.matte({ col: "#222" })}</mesh></group>
      <group position={[0, 0, 0.011]} rotation={[0, 0, -u * PI * 0.5]}><mesh position={[0, 0.02, 0]}><boxGeometry args={[0.006, 0.04, 0.002]} />{M.matte({ col: "#222" })}</mesh></group></group>
    <LemonHalf p={[0.21, 0.02, 0.08]} rot={[0.5, 0, 0]} s={0.9} />
  </>;
}}</Scene3D>;

// ---- 11:40 · LA LONCHERA DE TYLER: una lonchera de chapa roja se abre; adentro, las rodajas de manzana en abanico, blancas; etiqueta «TYLER, 12» ----
export const HLunchbox: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [-0.08, 0.05, 0.02], az: [0.3, 0.1], el: [0.55, 0.46], r: [0.72, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="TYLER'S LUNCHBOX" col={GRN} />
    </>}>{(tt, u) => {
  const op = eio(u, 0.06, 0.25), W = 0.28, D = 0.18, Hh = 0.08;
  const name = tex.text("tyler12", 256, 96, (g) => { g.fillStyle = "#fffbe8"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#1d2a55"; g.font = "bold 48px " + SERIF; g.fillText("TYLER, 12", 18, 64); });
  return <>
    <RBox s={[W, Hh, D]} p={[0, Hh / 2, 0]} r={0.012}><meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.35} /></RBox>
    <mesh position={[0, Hh + 0.0005, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[W - 0.02, D - 0.02]} /><meshStandardMaterial color="#b9ae96" roughness={0.6} /></mesh>
    <group position={[0, Hh, -D / 2]} rotation={[-op * 1.9, 0, 0]}><RBox s={[W, 0.02, D]} p={[0, 0.01, D / 2]} r={0.012}><meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.35} /></RBox>
      <mesh position={[0, 0.0205, D / 2]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.12, 0.045]} /><meshStandardMaterial map={name} roughness={0.8} /></mesh></group>
    {Array.from({ length: 7 }, (_, i) => { const k = u < 0.24 + i * 0.03 ? 0 : 1 - Math.exp(-(u - 0.24 - i * 0.03) * 30) * Math.cos((u - 0.24 - i * 0.03) * 50); return k > 0 && <group key={i} position={[-0.08 + i * 0.026, Hh + 0.004 + (1 - cl(k)) * 0.1, 0.01]} rotation={[-PI / 2 + 0.5, 0, -0.5 + i * 0.16]}>
      <mesh><cylinderGeometry args={[0.035, 0.035, 0.008, 24, 1, false, 0, PI]} /><meshPhysicalMaterial color="#f7efcf" roughness={0.45} clearcoat={0.4} /></mesh></group>; })}
    {/* las de al lado, sin limón, en la servilleta: se van poniendo marrones */}
    <mesh position={[-0.28, 0.001, 0.06]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.16, 0.16]} /><meshStandardMaterial color="#f4f1ea" roughness={1} bumpMap={tex.paper(3, 3)} bumpScale={3} /></mesh>
    {Array.from({ length: 4 }, (_, i) => <group key={"b" + i} position={[-0.31 + i * 0.022, 0.006, 0.06]} rotation={[-PI / 2 + 0.4, 0, -0.4 + i * 0.2]}>
      <mesh><cylinderGeometry args={[0.035, 0.035, 0.008, 24, 1, false, 0, PI]} /><meshPhysicalMaterial color={"#" + new THREE.Color("#f7efcf").lerp(new THREE.Color("#a8682a"), eio(u, 0.3, 0.95)).getHexString()} roughness={0.6} /></mesh></group>)}
    <pointLight position={[-0.55, 0.25, lerp(0.3, -0.1, u)]} color="#fff2d8" intensity={1.6} distance={1.4} />
    <group position={[-0.5, 0.25, -0.2]} rotation={[0, 0.9, 0]}>{[[0, 0.16, 0.34, 0.012], [0, -0.16, 0.34, 0.012], [-0.17, 0, 0.012, 0.33], [0.17, 0, 0.012, 0.33], [0, 0, 0.34, 0.008], [0, 0, 0.008, 0.33]].map(([x, y, w, hh], i) => <mesh key={"wf" + i} position={[x, y, 0]}><boxGeometry args={[w, hh, 0.02]} />{M.wood({ base: [235, 230, 220] })}</mesh>)}
      <mesh position={[0, 0, -0.005]}><planeGeometry args={[0.33, 0.32]} />{M.glow({ col: "#fff2d8", op: 0.55 })}</mesh></group>
    <mesh position={[-0.05, 0.0015, 0.02]} rotation={[-PI / 2, 0, -0.6]}><planeGeometry args={[0.14, 0.7]} />{M.glow({ col: "#fff2d8", op: 0.1 })}</mesh>
    <mesh position={[lerp(0.3, -0.25, u), 0.0015, 0.12]} rotation={[-PI / 2, 0, 0.3]}><planeGeometry args={[0.16, 0.5]} />{M.glow({ col: "#fff0c8", op: 0.12 })}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const dp = cl((u - 0.55 - i * 0.06) / 0.07); return dp > 0 && dp < 1 && <mesh key={"g" + i} position={[-0.07 + i * 0.03, lerp(0.3, Hh + 0.01, dp * dp), 0.01]} scale={[1, 1.5, 1]}><sphereGeometry args={[0.006, 12, 8]} />{M.water({ op: 0.9, col: "#fff3a0" })}</mesh>; })}
    {Array.from({ length: 6 }, (_, i) => { const rg = cl((u - 0.62 - i * 0.06) / 0.1); return rg > 0 && rg < 1 && <mesh key={"r" + i} position={[-0.07 + i * 0.03, Hh + 0.012, 0.01]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.004 + 0.02 * rg, 0.007 + 0.02 * rg, 24]} />{M.glow({ col: "#fff6c8", op: 0.8 * (1 - rg) })}</mesh>; })}
    <group position={[0.06, Hh + 0.07 + 0.01 * Math.sin(tt * 4), 0.01]} rotation={[0.4, 0, 0.3]} visible={u > 0.5 && u < 0.98}><LemonHalf p={[0, 0, 0]} rot={[PI, 0, 0]} s={0.7} /></group>
  </>;
}}</Scene3D>;

// ---- 11:54 · 47 AÑOS DE BAJO: un pentagrama de luz con la clave de fa; las notas graves bajan una por una y el contador de años llega a 47 ----
export const HBassClef: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="wood" lamp={[0, 0.4, 0.5]}
  cam={{ at: [0, 0.09, 0], az: [-0.18, 0.15], el: [0.14, 0.1], r: [0.9, 0.78], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="HAROLD SANG BASS" col={AMB} />
    </>}>{(tt, u) => {
  const ln = eio(u, 0.02, 0.15), cf = phys(tt, 0.7, 6, 0.5);
  const yrs = 47 * eio(u, 0.15, 0.88);
  const vinyl = tex.text("vinyl", 512, 512, (g) => { g.fillStyle = "#121212"; g.fillRect(0, 0, 512, 512); for (let r = 80; r < 250; r += 4) { g.strokeStyle = `rgba(255,255,255,${0.04 + 0.05 * rn(r, 2)})`; g.lineWidth = 1.5; g.beginPath(); g.arc(256, 256, r, 0, 6.3); g.stroke(); }
    g.fillStyle = "#b8893a"; g.beginPath(); g.arc(256, 256, 72, 0, 6.3); g.fill(); g.fillStyle = "#3a2608"; g.font = "bold 22px " + SERIF; g.fillText("BASS · 1977", 190, 250); g.fillStyle = "#121212"; g.beginPath(); g.arc(256, 256, 8, 0, 6.3); g.fill(); });
  return <group position={[0, 0.15, 0]}>
    <group position={[0.02, -0.03, -0.1]}>
      <RBox s={[0.52, 0.48, 0.03]} p={[0, 0, -0.03]} r={0.012}>{M.wood({ base: [70, 44, 26] })}</RBox>
      <mesh rotation={[0, 0, -u * 30]}><circleGeometry args={[0.2, 64]} /><meshPhysicalMaterial map={vinyl} roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 0, 0.002]} rotation={[0, 0, -u * 30]}><ringGeometry args={[0.08, 0.2, 48, 1, 0, 0.35]} />{M.glow({ col: "#ffffff", op: 0.12 })}</mesh>
      {Array.from({ length: 10 }, (_, i) => { const k = cl(eio(u, 0.2, 0.9) * 10 - i), a = i * 0.9 + u * 6; return k > 0 && <group key={"tw" + i} position={[Math.cos(a) * 0.05, -0.12 + i * 0.03 * k + 0.12, 0.05 + Math.sin(a) * 0.02]} scale={0.8 * k}>
        <mesh scale={[1.3, 1, 0.6]} rotation={[0, 0, 0.35]}><sphereGeometry args={[0.011, 14, 10]} />{M.brass({})}</mesh>
        <mesh position={[0.012, 0.025, 0]}><boxGeometry args={[0.002, 0.05, 0.002]} />{M.brass({})}</mesh></group>; })}
      <group position={[0.22, 0.17, 0.02]} rotation={[0, 0, 0.5 - 0.35 * eio(u, 0.05, 0.2)]}><mesh position={[0, -0.09, 0]}><cylinderGeometry args={[0.005, 0.005, 0.18, 8]} />{M.chrome()}</mesh></group>
    </group>
    <group position={[0.2, -0.17, 0.04]}>
      <RBox s={[0.13, 0.08, 0.05]} p={[0, 0, -0.012]} r={0.008}>{M.wood({ base: [110, 70, 40] })}</RBox>
      <DigitDrum v={yrs / 10} p={[-0.022, 0, 0.012]} r={0.032} w={0.04} />
      <DigitDrum v={yrs % 10} p={[0.022, 0, 0.012]} r={0.032} w={0.04} />
    </group>
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[-0.3 + 0.3 * ln, -0.06 + i * 0.03, 0]}><boxGeometry args={[0.6 * ln, 0.002, 0.002]} />{M.glow({ col: "#ffe2a8", op: 0.85 })}</mesh>)}
    {cf > 0 && <group position={[-0.24, 0.025, 0.01]} scale={cl(cf)}>
      <mesh rotation={[0, 0, PI * 0.15]}><torusGeometry args={[0.03, 0.006, 10, 30, PI * 1.2]} />{M.brass({})}</mesh>
      <mesh position={[-0.026, -0.006, 0]}><sphereGeometry args={[0.009, 14, 10]} />{M.brass({})}</mesh>
      {[0.012, -0.012].map((y, i) => <mesh key={i} position={[0.05, y + 0.006, 0]}><sphereGeometry args={[0.005, 10, 8]} />{M.brass({})}</mesh>)}</group>}
    {Array.from({ length: 8 }, (_, i) => { const uk = u - 0.16 - i * 0.085, k = uk <= 0 ? 0 : 1 - Math.exp(-uk * 25) * Math.cos(uk * 45); if (k <= 0) return null; const y = -0.06 + ((i * 3) % 5) * 0.015, pu = Math.sin(PI * cl(uk / 0.08));
      return <group key={i} position={[-0.14 + i * 0.055, y + (1 - cl(k)) * 0.15, 0.01]}>
        <mesh scale={[1.3, 1, 0.6]} rotation={[0, 0, 0.35]}><sphereGeometry args={[0.011, 16, 10]} /><meshPhysicalMaterial color="#1b1b1b" roughness={0.25} clearcoat={1} /></mesh>
        {pu > 0 && <mesh position={[0, 0, -0.002]}><ringGeometry args={[0.012 + 0.02 * pu, 0.016 + 0.02 * pu, 32]} />{M.glow({ col: "#ffe2a8", op: 0.8 * pu })}</mesh>}
        <mesh position={[0.013, 0.04, 0]}><boxGeometry args={[0.0025, 0.08, 0.002]} /><meshStandardMaterial color="#1b1b1b" /></mesh></group>; })}
  </group>;
}}</Scene3D>;

// ---- 12:09 · LIMÓN, MIEL Y TAZA: medio limón se exprime sobre una taza grande; después la cuchara de madera de la miel deja caer un hilo dorado; vapor ----
export const HHoneyMug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[-0.3, 0.4, 0.3]}
  cam={{ at: [0.01, 0.18, 0], az: [0.3, 0.12], el: [0.22, 0.16], r: [0.74, 0.62], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="FOR A SCRATCHY THROAT" col={AMB} />
    
    </>}>{(tt, u) => {
  const sq = eio(u, 0.06, 0.3), dip = eio(u, 0.36, 0.5), hon = cl((u - 0.5) / 0.4);
  return <>
    <mesh geometry={lathe([[0, 0], [0.06, 0], [0.065, 0.13], [0.06, 0.13], [0.055, 0.008], [0, 0.008]])} castShadow>{M.porcelain({ col: "#f3efe6", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0.075, 0.07, 0]} rotation={[0, 0, PI / 2]}><torusGeometry args={[0.03, 0.008, 12, 30, PI]} />{M.porcelain({ col: "#f3efe6" })}</mesh>
    <mesh position={[0, 0.115, 0]}><cylinderGeometry args={[0.058, 0.058, 0.003, 40]} />{M.water({ op: 0.75, col: "#e7c46a" })}</mesh>
    {u < 0.34 ? <LemonHalf p={[0, 0.2, 0]} rot={[PI, 0, 0]} s={1.3} squeeze={sq} /> : null}
    {sq > 0 && sq < 1 && Array.from({ length: 6 }, (_, i) => { const d = ((tt * 2 + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.04, 0.18 - d * 0.07, (rn(i, 4) - 0.5) * 0.04]}><sphereGeometry args={[0.004, 8, 6]} />{M.water({ col: "#f8e88a", op: 0.9 })}</mesh>; })}
    {dip > 0 && <group position={[0.02, 0.32 - 0.1 * dip, 0]} rotation={[0, 0, 0.3]}>
      <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.005, 0.005, 0.14, 10]} />{M.wood({ base: [190, 140, 80] })}</mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0, -0.005 - i * 0.008, 0]}><cylinderGeometry args={[0.016 - i * 0.001, 0.016 - i * 0.001, 0.005, 20]} /><meshPhysicalMaterial color="#d79b2a" roughness={0.15} clearcoat={1} transparent opacity={0.9} /></mesh>)}</group>}
    {hon > 0 && <mesh geometry={tubeG("honey" + Math.round(hon * 10), [[0.02, 0.19, 0], [0.012, 0.16, 0], [0.004, 0.14 - 0.02 * hon, 0], [0, 0.117, 0]], 0.0045, 30, 8)}><meshPhysicalMaterial color="#f0a828" roughness={0.05} clearcoat={1} emissive="#7a4a08" emissiveIntensity={0.5} transparent opacity={0.92} /></mesh>}
    {hon > 0 && <pointLight position={[0.06, 0.2, 0.08]} intensity={0.9 * Math.sin(PI * cl(hon * 1.2))} distance={0.4} color="#ffc060" />}
    {hon > 0 && Array.from({ length: 3 }, (_, i) => { const rg = ((hon * 3 + i / 3) % 1); return <mesh key={"hr" + i} position={[0, 0.118, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.004 + 0.04 * rg, 0.007 + 0.04 * rg, 32]} />{M.glow({ col: "#ffd27a", op: 0.6 * (1 - rg) })}</mesh>; })}
    {Array.from({ length: 10 }, (_, i) => { const d = ((tt * 0.45 + rn(i, 2)) % 1); return <mesh key={i} position={[(rn(i, 3) - 0.5) * 0.06 + 0.02 * Math.sin(d * 6 + i), 0.13 + d * 0.16, (rn(i, 4) - 0.5) * 0.05]}><sphereGeometry args={[0.008 + 0.012 * d, 10, 8]} />{M.glow({ col: "#ffffff", op: 0.18 * (1 - d) })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 12:40 · NUNCA A UN BEBÉ: el frasco de miel junto a un sonajero de bebé; baja un aro rojo tachado sobre los dos ----
export const HNoBaby: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="dark" lamp={[0.15, 0.5, 0.35]}
  cam={{ at: [0.02, 0.1, 0], az: [-0.2, 0.05], el: [0.22, 0.18], r: [0.8, 0.7], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER FOR A BABY" col={RED} />
    </>}>{(tt, u) => {
  // la cuna con el bebé dormido; el frasco de miel se acerca, baja una mano, lo agarra y se lo lleva fuera de cuadro
  const near = eio(u, 0.05, 0.3), away = eio(u, 0.55, 0.9), jx = lerp(lerp(-0.42, -0.12, near), -0.7, away), mob = tt * 0.6, hd = eio(u, 0.36, 0.52);
  return <>
    {/* cuna */}
    <group position={[0.14, 0, 0]}>
      <RBox s={[0.3, 0.02, 0.18]} p={[0, 0.06, 0]} r={0.006}><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></RBox>
      {[-1, 1].map((k) => <RBox key={"r" + k} s={[0.32, 0.012, 0.012]} p={[0, 0.2, k * 0.095]} r={0.004}>{M.wood({ base: [214, 180, 128] })}</RBox>)}
      {Array.from({ length: 13 }, (_, i) => <mesh key={i} position={[-0.15 + i * 0.025, 0.12, 0.095]}><cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />{M.wood({ base: [214, 180, 128] })}</mesh>)}
      {[-1, 1].map((k) => <RBox key={"p" + k} s={[0.016, 0.24, 0.2]} p={[k * 0.16, 0.12, 0]} r={0.005}>{M.wood({ base: [200, 166, 116] })}</RBox>)}
      {/* osito dormido que respira */}
      <group position={[0, 0.09, 0]} scale={[1, 1 + 0.04 * Math.sin(tt * 2.4), 1]}>
        <mesh scale={[1.3, 0.8, 1]}><sphereGeometry args={[0.04, 24, 16]} /><meshStandardMaterial color="#c99a6a" roughness={1} /></mesh>
        <mesh position={[0.055, 0.01, 0]}><sphereGeometry args={[0.03, 24, 16]} /><meshStandardMaterial color="#c99a6a" roughness={1} /></mesh>
        {[-1, 1].map((k) => <mesh key={k} position={[0.06, 0.035, k * 0.022]}><sphereGeometry args={[0.011, 12, 8]} /><meshStandardMaterial color="#b88a5a" roughness={1} /></mesh>)}
        <RBox s={[0.1, 0.045, 0.085]} p={[-0.012, 0.004, 0]} r={0.018}><meshStandardMaterial color="#f4b8c8" roughness={0.9} bumpMap={tex.paper(4, 4)} bumpScale={2} /></RBox>
        {[-1, 1].map((k) => <mesh key={"e" + k} position={[0.05 + k * 0.009, 0.016, 0.028]}><boxGeometry args={[0.008, 0.0015, 0.002]} /><meshStandardMaterial color="#3a2414" /></mesh>)}
        <mesh position={[0.055, 0.004, 0.03]}><sphereGeometry args={[0.004, 10, 8]} /><meshStandardMaterial color="#5a3420" /></mesh>
      </group>
      {/* móvil que gira */}
      <group position={[0, 0.36, 0]} rotation={[0, mob, 0]}>
        <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.002, 0.002, 0.06, 6]} /><meshStandardMaterial color="#d8d2c4" /></mesh>
        {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * PI / 2, 0]}><mesh position={[0.06, -0.03, 0]}><sphereGeometry args={[0.014, 12, 8]} /><meshPhysicalMaterial color={["#f7b6c8", "#8fd0ef", "#ffe27a", "#b9e3a8"][i]} roughness={0.3} clearcoat={0.6} /></mesh></group>)}
      </group>
    </group>
    {/* el frasco de miel */}
    <group position={[jx, 0, 0.04]} rotation={[0, 0, 0.12 * Math.sin(cl((tt - 1.8) * 3) * PI)]}>
      <mesh geometry={lathe([[0, 0], [0.05, 0], [0.055, 0.02], [0.055, 0.1], [0.04, 0.115], [0.04, 0.125], [0, 0.125]])} castShadow>{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.055, 0]}><cylinderGeometry args={[0.051, 0.051, 0.1, 40]} /><meshPhysicalMaterial color="#d48f1c" roughness={0.1} transparent opacity={0.85} clearcoat={1} transmission={0.3} /></mesh>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.045, 0.045, 0.016, 40]} /><meshStandardMaterial color="#c9a46a" roughness={0.8} /></mesh>
      {hd > 0 && <group position={[0, 0.16 + 0.35 * (1 - hd), 0]}>
        <RBox s={[0.1, 0.03, 0.09]} p={[0, 0.03, 0]} r={0.014}><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></RBox>
        {[-0.03, -0.01, 0.01, 0.03].map((x, i) => <mesh key={i} position={[x, -0.005, 0.045]} rotation={[0.25, 0, 0]}><capsuleGeometry args={[0.008, 0.04, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>)}
        <mesh position={[0.055, 0.0, -0.01]} rotation={[0, 0, 0.6]}><capsuleGeometry args={[0.009, 0.035, 6, 12]} /><meshPhysicalMaterial color="#d9a888" roughness={0.6} sheen={0.5} /></mesh>
        <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.035, 0.04, 0.12, 20]} /><meshStandardMaterial color="#5a6f8a" roughness={0.9} /></mesh></group>}</group>
  </>;
}}</Scene3D>;
