// plo29d · DESTAPAR EL LAVAMANOS CON UNA TAZA · componentes únicos 3D (ninguno repite mecanismo de plo29a/b/c ni entre sí).
// Cada uno: OBJETO reconocible sin leer, llegada de a uno con peso (fall/phys), el momento wow en la palabra clave, a lo sumo un rótulo DENTRO de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, MZ, phys, RED, Stage, Tag, TX, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, Vapor } from "./estudio3d";
import { Chorro, Mano } from "./kit3d";
import { AGUA, Botella, Copa, Cubeta, GOMA, Gota, Granos, Guante, PVC, Rejilla, Taza, Tetera, Tubo, tuboGeo } from "./kitplo";
import { LOZA } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const ON = (h: H, tt: number, i: number, step = 1.1, a0 = 0.6) => IN(tt, rel(h, i) > 90 ? a0 + i * step : rel(h, i));
const PELO = "#2a2018", NATA = "#bdb8aa", CAL = "#efe9d8";
const pelo = (k: string, n: number, r = 0.003) => memo(k, () => Array.from({ length: n }, (_, i) => tuboGeo(Array.from({ length: 7 }, (_, j) =>
  [Math.sin(i * 1.7 + j * 0.9) * 0.05, -j * 0.035, Math.cos(i * 2.3 + j * 0.7) * 0.05] as V3), r, 24)));
// LAVAMANOS de loza (tazón torneado) con desagüe cromado y el agujerito del rebosadero en la pared de adentro
const Lavabo: React.FC<{ p?: V3; s?: number; agua?: number; ac?: string; reb?: number; children?: React.ReactNode }> = ({ p, s = 1, agua = 0, ac = "#a9cfe0", reb = 0, children }) => {
  const g = memo("lavabo", () => lathe([[0.03, 0], [0.18, 0.01], [0.3, 0.07], [0.38, 0.17], [0.42, 0.24], [0.47, 0.25], [0.47, 0.22]], 56));
  return <group position={p} scale={s}>
    <mesh geometry={g} castShadow receiveShadow>{LOZA()}</mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.022, 0.04, 32]} />{M.cromo()}</mesh>
    <mesh position={[0, 0.001, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.022, 24]} /><meshBasicMaterial color="#070707" /></mesh>
    <group position={[0, 0.19, -0.395]} rotation={[-0.75, 0, 0]}>
      <mesh><circleGeometry args={[0.022, 24]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
      <mesh position={[0, 0, 0.001]} visible={reb > 0.01}><ringGeometry args={[0.024, 0.024 + 0.02 * reb, 32]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} transparent opacity={reb} /></mesh>
    </group>
    {agua > 0.01 && <mesh position={[0, 0.005 + 0.2 * agua, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.16 + 0.24 * agua, 48]} />{AGUA(0.8, ac)}</mesh>}
    {children}
  </group>;
};
// tapón automático: cabeza cromada + pata con agujerito
const Tapon: React.FC<{ p?: V3; rot?: V3; s?: number; children?: React.ReactNode }> = ({ p, rot, s = 1, children }) => <group position={p} rotation={rot} scale={s}>
  <mesh position={[0, 0.0, 0]}><cylinderGeometry args={[0.04, 0.036, 0.012, 32]} />{M.cromo()}</mesh>
  <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.006, 0.006, 0.12, 10]} />{M.cromo()}</mesh>
  <mesh position={[0, -0.11, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.012, 0.004, 8, 20]} />{M.cromo()}</mesh>
  {children}
</group>;
// sifón botella: vaso cilíndrico con tapa de abajo a rosca
const SBotella: React.FC<{ p?: V3; s?: number; vaso?: number; o?: number; children?: React.ReactNode }> = ({ p, s = 1, vaso = 0, o = 1 }) => <group position={p} scale={s}>
  <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.028, 0.028, 0.3, 20]} />{PVC(o)}</mesh>
  <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.07, 0.07, 0.18, 32]} />{PVC(o)}</mesh>
  <mesh position={[0.15, 0.06, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.025, 0.025, 0.2, 16]} />{PVC(o)}</mesh>
  <group position={[0, -0.1 - 0.35 * vaso, 0]} rotation={[0, -vaso * 6, 0]}><mesh><cylinderGeometry args={[0.072, 0.065, 0.1, 32]} />{PVC(o, "#e6e9ec")}</mesh></group>
</group>;

// 1 · LA ESPUMA QUE NO SE VA: la espuma de la pasta queda flotando en agua gris; por fin baja con un GLUGLÚ: una burbuja grande sube del agujero
const DEspuma: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const baja = eio(tt, 3.0, 5.6), bur = cl((tt - 2.4) / 0.9);
  return <Estudio t={tt} cam={[0, 1.05, 0.95]} look={[0, 0.08, 0]} orbit={0.05}>
    <Lavabo agua={0.6 * (1 - baja)} ac="#8e9690" />
    {Array.from({ length: 9 }, (_, i) => { const a = i * 0.7 + tt * 0.15 * (1 + baja * 3), r = 0.05 + 0.07 * rn(i, 1);
      return <mesh key={i} position={[Math.cos(a) * r * (1 - baja), 0.13 * (1 - baja) + 0.012, Math.sin(a) * r * (1 - baja)]} scale={[0.03 + 0.02 * rn(i, 2), 0.012, 0.03]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f4f6f3" roughness={0.6} /></mesh>; })}
    <mesh position={[0, 0.02 + 0.12 * bur, 0]} scale={0.045 * Math.sin(bur * P) + 0.001} visible={bur > 0 && bur < 1}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#cfd6d0" roughness={0} transparent opacity={0.45} clearcoat={1} /></mesh>
    <Tag tt={tt} at={2.8} x={1250} y={330} txt="GLUGLÚ" col={MZ} size={56} />
  </Estudio>;
}}</Stage>;

// 2 · UNA TAZA DE ALGO DE LA COCINA: la taza baja sola a primer plano; el polvo blanco cae adentro y la llena de a poco
const DTaza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ll = eio(tt, 1.0, 3.6);
  return <Estudio t={tt} cam={[0.1, 0.55, 1.0]} look={[0, 0.15, 0]} orbit={0.1}>
    <Taza p={[0, 0.0 + fall(tt, 0.1, 1.1), 0]} s={1.4} lleno={ll} c="#f8f8f4" cuerpo="#d6362c" />
    {tt > 0.9 && tt < 3.8 && <Granos n={30} c="#f8f8f4" area={[0.02, 0.02]} y={0.15 + ((tt * 0.6) % 0.4)} s={0.6} />}
  </Estudio>;
}}</Stage>;

// 3 · EL AGUJERITO QUE NADIE TAPA: el lavamanos y, en su pared, el rebosadero se enciende como un ojo
const DAgujero: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const r = eio(tt, 1.2, 2.0) * (0.75 + 0.25 * Math.sin(tt * 4));
  return <Estudio t={tt} cam={[0, 0.65, 0.7]} look={[0, 0.17, -0.3]} orbit={0.04}>
    <Lavabo reb={r} />
    <pointLight position={[0, 0.2, -0.33]} intensity={0.01 + 1.2 * r} distance={0.5} color="#ffd36a" />
  </Estudio>;
}}</Stage>;

// 4 · NO SE TAPA COMO EL FREGADERO: a la izquierda la tarja con gotas de grasa; a la derecha el lavamanos con pelo y jabón
const DDistinto: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const a = IN(tt, 0.5), b = IN(tt, 1.6), hp = pelo("dist", 10);
  return <>
    <Estudio t={tt} cam={[0, 1.1, 1.9]} look={[0, 0.1, 0]} orbit={0.04}>
      <group position={[-0.55, 0.0, 0]} scale={Math.max(0.001, Math.min(1, a))}>
        <RBox s={[0.7, 0.03, 0.5]} r={0.02}>{M.cromo("#c9ced3")}</RBox>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.4, 0.02, (rn(i, 2) - 0.5) * 0.3]} scale={[0.03, 0.01, 0.03]}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.05} clearcoat={1} /></mesh>)}
      </group>
      <group position={[0.55, 0, 0]} scale={Math.max(0.001, Math.min(1, b)) * 0.85}>
        <Lavabo />
        <group position={[0.02, 0.05, 0.02]} scale={0.8}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[P2, 0, i]}><meshStandardMaterial color={PELO} roughness={0.8} /></mesh>)}</group>
        {[0, 1, 2].map((i) => <mesh key={i} position={[-0.04 + i * 0.04, 0.02, 0.03]} scale={[0.02, 0.01, 0.02]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={NATA} roughness={0.7} /></mesh>)}
      </group>
    </Estudio>
    <Tag tt={tt} at={1.0} x={560} y={860} txt="GRASA" col={MZ} size={44} />
    <Tag tt={tt} at={2.1} x={1360} y={860} txt="PELO + JABÓN" col={TX} size={44} />
  </>;
}}</Stage>;

// 5 · JABÓN CON PELOS: los pelos llegan en espiral, las gotas grises de jabón los pegan, y se arma la "rata mojada"
const DRata: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 3.8), hp = pelo("rata", 16, 0.004);
  return <Estudio t={tt} cam={[0, 0.5, 1.1]} look={[0, 0.2, 0]} orbit={0.12}>
    {hp.map((g, i) => { const a = i * 0.4 + (1 - k) * 4, r = 0.5 * (1 - k) + 0.02;
      return <mesh key={i} geometry={g} position={[Math.cos(a) * r, 0.32 + 0.3 * (1 - k) * Math.sin(i), Math.sin(a) * r]} rotation={[i, i * 0.5, k * 2]}><meshStandardMaterial color={PELO} roughness={0.8} /></mesh>; })}
    {Array.from({ length: 10 }, (_, i) => { const kk = cl(k * 1.3 - i * 0.03), a = i * 2.4;
      return <mesh key={"j" + i} position={[Math.cos(a) * lerp(0.6, 0.05, kk), 0.2 + 0.06 * Math.sin(i * 3), Math.sin(a) * lerp(0.6, 0.05, kk)]} scale={0.025 + 0.012 * rn(i, 1)}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={NATA} roughness={0.5} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 6 · LA NATA DE JABÓN: la barra se gasta bajo el agua dura, caen copitos de cal, y en la pared del caño (en corte) crece una película gris
const DNata: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const g = eio(tt, 0.8, 4.2);
  return <Estudio t={tt} cam={[0, 0.75, 1.5]} look={[0, 0.3, 0]} orbit={0.05}>
    <group position={[-0.45, 0.55, 0]} scale={[1 - 0.4 * g, 1 - 0.4 * g, 1 - 0.4 * g]}><RBox s={[0.22, 0.08, 0.13]} r={0.03}><meshPhysicalMaterial color="#f2e9d2" roughness={0.35} clearcoat={0.4} /></RBox></group>
    <Chorro a={[-0.45, 1.2, 0]} b={[-0.45, 0.6, 0]} r={0.02} c="#cfe6f2" o={0.7} />
    {Array.from({ length: 12 }, (_, i) => { const q = ((tt * 0.5 + rn(i, 1)) % 1);
      return <mesh key={i} position={[-0.45 + (rn(i, 2) - 0.5) * 0.15 + 0.5 * q, 0.5 - 0.3 * q, (rn(i, 3) - 0.5) * 0.1]} scale={0.01}><boxGeometry args={[1, 0.4, 1]} /><meshStandardMaterial color={CAL} /></mesh>; })}
    <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.16, 0.16, 1.0, 40, 1, true, 0, P]} />{PVC(1)}</mesh>
    <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, P2]} scale={[1 - 0.12 * g, 1, 1 - 0.12 * g]}><cylinderGeometry args={[0.155, 0.155, 0.98, 40, 1, true, 0, P]} /><meshStandardMaterial color={NATA} roughness={0.9} transparent opacity={0.95 * g} side={THREE.DoubleSide} /></mesh>
  </Estudio>;
}}</Stage>;

// 7 · EL PELO ATRAPA JABÓN Y EL JABÓN ATRAPA PELO: capas que se suman por fuera, oscura y clara, como cebolla
const DCebolla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const n = cl((tt - 0.5) / 4.0) * 7;
  return <Estudio t={tt} cam={[0, 0.45, 0.9]} look={[0, 0.2, 0]} orbit={0.1}>
    {Array.from({ length: 7 }, (_, i) => { const k = cl(n - i);
      return <mesh key={i} position={[0, 0.2, 0]} scale={(0.04 + i * 0.02) * (0.6 + 0.4 * k)} visible={k > 0.01}><sphereGeometry args={[1, 32, 24, 0, P * 1.4]} /><meshStandardMaterial color={i % 2 ? NATA : PELO} roughness={0.8} side={THREE.DoubleSide} transparent opacity={k} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 8 · LAS TRES COSAS DE ABAJO: el tubo con su varilla, el sifón, el caño a la pared — cada una se enciende cuando se nombra
const DTres: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const o = (i: number) => Math.min(1, ON(h, tt, i, 1.4));
  const glow = (k: number, c = "#ffd36a") => <meshStandardMaterial color={col("#eef1f3", c, k)} emissive={c} emissiveIntensity={0.7 * k} roughness={0.3} />;
  return <Estudio t={tt} cam={[0.3, 0.6, 1.6]} look={[0.15, 0.45, 0]} orbit={0.05} mesa={false}>
    <Lavabo p={[0, 0.85, 0]} s={0.9} />
    <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.025, 0.025, 0.42, 16]} />{glow(o(0))}</mesh>
    <mesh position={[-0.12, 0.66, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />{glow(o(0), "#ff9a50")}</mesh>
    <group position={[0, 0.1, 0]}><Tubo pts={[[0, 0.32, 0], [0, 0.1, 0], [0.05, 0.0, 0], [0.15, 0.02, 0], [0.2, 0.12, 0], [0.24, 0.2, 0]]} r={0.03}>{glow(o(1))}</Tubo></group>
    <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.75, 16]} />{glow(o(2))}</mesh>
    <mesh position={[1.0, 0.5, -0.05]}><boxGeometry args={[0.06, 1.3, 0.8]} /><meshStandardMaterial color="#d9d3c6" roughness={0.9} /></mesh>
  </Estudio>;
}}</Stage>;

// 9 · LA VARILLA DEL TAPÓN: tirás la palanquita de atrás de la canilla, la varilla bascula y el tapón sube
const DVarilla: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const k = eio(tt, 1.0, 1.8) * (1 - eio(tt, 3.4, 4.2));
  return <Estudio t={tt} cam={[0.6, 0.55, 1.2]} look={[0, 0.35, 0]} orbit={0.05} mesa={false}>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.03, 0.03, 0.4, 20, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    <Tapon p={[0, 0.56 + 0.06 * k, 0]} s={1.2} />
    <mesh position={[0, 0.66, -0.18]}><cylinderGeometry args={[0.008, 0.008, 0.2 + 0.08 * k, 10]} />{M.cromo()}</mesh>
    <group position={[0.0, 0.44, 0]} rotation={[0, 0, -0.25 * k]}><mesh position={[-0.14, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.3, 10]} />{M.cromo()}</mesh></group>
    <mesh position={[-0.28, 0.44 + 0.04 * k, -0.09]}><boxGeometry args={[0.012, 0.3, 0.02]} />{M.cromo("#b7bcc2")}</mesh>
    <mesh position={[0, 0.44, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.035, 0.008, 10, 24]} /><meshStandardMaterial color="#e8432e" /></mesh>
  </Estudio>;
}}</Stage>;

// 10 · EL SIFÓN BOTELLA: la curva en U se transforma en un vaso que se desenrosca por abajo
const DBotella: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const m = eio(tt, 1.4, 2.6);
  return <Estudio t={tt} cam={[0, 0.5, 1.3]} look={[0, 0.25, 0]} orbit={0.1}>
    <group position={[-0.08, 0.1, 0]} scale={[1 - m + 0.001, 1, 1]} visible={m < 0.99}><Tubo pts={[[0, 0.42, 0], [0, 0.1, 0], [0.05, 0.0, 0], [0.15, 0.02, 0], [0.2, 0.12, 0], [0.24, 0.2, 0], [0.5, 0.2, 0]]} r={0.03}>{PVC(1)}</Tubo></group>
    <group visible={m > 0.01} scale={Math.max(0.001, m)}><SBotella p={[0, 0.2, 0]} s={1.3} vaso={0.15 * eio(tt, 3.2, 4.4)} /></group>
  </Estudio>;
}}</Stage>;

// 11 · EL REBOSADERO POR DENTRO: el lavamanos en corte; el agua sube, toca el agujerito y se va por un canal escondido en la loza
const DCanalOculto: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const lv = eio(tt, 0.5, 2.6), ch = eio(tt, 2.6, 4.4);
  const cg = memo("canal", () => new THREE.CatmullRomCurve3([new THREE.Vector3(0.36, 0.2, 0), new THREE.Vector3(0.44, 0.15, 0), new THREE.Vector3(0.42, -0.05, 0), new THREE.Vector3(0.2, -0.12, 0), new THREE.Vector3(0.03, -0.12, 0)]));
  const pts = memo("canalP" + Math.round(ch * 20), () => cg.getSpacedPoints(30).slice(0, Math.max(2, Math.round(ch * 30))).map((v) => [v.x, v.y, v.z] as V3));
  return <Estudio t={tt} cam={[0, 0.25, 1.2]} look={[0, 0.08, 0]} orbit={0.03}>
    <mesh rotation={[0, 0, 0]}><latheGeometry args={[[[0.03, 0], [0.18, 0.01], [0.3, 0.07], [0.38, 0.17], [0.42, 0.24], [0.47, 0.25]].map(([a, b]) => new THREE.Vector2(a, b)), 48, 0, P]} />{LOZA()}</mesh>
    <Tubo pts={cg.getSpacedPoints(30).map((v) => [v.x, v.y, v.z] as V3)} r={0.022} o={0.35} />
    {ch > 0.05 && <Tubo pts={pts} r={0.016}>{AGUA(0.85, "#7fc4e6")}</Tubo>}
    <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.3, 16, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.01 + 0.19 * lv, 0.001]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.03 + 0.34 * lv, 0.03 + 0.3 * lv, 0.004, 48, 1, false, 0, P]} />{AGUA(0.7, "#7fc4e6")}</mesh>
  </Estudio>;
}}</Stage>;

// 12 · UNA TAZA, 200 GRAMOS: la caja de bicarbonato se inclina y el polvo arma una montañita perfecta en la taza
const DCaja: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const inc = eio(tt, 0.7, 1.5) * (1 - eio(tt, 3.6, 4.2)), m = eio(tt, 1.4, 3.6);
  return <>
    <Estudio t={tt} cam={[0.1, 0.6, 1.0]} look={[0, 0.2, 0]} orbit={0.06}>
      <group position={[0.25, 0.42, 0]} rotation={[0, 0, 1.6 * inc]}><RBox s={[0.16, 0.24, 0.08]} r={0.01}><meshStandardMaterial map={ctex("bicaja", 128, 192, (g) => { g.fillStyle = "#f1c232"; g.fillRect(0, 0, 128, 192); g.fillStyle = "#d6362c"; g.fillRect(0, 60, 128, 70); g.fillStyle = "#fff"; g.font = "900 36px Arial"; g.textAlign = "center"; g.fillText("BICA", 64, 108); })} /></RBox></group>
      {inc > 0.7 && <Chorro a={[0.14, 0.42, 0]} b={[0, 0.16, 0]} r={0.012} c="#fbfbf7" o={0.95} />}
      <Taza s={1.2} lleno={0.5} c="#fbfbf7" cuerpo="#2a4a6e" />
      <mesh position={[0, 0.13 + 0.04 * m, 0]} scale={[1, Math.max(0.001, m), 1]}><coneGeometry args={[0.085, 0.08, 32]} /><meshStandardMaterial color="#fbfbf7" roughness={1} /></mesh>
    </Estudio>
    <Tag tt={tt} at={3.4} x={1300} y={330} txt="200 g" col={MZ} size={60} />
  </>;
}}</Stage>;

// 13 · EL GRANITO QUE RASPA SUAVE: a escala de lupa, los granos ruedan con el agua por la pared y van limpiando las manchas grises
const DLupa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const fr = lerp(-1.1, 1.2, eio(tt, 0.6, 4.4));
  return <Estudio t={tt} cam={[0, 0.7, 1.3]} look={[0, 0.0, 0]} orbit={0.05} mesa={false}>
    <mesh rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[2.6, 1.2]} />{PVC(1)}</mesh>
    {Array.from({ length: 22 }, (_, i) => { const x = -1.1 + (i / 22) * 2.2, k = cl((fr - x) / 0.25);
      return <mesh key={i} position={[x, 0.004, (rn(i, 1) - 0.5) * 0.8]} rotation={[-P2, 0, 0]} scale={(0.05 + 0.05 * rn(i, 2)) * (1 - k) + 0.001}><circleGeometry args={[1, 18]} /><meshStandardMaterial color={NATA} roughness={0.9} /></mesh>; })}
    {Array.from({ length: 14 }, (_, i) => <mesh key={"g" + i} position={[fr - 0.15 * rn(i, 3), 0.03, (rn(i, 4) - 0.5) * 0.8]} rotation={[tt * 5 + i, tt * 3, 0]} scale={0.025}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#fbfbf7" roughness={0.6} flatShading /></mesh>)}
  </Estudio>;
}}</Stage>;

// 14 · NO LE HACE NADA A NINGÚN MATERIAL: cae la lluvia de bicarbonato sobre plástico, cromo, loza y goma, y cada uno sólo brilla, intacto
const DIntacto: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const X = [-0.9, -0.3, 0.3, 0.9];
  const ob = [<mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 0.3, 24]} />{PVC(1)}</mesh>, <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.3, 24]} />{M.cromo()}</mesh>,
    <mesh scale={[1, 0.5, 1]}><sphereGeometry args={[0.14, 24, 16, 0, 2 * P, 0, P2]} />{LOZA()}</mesh>, <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.08, 0.025, 12, 32]} />{GOMA()}</mesh>];
  return <Estudio t={tt} cam={[0, 0.7, 2.2]} look={[0, 0.15, 0]} orbit={0.04}>
    {X.map((x, i) => { const a = 0.4 + i * 0.5, on = IN(tt, a), sh = Math.exp(-Math.pow((tt - a - 2.6) * 3, 2));
      return <group key={i} position={[x, 0.1 + 0.4 * (1 - Math.min(1, on)), 0]}>
        {ob[i]}
        <pointLight position={[0, 0.25, 0.2]} intensity={0.01 + 1.6 * sh} distance={0.6} color="#fff6dc" />
        {tt > 1.2 && <Granos n={18} c="#fbfbf7" area={[0.12, 0.08]} y={0.1 + ((tt * 0.7 + i * 0.2) % 0.5)} s={0.5} />}
      </group>; })}
    <Tag tt={tt} at={3.2} x={960} y={880} txt="INTACTO" col={VER} size={48} />
  </Estudio>;
}}</Stage>;

// 15 · UNA TARDE (don Ernesto en el hotel viejo): el lavamanos antiguo de bronce con la caja y la pava; el sol cruza la ventana de la mañana a la tarde y el agua estancada baja en remolino
const DPasillo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 5.2), sx = lerp(-0.9, 0.9, k), cs = col("#fff3c8", "#ff9a50", k), lv = 1 - eio(tt, 2.0, 5.0);
  const g = memo("lavBronce", () => lathe([[0.03, 0], [0.16, 0.01], [0.28, 0.07], [0.34, 0.16], [0.38, 0.22], [0.42, 0.22], [0.42, 0.19]], 48));
  return <Estudio t={tt} cam={[0, 0.7, 1.3]} look={[0, 0.25, 0]} orbit={0.03} mesa={false}>
    <mesh position={[0, 0.7, -0.6]}><planeGeometry args={[2.4, 1.6]} /><meshStandardMaterial color={col("#d6c9a8", "#c98a5a", k * 0.6)} roughness={0.9} /></mesh>
    <mesh position={[sx * 0.4, 0.85 + 0.15 * Math.sin(k * P), -0.58]}><circleGeometry args={[0.07, 24]} /><meshBasicMaterial color={cs} toneMapped={false} /></mesh>
    <mesh position={[0, 0.85, -0.59]}><planeGeometry args={[0.7, 0.5]} /><meshBasicMaterial color={col("#bfd8ea", "#f2b27a", k)} transparent opacity={0.35} /></mesh>
    <directionalLight position={[sx * 2, 1.5, 1]} intensity={1.2} color={cs} />
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.6, 0.6, 0.1, 6]} />{M.madera("#6b4527")}</mesh>
    <mesh geometry={g}><meshStandardMaterial color="#b0803a" metalness={0.85} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.02 + 0.17 * lv, 0]} rotation={[-P2, 0, tt]} visible={lv > 0.02}><circleGeometry args={[0.15 + 0.2 * lv, 40]} />{AGUA(0.75, "#8e9690")}</mesh>
    <group position={[-0.5, 0.0, 0.15]}><RBox s={[0.12, 0.18, 0.06]} r={0.01}><meshStandardMaterial color="#f1c232" /></RBox></group>
    <group position={[0.55, 0.0, 0.1]}><Tetera s={0.6} /></group>
  </Estudio>;
}}</Stage>;

// 16 · LA ESPUMA NO ES LO QUE DESTAPA: el vinagre hace espuma (un minuto) y se apaga; arriba pasa la luna; en el caño la costra de cal se va de a poco
const DNoche: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const esp = eio(tt, 0.5, 1.2) * (1 - eio(tt, 1.8, 2.6)), noche = eio(tt, 2.2, 5.6), cal = 1 - eio(tt, 2.6, 5.6);
  return <Estudio t={tt} cam={[0, 0.7, 1.6]} look={[0, 0.3, 0]} orbit={0.04} mesa={false}>
    <mesh position={[Math.cos(P - noche * P) * 1.1, 0.6 + Math.sin(P - noche * P) * 0.7, -1.0]} visible={noche > 0.02 && noche < 0.98}><sphereGeometry args={[0.08, 24, 16]} /><meshBasicMaterial color="#f4f1de" toneMapped={false} /></mesh>
    <mesh position={[0, 0.3, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.16, 0.16, 1.4, 40, 1, true, 0, P]} />{PVC(1)}</mesh>
    <mesh position={[0, 0.3, 0]} rotation={[0, 0, P2]} scale={[1 - 0.15 * cal, 1, 1 - 0.15 * cal]} visible={cal > 0.02}><cylinderGeometry args={[0.155, 0.155, 1.38, 40, 1, true, 0, P]} /><meshStandardMaterial color={CAL} roughness={1} transparent opacity={cal} side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 24 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.6, 0.48 + 0.1 * rn(i, 2) * esp, (rn(i, 3) - 0.5) * 0.12]} scale={(0.03 + 0.03 * rn(i, 4)) * esp + 0.001}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#fbfbf7" roughness={0.4} /></mesh>)}
    <Tag tt={tt} at={3.0} x={960} y={200} txt="TODA LA NOCHE" col={MZ} size={46} />
  </Estudio>;
}}</Stage>;

// 17 · LA CARRERA DE LOS DOS VINAGRES: dos vasos con una costra de sarro cada uno; el de cocina la come despacio, el de limpieza burbujea y la deshace rápido… y aparece el guante a su lado
const DVinagres: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ll = eio(tt, 0.4, 1.2), a = eio(tt, 1.2, 5.6), b = eio(tt, 1.2, 3.0), gu = IN(tt, 3.2);
  return <Estudio t={tt} cam={[0, 0.45, 1.2]} look={[0, 0.18, 0]} orbit={0.05}>
    {[[-0.25, a, "#f5f1e2"], [0.25, b, "#cfe6f2"]].map(([x, k, c], i) => <group key={i} position={[x as number, 0, 0]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.09, 0.08, 0.24, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, 0.01 + 0.09 * ll, 0]}><cylinderGeometry args={[0.085, 0.078, 0.18 * ll + 0.001, 32]} />{AGUA(0.55, c as string)}</mesh>
      <mesh position={[0, 0.04, 0]} rotation={[0.3, i, 0.2]} scale={Math.max(0.001, 1 - (k as number)) * 0.05}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={CAL} roughness={1} flatShading /></mesh>
      {Array.from({ length: 10 }, (_, j) => { const q = ((tt * (i ? 1.6 : 0.6) + j / 10) % 1);
        return <mesh key={j} position={[0.03 * Math.sin(j * 2), 0.05 + 0.13 * q, 0.03 * Math.cos(j * 3)]} scale={0.006 * (1 - (k as number)) * ll + 0.0005}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7} /></mesh>; })}
    </group>)}
    <Guante p={[0.48, 0.06 + 0.4 * (1 - Math.min(1, gu)), 0.05]} rot={[0, 0, P2]} s={0.35} />
  </Estudio>;
}}</Stage>;

// 18 · LA SOSA Y EL CROMO: cae una gota de sosa sobre el sifón cromado; el cromo se descascara y aparece el bronce
const DCromo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const g = eio(tt, 0.6, 1.4), d = eio(tt, 1.5, 3.8);
  return <Estudio t={tt} cam={[0.1, 0.45, 0.9]} look={[0, 0.2, 0]} orbit={0.05}>
    <mesh position={[0, 0.2, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.08, 0.08, 0.7, 40]} />{M.cromo()}</mesh>
    <mesh position={[0.02, 0.2, 0]} rotation={[0, 0, P2]} scale={[1.001, 0.06 + 0.4 * d, 1.001]}><cylinderGeometry args={[0.0805, 0.0805, 0.7, 40, 1, true, -0.6, 1.2]} /><meshStandardMaterial color="#b0803a" metalness={0.8} roughness={0.5} side={THREE.DoubleSide} /></mesh>
    <Gota p={[0.02, 0.28, 0.05]} k={g} h={0.4} c="#f2f0c8" />
    <Vapor t={tt} p={[0.02, 0.29, 0.05]} o={0.2 * d} h={0.25} s={0.06} />
  </Estudio>;
}}</Stage>;

// 19 · LA COCA-COLA: los terrones de azúcar se disuelven en el caño y las bacterias (bolitas verdes) se multiplican
const DCoca: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const dis = eio(tt, 0.8, 2.4), b = cl((tt - 1.8) / 3.0);
  return <Estudio t={tt} cam={[0, 0.65, 1.5]} look={[0, 0.25, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 0.25, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.2, 0.2, 1.5, 40, 1, true, 0, P]} />{PVC(1)}</mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.4 + i * 0.2, 0.1, 0]} scale={0.04 * (1 - dis) + 0.001}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#fbfbf7" roughness={0.9} /></mesh>)}
    <mesh position={[0, 0.07, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.3, 0.25]} /><meshStandardMaterial color="#5a2e18" transparent opacity={0.6 * dis} /></mesh>
    {Array.from({ length: Math.round(40 * b) }, (_, i) => <mesh key={"b" + i} position={[(rn(i, 1) - 0.5) * 1.3, 0.09 + 0.15 * rn(i, 2), (rn(i, 3) - 0.5) * 0.25]} scale={0.012 + 0.008 * Math.sin(tt * 4 + i)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#7cbf3a" emissive="#4a8a1a" emissiveIntensity={0.3} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 20 · EL CARRETEL: la pata del tapón gira y el pelo se le enrolla encima, vuelta tras vuelta
const DCarretel: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = cl((tt - 0.6) / 4.0), N = Math.round(k * 26);
  return <Estudio t={tt} cam={[0, 0.5, 0.7]} look={[0, 0.3, 0]} orbit={0.08} mesa={false}>
    <Tapon p={[0, 0.48, 0]} s={2.6} rot={[0, tt * 2, 0]} />
    {Array.from({ length: N }, (_, i) => <mesh key={i} position={[0, 0.26 + (i % 13) * 0.012, 0]} rotation={[P2 + 0.2 * Math.sin(i), i, 0]}><torusGeometry args={[0.02 + 0.002 * Math.floor(i / 13) + 0.004 * rn(i, 1), 0.0025, 6, 28]} /><meshStandardMaterial color={PELO} roughness={0.8} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 21 · UN CUARTO DE VUELTA: la cabeza del tapón gira 90° y sube sola, liberada
const DCuarto: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const gi = eio(tt, 0.8, 1.8), su = eio(tt, 2.2, 3.4);
  return <>
    <Estudio t={tt} cam={[0, 0.75, 0.55]} look={[0, 0.03, 0]} orbit={0.04}>
      <Lavabo s={1} />
      <Tapon p={[0, 0.01 + 0.18 * su, 0]} rot={[0, gi * P2, 0]} s={1} />
      <mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.06, 0.068, 48, 1, 0, P2 * gi + 0.001]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>
    </Estudio>
    <Tag tt={tt} at={1.4} x={1300} y={330} txt="¼ DE VUELTA" col={MZ} size={46} />
  </>;
}}</Stage>;

// 22 · LA TUERCA DE LA VARILLA: debajo, la mano desenrosca la tuerca, la varilla sale unos centímetros y el tapón queda libre arriba
const DTuerca: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const gi = eio(tt, 0.6, 2.0), sa = eio(tt, 2.2, 3.0), su = eio(tt, 3.4, 4.4);
  return <Estudio t={tt} cam={[0.4, 0.5, 1.2]} look={[0, 0.4, 0]} orbit={0.05} mesa={false}>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 20, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    <Tapon p={[0, 0.6 + 0.3 * su, 0]} s={1.2} />
    <mesh position={[-0.05, 0.47, 0]} rotation={[gi * 8, 0, P2]}><cylinderGeometry args={[0.022, 0.022, 0.035, 6]} />{M.cromo("#c9ced3")}</mesh>
    <mesh position={[-0.2 - 0.12 * sa, 0.47, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.006, 0.006, 0.3, 10]} />{M.cromo()}</mesh>
    <Mano p={[-0.12, 0.47, 0.12]} rot={[0, -0.4, gi * 2]} pinza={0.8} s={0.4} />
    <mesh position={[0, 0.0, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.5, 0.3]} /><meshStandardMaterial color="#5f86b8" roughness={1} /></mesh>
  </Estudio>;
}}</Stage>;

// 23 · LA MADEJA: el tapón sale y de su pata cuelga la madeja gris, viscosa, goteando
const DMadeja: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const su = eio(tt, 0.5, 2.2), hp = pelo("madeja", 22, 0.0035);
  return <Estudio t={tt} cam={[0, 0.65, 0.9]} look={[0, 0.35, 0]} orbit={0.07}>
    <Lavabo />
    <group position={[0, 0.02 + 0.5 * su, 0]}>
      <Tapon s={1.4} />
      <group position={[0, -0.16, 0]} scale={[1.1, 1.6, 1.1]}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[0, i * 0.3, 0.15 * Math.sin(tt * 2 + i)]}><meshStandardMaterial color={col(PELO, "#6d6a5c", (i % 3) / 3)} roughness={0.3} /></mesh>)}</group>
      <mesh position={[0, -0.24, 0]} scale={[0.05, 0.09, 0.05]}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#6d6a5c" roughness={0.2} clearcoat={1} transparent opacity={0.6} /></mesh>
      {su > 0.95 && <Gota p={[0.01, -0.36, 0]} k={((tt - 2.2) % 0.9) / 0.9} h={0.3} c="#8a8a78" />}
    </group>
  </Estudio>;
}}</Stage>;

// 24 · EL GANCHO DENTADO DE UN DÓLAR: en corte, la tirita de dientes baja por el costado del tapón y al subir engancha los pelos
const DDientes: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ba = eio(tt, 0.5, 1.8), su = eio(tt, 2.2, 4.0), y = 0.75 - 0.5 * ba + 0.6 * su, hp = pelo("dientes", 9);
  return <Estudio t={tt} cam={[0, 0.5, 1.2]} look={[0, 0.4, 0]} orbit={0.05} mesa={false}>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.06, 0.06, 0.6, 24, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.28} side={THREE.DoubleSide} /></mesh>
    <group position={[0.025, y, 0]}>
      <mesh><boxGeometry args={[0.012, 0.7, 0.002]} /><meshStandardMaterial color="#1f2124" roughness={0.6} /></mesh>
      {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[0.012, -0.33 + i * 0.03, 0]} rotation={[0, 0, 0.8]}><boxGeometry args={[0.012, 0.004, 0.002]} /><meshStandardMaterial color="#1f2124" /></mesh>)}
      <group position={[0.02, -0.25, 0]} visible={su > 0.05}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[0, i, 0.4]}><meshStandardMaterial color={PELO} /></mesh>)}</group>
    </group>
    <group position={[0, 0.2, 0]} visible={su < 0.05}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[P2, i, 0]} scale={0.7}><meshStandardMaterial color={PELO} /></mesh>)}</group>
  </Estudio>;
}}</Stage>;

// 25 · VEINTE CENTÍMETROS (Camila): la cola de pelo sale y al lado se despliega la cinta métrica hasta 20
const DCinta: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 3.0), cm = Math.round(20 * k);
  const g = memo("cola", () => tuboGeo(Array.from({ length: 16 }, (_, i) => [0.012 * Math.sin(i * 1.3), -i * 0.04, 0.01 * Math.cos(i)] as V3), 0.014, 60));
  return <>
    <Estudio t={tt} cam={[0, 0.5, 1.0]} look={[0, 0.35, 0]} orbit={0.04} mesa={false}>
      <group position={[-0.08, 0.72, 0]} scale={[1, Math.max(0.001, k), 1]}><mesh geometry={g}><meshStandardMaterial color={PELO} roughness={0.7} /></mesh></group>
      <mesh position={[0.08, 0.72 - 0.3 * k, 0]} scale={[1, Math.max(0.001, k), 1]}><boxGeometry args={[0.05, 0.6, 0.004]} /><meshStandardMaterial map={ctex("cinta", 64, 512, (c) => { c.fillStyle = "#f2c230"; c.fillRect(0, 0, 64, 512); c.fillStyle = "#222"; for (let i = 0; i <= 20; i++) { const y = i * 25.6; c.fillRect(0, y, i % 5 ? 14 : 30, 2); } })} /></mesh>
    </Estudio>
    <Tag tt={tt} at={1.0} x={1240} y={420} txt={`${cm} cm`} col={MZ} size={64} />
  </>;
}}</Stage>;

// 26 · EL VASO DEL SIFÓN: a la izquierda gira la tapa de abajo, cae a la cubeta con su agua… y con ella un arito y una tapita
const DVaso: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const gi = eio(tt, 0.6, 1.8), ca = eio(tt, 1.8, 2.6);
  return <Estudio t={tt} cam={[0.2, 0.55, 1.3]} look={[0, 0.2, 0]} orbit={0.05}>
    <SBotella p={[0, 0.42, 0]} s={1.1} vaso={0.08 * gi + 0.8 * ca} />
    <Cubeta p={[0, -0.02, 0.05]} s={0.6} nivel={0.1 + 0.2 * ca} agua="#7a7a68" />
    {ca > 0.5 && <><mesh position={[0.05, 0.2, 0.06]} rotation={[0.6, 0, 0]}><torusGeometry args={[0.018, 0.004, 8, 24]} /><meshStandardMaterial color="#e8c35a" metalness={1} roughness={0.2} /></mesh>
      <mesh position={[-0.05, 0.2, 0.04]}><cylinderGeometry args={[0.018, 0.018, 0.012, 16]} /><meshStandardMaterial color="#3a7ad8" /></mesh></>}
    {gi > 0.1 && gi < 0.95 && <Chorro a={[0, 0.3, 0]} b={[0, 0.15, 0.05]} r={0.01} c="#8a8a78" o={0.7} />}
  </Estudio>;
}}</Stage>;

// 27 · CEPILLO Y JUNTA: el cepillo de dientes viejo friega el vaso por dentro y la junta de goma vuelve a asentarse en su lugar
const DCepillo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const f = Math.sin(tt * 9) * eio(tt, 0.4, 0.8) * (1 - eio(tt, 2.8, 3.2)), j = eio(tt, 3.2, 4.2), sucio = 1 - eio(tt, 0.6, 2.8);
  return <Estudio t={tt} cam={[0, 0.55, 0.8]} look={[0, 0.15, 0]} orbit={0.05}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.1, 0.09, 0.16, 32, 1, true]} /><meshPhysicalMaterial color={col("#e6e9ec", "#9a9686", sucio)} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.09, 0.09, 0.01, 32]} />{PVC(1)}</mesh>
    <group position={[0.02 * f, 0.2, 0]} rotation={[0, 0, 0.2 + 0.1 * f]}>
      <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.02, 0.24, 0.012]} /><meshStandardMaterial color="#3a7ad8" /></mesh>
      <mesh position={[0, -0.01, 0.01]}><boxGeometry args={[0.022, 0.04, 0.02]} /><meshStandardMaterial color="#f4f4f2" roughness={1} /></mesh>
    </group>
    <mesh position={[0, 0.19 + 0.2 * (1 - j), 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.1, 0.01, 10, 40]} />{GOMA()}</mesh>
  </Estudio>;
}}</Stage>;

// 28 · EL ANILLO DE DOÑA INÉS: el anillo cae por el desagüe en espiral, y se queda quieto, brillando, en el fondo del vaso entre el pelo
const DAnillo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 2.8), hp = pelo("anillo", 7);
  return <Estudio t={tt} cam={[0, 0.55, 1.1]} look={[0, 0.3, 0]} orbit={0.06} mesa={false}>
    <SBotella p={[0, 0.2, 0]} s={1.6} o={0.3} />
    <group position={[0, 0.2, 0]} scale={1.6}><group position={[0, -0.03, 0]} scale={0.5}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[P2, i, 0]}><meshStandardMaterial color={PELO} /></mesh>)}</group></group>
    <mesh position={[0.03 * Math.cos(tt * 6) * (1 - k), lerp(0.9, 0.18, k), 0.03 * Math.sin(tt * 6) * (1 - k)]} rotation={[tt * 4 * (1 - k) + 0.3, 0, 0.4]}><torusGeometry args={[0.03, 0.007, 12, 32]} /><meshStandardMaterial color="#f2c24a" metalness={1} roughness={0.12} emissive="#ffb000" emissiveIntensity={0.3 * k} /></mesh>
    <pointLight position={[0, 0.25, 0.1]} intensity={0.01 + 1.2 * eio(tt, 2.8, 3.4)} distance={0.6} color="#ffd36a" />
  </Estudio>;
}}</Stage>;

// 29 · LA MITAD SE VA POR ARRIBA: en corte, la espuma del bicarbonato con vinagre se parte en dos — una mitad baja por el desagüe, la otra trepa por el canal y sale por el agujerito
const DEscape: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const on = eio(tt, 0.5, 1.2);
  const cg = memo("escC", () => new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(0.2, -0.12, 0), new THREE.Vector3(0.42, -0.05, 0), new THREE.Vector3(0.44, 0.15, 0), new THREE.Vector3(0.36, 0.2, 0)]));
  return <Estudio t={tt} cam={[0, 0.2, 1.25]} look={[0.1, 0.0, 0]} orbit={0.03}>
    <mesh><latheGeometry args={[[[0.03, 0], [0.18, 0.01], [0.3, 0.07], [0.38, 0.17], [0.42, 0.24], [0.47, 0.25]].map(([a, b]) => new THREE.Vector2(a, b)), 48, 0, P]} />{LOZA()}</mesh>
    <Tubo pts={cg.getSpacedPoints(24).map((v) => [v.x, v.y, v.z] as V3)} r={0.022} o={0.3} />
    <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.03, 0.03, 0.5, 16, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const q = ((tt * 0.7 + i / 12) % 1), up = i % 2 === 0;
      const p = up ? cg.getPointAt(q) : new THREE.Vector3(0, -0.02 - 0.45 * q, 0);
      return <mesh key={i} position={[p.x, p.y, p.z + 0.01]} scale={0.014 * on + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#fbfbf7" emissive={up ? "#ff6a3a" : "#000000"} emissiveIntensity={up ? 0.5 : 0} /></mesh>; })}
    <Tag tt={tt} at={2.4} x={1280} y={300} txt="½" col={MZ} size={72} />
  </Estudio>;
}}</Stage>;

// 30 · TRAPO, CINTA O MANO: las tres maneras de tapar el agujerito caen una tras otra sobre él
const DTapas: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const a = eio(tt, 0.4, 1.0) * (1 - eio(tt, 1.6, 1.9)), b = eio(tt, 2.0, 2.5) * (1 - eio(tt, 3.1, 3.4)), c = eio(tt, 3.5, 4.1);
  return <Estudio t={tt} cam={[0, 0.45, 0.35]} look={[0, 0.19, -0.39]} orbit={0.02}>
    <Lavabo />
    <group position={[0, 0.19, -0.37]} rotation={[-0.75, 0, 0]}>
      <group position={[0, 0, 0.3 * (1 - a)]} visible={a > 0.01}><RBox s={[0.1, 0.07, 0.015]} r={0.008}><meshStandardMaterial color="#5f86b8" roughness={1} /></RBox></group>
      <group position={[0, 0, 0.3 * (1 - b)]} visible={b > 0.01}><mesh><boxGeometry args={[0.09, 0.05, 0.002]} /><meshStandardMaterial color="#e8d36a" roughness={0.8} /></mesh></group>
    </group>
    <group visible={c > 0.01}><Mano p={[0, 0.22, -0.3 + 0.2 * (1 - c)]} rot={[-0.75, 0, 0]} s={0.35} /></group>
  </Estudio>;
}}</Stage>;

// 31 · DE DÓNDE SALE EL OLOR: tres lugares del lavamanos en corte — la madeja, el canal, el sifón seco — se encienden cuando se nombran
const DTresOlores: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const o = (i: number) => Math.min(1, ON(h, tt, i, 1.5));
  const SP: V3[] = [[0, 0.0, 0], [0, 0.19, -0.36], [0.06, -0.38, 0]];
  return <Estudio t={tt} cam={[0.5, 0.25, 1.4]} look={[0, -0.05, 0]} orbit={0.04} mesa={false}>
    <Lavabo p={[0, 0, 0]} />
    <SBotella p={[0, -0.45, 0]} s={0.9} o={0.4} />
    {SP.map((q, i) => <group key={i} position={q}>
      <mesh scale={0.03 + 0.03 * o(i)}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color={col("#4a5560", "#c6d84a", o(i))} toneMapped={false} /></mesh>
      {Array.from({ length: 4 }, (_, j) => { const k = ((tt * 0.6 + j / 4) % 1);
        return <mesh key={j} position={[0.03 * Math.sin(j + tt), 0.04 + 0.25 * k, 0]} scale={(0.02 + 0.03 * k) * o(i) + 0.001}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#9aae3c" transparent opacity={0.45 * (1 - k)} depthWrite={false} /></mesh>; })}
    </group>)}
  </Estudio>;
}}</Stage>;

// 32 · EL OLOR DEL AGUJERITO: del rebosadero salen hilitos verdes; entra la jeringa sin aguja, empuja el agua con bicarbonato… y los hilitos se cortan
const DJeringa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const em = eio(tt, 1.4, 3.2), ol = 1 - eio(tt, 2.6, 4.2);
  return <Estudio t={tt} cam={[0.25, 0.45, 0.45]} look={[0, 0.19, -0.37]} orbit={0.02}>
    <Lavabo />
    {Array.from({ length: 5 }, (_, j) => { const k = ((tt * 0.5 + j / 5) % 1);
      return <mesh key={j} position={[0.02 * Math.sin(j + tt * 2), 0.2 + 0.2 * k, -0.37 + 0.12 * k]} scale={(0.012 + 0.025 * k) * ol + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#9aae3c" transparent opacity={0.5 * (1 - k)} depthWrite={false} /></mesh>; })}
    <group position={[0, 0.21 + 0.08 * (1 - eio(tt, 0.4, 1.2)), -0.33 + 0.1 * (1 - eio(tt, 0.4, 1.2))]} rotation={[-0.75 + P2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.018, 0.018, 0.14, 20, 1, true]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.06 + 0.08 * (1 - em), 0]}><cylinderGeometry args={[0.016, 0.016, 0.11 * (1 - em) + 0.004, 20]} />{AGUA(0.8, "#cfe6f2")}</mesh>
      <mesh position={[0, 0.07 - 0.1 * em, 0]}><cylinderGeometry args={[0.017, 0.017, 0.015, 20]} /><meshStandardMaterial color="#2c3440" /></mesh>
      <mesh position={[0, 0.14 - 0.1 * em, 0]}><cylinderGeometry args={[0.003, 0.003, 0.14, 8]} /><meshStandardMaterial color="#2c3440" /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 33 · EL DESTAPACAÑOS CHICO: el grande no entra en la pileta y se le escapa el aire por el borde; el chico calza justo sobre el desagüe
const DChico: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const g = IN(tt, 0.5), c = IN(tt, 2.2);
  return <Estudio t={tt} cam={[0, 0.9, 1.5]} look={[0, 0.1, 0]} orbit={0.04}>
    <group position={[-0.5, 0, 0]} scale={0.8}><Lavabo />
      <group position={[0.08, 0.5 * (1 - Math.min(1, g)) + 0.1, 0]} rotation={[0, 0, 0.35]}><Copa s={1.1} /></group>
      {tt > 1.4 && Array.from({ length: 5 }, (_, i) => { const k = ((tt * 1.2 + i / 5) % 1); return <mesh key={i} position={[-0.15 - 0.2 * k, 0.12 + 0.1 * k, 0]} scale={0.02 * (1 - k) + 0.001}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.6} /></mesh>; })}
    </group>
    <group position={[0.5, 0, 0]} scale={0.8}><Lavabo agua={0.25} />
      <group position={[0, 0.5 * (1 - Math.min(1, c)) + 0.01, 0]}><Copa s={0.55} /></group></group>
  </Estudio>;
}}</Stage>;

// 34 · LOS CINCO ERRORES DEL LAVAMANOS: cinco puertitas del botiquín de espejo se abren de a una y muestran el error
const DBotiquin: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ob = [<RBox s={[0.12, 0.16, 0.03]} r={0.01}><meshStandardMaterial color="#d6362c" /></RBox>, <mesh><circleGeometry args={[0.04, 24]} /><meshBasicMaterial color="#0a0a0a" /></mesh>, <Tetera s={0.25} />,
    <mesh geometry={memo("percha", () => tuboGeo([[-0.1, -0.05, 0], [0, 0.04, 0], [0.1, -0.05, 0], [-0.1, -0.05, 0]], 0.004, 30))}>{M.cromo()}</mesh>, <group rotation={[0, 0, 0.6]}><mesh><boxGeometry args={[0.02, 0.18, 0.02]} /><meshStandardMaterial color="#d6362c" /></mesh></group>];
  return <Estudio t={tt} cam={[0, 0.65, 1.9]} look={[0, 0.6, 0]} orbit={0.03} mesa={false}>
    <mesh position={[0, 0.6, -0.12]}><boxGeometry args={[2.1, 0.6, 0.04]} /><meshStandardMaterial color="#e9e3d6" /></mesh>
    {ob.map((o, i) => { const x = -0.84 + i * 0.42, ab = eio(tt, (rel(h, i) > 90 ? 0.6 + i * 1.0 : rel(h, i)) - 0.1, (rel(h, i) > 90 ? 0.6 + i * 1.0 : rel(h, i)) + 0.5);
      return <group key={i} position={[x, 0.6, 0]}>
        <group position={[0, 0, -0.06]} visible={ab > 0.05}>{o}</group>
        <group position={[-0.19, 0, 0.0]} rotation={[0, -1.8 * ab, 0]}><mesh position={[0.19, 0, 0]}><boxGeometry args={[0.38, 0.52, 0.02]} />{M.cromo("#dfe7ee")}</mesh></group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 35 · LA RECETA EN CUATRO TIEMPOS: el lavamanos visto de arriba; sobre él pasa el día — vaso (tarde), bicarbonato y jarra, vinagre con luna, enjuague al amanecer
const DCuatro: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const o = (i: number) => Math.min(1, ON(h, tt, i, 1.3)), s = o(0) + o(1) + o(2) + o(3);
  const sky = s < 2 ? col("#f2c48a", "#2a3550", (s - 1)) : col("#2a3550", "#ffd9a0", s - 3);
  return <Estudio t={tt} cam={[0, 1.0, 0.55]} look={[0, 0.06, 0]} orbit={0.03}>
    <mesh position={[0, 0.5, -1.2]}><planeGeometry args={[4, 2]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    <Lavabo agua={0.4 * (1 - o(0))} ac="#8e9690" />
    <group visible={o(1) > 0.01 && o(3) < 0.5}><mesh position={[0, 0.006, 0]} rotation={[-P2, 0, 0]} scale={0.06 * o(1)}><circleGeometry args={[1, 24]} /><meshStandardMaterial color="#fbfbf7" /></mesh></group>
    <group visible={o(2) > 0.01 && o(3) < 0.5}>{Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.1, 0.012, (rn(i, 2) - 0.5) * 0.1]} scale={0.012 * o(2)}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#fbfbf7" /></mesh>)}</group>
    {o(3) > 0.5 && <Chorro a={[0, 0.35, -0.25]} b={[0, 0.01, 0]} r={0.012} c="#ffc8a8" o={0.8} />}
  </Estudio>;
}}</Stage>;

// 36 · EL NECESER DEL LAVAMANOS: el cierre se abre y cada cosa del kit salta en arco y queda parada sobre el borde de la pileta cuando se nombra
const DCubetaKit: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const it = [<Botella s={0.22} c="#f5f1e2" vidrio />, <mesh><boxGeometry args={[0.012, 0.22, 0.003]} /><meshStandardMaterial color="#1f2124" /></mesh>, <Copa s={0.3} />,
    <RBox s={[0.1, 0.03, 0.08]} r={0.01}><meshStandardMaterial color="#5f86b8" /></RBox>, <Guante s={0.25} />, <mesh><boxGeometry args={[0.015, 0.14, 0.01]} /><meshStandardMaterial color="#3a7ad8" /></mesh>,
    <mesh><cylinderGeometry args={[0.05, 0.04, 0.12, 24, 1, true]} />{M.vidrio()}</mesh>, <Rejilla s={0.2} />];
  const ab = eio(tt, 0.2, 0.8);
  return <Estudio t={tt} cam={[0, 0.75, 1.15]} look={[0, 0.2, 0]} orbit={0.05}>
    <Lavabo />
    <group position={[0.75, 0.06, 0.15]}>
      <RBox s={[0.36, 0.12, 0.18]} r={0.05}><meshStandardMaterial color="#7a4a6a" roughness={0.8} /></RBox>
      <group position={[0, 0.06, -0.09]} rotation={[-1.2 * ab, 0, 0]}><mesh position={[0, 0, 0.09]}><boxGeometry args={[0.34, 0.01, 0.18]} /><meshStandardMaterial color="#8e5a7c" roughness={0.8} /></mesh></group>
    </group>
    {it.map((o, i) => { const a = rel(h, i) > 90 ? 0.6 + i * 0.55 : rel(h, i), k = eio(tt, a, a + 0.8), ang = P * 0.85 + i * 0.2;
      const x = lerp(0.75, Math.cos(ang) * 0.44, k), z = lerp(0.15, Math.sin(ang) * 0.44 * -1, k), y = lerp(0.12, 0.27, k) + 0.35 * Math.sin(k * P);
      return <group key={i} position={[x, y, z]} rotation={[0, (1 - k) * 4, 0]} visible={tt > a - 0.05}>{o}</group>; })}
  </Estudio>;
}}</Stage>;

// 37 · LOS FERREYRA: cinco cepillos de pelo aparecen en la repisa; en tres cuelgan pelos largos
const DCepillos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const hp = pelo("ferr", 6, 0.0025);
  return <Estudio t={tt} cam={[0, 0.5, 1.5]} look={[0, 0.25, 0]} orbit={0.05}>
    <mesh position={[0, 0.02, 0]}><boxGeometry args={[1.8, 0.04, 0.3]} />{M.madera("#c9a46a")}</mesh>
    {[0, 1, 2, 3, 4].map((i) => { const on = IN(tt, 0.4 + i * 0.45), largo = i >= 2;
      return <group key={i} position={[-0.7 + i * 0.35, 0.05 + 0.5 * (1 - Math.min(1, on)), 0]} rotation={[0, 0, 0.1 * Math.sin(i)]}>
        <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.07, 0.03, 0.18]} /><meshStandardMaterial color={["#2c3440", "#7a4a2a", "#d6362c", "#e07ab8", "#7a5ad8"][i]} /></mesh>
        <mesh position={[0, 0.03, 0.17]}><boxGeometry args={[0.03, 0.02, 0.18]} /><meshStandardMaterial color="#1f2124" /></mesh>
        {largo && <group position={[0, 0.06, 0]} scale={[1, 2.6 * eio(tt, 2.6, 3.6) + 0.001, 1]}>{hp.map((g, j) => <mesh key={j} geometry={g} rotation={[0, j, 0]}><meshStandardMaterial color={["#3a2416", "#c49a5a", "#1a1410"][i - 2]} /></mesh>)}</group>}
      </group>; })}
  </Estudio>;
}}</Stage>;

// 38 · LA GELATINA: la sosa convirtió la madeja en una gelatina gris que tiembla sobre el papel
const DGelatina: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const on = IN(tt, 0.5), w = Math.sin(tt * 10) * Math.exp(-((tt - 1.2) % 1.6) * 3) * 0.12;
  return <Estudio t={tt} cam={[0, 0.45, 0.8]} look={[0, 0.08, 0]} orbit={0.06}>
    <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0.2]}><planeGeometry args={[0.5, 0.4]} /><meshStandardMaterial color="#f8f6ee" roughness={1} /></mesh>
    <mesh position={[0, 0.06 * Math.min(1, on), 0]} scale={[0.12 * (1 + w), 0.06 * (1 - w) * Math.max(0.001, Math.min(1.1, on)), 0.1 * (1 + w)]}><sphereGeometry args={[1, 32, 24]} /><meshPhysicalMaterial color="#8e8a72" roughness={0.05} transmission={0.4} thickness={0.2} clearcoat={1} /></mesh>
    <Guante p={[0.3, 0.05, 0.05]} rot={[0, 0, P2]} s={0.4} />
  </Estudio>;
}}</Stage>;

// 39 · LA JUNTA QUEMADA: dos juntas apretadas por la misma prensa; la sana se aplasta y vuelve, la quemada por la sosa se parte
const DJuntas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pr = eio(tt, 1.0, 2.0) * (1 - eio(tt, 3.2, 4.0)), rot = eio(tt, 1.8, 2.2);
  return <Estudio t={tt} cam={[0, 0.5, 1.2]} look={[0, 0.15, 0]} orbit={0.04}>
    {[-0.35, 0.35].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.32 - 0.12 * pr, 0]}><boxGeometry args={[0.3, 0.04, 0.3]} />{M.cromo("#9aa0a6")}</mesh>
      {i === 0 ? <mesh position={[0, 0.06, 0]} rotation={[P2, 0, 0]} scale={[1 + 0.25 * pr, 1 + 0.25 * pr, 1 - 0.5 * pr]}><torusGeometry args={[0.09, 0.03, 16, 40]} />{GOMA()}</mesh>
        : [0, 1].map((k) => <mesh key={k} position={[(k ? 1 : -1) * 0.02 * rot, 0.06, 0]} rotation={[P2, 0, k * P + 0.2 * rot * (k ? 1 : -1)]}><torusGeometry args={[0.09, 0.03, 16, 40, P - 0.08 * rot]} /><meshStandardMaterial color="#5a4a3a" roughness={0.4} /></mesh>)}
    </group>)}
  </Estudio>;
}}</Stage>;

// 40 · EL PODIO DE LAS MADEJAS: las chicas compiten; tres madejas de distinto tamaño suben al podio, la más grande al medio
const DPodio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const hp = pelo("podio", 12, 0.004);
  return <Estudio t={tt} cam={[0, 0.6, 1.6]} look={[0, 0.3, 0]} orbit={0.06}>
    {[[-0.4, 0.15, 0.7, 2], [0, 0.25, 1.1, 0], [0.4, 0.1, 0.55, 1]].map(([x, hh, s, ord], i) => { const on = IN(tt, 0.6 + ord * 0.8);
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, hh / 2, 0]} castShadow><boxGeometry args={[0.36, hh, 0.3]} />{M.madera(["#c9a46a", "#e8c35a", "#b08a52"][i])}</mesh>
        <group position={[0, hh + 0.08 + 0.5 * (1 - Math.min(1, on)), 0]} scale={s * Math.max(0.001, Math.min(1, on))}>{hp.map((g, j) => <mesh key={j} geometry={g} rotation={[j, j * 0.5, 0]}><meshStandardMaterial color={PELO} /></mesh>)}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 41 · LOS TORNILLOS AL VASO: se desatornilla la rejilla de la ducha y los tornillos caen en un vaso — no al desagüe
const DTornillos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => (
  <Estudio t={tt} cam={[0.2, 0.7, 1.0]} look={[0.1, 0.08, 0]} orbit={0.04}>
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[1.4, 1.2]} /><meshStandardMaterial color="#d9dcd6" roughness={0.3} /></mesh>
    <mesh position={[0, 0.003, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 32]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
    <group position={[0, 0.006 + 0.3 * eio(tt, 3.4, 4.2), 0]}><mesh rotation={[-P2, 0, 0]}><ringGeometry args={[0.02, 0.12, 32]} />{M.cromo()}</mesh></group>
    <mesh position={[0.45, 0.08, 0.1]}><cylinderGeometry args={[0.07, 0.06, 0.16, 24, 1, true]} />{M.vidrio()}</mesh>
    {[0, 1].map((i) => { const a = 0.6 + i * 1.3, sube = eio(tt, a, a + 0.6), vu = eio(tt, a + 0.6, a + 1.1);
      const x = lerp(i ? 0.09 : -0.09, 0.45, vu), y = 0.01 + 0.15 * sube + (vu > 0.95 ? -0.1 : 0.05 * Math.sin(vu * P));
      return <mesh key={i} position={[x, y, lerp(0, 0.1, vu)]} rotation={[0, tt * 6 * (1 - sube), 0]}><cylinderGeometry args={[0.008, 0.004, 0.04, 8]} />{M.cromo("#c9ced3")}</mesh>; })}
  </Estudio>
)}</Stage>;

// 42 · LA PLETINA: la varilla cambia de agujerito en la pletina y el recorrido del tapón se hace completo
const DPletina: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const mv = eio(tt, 1.2, 2.2), rec = lerp(0.03, 0.08, mv), osc = 0.5 + 0.5 * Math.sin(tt * 2.5);
  return <Estudio t={tt} cam={[0.4, 0.5, 1.2]} look={[-0.1, 0.45, 0]} orbit={0.05} mesa={false}>
    <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.03, 0.03, 0.4, 20, 1, true]} /><meshPhysicalMaterial color="#eef1f3" transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
    <Tapon p={[0, 0.62 + rec * osc, 0]} s={1.2} />
    <mesh position={[-0.3, 0.5, 0]}><boxGeometry args={[0.025, 0.36, 0.006]} />{M.cromo("#b7bcc2")}</mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.3, 0.38 + i * 0.05, 0.004]}><circleGeometry args={[0.006, 12]} /><meshBasicMaterial color="#111" /></mesh>)}
    <mesh position={[-0.15, lerp(0.48, 0.53, mv), 0]} rotation={[0, 0, P2 + 0.15]}><cylinderGeometry args={[0.005, 0.005, 0.3, 10]} />{M.cromo()}</mesh>
    <mesh position={[-0.3, lerp(0.48, 0.53, mv), 0.012]}><torusGeometry args={[0.012, 0.003, 8, 20]} /><meshStandardMaterial color="#e8432e" /></mesh>
  </Estudio>;
}}</Stage>;

// 43 · EL TABLERO DE LAS SEÑALES: el lavamanos visto desde arriba con cinco lucecitas en el borde; al nombrar cada señal se prende su luz ámbar y su objetito
const DSenales: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const o = (i: number) => Math.min(1, ON(h, tt, i, 1.0));
  const ic = (i: number) => [<mesh rotation={[-P2, 0, 0]}><ringGeometry args={[0.025, 0.03, 24]} /><meshBasicMaterial color="#6d6a5c" /></mesh>,
    <mesh rotation={[-P2, 0, tt * 2]}><ringGeometry args={[0.012, 0.03, 24, 1, 0, 4]} /><meshBasicMaterial color="#5aa8e6" /></mesh>,
    <mesh scale={0.02}><sphereGeometry args={[1, 16, 12]} /><meshPhysicalMaterial color="#cfd6d0" transparent opacity={0.6} /></mesh>,
    <mesh scale={0.022} position={[0, 0.01 * Math.sin(tt * 3), 0]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#9aae3c" transparent opacity={0.6} /></mesh>,
    <mesh scale={[0.025, 0.01, 0.025]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#f4f6f3" /></mesh>][i];
  return <Estudio t={tt} cam={[0, 1.1, 0.55]} look={[0, 0.1, -0.05]} orbit={0.03}>
    <Lavabo />
    {[0, 1, 2, 3, 4].map((i) => { const ang = P * 1.15 + i * 0.4, x = Math.cos(ang) * 0.44, z = Math.sin(ang) * 0.44;
      return <group key={i} position={[x, 0.26, z]}>
        <mesh><sphereGeometry args={[0.022, 16, 12]} /><meshStandardMaterial color={col("#5a5040", "#ffb000", o(i))} emissive="#ffb000" emissiveIntensity={1.2 * o(i)} toneMapped={false} /></mesh>
        <group position={[0, 0.06, 0]} scale={Math.max(0.001, o(i))}>{ic(i)}</group>
        <pointLight position={[0, 0.05, 0]} intensity={0.01 + 0.4 * o(i)} distance={0.25} color="#ffb000" />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 44 · EL AIREADOR: el chorro sale torcido y salpicando; la piecita se desenrosca, la mallita con granitos va al vaso de vinagre… y el chorro sale derecho
const DAireador: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const sa = eio(tt, 1.0, 1.8), vu = eio(tt, 3.4, 4.0), bien = vu > 0.9;
  return <Estudio t={tt} cam={[0.2, 0.65, 1.0]} look={[0, 0.5, 0]} orbit={0.04}>
    <group position={[0, 0.9, -0.1]}><mesh rotation={[P2, 0, 0]} position={[0, 0, 0.1]}><cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />{M.cromo()}</mesh>
      <mesh position={[0, -0.03, 0.2]}><cylinderGeometry args={[0.03, 0.03, 0.04, 20]} />{M.cromo()}</mesh></group>
    <group position={[lerp(0, 0.35, sa) * (1 - vu), lerp(0.85, 0.25, sa) * (1 - vu) + 0.85 * vu, lerp(0.1, 0.1, sa)]}>
      <mesh><cylinderGeometry args={[0.032, 0.032, 0.03, 20]} />{M.cromo("#c9ced3")}</mesh>
      <mesh position={[0, -0.016, 0]} rotation={[P2, 0, 0]}><circleGeometry args={[0.026, 20]} /><meshStandardMaterial color="#9aa0a6" wireframe /></mesh>
    </group>
    <mesh position={[0.35, 0.22, 0.1]}><cylinderGeometry args={[0.06, 0.055, 0.14, 24, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[0.35, 0.2, 0.1]}><cylinderGeometry args={[0.055, 0.05, 0.1, 24]} />{AGUA(0.6, "#f5f1e2")}</mesh>
    {(tt < 1.0 || bien) && (bien ? <Chorro a={[0, 0.84, 0.1]} b={[0, 0.2, 0.1]} r={0.012} c="#cfe6f2" o={0.85} />
      : Array.from({ length: 5 }, (_, i) => <Chorro key={i} a={[0, 0.84, 0.1]} b={[(i - 2) * 0.08, 0.25, 0.1 + (i % 2) * 0.05]} r={0.004} c="#cfe6f2" o={0.7} />))}
  </Estudio>;
}}</Stage>;

// 45 · EL LAVAMANOS DE LOS NIÑOS: bloquecitos, arena y plastilina caen por el desagüe y se juntan en el fondo del vaso, como un reloj de arena
const DReloj: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const k = cl((tt - 0.5) / 3.8);
  return <Estudio t={tt} cam={[0, 0.5, 1.1]} look={[0, 0.25, 0]} orbit={0.06} mesa={false}>
    <SBotella p={[0, 0.2, 0]} s={1.6} o={0.3} />
    <mesh position={[0, 0.12, 0]} scale={[1, Math.max(0.001, k), 1]}><cylinderGeometry args={[0.1, 0.1, 0.08, 24]} /><meshStandardMaterial color="#d9b77a" roughness={1} /></mesh>
    {Array.from({ length: 30 }, (_, i) => { const q = ((tt * 0.7 + rn(i, 1)) % 1);
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.02, 0.9 - 0.7 * q, (rn(i, 3) - 0.5) * 0.02]} scale={0.006}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#d9b77a" /></mesh>; })}
    {[["#e8432e", 0.6], ["#3a7ad8", 1.5], ["#59c26a", 2.4]].map(([c, a], i) => <mesh key={"b" + i} position={[(i - 1) * 0.03, lerp(0.95, 0.2 + 0.03 * i, eio(tt, a as number, (a as number) + 0.9)), 0]} rotation={[0, i, 0.3]}><boxGeometry args={[0.04, 0.025, 0.02]} /><meshStandardMaterial color={c as string} roughness={0.3} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 46 · TREINTA SEGUNDOS DE CORRIENTE: en el caño en corte caen copitos de jabón hacia la pared; la corriente tibia los alcanza en el aire y se los lleva antes de que toquen
const DTreinta: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const cor = eio(tt, 1.6, 2.4);
  return <Estudio t={tt} cam={[0, 0.5, 1.3]} look={[0, 0.25, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, 0.25, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.2, 0.2, 2.0, 40, 1, true, 0, P]} />{PVC(1)}</mesh>
    {cor > 0.01 && <mesh position={[0, 0.17, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.1, 0.1, 2.0, 24, 1, true]} /><meshPhysicalMaterial color="#ffb07a" transparent opacity={0.25 * cor} side={THREE.DoubleSide} depthWrite={false} /></mesh>}
    {Array.from({ length: 18 }, (_, i) => { const a0 = rn(i, 1) * 1.4, q = cl((tt - a0) / 1.6), x0 = -0.8 + rn(i, 2) * 1.6;
      const lleva = cor * cl((tt - Math.max(a0, 1.6)) / 1.5), y = lerp(0.42, 0.08, q * (1 - cor * 0.6));
      return <mesh key={i} position={[x0 + 1.6 * lleva, y, (rn(i, 3) - 0.5) * 0.12]} visible={tt > a0 && x0 + 1.6 * lleva < 1.0} rotation={[tt + i, i, 0]} scale={0.015}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#fbfbf7" roughness={0.5} /></mesh>; })}
    <Tag tt={tt} at={2.0} x={1300} y={300} txt="30 s" col={MZ} size={56} />
  </Estudio>;
}}</Stage>;

// 47 · SEIS MESES: arriba pasan seis lunas y abajo, en la pata del tapón, unos pocos pelos se vuelven madeja
const DSeisLunas: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = cl((tt - 0.5) / 4.2), hp = pelo("seis", 20, 0.003), n = Math.round(2 + 18 * k);
  return <Estudio t={tt} cam={[0, 0.55, 1.0]} look={[0, 0.4, 0]} orbit={0.05} mesa={false}>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-0.5 + i * 0.2, 0.95, -0.3]} visible={k * 6 > i}><sphereGeometry args={[0.035, 20, 14]} /><meshBasicMaterial color="#f4f1de" toneMapped={false} /></mesh>)}
    <Tapon p={[0, 0.55, 0]} s={2} />
    <group position={[0, 0.34, 0]} scale={0.6 + 0.6 * k}>{hp.slice(0, n).map((g, i) => <mesh key={i} geometry={g} rotation={[0, i * 0.35, 0]}><meshStandardMaterial color={PELO} /></mesh>)}</group>
  </Estudio>;
}}</Stage>;

// 48 · LOS MITOS SE HACEN VAHO: cinco cosas sobre la repisa de vidrio; al nombrar cada mito, su objeto se deshace en vapor y sube al espejo
const DMitos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ob = [<group><Botella s={0.2} c="#f5f1e2" vidrio /><mesh position={[0.07, 0.03, 0]}><boxGeometry args={[0.06, 0.08, 0.04]} /><meshStandardMaterial color="#f1c232" /></mesh></group>,
    <group>{[0, 1, 2].map((j) => <mesh key={j} position={[0, 0.04 + j * 0.08, 0]}><boxGeometry args={[0.08, 0.075, 0.04]} /><meshStandardMaterial color="#f1c232" /></mesh>)}</group>,
    <Botella s={0.2} c="#59c26a" />, <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.04, 0.035, 0.12, 20]} />{AGUA(0.7, "#cfe6f2")}</mesh>,
    <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.06, 0.06, 0.02, 24]} /><meshStandardMaterial color="#4a4f55" metalness={0.6} roughness={0.5} /></mesh>];
  return <Estudio t={tt} cam={[0, 0.55, 1.3]} look={[0, 0.4, 0]} orbit={0.03} mesa={false}>
    <mesh position={[0, 0.85, -0.2]}><planeGeometry args={[1.6, 0.8]} /><meshPhysicalMaterial color="#dfe7ee" metalness={0.9} roughness={0.15} /></mesh>
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.5, 0.015, 0.25]} />{M.vidrio()}</mesh>
    {ob.map((o, i) => { const a = rel(h, i) > 90 ? 0.8 + i * 1.0 : rel(h, i), d = eio(tt, a + 0.2, a + 1.3);
      return <group key={i} position={[-0.56 + i * 0.28, 0.31, 0]}>
        <group scale={Math.max(0.001, 1 - d)} visible={d < 0.99}>{o}</group>
        <Vapor t={tt} p={[0, 0.08, 0]} o={0.5 * Math.sin(d * P)} h={0.45} s={0.08} />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 49 · DOS DEDOS (don Ernesto): la pinza de dos dedos baja al desagüe abierto y saca la madeja de un tirón
const DDosDedos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ba = eio(tt, 0.5, 1.4), su = eio(tt, 1.8, 3.0), hp = pelo("dedos", 12);
  return <Estudio t={tt} cam={[0, 0.6, 0.6]} look={[0, 0.1, 0]} orbit={0.04}>
    <Lavabo />
    <Mano p={[0, 0.3 - 0.25 * ba + 0.35 * su, 0.03]} rot={[P2, 0, 0]} pinza={ba > 0.95 ? 1 : 0.2} dedos={2} s={0.4} />
    <group position={[0, -0.03 + 0.35 * su, 0]} visible={su > 0.02}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[0, i * 0.5, 0]}><meshStandardMaterial color={PELO} /></mesh>)}</group>
  </Estudio>;
}}</Stage>;

// 50 · REJILLAS POR DOCENA: de la caja salen doce rejillas para pelo y cada una vuela a un lavamanos distinto
const DDocena: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => (
  <Estudio t={tt} cam={[0, 1.2, 2.2]} look={[0, 0.1, -0.3]} orbit={0.04}>
    <group position={[0, 0.06, 0.5]}><RBox s={[0.4, 0.12, 0.3]} r={0.01}><meshStandardMaterial color="#c9a46a" roughness={0.9} /></RBox></group>
    {Array.from({ length: 12 }, (_, i) => { const x = -1.1 + (i % 6) * 0.44, z = -0.2 - Math.floor(i / 6) * 0.6, k = eio(tt, 0.6 + i * 0.22, 1.4 + i * 0.22);
      return <group key={i}>
        <group position={[x, 0, z]} scale={0.32}><Lavabo /></group>
        <group position={[lerp(0, x, k), 0.12 + 0.6 * Math.sin(k * P) + lerp(0, -0.05, k), lerp(0.5, z, k)]} visible={tt > 0.6 + i * 0.22}><Rejilla s={0.18} /></group>
      </group>; })}
  </Estudio>
)}</Stage>;

// 51 · EL LAVAMANOS DE APOYO: el bol sobre la mesada; el botón del desagüe gira a la izquierda, sube, y debajo aparece el pelo
const DBol: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const gi = eio(tt, 1.0, 2.2), hp = pelo("bol", 8);
  return <Estudio t={tt} cam={[0, 0.85, 0.85]} look={[0, 0.2, 0]} orbit={0.05}>
    <mesh position={[0, 0.06, 0]}><boxGeometry args={[1.4, 0.06, 0.7]} />{M.madera("#7a5a3a")}</mesh>
    <mesh position={[0, 0.09, 0]} geometry={memo("bol", () => lathe([[0.03, 0], [0.2, 0.02], [0.28, 0.1], [0.3, 0.2], [0.29, 0.2]], 56))}><meshPhysicalMaterial color="#f7f6f2" roughness={0.1} clearcoat={1} side={THREE.DoubleSide} /></mesh>
    <group position={[0, 0.1 + 0.1 * eio(tt, 2.2, 3.0), 0]} rotation={[0, -gi * P, 0]}><mesh><sphereGeometry args={[0.035, 24, 12, 0, 2 * P, 0, P2]} />{M.cromo()}</mesh></group>
    <group position={[0, 0.085, 0]} scale={0.6 * eio(tt, 2.6, 3.4) + 0.001}>{hp.map((g, i) => <mesh key={i} geometry={g} rotation={[P2, i, 0]}><meshStandardMaterial color={PELO} /></mesh>)}</group>
  </Estudio>;
}}</Stage>;

// 52 · EL VIAJE DE LA GOTA: una gota encendida baja en espiral por el desagüe y pasa por cada cosa del video, que se prende cuando se nombra
const DRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const N = (h.items ?? []).length || 11, A = (i: number) => rel(h, i) > 90 ? 0.5 + i * 0.6 : rel(h, i);
  const prog = (() => { let k = 0; for (let i = 0; i < N; i++) k += eio(tt, A(i) - 0.4, A(i) + 0.2); return k; })();
  const pos = (k: number): V3 => [Math.cos(k * 1.3) * 0.35, 1.0 - k * 0.17, Math.sin(k * 1.3) * 0.35];
  const it = (i: number) => [pelo("rc", 6).map((g, j) => <mesh key={j} geometry={g}><meshStandardMaterial color={PELO} /></mesh>), <RBox s={[0.1, 0.05, 0.06]} r={0.02}><meshStandardMaterial color="#f2e9d2" /></RBox>,
    <Taza s={0.6} lleno={1} c="#fbfbf7" />, <Tetera s={0.22} />, <Botella s={0.22} c="#f5f1e2" vidrio />, <Botella s={0.22} c="#d6362c" />, <Tapon s={1} />,
    <mesh><boxGeometry args={[0.012, 0.22, 0.003]} /><meshStandardMaterial color="#1f2124" /></mesh>, <SBotella s={0.4} />, <RBox s={[0.1, 0.07, 0.015]} r={0.008}><meshStandardMaterial color="#5f86b8" /></RBox>, <Rejilla s={0.2} />][i % 11];
  const d = pos(prog);
  return <Estudio t={tt} cam={[0, 0.95 - prog * 0.16, 1.5]} look={[0, 0.8 - prog * 0.17, 0]} orbit={0.02} mesa={false}>
    {Array.from({ length: N }, (_, i) => { const p = pos(i + 1), on = eio(tt, A(i) - 0.1, A(i) + 0.4);
      return <group key={i} position={[p[0] * 1.25, p[1], p[2] * 1.25]} scale={0.8 + 0.25 * on}>{it(i)}
        <pointLight position={[0, 0.1, 0.1]} intensity={0.01 + 0.7 * on} distance={0.4} color="#ffd36a" /></group>; })}
    <mesh position={d}><sphereGeometry args={[0.035, 20, 14]} /><meshPhysicalMaterial color="#9fd6ff" emissive="#5aa8e6" emissiveIntensity={0.8} roughness={0} clearcoat={1} toneMapped={false} /></mesh>
  </Estudio>;
}}</Stage>;

// 13 · CINCO MINUTOS CON LA TAPA ABIERTA: la pava recién hervida con la tapa levantada; la columna de vapor baja un azulejo por minuto contra la pared
const DEnfria: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const tapa = eio(tt, 0.4, 1.0), k = cl((tt - 1.0) / 4.5), m = Math.floor(k * 5);
  return <Estudio t={tt} cam={[0.15, 0.6, 1.4]} look={[0, 0.45, 0]} orbit={0.04}>
    <mesh position={[0, 0.7, -0.35]}><planeGeometry args={[1.6, 1.4]} /><meshStandardMaterial map={ctex("azulejos", 256, 224, (g) => { g.fillStyle = "#e9e3d6"; g.fillRect(0, 0, 256, 224); g.strokeStyle = "#c9c0ae"; g.lineWidth = 3; for (let x = 0; x <= 256; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 224); g.stroke(); } for (let y = 0; y <= 224; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); } })} roughness={0.4} /></mesh>
    <Tetera s={0.9} />
    <mesh position={[0.02, 0.27 + 0.05 * tapa, -0.02 - 0.06 * tapa]} rotation={[-1.1 * tapa, 0, 0]}><cylinderGeometry args={[0.05, 0.055, 0.015, 24]} />{M.cromo()}</mesh>
    <Vapor t={tt} p={[0.02, 0.3, 0]} o={0.5 * (1 - k * 0.8)} h={0.9 * (1 - 0.18 * m) - 0.1 * (k * 5 - m)} s={0.1} />
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.55, 0.3 + i * 0.14, -0.34]} visible={i >= 5 - m}><circleGeometry args={[0.025, 20]} /><meshBasicMaterial color="#5aa8e6" toneMapped={false} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 54 · MÁS ALLÁ DEL SIFÓN: la pared se vuelve de vidrio; una linterna recorre el caño limpio, entra a la pared… y encuentra el tapón ahí adentro
const DPared: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const vid = eio(tt, 0.5, 1.5), lx = lerp(-0.45, 0.75, eio(tt, 1.4, 4.0)), hal = eio(tt, 3.6, 4.4);
  return <Estudio t={tt} cam={[0.15, 0.55, 1.5]} look={[0.2, 0.3, 0]} orbit={0.04} mesa={false}>
    <SBotella p={[-0.5, 0.2, 0]} s={1.1} />
    <mesh position={[0.25, 0.27, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 1.1, 20]} />{PVC(1)}</mesh>
    <mesh position={[0.45, 0.4, -0.02]}><boxGeometry args={[0.25, 1.2, 0.7]} /><meshPhysicalMaterial color="#d9d3c6" roughness={0.9} transparent opacity={1 - 0.75 * vid} depthWrite={vid < 0.5} /></mesh>
    <mesh position={[0.62, 0.27, 0]} scale={[0.06, 0.035, 0.035]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#6d6a5c" emissive="#ffb000" emissiveIntensity={0.6 * hal} roughness={0.7} /></mesh>
    <pointLight position={[lx, 0.33, 0.06]} intensity={0.01 + 1.4 * eio(tt, 1.4, 1.8)} distance={0.35} color="#fff2c8" />
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  d_espuma: DEspuma, d_taza: DTaza, d_agujero: DAgujero, d_distinto: DDistinto, d_rata: DRata, d_nata: DNata, d_cebolla: DCebolla, d_tres: DTres, d_varilla: DVarilla,
  d_botella: DBotella, d_canal: DCanalOculto, d_caja: DCaja, d_lupa: DLupa, d_intacto: DIntacto, d_pasillo: DPasillo, d_noche: DNoche, d_vinagres: DVinagres, d_cromo: DCromo,
  d_coca: DCoca, d_carretel: DCarretel, d_cuarto: DCuarto, d_tuerca: DTuerca, d_madeja: DMadeja, d_dientes: DDientes, d_cinta: DCinta, d_vaso: DVaso, d_cepillo: DCepillo,
  d_anillo: DAnillo, d_escape: DEscape, d_tapas: DTapas, d_olores: DTresOlores, d_jeringa: DJeringa, d_chico: DChico, d_botiquin: DBotiquin, d_cuatro: DCuatro,
  d_kit: DCubetaKit, d_cepillos: DCepillos, d_gelatina: DGelatina, d_juntas: DJuntas, d_podio: DPodio, d_tornillos: DTornillos, d_pletina: DPletina, d_senales: DSenales,
  d_aireador: DAireador, d_reloj: DReloj, d_treinta: DTreinta, d_lunas: DSeisLunas, d_mitos: DMitos, d_dosdedos: DDosDedos, d_docena: DDocena, d_bol: DBol, d_recap: DRecap, d_enfria: DEnfria, d_pared: DPared,
};
