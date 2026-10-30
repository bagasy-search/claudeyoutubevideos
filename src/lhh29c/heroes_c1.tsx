// lhh29c · componentes únicos 1-8 (kit h3d + foilkit): el rollo de 15 trabajos, el termómetro del horno que se vuelve loco,
// las bolas de lana de 16 dólares, la chispa de estática, la fuente de los Klassen, la escala de dureza, la sartén rayada y la taza de bollitos.
import React from "react";
import * as THREE from "three";
import { AMB, Head, ICE, H, GRN, RED, Tag } from "./hkit";
import { M, RBox, Scene3D, DigitDrum, cl, tex, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Foil, FoilBall, FoilBox, FoilSheet, SERIF, Spoon, Shears } from "./foilkit";

const PI = Math.PI;
const label = (key: string, w: number, h: number, txt: string, size: number, fg = "#1f160c", bg = "#fbf6e8") => tex.text(key, w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = `bold ${size}px ${SERIF}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 2);
});

// ---- 0:23 · QUINCE TRABAJOS EN UN ROLLO: la caja azul se abre, la hoja sale larga por la mesada y quince pliegues se encienden uno por uno ----
export const HFoilPanels: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="dark" lamp={[0.2, 0.5, 0.4]}
  cam={{ at: [0, 0.03, 0.08], az: [-0.35, -0.12], el: [0.5, 0.42], r: [0.62, 0.52], fov: 32 }}
  over={(tt) => <Head tt={tt} kick="" title="ONE ROLL · 15 JOBS" col={AMB} />}>{(tt, u) => {
  // el rollo grande rueda hacia atrás y deja la hoja estirada; sobre la hoja, quince trabajos aparecen de a uno con peso
  const un = eio(tt, 0.2, 1.6), rx = lerp(-0.02, -0.26, un);
  return <>
    <group position={[0, 0.045, rx]} rotation={[0, 0, PI / 2]}>
      <mesh rotation={[0, un * 9, 0]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.42, 48]} /><Foil dull /></mesh>
      <mesh><cylinderGeometry args={[0.016, 0.016, 0.425, 24]} /><meshStandardMaterial color="#b88a52" roughness={0.8} /></mesh>
    </group>
    <mesh position={[0, 0.002, (rx + 0.2) / 2]} rotation={[-PI / 2, 0, 0]} scale={[1, Math.max(0.001, 0.2 - rx), 1]}><planeGeometry args={[0.42, 1]} /><Foil dull /></mesh>
    {(() => { const n = Math.max(0, Math.min(15, Math.floor((u - 0.12) / 0.05) + 1)), ct = tex.text("cnt15_" + n, 256, 128, (g) => { g.fillStyle = "#26221e"; g.fillRect(0, 0, 256, 128); g.fillStyle = "#f2c14e"; g.font = "bold 104px " + SERIF; g.textAlign = "center"; g.fillText(String(n).padStart(2, "0"), 128, 106); });
      return <group position={[0, 0.04, 0.17]} rotation={[-0.5, 0, 0]}>
      <RBox s={[0.13, 0.07, 0.03]} p={[0, 0, -0.016]} r={0.01}><meshPhysicalMaterial color="#26221e" roughness={0.4} clearcoat={0.7} /></RBox>
      <mesh position={[0, 0, 0.0005]}><planeGeometry args={[0.12, 0.06]} /><meshStandardMaterial map={ct} emissive="#f2c14e" emissiveMap={ct} emissiveIntensity={0.35} roughness={0.5} /></mesh></group>; })()}
    {Array.from({ length: 15 }, (_, i) => { const kk = cl((u - 0.12 - i * 0.05) / 0.06); if (kk <= 0) return null; const k = 1 - Math.exp(-kk * 5) * Math.cos(kk * 9);
      const c = i % 5, r = Math.floor(i / 5), x = -0.16 + c * 0.08, z = -0.17 + r * 0.11, y = 0.004 + (1 - cl(kk * 1.6)) * 0.12, kind = i % 5;
      return <group key={i} position={[x, y, z]} scale={Math.max(0.001, 2.1 * cl(k * 1.4))}>
        {kind === 0 && <FoilBall r={0.022} p={[0, 0.022, 0]} rot={[i, i, 0]} seed={20 + i} />}
        {kind === 1 && <Spoon p={[0, 0.006, 0]} rot={[0, 0.6, 0]} s={0.45} />}
        {kind === 2 && <Shears p={[0, 0.006, 0]} rot={[-PI / 2, 0, 0.5]} s={0.3} open={0.3} />}
        {kind === 3 && <FoilSheet w={0.05} d={0.05} p={[0, 0.003, 0]} crumple={0.3} />}
        {kind === 4 && <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.022, 0.026, 0.04, 24]} /><Foil /></mesh>}
      </group>; })}
  </>;
}}</Scene3D>;

// ---- 1:03 · EL HORNO DE LA IGLESIA SE VOLVIÓ LOCO: el termómetro redondo del horno; la aguja pasa de 325 y se clava en rojo, temblando ----
const dialTex = () => tex.text("ovdial2", 512, 512, (g) => {
  g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(256, 256, 250, 0, 6.3); g.fill();
  for (let v = 100; v <= 500; v += 25) { const a = PI * 0.75 + ((v - 100) / 400) * PI * 1.5, big = v % 100 === 0;
    g.strokeStyle = v >= 375 ? "#b8322a" : "#2a221a"; g.lineWidth = big ? 7 : 3; g.beginPath(); g.moveTo(256 + Math.cos(a) * 230, 256 + Math.sin(a) * 230); g.lineTo(256 + Math.cos(a) * (big ? 190 : 208), 256 + Math.sin(a) * (big ? 190 : 208)); g.stroke();
    if (big) { g.fillStyle = v >= 375 ? "#b8322a" : "#2a221a"; g.font = "bold 40px " + SERIF; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(v), 256 + Math.cos(a) * 150, 256 + Math.sin(a) * 150); } }
  g.strokeStyle = "rgba(184,50,42,.85)"; g.lineWidth = 22; g.beginPath(); g.arc(256, 256, 238, PI * 0.75 + (275 / 400) * PI * 1.5, PI * 2.25); g.stroke();
  g.fillStyle = "#2a221a"; g.font = "bold 30px " + SERIF; g.textAlign = "center"; g.fillText("OVEN °F", 256, 320);
});
export const HHaywire: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark"
  cam={{ at: [0, 0.18, 0], az: [-0.18, 0.12], el: [0.1, 0.06], r: [0.8, 0.68], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="THE OVEN WENT HAYWIRE" col={RED} />
    <Tag tt={tt} at={1.2} x={420} y={830} txt="SET · 325°" col={GRN} size={44} anchor="l" />
    <Tag tt={tt} at={3.2} x={1500} y={830} txt="REAL · 365°" col={RED} size={44} /></>}>{(tt) => {
  const go = eio(tt, 1.6, 3.2), shake = tt > 3.2 ? Math.sin(tt * 38) * 0.03 * cl((tt - 3.2) * 2) : 0;
  const v = lerp(100, 325, eio(tt, 0.5, 1.4)) + 40 * go, a = -(PI * 0.75 + ((v - 100) / 400) * PI * 1.5) + shake;
  const heat = cl((tt - 2.2) / 1.5);
  return <>
    {/* puerta de horno esmaltada detrás, con ventanita que se enciende */}
    <RBox s={[0.9, 0.55, 0.04]} p={[0, 0.2, -0.12]} r={0.02}>{M.porcelain({ col: "#ece6d6" })}</RBox>
    <RBox s={[0.5, 0.22, 0.01]} p={[0, 0.12, -0.095]} r={0.01}><meshStandardMaterial color={new THREE.Color("#1a1410").lerp(new THREE.Color("#3a1810"), heat)} roughness={0.15} metalness={0.3} /></RBox>
    <pointLight position={[0, 0.12, 0.05]} color="#ff5a1a" intensity={0.1 * heat} distance={0.4} />
    <group position={[0, 0.24, 0]} rotation={[PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.13, 0.13, 0.03, 64]} />{M.chrome({})}</mesh>
      <mesh position={[0, 0.016, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.118, 64]} /><meshStandardMaterial map={dialTex()} color="#a9a397" roughness={0.6} /></mesh>
      <mesh position={[0, 0.019, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.122, 64]} />{M.glass({ op: 0.12 })}</mesh>
      {/* la aguja fantasma verde: donde Loretta la puso (325) */}
      <group position={[0, 0.0195, 0]} rotation={[0, -(PI * 0.75 + (225 / 400) * PI * 1.5), 0]}><mesh position={[0.045, 0, 0]}><boxGeometry args={[0.1, 0.0015, 0.006]} /><meshStandardMaterial color="#2e8a4a" transparent opacity={0.7 * eio(tt, 1.6, 2.2)} /></mesh></group>
      <group position={[0, 0.02, 0]} rotation={[0, a, 0]}><mesh position={[0.045, 0, 0]}><boxGeometry args={[0.1, 0.002, 0.006]} /><meshStandardMaterial color="#b8322a" /></mesh></group>
      <mesh position={[0, 0.022, 0]}><cylinderGeometry args={[0.01, 0.01, 0.006, 24]} />{M.brass({})}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 1:48 · DIECISÉIS DÓLARES POR UNAS BOLAS: a la izquierda tres bolas de lana con la etiqueta de $16; a la derecha una hoja se estruja en tres bollitos ----
export const HSixteen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood" lamp={[0, 0.5, 0.4]}
  cam={{ at: [0, 0.05, 0], az: [-0.25, 0.05], el: [0.2, 0.16], r: [0.75, 0.66], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="$16 OR ONE SHEET" col={AMB} />
    <Tag tt={tt} at={1.0} x={560} y={850} txt="WOOL · $16" col={RED} size={44} />
    <Tag tt={tt} at={4.0} x={1360} y={850} txt="FOIL · PENNIES" col={GRN} size={44} /></>}>{(tt) => {
  const wool = <meshStandardMaterial color="#efe6d4" roughness={1} bumpMap={tex.paper(3, 3)} bumpScale={3} />;
  const sq = eio(tt, 1.8, 3.8);
  return <>
    {[0, 1, 2].map((i) => { const k = phys(tt, 0.3 + i * 0.25, 7, 0.4);
      return k > 0 && <mesh key={i} position={[-0.26 + i * 0.075, 0.035 + (1 - cl(k)) * 0.3, 0.02 * (i - 1)]} castShadow><sphereGeometry args={[0.035, 40, 24]} />{wool}</mesh>; })}
    {(() => { const k = phys(tt, 0.9, 6, 0.45); return k > 0 && <group position={[-0.14, 0.09 + (1 - cl(k)) * 0.3, 0.06]} rotation={[0, -0.3, 0.06 * Math.sin(tt * 2)]}>
      <RBox s={[0.08, 0.05, 0.003]} r={0.005}><meshStandardMaterial map={label("tag16", 256, 160, "$16", 96, "#b8322a", "#fff8dc")} roughness={0.8} /></RBox></group>; })()}
    {/* la hoja se encoge y nacen tres bollitos */}
    {sq < 1 && <FoilSheet w={0.26 * (1 - sq * 0.85)} d={0.18 * (1 - sq * 0.85)} p={[0.2, 0.004 + sq * 0.04, 0]} rot={[-PI / 2 + sq * 0.8, sq * 1.5, 0]} crumple={0.1 + sq * 2} />}
    {[0, 1, 2].map((i) => { const k = phys(tt, 3.6 + i * 0.3, 7, 0.4); return k > 0 && <FoilBall key={i} r={0.034 * cl(k * 1.2)} seed={i + 2} p={[0.13 + i * 0.075, 0.034, 0.02 * (i - 1)]} rot={[i, tt * 0.3, 0]} />; })}
  </>;
}}</Scene3D>;

// ---- 2:22 · LA ESTÁTICA SE VA AL BOLLITO: una toalla doblada larga chispas azules que saltan al bollito; el bollito las absorbe y la toalla queda lisa ----
const boltPts = (a: number[], b: number[], seed: number) => Array.from({ length: 9 }, (_, i) => { const u = i / 8, j = i === 0 || i === 8 ? 0 : 1;
  return [lerp(a[0], b[0], u) + (rn(seed * 9 + i, 2) - 0.5) * 0.03 * j, lerp(a[1], b[1], u) + (rn(seed * 9 + i, 3) - 0.5) * 0.03 * j, lerp(a[2], b[2], u) + (rn(seed * 9 + i, 4) - 0.5) * 0.03 * j]; });
export const HStaticZap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="dark"
  cam={{ at: [0, 0.06, 0], az: [0.4, 0.15], el: [0.2, 0.14], r: [0.66, 0.54], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="STATIC GOES TO THE FOIL" col={ICE} />
    <Tag tt={tt} at={4.4} x={1440} y={830} txt="NOT ONE CRACKLE" col={GRN} size={44} /></>}>{(tt) => {
  const live = tt > 0.8 && tt < 4.2, fr = Math.floor(tt * 10), glow = cl((tt - 1) / 2) * (1 - cl((tt - 4.2) / 1));
  return <>
    {[0, 1, 2].map((i) => <RBox key={i} s={[0.3, 0.025, 0.2]} p={[-0.12, 0.013 + i * 0.026, 0]} rot={[0, 0.04 * (i - 1), 0]} r={0.012}><meshStandardMaterial color={["#7aa7d6", "#e8e2d4", "#d98a8a"][i]} roughness={1} bumpMap={tex.paper(4, 4)} bumpScale={4} /></RBox>)}
    <FoilBall r={0.045} p={[0.17, 0.045, 0.02]} rot={[0.4, tt * 0.4, 0]} seed={7} />
    <pointLight position={[0.17, 0.08, 0.06]} color="#8fd0ff" intensity={2.5 * glow} distance={0.5} />
    {live && [0, 1, 2].map((k) => { const s = fr * 3 + k; if (rn(s, 9) < 0.35) return null;
      const a = [-0.06 + rn(s, 5) * 0.12, 0.08, -0.06 + rn(s, 6) * 0.12], b = [0.14, 0.05 + rn(s, 7) * 0.03, 0.02];
      return <mesh key={k} geometry={tubeG("zap" + s, boltPts(a, b, s), 0.0018, 24, 6)}>{M.glow({ col: "#bfe6ff" })}</mesh>; })}
  </>;
}}</Scene3D>;

// ---- 2:55 · LA FUENTE DE LOS KLASSEN: la fuente de vidrio de 1966 con su etiqueta de remate; el queso de las esquinas se pone gris y rajado como cemento ----
const crackTex = () => tex.text("concrete", 256, 256, (g) => {
  g.fillStyle = "#9b958a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 900; i++) { const v = 110 + rn(i, 1) * 70; g.fillStyle = `rgba(${v},${v - 4},${v - 12},.6)`; g.fillRect(rn(i, 2) * 256, rn(i, 3) * 256, 2, 2); }
  g.strokeStyle = "#3a3630"; g.lineWidth = 2; for (let i = 0; i < 9; i++) { g.beginPath(); let x = rn(i, 4) * 256, y = rn(i, 5) * 256; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (rn(i * 9 + k, 6) - 0.5) * 70; y += (rn(i * 9 + k, 7) - 0.5) * 70; g.lineTo(x, y); } g.stroke(); }
});
export const HKlassen: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood" lamp={[0.2, 0.5, 0.3]}
  cam={{ at: [0, 0.04, 0], az: [0.5, 0.2], el: [0.5, 0.4], r: [0.6, 0.5], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="BAKED ON LIKE CONCRETE" col={AMB} />
    </>}>{(tt) => {
  const c = eio(tt, 1.8, 3.6), tg = phys(tt, 0.8, 5, 0.35);
  const cheese = <meshStandardMaterial color={new THREE.Color("#e5a23a").lerp(new THREE.Color("#ffffff"), c * 0.5)} map={c > 0.4 ? crackTex() : undefined} roughness={0.8} />;
  return <>
    <RBox s={[0.34, 0.006, 0.22]} p={[0, 0.003, 0]} r={0.003}>{M.glass({ op: 0.35 })}</RBox>
    {[[0, 0.03, 0.11, 0.34, 0.006], [0, 0.03, -0.11, 0.34, 0.006], [0.17, 0.03, 0, 0.006, 0.22], [-0.17, 0.03, 0, 0.006, 0.22]].map(([x, y, z, w, d], i) =>
      <RBox key={i} s={[w, 0.06, d]} p={[x, y, z]} r={0.003}>{M.glass({ op: 0.3 })}</RBox>)}
    {/* macarrones y el queso pegado en las cuatro esquinas */}
    <RBox s={[0.32, 0.03, 0.2]} p={[0, 0.02, 0]} r={0.01}><meshStandardMaterial color="#f2c25a" roughness={0.6} /></RBox>
    {[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, b], i) => { const sc = i === 0 ? 1 - 0.95 * eio(tt, 3.6, 5.4) : 1; return <mesh key={i} position={[a * 0.15, 0.04, b * 0.09]} scale={[1.2 * sc + 0.001, 0.5 * sc + 0.001, sc + 0.001]}><sphereGeometry args={[0.028, 20, 12]} />{cheese}</mesh>; })}
    {/* el bollito de papel aluminio baja y raspa la esquina hasta dejar el vidrio limpio */}
    {(() => { const k = phys(tt, 3.0, 6, 0.5), an = tt * 9; return k > 0 && <FoilBall r={0.032} seed={9} p={[0.15 + Math.cos(an) * 0.012, 0.05 + (1 - cl(k)) * 0.25, 0.09 + Math.sin(an) * 0.012]} rot={[an, an * 0.6, 0]} />; })()}
    {/* etiqueta de cartón del remate, colgada de un hilo */}
    <group position={[-0.06, 0.1, 0.13]} rotation={[0, -0.3, Math.sin(tt * 1.6) * 0.08]} scale={Math.max(0.001, 0.85 * cl(tg))}>
      <mesh position={[-0.03, 0.03, 0]} rotation={[0, 0, 0.8]}><cylinderGeometry args={[0.0008, 0.0008, 0.08, 4]} /><meshStandardMaterial color="#cbbfa8" /></mesh>
      <RBox s={[0.1, 0.05, 0.002]} r={0.004}><meshStandardMaterial map={tex.text("klassen", 320, 160, (g) => { g.fillStyle = "#efe2c4"; g.fillRect(0, 0, 320, 160); g.fillStyle = "#3a2a18"; g.font = "bold 34px " + SERIF; g.textAlign = "center"; g.fillText("KLASSEN", 160, 62); g.font = "28px " + SERIF; g.fillText("ESTATE · 1966", 160, 112); })} roughness={0.85} /></RBox>
    </group>
  </>;
}}</Scene3D>;

// ---- 3:15 · BLANDO CON EL VIDRIO, DURO CON EL QUESO: una regla de dureza vertical; vidrio arriba, queso abajo, y el bollito se acomoda justo en el medio ----
export const HSoftStiff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="tile"
  cam={{ at: [0, 0.2, 0], az: [-0.3, 0.1], el: [0.12, 0.1], r: [0.74, 0.64], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="SOFT ON GLASS" col={GRN} />
    <Tag tt={tt} at={0.8} x={360} y={260} txt="GLASS · HARDEST" col={ICE} size={36} anchor="l" />
    <Tag tt={tt} at={1.4} x={360} y={860} txt="BAKED CHEESE" col={AMB} size={36} anchor="l" />
    <Tag tt={tt} at={3.6} x={360} y={560} txt="FOIL · IN BETWEEN" col={GRN} size={40} anchor="l" /></>}>{(tt) => {
  const drop = eio(tt, 2.0, 3.6), y = lerp(0.42, 0.25, drop), arrow = eio(tt, 4.2, 5.2);
  return <>
    <RBox s={[0.05, 0.5, 0.02]} p={[0, 0.25, 0]} r={0.006}>{M.wood({ base: [205, 175, 120] })}</RBox>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[0.027, 0.03 + i * 0.044, 0.006]}><boxGeometry args={[0.02, 0.003, 0.003]} /><meshStandardMaterial color="#2a1e12" /></mesh>)}
    {/* vidrio arriba */}
    <RBox s={[0.16, 0.016, 0.1]} p={[0.12, 0.44, 0]} r={0.004}>{M.glass({ op: 0.55 })}</RBox>
    {/* queso horneado abajo */}
    <mesh position={[0.11, 0.04, 0]} scale={[1.6, 0.6, 1.2]}><sphereGeometry args={[0.035, 24, 16]} /><meshStandardMaterial color="#d68a2a" roughness={0.75} /></mesh>
    <FoilBall r={0.05} p={[0.08, y, 0]} rot={[0.4, tt, 0]} seed={4} />
    <group position={[-0.035, y, 0.012]}><mesh rotation={[0, 0, -PI / 2]}><coneGeometry args={[0.014, 0.04, 16]} />{M.glow({ col: GRN })}</mesh>
      <mesh position={[-0.03, 0, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.04, 8]} />{M.glow({ col: GRN })}</mesh></group>
    {false && arrow > 0 && <group position={[0.11, y - 0.05, 0]}><mesh scale={[1, arrow, 1]} position={[0, -0.04 * arrow, 0]}><cylinderGeometry args={[0.004, 0.004, 0.09, 8]} />{M.glow({ col: GRN })}</mesh>
      <mesh position={[0, -0.09 * arrow, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.012, 0.02, 12]} />{M.glow({ col: GRN })}</mesh></group>}
  </>;
}}</Scene3D>;

// ---- 3:31 · NUNCA EN TEFLÓN: el bollito frota en círculos la sartén negra y deja rayas plateadas que se van juntando; al final la cruz roja ----
export const HNonStick: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="none" wall="dark"
  cam={{ at: [0, 0.02, 0], az: [0.2, 0.05], el: [1.05, 0.95], r: [0.62, 0.52], fov: 30 }}
  over={(tt) => <><Head tt={tt} kick="" title="NEVER ON NON-STICK" col={RED} />
    <Tag tt={tt} at={4.6} x={1460} y={820} txt="SCRATCHED FOR GOOD" col={RED} size={40} /></>}>{(tt) => {
  const rub = cl((tt - 0.8) / 3.4), ang = tt * 7, rr = 0.06 + 0.03 * Math.sin(tt * 2.3), x = eio(tt, 4.4, 5.0);
  return <>
    <mesh position={[0, 0, 0]} receiveShadow><cylinderGeometry args={[0.17, 0.15, 0.02, 64]} /><meshPhysicalMaterial color="#17181a" roughness={0.35} clearcoat={0.6} /></mesh>
    <mesh position={[-0.3, 0.008, 0]} rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.014, 0.012, 0.28, 20]} /><meshPhysicalMaterial color="#0e0e0e" roughness={0.4} /></mesh>
    {Array.from({ length: 26 }, (_, i) => { const k = cl(rub * 26 - i); if (k <= 0) return null; const r0 = 0.03 + rn(i, 2) * 0.11, a0 = rn(i, 3) * 6.28;
      return <mesh key={i} position={[0, 0.0105, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[r0, r0 + 0.0028, 48, 1, a0, 1.2 * k]} /><meshStandardMaterial color="#9aa0a6" metalness={1} roughness={0.3} /></mesh>; })}
    {tt < 4.4 && <FoilBall r={0.03} p={[Math.cos(ang) * rr, 0.035, Math.sin(ang) * rr]} rot={[ang, ang * 0.5, 0]} seed={3} />}
    <pointLight position={[lerp(-0.4, 0.4, x), 0.05, 0.1]} color="#fff4e0" intensity={1.6 * x} distance={0.7} />
  </>;
}}</Scene3D>;

// ---- 3:47 · LA TAZA DE LOS BOLLITOS: una taza junto a la pileta; cada día cae un bollito nuevo y el día se enciende en la pizarrita ----
export const HCupSink: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="dark" lamp={[-0.2, 0.5, 0.4]}
  cam={{ at: [-0.06, 0.07, 0.03], az: [-0.35, -0.2], el: [0.36, 0.3], r: [0.5, 0.42], fov: 30 }}
  over={(tt) => { const d = Math.min(7, Math.max(0, Math.floor((tt - 0.8) / 0.55) + 1)), days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return <><Head tt={tt} kick="" title="MY SCRUBBER FOR THE WEEK" col={GRN} />
      <Tag tt={tt} at={0.8} x={1460} y={820} txt={d ? days[d - 1] : ""} col={GRN} size={50} /></>; }}>{(tt) => <>
    {/* borde de pileta enlozada */}
    <RBox s={[0.6, 0.04, 0.3]} p={[0.15, 0.02, -0.25]} r={0.03}>{M.porcelain({ col: "#4a5560" })}</RBox>
    <mesh position={[0.15, 0.041, -0.25]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.5, 0.2]} /><meshStandardMaterial color="#9fa6ac" roughness={0.3} metalness={0.4} /></mesh>
    <mesh position={[0.32, 0.12, -0.36]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.2, 16]} />{M.chrome({})}</mesh>
    <mesh position={[0.32, 0.22, -0.31]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.01, 0.01, 0.1, 16]} />{M.chrome({})}</mesh>
    {/* la taza de loza */}
    <mesh position={[0, 0.05, 0.02]} castShadow><cylinderGeometry args={[0.05, 0.042, 0.1, 48, 1, true]} />{M.porcelain({ col: "#2f5fa8", side: THREE.DoubleSide })}</mesh>
    <mesh position={[0, 0.001, 0.02]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.042, 48]} />{M.porcelain({ col: "#2f5fa8" })}</mesh>
    <mesh position={[0.055, 0.055, 0.02]} rotation={[0, 0, 0]}><torusGeometry args={[0.022, 0.006, 12, 24, PI * 1.2]} />{M.porcelain({ col: "#2f5fa8" })}</mesh>
    {Array.from({ length: 7 }, (_, i) => { const a = 0.8 + i * 0.55, k = phys(tt, a, 8, 0.4); if (k <= 0) return null;
      const rest = [Math.cos(i * 2.3) * 0.02, 0.02 + i * 0.013, 0.02 + Math.sin(i * 2.3) * 0.02];
      return <FoilBall key={i} r={0.026} seed={10 + i} p={[rest[0], rest[1] + (1 - cl(k)) * 0.35, rest[2]]} rot={[i, i * 2, 0]} />; })}
    {(() => { const sc = eio(tt, 1.0, 4.8), an = tt * 7; return <group position={[-0.16, 0, 0.06]}>
      <mesh position={[0, 0.08, -0.07]}><planeGeometry args={[0.16, 0.18]} /><meshStandardMaterial color="#14171c" roughness={0.9} /></mesh>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.045, 0.038, 0.12, 40, 1, true]} /><meshPhysicalMaterial color="#e8eef2" roughness={0.05} transmission={0.6} transparent opacity={0.5} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.0455, 0.0395, 0.05, 40, 1, true]} /><meshStandardMaterial color="#6b4a22" roughness={0.9} transparent opacity={0.85 * (1 - sc)} side={THREE.DoubleSide} /></mesh>
      {sc < 1 && <FoilBall r={0.032} seed={41} p={[Math.cos(an) * 0.012, 0.04 + 0.02 * Math.sin(tt * 3), Math.sin(an) * 0.012]} rot={[an, an * 0.4, 0]} />}
    </group>; })()}
  </>}</Scene3D>;
