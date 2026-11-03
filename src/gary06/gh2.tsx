// gary06 · componentes únicos 2/4 (min 5-11).
import React from "react";
import { H, cl, eio, phys } from "./hkit";
import { M, RBox, Scene3D, lerp, tubeG } from "./h3d";
import { PI, Txt3, Mark, Fridge, PBox } from "./gk";
import { Flame } from "./fk";
import { Gen, Puffs } from "./gh1";

const z1 = (k: number) => Math.max(0.001, k);

// 5:02 · EL DIAL DEL CO: el frasco de vidrio «vacío» (sin olor, sin color); al lado el dial grande: la aguja trepa por el arco verde→rojo
// y a su paso se encienden HEADACHE, DIZZY, SICK, CONFUSED. «FEELS LIKE THE FLU».
export const HPpmDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e1013"
  cam={{ at: [0.12, 0.38, 0], az: [-0.2, 0.1], el: [0.1, 0.06], r: [1.55, 1.38], fov: 34 }}>{(tt) => {
  const k = eio(tt, 1.6, 4.8), ang = lerp(PI * 0.92, PI * 0.08, k), W = ["HEADACHE", "DIZZY", "SICK", "CONFUSED"];
  return <>
    <group position={[-0.45, 0, 0.05]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.12, 0.12, 0.38, 32, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
      <mesh position={[0, 0.41, 0]}><cylinderGeometry args={[0.125, 0.125, 0.04, 32]} />{M.steel({ col: "#9aa0a6" })}</mesh>
      <Txt3 txt="CO" w={0.16} h={0.08} col="#f7f4ee" p={[0, 0.2, 0.125]} />
      <Txt3 txt="NO SMELL" w={0.32} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.54, 0]} op={cl((tt - 0.4) / 0.3)} />
      <Txt3 txt="NO COLOR" w={0.32} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.63, 0]} op={cl((tt - 0.9) / 0.3)} />
    </group>
    <group position={[0.35, 0.3, 0]}>
      <RBox s={[0.62, 0.42, 0.05]} p={[0, 0.06, -0.03]} r={0.03}>{M.plastic({ col: "#e9e7e1" })}</RBox>
      {Array.from({ length: 24 }, (_, i) => { const a = PI * 0.92 - i * PI * 0.84 / 23, c = i < 8 ? "#4fbf6a" : i < 16 ? "#f2c21b" : "#e2352a";
        return <mesh key={i} position={[0.22 * Math.cos(a), 0.22 * Math.sin(a) - 0.05, 0.0]} rotation={[0, 0, a - PI / 2]}><boxGeometry args={[0.03, 0.05, 0.006]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={a >= ang ? 0.9 : 0.05} /></mesh>; })}
      <group position={[0, -0.05, 0.01]} rotation={[0, 0, ang - PI / 2]}><mesh position={[0, 0.1, 0]}><boxGeometry args={[0.008, 0.2, 0.006]} />{M.matte({ col: "#1b1d21" })}</mesh></group>
      <mesh position={[0, -0.05, 0.012]}><cylinderGeometry args={[0.02, 0.02, 0.01, 18]} />{M.chrome()}</mesh>
      {W.map((w, i) => { const a = PI * (0.75 - i * 0.17); return <Txt3 key={w} txt={w} w={0.22} h={0.05} col={k > (i + 0.6) / 4.6 ? "#f7f4ee" : "#555"} bg={k > (i + 0.6) / 4.6 ? "#b3221b" : "#2a2c30"} p={[0.38 * Math.cos(a), 0.38 * Math.sin(a) - 0.05, 0.02]} />; })}
    </group>
    <Txt3 txt="FEELS LIKE THE FLU" w={0.7} h={0.09} col="#ffd25a" glow p={[0.3, 0.1, 0.1]} op={cl((tt - 5.0) / 0.3)} />
  </>;
}}</Scene3D>;

// 5:18 · EL CAÑO QUE APUNTA: patio nevado; la pared de la casa con puerta, ventana y rejilla; el generador apunta su escape a la ventana
// (cono rojo); gira sobre la nieve con peso hasta apuntar al campo y las tres aberturas pasan a verde.
export const HExhaustAim: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="none" bg="#151b26"
  cam={{ at: [-0.1, 0.36, 0.05], az: [0.8, 0.66], el: [0.26, 0.2], r: [2.1, 1.92], fov: 36 }}>{(tt) => {
  const rot = lerp(PI * 0.95, -0.2, phys(tt, 1.6, 5, 0.55)), ok = cl((tt - 3.0) / 0.3), bad = 1 - ok;
  const gx = 0.55, gz = 0.1;
  return <>
    <mesh rotation={[-PI / 2, 0, 0]}><planeGeometry args={[6, 5]} /><meshStandardMaterial color="#e3ebf3" roughness={0.95} /></mesh>
    <RBox s={[0.06, 0.8, 1.4]} p={[-0.6, 0.4, 0]} r={0.01}>{M.wood({ base: [150, 92, 70] })}</RBox>
    <RBox s={[0.6, 0.8, 1.4]} p={[-0.93, 0.4, 0]} r={0.01}>{M.wood({ base: [150, 92, 70] })}</RBox>
    {[-1, 1].map((sd) => <mesh key={sd} position={[-0.9 + sd * 0.19, 0.97, 0]} rotation={[0, 0, -sd * 0.62]}><boxGeometry args={[0.5, 0.035, 1.5]} />{M.matte({ col: "#3a3f48" })}</mesh>)}
    {[[0.32, 0.2, 0.16, 0.36, "DOOR"], [-0.1, 0.45, 0.24, 0.2, "WINDOW"], [-0.48, 0.18, 0.12, 0.08, "VENT"]].map(([z, y, w, hh, l], i) =>
      <group key={i} position={[-0.565, y as number, z as number]}>
        <mesh rotation={[0, PI / 2, 0]}><planeGeometry args={[w as number, hh as number]} /><meshStandardMaterial color={i === 1 ? "#2a3550" : "#3a2a20"} emissive={i === 1 ? "#ffc46a" : "#000"} emissiveIntensity={i === 1 ? 0.5 : 0} /></mesh>
        <Txt3 txt={l as string} w={0.24} h={0.05} col="#f7f4ee" bg={ok > 0.5 ? "#2a6a3a" : "#b3221b"} p={[0.02, (hh as number) / 2 + 0.05, 0]} r={[0, PI / 2, 0]} />
      </group>)}
    <group position={[gx, 0, gz]} rotation={[0, rot, 0]}>
      <Gen t={tt} s={0.8} />
      <mesh position={[0.48, 0.1, 0.06]} rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.16, 0.6, 24, 1, true]} /><meshBasicMaterial color={bad > 0.5 ? "#ff4a3a" : "#8a9096"} transparent opacity={0.28} depthWrite={false} side={2} /></mesh>
    </group>
    <Puffs tt={tt} p={[gx + 0.2 * Math.cos(rot), 0.1, gz - 0.2 * Math.sin(rot)]} n={5} per={1.5} dir={[0.5 * Math.cos(rot), 0.25, -0.5 * Math.sin(rot)]} op={0.45} />
    <Txt3 txt="EXHAUST AWAY" w={0.85} h={0.12} col="#0e1013" bg="#6fe39a" p={[0.3, 0.95, 0.25]} r={[0, 0.7, 0]} op={cl((tt - 3.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 6:37 · OXÍGENO ABAJO, CO ARRIBA: la cocina con las hornallas prendidas y la puerta del horno abierta; detrás dos probetas de vidrio:
// la azul del O₂ baja de 21 % y la gris del CO sube, mientras el reloj de pared da vueltas de horas. «ALL NIGHT, SEALED UP».
export const HO2Co: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#0f1012"
  cam={{ at: [0.08, 0.48, 0], az: [-0.15, 0.12], el: [0.14, 0.1], r: [1.75, 1.6], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.8, 5.2), o2 = lerp(21, 18.2, k), hrs = lerp(1, 8, k);
  return <>
    <RBox s={[0.6, 0.46, 0.46]} p={[-0.2, 0.23, 0]} r={0.02}>{M.porcelain({ col: "#e6e3dc" })}</RBox>
    {[[-0.33, -0.1], [-0.07, -0.1], [-0.33, 0.1], [-0.07, 0.1]].map(([x, z], i) => <group key={i} position={[x, 0.465, z]}>
      <mesh rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.035, 0.05, 24]} />{M.matte({ col: "#1c1d20", side: 2 })}</mesh>
      {Array.from({ length: 8 }, (_, j) => <Flame key={j} k={1} t={tt} i={i * 8 + j} s={0.6} p={[0.042 * Math.cos(j * PI / 4), 0, 0.042 * Math.sin(j * PI / 4)]} />)}
    </group>)}
    <group position={[-0.2, 0.06, 0.232]} rotation={[-1.35, 0, 0]}><RBox s={[0.52, 0.3, 0.02]} p={[0, 0.15, 0]} r={0.01}>{M.porcelain({ col: "#d9d5cc" })}</RBox></group>
    <mesh position={[-0.2, 0.2, 0.231]}><planeGeometry args={[0.48, 0.26]} /><meshPhysicalMaterial color="#141414" emissive="#ff6a20" emissiveIntensity={0.12} roughness={0.08} clearcoat={1} /></mesh>
    <mesh position={[-0.2, 0.31, 0.2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.007, 0.007, 0.42, 10]} /><meshStandardMaterial color="#300" emissive="#ff3a10" emissiveIntensity={2.2} toneMapped={false} /></mesh>
    {[0.15, 0.27].map((y) => <mesh key={"rk" + y} position={[-0.2, y, 0.22]}><boxGeometry args={[0.44, 0.006, 0.006]} />{M.chrome({ col: "#9aa0a6" })}</mesh>)}
    {[0.12, 0.22].map((y) => <mesh key={y} position={[-0.2, y, 0.2]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.44, 8]} />{M.steel({ col: "#5a5e65" })}</mesh>)}
    <RBox s={[0.6, 0.06, 0.03]} p={[-0.2, 0.43, 0.235]} r={0.008}>{M.matte({ col: "#1c1d20" })}</RBox>
    {[-0.42, -0.3, -0.1, 0.02].map((x) => <mesh key={x} position={[x, 0.43, 0.255]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.02, 18]} />{M.chrome({ col: "#c9ced3" })}</mesh>)}
    <mesh position={[-0.2, 0.5, -0.2]}><boxGeometry args={[0.6, 0.12, 0.04]} />{M.porcelain({ col: "#d9d5cc" })}</mesh>
    {[0, 1].map((i) => { const x = 0.35 + i * 0.25, lv = i === 0 ? 1 - 0.55 * k : 0.08 + 0.7 * k, col = i === 0 ? "#3a8adf" : "#8a9096";
      return <group key={i} position={[x, 0, -0.05]}>
        <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.07, 0.07, 0.6, 28, 1, true]} />{M.glass({ op: 0.25 })}</mesh>
        <mesh position={[0, 0.03 + 0.29 * lv, 0]} scale={[1, z1(lv), 1]}><cylinderGeometry args={[0.064, 0.064, 0.58, 28]} /><meshStandardMaterial color={col} transparent opacity={0.8} emissive={col} emissiveIntensity={0.25} /></mesh>
        <Txt3 txt={i === 0 ? `O₂ ${o2.toFixed(1)}%` : "CO ↑"} w={0.22} h={0.06} col="#f7f4ee" bg={i === 0 ? "#1d4a7a" : "#b3221b"} p={[0, 0.7, 0]} />
      </group>; })}
    <group position={[-0.2, 0.78, -0.25]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.03, 40]} />{M.wood({ base: [96, 62, 36] })}</mesh>
      <mesh position={[0, 0, 0.016]}><circleGeometry args={[0.11, 40]} /><meshStandardMaterial color="#f3ecdc" /></mesh>
      <group position={[0, 0, 0.02]} rotation={[0, 0, -hrs * PI / 6]}><mesh position={[0, 0.04, 0]}><boxGeometry args={[0.01, 0.08, 0.004]} />{M.matte({ col: "#1b1d21" })}</mesh></group>
      <group position={[0, 0, 0.022]} rotation={[0, 0, -hrs * 2 * PI]}><mesh position={[0, 0.05, 0]}><boxGeometry args={[0.006, 0.1, 0.004]} />{M.matte({ col: "#b3221b" })}</mesh></group>
    </group>
    <Txt3 txt="ALL NIGHT, SEALED UP" w={0.62} h={0.085} col="#f7f4ee" bg="#1b1d21" p={[0.47, 0.86, -0.05]} op={cl((tt - 3.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 7:26 · EL PILOTO QUE SE AHOGA: primer plano del piloto de la estufa para interiores; los puntitos azules del oxígeno lo rodean y se
// van raleando; la llama se levanta, amarillea y se despega; la válvula gira y corta. «LOW-OXYGEN SHUTOFF».
export const HOds: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark" bg="#0b0c0e"
  cam={{ at: [0.13, 0.05, 0], az: [-0.25, 0.1], el: [0.12, 0.08], r: [0.98, 0.9], fov: 34 }}>{(tt) => {
  const thin = eio(tt, 0.6, 3.2), lift = eio(tt, 2.4, 3.4), cut = tt > 3.6 ? 0.001 : 1, vr = eio(tt, 3.5, 3.9);
  return <>
    <pointLight position={[0.05, 0.2, 0.25]} intensity={0.9} distance={1.2} color="#ffd8a8" />
    <RBox s={[0.8, 0.6, 0.02]} p={[0.1, 0.05, -0.2]} r={0.01}>{M.steel({ col: "#4a4e55" })}</RBox>
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.012, 0.012, 0.2, 14]} />{M.steel()}</mesh>
    <mesh position={[0.05, 0.02, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.005, 0.005, 0.12, 10]} />{M.brass()}</mesh>
    <mesh geometry={tubeG("ods_t", [[0, -0.15, 0], [0.12, -0.18, 0.02], [0.3, -0.12, 0]], 0.006, 30, 8)}>{M.brass({ col: "#c98a3a" })}</mesh>
    <group position={[0.3, -0.12, 0]} scale={1.7}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.05, 24]} />{M.brass({ col: "#c98a3a" })}</mesh>
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />{M.brass({ col: "#c98a3a" })}</mesh>
      <Txt3 txt="VALVE" w={0.09} h={0.03} col="#f7f4ee" bg="#1b1d21" p={[0, 0.065, 0.03]} />
      <group position={[0, 0, 0.03]} rotation={[0, 0, -vr * PI / 2]}><RBox s={[0.1, 0.02, 0.02]} r={0.005}>{M.plastic({ col: "#c62a22" })}</RBox></group>
    </group>
    <group position={[0, 0.05 + 0.05 * lift, 0]} rotation={[0, 0, 0.35 * lift]}>
      <Flame k={cut} t={tt} s={3.0 - 0.8 * lift} />
      <mesh position={[0, 0.08, 0]} scale={[1, 1.4, 1]}><sphereGeometry args={[0.02 * lift * cut + 0.001, 12, 10]} />{M.glow({ col: "#ffb34a", op: 0.7 })}</mesh>
    </group>
    {Array.from({ length: 40 }, (_, i) => { const a = i * 2.39, r = 0.12 + 0.18 * ((i * 37) % 10) / 10, y = -0.1 + ((i * 53) % 30) / 100, gone = i / 40 < thin;
      return <mesh key={i} position={[r * Math.cos(a + tt * 0.3), y + 0.02 * Math.sin(tt + i), r * Math.sin(a + tt * 0.3) * 0.6]} scale={z1(gone ? 0.001 : 1)}><sphereGeometry args={[0.008, 8, 6]} />{M.glow({ col: "#6ab4ff", op: 0.8 })}</mesh>; })}
    <Txt3 txt="LOW-OXYGEN SHUTOFF" w={0.62} h={0.08} col="#0e1013" bg="#6fe39a" p={[0.12, 0.2, 0.05]} op={cl((tt - 3.9) / 0.3)} />
  </>;
}}</Scene3D>;

// 8:21 · TRES BLOQUES DE HIELO: sobre la bandeja suben tres bloques con su alto en horas — heladera 4, freezer lleno 48, a medias 24;
// cuando una puerta se abre, al de 48 se le cae una rebanada. «EVERY OPEN = LESS TIME».
export const HIceBlocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark" bg="#0d1015"
  cam={{ at: [0, 0.42, 0], az: [-0.18, 0.12], el: [0.18, 0.12], r: [1.65, 1.5], fov: 34 }}>{(tt) => {
  const B = [{ h: 4, l: "FRIDGE", a: 0.5 }, { h: 48, l: "FULL FREEZER", a: 1.4 }, { h: 24, l: "HALF FREEZER", a: 2.3 }];
  const sl = phys(tt, 4.0, 5, 0.6), cut = tt > 3.9 ? 0.06 : 0;
  return <>
    <RBox s={[1.3, 0.03, 0.4]} p={[0, 0.015, 0]} r={0.01}>{M.steel({ col: "#8a9096" })}</RBox>
    {B.map((b, i) => { const x = -0.42 + i * 0.42, hh = (b.h / 48) * 0.62 * eio(tt, b.a, b.a + 0.8) - (i === 1 ? cut : 0), hs = Math.max(0.012, hh);
      return <group key={i} position={[x, 0.03, 0]}>
        <RBox s={[0.24, hs, 0.24]} p={[0, hs / 2, 0]} r={0.012}><meshPhysicalMaterial color="#cfeaff" roughness={0.15} transmission={0.4} thickness={0.2} clearcoat={1} /></RBox>
        <Txt3 txt={`${Math.round(b.h * eio(tt, b.a, b.a + 0.8))} H`} w={0.2} h={0.08} col="#f7f4ee" glow p={[0, hs + 0.08, 0.05]} />
        <Txt3 txt={b.l} w={0.34} h={0.05} col="#f7f4ee" bg="#1b1d21" p={[0, -0.0, 0.17]} r={[-0.4, 0, 0]} />
      </group>; })}
    <group position={[0, 0.03 + 0.62 - 0.03 - 0.4 * (tt > 3.9 ? (sl > 0 ? 1 - Math.pow(1 - cl((tt - 3.9) / 0.6), 2) : 0) : 0), 0.0]} rotation={[0, 0, tt > 3.9 ? 0.6 * cl((tt - 3.9) / 0.6) : 0]}>
      <RBox s={[0.24, tt > 3.9 ? 0.06 : 0.001, 0.24]} r={0.01}><meshPhysicalMaterial color="#cfeaff" roughness={0.15} transmission={0.4} thickness={0.2} transparent opacity={1 - cl((tt - 4.6) / 0.4)} /></RBox>
    </group>
    <Txt3 txt="EVERY OPEN = LESS TIME" w={0.9} h={0.09} col="#f7f4ee" bg="#b3221b" p={[0, 0.86, -0.1]} op={cl((tt - 4.3) / 0.3)} />
  </>;
}}</Scene3D>;

// 8:52 · LAS DOS HELADERAS: la de Frank y la de Gary, iguales. La de Frank se abre una y otra vez (palotes en la libreta) y su termómetro
// sube a 52 °F; la de Gary se abre una vez y queda en 39. Al final la de Frank se ilumina en rojo «$300 IN THE TRASH».
export const HTwoFridges: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="tile" wall="tile" bg="#0f1012"
  cam={{ at: [0, 0.5, 0], az: [-0.12, 0.1], el: [0.12, 0.08], r: [1.85, 1.7], fov: 34 }}>{(tt) => {
  const opens = 6, per = 0.55, n = Math.min(opens, Math.floor(cl((tt - 0.5) / (opens * per)) * opens + (tt > 0.5 ? 1 : 0)));
  const fd = tt > 0.5 && tt < 0.5 + opens * per ? Math.sin(PI * (((tt - 0.5) % per) / per)) : 0;
  const gd = tt > 1.2 && tt < 1.7 ? Math.sin(PI * (tt - 1.2) / 0.5) : 0;
  const fT = lerp(38, 52, eio(tt, 0.6, 4.0)), gT = lerp(38, 39, eio(tt, 0.6, 4.0));
  const tag = (x: number, txt: string, temp: number, bad: boolean) => <>
    <Txt3 txt={txt} w={0.28} h={0.07} col="#f7f4ee" bg="#1b1d21" p={[x, 0.95, 0.15]} />
    <Txt3 txt={`${Math.round(temp)}°F`} w={0.24} h={0.1} col={bad ? "#ff6a5a" : "#6fe39a"} glow p={[x, 0.8, 0.2]} />
  </>;
  return <>
    <Fridge p={[-0.35, 0, 0]} s={1.15} door={0.6 * fd} lit={fd} />
    <Fridge p={[0.35, 0, 0]} s={1.15} door={0.6 * gd} lit={gd} />
    {tag(-0.35, "FRANK", fT, fT > 40)}{tag(0.35, "GARY", gT, false)}
    <group position={[-0.75, 0.35, 0.1]} rotation={[0, 0.4, 0]}>
      <RBox s={[0.16, 0.22, 0.01]} r={0.004}><meshStandardMaterial map={null} color="#f1ead9" /></RBox>
      {Array.from({ length: opens }, (_, i) => <mesh key={i} position={[-0.05 + i * 0.02, 0.0, 0.006]} rotation={[0, 0, i === 4 ? 1.1 : 0]} scale={[1, i === 4 ? 1.6 : 1, 1]} visible={i < n}><boxGeometry args={[0.004, 0.08, 0.002]} />{M.matte({ col: "#1b1d21" })}</mesh>)}
      <Txt3 txt="OPENED" w={0.12} h={0.03} col="#1b1d21" p={[0, 0.08, 0.006]} />
    </group>
    <Mark ok k={cl((tt - 4.4) / 0.4)} p={[0.35, 0.45, 0.22]} s={1.2} />
    <Txt3 txt="$300 IN THE TRASH" w={0.62} h={0.085} col="#f7f4ee" bg="#b3221b" p={[-0.35, 0.1, 0.42]} op={cl((tt - 4.6) / 0.3)} />
  </>;
}}</Scene3D>;

// 9:11 · UN SEGUNDO: el termómetro de US$5 en el estante del medio; la puerta se abre un segundo (el cronómetro marca 1.0),
// el visor dice 38 °F y la puerta cierra con resorte. «UNDER 40°F = FOOD'S FINE».
export const HOneSecond: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="tile" bg="#0f1012"
  cam={{ at: [0.08, 0.5, 0.1], az: [0.42, 0.3], el: [0.1, 0.07], r: [1.5, 1.34], fov: 34 }}>{(tt) => {
  const a = 1.0, d = tt < a ? 0 : tt < a + 1.0 ? Math.min(1, (tt - a) / 0.2) : Math.max(0, 1 - phys(tt, a + 1.0, 7, 0.5)) + (tt > a + 1.4 ? 0.14 * Math.exp(-(tt - a - 1.4) * 0.6) * Math.abs(Math.sin((tt - a - 1.4) * 2.2)) : 0), sw = cl((tt - a) / 1.0);
  return <>
    <Fridge p={[0, 0, 0]} s={1.3} door={0.75 * d} lit={d} />
    <group position={[0.06, 0.32, 0.22]} scale={z1(d > 0.05 ? 2.2 : 0.001)}>
      <RBox s={[0.07, 0.09, 0.02]} r={0.008}>{M.plastic({ col: "#f3f1ea" })}</RBox>
      <mesh position={[0, 0.005, 0.011]}><planeGeometry args={[0.055, 0.035]} /><meshStandardMaterial color="#a9c3a2" emissive="#9fd39a" emissiveIntensity={0.4} /></mesh>
      <Txt3 txt="38°F" w={0.05} h={0.026} col="#14231a" p={[0, 0.005, 0.012]} font="Courier New" s={1.4} />
    </group>
    <group position={[0.5, 0.6, 0.15]} rotation={[0, 0.4, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.09, 0.09, 0.025, 36]} />{M.chrome({ col: "#c9ced3" })}</mesh>
      <mesh position={[0, 0, 0.013]}><circleGeometry args={[0.078, 36]} /><meshStandardMaterial color="#f7f4ee" /></mesh>
      <group position={[0, 0, 0.016]} rotation={[0, 0, -sw * 2 * PI]}><mesh position={[0, 0.035, 0]}><boxGeometry args={[0.006, 0.07, 0.003]} />{M.matte({ col: "#b3221b" })}</mesh></group>
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />{M.chrome()}</mesh>
      <Txt3 txt={`${sw.toFixed(1)} s`} w={0.16} h={0.06} col="#f7f4ee" glow p={[0, -0.13, 0.02]} />
    </group>
    <Txt3 txt="38°F" w={0.3} h={0.14} col="#0e1013" bg="#9fd39a" p={[0.5, 0.3, 0.18]} r={[0, 0.4, 0]} op={cl((tt - a - 0.4) / 0.3)} />
    <Txt3 txt="UNDER 40°F = FINE" w={0.62} h={0.085} col="#0e1013" bg="#6fe39a" p={[0.22, 0.24, 0.42]} r={[0, 0.35, 0]} op={cl((tt - 2.8) / 0.3)} />
  </>;
}}</Scene3D>;

// 10:13 · LAS BOLITAS DE CORRIENTE: un embudo suelta 12,5 bolitas por segundo (los amperes de la estufa); por el caño grueso pasan sueltas,
// en el fino se atoran y el caño se pone al rojo. «1,500 W = 12.5 A».
export const HMarbles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark" bg="#0e0f11"
  cam={{ at: [0, 0.45, 0], az: [-0.12, 0.1], el: [0.14, 0.1], r: [1.5, 1.35], fov: 34 }}>{(tt) => {
  const heat = eio(tt, 1.6, 4.4);
  const ball = (i: number, thin: boolean) => { const per = thin ? 2.6 : 1.1, u = ((tt + i * 0.27) % per) / per, x = thin ? 0.32 : -0.32;
    const jam = thin ? Math.min(u, 0.35 + 0.03 * (i % 5)) : u; const y = lerp(0.62, 0.05, jam);
    return <mesh key={(thin ? "t" : "g") + i} position={[x + (thin ? 0 : 0.03 * Math.sin(i)), y, 0]}><sphereGeometry args={[thin ? 0.016 : 0.018, 12, 10]} />{M.brass({ col: "#ffcf5a", em: "#ff9a2a", emI: 0.6 })}</mesh>; };
  return <>
    {[-0.32, 0.32].map((x, i) => <group key={x} position={[x, 0, 0]}>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.13, 0.04, 0.14, 28, 1, true]} />{M.glass({ op: 0.3 })}</mesh>
      <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[i ? 0.03 : 0.07, i ? 0.03 : 0.07, 0.62, 24, 1, true]} /><meshPhysicalMaterial color={i ? "#ffd0b0" : "#e9f6ff"} transparent opacity={0.5} roughness={0.05} emissive="#ff3a1a" emissiveIntensity={i ? 1.6 * heat : 0} side={2} depthWrite={false} /></mesh>
      <Txt3 txt={i ? "THIN CORD" : "HEAVY CORD"} w={0.34} h={0.06} col="#f7f4ee" bg={i ? "#b3221b" : "#2a6a3a"} p={[0, -0.04, 0.12]} />
    </group>)}
    {Array.from({ length: 12 }, (_, i) => ball(i, false))}
    {Array.from({ length: 12 }, (_, i) => ball(i, true))}
    <pointLight position={[0.32, 0.4, 0.2]} intensity={1.2 * heat} distance={0.7} color="#ff6a3a" />
    <Txt3 txt="1,500 W = 12.5 A" w={0.8} h={0.11} col="#0e1013" bg="#ffd25a" p={[0, 0.86, 0.05]} op={cl((tt - 0.4) / 0.3)} />
  </>;
}}</Scene3D>;

// 10:35 · EL RELOJ QUE SE COME LA BATERÍA: la caja de 1000 Wh con sus diez rayitas en anillo alrededor de un reloj; la estufa al lado
// prendida; la aguja barre y cada rayita se apaga; se vacía antes de la hora: frena en 40 min. «EMPTY IN UNDER AN HOUR».
export const HDrainClock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="dark" bg="#0e0d0c"
  cam={{ at: [0.05, 0.36, 0], az: [-0.15, 0.12], el: [0.14, 0.1], r: [1.5, 1.35], fov: 34 }}>{(tt) => {
  const k = eio(tt, 0.8, 4.4), min = Math.round(40 * k), segs = Math.ceil(10 * (1 - k));
  return <>
    <PBox p={[-0.45, 0, 0.1]} s={1.1} scr={`${segs * 10}%`} on={1} sticker="1000 Wh" stickerBg="#2b6fd6" />
    <group position={[0.42, 0, 0.1]}>
      <RBox s={[0.26, 0.24, 0.12]} p={[0, 0.12, 0]} r={0.02}>{M.plastic({ col: "#c62a22" })}</RBox>
      <mesh position={[0, 0.13, 0.061]}><planeGeometry args={[0.2, 0.15]} /><meshStandardMaterial color="#3a2a22" emissive="#ff6a20" emissiveIntensity={1.6 * (segs > 0 ? 1 : 0.1)} toneMapped={false} /></mesh>
      <Txt3 txt="1,500 W" w={0.24} h={0.06} col="#f7f4ee" bg="#1b1d21" p={[0, 0.3, 0.02]} />
    </group>
    <group position={[0, 0.5, -0.2]}>
      <mesh position={[0, 0, -0.02]}><circleGeometry args={[0.24, 48]} /><meshStandardMaterial color="#f3ecdc" /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const a = PI / 2 - (i + 0.5) * 2 * PI / 10, on = i < segs;
        return <mesh key={i} position={[0.27 * Math.cos(a), 0.27 * Math.sin(a), 0]} rotation={[0, 0, a]}><boxGeometry args={[0.05, 0.11, 0.02]} /><meshStandardMaterial color={on ? "#4fbf6a" : "#2a2c30"} emissive={on ? "#4fbf6a" : "#000"} emissiveIntensity={on ? 0.6 : 0} /></mesh>; })}
      <group rotation={[0, 0, -k * (40 / 60) * 2 * PI]}><mesh position={[0, 0.09, 0.005]}><boxGeometry args={[0.012, 0.18, 0.006]} />{M.matte({ col: "#b3221b" })}</mesh></group>
      <Txt3 txt={`${min} MIN`} w={0.2} h={0.07} col="#f7f4ee" bg="#1b1d21" p={[0, -0.4, 0.02]} />
    </group>
    <Txt3 txt="EMPTY IN UNDER AN HOUR" w={0.86} h={0.09} col="#f7f4ee" bg="#b3221b" p={[0, 0.9, -0.15]} op={cl((tt - 4.5) / 0.3)} />
  </>;
}}</Scene3D>;

// 11:03 · LA LETRA DEL CABLE: primer plano del cable grueso; sobre la vaina corre la leyenda impresa «14 AWG · 15 A»; el cable corto se
// enrolla en el banco y le caen tres sellos: SHORT · HEAVY · RATED.
export const HAwgPrint: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" bg="#0e0f11"
  cam={{ at: [0, 0.12, -0.05], az: [-0.25, 0.1], el: [0.48, 0.4], r: [1.35, 1.25], fov: 34 }}>{(tt) => {
  const sh = (tt * 0.12) % 0.5, st = (i: number) => phys(tt, 2.6 + i * 0.55, 8, 0.45);
  return <>
    <mesh position={[0, 0.04, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.035, 0.035, 1.6, 32]} />{M.rubber({ col: "#e5761c" })}</mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[0, 0.03 + i * 0.05, -0.3]} rotation={[PI / 2, 0, i * 0.3]}><torusGeometry args={[0.16, 0.025, 14, 48]} />{M.rubber({ col: "#e5761c" })}</mesh>)}
    {[-0.5, 0, 0.5].map((x0) => { const x = ((x0 + sh + 0.75) % 1.5) - 0.75;
      return <Txt3 key={x0} txt="14 AWG · 15A 125V" w={0.42} h={0.035} col="#1b1d21" p={[x, 0.0755, 0]} r={[-PI / 2, 0, 0]} />; })}
    {["SHORT", "HEAVY", "RATED"].map((l, i) => { const k = st(i);
      return <group key={l} position={[-0.3 + i * 0.3, 0.18 + 0.3 * (1 - cl(k)), 0.14]} scale={z1(k)} rotation={[0, 0, [0.12, -0.08, 0.1][i]]}>
        <Txt3 txt={l} w={0.26} h={0.085} col="#2a6a3a" bg="#eef3ea" weight={900} />
      </group>; })}
    <Txt3 txt="12 or 14 GAUGE" w={0.5} h={0.08} col="#ffd25a" glow p={[0, 0.32, -0.05]} op={cl((tt - 1.0) / 0.3)} />
  </>;
}}</Scene3D>;
