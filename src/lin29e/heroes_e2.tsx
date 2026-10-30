// lin29e · componentes 13-24 (sitios de reservas)
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, eio, lerp, phys, rn, tubeG } from "./h3d";
import { Coin, PI, PriceTag, Sheet, fallY, pop, txt } from "./lkit3d";
import { Phone, StampTool, StampMark, Suitcase } from "./lkit_b";
import { Drums, Finger, Laptop } from "./heroes_e1";

// ---- 7:22 · "I'LL RISK IT": el escudo gigante PROTECT MY TRIP late; unos anteojos llegan y agrandan el link chiquito ----
export const HRiskIt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark"
  cam={{ at: [0.02, 0.11, 0], az: [-0.12, 0.08], el: [0.12, 0.1], r: [0.66, 0.6], fov: 30 }}>{(tt) => {
  const g = eio(tt, 2.0, 2.8), beat = 1 + 0.09 * Math.pow(Math.max(0, Math.sin(tt * 6)), 3) * (1 - g);
  return <>
    <group position={[-0.07, 0.12, 0]} scale={pop(tt, 0.1) * beat * (1 - 0.25 * g)}>
      <mesh rotation={[PI / 2, 0, 0]} scale={[1, 0.25, 1.15]}><cylinderGeometry args={[0.08, 0.06, 0.06, 6]} /><meshPhysicalMaterial color="#2f6fb0" roughness={0.2} clearcoat={1} /></mesh>
      <Sheet map={txt("rkbig2", ["PROTECT", "MY TRIP", "+$89"], { w: 256, h: 256, bg: "#2f6fb0", fg: "#ffffff", size: 42, lh: 64 })} w={0.11} h={0.11} p={[0, 0, 0.018]} />
    </group>
    <group position={[0.11, lerp(0.05, 0.09, g), 0.02]} scale={lerp(0.35, 1.25, g) * pop(tt, 0.5)}>
      <Sheet map={txt("rksm", ["I'll risk it"], { w: 320, h: 72, bg: "#22252b", fg: "#c8ccd4", size: 48 })} w={0.14} h={0.032} />
    </group>
    <group position={[lerp(0.42, 0.11, g), 0.155, 0.06]} rotation={[0.25, 0, 0]} scale={pop(tt, 1.8) * 1.35}>
      {[-0.032, 0.032].map((x) => <mesh key={x} position={[x, 0, 0]}><torusGeometry args={[0.026, 0.0035, 10, 32]} />{M.plastic({ col: "#1b1d22" })}</mesh>)}
      {[-0.032, 0.032].map((x) => <mesh key={"l" + x} position={[x, 0, 0]}><circleGeometry args={[0.026, 32]} />{M.glass({ op: 0.25 })}</mesh>)}
      <mesh position={[0, 0.004, 0]}><boxGeometry args={[0.014, 0.004, 0.004]} />{M.plastic({ col: "#1b1d22" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 7:52 · LA CASILLA YA TILDADA: el tilde aparece solo, el lápiz lo destilda y el total baja $89 ----
export const HPrecheck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" bg="#e7e0cf" warm={0.9}
  cam={{ at: [0.03, 0.03, 0.01], az: [-0.12, 0.08], el: [0.82, 0.76], r: [0.56, 0.52], fov: 30 }}>{(tt) => {
  const on = eio(tt, 0.6, 0.9) * (1 - eio(tt, 2.2, 2.5)), pen = eio(tt, 1.6, 2.2) * (1 - eio(tt, 2.6, 3.2));
  const v = Math.round(lerp(729, 640, eio(tt, 2.4, 3.2)));
  const rows = ["Room, 5 nights", "Travel protection", "Late checkout"];
  return <>
    <group scale={pop(tt, 0.1) * 1.1}>
      <RBox s={[0.24, 0.004, 0.17]} p={[0, 0.002, 0]} r={0.003}>{M.matte({ col: "#fdfbf4" })}</RBox>
      {rows.map((l, i) => <group key={l} position={[0, 0.0045, -0.05 + i * 0.045]}>
        <RBox s={[0.022, 0.003, 0.022]} p={[-0.09, 0, 0]} r={0.002}>{M.matte({ col: i === 1 ? "#ffffff" : "#e9edf2" })}</RBox>
        <Sheet map={txt("pc" + i, [l], { w: 400, h: 64, bg: "#fdfbf4", fg: i === 1 ? "#b8302a" : "#1d2f5a", size: 40, align: "left", pad: 8 })} w={0.16} h={0.026} p={[0.02, 0.0005, 0]} r={[-PI / 2, 0, 0]} />
      </group>)}
      <Sheet map={txt("pcck", ["✓"], { w: 64, h: 64, bg: "#ffffff", fg: "#2e8b57", size: 60 })} w={0.02} h={0.02} p={[-0.09, 0.0065, -0.005]} r={[-PI / 2, 0, 0]} s={Math.max(0.001, on)} />
      <mesh position={[-0.09, 0.0068, 0.0]} rotation={[-PI / 2, 0, 0]} scale={Math.max(0.001, 1 - on) * (tt > 2.4 ? 1 : 0.001)}><ringGeometry args={[0.014, 0.017, 32]} /><meshBasicMaterial color="#b8302a" /></mesh>
    </group>
    <group position={[-0.07 + 0.01 * Math.sin(tt * 14) * pen, 0.012 + 0.05 * (1 - pen), 0.02]} rotation={[0.6, 0, -0.5]} scale={pop(tt, 1.4)}>
      <mesh position={[0, 0.065, 0]}><cylinderGeometry args={[0.006, 0.006, 0.13, 12]} />{M.plastic({ col: "#e8b53a" })}</mesh>
      <mesh position={[0, -0.005, 0]} rotation={[PI, 0, 0]}><coneGeometry args={[0.006, 0.014, 12]} />{M.wood({})}</mesh>
    </group>
    <Drums id="pc" v={v} n={3} p={[0.11, 0.05, -0.12]} s={0.75 * pop(tt, 0.4)} fg={v < 700 ? "#7cff8a" : "#f2d23a"} />
  </>;
}}</Scene3D>;

// ---- 8:09 · LA LETRA CHICA MÉDICA: la carpeta del seguro se abre y un frasco de remedios rueda hasta "PRE-EXISTING" ----
export const HMedFolder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="wood" wall="wood"
  cam={{ at: [0.03, 0.01, 0.02], az: [-0.12, 0.06], el: [0.85, 0.8], r: [0.46, 0.42], fov: 30 }}>{(tt) => {
  const open = eio(tt, 0.5, 1.3), roll = eio(tt, 1.6, 2.6), hl = eio(tt, 2.8, 3.4);
  return <>
    <group scale={pop(tt, 0.1)}>
      <RBox s={[0.17, 0.004, 0.22]} p={[0.0, 0.002, 0]} r={0.004}>{M.matte({ col: "#2f6fb0" })}</RBox>
      <group position={[-0.085, 0.005, 0]} rotation={[0, 0, open * PI * 0.96]}>
        <RBox s={[0.17, 0.004, 0.22]} p={[0.085, 0, 0]} r={0.004}>{M.matte({ col: "#3d7cc0" })}</RBox>
      </group>
      <Sheet map={txt("mfp2", ["TRAVEL INSURANCE", "trip cancel", "medical abroad", "PRE-EXISTING", "CONDITIONS?"], { w: 320, h: 400, bg: "#fdfbf4", size: 36, lh: 66, cols: ["#1d2f5a", "#555", "#555", "#b8302a", "#b8302a"] })} w={0.15} h={0.19} p={[0, 0.006, 0]} r={[-PI / 2, 0, 0]} />
      <mesh position={[0, 0.0072, 0.05]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, hl), 1, 1]}><planeGeometry args={[0.14, 0.04]} /><meshBasicMaterial color="#ffe14a" transparent opacity={0.4} /></mesh>
    </group>
    <group position={[lerp(0.3, 0.135, roll), 0.022, -0.03]} rotation={[PI / 2, 0, roll * 5]} scale={pop(tt, 1.4)}>
      <mesh><cylinderGeometry args={[0.02, 0.02, 0.05, 24]} /><meshPhysicalMaterial color="#e8822a" transparent opacity={0.85} roughness={0.15} /></mesh>
      <mesh position={[0, 0.03, 0]}><cylinderGeometry args={[0.021, 0.021, 0.014, 24]} />{M.plastic({ col: "#f6f6f2" })}</mesh>
    </group>
  </>;
}}</Scene3D>;

// ---- 8:38 · EL CARRITO DE EXTRAS: asiento, valija, ticket flexible y estrella de prioridad caen al carrito y el total trepa ----
export const HExtrasCart: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="tile" wall="none" bg="#d9e2e8"
  cam={{ at: [0, 0.11, 0], az: [-0.24, 0.08], el: [0.22, 0.19], r: [0.7, 0.64], fov: 30 }}>{(tt) => {
  const n = [0.8, 1.4, 2.0, 2.6].filter((a) => tt > a).length, v = [129, 164, 199, 228, 247][n];
  const wire = (pts: number[][], k: string) => <mesh geometry={tubeG("ec" + k, pts, 0.003, 8, 6)}>{M.chrome({})}</mesh>;
  return <>
    <group position={[-0.04, 0, 0]} scale={pop(tt, 0.1) * 1.1}>
      {wire([[-0.1, 0.1, -0.062], [-0.15, 0.15, -0.062], [-0.15, 0.15, 0.062], [-0.1, 0.1, 0.062]], "h2")}
      {[-0.08, 0.08].map((x) => wire([[x, 0.05, 0], [x, 0.015, 0]], "l" + x))}
      {[[-0.07, -0.05], [0.07, -0.05], [-0.07, 0.05], [0.07, 0.05]].map(([x, z], i) => <mesh key={"lg" + i} position={[x, 0.03, z]}><boxGeometry args={[0.006, 0.04, 0.006]} />{M.chrome({})}</mesh>)}
      <RBox s={[0.18, 0.004, 0.12]} p={[0, 0.05, 0]} r={0.002}>{M.plastic({ col: "#2f6fb0" })}</RBox>
      {[[0, 0.075, -0.062, 0.2, 0.05, 0.004], [0, 0.075, 0.062, 0.2, 0.05, 0.004], [-0.1, 0.075, 0, 0.004, 0.05, 0.124], [0.1, 0.075, 0, 0.004, 0.05, 0.124]].map(([x, y, z, w, hh, d], i) => <RBox key={"pn" + i} s={[w, hh, d]} p={[x, y, z]} r={0.002}>{M.plastic({ col: "#2f6fb0" })}</RBox>)}
      {[[-0.07, -0.05], [0.07, -0.05], [-0.07, 0.05], [0.07, 0.05]].map(([x, z], i) => <mesh key={i} position={[x, 0.012, z]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />{M.rubber({ col: "#151515" })}</mesh>)}
      {[0, 1, 2, 3].map((i) => { const a = 0.8 + i * 0.6, y = 0.08 + fallY(tt, a, 0.3); return <group key={i} visible={tt > a} position={[-0.06 + i * 0.04, y + 0.03, (i % 2) * 0.03 - 0.015]} rotation={[0, rn(i) - 0.5, (rn(i, 2) - 0.5) * 0.4]} scale={1.4}>
        {i === 0 && <><RBox s={[0.04, 0.008, 0.04]} r={0.004}>{M.pvc({ col: "#1d2f5a" })}</RBox><RBox s={[0.04, 0.045, 0.008]} p={[0, 0.024, -0.018]} r={0.004}>{M.pvc({ col: "#1d2f5a" })}</RBox></>}
        {i === 1 && <Suitcase col="#b8302a" s={0.28} p={[0, -0.03, 0]} />}
        {i === 2 && <group rotation={[-PI / 2, 0, 0]}><RBox s={[0.07, 0.04, 0.004]} r={0.004}>{M.pvc({ col: "#f2d23a" })}</RBox><Sheet map={txt("ecins", ["INSURANCE"], { w: 256, h: 80, bg: "#f2d23a", fg: "#1d2f5a", size: 40 })} w={0.064} h={0.02} p={[0, 0, 0.003]} /></group>}
        {i === 3 && <group><mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.024, 0.024, 0.008, 32]} />{M.brass({})}</mesh><Sheet map={txt("ecpri", ["PRIORITY"], { w: 256, h: 80, bg: "#c9a24a", fg: "#1d2f5a", size: 38 })} w={0.04} h={0.0125} p={[0, 0, 0.0045]} /></group>}
      </group>; })}
    </group>
    <Drums id="ec" v={v} n={3} p={[0.17, 0.18, -0.03]} s={1.1 * pop(tt, 0.4)} fg={v > 200 ? "#ff8a78" : "#f2d23a"} />
  </>;
}}</Scene3D>;

// ---- 9:16 · UNA SOLA COMPAÑÍA: el teléfono atado a dos cajas enredadas vs. el teléfono con un cable derecho a la aerolínea ----
export const HOneCompany: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="counter" wall="tile"
  cam={{ at: [0.03, 0.1, 0], az: [-0.04, 0.04], el: [0.16, 0.13], r: [0.7, 0.66], fov: 30 }}>{(tt) => {
  const gone = eio(tt, 2.4, 3.2), wob = Math.sin(tt * 5) * 0.01;
  const Box = ({ id, l, col, p, s = 1 }: { id: string; l: string; col: string; p: number[]; s?: number }) => <group position={p as [number, number, number]} scale={s}>
    <RBox s={[0.1, 0.06, 0.05]} r={0.008}>{M.pvc({ col })}</RBox>
    <Sheet map={txt("oc2" + id, [l], { w: 256, h: 96, bg: col, fg: "#ffffff", size: 54 })} w={0.09} h={0.034} p={[0, 0, 0.026]} />
  </group>;
  const tang = Array.from({ length: 14 }, (_, i) => [lerp(-0.2, -0.06, i / 13) + Math.sin(i * 2.1) * 0.02, 0.09 + Math.cos(i * 1.7) * 0.03, Math.sin(i * 3.1) * 0.02]);
  return <>
    <group scale={pop(tt, 0.1)} position={[0, 0, -0.04 * gone]}>
      <Phone map={txt("ocp1", ["", "HELP?"], { w: 200, h: 400, bg: "#3a3d42", fg: "#ffffff", size: 50, lh: 80 })} p={[-0.22, 0.03, 0]} s={0.7} />
      <mesh geometry={tubeG("octg", tang, 0.0025, 80, 6)}>{M.rubber({ col: "#c8ccd4" })}</mesh>
      <Box id="w" l="WEBSITE" col="#7a5a8a" p={[-0.05, 0.13 + wob, 0]} s={1 - 0.5 * gone} />
      <Box id="a1" l="AIRLINE" col="#5a6b7d" p={[-0.05, 0.05 - wob, 0]} s={1 - 0.5 * gone} />
    </group>
    <group scale={pop(tt, 1.2)}>
      <Phone map={txt("ocp2", ["", "SOLVED"], { w: 200, h: 400, bg: "#2e8b57", fg: "#ffffff", size: 50, lh: 80 })} p={[0.08, 0.03, 0.03]} s={0.7} />
      <mesh geometry={tubeG("ocst", [[0.1, 0.09, 0.03], [0.13, 0.09, 0.03], [0.15, 0.09, 0.03]], 0.0035, 20, 6)}>{M.rubber({ col: "#7cff8a" })}</mesh>
      <Box id="a2" l="AIRLINE" col="#1d2f5a" p={[0.2, 0.09, 0.03]} s={1.3} />
    </group>
  </>;
}}</Scene3D>;

// ---- 10:02 · DÓLARES O EUROS: balanza de monedas; del lado del dólar cae escondida la moneda roja del recargo y la balanza se vence ----
export const HCurrencyScale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.1, 0.08], el: [0.14, 0.12], r: [0.7, 0.64], fov: 30 }}>{(tt) => {
  const drop = tt > 2.0, tilt = 0.18 * phys(tt, 2.2, 6, 0.3);
  const Pan = ({ x, sym, col, extra }: { x: number; sym: string; col: string; extra?: boolean }) => <group position={[x, -Math.sin(x > 0 ? -tilt : tilt) * Math.abs(x), 0]}>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.0015, 0.0015, 0.1, 6]} />{M.steel({})}</mesh>
    <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.06, 0.05, 0.008, 32]} />{M.brass({})}</mesh>
    {[0, 1, 2].map((i) => <Coin key={i} p={[0, 0.008 + i * 0.01, 0]} s={1.2} col={col} />)}
    <Sheet map={txt("cs" + sym, [sym], { w: 96, h: 96, bg: "#22252b", fg: col, size: 80 })} w={0.04} h={0.04} p={[0, 0.07, 0]} />
    {extra && <group position={[0, 0.038 + fallY(tt, 2.0, 0.2), 0]} visible={drop}><Coin s={1.2} col="#c9453a" /></group>}
  </group>;
  return <group scale={pop(tt, 0.1)}>
    <mesh position={[0, 0.1, -0.02]}><cylinderGeometry args={[0.006, 0.01, 0.2, 16]} />{M.steel({})}</mesh>
    <RBox s={[0.12, 0.01, 0.07]} p={[0, 0.005, -0.02]} r={0.004}>{M.wood({})}</RBox>
    <group position={[0, 0.2, 0]} rotation={[0, 0, tilt]}>
      <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.004, 0.004, 0.32, 12]} />{M.brass({})}</mesh>
    </group>
    <group position={[0, 0.1, 0]}>
      <Pan x={-0.16} sym="$" col="#2e8b57" extra />
      <Pan x={0.16} sym="€" col="#3d6a8a" />
    </group>
    <group position={[-0.16, 0.27, 0.02]} scale={pop(tt, 2.6) * 0.75}><PriceTag lines={["HIDDEN", "MARKUP"]} col="#b8302a" fg="#fff4e6" /></group>
  </group>;
}}</Scene3D>;

// ---- 10:23 · EL EMBUDO DE LA CONVERSIÓN: las monedas pasan por el embudo y salen menos; al costado se apilan los $50 que se quedó otro ----
export const HMarkupFunnel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="counter" wall="dark"
  cam={{ at: [0.03, 0.12, 0], az: [-0.16, 0.06], el: [0.12, 0.1], r: [0.62, 0.57], fov: 30 }}>{(tt) => {
  const kept = Math.min(5, Math.floor(eio(tt, 1.2, 3.4) * 5.99));
  return <>
    <group position={[-0.04, 0, 0]} scale={pop(tt, 0.1)}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.08, 0.012, 0.09, 40, 1, true]} /><meshPhysicalMaterial color="#c9ced3" metalness={0.8} roughness={0.25} side={2} /></mesh>
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.012, 0.012, 0.05, 16, 1, true]} />{M.steel({})}</mesh>
      {Array.from({ length: 12 }, (_, i) => { const a = 0.4 + i * 0.25, k = Math.max(0, Math.min(1, (tt - a) / 0.8)); const out = i % 2 === 0;
        return <group key={i} visible={tt > a && k < 0.99} position={[lerp((rn(i) - 0.5) * 0.1, out ? 0 : 0.11, k), lerp(0.32, out ? 0.0 : 0.06, k * k), 0]} rotation={[k * 4, 0, k * 3]}><Coin s={1.3} /></group>; })}
      {Array.from({ length: kept }, (_, i) => <Coin key={"k" + i} p={[0.0, 0.008 + i * 0.013, 0.0]} s={1.35} />)}
    </group>
    <group position={[0.14, 0, 0.02]}>
      {Array.from({ length: kept }, (_, i) => <Coin key={"r" + i} p={[0, 0.008 + i * 0.013, 0]} s={1.45} col="#c9453a" />)}
      <group position={[0, 0.11, 0]} scale={pop(tt, 3.0) * 0.8}><PriceTag lines={["+$50", "LOST"]} col="#b8302a" fg="#fff4e6" /></group>
    </group>
  </>;
}}</Scene3D>;

// ---- 10:40 · LA TARJETA SIN RECARGO: la tarjeta con el globo pasa bajo el sello y queda estampada "0% FOREIGN FEE" ----
export const HNoFeeCard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="wood"
  cam={{ at: [0, 0.05, 0.01], az: [-0.16, 0.08], el: [0.5, 0.44], r: [0.5, 0.46], fov: 30 }}>{(tt) => {
  const slide = eio(tt, 0.3, 1.2), st = Math.max(0, Math.sin(Math.min(1, Math.max(0, (tt - 1.6) / 0.6)) * PI)), mark = tt > 1.9;
  return <>
    <group position={[lerp(-0.3, 0, slide), 0.004, 0.02]} scale={1.6}>
      <RBox s={[0.086, 0.003, 0.054]} r={0.004}><meshPhysicalMaterial color="#1d2f5a" roughness={0.3} clearcoat={0.8} /></RBox>
      <mesh position={[-0.025, 0.0018, 0.006]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.012, 24]} /><meshStandardMaterial color="#3d8ac0" /></mesh>
      <mesh position={[0.025, 0.0018, -0.012]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.014, 0.011]} />{M.brass({})}</mesh>
      <group visible={mark} position={[0.01, 0.002, 0.008]} scale={0.55}><StampMark id="nff" lines={["0%", "FOREIGN", "FEE"]} col="#2e8b57" /></group>
    </group>
    <StampTool p={[0.01, 0.02 + 0.13 * (1 - st), 0.03]} s={1.3 * pop(tt, 0.6)} col="#2e8b57" />
  </>;
}}</Scene3D>;

// ---- 11:10 · EL DEL MEDIO: tu pedido "GROUND FLOOR" viaja al sitio web y se cae antes de llegar al hotel ----
export const HMiddleman: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="tile" wall="none" bg="#d6dfe6"
  cam={{ at: [0.01, 0.1, 0], az: [-0.08, 0.06], el: [0.2, 0.17], r: [0.72, 0.66], fov: 30 }}>{(tt) => {
  const a = eio(tt, 0.8, 1.6), b = eio(tt, 1.9, 2.5), fall = eio(tt, 2.5, 3.1);
  const nx = tt < 1.9 ? lerp(-0.22, 0, a) : lerp(0, 0.1, b), ny = 0.2 + Math.sin(a * PI) * 0.04 + Math.sin(b * PI) * 0.02 - 0.19 * fall * fall + (fall >= 1 ? 0.025 * (1 - phys(tt, 3.1, 14, 0.25)) : 0);
  return <>
    <Phone map={txt("mmyou", ["", "YOU"], { w: 200, h: 400, bg: "#2f6fb0", fg: "#ffffff", size: 60, lh: 80 })} p={[-0.25, 0.02, 0]} s={0.95 * pop(tt, 0.1)} />
    <Laptop p={[0, 0, 0]} s={0.95 * pop(tt, 0.3)} map={txt("mmweb", ["BOOKING", "WEBSITE"], { w: 384, h: 240, bg: "#7a5a8a", fg: "#ffffff", size: 54, lh: 74 })} />
    <group position={[0.26, 0, 0]} scale={pop(tt, 0.5) * 1.2}>
      <RBox s={[0.12, 0.18, 0.08]} p={[0, 0.09, 0]} r={0.006}>{M.pvc({ col: "#e8dcc0" })}</RBox>
      {[0, 1, 2].map((r) => [-0.03, 0.03].map((x) => <mesh key={r + "" + x} position={[x, 0.04 + r * 0.05, 0.041]}><planeGeometry args={[0.024, 0.03]} />{M.glass({ col: "#9fc4dc", op: 0.9 })}</mesh>))}
      <Sheet map={txt("mmhot", ["HOTEL"], { w: 256, h: 64, bg: "#1d2f5a", fg: "#ffffff", size: 48 })} w={0.1} h={0.025} p={[0, 0.195, 0.0]} />
    </group>
    <group position={[nx, Math.max(0.006, ny), 0.05]} rotation={[fall * 1.4, 0, fall * 0.8]} scale={pop(tt, 0.6)}>
      <Sheet map={txt("mmnote2", ["GROUND", "FLOOR"], { w: 240, h: 180, bg: "#f2d23a", fg: "#1d2f5a", size: 46, lh: 64 })} w={0.1} h={0.075} />
    </group>
  </>;
}}</Scene3D>;

// ---- 11:27 · NO HAY ASCENSOR: el edificio de tres pisos se enciende arriba; el hueco del ascensor está vacío y la valija se queda abajo ----
export const HLiftButton: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="dark" wall="none" bg="#c9d3dc"
  cam={{ at: [0, 0.15, 0], az: [-0.24, -0.1], el: [0.12, 0.1], r: [0.8, 0.74], fov: 30 }}>{(tt) => {
  const lit = eio(tt, 1.0, 1.4), press = Math.max(0, Math.sin(Math.min(1, Math.max(0, (tt - 1.8) / 0.4)) * PI)), x = eio(tt, 2.4, 2.9);
  return <>
    <group scale={pop(tt, 0.1)}>
      {[0, 1, 2].map((f) => <group key={f} position={[0, 0.05 + f * 0.1, 0]}>
        <RBox s={[0.26, 0.095, 0.12]} r={0.006}>{M.pvc({ col: "#e8dcc0" })}</RBox>
        {[-0.08, 0, 0.08].map((wx) => <mesh key={wx} position={[wx, 0.005, 0.061]}><planeGeometry args={[0.04, 0.05]} /><meshStandardMaterial color={f === 2 && wx === 0 ? "#ffd27a" : "#5f7f99"} emissive={f === 2 && wx === 0 ? "#ffb84a" : "#000000"} emissiveIntensity={f === 2 && wx === 0 ? 1.4 * lit : 0} /></mesh>)}
      </group>)}
      <RBox s={[0.06, 0.3, 0.06]} p={[0.17, 0.15, 0]} r={0.004}>{M.glass({ col: "#dbe8f2", op: 0.35 })}</RBox>
      <group position={[0.17, 0.15, 0.04]} scale={Math.max(0.001, x)}>
        <mesh rotation={[0, 0, PI / 4]}><boxGeometry args={[0.1, 0.012, 0.006]} /><meshStandardMaterial color="#c9302a" /></mesh>
        <mesh rotation={[0, 0, -PI / 4]}><boxGeometry args={[0.1, 0.012, 0.006]} /><meshStandardMaterial color="#c9302a" /></mesh>
      </group>
      <RBox s={[0.02, 0.03, 0.006]} p={[0.17, 0.05, 0.035]} r={0.003}>{M.steel({})}</RBox>
      <mesh position={[0.17, 0.05, 0.039 - 0.002 * press]}><cylinderGeometry args={[0.005, 0.005, 0.004, 16]} /><meshStandardMaterial color="#f2d23a" emissive="#f2d23a" emissiveIntensity={press} /></mesh>
    </group>
    <Suitcase col="#1d2f5a" s={0.4 * pop(tt, 0.5)} p={[-0.2, 0, 0.06]} r={[0, 0.4, 0]} />
    <group position={[-0.2, 0.15, 0.06]} scale={pop(tt, 2.9) * 0.75}><PriceTag lines={["3RD FLOOR", "NO ELEVATOR"]} col="#b8302a" fg="#fff4e6" /></group>
  </>;
}}</Scene3D>;

// ---- 12:18 · TRES DÍAS ANTES: una tira de días avanza hacia el avión; en el día -3 suena el teléfono y se tilda CONFIRMED ----
export const HCall3Days: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="wood"
  cam={{ at: [0, 0.1, 0], az: [-0.12, 0.08], el: [0.18, 0.15], r: [0.74, 0.68], fov: 30 }}>{(tt) => {
  const hop = eio(tt, 0.6, 1.8), ring = tt > 1.9 && tt < 2.8 ? Math.sin(tt * 45) * 0.05 : 0, ok = pop(tt, 2.9);
  const D = ["-6", "-5", "-4", "-3", "-2", "-1", "✈"];
  return <>
    {D.map((d, i) => <group key={i} position={[-0.27 + i * 0.09, 0.03, 0]} scale={pop(tt, 0.1 + i * 0.06)}>
      <RBox s={[0.08, 0.06, 0.08]} p={[0, 0, 0]} r={0.008}>{M.pvc({ col: i === 3 ? "#f2d23a" : i === 6 ? "#2f6fb0" : "#f6f1e4" })}</RBox>
      <Sheet map={txt("c3" + i, [d], { w: 128, h: 96, bg: i === 3 ? "#f2d23a" : i === 6 ? "#2f6fb0" : "#f6f1e4", fg: i === 6 ? "#ffffff" : "#1d2f5a", size: 72 })} w={0.07} h={0.052} p={[0, 0, 0.041]} />
    </group>)}
    <mesh position={[lerp(-0.27, 0.0, hop), 0.075 + Math.abs(Math.sin(hop * 3 * PI)) * 0.04, 0]}><sphereGeometry args={[0.015, 20, 16]} /><meshPhysicalMaterial color="#c9302a" roughness={0.2} clearcoat={1} /></mesh>
    <Phone map={txt("c3ph", ["", "HOTEL", "CALL"], { w: 200, h: 400, bg: "#1d2f5a", fg: "#ffffff", size: 50, lh: 80 })} p={[0.0, 0.1, -0.06]} r={[0, 0, ring]} s={0.7 * pop(tt, 1.7)} />
    <group position={[0.0, 0.25, -0.05]} scale={ok * 0.8}><PriceTag lines={["CONFIRMED", "GROUND FLOOR ✓"]} col="#2e8b57" fg="#ffffff" /></group>
  </>;
}}</Scene3D>;

// ---- 12:49 · EL AVISO DISFRAZADO: el primer resultado "AD" se cae y detrás asoma un antifaz; el resultado real se tilda verde ----
export const HMaskedAd: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="dark"
  cam={{ at: [0, 0.14, 0], az: [-0.14, 0.08], el: [0.1, 0.08], r: [0.62, 0.56], fov: 30 }}>{(tt) => {
  const tip = eio(tt, 1.8, 2.5), mask = pop(tt, 2.3), ok = pop(tt, 3.1);
  const R = [["AD · Airline Help 24/7", "#7a2a2a"], ["Airline site · Contact", "#1d2f5a"], ["Your confirmation email", "#2e6b4a"]];
  return <>
    {R.map(([l, c], i) => <group key={i} position={[0, 0.22 - i * 0.07, i === 0 ? 0.02 : 0]} rotation={[i === 0 ? tip * 1.4 : 0, 0, i === 0 ? tip * 0.3 : 0]} scale={pop(tt, 0.1 + i * 0.2) * (i === 0 ? Math.max(0.001, 1 - eio(tt, 2.3, 2.8)) : 1)}>
      <group position={[0, i === 0 ? -0.06 * tip : 0, i === 0 ? 0.06 * tip : 0]}>
        <RBox s={[0.3, 0.055, 0.01]} r={0.008}><meshPhysicalMaterial color={c} roughness={0.35} clearcoat={0.5} /></RBox>
        <Sheet map={txt("ma" + i, [l], { w: 640, h: 112, bg: c, fg: "#ffffff", size: 46 })} w={0.28} h={0.049} p={[0, 0, 0.0055]} />
      </group>
    </group>)}
    <group position={[0, 0.25, 0.02]} scale={mask * 1.5}>
      {[-0.035, 0.035].map((x) => <mesh key={x} position={[x, 0, 0]} scale={[1, 0.6, 0.4]}><sphereGeometry args={[0.035, 24, 16]} /><meshPhysicalMaterial color="#1b1b1f" roughness={0.2} clearcoat={1} /></mesh>)}
      {[-0.035, 0.035].map((x) => <mesh key={"e" + x} position={[x, 0, 0.015]} scale={[1, 0.6, 1]}><circleGeometry args={[0.012, 20]} /><meshBasicMaterial color="#ffffff" /></mesh>)}
    </group>
    <group position={[0.19, 0.08, 0.03]} scale={ok * 1.6}>
      <mesh><sphereGeometry args={[0.025, 24, 16]} /><meshPhysicalMaterial color="#2e8b57" roughness={0.2} clearcoat={1} /></mesh>
      <Sheet map={txt("maok", ["✓"], { w: 96, h: 96, bg: "#2e8b57", fg: "#ffffff", size: 84 })} w={0.03} h={0.03} p={[0, 0, 0.026]} />
    </group>
  </>;
}}</Scene3D>;
