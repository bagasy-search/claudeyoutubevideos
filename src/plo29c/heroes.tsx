// plo29c · EL AGUA HIRVIENDO EN EL DESAGÜE · componentes únicos 3D (ninguno repite mecanismo de plo29a/b ni entre sí).
// Cada uno: OBJETO reconocible sin leer, llegada de a uno con peso (fall/phys), el momento wow en la palabra clave, a lo sumo un rótulo DENTRO de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, MZ, phys, RED, Stage, Tag, TX, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, Vapor } from "./estudio3d";
import { Chorro, Llama, Mano, Olla } from "./kit3d";
import { ACERO, AGUA, Botella, Copa, Cubeta, Frasco, GOMA, GRASA, Gota, Granos, Guante, Linterna, PVC, Rejilla, Sifon, Sonda, Tarja, Taza, Tetera, Termometro, Tubo, tuboGeo } from "./kitplo";
import { Inodoro, LOZA } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const MAD = "#9a6a42", CALOR = "#ff5a2a", FRIO = "#4aa8ff";
// caño recto entre dos puntos con material propio (sin hooks: geometría cacheada por clave)
const Cano: React.FC<{ a: V3; b: V3; r?: number; children: React.ReactNode }> = ({ a, b, r = 0.06, children }) => {
  const g = memo(`cano${a}${b}${r}`, () => tuboGeo([a, b], r, 4));
  return <mesh geometry={g} castShadow>{children}</mesh>;
};
// mueble bajo mesada en corte (fondo + piso de madera) — escenario de varios héroes
const Mueble: React.FC<{ hinchado?: number; mancha?: number }> = ({ hinchado = 0, mancha = 0 }) => <group>
  <mesh position={[0, -0.02 + 0.02 * hinchado, 0]} scale={[1, 1 + 3 * hinchado, 1]} receiveShadow><boxGeometry args={[1.6, 0.04, 0.9]} /><meshStandardMaterial color={col(MAD, "#5e4128", mancha)} roughness={0.85} /></mesh>
  <mesh position={[0, 0.55, -0.45]} receiveShadow><boxGeometry args={[1.6, 1.15, 0.03]} /><meshStandardMaterial color="#c9b79a" roughness={0.9} /></mesh>
</group>;

// 1 · LA OLLA DE LA ABUELA: la olla de peltre se inclina sobre la tarja, el chorro cae al desagüe y sube una nube de vapor enorme
const COlla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const inc = eio(tt, 0.8, 2.0), sale = inc > 0.6 && tt < 5.4 ? 1 : 0, nube = eio(tt, 1.6, 4.5);
  return <Estudio t={tt} cam={[0.2, 1.2, 1.75]} look={[0.15, 0.42, 0]} orbit={0.08}>
    <Tarja />
    <group position={[0.48, 0.66 + fall(tt, 0.1, 1.2), -0.02]} rotation={[0, 0, 1.15 * inc]}><Olla mat="peltre" s={0.56} nivel={0.7 * (1 - 0.6 * eio(tt, 2.0, 5.4))} caldo="#cfe4ee" hervor={1} t={tt} /></group>
    {sale > 0 && <Chorro a={[0.22, 0.66, -0.02]} b={[0, 0.02, 0]} r={0.055} c="#d9eef8" o={0.8} />}
    <Vapor t={tt} p={[0, 0.05, 0]} n={30} h={1.8} o={0.1 + 0.45 * nube} s={0.3 + 0.55 * nube} spread={0.45} />
    <Vapor t={tt + 3} p={[0.25, 0.7, 0]} n={10} h={0.8} o={0.25 * inc} s={0.18} />
  </Estudio>;
}}</Stage>;

// 2 · EL CHARQUITO: debajo del mueble la tuerca del sifón suelta una gota cada tanto y en la madera se abre un charco que antes no estaba
const CCharquito: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const per = 0.9, k = ((tt - 0.6) % per) / per, n = Math.max(0, Math.floor((tt - 0.6) / per)), r = 0.04 + 0.32 * cl(n / 7);
  return <Estudio t={tt} cam={[0.15, 0.48, 1.05]} look={[-0.12, 0.17, 0]} orbit={0.05} mesa={false}>
    <Mueble mancha={cl(n / 7)} />
    <Sifon p={[-0.15, 0.3, 0]} s={0.75} nut={0.4 * Math.sin(tt * 2)} />
    {tt > 0.6 && <Gota p={[-0.15, 0.0, 0.0]} k={k} h={0.4} />}
    <mesh position={[-0.15, 0.003, 0]} rotation={[-P2, 0, 0]} scale={[r, r * 0.8, 1]} visible={tt > 1.4}><circleGeometry args={[1, 40]} />{AGUA(0.7, "#8fb8cc")}</mesh>
    {tt > 1.4 && <mesh position={[-0.15, 0.004, 0]} rotation={[-P2, 0, 0]} scale={0.02 + 0.3 * k} visible={k > 0.05 && k < 0.95}><ringGeometry args={[0.9, 1, 40]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.4 * (1 - k)} depthWrite={false} /></mesh>}
  </Estudio>;
}}</Stage>;

// 3 · FIERRO DE LA ABUELA → PLÁSTICO DE HOY: el caño viejo gira en el torno y se transforma en PVC blanco
const CFierro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const m = eio(tt, 2.2, 3.6), c = col("#4a3a32", "#eef1f3", m);
  return <>
    <Estudio t={tt} cam={[0, 0.62, 2.35]} look={[0, 0.42, 0]} orbit={0.06}>
      <mesh position={[0, 0.03, 0]} receiveShadow><cylinderGeometry args={[0.7, 0.75, 0.06, 48]} /><meshStandardMaterial color="#2e3640" roughness={0.4} /></mesh>
      <group position={[0, 0.45 + fall(tt, 0.1, 1.2), 0]} rotation={[0, tt * 0.9, P2]}>
        {Array.from({ length: 12 }, (_, i) => { const mi = eio(tt, 1.6 + i * 0.16, 2.1 + i * 0.16), ci = col("#4a3a32", "#eef1f3", mi);
          return <mesh key={"s" + i} position={[0, -0.4125 + i * 0.075, 0]} castShadow><cylinderGeometry args={[0.13 + 0.006 * Math.sin(P * mi), 0.13 + 0.006 * Math.sin(P * mi), 0.076, 40, 1, true]} /><meshStandardMaterial color={ci} emissive="#ffb070" emissiveIntensity={0.9 * Math.sin(P * mi)} roughness={lerp(0.85, 0.32, mi)} metalness={lerp(0.55, 0, mi)} side={THREE.DoubleSide} /></mesh>; })}
        {[-1, 1].map((k) => <mesh key={k} position={[0, k * 0.45, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.08, 40]} /><meshStandardMaterial color={k < 0 ? col("#4a3a32", "#eef1f3", eio(tt, 1.6, 2.1)) : c} roughness={lerp(0.85, 0.32, m)} metalness={lerp(0.55, 0, m)} /></mesh>)}
        {Array.from({ length: 30 }, (_, i) => { const y = (i / 30 - 0.5) * 0.85, at = 1.6 + (y + 0.425) / 0.075 * 0.16, k = cl((tt - at) / 0.9);
          return <mesh key={i} position={[Math.cos(i * 2.1) * (0.135 + 0.25 * k), y, Math.sin(i * 2.1) * (0.135 + 0.25 * k)]} scale={0.03 * (1 - k) + 0.0005}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#8a4a22" roughness={1} /></mesh>; })}
      </group>
    </Estudio>
  </>;
}}</Stage>;

// 4 · EL GOLPECITO CON LA UÑA: el dedo toca dos sifones; el de plástico suena sordo (dos ondas cortas), el de metal tintinea (ondas doradas que siguen)
const CUna: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const toc = (a: number) => eio(tt, a - 0.25, a) * (1 - eio(tt, a, a + 0.25));
  const ondas = (x: number, a: number, n: number, c: string, dur: number) => Array.from({ length: n }, (_, i) => { const k = cl((tt - a - i * 0.18) / dur);
    return <mesh key={i} position={[x + 0.12, 0.42, 0.06]} scale={0.05 + 0.5 * k} visible={k > 0 && k < 1}><torusGeometry args={[1, 0.03, 8, 48]} /><meshBasicMaterial color={c} transparent opacity={0.9 * (1 - k)} toneMapped={false} /></mesh>; });
  return <>
    <Estudio t={tt} cam={[0, 0.5, 2.0]} look={[-0.1, 0.35, 0]} orbit={0.05}>
      <Sifon p={[-0.85, 0.12, 0]} s={0.75} />
      <group position={[0.4, 0.12, 0]} scale={0.75}><Tubo pts={[[0, 0.62, 0], [0, 0.12, 0], [0.06, 0.0, 0], [0.2, -0.02, 0], [0.32, 0.06, 0], [0.36, 0.2, 0], [0.4, 0.3, 0], [0.95, 0.32, 0]]} r={0.062}>{M.cromo()}</Tubo></group>
      {[[-0.73, 1.0], [0.52, 3.0]].map(([x, a], i) => <mesh key={i} position={[x + 0.12 + 0.1 * (1 - toc(a)), 0.42, 0.08]} rotation={[0, 0, P2]} visible={tt > a - 0.8 && tt < a + 0.8}><capsuleGeometry args={[0.035, 0.18, 6, 12]} /><meshStandardMaterial color="#e2b48f" roughness={0.6} /></mesh>)}
      {ondas(-0.85, 1.0, 2, "#9aa3ad", 0.45)}
      {ondas(0.4, 3.0, 9, "#ffd36a", 1.8)}
    </Estudio>
  </>;
}}</Stage>;

// 5 · EL GOLPE DE CALOR: el agua a 100 °C entra al caño y el rojo sólo alcanza el primer metro — ahí se castiga siempre lo mismo
const CGolpe: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const N = 16, f = eio(tt, 0.6, 2.6);
  return <>
    <Estudio t={tt} cam={[-0.2, 0.62, 1.55]} look={[-0.35, 0.24, 0]} orbit={0.05}>
      <Sifon p={[-1.2, 0.05, 0]} s={0.6} />
      {tt > 0.4 && <Chorro a={[-1.2, 0.9, 0]} b={[-1.2, 0.45, 0]} r={0.035} c="#d9eef8" o={0.8} />}
      <Vapor t={tt} p={[-1.2, 0.5, 0]} o={0.4 * eio(tt, 0.4, 1.0)} h={0.7} s={0.18} />
      <Vapor t={tt + 2} p={[-0.45, 0.3, 0]} o={0.3 * f} h={0.5} s={0.14} />
      {Array.from({ length: N }, (_, i) => { const x = -0.63 + i * 0.13, d = i / N * 2.0, heat = cl(f * 2.2 - d) * Math.exp(-d * 1.6);
        return <mesh key={i} position={[x, 0.24, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.047 + 0.01 * heat, 0.047 + 0.01 * heat, 0.128, 24]} /><meshPhysicalMaterial color={col("#eef1f3", CALOR, heat)} emissive={CALOR} emissiveIntensity={1.6 * heat} roughness={0.32} clearcoat={0.6} /></mesh>; })}
      <mesh position={[-0.25, 0.4, 0]} scale={[0.75 * eio(tt, 2.6, 3.4) + 0.001, 1, 1]}><boxGeometry args={[1, 0.012, 0.012]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>
    </Estudio>
  </>;
}}</Stage>;

// 6 · CADA DOMINGO, AÑOS: cinco sifones en fila, del nuevo al vencido; cada uno un poco más torcido y amarillo
const CAnios: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => (
  <Estudio t={tt} cam={[0, 0.75, 3.0]} look={[0, 0.32, 0]} orbit={0.06}>
    {Array.from({ length: 5 }, (_, i) => { const on = IN(tt, 0.4 + i * 0.75), d = i / 4;
      return <group key={i} position={[-1.35 + i * 0.6, 0.06 + 0.6 * (1 - Math.min(1, on)), 0]} scale={[0.62 * (1 + 0.15 * d), 0.62 * (1 - 0.22 * d), 0.62]} rotation={[0, 0, -0.2 * d]}>
        <Sifon s={1} x={0.35 * (1 - d)} tapon={d} tc={col("#efe4c0", "#b89a3a", d)} />
        <mesh position={[0.17, 0.02, 0]} scale={[0.2 * d + 0.001, 0.07 * d + 0.001, 0.07]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color={col("#e8d68a", "#9a7a2a", d)} roughness={0.8} /></mesh>
        <mesh position={[0.2, 0.3, 0]}><sphereGeometry args={[0.001, 4, 4]} /><meshBasicMaterial color={col("#ffffff", "#d9c27a", d)} /></mesh>
      </group>; })}
  </Estudio>
)}</Stage>;

// 7 · LA ROSCA OVALADA (Iván): la tuerca redonda se aplasta como un huevo — al lado, un huevo de verdad — y por la rendija se escapa la luz y una gota
const CHuevo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const ov = eio(tt, 1.0, 2.6), gk = cl((tt - 3.0) / 0.9);
  return <>
    <Estudio t={tt} cam={[0.05, 0.55, 1.15]} look={[0.05, 0.3, 0]} orbit={0.05}>
      <group position={[-0.22, 0.32, 0]} rotation={[P2, 0, 0]} scale={1.25}>
        <mesh scale={[1, 1, 1]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.3, 40, 1, true]} />{PVC(1)}</mesh>
        <mesh scale={[1 + 0.32 * ov, 1, 1 - 0.18 * ov]} castShadow><torusGeometry args={[0.17, 0.045, 16, 48]} />{PVC(1, "#e6e9ec")}</mesh>
        {ov > 0.3 && [-1, 1].map((k) => <mesh key={k} position={[k * (0.17 + 0.05 * ov), 0, 0]} scale={[0.02 + 0.05 * ov, 0.12, 0.05]}><sphereGeometry args={[1, 12, 8]} /><meshBasicMaterial color="#fff2c0" transparent opacity={0.7 * ov} toneMapped={false} /></mesh>)}
      </group>
      <group position={[0.36, 0.2 + fall(tt, 1.4, 1.0), 0.05]} rotation={[0, 0, P2]}><mesh scale={[0.17, 0.24, 0.17]} castShadow><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color="#efe2c8" roughness={0.6} /></mesh></group>
      {tt > 3.0 && <Gota p={[-0.22, 0.02, 0.12]} k={gk} h={0.3} />}
      <mesh position={[-0.22 + 0.25, 0.006, 0.35]} rotation={[-P2, 0, -0.5]} scale={[0.9 * ov + 0.001, 0.12, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#ffe6a0" transparent opacity={0.35 * ov} toneMapped={false} depthWrite={false} /></mesh>
    </Estudio>
    <></>
  </>;
}}</Stage>;

// 8 · LA GRASA SE MUDA: el tapón está en el sifón y la mano lo alcanza… el agua hirviendo lo empuja adentro de la pared y la mano choca contra el muro
const CMuda: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const v = eio(tt, 2.0, 3.8), mano1 = eio(tt, 0.5, 1.4) * (1 - eio(tt, 1.6, 2.0)), mano2 = eio(tt, 4.0, 4.8);
  const q: V3 = v < 0.5 ? [lerp(-0.6, 0.15, v * 2), 0.18, 0] : [lerp(0.15, 1.0, (v - 0.5) * 2), lerp(0.18, 0.18, v), 0];
  return <Estudio t={tt} cam={[0.3, 0.9, 2.5]} look={[0.3, 0.3, 0]} orbit={0.06} mesa={false}>
    <Tubo pts={[[-0.6, 0.7, 0], [-0.6, 0.18, 0], [1.4, 0.18, 0]]} r={0.07} o={0.4} />
    <mesh position={[0.65, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[0.18, 1.3, 0.8]} /><meshStandardMaterial map={ctex("ladrillo", 256, 512, (g) => { g.fillStyle = "#cfc6b6"; g.fillRect(0, 0, 256, 512); for (let r = 0; r < 16; r++) for (let c = 0; c < 4; c++) { g.fillStyle = ["#b0573a", "#a24e33", "#bb6244"][(r + c) % 3]; g.fillRect(c * 64 + (r % 2) * 32 - 32 + 3, r * 32 + 3, 58, 26); } })} roughness={0.9} /></mesh>
    <mesh position={[0.555, 0.18, 0]} rotation={[0, P2, 0]}><circleGeometry args={[0.09, 24]} /><meshBasicMaterial color="#120c08" /></mesh>
    <mesh position={q} scale={[0.16, 0.065, 0.065]}><sphereGeometry args={[1, 18, 12]} /><meshPhysicalMaterial color="#efe4c0" roughness={0.35} clearcoat={0.7} /></mesh>
    {v > 0 && v < 1 && <Chorro a={[-0.6, 0.7, 0]} b={[-0.6, 0.2, 0]} r={0.045} c="#d9eef8" o={0.8} />}
    <Vapor t={tt} p={[-0.6, 0.72, 0]} o={0.4 * (v > 0 && v < 1 ? 1 : 0)} h={0.6} s={0.16} />
    <Mano p={[-0.6 + 0.1 * (1 - mano1), 0.35, 0.35 - 0.2 * mano1]} rot={[0.3, -0.6, 0]} pinza={mano1} s={0.55} />
    <group visible={mano2 > 0.01}><Mano p={[0.42 + 0.06 * mano2 + 0.015 * Math.sin(tt * 30) * (mano2 > 0.95 ? 1 : 0), 0.3, 0.2]} rot={[0.3, -1.2, 0]} s={0.55} /></group>
  </Estudio>;
}}</Stage>;

// 9 · LA PIEDRA DE GRASA (doña Rosa): rebanada sobre rebanada — una por cada olla — se arma una piedra del tamaño de un puño
const CPiedra: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const N = 12;
  return <>
    <Estudio t={tt} cam={[0.1, 0.75, 1.75]} look={[0.1, 0.35, 0]} orbit={0.08}>
      <group position={[-0.05, 1.05, 0]} rotation={[0, 0, 0.5]}><Olla mat="peltre" s={0.3} nivel={0.6} caldo="#d9eef8" hervor={1} t={tt} /></group>
      <Vapor t={tt} p={[-0.05, 1.1, 0]} o={0.3} h={0.5} s={0.15} />
      {Array.from({ length: N }, (_, i) => { const a = 0.4 + i * 0.28, y = 0.02 + i * 0.022, r = 0.16 * Math.sin(((i + 0.5) / N) * P) + 0.03;
        return <group key={i} position={[0, y + fall(tt, a, 0.7), 0]} rotation={[0, rn(i, 1) * 3, 0]} visible={tt > a - 0.3}>
          <mesh scale={[r * (1 + 0.15 * rn(i, 2)), 1, r]} castShadow><cylinderGeometry args={[1, 1, 0.022, 20]} /><meshStandardMaterial color={col("#efe4c0", "#a99a78", i / N)} roughness={0.85} /></mesh></group>; })}
      <group visible={tt > 4.3}><Mano p={[0.42, 0.14 + fall(tt, 4.3, 0.9), 0.05]} rot={[0, -0.4, P2]} pinza={1} dedos={0} s={0.55} /></group>
    </Estudio>
  </>;
}}</Stage>;

// 10 · EL CHOQUE TÉRMICO: la loza en corte — la capa de adentro (roja) se estira con el calor, la de afuera (fría) no… y se raja
const CChoque: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const c = eio(tt, 0.8, 2.6), raja = eio(tt, 2.6, 3.4);
  const g = memo("rajaC", () => { const pts: V3[] = []; for (let i = 0; i <= 10; i++) pts.push([0.62 + (i % 2 ? 0.025 : -0.025), 0.05 + i * 0.07, 0]); return tuboGeo(pts, 0.008, 40); });
  return <Estudio t={tt} cam={[0.2, 0.9, 2.0]} look={[0, 0.4, 0]} orbit={0.06}>
    <mesh position={[0, 0.4, 0]} scale={[1 + 0.06 * c, 1, 1 + 0.06 * c]}><cylinderGeometry args={[0.5, 0.5, 0.75, 48, 1, true, 0, P]} /><meshStandardMaterial color={col("#f4f1ea", CALOR, c * 0.8)} emissive={CALOR} emissiveIntensity={0.4 * c} side={THREE.DoubleSide} roughness={0.3} /></mesh>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.6, 0.6, 0.75, 48, 1, true, 0, P]} /><meshStandardMaterial color={col("#fbfbf8", "#bcd8f0", 0.6)} side={THREE.DoubleSide} roughness={0.15} /></mesh>
    <mesh geometry={g} scale={[2.2, raja, 2.2]} position={[-0.75, 0, 0]} visible={raja > 0.01}><meshStandardMaterial color="#0e0c0a" roughness={1} /></mesh>
    {raja > 0.05 && Array.from({ length: 12 }, (_, i) => { const k = cl((tt - 2.7 - rn(i, 1) * 0.3) / 0.8); return <mesh key={"as" + i} position={[0.6 + 0.4 * k * rn(i, 2), 0.3 + 0.4 * rn(i, 3) + 0.3 * k - 0.8 * k * k, 0.05 + 0.3 * k]} rotation={[k * 5, i, k * 3]} scale={0.022 * (1 - 0.3 * k)}><tetrahedronGeometry args={[1]} /><meshStandardMaterial color="#f4f1ea" roughness={0.3} /></mesh>; })}
    <Vapor t={tt} p={[0, 0.7, 0.1]} o={0.25 * c} h={0.6} s={0.2} />
  </Estudio>;
}}</Stage>;

// 11 · LA FISURA COMO UN PELO: sobre la loza, un pelo de verdad y al lado la fisura del mismo ancho… por donde, mes a mes, sale una gota
const CPelo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pelo = eio(tt, 0.4, 1.4), fis = eio(tt, 1.6, 2.8), gota = eio(tt, 3.2, 5.0);
  const gp = memo("peloC", () => tuboGeo([[-0.45, 0.066, 0.12], [-0.1, 0.066, 0.16], [0.2, 0.066, 0.1], [0.45, 0.066, 0.14]], 0.006, 40));
  return <>
    <Estudio t={tt} cam={[0, 0.85, 0.9]} look={[0, 0.06, 0]} orbit={0.04}>
      <group position={[0, 0.03, 0]}><RBox s={[1.3, 0.06, 0.7]} r={0.02}>{LOZA()}</RBox></group>
      <mesh geometry={gp} scale={[pelo, 1, 1]}><meshPhysicalMaterial color="#2a1e16" roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 0.058, -0.08]} scale={[0.9 * fis + 0.001, 1, 1]}><boxGeometry args={[1, 0.008, 0.012]} /><meshBasicMaterial color="#141210" /></mesh>
      <mesh position={[0, 0.0605, -0.074]} scale={[0.9 * fis + 0.001, 1, 1]}><boxGeometry args={[1, 0.002, 0.003]} /><meshStandardMaterial color="#d8d2c4" /></mesh>
      <mesh position={[0.1, 0.064, -0.08 + 0.25 * cl((gota - 0.6) / 0.4) ** 2]} scale={[0.025 + 0.03 * gota, 0.016 + 0.014 * gota, 0.025 + 0.035 * gota]} visible={gota > 0.01}><sphereGeometry args={[1, 16, 12]} />{AGUA(0.85)}</mesh>
    </Estudio>
  </>;
}}</Stage>;

// 12 · EL ANILLO DE CERA: el inodoro se apoya en su anillo amarillo; el calor baja, la cera se ablanda y se aplasta, y por la base sale el olor
const CCera: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const cal = eio(tt, 0.8, 2.2), bl = eio(tt, 1.8, 3.6);
  return <Estudio t={tt} cam={[0.75, 0.42, 1.3]} look={[0, 0.18, -0.25]} orbit={0.06}>
    <group position={[0, 0.1 + 0.04 * (1 - bl), 0]}><Inodoro s={0.75} x={0.6} /></group>
    {Array.from({ length: 4 }, (_, i) => { const k = cl((tt - 0.8 - i * 0.3) / 1.2); return <mesh key={"ol" + i} position={[0, 0.9 - 0.75 * k, -0.3]} rotation={[P2, 0, 0]} scale={0.25 + 0.1 * k} visible={k > 0 && k < 1}><torusGeometry args={[1, 0.02, 8, 40]} /><meshBasicMaterial color={CALOR} transparent opacity={0.6 * Math.sin(P * k)} toneMapped={false} /></mesh>; })}
    {bl > 0.5 && Array.from({ length: 3 }, (_, i) => <mesh key={"lo" + i} geometry={memo("olorW" + i, () => tuboGeo(Array.from({ length: 8 }, (_, q) => [0.3 + i * 0.12 + 0.03 * Math.sin(q * 1.4), 0.1 + q * 0.06, -0.15] as V3), 0.006, 30))}><meshBasicMaterial color="#9ab84a" transparent opacity={0.8 * (bl - 0.5) * 2} toneMapped={false} /></mesh>)}
    <mesh position={[0, 0.07 - 0.02 * bl, -0.3]} rotation={[P2, 0, 0]} scale={[1 + 0.35 * bl, 1 + 0.35 * bl, 1 - 0.6 * bl]}><torusGeometry args={[0.13, 0.055, 14, 40]} /><meshStandardMaterial color={col("#e8c35a", "#ffb15a", cal)} emissive="#ff7a2a" emissiveIntensity={0.5 * cal} roughness={0.7} /></mesh>
    <mesh position={[0, 0.02, -0.3]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.9, 48]} /><meshStandardMaterial color="#cdc6b8" roughness={0.6} /></mesh>
    <group visible={bl > 0.5}>{Array.from({ length: 7 }, (_, i) => { const k = ((tt * 0.5 + i / 7) % 1), a = i * 0.9;
      return <mesh key={i} position={[Math.cos(a) * (0.25 + 0.2 * k), 0.06 + 0.5 * k, -0.3 + Math.sin(a) * (0.2 + 0.15 * k)]} scale={0.03 + 0.05 * k}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#8da23f" transparent opacity={0.45 * (1 - k) * (bl - 0.5) * 2} depthWrite={false} /></mesh>; })}</group>
  </Estudio>;
}}</Stage>;

// 13 · LA MANCHA EN EL TECHO DEL GARAJE: casa en corte, el inodoro arriba y, justo debajo, una mancha que se abre en el techo del garaje
const manchaTex = () => ctex("manchaC", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 10, 128, 128, 126);
  r.addColorStop(0, "rgba(110,90,60,.95)"); r.addColorStop(0.7, "rgba(140,115,80,.7)"); r.addColorStop(0.92, "rgba(120,95,60,.9)"); r.addColorStop(1, "rgba(120,95,60,0)"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
const CTecho: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const m = eio(tt, 1.2, 4.6);
  return <Estudio t={tt} cam={[0.2, lerp(1.2, 0.35, eio(tt, 0.8, 3.0)), lerp(2.6, 1.9, eio(tt, 0.8, 3.0))]} look={[0.1, lerp(0.9, 0.7, eio(tt, 0.8, 3.0)), 0]} orbit={0.05} mesa={false}>
    <mesh position={[0, 0.9, 0]} receiveShadow castShadow><boxGeometry args={[2.4, 0.1, 1]} /><meshStandardMaterial color="#e9e3d6" roughness={0.8} /></mesh>
    <mesh position={[0, 0.0, -0.5]}><boxGeometry args={[2.4, 2.0, 0.04]} /><meshStandardMaterial color="#c7c0b2" roughness={0.9} /></mesh>
    <group position={[0.1, 0.95, -0.05]}><Inodoro s={0.5} /></group>
    <mesh position={[0.1, 0.849, -0.1]} rotation={[P2, 0, 0]} scale={0.05 + 0.75 * m}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={manchaTex()} color={col("#ffffff", "#6a5a40", m)} transparent depthWrite={false} /></mesh>
    <group position={[-0.5, 0.22, 0.05]}><RBox s={[0.9, 0.28, 0.45]} r={0.08}><meshPhysicalMaterial color="#3c5a7a" roughness={0.3} clearcoat={1} /></RBox></group>
    {m > 0.5 && <Gota p={[0.1, 0.0, -0.1]} k={((tt - 3.2) % 1.0) / 1.0} h={0.84} c="#a99470" />}
  </Estudio>;
}}</Stage>;

// 14 · LOS CUATRO FREGADEROS: un mostrador giratorio presenta cada muestra cuando se nombra — acero, granito, cerámica, acrílico
const CMuestras: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const idx = [0, 1, 2, 3].filter((i) => tt >= rel(h, i) - 0.3).length - 1, ang = idx < 0 ? 0 : -idx * P2;
  const sp = idx < 0 ? 0 : eio(tt, rel(h, idx) - 0.3, rel(h, idx) + 0.6);
  const prev = idx <= 0 ? 0 : -(idx - 1) * P2, rot = idx < 0 ? 0 : lerp(prev, ang, sp);
  const mats = [ACERO(), <meshStandardMaterial color="#1f2124" roughness={0.75} />, <meshPhysicalMaterial color="#fbfbf8" roughness={0.12} clearcoat={1} />, <meshPhysicalMaterial color="#f2efe6" roughness={0.3} clearcoat={0.4} />];
  return <Estudio t={tt} cam={[0, 0.85, 2.3]} look={[0, 0.35, 0]} orbit={0.04}>
    <group rotation={[0, rot, 0]}>
      <mesh position={[0, 0.04, 0]} receiveShadow><cylinderGeometry args={[0.95, 0.95, 0.08, 64]} /><meshStandardMaterial color="#5a3e28" roughness={0.6} /></mesh>
      {[0, 1, 2, 3].map((i) => { const a = i * P2, on = IN(tt, rel(h, i) > 90 ? 0.5 + i : rel(h, i) - 0.2);
        return <group key={i} position={[Math.sin(a) * 0.6, 0.08 + 0.18 * Math.min(1, on), Math.cos(a) * 0.6]} rotation={[0, a, 0]}>
          <RBox s={[0.4, 0.06, 0.4]} r={0.03}>{mats[i]}</RBox>
          <mesh position={[0, 0.032, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.04, 0.06, 28]} />{M.cromo("#9aa0a6")}</mesh>
          <mesh position={[0, 0.031, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.04, 20]} /><meshBasicMaterial color="#060606" /></mesh>
          {i === 1 && <mesh position={[0, 0.031, 0]} rotation={[-P2, 0, 0]} scale={0.04 + 0.12 * cl(on - 0.3)}><circleGeometry args={[1, 32]} /><meshStandardMaterial color="#e9e6e0" roughness={0.9} /></mesh>}
          {i === 2 && <mesh position={[0.02, 0.031, 0]} rotation={[-P2, 0, 0.7]} scale={[0.32 * cl(on), 1, 1]}><planeGeometry args={[1, 0.006]} /><meshBasicMaterial color="#222" /></mesh>}
          {i === 3 && <group scale={[1, 1 + 0.3 * Math.sin(tt * 3) * cl(on - 0.3), 1]} />}
        </group>; })}
    </group>
    <pointLight position={[0, 0.9, 1.1]} intensity={idx >= 0 ? 4 * sp : 0} distance={1.8} color="#fff0d8" />
  </Estudio>;
}}</Stage>;

// 15 · LA MANCHA BLANCA (señora Teresa): el fregadero negro de granito y, donde cae el agua de los fideos, florece una mancha blanca que no sale
const blancoTex = () => ctex("blancoC", 256, 256, (g) => { const r = g.createRadialGradient(128, 128, 4, 128, 128, 126);
  r.addColorStop(0, "rgba(240,238,232,.95)"); r.addColorStop(0.6, "rgba(225,222,215,.7)"); r.addColorStop(1, "rgba(225,222,215,0)"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); });
const CTeresa: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ch = eio(tt, 0.7, 1.2) * (1 - eio(tt, 3.6, 4.0)), m = eio(tt, 1.2, 4.0);
  return <Estudio t={tt} cam={[0.1, 1.05, 1.75]} look={[0.15, 0.3, 0]} orbit={0.05}>
    <group position={[0, 0.02, 0]}><RBox s={[1.4, 0.04, 0.95]} r={0.02}><meshStandardMaterial color="#1d1f22" roughness={0.78} /></RBox></group>
    <mesh position={[0, 0.042, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.05, 0.075, 32]} />{M.cromo("#9aa0a6")}</mesh>
    <mesh position={[0, 0.041, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.05, 24]} /><meshBasicMaterial color="#060606" /></mesh>
    <mesh position={[0.1, 0.043, 0.05]} rotation={[-P2, 0, 0]} scale={[0.05 + 0.55 * m, 0.05 + 0.42 * m, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial map={blancoTex()} transparent depthWrite={false} /></mesh>
    <group position={[0.5, 0.75, 0.05]} rotation={[0, 0, 1.0 * ch]}><Olla mat="peltre" s={0.3} nivel={0.6} caldo="#e9e0c8" hervor={1} t={tt} /></group>
    {ch > 0.6 && <Chorro a={[0.33, 0.7, 0.05]} b={[0.1, 0.05, 0.05]} r={0.03} c="#efe8d6" o={0.8} />}
    <Vapor t={tt} p={[0.1, 0.05, 0.05]} o={0.25 * ch} h={0.8} s={0.2} />
  </Estudio>;
}}</Stage>;

// 16 · LA OLLA DE LOS FIDEOS CON LA FRÍA CORRIENDO: el chorro rojo de la olla y el azul de la canilla se juntan y al desagüe llega tibio
const CFideos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const fr = eio(tt, 0.5, 1.0), ol = eio(tt, 1.3, 2.0), mix = eio(tt, 2.0, 3.2);
  return <>
    <Estudio t={tt} cam={[0.1, 1.2, 2.15]} look={[0.1, 0.42, 0]} orbit={0.05}>
      <Tarja agua={0} />
      {mix > 0 && Array.from({ length: 36 }, (_, i) => { const u = i / 36, a = u * 6 * P - tt * 3, r = 0.3 * (1 - u) * (0.4 + 0.6 * mix); return <mesh key={"sp" + i} position={[Math.cos(a) * r, 0.035 + 0.01 * u, Math.sin(a) * r]} scale={0.025}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color={col(i % 2 ? CALOR : FRIO, "#a77ad8", mix * u * 1.4)} toneMapped={false} /></mesh>; })}
      <group position={[-0.3, 0.75, -0.3]} rotation={[0, 0.4, 0]}><mesh position={[0, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.5, 12]} />{M.cromo()}</mesh><mesh position={[0.12, 0.25, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.022, 0.022, 0.25, 12]} />{M.cromo()}</mesh></group>
      {fr > 0.5 && <Chorro a={[-0.2, 0.98, -0.25]} b={[-0.05, 0.03, 0]} r={0.035} c={FRIO} o={0.8} />}
      <group position={[0.55, 0.85, 0]} rotation={[0, 0, 1.1 * ol]}><Olla mat="peltre" s={0.32} nivel={0.6} caldo="#f0e7cf" hervor={1} t={tt} /></group>
      {ol > 0.6 && <Chorro a={[0.36, 0.8, 0]} b={[0.05, 0.03, 0]} r={0.04} c={CALOR} o={0.75} />}
      <Vapor t={tt} p={[0.2, 0.5, 0]} o={0.35 * ol} h={0.6} s={0.15} />
      <mesh position={[0, 0.03, 0]} rotation={[-P2, 0, 0]} scale={0.02 + 0.2 * mix}><circleGeometry args={[1, 40]} /><meshBasicMaterial color={col(CALOR, "#a77ad8", mix)} transparent opacity={0.8} depthWrite={false} toneMapped={false} /></mesh>
    </Estudio>
  </>;
}}</Stage>;

// 17 · EL ALMIDÓN ENGORDA LA GRASA: copos blancos del agua de la pasta se pegan uno a uno al tapón del sifón, que crece como bola de nieve
const CAlmidon: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const g = cl((tt - 0.6) / 3.8);
  return <Estudio t={tt} cam={[0.15, 0.7, 1.75]} look={[0.1, 0.35, 0]} orbit={0.06} mesa={false}>
    <Sifon x={1} s={1.4} agua={0.7} />
    <group position={[-0.35, 1.25, 0]} rotation={[0, 0, -1.0 * eio(tt, 0.2, 0.7)]}><Olla mat="peltre" s={0.32} nivel={0.6} caldo="#e9e3cf" hervor={1} t={tt} /></group>
    {tt > 0.6 && <Chorro a={[-0.15, 1.15, 0]} b={[0.0, 0.85, 0]} r={0.035} c="#ece6d2" o={0.7} />}
    <mesh position={[0.25, 0.0, 0]} scale={(0.05 + 0.08 * g) * (1 + 0.12 * Math.sin(tt * 9) * Math.exp(-3 * (((tt - 0.5) % 0.28) )))}><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color={col("#efe4c0", "#f8f6ef", g)} roughness={0.8} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const a = 0.5 + i * 0.28, k = cl((tt - a) / 0.8), ang = i * 2.4;
      const stick = [0.25 + Math.cos(ang) * (0.05 + 0.06 * g), Math.sin(ang) * (0.05 + 0.06 * g), 0.04 * Math.sin(i)] as V3;
      return k > 0 && <mesh key={i} position={[lerp(0.0, stick[0], k), lerp(0.85, stick[1], k), stick[2]]} rotation={[i, i * 2, 0]} scale={[0.05, 0.012, 0.04]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#fbf9f2" roughness={0.9} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 18 · EL AGUA DE LA PASTA A LAS PLANTAS: la jarra se enfría (el vapor se apaga), riega la maceta y la planta abre sus hojas
const CPlanta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const fria = eio(tt, 0.3, 1.8), vu = eio(tt, 2.0, 2.6) * (1 - eio(tt, 4.2, 4.6)), cr = eio(tt, 2.8, 5.2);
  return <Estudio t={tt} cam={[0.1, 0.8, 1.9]} look={[0, 0.35, 0]} orbit={0.08}>
    <group position={[lerp(1.5, 0.45, eio(tt, 0.0, 0.7)), 0.35 + 0.25 * vu, 0]} rotation={[0, 0, 1.0 * vu]}>
      <mesh castShadow><cylinderGeometry args={[0.13, 0.11, 0.32, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.12, 0.105, 0.2, 32]} />{AGUA(0.7, col("#f2e8cc", "#e8e2cf", fria))}</mesh>
    </group>
    <Vapor t={tt} p={[0.45, 0.55, 0]} o={0.6 * (1 - fria)} h={0.7} s={0.2} n={18} />
    {vu > 0.6 && <Chorro a={[0.3, 0.6, 0]} b={[-0.25, 0.28, 0]} r={0.022} c="#e8e2cf" o={0.75} />}
    {vu > 0.6 && Array.from({ length: 6 }, (_, i) => { const k = ((tt * 2 + i / 6) % 1); return <mesh key={"gt" + i} position={[-0.3 + Math.cos(i * 1.1) * 0.12 * k, 0.27 + 0.08 * Math.sin(k * P), Math.sin(i * 1.1) * 0.12 * k]} scale={0.012}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.9)}</mesh>; })}
    <group position={[-0.3, 0, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow><cylinderGeometry args={[0.18, 0.13, 0.26, 32]} />{M.barro("#b0603a")}</mesh>
      <mesh position={[0, 0.255, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.17, 32]} /><meshStandardMaterial color="#3b2a1e" roughness={1} /></mesh>
      <mesh position={[0, 0.3 + 0.15 * cr, 0]} scale={[1, 0.3 + cr, 1]}><cylinderGeometry args={[0.008, 0.01, 0.3, 6]} /><meshStandardMaterial color="#4f7a3a" /></mesh>
      {Array.from({ length: 6 }, (_, i) => { const a = i * 1.05, k = cl(cr * 1.4 - i * 0.12);
        return <mesh key={i} position={[Math.cos(a) * 0.08 * k, 0.3 + 0.05 * i * cr, Math.sin(a) * 0.08 * k]} rotation={[0.6, a, 0]} scale={[0.07 * k + 0.001, 0.003, 0.035 * k + 0.001]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#5f9a44" roughness={0.6} /></mesh>; })}
    </group>
  </Estudio>;
}}</Stage>;

// 19 · SOSA + AGUA HIRVIENDO = GÉISER: la pava echa agua sobre las escamas de sosa del desagüe… y sale disparado un chorro hacia arriba
const CGeiser: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const vu = eio(tt, 0.6, 1.2) * (1 - eio(tt, 2.0, 2.3)), g = cl((tt - 2.2) / 0.3) * (1 - eio(tt, 4.4, 5.2));
  return <>
    <Estudio t={tt} cam={[0.1, 0.85, 1.7]} look={[0.05, 0.55, 0]} orbit={0.05}>
      <Tarja />
      <Granos n={24} c="#f7f7f2" area={[0.1, 0.1]} y={0.03} s={2.2} />
      <group position={[0.5 + 0.01 * Math.sin(tt * 50) * g, 0.6, 0]} rotation={[0, P, -0.9 * vu]}><Tetera s={0.5} /></group>
      {vu > 0.5 && <Chorro a={[0.33, 0.62, 0]} b={[0.02, 0.03, 0]} r={0.03} c="#d9eef8" o={0.7} />}
      <Vapor t={tt} p={[0, 0.1, 0]} o={0.5 * g} h={1.4} s={0.25} n={16} />
      {g > 0 && Array.from({ length: 48 }, (_, i) => { const k = ((tt * 1.3 + rn(i, 1)) % 1), sp = 0.3 * rn(i, 2);
        return <mesh key={i} position={[(rn(i, 3) - 0.5) * sp * k, 0.05 + 1.6 * k * g - 0.6 * k * k, (rn(i, 4) - 0.2) * sp * k]} scale={0.025 + 0.035 * rn(i, 5)}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#eef3c4" emissive="#c8d86a" emissiveIntensity={0.3} transparent opacity={0.85 * (1 - k)} /></mesh>; })}
    </Estudio>
  </>;
}}</Stage>;

// 20 · TODO METAL, AGUANTA: tarja de acero, sifón de metal y caño de fierro; el calor recorre la cadena y cada pieza sólo brilla, derecha
const CMetal: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 3.4);
  const glint = (x: number) => Math.exp(-Math.pow((k * 2.6 - 0.2 - x) * 3, 2));
  return <>
    <Estudio t={tt} cam={[0.3, 0.75, 1.95]} look={[0.35, 0.4, 0]} orbit={0.06}>
      <group position={[-0.4, 0.62, 0]} scale={0.6}><Tarja /></group>
      <pointLight position={[lerp(-0.4, 1.4, k), lerp(0.8, 0.3, k), 0.3]} intensity={3.5 * Math.sin(P * k)} distance={1.0} color="#ff8a3a" />
      <mesh position={[lerp(-0.4, 1.4, k), lerp(0.66, 0.24, Math.min(1, k * 2)), 0]} scale={0.09 * Math.sin(P * k) + 0.001}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#ffb060" transparent opacity={0.5} toneMapped={false} depthWrite={false} /></mesh>
      <group position={[-0.4, 0.05, 0]} scale={0.6}><Tubo pts={[[0, 0.92, 0], [0, 0.12, 0], [0.06, 0.0, 0], [0.2, -0.02, 0], [0.32, 0.06, 0], [0.36, 0.2, 0], [0.4, 0.3, 0], [0.95, 0.32, 0]]} r={0.062}>
        <meshStandardMaterial color="#d8dade" roughness={0.18} metalness={1} emissive="#ffd9a0" emissiveIntensity={0.8 * glint(0.3)} /></Tubo></group>
      <Cano a={[0.17, 0.24, 0]} b={[1.5, 0.24, 0]} r={0.06}><meshStandardMaterial color="#2a2624" roughness={0.5} metalness={0.6} emissive="#ff9a50" emissiveIntensity={0.7 * glint(1.2)} /></Cano>
    </Estudio>
  </>;
}}</Stage>;

// 21 · MITAD Y MITAD: la jarra de la pava (roja) y la de la canilla (azul) vuelcan juntas en una tercera — sale a unos 60 grados
const CMitad: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const vu = eio(tt, 0.8, 1.5) * (1 - eio(tt, 3.4, 3.8)), lle = eio(tt, 1.4, 3.4);
  const Jarra = ({ x, c, lv, r }: { x: number; c: string; lv: number; r: number }) => <group position={[x, 0.22 + 0.32 * Math.abs(r) / 1.1, 0]} rotation={[0, 0, r]}>
    <mesh castShadow><cylinderGeometry args={[0.13, 0.11, 0.34, 32, 1, true]} />{M.vidrio()}</mesh>
    {lv > 0.02 && <mesh position={[0, -0.17 + 0.15 * lv, 0]}><cylinderGeometry args={[0.12, 0.105, 0.3 * lv, 32]} />{AGUA(0.8, c)}</mesh>}
  </group>;
  return <>
    <Estudio t={tt} cam={[0, 0.7, 1.75]} look={[0, 0.4, 0]} orbit={0.05}>
      <group position={[-0.08 - 0.5 * (1 - IN(tt, 0.1)), 0, 0]} scale={1.3}><Jarra x={-0.35} c={CALOR} lv={1 - lle} r={-1.1 * vu} /></group>
      <group position={[0.08 + 0.5 * (1 - IN(tt, 0.4)), 0, 0]} scale={1.3}><Jarra x={0.35} c={FRIO} lv={1 - lle} r={1.1 * vu} /></group>
      <group scale={1.3}><Jarra x={0} c={col("#c86a9a", "#a77ad8", lle)} lv={lle} r={0} /></group>
      <Termometro p={[0.12, 0.42, 0.12]} s={0.9} v={lerp(20, 60, lle)} />
      <Vapor t={tt} p={[-0.45, 0.6, 0]} o={0.35} h={0.4} s={0.12} />
      {vu > 0.6 && <><Chorro a={[-0.32, 0.72, 0]} b={[-0.04, 0.3, 0]} r={0.03} c={CALOR} o={0.8} /><Chorro a={[0.32, 0.72, 0]} b={[0.04, 0.3, 0]} r={0.03} c={FRIO} o={0.8} /></>}
    </Estudio>
  </>;
}}</Stage>;

// 22 · LA REGLA DE LA MANO: la mano entra bajo el chorro, un aro alrededor de la muñeca cuenta 1… 2… 3 y la mano salta para atrás
const CMano: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ent = eio(tt, 0.4, 1.0), cuenta = cl((tt - 1.1) / 2.6), sale = eio(tt, 3.7, 4.0);
  return <>
    <Estudio t={tt} cam={[0.2, 0.9, 1.6]} look={[0, 0.45, 0]} orbit={0.05}>
      <group position={[0, 1.0, -0.15]}><mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />{M.cromo()}</mesh></group>
      <Chorro a={[0, 0.98, 0]} b={[0, 0.0, 0]} r={0.034} c={col("#bfe0f2", CALOR, 0.5)} o={0.7} />
      <Vapor t={tt} p={[0, 0.5, 0]} o={0.4} h={0.6} s={0.16} />
      <mesh position={[lerp(0.9, 0.4, ent) + 0.7 * sale, 0.5 + 0.12 * sale, 0.01]} rotation={[0, 0, 0]} scale={cuenta > 0 ? 1 : 0.001}><planeGeometry args={[0.18, 0.18]} /><meshBasicMaterial map={ctex("cuentaM" + (tt < 2.0 ? 1 : tt < 2.9 ? 2 : 3), 128, 128, (g) => { g.clearRect(0, 0, 128, 128); g.fillStyle = "#ffffff"; g.font = "900 110px Arial"; g.textAlign = "center"; g.fillText(String(tt < 2.0 ? 1 : tt < 2.9 ? 2 : 3), 64, 104); })} transparent toneMapped={false} /></mesh>
      <Mano p={[lerp(0.9, 0.12, ent) + 0.7 * phys(tt, 3.7, 7, 0.35), 0.5 + 0.12 * sale, 0]} rot={[0, P, 0.2 + 0.3 * sale]} s={0.75} />
      <mesh position={[lerp(0.9, 0.4, ent) + 0.7 * sale, 0.5 + 0.12 * sale, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.14, 0.022, 8, 48, 2 * P * cuenta + 0.001]} /><meshBasicMaterial color={col(VER, RED, cuenta)} toneMapped={false} /></mesh>
    </Estudio>
  </>;
}}</Stage>;

// 23 · EL ASCENSOR DE LOS GRADOS: una plataforma sube por la escala — a 45 la grasa se derrite, a 60 el caño se ablanda, a 100 hierve
const CEscala: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const y = eio(tt, 0.6, 4.6), Y = (g: number) => 0.1 + (g / 100) * 1.4, py = 0.1 + y * 1.4;
  const der = cl((py - Y(45)) / 0.12), abl = cl((py - Y(60)) / 0.12), hie = cl((py - Y(98)) / 0.05);
  return <Estudio t={tt} cam={[0.25, py + 0.35, 1.9]} look={[0.05, py + 0.05, 0]} orbit={0.04}>
    <mesh position={[-0.5, 0.8, 0]}><boxGeometry args={[0.05, 1.5, 0.05]} /><meshStandardMaterial color="#c9a46a" /></mesh>
    {[[45, "#f1ead2"], [60, "#eef1f3"], [100, "#7fb6d8"]].map(([g, c], i) => <group key={i} position={[-0.45, Y(g as number), 0]}>
      <mesh position={[0.4, 0, 0]}><boxGeometry args={[0.8, 0.01, 0.01]} /><meshBasicMaterial color={c as string} /></mesh>
      <mesh position={[-0.2, 0, 0.03]}><planeGeometry args={[0.28, 0.12]} /><meshBasicMaterial map={ctex("grado" + g, 160, 70, (gg) => { gg.fillStyle = "#16222e"; gg.fillRect(0, 0, 160, 70); gg.fillStyle = "#f6f1e4"; gg.font = "800 52px Arial"; gg.textAlign = "center"; gg.fillText(`${g}°`, 80, 54); })} /></mesh>
    </group>)}
    <group position={[0.2, py, 0]}>
      <mesh position={[0, -0.02, 0]} castShadow><boxGeometry args={[0.8, 0.03, 0.4]} /><meshStandardMaterial color="#2e3640" /></mesh>
      <mesh position={[-0.25, 0.08 - 0.05 * der, 0]} scale={[1 + 0.6 * der, 1 - 0.7 * der, 1 + 0.6 * der]} castShadow><boxGeometry args={[0.16, 0.16, 0.16]} />{GRASA()}</mesh>
      <group position={[0.3, 0.0, 0]}><Olla mat="peltre" s={0.18} nivel={0.6} caldo="#d9eef8" hervor={hie} t={tt} /></group>
      <group position={[0.0, 0.08, 0]} rotation={[0, 0, -0.6 * abl]}><mesh rotation={[0, 0, P2]} scale={[1, 1, 1 - 0.35 * abl]}><cylinderGeometry args={[0.065, 0.065, 0.32, 24]} />{PVC(1, col("#eef1f3", "#ffd0b0", abl), 0.2 * abl)}</mesh></group>
      <group visible={hie > 0.01}><Vapor t={tt} p={[0.3, 0.05, 0]} o={0.3 * hie} h={0.4} s={0.12} /></group>
    </group>
  </Estudio>;
}}</Stage>;

// 24 · EL TERMÓMETRO DE PINCHAR: la punta entra al vaso de agua de la canilla y los números suben solos hasta 58
const CPinchar: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ent = eio(tt, 0.4, 1.2), v = Math.round(lerp(21, 58, eio(tt, 1.2, 3.6)));
  return <>
    <Estudio t={tt} cam={[0, 0.62, 1.35]} look={[0, 0.42, 0]} orbit={0.05}>
      <pointLight position={[0.1, 0.9, 0.4]} intensity={v >= 58 ? 3 * (1 - cl((tt - 3.6) / 0.8)) : 0} distance={1.2} color="#7fe08a" />
      <Vapor t={tt} p={[0, 0.3, 0]} o={0.15} h={0.3} s={0.1} />
      <group position={[0, 0.0, 0]}><mesh position={[0, 0.17, 0]} castShadow><cylinderGeometry args={[0.15, 0.13, 0.34, 32, 1, true]} />{M.vidrio()}</mesh>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.14, 0.125, 0.26, 32]} />{AGUA(0.6, "#bfe0f2")}</mesh></group>
      <group position={[0.05, 0.9 - 0.42 * ent, 0]} rotation={[0, 0, -0.15]} scale={1.5}>
        <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 8]} />{M.cromo()}</mesh>
        <mesh position={[0, 0.07, 0]} castShadow><boxGeometry args={[0.2, 0.14, 0.05]} /><meshStandardMaterial color="#e8432e" roughness={0.4} /></mesh>
        <mesh position={[0, 0.07, 0.026]}><planeGeometry args={[0.16, 0.09]} /><meshBasicMaterial map={ctex("lcd" + v, 160, 90, (g) => { g.fillStyle = "#c9d6b0"; g.fillRect(0, 0, 160, 90); g.fillStyle = "#1a2214"; g.font = "800 64px Arial"; g.textAlign = "center"; g.fillText(`${v}°`, 80, 68); })} /></mesh>
      </group>
    </Estudio>
  </>;
}}</Stage>;

// 25 · EL JABÓN ABRAZA LA GRASA: las moléculas del lavavajillas (cabecita y colita) rodean cada gota de grasa y la sueltan en pelotitas
const CMicela: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 3.0), va = eio(tt, 3.4, 5.6);
  return <Estudio t={tt} cam={[0, 0.6, 1.8]} look={[0, 0.4, 0]} orbit={0.08} mesa={false}>
    {[[-0.45, 0.45], [0.05, 0.6], [0.45, 0.35]].map(([x, y], j) => <group key={j} position={[x + 1.2 * va, y + 0.05 * Math.sin(tt * 2 + j), 0]}>
      <mesh scale={0.1 * (1 - 0.6 * va)}><sphereGeometry args={[1, 24, 16]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.1} clearcoat={1} /></mesh>
      {va > 0 && Array.from({ length: 5 }, (_, q) => <mesh key={"pb" + q} position={[Math.cos(q * 1.26) * 0.14 * va, Math.sin(q * 1.26) * 0.14 * va, 0]} scale={0.035 * va}><sphereGeometry args={[1, 12, 10]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.1} clearcoat={1} /></mesh>)}
      {Array.from({ length: 14 }, (_, i) => { const th = (i / 14) * 2 * P, ph = (i % 2 ? 0.6 : -0.6), d = lerp(0.9, 0.16, eio(tt, 0.6 + i * 0.12 + j * 0.2, 1.2 + i * 0.12 + j * 0.2));
        const dir = new THREE.Vector3(Math.cos(th) * Math.cos(ph), Math.sin(ph), Math.sin(th) * Math.cos(ph)).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        return <group key={i} position={dir.clone().multiplyScalar(d).toArray() as V3} quaternion={q}>
          <mesh position={[0, 0.035, 0]} scale={0.022}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#4aa8ff" roughness={0.3} /></mesh>
          <mesh position={[0, -0.0, 0]}><cylinderGeometry args={[0.004, 0.004, 0.06, 6]} /><meshStandardMaterial color="#f2c230" /></mesh>
        </group>; })}
    </group>)}
  </Estudio>;
}}</Stage>;

// 26 · ACEITE Y AGUA NO SE MEZCLAN: en el vaso, la capa amarilla flota quieta; cae una gota de jabón y todo se vuelve lechoso
const CVaso: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const gota = eio(tt, 1.6, 2.2), mez = eio(tt, 2.2, 4.0);
  return <Estudio t={tt} cam={[0, 0.5, 1.2]} look={[0, 0.3, 0]} orbit={0.05}>
    <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.18, 0.16, 0.44, 40, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.17, 0.155, 0.24 + 0.08 * mez, 40]} />{AGUA(0.75, col("#9fd0ee", "#f0ead6", mez))}</mesh>
    <mesh position={[0, 0.29, 0]} scale={[1, 1 - 0.95 * mez, 1]} visible={mez < 0.98}><cylinderGeometry args={[0.172, 0.17, 0.08, 40]} /><meshPhysicalMaterial color="#e8b84a" roughness={0.05} clearcoat={1} transparent opacity={0.85} /></mesh>
    <Gota p={[0, 0.34, 0]} k={gota} h={0.4} c="#59c26a" />
    <group position={[lerp(0.4, 0.16, eio(tt, 0.6, 1.4)), lerp(0.0, 0.5, eio(tt, 0.6, 1.4)), 0]} rotation={[0, 0, 2.2 * eio(tt, 0.9, 1.5)]}><Botella s={0.45} c="#59c26a" /></group>
    <mesh position={[0, 0.22 - 0.05 * mez, 0]} scale={0.02 + 0.17 * mez}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#f6f3ea" transparent opacity={0.55 * Math.min(1, mez * 3)} depthWrite={false} /></mesh>
    {mez > 0 && mez < 1 && Array.from({ length: 10 }, (_, i) => <mesh key={"ac" + i} position={[Math.cos(i * 0.63) * 0.12 * mez, 0.29 - 0.05 * mez * rn(i, 1), Math.sin(i * 0.63) * 0.12 * mez]} scale={0.018}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8b84a" roughness={0.05} clearcoat={1} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 27 · DE GOLPE vs DESPACITO: la olla volcada de una se queda en la tarja y se enfría (rojo→azul); el chorro finito entra todo y el caño sigue rojo
const CDespacio: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const enf = eio(tt, 1.4, 4.6), fl = eio(tt, 0.6, 1.2);
  return <>
    <Estudio t={tt} cam={[0, 1.1, 2.3]} look={[0, 0.15, 0]} orbit={0.04}>
      <group position={[-0.3, 0.7, 0]} rotation={[0, 0, 1.6 * eio(tt, 0.3, 0.7)]} visible={tt < 1.6}><Olla mat="peltre" s={0.3} nivel={0.7 * (1 - fl)} caldo="#ff9a6a" hervor={1} t={tt} /></group>
      {fl > 0.05 && fl < 0.95 && <Chorro a={[-0.5, 0.6, 0]} b={[-0.65, 0.05, 0]} r={0.09} c={CALOR} o={0.75} />}
      <Vapor t={tt} p={[-0.65, 0.1, 0]} o={0.4 * (1 - enf)} h={0.6} s={0.18} />
      <Vapor t={tt + 2} p={[0.65, -0.3, 0]} o={0.3} h={0.5} s={0.12} />
      <group position={[-0.65, 0, 0]} scale={0.72}><Tarja agua={0.8 * fl} ac={col(CALOR, FRIO, enf)} />
        <Cano a={[0, -0.02, 0]} b={[0, -0.7, 0]} r={0.06}><meshStandardMaterial color={col("#eef1f3", "#bcd8f0", enf)} /></Cano></group>
      <group position={[0.65, 0, 0]} scale={0.72}><Tarja agua={0} />
        {tt > 0.6 && <Chorro a={[0.15, 1.0, 0]} b={[0, 0.02, 0]} r={0.018} c={CALOR} o={0.8} />}
        <Cano a={[0, -0.02, 0]} b={[0, -0.7, 0]} r={0.06}><meshStandardMaterial color={col("#eef1f3", CALOR, fl)} emissive={CALOR} emissiveIntensity={0.6 * fl} /></Cano></group>
    </Estudio>
  </>;
}}</Stage>;

// 28 · PRIMERO VACIAR: la tarja llena de agua fría estancada; el vaso va y viene a la cubeta y el nivel baja
const CVaciar: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ciclo = (tt - 0.6) / 1.1, n = Math.max(0, Math.min(4, Math.floor(ciclo))), ph = ciclo - Math.floor(ciclo);
  const lv = 0.85 - 0.18 * (n + (tt > 0.6 && n < 4 ? eio(ph, 0.3, 0.5) : 0));
  const vx = tt < 0.6 || n >= 4 ? 0.1 : lerp(0.1, 0.9, Math.sin(ph * P));
  return <Estudio t={tt} cam={[0.5, 1.15, 2.45]} look={[0.45, 0.15, 0]} orbit={0.05}>
    <Tarja agua={lv} ac="#5f8fb8" nata={0.6} />
    <Cubeta p={[1.0, -0.15, 0.2]} s={0.6} nivel={0.15 + 0.12 * n} agua="#7f97a8" />
    <group position={[vx, 0.45 + 0.2 * Math.sin(ph * P), 0.05]} rotation={[0, 0, Math.sin(ph * P) > 0.85 ? -1.2 : 0]}><group scale={1.7}><mesh castShadow><cylinderGeometry args={[0.06, 0.05, 0.14, 24, 1, true]} />{M.vidrio()}</mesh><mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.055, 0.048, 0.08, 24]} />{AGUA(0.7, "#5f8fb8")}</mesh></group></group>
  </Estudio>;
}}</Stage>;

// 29 · LA REVISIÓN EN CINCO MINUTOS: cuatro estaciones bajo el mueble que se encienden cuando se nombran
const CRevision: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const on = (i: number) => IN(tt, rel(h, i) > 90 ? 0.6 + i * 1.2 : rel(h, i));
  const X = [-1.05, -0.35, 0.35, 1.05];
  return <Estudio t={tt} cam={[0, 0.85, 2.45]} look={[0, 0.25, 0]} orbit={0.05}>
    {X.map((x, i) => <group key={i} position={[x, 0, 0]}><pointLight position={[0, 1.0, 0.5]} intensity={0.01 + 3.5 * Math.min(1, on(i)) * (on(i + 1) > 0.5 && i < 3 ? 0.15 : 1)} distance={1.6} color="#fff0d8" /></group>)}
    {/* 1 · la mano seca con gotitas */}
    <group position={[X[0], 0.25 + 0.4 * (1 - Math.min(1, on(0))), 0]}><Mano p={[0, 0, 0]} rot={[0, -0.4, 0]} s={0.7} />
      {[0, 1, 2].map((i) => <mesh key={i} position={[-0.06 + i * 0.06, 0.04, 0.05]} scale={0.014 * cl(on(0))}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.9)}</mesh>)}</group>
    {/* 2 · papel de cocina con gotas */}
    <group position={[X[1], 0.01 + 0.4 * (1 - Math.min(1, on(1))), 0]}><mesh rotation={[-P2, 0, 0.1]}><planeGeometry args={[0.45, 0.4]} /><meshStandardMaterial color="#f7f5ee" roughness={1} /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.3, 0.003, (rn(i, 2) - 0.5) * 0.3]} rotation={[-P2, 0, 0]} scale={0.03 * cl(on(1) * 1.5 - 0.5)}><circleGeometry args={[1, 18]} /><meshStandardMaterial color="#b9c8cf" /></mesh>)}</group>
    {/* 3 · el sifón torcido contra la silueta derecha */}
    <group position={[X[2] - 0.2, 0.1 + 0.4 * (1 - Math.min(1, on(2))), 0]} scale={0.5}><Sifon rot={[0, 0, -0.2 * cl(on(2))]} />
      <group position={[0, 0, -0.08]}><Tubo pts={[[0, 0.62, 0], [0, 0.12, 0], [0.06, 0.0, 0], [0.2, -0.02, 0], [0.32, 0.06, 0], [0.36, 0.2, 0], [0.4, 0.3, 0], [0.95, 0.32, 0]]} r={0.064}><meshBasicMaterial color="#7fe0a0" wireframe transparent opacity={0.5} /></Tubo></group></group>
    {/* 4 · la madera hinchada */}
    <group position={[X[3], 0.05, 0]}><mesh scale={[1, 1 + 1.6 * cl(on(3)), 1]} castShadow><boxGeometry args={[0.45, 0.04, 0.35]} /><meshStandardMaterial color={col(MAD, "#6b4a2c", cl(on(3)))} roughness={0.9} /></mesh></group>
  </Estudio>;
}}</Stage>;

// 30 · CAMBIAR EL SIFÓN A MANO: el viejo, torcido y amarillo, se va girando; el nuevo cae blanco en su lugar y las tuercas giran solas
const CCambio: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const va = eio(tt, 0.8, 2.0), vi = fall(tt, 2.2, 1.2), nut = eio(tt, 3.4, 4.4) * 6;
  return <>
    <Estudio t={tt} cam={[0.3, 0.7, 2.0]} look={[0.25, 0.3, 0]} orbit={0.06}>
      <Mueble />
      <group position={[-0.2 - 0.9 * va, 0.15 + 0.5 * va, 0]} rotation={[0, 0, -0.2 - 1.2 * va]} scale={[0.75 * 1.12, 0.75 * 0.88, 0.75]} visible={va < 0.99}><Sifon tapon={1} tc="#c9a84a" agua={0.4} /></group>
      <group position={[-0.2, 0.15 + vi, 0]} visible={tt > 2.2}><Sifon s={0.75} nut={nut} /></group>
    </Estudio>
  </>;
}}</Stage>;

// 31 · LOS CINCO ERRORES EN LA COCINA: cinco hornallas; al nombrar cada error, su llama sube y su olla rebalsa
const CErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => { const A = [0, 1, 2, 3, 4].map((i) => rel(h, i) > 90 ? 0.6 + i * 1.1 : rel(h, i)), cx = A.reduce((s, a, i) => s + (i ? 0.6 * eio(tt, a - 0.3, a + 0.4) : 0), -1.2); return (
  <Estudio t={tt} cam={[cx * 0.85, 0.95, 1.75]} look={[cx, 0.2, 0]} orbit={0.04}>
    <mesh position={[0, 0.02, 0]} receiveShadow><boxGeometry args={[3.0, 0.04, 0.9]} /><meshStandardMaterial color="#1c1c1e" roughness={0.3} metalness={0.4} /></mesh>
    {[0, 1, 2, 3, 4].map((i) => { const x = -1.2 + i * 0.6, a = rel(h, i) > 90 ? 0.6 + i * 1.1 : rel(h, i), f = eio(tt, a, a + 0.4), rb = eio(tt, a + 0.5, a + 1.5);
      return <group key={i} position={[x, 0.04, 0]}>
        <Llama p={[0, 0, 0]} f={0.15 + 0.85 * f} t={tt} r={0.14} />
        <group position={[0, 0.06, 0]}><Olla mat="peltre" s={0.22} nivel={0.6 + 0.4 * rb} caldo="#d9eef8" hervor={f} t={tt + i} /></group>
        {rb > 0.2 && <mesh position={[0.14, 0.12, 0.05]} scale={[0.02, 0.1 * rb, 0.02]}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.8, "#d9eef8")}</mesh>}
        <Vapor t={tt + i} p={[0, 0.25, 0]} o={0.25 * f} h={0.5} s={0.1} />
      </group>; })}
  </Estudio>
); }}</Stage>;

// 32 · LA RUTINA EN TRES TABLAS: tres tablas de madera se paran de a una — bicarbonato al desagüe, jarra despacito con jabón, canilla corriendo con el caño tibio
const CRutina: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const on = (i: number) => IN(tt, rel(h, i) > 90 ? 0.6 + i * 1.3 : rel(h, i));
  const X = [-1.0, 0, 1.0];
  return <Estudio t={tt} cam={[0, 0.75, 2.45]} look={[0, 0.45, 0]} orbit={0.05}>
    {X.map((x, i) => <group key={i} position={[x, 0, -0.15]} rotation={[-P2 * (1 - on(i)), 0, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[0.85, 0.9, 0.04]} /><meshStandardMaterial map={ctex("vetaR", 256, 256, (g) => { g.fillStyle = "#c9a46a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#a9824a"; g.lineWidth = 3; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(0, i * 15); for (let x = 0; x <= 256; x += 16) g.lineTo(x, i * 15 + 5 * Math.sin(x * 0.03 + i)); g.stroke(); } })} roughness={0.8} /></mesh>
    </group>)}
    <group position={[X[0], 0.0, 0.2]} visible={on(0) > 0.6}><Taza p={[0.1, 0.55 + 0.1 * Math.sin(tt), 0]} rot={[0, 0, -1.2]} s={1.0} lleno={1} c="#f7f7f2" cuerpo="#d6362c" />
      <Granos n={22} c="#f7f7f2" area={[0.07, 0.07]} y={0.1 + ((tt * 0.8) % 0.4)} s={2} /><Rejilla p={[0, 0.062, 0]} s={0.5} /><mesh position={[0, 0.06, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.08, 24]} /><meshBasicMaterial color="#0b0b0b" /></mesh></group>
    <group position={[X[1], 0, 0.2]} visible={on(1) > 0.6}><group position={[0.2, 0.62, 0]} rotation={[0, 0, 0.9]} scale={1.5}><mesh><cylinderGeometry args={[0.1, 0.09, 0.24, 24, 1, true]} />{M.vidrio()}</mesh><mesh position={[0, -0.04, 0]}><cylinderGeometry args={[0.095, 0.088, 0.12, 24]} />{AGUA(0.7, "#d8ecf6")}</mesh>{[0, 1, 2, 3, 4].map((q) => <mesh key={q} position={[0.03 * Math.sin(q * 2.1), 0.03 + 0.02 * q, 0.03 * Math.cos(q * 2.1)]} scale={0.012}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0} iridescence={1} /></mesh>)}</group>
      <Chorro a={[0.06, 0.62, 0]} b={[0, 0.06, 0]} r={0.016} c="#d8ecf6" o={0.8} /><mesh position={[0, 0.06, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.08, 24]} /><meshBasicMaterial color="#0b0b0b" /></mesh></group>
    <group position={[X[2], 0, 0.2]} visible={on(2) > 0.6}><mesh position={[0, 0.8, -0.05]} rotation={[P2, 0, 0]} scale={1.6}><cylinderGeometry args={[0.025, 0.025, 0.2, 12]} />{M.cromo()}</mesh>
      <Chorro a={[0, 0.78, 0]} b={[0, 0.3, 0]} r={0.026} c="#ffc2a0" o={0.8} /><Vapor t={tt} p={[0, 0.35, 0.05]} o={0.3 * Math.min(1, on(2))} h={0.4} s={0.1} />
      <Cano a={[0, 0.3, 0]} b={[0, 0.0, 0]} r={0.05}><meshStandardMaterial color={col("#eef1f3", "#ffb08a", Math.min(1, on(2)))} emissive={CALOR} emissiveIntensity={0.35 * Math.min(1, on(2))} /></Cano></group>
  </Estudio>;
}}</Stage>;

// 33 · LA PRUEBA DE AURELIO: el pedazo de sifón sale de la olla con la pinza, los dedos lo doblan como goma y se queda doblado para siempre
const CAurelio: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.8, 1.8), dob = Math.round(eio(tt, 2.2, 3.6) * 20) / 20;
  const g = memo("aur" + dob, () => { const pts: V3[] = []; for (let i = 0; i <= 12; i++) { const s = i / 12 - 0.5, a = s * 2.2 * dob; pts.push([dob > 0.01 ? Math.sin(a) / (2.2 * dob) * 0.5 : s * 0.5, dob > 0.01 ? (1 - Math.cos(a)) / (2.2 * dob) * 0.5 : 0, 0]); } return tuboGeo(pts, 0.05, 40); });
  return <Estudio t={tt} cam={[0.05, 0.78, 1.35]} look={[-0.05, 0.5, 0]} orbit={0.06}>
    <Vapor t={tt} p={[lerp(-0.5, 0.2, sube), lerp(0.3, 0.8, sube), 0]} o={0.45 * (1 - eio(tt, 2.4, 4.0))} h={0.4} s={0.1} />
    <group visible={sube > 0.01 && dob < 0.05}><Mano p={[lerp(-0.5, 0.2, sube) + 0.28, lerp(0.25, 0.75, sube) + 0.02, 0.04]} rot={[0, -1.4, 0]} pinza={1} s={0.55} /></group>
    {dob > 0.6 && <mesh position={[0.2, 0.75 + 0.11 * dob, 0.05]} rotation={[0, 0, 0]} scale={[0.012, 0.05, 0.012]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#b9b5aa" roughness={0.9} /></mesh>}
    <Olla mat="peltre" p={[-0.5, 0, 0]} s={0.4} nivel={0.7} caldo="#d9eef8" hervor={1} t={tt} />
    <Vapor t={tt} p={[-0.5, 0.35, 0]} o={0.25} h={0.6} s={0.15} />
    <group position={[lerp(-0.5, 0.2, sube), lerp(0.25, 0.75, sube), 0]} rotation={[0, 0, P2 * (1 - sube)]}>
      <mesh geometry={g} castShadow>{PVC(1, "#f2f2ee")}</mesh>
      {dob > 0.01 && [-1, 1].map((k) => <group key={k}><Guante p={[k * 0.26, 0.05 * dob, 0.03]} rot={[0, 0, k * (0.8 + 0.6 * dob)]} s={0.4} /></group>)}
    </group>
  </Estudio>;
}}</Stage>;

// 34 · LA CABAÑA EN LA NIEVE: cae nieve sobre la cabaña; el caño de fierro escarchado y la grasa que se cuaja blanca de golpe — hasta que llegan la rejilla y el frasco
const CCabana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const cu = eio(tt, 1.0, 2.6), sol = IN(tt, 3.6);
  return <Estudio t={tt} cam={[0.25, 0.75, 1.9]} look={[0.2, 0.3, 0]} orbit={0.06}>
    {Array.from({ length: 36 }, (_, i) => { const x = -0.2 + i * 0.03, k = cl(cu * 1.6 - i * 0.025); return <mesh key={"es" + i} position={[x, 0.12 + 0.07 * Math.cos(i * 2.3), 0.1 + 0.07 * Math.sin(i * 2.3)]} scale={0.022 * k + 0.001}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#f2fbff" roughness={0.2} metalness={0.1} /></mesh>; })}
    <group position={[-0.6, 0, -0.3]}><mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[0.7, 0.6, 0.6]} />{M.madera("#6b4527")}</mesh>
      <mesh position={[0, 0.75, 0]} rotation={[0, P / 4, 0]} castShadow><coneGeometry args={[0.6, 0.4, 4]} /><meshStandardMaterial color="#f4f6f8" roughness={0.9} /></mesh></group>
    <Cano a={[-0.25, 0.12, 0.1]} b={[0.9, 0.12, 0.1]} r={0.07}><meshStandardMaterial color={col("#2a2624", "#e6f2f8", 0.2 + 0.65 * cu)} roughness={0.6 - 0.3 * cu} metalness={0.4} /></Cano>
    <mesh position={[0.3, 0.12, 0.1]} scale={[0.2 * cu + 0.001, 0.062, 0.062]}><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color={col("#e8c35a", "#f8f6ef", cu)} roughness={0.8} flatShading /></mesh>
    {Array.from({ length: 40 }, (_, i) => { const k = ((tt * 0.25 + rn(i, 1)) % 1);
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 3, 1.6 - 1.7 * k, (rn(i, 3) - 0.5) * 1.5]} scale={0.012}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>; })}
    <group visible={sol > 0.01} scale={Math.max(0.001, Math.min(1.1, sol))}>
      <Rejilla p={[0.05, 0.02, 0.55]} s={0.85} />
      <Frasco p={[0.5, 0.0, 0.5]} s={0.85} lleno={0.5} />
    </group>
  </Estudio>;
}}</Stage>;

// 35 · LA CASA DESAGÜE POR DESAGÜE: casita de muñecas en corte; cada desagüe se enciende cuando se nombra
const CCasa: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const N = (h.items ?? []).length || 6, on = (i: number) => IN(tt, rel(h, i) > 90 ? 0.6 + i * 1.05 : rel(h, i));
  const SP: V3[] = [[-0.75, 0.62, 0], [0.3, 1.28, 0], [0.8, 1.28, 0], [0.0, 1.28, 0], [0.75, 0.62, 0], [1.35, 0.06, 0.2]];
  return <Estudio t={tt} cam={[0.3, 1.0, 2.7]} look={[0.2, 0.75, 0]} orbit={0.05}>
    <mesh position={[-0.55, 0.6, -0.4]}><boxGeometry args={[1.1, 1.2, 0.04]} /><meshStandardMaterial color="#cfe3e8" roughness={0.9} /></mesh>
    <mesh position={[0.55, 0.6, -0.4]}><boxGeometry args={[1.1, 1.2, 0.04]} /><meshStandardMaterial color="#f2d9b8" roughness={0.9} /></mesh>
    <mesh position={[0, 1.6, -0.4]}><boxGeometry args={[2.2, 0.7, 0.04]} /><meshStandardMaterial color="#e3d5ec" roughness={0.9} /></mesh>
    <mesh position={[0, 0.6, -0.05]} castShadow><boxGeometry args={[0.04, 1.2, 0.7]} />{M.madera("#a07040")}</mesh>
    <mesh position={[0, 2.25, -0.05]} rotation={[0, 0, P / 4]}><boxGeometry args={[1.6, 1.6, 0.68]} />{M.madera("#8a4a2a")}</mesh>
    <mesh position={[0, 1.22, -0.05]} castShadow receiveShadow><boxGeometry args={[2.2, 0.05, 0.7]} />{M.madera("#a07040")}</mesh>
    <mesh position={[0, 1.95, -0.05]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[2.3, 0.05, 0.75]} />{M.madera("#7a4a2a")}</mesh>
    {SP.slice(0, N).map((q, i) => { const k = Math.min(1, on(i));
      return <group key={i} position={q}>
        <mesh scale={0.07 + 0.06 * k}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color={col("#4a5560", "#ffd36a", k)} toneMapped={false} /></mesh>
        <pointLight intensity={0.01 + 2.6 * k} distance={1.0} color="#ffd36a" />
        <mesh position={[0, -0.04, 0]} rotation={[-P2, 0, 0]} scale={0.1 + 0.25 * k}><ringGeometry args={[0.9, 1, 40]} /><meshBasicMaterial color="#ffd36a" transparent opacity={0.6 * k} toneMapped={false} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 36 · EL FILTRO DE PELUSA: la manguera de la lavadora larga agua gris; la mallita en la punta se llena de pelusa y el agua sale limpia
const CFiltro: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ll = cl((tt - 0.8) / 3.6);
  return <Estudio t={tt} cam={[0.62, 0.42, 0.85]} look={[0.38, 0.22, 0.05]} orbit={0.05}>
    <group position={[-0.7, 0, -0.2]}><RBox s={[0.6, 0.8, 0.55]} r={0.05} p={[0, 0.4, 0]}><meshPhysicalMaterial color="#f4f4f2" roughness={0.3} clearcoat={0.6} /></RBox>
      <mesh position={[0, 0.5, 0.28]} rotation={[0, 0, 0]}><torusGeometry args={[0.17, 0.03, 12, 40]} />{M.cromo()}</mesh></group>
    <Tubo pts={[[-0.4, 0.3, -0.2], [0.0, 0.55, 0], [0.35, 0.5, 0.05], [0.42, 0.32, 0.05]]} r={0.03}><meshStandardMaterial color="#9aa3ad" roughness={0.6} /></Tubo>
    <mesh position={[0.42, 0.22, 0.05]} scale={1.7}><cylinderGeometry args={[0.045, 0.03, 0.16, 16, 1, true]} /><meshStandardMaterial color="#f2eee2" transparent opacity={0.6} side={THREE.DoubleSide} wireframe /></mesh>
    {Array.from({ length: 44 }, (_, i) => <mesh key={i} position={[0.42 + (rn(i, 1) - 0.5) * 0.08 * (1 - i / 60), 0.1 + (i / 44) * 0.22, 0.05 + (rn(i, 2) - 0.5) * 0.08 * (1 - i / 60)]} scale={0.02 * Math.min(1, ll * 44 - i)} visible={ll * 44 > i}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#b7b2aa" roughness={1} /></mesh>)}
    <Chorro a={[0.42, 0.08, 0.05]} b={[0.42, -0.2, 0.05]} r={0.026} c={col("#8a8a80", "#bfe0f2", ll)} o={0.75} />
  </Estudio>;
}}</Stage>;

// 37 · LA PERILLA DEL TERMOTANQUE: el tanque con su perilla gira de ALTO a MEDIO y la llama de abajo se achica
const CTermo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const g = eio(tt, 1.2, 2.6);
  return <>
    <Estudio t={tt} cam={[0.35, 0.6, 1.75]} look={[0, 0.55, 0]} orbit={0.05}>
      <mesh position={[0, 0.75, 0]} castShadow><cylinderGeometry args={[0.35, 0.35, 1.2, 48]} /><meshPhysicalMaterial color="#f4f4f2" roughness={0.3} clearcoat={0.5} /></mesh>
      <group position={[0.1, 0.32, 0.36]} scale={1.9}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.1, 0.1, 0.02, 40]} /><meshStandardMaterial map={ctex("perilla", 256, 256, (c) => { c.fillStyle = "#2e3640"; c.fillRect(0, 0, 256, 256); c.fillStyle = "#f6f1e4"; c.font = "700 34px Arial"; c.textAlign = "center"; c.fillText("BAJO", 60, 150); c.fillText("MEDIO", 128, 50); c.fillText("ALTO", 196, 150); })} /></mesh>
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, lerp(-0.9, 0, g)]}><boxGeometry args={[0.02, 0.16, 0.02]} /><meshStandardMaterial color="#e8432e" /></mesh>
      </group>
      <Llama p={[0, 0.06, 0]} f={lerp(1, 0.45, g)} t={tt} r={0.18} />
      {Array.from({ length: 8 }, (_, i) => <mesh key={"az" + i} position={[Math.cos(i * 0.785) * 0.2, 0.08, Math.sin(i * 0.785) * 0.2 + 0.1]} scale={[0.03, 0.1 * lerp(1, 0.4, g) * (1 + 0.15 * Math.sin(tt * 1.8 + i)), 0.03]}><coneGeometry args={[1, 1, 10]} /><meshBasicMaterial color="#4a8cff" transparent opacity={0.75} toneMapped={false} /></mesh>)}
      <pointLight position={[0, 0.12, 0.4]} intensity={2.5 * lerp(1, 0.45, g)} distance={0.8} color="#4a8cff" />
      <group position={[-0.22, 0.95, 0.33]} scale={g > 0.01 ? Math.min(1.08, IN(tt, 2.6)) + 0.001 : 0.001}>
        <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.02, 40]} /><meshStandardMaterial map={ctex("dialT", 256, 256, (c) => { c.fillStyle = "#f6f1e4"; c.fillRect(0, 0, 256, 256); c.fillStyle = "#3fae5a"; c.beginPath(); c.moveTo(128, 128); c.arc(128, 128, 120, -1.2, -0.75); c.fill(); c.fillStyle = "#2e3640"; c.font = "700 40px Arial"; c.textAlign = "center"; c.fillText("55-60", 128, 210); })} /></mesh>
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, lerp(1.2, 0.2, eio(tt, 2.8, 3.8))]}><boxGeometry args={[0.012, 0.2, 0.01]} /><meshStandardMaterial color="#e8432e" /></mesh>
      </group>
    </Estudio>
  </>;
}}</Stage>;

// 38 · EL KIT EN EL MUEBLE: las dos puertas del mueble se abren y cada cosa se desliza al estante cuando se nombra
const CKit: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const ab = IN(tt, 0.2), A = (i: number) => rel(h, i) > 90 ? 0.8 + i * 0.9 : rel(h, i), on = (i: number) => IN(tt, A(i)), fw = (i: number) => Math.exp(-Math.pow(tt - A(i) - 0.7, 2) * 3);
  const X = [-0.6, -0.3, 0.0, 0.3, 0.6, -0.45, 0.15];
  const Y = [0.62, 0.62, 0.62, 0.62, 0.62, 0.08, 0.08];
  const it = [<Termometro s={0.25} v={0.55} />, <mesh><cylinderGeometry args={[0.07, 0.06, 0.2, 24]} />{M.vidrio()}</mesh>, <Botella s={0.3} c="#59c26a" />, <Guante s={0.4} />, <mesh><cylinderGeometry args={[0.05, 0.045, 0.12, 20]} />{M.vidrio()}</mesh>, <Copa s={0.32} />, <Frasco s={0.45} lleno={0.3} />];
  return <Estudio t={tt} cam={[0, 0.6, 1.95]} look={[0, 0.4, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, 0.5, -0.3]}><boxGeometry args={[1.6, 1.1, 0.03]} />{M.madera("#c9a46a")}</mesh>
    <mesh position={[0, 0.55, -0.05]}><boxGeometry args={[1.6, 0.03, 0.5]} />{M.madera("#b08a52")}</mesh>
    <mesh position={[0, 0.0, -0.05]}><boxGeometry args={[1.6, 0.03, 0.5]} />{M.madera("#b08a52")}</mesh>
    {[-1, 1].map((k) => <group key={k} position={[k * 0.8, 0.5, 0.22]} rotation={[0, k * 1.9 * ab, 0]}><mesh position={[-k * 0.4, 0, 0]} castShadow><boxGeometry args={[0.8, 1.1, 0.03]} />{M.madera("#8a5a32")}</mesh></group>)}
    {it.map((o, i) => <group key={i} position={[X[i] + 0.6 * (1 - Math.min(1, on(i))), Y[i] + 0.04 * fw(i), 0.05 + 0.3 * fw(i)]} visible={on(i) > 0.01} scale={Math.max(0.001, Math.min(1.1, on(i))) * (1.5 + 0.35 * fw(i))}>{o}<pointLight position={[0, 0.25, 0.2]} intensity={2 * fw(i)} distance={0.6} color="#ffe2a8" /></group>)}
  </Estudio>;
}}</Stage>;

// 39 · EL SONAR DE LA SONDA (familia Gómez): un pulso viaja por el caño de la pared, rebota en la piedra de grasa a metro y medio y vuelve
const CSonar: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = cl((tt - 0.8) / 1.6), vuelta = cl((tt - 2.4) / 1.4), x = k < 1 ? lerp(-0.9, 0.7, k) : lerp(0.7, -0.9, vuelta), glow = eio(tt, 2.3, 2.6);
  return <>
    <Estudio t={tt} cam={[0, 0.6, 1.95]} look={[0, 0.25, 0]} orbit={0.04} mesa={false}>
      <mesh position={[0, 0.4, -0.2]}><planeGeometry args={[3.0, 1.2]} /><meshStandardMaterial map={ctex("ladrS", 512, 256, (g) => { g.fillStyle = "#9a5a3c"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#d9cbb4"; g.lineWidth = 5; for (let y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); for (let x = (y / 32) % 2 ? 0 : 32; x <= 512; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); } } })} roughness={0.9} /></mesh>
      <Tubo pts={[[-1.1, 0.7, 0], [-1.1, 0.25, 0], [1.2, 0.25, 0]]} r={0.07} o={0.35} />
      {tt > 0.8 && vuelta < 1 && [1, 2].map((q) => { const xx = k < 1 ? lerp(-0.9, 0.7, cl(k - 0.06 * q)) : lerp(0.7, -0.9, cl(vuelta - 0.06 * q)); return <mesh key={"ec" + q} position={[xx, 0.25, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.085, 0.01, 8, 40]} /><meshBasicMaterial color="#7fe0ff" transparent opacity={0.5 / q} toneMapped={false} /></mesh>; })}
      {Array.from({ length: 16 }, (_, i) => <mesh key={"rt" + i} position={[-1.0 + i * 0.12, 0.05, 0.02]} scale={[0.006, i % 5 ? 0.03 : 0.06, 0.006]} visible={-1.0 + i * 0.12 < -1.0 + 1.8 * eio(tt, 2.5, 3.2)}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>)}
      <mesh position={[0.8, 0.25, 0]} scale={[0.16, 0.066, 0.066]}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#e8c35a" emissive="#ffb347" emissiveIntensity={0.7 * glow} roughness={0.8} flatShading /></mesh>
      {tt > 0.8 && vuelta < 1 && <mesh position={[x, 0.25, 0]} rotation={[0, P2, 0]}><torusGeometry args={[0.085, 0.016, 8, 40]} /><meshBasicMaterial color="#7fe0ff" toneMapped={false} /></mesh>}
      {tt > 0.8 && vuelta < 1 && <pointLight position={[x, 0.25, 0.2]} intensity={2} distance={0.6} color="#7fe0ff" />}
      <mesh position={[-0.1, 0.05, 0]} scale={[1.8 * eio(tt, 2.5, 3.2) + 0.001, 1, 1]}><boxGeometry args={[1, 0.01, 0.01]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>
    </Estudio>
  </>;
}}</Stage>;

// 40 · LOS MITOS EN BURBUJAS: cada mito flota adentro de una burbuja de jabón; al nombrarlo, la burbuja revienta y el mito cae
const CMitos: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const it = [<Tetera s={0.3} />, <mesh><cylinderGeometry args={[0.06, 0.07, 0.2, 20]} /><meshStandardMaterial color="#f4f4f2" roughness={0.5} /></mesh>, <group><Tetera s={0.22} p={[-0.07, 0, 0]} /><Tetera s={0.22} p={[0.09, 0, 0]} /></group>,
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />{M.cromo()}</mesh>, <mesh scale={0.09}><boxGeometry args={[1, 1, 1]} /><meshPhysicalMaterial color="#e6f4ff" roughness={0.05} transparent opacity={0.6} clearcoat={1} /></mesh>];
  return <Estudio t={tt} cam={[0, 0.8, 2.15]} look={[0, 0.6, 0]} orbit={0.05}>
    {it.map((o, i) => { const x = -1.1 + i * 0.55, a = rel(h, i) > 90 ? 0.8 + i * 1.1 : rel(h, i), pop = cl((tt - a - 0.6) / 0.12), cae = Math.pow(cl((tt - a - 0.7) / 0.7), 2);
      const y = 0.75 + 0.05 * Math.sin(tt * 1.5 + i) - 0.75 * cae;
      return <group key={i} position={[x, y, 0]}>
        <group visible={y > -0.1} scale={1.35}>{o}</group>
        {pop > 0 && cae < 0.6 && Array.from({ length: 10 }, (_, q) => { const d = cl((tt - a - 0.6) / 0.45); return <mesh key={"sp" + q} position={[Math.cos(q * 0.63) * 0.3 * d, 0.75 * cae + Math.sin(q * 0.63) * 0.3 * d - 0.2 * d * d, 0]} scale={0.012 * (1 - d) + 0.001}><sphereGeometry args={[1, 8, 6]} /><meshPhysicalMaterial color="#ffffff" roughness={0} iridescence={1} transparent opacity={0.8} /></mesh>; })}
        <mesh scale={0.26 * (1 + 0.3 * pop)} visible={pop < 1}><sphereGeometry args={[1, 32, 24]} /><meshPhysicalMaterial color="#ffffff" roughness={0} transparent opacity={0.18 * (1 - pop)} iridescence={1} clearcoat={1} depthWrite={false} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 41 · LA LOZA TIENE MEMORIA (don Ernesto): cada golpe de calor deja una marca que no se va; los golpes se van sumando en la taza
const CMemoria: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const golpes = [0.8, 2.0, 3.2, 4.4], n = golpes.filter((a) => tt > a).length, raj = eio(tt, 4.9, 5.6);
  return <Estudio t={tt} cam={[0.3, 1.0, 1.05]} look={[0, 0.5, -0.4]} orbit={0.06}>
    <Inodoro asiento={false} t={tt} />
    <mesh position={[0.42, 0.75, -0.3]} rotation={[0, -0.4, 0]}><boxGeometry args={[0.16, 0.12, 0.04]} /><meshStandardMaterial color="#2e3640" roughness={0.4} /></mesh>
    <mesh position={[0.43, 0.75, -0.278]} rotation={[0, -0.4, 0]}><planeGeometry args={[0.12, 0.09]} /><meshBasicMaterial map={ctex("memN" + n, 128, 96, (c) => { c.fillStyle = "#f6f1e4"; c.fillRect(0, 0, 128, 96); c.fillStyle = "#d6362c"; c.font = "900 80px Arial"; c.textAlign = "center"; c.fillText(String(n), 64, 80); })} toneMapped={false} /></mesh>
    {raj > 0 && [0, 1, 2].map((q) => <mesh key={"rj" + q} position={[-0.05 + 0.06 * q, 0.5 - 0.06 * raj * q, -0.55 + 0.03 * q]} rotation={[-0.6, 0, 0.6 - 0.5 * q]} scale={[0.004, 0.16 * raj, 0.004]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#2a2018" /></mesh>)}
    {golpes.map((a, i) => { const k = cl((tt - a) / 0.4), fl = cl(1 - (tt - a - 0.4) / 0.8), ang = -1.0 + i * 0.65;
      return <group key={i} visible={k > 0}>
        <pointLight position={[Math.sin(ang) * 0.24, 0.6, -0.6 + Math.cos(ang) * 0.24]} intensity={3 * fl} distance={0.6} color="#ff3a1a" />
        <mesh position={[Math.sin(ang) * 0.24, 0.505, -0.78 + Math.cos(ang) * 0.24 * 1.2]} rotation={[-0.6, ang, 0]} scale={0.03 + 0.05 * k}><ringGeometry args={[0.8, 1, 9]} /><meshBasicMaterial color={col("#ff3a1a", "#6a5a48", 1 - fl)} toneMapped={false} transparent opacity={0.85} /></mesh>
        <mesh position={[Math.sin(ang) * 0.24, 0.5, -0.78 + Math.cos(ang) * 0.24 * 1.2]} rotation={[-0.6, ang, 0]} scale={[0.07 * k, 0.018 * k, 1]}><circleGeometry args={[1, 20]} /><meshBasicMaterial color={col("#ff7a2a", "#c9b9a0", 1 - fl)} toneMapped={false} transparent opacity={0.9} /></mesh>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 42 · EL EDIFICIO: cuatro pisos con una bajada común; la grasa empujada desde arriba se junta abajo y el que se inunda es la planta baja
const CEdificio: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const g = eio(tt, 0.8, 3.4), inu = eio(tt, 3.4, 5.4);
  return <Estudio t={tt} cam={[0.5, 1.0, 2.85]} look={[0.1, 0.85, 0]} orbit={0.04} mesa={false}>
    {[0, 1, 2, 3].map((i) => [0, 1].map((q) => <group key={"fa" + i + q} position={[-0.75 + 0.18 * q, i * 0.5 + 0.02, 0.15]}><mesh position={[0, 0.09 - 0.03 * q, 0]} scale={[1, 1 - 0.3 * q, 1]}><capsuleGeometry args={[0.035, 0.1, 4, 10]} /><meshStandardMaterial color={["#d6362c", "#3d7bd9", "#e8a23a", "#59c26a"][(i + q) % 4]} roughness={0.6} /></mesh><mesh position={[0, 0.2 - 0.06 * q, 0]} scale={0.04 * (1 - 0.2 * q)}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#e8c4a0" /></mesh></group>))}
    <pointLight position={[0, 0.2, 0.5]} intensity={3 * inu} distance={1.6} color="#5aa8ff" />
    {[0, 1, 2, 3].map((i) => <group key={i} position={[0, i * 0.5, 0]}>
      <mesh position={[0, 0, 0]} receiveShadow castShadow><boxGeometry args={[1.8, 0.04, 0.8]} /><meshStandardMaterial color="#d9d3c6" /></mesh>
      <group position={[-0.35, 0.02, -0.05]}><RBox s={[0.35, 0.2, 0.25]} r={0.02} p={[0, 0.1, 0]}><meshStandardMaterial color="#c9b79a" /></RBox></group>
      <Cano a={[-0.35, 0.2, -0.1]} b={[0.55, 0.15, -0.1]} r={0.025}>{PVC(0.6)}</Cano>
    </group>)}
    <Cano a={[0.55, 1.9, -0.1]} b={[0.55, -0.2, -0.1]} r={0.06}>{PVC(0.45)}</Cano>
    {Array.from({ length: 4 }, (_, i) => { const k = cl(g * 1.3 - i * 0.1);
      return <mesh key={i} position={[0.55 + 0.03 * (i % 2) * k, lerp(1.6 - i * 0.4, -0.1 + i * 0.07, k), -0.1]} scale={0.07}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#efe4c0" roughness={0.8} /></mesh>; })}
    <mesh position={[0, 0.02 + 0.08 * inu, 0]} scale={[1, Math.max(0.001, inu), 1]} visible={inu > 0.01}><boxGeometry args={[1.76, 0.16, 0.76]} />{AGUA(0.6, "#6fa6c8")}</mesh>
  </Estudio>;
}}</Stage>;

// 43 · EL REPASO EN LA CINTA: una cinta transportadora pasa los objetos del video bajo el foco; cada uno se ilumina cuando se nombra
const CRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const N = Math.max(1, (h.items ?? []).length);
  const it = (i: number) => [<Olla mat="peltre" s={0.18} nivel={0.6} caldo="#d9eef8" />, <Sifon s={0.3} />, <group scale={0.3}><Inodoro asiento={false} /></group>, <group position={[0, 0.02, 0]}><RBox s={[0.3, 0.04, 0.3]} r={0.02}><meshStandardMaterial color="#1f2124" /></RBox></group>,
    <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.025, 0.025, 0.2, 12]} />{M.cromo()}</mesh>, <Botella s={0.28} c="#e8432e" />, <Termometro s={0.2} v={0.55} p={[0, 0.2, 0]} />, <Botella s={0.28} c="#59c26a" />, <Taza s={0.6} lleno={1} c="#f7f7f2" />][i % 9];
  const idx = Array.from({ length: N }, (_, i) => i).filter((i) => tt >= rel(h, i) - 0.4).length - 1, pos = idx < 0 ? -1 : idx + eio(tt, rel(h, Math.max(0, idx)) - 0.4, rel(h, Math.max(0, idx)) + 0.4) - 1;
  return <Estudio t={tt} cam={[0, 0.7, 1.75]} look={[0, 0.25, 0]} orbit={0.03}>
    <pointLight position={[0, 0.5, 0.4]} intensity={2.5} distance={1.0} color="#ffd36a" />
    <mesh position={[0, 0.05, 0]} receiveShadow><boxGeometry args={[3.6, 0.06, 0.5]} /><meshStandardMaterial color="#2a2d31" roughness={0.6} /></mesh>
    <spotLight position={[0, 1.6, 0.6]} angle={0.35} penumbra={0.6} intensity={18} distance={4} color="#fff0d8" />
    {Array.from({ length: N }, (_, i) => { const x = (i - pos - 1) * 0.6 + 0.6, k = Math.exp(-x * x * 6);
      return <group key={i} position={[x, 0.08 + 0.06 * k, 0]} scale={1.15 + 0.6 * k} visible={Math.abs(x) < 1.9}>{it(i)}</group>; })}
  </Estudio>;
}}</Stage>;

// 44 · LO QUE LA OLLA PROMETÍA: caño en corte con su película amarilla; el frente tibio con jabón avanza y la película se suelta en gotitas que se van
const CPelicula: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const fr = lerp(-1.3, 1.4, eio(tt, 0.7, 4.6)), N = 14;
  return <Estudio t={tt} cam={[fr * 0.4, 0.6, 1.35]} look={[fr * 0.45, 0.2, 0]} orbit={0.05} mesa={false}>
    <Vapor t={tt} p={[fr, 0.3, 0]} o={0.35} h={0.4} s={0.12} />
    <pointLight position={[fr, 0.4, 0.3]} intensity={1.8} distance={0.8} color="#ffb07a" />
    <mesh position={[0, 0.25, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.24, 0.24, 2.6, 48, 1, true, 0, P]} />{PVC(1)}</mesh>
    {Array.from({ length: N }, (_, i) => { const x = -1.2 + (i + 0.5) * (2.4 / N), k = cl((fr - x) / 0.35);
      return <group key={i}>
        <mesh position={[x, 0.25, 0]} rotation={[0, 0, P2]} visible={k < 0.98}><cylinderGeometry args={[0.228, 0.228, 2.4 / N * 0.98, 32, 1, true, 0, P]} /><meshStandardMaterial color="#e8c35a" roughness={0.6} transparent opacity={0.92 * (1 - k)} side={THREE.DoubleSide} /></mesh>
        {k > 0.05 && [0, 1, 2].map((j) => { const d = cl((fr - x) / 1.2);
          return <mesh key={j} position={[x + 0.5 * d + 0.05 * j, 0.12 + 0.1 * j + 0.06 * Math.sin(tt * 3 + i + j), -0.08 + 0.08 * j]} scale={0.036 * (1 - 0.5 * d) + 0.001}><sphereGeometry args={[1, 10, 8]} /><meshPhysicalMaterial color="#e8c35a" roughness={0.1} clearcoat={1} transparent opacity={1 - d} /></mesh>; })}
      </group>; })}
    <mesh position={[(fr - 1.3) / 2, 0.16, -0.02]} scale={[Math.max(0.001, fr + 1.3), 1, 1]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.2, 0.2, 1, 32, 1, true, P * 0.62, P * 0.76]} /><meshPhysicalMaterial color="#ffb07a" roughness={0.05} transparent opacity={0.45} side={THREE.DoubleSide} /></mesh>
  </Estudio>;
}}</Stage>;

// 45 · EL GANCHITO DEL LAVAMANOS: el gancho baja por la rejilla y sube un chorizo de pelo pegado con pasta de jabón
const CGancho: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const baja = eio(tt, 0.5, 1.5), sube = eio(tt, 2.0, 4.4), y = 0.55 - 0.5 * baja + 0.75 * sube;
  const g = memo("ganchoC", () => tuboGeo([[0, 0.6, 0], [0, 0.0, 0], [0.0, -0.05, 0], [0.03, -0.07, 0], [0.05, -0.04, 0]], 0.006, 40));
  const pelo = memo("peloG", () => tuboGeo(Array.from({ length: 14 }, (_, i) => [0.04 * Math.sin(i * 1.3), -i * 0.045, 0.03 * Math.cos(i * 1.7)] as V3), 0.022, 60));
  return <Estudio t={tt} cam={[0.1, 0.95, 0.95]} look={[0, 0.25, 0]} orbit={0.05}>
    <mesh position={[0, 0.05, 0]} geometry={memo("lavC", () => lathe([[0.02, 0], [0.3, 0.0], [0.42, 0.14], [0.44, 0.16]], 48))} castShadow receiveShadow>{LOZA()}</mesh>
    <mesh position={[0, 0.052, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.03, 0.05, 32]} />{M.cromo()}</mesh>
    <mesh position={[0, 0.051, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.03, 24]} /><meshBasicMaterial color="#070707" /></mesh>
    <group position={[0, y, 0]}>
      <mesh geometry={g}>{M.cromo()}</mesh>
      <group visible={sube > 0.02} position={[0.04, -0.04, 0]} scale={[1, Math.max(0.001, cl(sube * 1.4)), 1]}>
        <mesh geometry={pelo}><meshStandardMaterial color="#2a2018" roughness={0.9} /></mesh>
        {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0.03 * Math.sin(i * 2.6), -0.06 - i * 0.08, 0.02]} scale={0.02 + 0.01 * rn(i, 1)}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#e9e4d4" roughness={0.7} /></mesh>)}
      </group>
    </group>
  </Estudio>;
}}</Stage>;

// 46 · LA REJILLA DE LA DUCHA: cae el agua de la regadera, el agua pasa y en la cúpula se va quedando el pelo
const CDucha: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const k = cl((tt - 0.6) / 4.2);
  const pelos = memo("duchaP", () => Array.from({ length: 12 }, (_, i) => tuboGeo(Array.from({ length: 6 }, (_, j) => { const a = i * 0.52 + j * 0.35, r = 0.03 + j * 0.016;
    return [Math.cos(a) * r * 1.6, 0.05 + 0.02 * Math.sin(j * 1.7 + i), Math.sin(a) * r * 1.6] as V3; }), 0.0045, 30)));
  return <Estudio t={tt} cam={[0.06, 0.75, 0.42]} look={[0, 0.0, 0]} orbit={0.04}>
    <mesh position={[0, 0, 0]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[1.6, 1.6]} /><meshStandardMaterial map={ctex("azulejoD", 256, 256, (g) => { g.fillStyle = "#d9dcd6"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "#b9bdb5"; g.lineWidth = 4; for (let i = 0; i <= 256; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } })} roughness={0.25} /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.5, 48]} />{AGUA(0.35, "#bcd8e6")}</mesh>
    <mesh position={[0, 0.0, 0]} scale={[1.8, 0.8, 1.8]}><sphereGeometry args={[0.12, 32, 16, 0, 2 * P, 0, P2]} /><meshStandardMaterial color="#d8dade" metalness={1} roughness={0.25} wireframe /></mesh>
    {pelos.map((gm, i) => <mesh key={i} geometry={gm} visible={k * 12 > i}><meshStandardMaterial color="#2a2018" roughness={0.8} /></mesh>)}
    {Array.from({ length: 30 }, (_, i) => { const q = ((tt * 1.6 + rn(i, 1)) % 1);
      return <mesh key={"g" + i} position={[(rn(i, 2) - 0.5) * 0.9, 1.1 - 1.1 * q, (rn(i, 3) - 0.5) * 0.9]} scale={[0.006, 0.03, 0.006]}><sphereGeometry args={[1, 6, 4]} />{AGUA(0.6, "#d8ecf6")}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 47 · CADA VEZ DURABA MENOS (los Gómez): las ollas de agua hirviendo llegan en fila, cada vez más pegadas; la última ya no destapa
const CMenos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const X = [-1.25, -0.35, 0.2, 0.55, 0.78], fin = eio(tt, 4.0, 5.2);
  return <>
    <Estudio t={tt} cam={[0.3, 0.75, 2.05]} look={[0.2, 0.22, 0]} orbit={0.05}>
      <mesh position={[0, 0.02, 0]} receiveShadow><boxGeometry args={[3.0, 0.04, 0.7]} />{M.madera("#8a5a32")}</mesh>
      <mesh position={[1.25, 0.06 + 0.02 * Math.sin(tt * 2), 0]} scale={[0.12, 0.05, 0.12]}><icosahedronGeometry args={[1, 2]} />{GRASA()}</mesh>
      <pointLight position={[1.25, 0.6, 0.4]} intensity={2 * fin} distance={1.0} color="#ffe2a8" />
      {X.map((x, i) => { const on = IN(tt, 0.4 + i * 0.7);
        return <group key={i} position={[x, 0.04 + 0.5 * (1 - Math.min(1, on)), 0]} visible={on > 0.01}>
          <Olla mat="peltre" s={0.22} nivel={0.7} caldo="#d9eef8" hervor={1 - i * 0.18} t={tt + i} />
          <Vapor t={tt + i} p={[0, 0.2, 0]} o={0.55 * Math.max(0, 1 - i * 0.26)} h={0.7} s={0.13} n={14} />
        </group>; })}
      <mesh position={[1.25, 0.25, 0]} castShadow><cylinderGeometry args={[0.18, 0.16, 0.42, 32, 1, true]} />{M.vidrio()}</mesh>
      <mesh position={[1.25, 0.1 + 0.11 * fin, 0]}><cylinderGeometry args={[0.17, 0.155, 0.12 + 0.22 * fin, 32]} />{AGUA(0.8, "#8fa4b0")}</mesh>
    </Estudio>
  </>;
}}</Stage>;

// 48 · EL SIFÓN A CONTRALUZ: se saca el sifón, se lo pone contra la luz de la ventana y se ve que adentro casi no hay nada — el tapón no está ahí
const CContraluz: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.4, 1.6), luz = eio(tt, 1.6, 2.6);
  return <>
    <Estudio t={tt} cam={[0, 0.72, 1.3]} look={[0, 0.62, -0.2]} orbit={0.04} mesa={false}>
      <pointLight position={[0, 0.75, -0.6]} intensity={4 * luz} distance={2} color="#fff6dc" />
      <mesh position={[0, 0.75, -0.8]}><circleGeometry args={[0.75, 64]} /><meshBasicMaterial color={col("#3a3f46", "#fff6dc", luz)} toneMapped={false} /></mesh>
      <mesh position={[0, 0.75, -0.81]}><ringGeometry args={[0.75, 0.82, 64]} />{M.madera("#6b4527")}</mesh>
      <group position={[-0.2, 0.25 + 0.35 * sube, 0]} rotation={[0, 0, -0.2 + 0.2 * sube]}>
        <Tubo pts={[[0, 0.62, 0], [0, 0.12, 0], [0.06, 0.0, 0], [0.2, -0.02, 0], [0.32, 0.06, 0], [0.36, 0.2, 0], [0.4, 0.3, 0], [0.6, 0.32, 0]]} r={0.075} o={0.22} />
        <mesh position={[0.2, -0.035, 0]} scale={[0.12, 0.006, 0.045]}><sphereGeometry args={[1, 16, 8]} /><meshStandardMaterial color="#e8c35a" transparent opacity={0.7} roughness={0.3} /></mesh>
      </group>
      <group visible={sube > 0.01}><Mano p={[0.42, 0.62 + 0.35 * sube - 0.35, 0.05]} rot={[0, -1.4, 0]} pinza={1} s={0.5} /></group>
    </Estudio>
  </>;
}}</Stage>;

// 49 · EL ACEITE DE LA LATA, AL PAPEL: la servilleta toca el aceite y el amarillo sube por el papel mientras la lata se vacía
const CPapel: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const baja = eio(tt, 0.4, 1.2), ch = eio(tt, 1.2, 3.8), va = eio(tt, 4.2, 5.4);
  return <Estudio t={tt} cam={[0.05, 0.5, 0.9]} look={[0, 0.22, 0]} orbit={0.05}>
    <mesh position={[0, 0.05, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.1, 40, 1, true]} />{M.cromo("#b9bec4")}</mesh>
    <mesh position={[0, 0.002, 0]}><cylinderGeometry args={[0.16, 0.16, 0.004, 40]} />{M.cromo("#b9bec4")}</mesh>
    <mesh position={[0, 0.02 + 0.06 * (1 - ch), 0]}><cylinderGeometry args={[0.155, 0.155, 0.01, 40]} /><meshPhysicalMaterial color="#d9a83a" roughness={0.05} clearcoat={1} transparent opacity={0.9} /></mesh>
    <group position={[0.9 * va, 0.36 - 0.22 * baja + 0.4 * va, 0]} rotation={[0, 0, 1.2 * va]}>
      <mesh><planeGeometry args={[0.32, 0.4, 1, 1]} /><meshStandardMaterial color="#8fb8e0" roughness={1} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.2 + 0.2 * ch, 0.001]} scale={[1, Math.max(0.001, ch), 1]}><planeGeometry args={[0.32, 0.4]} /><meshStandardMaterial color="#d9a020" roughness={0.5} transparent opacity={0.92} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -0.2 + 0.4 * ch, 0.002]} scale={[1, 0.02, 1]} visible={ch > 0.02 && ch < 0.99}><planeGeometry args={[0.32, 0.4]} /><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  c_olla: COlla, c_charquito: CCharquito, c_fierro: CFierro, c_una: CUna, c_golpe: CGolpe, c_anios: CAnios, c_huevo: CHuevo, c_muda: CMuda, c_piedra: CPiedra,
  c_choque: CChoque, c_pelo: CPelo, c_cera: CCera, c_techo: CTecho, c_muestras: CMuestras, c_teresa: CTeresa, c_fideos: CFideos, c_almidon: CAlmidon, c_planta: CPlanta,
  c_geiser: CGeiser, c_metal: CMetal, c_mitad: CMitad, c_mano: CMano, c_escala: CEscala, c_pinchar: CPinchar, c_micela: CMicela, c_vaso: CVaso, c_despacio: CDespacio,
  c_vaciar: CVaciar, c_revision: CRevision, c_cambio: CCambio, c_errores: CErrores, c_rutina: CRutina, c_aurelio: CAurelio, c_cabana: CCabana, c_casa: CCasa, c_filtro: CFiltro,
  c_termo: CTermo, c_kit: CKit, c_sonar: CSonar, c_mitos: CMitos, c_memoria: CMemoria, c_edificio: CEdificio, c_recap: CRecap,
  c_pelicula: CPelicula, c_gancho: CGancho, c_ducha: CDucha, c_menos: CMenos, c_contraluz: CContraluz, c_papel: CPapel,
};
