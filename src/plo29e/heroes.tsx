// plo29e · CÓMO LIMPIAR EL SIFÓN SIN UNA GOTA EN EL PISO · componentes únicos 3D (ninguno repite mecanismo de plo29a/b/c/d ni entre sí).
// El sifón es el protagonista: tuercas, juntas cónicas, roscas y el clic. Llegada con peso, momento wow en la palabra, rótulos dentro de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, MZ, phys, RED, Stage, Tag, TX, VER } from "./ckit";
import { ctex, Estudio, fall, lathe, M, RBox, rn, Vapor } from "./estudio3d";
import { Chorro, Mano } from "./kit3d";
import { AGUA, Botella, Copa, Cubeta, GOMA, GRASA, Gota, Granos, Guante, Linterna, PVC, Rejilla, Sifon, Sonda, Tarja, Tetera, Tubo, tuboGeo } from "./kitplo";

type C = React.FC<{ t: number; h: H }>;
type V3 = [number, number, number];
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const col = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const AT = (h: H, i: number, step = 1.1, a0 = 0.6) => rel(h, i) > 90 ? a0 + i * step : rel(h, i);
const ON = (h: H, tt: number, i: number, step = 1.1, a0 = 0.6) => IN(tt, AT(h, i, step, a0));
const GRIS = "#7a7666", VERDE = "#9aae3c";
const UPTS: V3[] = [[-0.22, 0.5, 0], [-0.22, 0.12, 0], [-0.17, 0.02, 0], [-0.08, -0.03, 0], [0.0, 0.0, 0], [0.04, 0.08, 0], [0.06, 0.2, 0], [0.12, 0.26, 0], [0.5, 0.26, 0]];
// sifón en U de vidrio (para ver adentro): agua del sello hasta "nivel" (0..1)
const UVidrio: React.FC<{ p?: V3; rot?: V3; s?: number; nivel?: number; ac?: string; o?: number; children?: React.ReactNode }> = ({ p, rot, s = 1, nivel = 1, ac = "#7fb6d8", o = 0.28, children }) => {
  const cur = memo("ucur", () => new THREE.CatmullRomCurve3(UPTS.map((v) => new THREE.Vector3(...v))));
  const pts = memo("uagua" + Math.round(nivel * 20), () => { const all = cur.getSpacedPoints(60).map((v) => [v.x, v.y, v.z] as V3), lo = all.filter((q) => q[1] < 0.02 + 0.1 * nivel && q[0] < 0.1); return lo.length > 1 ? lo : all.slice(28, 30); });
  return <group position={p} rotation={rot} scale={s}>
    <Tubo pts={UPTS} r={0.05} o={o} />
    {nivel > 0.02 && <Tubo pts={pts} r={0.044}>{AGUA(0.75, ac)}</Tubo>}
    {children}
  </group>;
};
// tuerca de plástico con estrías
const Tuerca: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string; e?: number }> = ({ p, rot, s = 1, c = "#eef1f3", e = 0 }) => <group position={p} rotation={rot} scale={s}>
  <mesh><cylinderGeometry args={[0.07, 0.07, 0.05, 40, 1, true]} />{PVC(1, c, e)}</mesh>
  <mesh position={[0, 0.026, 0]} rotation={[-P2, 0, 0]}><ringGeometry args={[0.052, 0.07, 40]} />{PVC(1, c, e)}</mesh>
  {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[Math.cos(i / 18 * 2 * P) * 0.071, 0, Math.sin(i / 18 * 2 * P) * 0.071]} rotation={[0, -i / 18 * 2 * P, 0]}><boxGeometry args={[0.006, 0.046, 0.008]} />{PVC(1, c, e)}</mesh>)}
</group>;
// junta cónica (embudito de goma)
const Conica: React.FC<{ p?: V3; rot?: V3; s?: number; c?: string }> = ({ p, rot, s = 1, c = "#2c2c2c" }) => {
  const g = memo("conica", () => lathe([[0.042, 0], [0.06, 0], [0.05, 0.035], [0.042, 0.035]], 40));
  return <mesh geometry={g} position={p} rotation={rot} scale={s}><meshStandardMaterial color={c} roughness={0.55} side={THREE.DoubleSide} /></mesh>;
};
// rosca: hélice sobre un caño
const roscaGeo = (k: string, R: number, n: number, paso: number) => memo(k, () => tuboGeo(Array.from({ length: n * 24 + 1 }, (_, i) => { const a = i / 24 * 2 * P; return [Math.cos(a) * R, i / 24 * paso, Math.sin(a) * R] as V3; }), 0.006, n * 48));

// 1 · EL AGUA EN LOS PIES: el sifón ya está en la mano; la canilla de al lado se abre y el chorro sale por el desagüe abierto… directo a las zapatillas
const EPies: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ab = eio(tt, 1.0, 1.6), ch = cl((tt - 1.6) / 0.6), sp = eio(tt, 2.2, 4.0);
  return <Estudio t={tt} cam={[0.6, 0.35, 1.5]} look={[0, 0.0, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, -0.6, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[3, 3]} /><meshStandardMaterial color="#c9b79a" roughness={0.6} /></mesh>
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.04, 0.04, 0.35, 20, 1, true]} />{PVC(1)}</mesh>
    {ch > 0 && <Chorro a={[0, 0.33, 0]} b={[0.05, -0.55, 0.15]} r={0.02} c="#9fd0ee" o={0.8 * ab} />}
    <group position={[0.1, -0.6, 0.25]}>{[[-0.08, 0], [0.12, 0.08]].map(([x, z], i) => <group key={i} position={[x, 0.04, z]}><RBox s={[0.12, 0.08, 0.3]} r={0.04}><meshStandardMaterial color={col("#e9e3d6", "#8aa4b8", sp)} roughness={0.8} /></RBox></group>)}</group>
    {Array.from({ length: 14 }, (_, i) => { const q = ((tt * 1.3 + i / 14) % 1), a = i * 0.45;
      return <mesh key={i} position={[0.08 + Math.cos(a) * 0.3 * q, -0.55 + 0.15 * Math.sin(q * P), 0.2 + Math.sin(a) * 0.3 * q]} scale={0.012 * ch + 0.0005}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#cfe6f2" transparent opacity={0.8 * (1 - q)} /></mesh>; })}
    <mesh position={[0.05, -0.598, 0.15]} rotation={[-P2, 0, 0]} scale={0.05 + 0.5 * sp}><circleGeometry args={[1, 40]} />{AGUA(0.6, "#9fc6dc")}</mesh>
    <group position={[-0.45, 0.2, 0.3]} rotation={[0, 0.4, 0.3]}><Sifon s={0.55} agua={0.4} /></group>
  </Estudio>;
}}</Stage>;

// 2 · LA CURVA: un caño recto se dobla solo en U, con resorte, y se queda con agua en el fondo
const ECurva: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = cl(IN(tt, 0.6)), ag = eio(tt, 2.0, 3.2);
  const pts = memo("curva" + Math.round(k * 24), () => UPTS.map((q, i) => { const r: V3 = [lerp(-0.22, 0.5, i / 8), 0.26, 0]; return [lerp(r[0], q[0], k), lerp(r[1], q[1], k), 0] as V3; }));
  return <Estudio t={tt} cam={[0.1, 0.25, 1.3]} look={[0.12, 0.18, 0]} orbit={0.08}>
    <Tubo pts={pts} r={0.05} o={0.3} />
    {ag > 0.02 && <UVidrio nivel={ag} o={0.001} />}
  </Estudio>;
}}</Stage>;

// 3 · CINCO CENTÍMETROS: en la U de vidrio el agua del sello sube y cinco marquitas grabadas en el vidrio se encienden de a una
const ECinco: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 3.4);
  return <Estudio t={tt} cam={[0.0, 0.08, 0.9]} look={[-0.05, 0.06, 0]} orbit={0.04}>
    <UVidrio nivel={k} />
    {Array.from({ length: 5 }, (_, i) => { const on = cl(k * 5 - i);
      return <mesh key={i} position={[-0.165, 0.0 + i * 0.022, 0.045]}><boxGeometry args={[0.04, 0.003, 0.002]} /><meshBasicMaterial color={col("#6d7680", "#ffd36a", on)} toneMapped={false} /></mesh>; })}
    <Tag tt={tt} at={3.0} x={1320} y={380} txt="5 cm" col={MZ} size={60} />
  </Estudio>;
}}</Stage>;

// 4 · DEL OTRO LADO, LA CLOACA: la cámara se aleja del sifón por el caño, baja y aparece el colector enorme de la calle
const ECloaca: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const z = eio(tt, 0.8, 4.6);
  return <Estudio t={tt} cam={[lerp(0.3, 2.4, z), lerp(0.4, 1.2, z), lerp(0.9, 5.2, z)]} look={[lerp(0.1, 0.8, z), lerp(0.2, -1.2, z), 0]} orbit={0.02} mesa={false}>
    <Sifon s={0.6} x={1} agua={1} />
    <Tubo pts={[[0.3, 0.16, 0], [0.9, 0.16, 0], [1.0, 0.0, 0], [1.0, -1.6, 0]]} r={0.04}>{PVC(1)}</Tubo>
    <mesh position={[1.0, -2.2, -1]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.7, 0.7, 6, 40, 1, true]} /><meshStandardMaterial color="#5a5550" roughness={0.95} side={THREE.DoubleSide} /></mesh>
    <mesh position={[1.0, -2.75, -1]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.0, 6]} />{AGUA(0.7, "#4a5040")}</mesh>
    {Array.from({ length: 6 }, (_, i) => { const q = ((tt * 0.3 + i / 6) % 1); return <mesh key={i} position={[1.0 + 0.3 * Math.sin(i), -2.6 + 0.6 * q, -1 + (i - 3) * 0.6]} scale={(0.1 + 0.15 * q) * z + 0.001}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} transparent opacity={0.35 * (1 - q)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 5 · LO PESADO SE QUEDA: cada cosa que se nombra cae por la U de vidrio; el agua sigue, pero la grasa, los restos, el pelo, la arena y el anillo se asientan en el fondo de la curva
const ECriba: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const fin: V3[] = [[-0.12, 0.0, 0.0], [-0.06, -0.01, 0.01], [0.0, 0.01, -0.01], [-0.09, -0.005, 0.015], [-0.03, -0.015, 0]];
  const ob = [<mesh scale={[0.04, 0.02, 0.03]}><sphereGeometry args={[1, 12, 8]} />{GRASA()}</mesh>, <mesh scale={0.02}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#6b8a3a" flatShading /></mesh>,
    <mesh geometry={memo("pelc", () => tuboGeo([[0, 0, 0], [0.02, 0.01, 0.01], [0.04, -0.01, 0], [0.05, 0.005, -0.01]], 0.002, 12))}><meshStandardMaterial color="#2a2018" /></mesh>,
    <group>{[0, 1, 2, 3, 4].map((j) => <mesh key={j} position={[(j - 2) * 0.008, 0, (j % 2) * 0.006]} scale={0.004}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#d9b77a" /></mesh>)}</group>,
    <mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.012, 0.003, 8, 20]} /><meshStandardMaterial color="#f2c24a" metalness={1} roughness={0.15} /></mesh>];
  return <Estudio t={tt} cam={[0.05, 0.25, 0.85]} look={[-0.05, 0.1, 0]} orbit={0.05}>
    <UVidrio nivel={1} />
    {ob.map((o, i) => { const a = AT(h, i, 0.9), k = eio(tt, a, a + 1.0), y = lerp(0.55, fin[i][1], k), x = k < 0.6 ? -0.22 : lerp(-0.22, fin[i][0], (k - 0.6) / 0.4);
      return <group key={i} position={[x, y, fin[i][2]]} visible={tt > a - 0.05}>{o}</group>; })}
  </Estudio>;
}}</Stage>;

// 6 · LOS CUATRO SIFONES EN EL TENDEDERO: cuelgan de una cuerda con broches y entran deslizando de a uno cuando se nombran — en U, botella, doble pileta, con registro
const ETipos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const ob = (i: number) => [<Sifon s={0.42} />,
    <group><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.025, 0.025, 0.25, 16]} />{PVC(1)}</mesh><mesh><cylinderGeometry args={[0.07, 0.07, 0.18, 28]} />{PVC(1)}</mesh></group>,
    <group><Sifon s={0.42} /><Tubo pts={[[-0.35, 0.3, 0], [-0.1, 0.27, 0], [0, 0.27, 0]]} r={0.025}>{PVC(1)}</Tubo></group>,
    <group><Sifon s={0.42} /><mesh position={[0.0, -0.035, 0]}><cylinderGeometry args={[0.03, 0.03, 0.03, 6]} /><meshStandardMaterial color="#d6362c" /></mesh></group>][i];
  return <Estudio t={tt} cam={[0, 0.5, 2.0]} look={[0, 0.45, 0]} orbit={0.03} mesa={false}>
    <Tubo pts={[[-1.4, 0.95, 0], [0, 0.9, 0], [1.4, 0.95, 0]]} r={0.005}><meshStandardMaterial color="#c9b79a" /></Tubo>
    {[0, 1, 2, 3].map((i) => { const k = eio(tt, AT(h, i, 1.3), AT(h, i, 1.3) + 1.0), x = lerp(1.8, -0.9 + i * 0.6, k), sw = Math.sin(tt * 3 + i) * 0.08 * (1 - k * 0.7);
      return <group key={i} position={[x, 0.9, 0]} rotation={[0, 0, sw]} visible={k > 0.01}>
        <mesh position={[0, 0.0, 0]}><boxGeometry args={[0.025, 0.06, 0.02]} />{M.madera("#d4b07a")}</mesh>
        <group position={[0, -0.32, 0]}>{ob(i)}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 7 · LA FOTO ANTES DE TOCAR: el marco de una foto sube frente al sifón, destello blanco, y la imagen queda congelada en papel que se va a la esquina
const EFoto: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fl = Math.exp(-Math.pow((tt - 1.6) * 6, 2)), fo = eio(tt, 2.2, 3.4);
  return <Estudio t={tt} cam={[0.0, 0.3, 1.25]} look={[0, 0.25, 0]} orbit={0.03}>
    <Sifon p={[0, 0, 0]} s={0.7} />
    <group position={[lerp(0, 0.45, fo), lerp(0.25, 0.5, fo), lerp(0.4, 0.3, fo)]} rotation={[0, 0, lerp(0, -0.2, fo)]} scale={lerp(1, 0.45, fo)}>
      <mesh visible={tt > 0.6}><ringGeometry args={[0.24, 0.26, 4, 1, P / 4]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
      <mesh position={[0, 0, -0.002]} visible={fo > 0.02}><planeGeometry args={[0.38, 0.38]} /><meshStandardMaterial color="#f4efe2" roughness={0.9} /></mesh>
      <group position={[0, -0.06, 0.005]} scale={0.32} visible={fo > 0.02}><Sifon s={1} /></group>
    </group>
    <pointLight position={[0, 0.3, 0.8]} intensity={0.01 + 12 * fl} distance={3} color="#ffffff" />
  </Estudio>;
}}</Stage>;

// 8 · LA CASCADA AL MUEBLE: tarja doble sin sifón; se abre la canilla de la OTRA pileta y el agua cae igual por los dos caños abiertos adentro del mueble
const ECascada: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const on = eio(tt, 0.8, 1.3), ch = cl((tt - 1.3) / 0.8), ch2 = cl((tt - 1.9) / 0.8);
  return <Estudio t={tt} cam={[0.4, 0.35, 1.9]} look={[0, 0.1, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, 0.62, 0]}><boxGeometry args={[1.3, 0.04, 0.6]} /><meshStandardMaterial color="#d9d3c6" roughness={0.6} /></mesh>
    {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0.5, 0]}><mesh><boxGeometry args={[0.5, 0.2, 0.42]} />{M.cromo("#c9ced3")}</mesh>
      <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.03, 0.03, 0.18, 16, 1, true]} />{PVC(1)}</mesh></group>)}
    <Tubo pts={[[-0.3, 0.32, 0], [-0.3, 0.3, 0], [-0.25, 0.27, 0], [0.25, 0.27, 0], [0.3, 0.3, 0]]} r={0.025}>{PVC(1)}</Tubo>
    <Chorro a={[0.3, 0.85, -0.1]} b={[0.3, 0.42, -0.1]} r={0.012} c="#9fd0ee" o={0.85 * on} />
    {ch > 0 && <Chorro a={[0.3, 0.32, 0]} b={[0.3, -0.38, 0.02]} r={0.022} c="#8a8a78" o={0.8} />}
    {ch2 > 0 && <Chorro a={[-0.3, 0.32, 0]} b={[-0.3, -0.38, 0.02]} r={0.016} c="#8a8a78" o={0.7} />}
    <mesh position={[0, -0.4, 0]}><boxGeometry args={[1.3, 0.02, 0.6]} />{M.madera("#b08a5a")}</mesh>
    <mesh position={[0, -0.388, 0]} rotation={[-P2, 0, 0]} scale={[0.05 + 0.55 * eio(tt, 1.6, 4.6), 0.05 + 0.25 * eio(tt, 1.6, 4.6), 1]}><circleGeometry args={[1, 40]} />{AGUA(0.7, "#7a7a68")}</mesh>
  </Estudio>;
}}</Stage>;

// 9 · COMO UNA ESPONJA (don Hugo): el fondo de aglomerado chupa el agua gris, se hincha y se le desgranan los bordes
const EEsponja: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 4.2);
  const tx = memo("aglo", () => ctex("aglo", 256, 256, (g) => { g.fillStyle = "#c9a46a"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 1400; i++) { g.fillStyle = ["#a8844e", "#dcbc84", "#8a6a3a"][i % 3]; g.fillRect(Math.random() * 256, Math.random() * 256, 3 + Math.random() * 5, 2 + Math.random() * 3); } }));
  return <Estudio t={tt} cam={[0.6, 0.45, 1.1]} look={[0, 0.05, 0]} orbit={0.06}>
    <mesh position={[0, 0.03 + 0.03 * k, 0]} scale={[1 + 0.04 * k, 1 + 2.4 * k, 1 + 0.04 * k]}><boxGeometry args={[0.9, 0.04, 0.6]} /><meshStandardMaterial map={tx} color={col("#ffffff", "#8a7a5a", k)} roughness={1} /></mesh>
    <mesh position={[0, 0.06 + 0.12 * k + 0.002, 0]} rotation={[-P2, 0, 0]} scale={0.2 + 0.15 * (1 - k)}><circleGeometry args={[1, 40]} />{AGUA(0.6 * (1 - k * 0.8), "#7a7a68")}</mesh>
    {Array.from({ length: 16 }, (_, i) => { const q = cl(k * 1.4 - rn(i, 1) * 0.4); return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.9, 0.06 + 0.1 * k - 0.15 * q * q, 0.3 + 0.08 * q]} rotation={[i, q * 3, 0]} scale={0.012 * (q > 0 ? 1 : 0) + 0.0005}><boxGeometry args={[1, 0.6, 1]} /><meshStandardMaterial color="#b08a52" /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 10 · AL PATIO: el sifón sale volando del mueble, cruza la puerta abierta y aterriza en la pileta del lavadero
const EPatio: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 3.2), x = lerp(-1.2, 1.2, k), y = 0.35 + 0.55 * Math.sin(k * P);
  return <Estudio t={tt} cam={[0, 0.7, 2.6]} look={[0, 0.35, 0]} orbit={0.02} mesa={false}>
    <mesh position={[-1.25, 0.25, 0]}><boxGeometry args={[0.6, 0.5, 0.5]} />{M.madera("#c9a46a")}</mesh>
    <mesh position={[0, 0.65, -0.2]}><boxGeometry args={[0.08, 1.3, 0.1]} /><meshStandardMaterial color="#e9e3d6" /></mesh>
    <group position={[-0.05, 0.6, -0.15]} rotation={[0, -1.2, 0]}><mesh position={[0.3, 0, 0]}><boxGeometry args={[0.6, 1.2, 0.04]} />{M.madera("#6b4527")}</mesh></group>
    <mesh position={[0.9, -0.01, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.6, 1.4]} /><meshStandardMaterial color="#8a9a6a" roughness={1} /></mesh>
    <group position={[1.2, 0.3, 0]}><mesh><boxGeometry args={[0.5, 0.18, 0.4]} /><meshStandardMaterial color="#c9c4b8" roughness={0.7} /></mesh><mesh position={[0, -0.2, 0]}><boxGeometry args={[0.1, 0.4, 0.1]} /><meshStandardMaterial color="#9a958a" /></mesh></group>
    <directionalLight position={[2, 2, 1]} intensity={0.9} color="#fff1c8" />
    <group position={[x, y, 0]} rotation={[0, 0, k * 2 * P]}><Sifon s={0.4} /></group>
  </Estudio>;
}}</Stage>;

// 11 · CUATRO CHORROS: el sifón se suelta y el agua cae por cuatro bocas a la vez; la cubeta chica junta la mitad, la ancha junta todo
const EChorros: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ba = eio(tt, 0.8, 1.6), ch = cl((tt - 1.0) / 0.5) * (1 - eio(tt, 4.0, 4.6)), ancha = eio(tt, 2.4, 3.0);
  const bocas: V3[] = [[-0.12, 0.42, 0], [0.18, 0.42, 0], [-0.12, 0.3 - 0.25 * ba, 0], [0.18, 0.3 - 0.25 * ba, 0]];
  return <Estudio t={tt} cam={[0, 0.25, 1.4]} look={[0, 0.05, 0]} orbit={0.04}>
    <mesh position={[-0.12, 0.6, 0]}><cylinderGeometry args={[0.03, 0.03, 0.36, 16, 1, true]} />{PVC(1)}</mesh>
    <mesh position={[0.4, 0.42, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.44, 16, 1, true]} />{PVC(1)}</mesh>
    <group position={[0, -0.25 * ba, 0]}><Tubo pts={[[-0.12, 0.3, 0], [-0.12, 0.15, 0], [0.03, 0.08, 0], [0.18, 0.15, 0], [0.18, 0.3, 0]]} r={0.03}>{PVC(1)}</Tubo></group>
    {ch > 0 && bocas.map((b, i) => <Chorro key={i} a={b} b={[b[0] * (1.6 + i * 0.2) + (i % 2 ? 0.08 : -0.08), -0.25, 0.02]} r={0.01} c="#8a8a78" o={0.75} />)}
    <group position={[0.03, -0.32, 0]} scale={[lerp(0.35, 1.0, ancha), 0.45, lerp(0.35, 1.0, ancha)]}><Cubeta s={0.9} nivel={0.3 * ch} c={ancha > 0.5 ? "#3a7ad8" : "#d6362c"} /></group>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (0.32 + 0.05 * i), -0.399, 0.1 * Math.sin(i)]} rotation={[-P2, 0, 0]} scale={(0.03 + 0.02 * rn(i, 1)) * ch * (1 - ancha)}><circleGeometry args={[1, 20]} />{AGUA(0.6, "#8a8a78")}</mesh>)}
  </Estudio>;
}}</Stage>;

// 12 · EL AGARRE: la mano desnuda resbala sobre la tuerca mojada (destellos de resbalón); con el guante de goma la tuerca gira de una
const EAgarre: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const res = Math.sin(tt * 18) * 0.06 * (1 - eio(tt, 1.8, 2.0)), gu = eio(tt, 2.0, 2.6), gi = eio(tt, 2.8, 4.4);
  return <Estudio t={tt} cam={[0.2, 0.3, 0.75]} look={[0, 0.12, 0]} orbit={0.04}>
    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.035, 0.035, 0.5, 20]} />{PVC(1)}</mesh>
    <Tuerca p={[0, 0.12, 0]} rot={[0, gi * 3 + res, 0]} s={1.1} />
    {gu < 0.5 ? <Mano p={[0.1, 0.12, 0.05]} rot={[0, -0.6 + res, P2]} pinza={0.7} s={0.3} /> : <group position={[0.1, 0.12, 0.05]} rotation={[0, -0.6 + gi * 0.6, P2]}><Guante s={0.32} /></group>}
    {gu < 0.5 && tt > 0.5 && Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[0.07 * Math.cos(i * 1.6 + tt * 5), 0.12 + 0.02 * Math.sin(i * 3), 0.07 * Math.sin(i * 1.6 + tt * 5)]} scale={0.006}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 13 · LA UNIÓN EN DESPIECE: tubo, tuerca y junta se separan sobre su eje como en un plano de ferretería… y vuelven a juntarse
const EDespiece: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 1.8) * (1 - eio(tt, 3.6, 4.8));
  return <Estudio t={tt} cam={[0.6, 0.35, 0.9]} look={[0, 0.1, 0]} orbit={0.1}>
    <group rotation={[0, 0, P2 * 0.95]}>
      <mesh position={[0, 0.25 + 0.2 * k, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4, 24]} />{PVC(1)}</mesh>
      <Tuerca p={[0, 0.04 + 0.08 * k, 0]} s={0.9} />
      <Conica p={[0, 0.03 - 0.02 * k, 0]} s={0.95} />
      <mesh position={[0, -0.12 - 0.15 * k, 0]}><cylinderGeometry args={[0.05, 0.05, 0.25, 24]} />{PVC(1)}</mesh>
      <mesh position={[0, 0.0 - 0.15 * k, 0]} geometry={roscaGeo("roscaD", 0.051, 4, 0.012)}>{PVC(1, "#dfe3e6")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 14 · LA JUNTA CÓNICA: en corte, la punta del embudito entra hacia el tubo que recibe y sella; puesta al revés, deja una rendija y salen gotas
const EConica: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const k = eio(tt, 0.6, 1.6), gt = cl((tt - 1.8) / 0.7);
  return <Estudio t={tt} cam={[0, 0.2, 1.05]} look={[0, 0.1, 0]} orbit={0.04}>
    {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.04, 0.04, 0.3, 24, 1, true, 0, P]} />{PVC(1)}</mesh>
      <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.055, 0.055, 0.3, 24, 1, true, 0, P]} />{PVC(1)}</mesh>
      <group position={[0, 0.25 - 0.17 * k, 0]} rotation={[i ? P : 0, 0, 0]}><Conica s={1.1} c={i ? "#2c2c2c" : "#2c2c2c"} /></group>
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.075, 0.075, 0.06, 32, 1, true, 0, P]} />{PVC(1, "#dfe3e6")}</mesh>
      {i === 1 && gt > 0 && <Gota p={[0.07, 0.09, 0.02]} k={(tt * 1.2) % 1} h={0.35} c="#9fd0ee" />}
      <pointLight position={[0, 0.1, 0.2]} intensity={0.01 + 0.6 * gt} distance={0.35} color={i ? "#ff5a3a" : "#5ad87a"} />
    </group>)}
  </Estudio>;
}}</Stage>;

// 15 · LA DIO VUELTA (Valentina): cuanto más se aprieta, más gotea — las gotas se aceleran; la junta sale, gira en el aire y vuelve: la gota se corta
const EValentina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ap = eio(tt, 0.4, 1.6), sale = eio(tt, 2.0, 2.6) * (1 - eio(tt, 3.4, 4.0)), giro = eio(tt, 2.6, 3.4), seca = tt > 3.9;
  return <Estudio t={tt} cam={[0.3, 0.2, 0.85]} look={[0, 0.12, 0]} orbit={0.04}>
    <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.04, 0.04, 0.3, 24]} />{PVC(1)}</mesh>
    <Tuerca p={[0, 0.14, 0]} rot={[0, ap * 4, 0]} s={1} />
    <group position={[0.25 * sale, 0.14 + 0.25 * sale, 0.1 * sale]} rotation={[giro * P, 0, 0]}><Conica s={1.0} /></group>
    {!seca && <Gota p={[0.06, 0.11, 0.03]} k={(tt * (0.8 + ap * 1.8)) % 1} h={0.4} c="#9fd0ee" />}
    {seca && <pointLight position={[0, 0.15, 0.2]} intensity={0.6} distance={0.4} color="#5ad87a" />}
  </Estudio>;
}}</Stage>;

// 16 · A LA BOLSA, NO A OTRO DESAGÜE: la masa gris se desliza del sifón a la bolsa de basura, que se cierra sola con su nudo
const EBolsa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const inc = eio(tt, 0.4, 1.2), cae = eio(tt, 1.0, 2.0), nu = eio(tt, 2.6, 3.6);
  return <Estudio t={tt} cam={[0.2, 0.45, 1.2]} look={[0, 0.2, 0]} orbit={0.05}>
    <group position={[-0.25, 0.55, 0]} rotation={[0, 0, -1.4 * inc]}><Sifon s={0.5} agua={0} /></group>
    <mesh position={[lerp(-0.2, 0.05, cae), lerp(0.5, 0.18, cae), 0]} scale={[0.07, 0.05, 0.05]} visible={cae < 0.98}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color={GRIS} roughness={0.5} /></mesh>
    <mesh position={[0.05, 0.15, 0]} scale={[1, 1 - 0.25 * nu, 1]}><cylinderGeometry args={[0.16 - 0.1 * nu, 0.13, 0.32, 24, 1, true]} /><meshStandardMaterial color="#2a2c30" roughness={0.4} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0.05, 0.33 - 0.05 * nu, 0]} scale={Math.max(0.001, nu)}><torusKnotGeometry args={[0.03, 0.012, 48, 8]} /><meshStandardMaterial color="#2a2c30" roughness={0.4} /></mesh>
  </Estudio>;
}}</Stage>;

// 17 · EL CEPILLO DE BOTELLAS: entra en espiral por la U de vidrio y los anillos de mugre se desprenden de la pared detrás de él
const EEscobilla: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const cur = memo("ucur2", () => new THREE.CatmullRomCurve3(UPTS.map((v) => new THREE.Vector3(...v))));
  const k = eio(tt, 0.5, 4.0), p = cur.getPointAt(Math.min(0.999, k)), tg = cur.getTangentAt(Math.min(0.999, k));
  return <Estudio t={tt} cam={[0.1, 0.25, 0.95]} look={[0.1, 0.15, 0]} orbit={0.04}>
    <UVidrio nivel={0} o={0.3} />
    {Array.from({ length: 14 }, (_, i) => { const u = (i + 0.5) / 14, q = cur.getPointAt(u), lim = cl((k - u) * 8);
      return <mesh key={i} position={[q.x, q.y - 0.035, q.z]} scale={[1, 1, 1].map((s) => s * (1 - lim) + 0.001) as V3}><sphereGeometry args={[0.028, 10, 8]} /><meshStandardMaterial color={GRIS} roughness={0.8} /></mesh>; })}
    <group position={[p.x, p.y, p.z]} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg)}>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[0, -0.03 + i * 0.006, 0]} rotation={[0, i * 0.7 + tt * 8, 0]}><boxGeometry args={[0.085, 0.003, 0.003]} /><meshStandardMaterial color="#e8432e" /></mesh>)}
      <mesh position={[0, -0.25, 0]}><cylinderGeometry args={[0.003, 0.003, 0.45, 6]} />{M.cromo()}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 18 · DIEZ MINUTOS EN REMOJO: el sifón se hunde en la cubeta de agua caliente con jabón; la costra amarilla se arruga y se suelta en escamas que suben
const ERemojo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const hu = eio(tt, 0.3, 1.2), ar = eio(tt, 1.4, 3.6);
  return <Estudio t={tt} cam={[0, 0.65, 1.0]} look={[0, 0.1, 0]} orbit={0.05}>
    <Cubeta s={1.0} nivel={0.8} agua="#d9c9a0" />
    <group position={[0, lerp(0.55, 0.08, hu), 0]} rotation={[P2 * 0.9, 0, 0]}>
      <Sifon s={0.45} agua={0} />
      <mesh position={[0, -0.0, 0.0]} scale={[1, 1, 1]}><torusGeometry args={[0.06, 0.012 * (1 - ar) + 0.001, 8, 30, P]} /><meshStandardMaterial color="#e3c35a" roughness={0.9} /></mesh>
    </group>
    {Array.from({ length: 16 }, (_, i) => { const q = cl((tt - 1.6 - rn(i, 1) * 1.8) / 1.8);
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 0.25, 0.08 + 0.2 * q, (rn(i, 3) - 0.5) * 0.25]} rotation={[q * 4, i, 0]} scale={q > 0 ? 0.012 : 0.0005}><boxGeometry args={[1, 0.25, 1]} /><meshStandardMaterial color="#e3c35a" /></mesh>; })}
    <Vapor t={tt} p={[0, 0.3, 0]} o={0.25} h={0.4} s={0.1} />
  </Estudio>;
}}</Stage>;

// 19 · LA ROSCA LIMPIA: de cerca, entre los filetes de la rosca hay arenilla y grasa; el cepillo pasa, los granitos saltan y la tuerca baja suave hasta abajo
const ERosca: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const cep = eio(tt, 0.6, 2.4), tu = eio(tt, 2.8, 4.4);
  return <Estudio t={tt} cam={[0.25, 0.25, 0.55]} look={[0, 0.12, 0]} orbit={0.05}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.05, 0.05, 0.2, 32]} />{PVC(1)}</mesh>
    <mesh position={[0, 0.03, 0]} geometry={roscaGeo("roscaR", 0.051, 8, 0.016)}>{PVC(1, "#dfe3e6")}</mesh>
    {Array.from({ length: 24 }, (_, i) => { const a = i * 1.1, y = 0.04 + (i % 8) * 0.016, sal = cl((cep * 1.4 - (y - 0.03) * 6));
      return <mesh key={i} position={[Math.cos(a) * (0.057 + 0.15 * sal), y + 0.08 * sal, Math.sin(a) * (0.057 + 0.15 * sal)]} scale={0.005 * (1 - sal * 0.9) + 0.0005}><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color={i % 3 ? "#c9a86a" : GRIS} /></mesh>; })}
    <group position={[0.07, lerp(0.25, 0.0, cep), 0]} rotation={[0, 0, 0.3]} visible={cep > 0.01 && cep < 0.99}><mesh><boxGeometry args={[0.02, 0.05, 0.03]} /><meshStandardMaterial color="#3a7ad8" /></mesh></group>
    <Tuerca p={[0, lerp(0.3, 0.06, tu), 0]} rot={[0, -tu * 10, 0]} s={0.82} />
  </Estudio>;
}}</Stage>;

// 20 · EL DEDO EN LA PARED: en corte, el dedo con guante entra al caño abierto de la pared y toca el anillo de grasa: el guante sale manchado
const EDedo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const en = eio(tt, 0.5, 1.8) * (1 - eio(tt, 3.0, 4.0)), man = eio(tt, 1.7, 2.0);
  return <Estudio t={tt} cam={[0.2, 0.35, 1.1]} look={[0.2, 0.25, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0.6, 0.3, 0]}><boxGeometry args={[0.3, 0.9, 0.7]} /><meshStandardMaterial color="#d9d3c6" roughness={0.9} transparent opacity={0.35} /></mesh>
    <mesh position={[0.35, 0.25, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.7, 24, 1, true, 0, P]} />{PVC(1)}</mesh>
    <mesh position={[0.52, 0.25, 0]} rotation={[0, 0, P2]}><torusGeometry args={[0.042, 0.012, 10, 30, P]} />{GRASA()}</mesh>
    <group position={[lerp(-0.2, 0.42, en), 0.25, 0.0]} rotation={[0, 0, -P2]}>
      <mesh><capsuleGeometry args={[0.022, 0.25, 8, 16]} /><meshStandardMaterial color={col("#f2c230", "#c9b07a", man)} roughness={0.5} /></mesh>
      <mesh position={[0, 0.13, 0]} scale={[1, 0.5, 1]} visible={man > 0.5}><sphereGeometry args={[0.024, 16, 12]} />{GRASA()}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 21 · LA SONDA NO DOBLA: con el sifón puesto, el cable choca en la curva y se arma un rulo; con el sifón afuera, entra derecho por la pared
const ECurvaSonda: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const a = eio(tt, 0.5, 2.0), b = eio(tt, 2.4, 4.4);
  const rulo = memo("rulo" + Math.round(a * 10), () => tuboGeo(Array.from({ length: 30 }, (_, i) => { const u = i / 29; return [-0.22 + 0.03 * Math.sin(u * 14) * a, 0.6 - 0.45 * u * Math.min(1, a * 1.2), 0.03 * Math.cos(u * 14) * a] as V3; }), 0.006, 60));
  return <Estudio t={tt} cam={[0.0, 0.3, 1.6]} look={[0, 0.2, 0]} orbit={0.03}>
    <group position={[-0.45, -0.1, 0]}><UVidrio nivel={0.6} /><mesh geometry={rulo}>{M.cromo("#9aa0a6")}</mesh></group>
    <group position={[0.35, 0.2, 0]}>
      <mesh rotation={[0, 0, P2]} position={[0.3, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.6, 24, 1, true]} />{PVC(0.35)}</mesh>
      <mesh rotation={[0, 0, P2]} position={[lerp(-0.2, 0.25, b), 0, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 8]} />{M.cromo("#9aa0a6")}</mesh>
      <mesh position={[0.7, 0, 0]}><boxGeometry args={[0.1, 0.6, 0.5]} /><meshStandardMaterial color="#d9d3c6" transparent opacity={0.4} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 22 · LA COCINA AMANECE: el sol entra por la ventana y, desde las puertitas del mueble, una niebla verde va llenando la cocina
const EAmanece: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const sol = eio(tt, 0.3, 2.0), ne = eio(tt, 1.0, 4.4);
  return <Estudio t={tt} cam={[0, 0.85, 2.3]} look={[0, 0.55, 0]} orbit={0.02} mesa={false}>
    <mesh position={[0, 0.8, -0.7]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#e9e3d6" /></mesh>
    <mesh position={[0.6, 1.1, -0.69]}><planeGeometry args={[0.6, 0.5]} /><meshBasicMaterial color={col("#2a3550", "#ffd9a0", sol)} toneMapped={false} /></mesh>
    <mesh position={[0, 0.3, -0.4]}><boxGeometry args={[1.6, 0.6, 0.6]} />{M.madera("#c9a46a")}</mesh>
    <mesh position={[0, 0.62, -0.4]}><boxGeometry args={[1.7, 0.04, 0.65]} /><meshStandardMaterial color="#d9d3c6" /></mesh>
    <directionalLight position={[1.5, 1.5, -0.5]} intensity={0.2 + 1.0 * sol} color="#ffd9a0" />
    {Array.from({ length: 22 }, (_, i) => { const q = cl(ne * 1.3 - rn(i, 1) * 0.3);
      return <mesh key={i} position={[(rn(i, 2) - 0.5) * 1.4 * (0.3 + q), 0.25 + 0.9 * q * rn(i, 3), -0.05 + 0.6 * q * rn(i, 4)]} scale={0.08 + 0.18 * q}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color={VERDE} transparent opacity={0.16 * q} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 23 · EL NIVEL SE VA DE A GOTITAS: la tuerca mal sellada larga una gota tras otra; el agua del sello baja y, cuando pasa la curva, el olor sube libre
const ENivel: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const nv = 1 - eio(tt, 0.4, 3.6), gas = cl((tt - 3.4) / 1.0);
  return <Estudio t={tt} cam={[0.1, 0.15, 0.95]} look={[0.05, 0.12, 0]} orbit={0.04}>
    <UVidrio nivel={nv} />
    <Tuerca p={[0.06, 0.2, 0]} s={0.65} />
    <Gota p={[0.1, 0.17, 0.02]} k={(tt * 1.4) % 1} h={0.3} c="#9fd0ee" />
    {Array.from({ length: 6 }, (_, j) => { const q = ((tt * 0.7 + j / 6) % 1); const c = new THREE.CatmullRomCurve3(UPTS.slice().reverse().map((v) => new THREE.Vector3(...v))).getPointAt(q);
      return <mesh key={j} position={[c.x, c.y, c.z]} scale={0.02 * gas + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} transparent opacity={0.6} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 24 · LA ROSCA CRUZADA: la tuerca entra torcida, los filetes donde se montan se ponen rojos y la tuerca se planta inclinada
const ECruzada: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const gi = eio(tt, 0.6, 2.4), roj = eio(tt, 2.0, 2.8), tem = Math.sin(tt * 30) * 0.01 * roj;
  return <Estudio t={tt} cam={[0.3, 0.2, 0.55]} look={[0, 0.1, 0]} orbit={0.04}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.05, 0.05, 0.18, 32]} />{PVC(1)}</mesh>
    <mesh position={[0, 0.0, 0]} geometry={roscaGeo("roscaC", 0.051, 6, 0.018)}><meshStandardMaterial color={col("#dfe3e6", "#ff3a2a", roj)} emissive="#ff2a1a" emissiveIntensity={0.6 * roj} /></mesh>
    <Tuerca p={[0.012, lerp(0.22, 0.12, gi), 0]} rot={[0.22 + tem, gi * 5, 0.12]} s={0.85} c={col("#eef1f3", "#ffd0c8", roj)} />
  </Estudio>;
}}</Stage>;

// 25 · SE PELA: forzada, la rosca de plástico suelta virutas que se enrulan y caen
const EPelada: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const f = eio(tt, 0.5, 3.4);
  const vir = memo("viruta", () => tuboGeo(Array.from({ length: 20 }, (_, i) => { const a = i * 0.6; return [Math.cos(a) * 0.012 * (1 + i * 0.05), i * 0.002, Math.sin(a) * 0.012 * (1 + i * 0.05)] as V3; }), 0.002, 40));
  return <Estudio t={tt} cam={[0.25, 0.18, 0.45]} look={[0, 0.08, 0]} orbit={0.06}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.05, 0.05, 0.18, 32]} />{PVC(1)}</mesh>
    <mesh position={[0, 0.0, 0]} geometry={roscaGeo("roscaP", 0.051, 6, 0.018)}>{PVC(1, col("#dfe3e6", "#f4f4f2", f))}</mesh>
    <Tuerca p={[0, 0.13, 0]} rot={[0.15, tt * 2 * f, 0]} s={0.85} />
    {Array.from({ length: 9 }, (_, i) => { const q = cl(f * 1.5 - i * 0.08), a = i * 0.7;
      return <mesh key={i} geometry={vir} position={[Math.cos(a) * (0.07 + 0.05 * q), 0.1 - 0.15 * q * q, Math.sin(a) * (0.07 + 0.05 * q)]} rotation={[q * 3, i, 0]} scale={q > 0 ? 1 : 0.001}>{PVC(1, "#f4f4f2")}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 26 · APRETAR DE MÁS: en corte, la tuerca sigue bajando; la junta se aplasta y se escurre para un costado — del otro lado se abre una luz y sale la gota
const EDemas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ap = eio(tt, 0.6, 3.0), gap = cl((ap - 0.6) / 0.4);
  return <Estudio t={tt} cam={[0, 0.15, 0.7]} look={[0, 0.08, 0]} orbit={0.03}>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.04, 0.04, 0.25, 24, 1, true, 0, P]} />{PVC(1)}</mesh>
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.055, 0.055, 0.2, 24, 1, true, 0, P]} />{PVC(1)}</mesh>
    <mesh position={[0, lerp(0.14, 0.09, ap), 0]}><cylinderGeometry args={[0.075, 0.075, 0.06, 32, 1, true, 0, P]} />{PVC(1, "#dfe3e6")}</mesh>
    <mesh position={[-0.03 * ap, 0.07, 0]} scale={[1 + 0.5 * ap, 1 - 0.55 * ap, 1]} rotation={[0, 0, 0.25 * ap]}><torusGeometry args={[0.048, 0.01, 10, 30, P]} /><meshStandardMaterial color="#2c2c2c" roughness={0.55} /></mesh>
    <mesh position={[0.05, 0.07, 0.01]} visible={gap > 0.02}><boxGeometry args={[0.004, 0.012 * gap, 0.01]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>
    {gap > 0.5 && <Gota p={[0.06, 0.06, 0.02]} k={(tt * 1.1) % 1} h={0.3} c="#9fd0ee" />}
  </Estudio>;
}}</Stage>;

// 27 · ENTRA TORCIDO: el tubo de la pared queda más alto; la unión aprieta de un lado y del otro queda la rendija por donde gotea
const ETorcido: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 1.8), g = cl((tt - 2.0) / 0.6);
  return <Estudio t={tt} cam={[0.0, 0.25, 0.9]} look={[0.2, 0.2, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0.6, 0.27, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.035, 0.035, 0.4, 20]} />{PVC(1)}</mesh>
    <mesh position={[0.82, 0.3, 0]}><boxGeometry args={[0.06, 0.8, 0.5]} /><meshStandardMaterial color="#d9d3c6" /></mesh>
    <group position={[0, 0, 0]} rotation={[0, 0, -0.12 * k]}><Sifon s={0.75} /></group>
    <mesh position={[0.4, 0.29, 0.03]} visible={g > 0.02}><boxGeometry args={[0.003, 0.03 * g, 0.004]} /><meshBasicMaterial color="#ffd36a" toneMapped={false} /></mesh>
    {g > 0.5 && <Gota p={[0.4, 0.24, 0.03]} k={(tt * 1.2) % 1} h={0.4} c="#9fd0ee" />}
  </Estudio>;
}}</Stage>;

// 28 · PRESENTAR EL SIFÓN: sin tuercas, el sifón flota a su lugar, gira y se desliza buscando; cuando los dos extremos quedan rectos, se encienden las líneas guía
const EPresento: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 3.0), ok = eio(tt, 3.0, 3.5), off = (1 - k) * 0.12 * Math.sin(tt * 3);
  return <Estudio t={tt} cam={[0.0, 0.3, 1.1]} look={[0.15, 0.25, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[0.035, 0.035, 0.3, 20]} />{PVC(1)}</mesh>
    <mesh position={[0.55, 0.27, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.035, 0.035, 0.35, 20]} />{PVC(1)}</mesh>
    <group position={[off, 0.0 - 0.1 * (1 - k), 0]} rotation={[0, 0, (1 - k) * 0.3]}><Sifon s={0.75} /></group>
    {[[0, 0.55, 0, 0.002, 0.5, 0.002], [0.4, 0.27, 0, 0.5, 0.002, 0.002]].map(([x, y, z, a, b, c], i) => <mesh key={i} position={[x, y, z + 0.06]}><boxGeometry args={[a, b, c]} /><meshBasicMaterial color="#5ad87a" transparent opacity={ok} toneMapped={false} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 29 · LOS CINCO ERRORES EN EL PISO: cinco baldosas bajo el mueble; al nombrar cada error, su objeto cae sobre su baldosa y abre su charco
const ECharcos: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ob = [<Tarja w={0.3} d={0.2} h={0.08} />, <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.05, 0.04, 0.08, 20, 1, true]} /><meshStandardMaterial color="#d6362c" side={THREE.DoubleSide} /></mesh>,
    <Tuerca s={0.6} c="#ffd0c8" />, <group rotation={[P, 0, 0]}><Conica s={1.2} /></group>, <mesh position={[0, 0.02, 0]} geometry={roscaGeo("roscaE", 0.03, 3, 0.012)}>{PVC(1, "#ff8a7a")}</mesh>, <Botella s={0.2} c="#59c26a" />];
  return <Estudio t={tt} cam={[0, 1.2, 1.6]} look={[0, 0.0, 0]} orbit={0.04} mesa={false}>
    {Array.from({ length: 6 }, (_, i) => { const x = -0.9 + (i % 6) * 0.36, a = AT(h, i, 1.2), k = fall(tt, a, 0.9), ch = eio(tt, a + 0.5, a + 2.0);
      return <group key={i} position={[x, 0, 0]}>
        <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[0.34, 0.34]} /><meshStandardMaterial color={i % 2 ? "#d9cdb5" : "#cfc3aa"} roughness={0.5} /></mesh>
        <mesh position={[0.02, 0.002, 0.04]} rotation={[-P2, 0, 0]} scale={(0.03 + 0.12 * ch) * (tt > a ? 1 : 0) + 0.0005}><circleGeometry args={[1, 32]} />{AGUA(0.6, i === 5 ? "#9aae3c" : "#8a8a78")}</mesh>
        <group position={[0, 0.03 + k, 0]} visible={tt > a - 0.1}>{ob[i]}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 30 · LOS SEIS PASOS EN ESCALERA: cada paso del método levanta un escalón con su objeto, de abajo hacia arriba
const EMetodo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const ob = [<Cubeta s={0.3} />, <Guante s={0.22} />, <Sonda s={0.25} avance={0.6} />, <Sifon s={0.28} />, <group rotation={[0, 0, P2]}><Sifon s={0.28} /></group>, <Conica s={1.1} />];
  return <Estudio t={tt} cam={[0.9, 0.9, 1.9]} look={[0, 0.45, 0]} orbit={0.04}>
    {ob.map((o, i) => { const a = AT(h, i, 1.4), k = cl(IN(tt, a));
      return <group key={i} position={[-0.75 + i * 0.3, 0, -0.1 * i]}>
        <mesh position={[0, (0.08 + i * 0.12) * k / 2, 0]} scale={[1, Math.max(0.001, k), 1]}><boxGeometry args={[0.3, 0.08 + i * 0.12, 0.4]} />{M.madera(i % 2 ? "#c9a46a" : "#b8945a")}</mesh>
        <group position={[0, (0.08 + i * 0.12) * k + 0.03, 0]} scale={Math.max(0.001, k)}>{o}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 31 · EL TRUCO DEL CLIC: la tuerca gira al revés despacito… salta un milímetro (el clic, una onda de luz) y recién ahí entra derecha, vuelta tras vuelta
const EClic: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const rev = eio(tt, 0.4, 1.8), cl0 = 1.9, salto = Math.exp(-Math.pow((tt - cl0) * 9, 2)), en = eio(tt, 2.5, 4.6), on = Math.exp(-(tt - cl0) * 2.5) * (tt > cl0 ? 1 : 0);
  return <Estudio t={tt} cam={[0.25, 0.2, 0.55]} look={[0, 0.1, 0]} orbit={0.04}>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.05, 0.05, 0.18, 32]} />{PVC(1)}</mesh>
    <mesh position={[0, 0.0, 0]} geometry={roscaGeo("roscaK", 0.051, 6, 0.018)}>{PVC(1, "#dfe3e6")}</mesh>
    <Tuerca p={[0, 0.165 + 0.004 * salto - 0.006 * (tt > cl0 ? 1 : 0) - 0.09 * en, 0]} rot={[0, rev * 2.4 - en * 12, 0]} s={0.85} e={0.4 * on} c={col("#eef1f3", "#c8ffd8", on)} />
    <mesh position={[0, 0.16, 0]} rotation={[-P2, 0, 0]} scale={0.08 + 0.3 * (tt > cl0 ? (1 - on) : 0)} visible={tt > cl0 && on > 0.05}><ringGeometry args={[0.95, 1, 48]} /><meshBasicMaterial color="#8af0a8" transparent opacity={on} toneMapped={false} /></mesh>
    <Tag tt={tt} at={cl0} x={1320} y={330} txt="clic" col={VER} size={64} hand />
  </Estudio>;
}}</Stage>;

// 32 · LA PRUEBA DEL PAPEL: la tarja llena se suelta de golpe; el sifón tiembla con la presión y el papel de abajo sigue blanco… salvo donde cae una gota delatora
const EPapel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const va = eio(tt, 0.8, 3.0), tem = Math.sin(tt * 25) * 0.004 * Math.sin(va * P), gt = cl((tt - 3.0) / 0.6);
  return <Estudio t={tt} cam={[0.3, 0.35, 1.3]} look={[0, 0.15, 0]} orbit={0.04}>
    <group position={[0, 0.72, 0]}><Tarja w={0.6} d={0.4} h={0.18} agua={1 - va} remolino={va} t={tt} /></group>
    <group position={[tem, 0.1, 0]}><Sifon s={0.65} /></group>
    {va > 0.05 && va < 0.95 && <Chorro a={[0, 0.6, 0]} b={[0, 0.3, 0]} r={0.02} c="#8ec3e0" o={0.6} />}
    <mesh position={[0.05, 0.001, 0.05]} rotation={[-P2, 0, 0.1]}><planeGeometry args={[0.5, 0.35]} /><meshStandardMaterial color="#fbfbf7" roughness={1} /></mesh>
    <mesh position={[0.12, 0.002, 0.08]} rotation={[-P2, 0, 0]} scale={0.025 * gt + 0.0005}><circleGeometry args={[1, 24]} /><meshStandardMaterial color="#c9d6dc" transparent opacity={0.8} /></mesh>
    {gt > 0 && gt < 0.99 && <Gota p={[0.12, 0.3, 0.08]} k={gt} h={0.3} c="#9fd0ee" />}
  </Estudio>;
}}</Stage>;

// 33 · EL TUBITO DEL SIFÓN BOTELLA: en rayos X, el tubito baja desde arriba y cuelga dentro del vaso con su punta bajo el agua — el sello; en la punta se enrolla el pelo
const ETubito: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const ag = eio(tt, 0.6, 1.8), pe = eio(tt, 2.4, 4.0);
  return <Estudio t={tt} cam={[0.0, 0.25, 0.8]} look={[0, 0.15, 0]} orbit={0.06}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.1, 0.1, 0.3, 32, 1, true]} />{M.vidrio()}</mesh>
    <mesh position={[0, -0.05, 0]}><cylinderGeometry args={[0.1, 0.1, 0.01, 32]} />{PVC(0.6)}</mesh>
    <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.025, 0.025, 0.36, 20, 1, true]} />{PVC(0.55)}</mesh>
    <mesh position={[0, -0.045 + 0.075 * ag, 0]}><cylinderGeometry args={[0.095, 0.095, 0.15 * ag + 0.001, 32]} />{AGUA(0.6)}</mesh>
    <mesh position={[0.17, 0.12, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.022, 0.022, 0.15, 16]} />{PVC(0.6)}</mesh>
    <pointLight position={[0, 0.02, 0.12]} intensity={0.01 + 0.8 * ag} distance={0.3} color="#5aa8e6" />
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0, 0.0 + i * 0.002, 0]} rotation={[P2 + 0.3 * Math.sin(i), i, 0]} scale={Math.max(0.001, pe)}><torusGeometry args={[0.027 + 0.001 * i, 0.0018, 6, 24]} /><meshStandardMaterial color="#2a2018" /></mesh>)}
  </Estudio>;
}}</Stage>;

// 34 · EL TUBO DE UNIÓN: el tubito horizontal entre las dos piletas, en corte; el agua pasa lenta y la grasa se asienta en el piso del caño en capas
const EUnion: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 4.2);
  return <Estudio t={tt} cam={[0, 0.3, 1.2]} look={[0, 0.15, 0]} orbit={0.04}>
    <mesh position={[0, 0.15, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.07, 0.07, 1.0, 32, 1, true, 0, P]} />{PVC(1)}</mesh>
    {[0, 1, 2, 3].map((i) => { const on = cl(k * 4 - i);
      return <mesh key={i} position={[0, 0.085 + i * 0.012 * on, 0.0]} scale={[1, Math.max(0.001, on), 1]}><boxGeometry args={[1.0, 0.012, 0.09 - i * 0.012]} /><meshStandardMaterial color={col("#f1ead2", "#d9c98a", i / 3)} roughness={0.9} /></mesh>; })}
    {Array.from({ length: 10 }, (_, i) => { const q = ((tt * 0.12 + i / 10) % 1); return <mesh key={i} position={[-0.5 + q, 0.16 + 0.02 * Math.sin(i), 0.0]} scale={0.008}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#cfe6f2" /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 35 · LA BURBUJA DEL NIVEL: el nivel de burbuja apoyado sobre el tubo de unión — la burbuja se corre al centro… y apenas un poquito hacia el sifón; el agua empieza a correr
const EBurbuja: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const inc = eio(tt, 1.2, 2.6), bx = lerp(-0.08, 0.025, inc);
  return <Estudio t={tt} cam={[0, 0.35, 0.9]} look={[0, 0.12, 0]} orbit={0.04}>
    <group rotation={[0, 0, lerp(0.06, -0.025, inc)]}>
      <mesh position={[0, 0.0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.04, 0.04, 0.9, 24]} />{PVC(1)}</mesh>
      <group position={[0, 0.07 + fall(tt, 0.3, 0.6), 0]}>
        <RBox s={[0.5, 0.06, 0.05]} r={0.01}><meshStandardMaterial color="#f2c230" roughness={0.5} /></RBox>
        <mesh position={[0, 0.0, 0.026]} rotation={[0, 0, P2]}><capsuleGeometry args={[0.014, 0.12, 8, 16]} /><meshPhysicalMaterial color="#c8f08a" transparent opacity={0.6} /></mesh>
        <mesh position={[bx, 0.003, 0.04]} scale={[1.6, 1, 1]}><sphereGeometry args={[0.008, 12, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
        {[-0.03, 0.03].map((x, i) => <mesh key={i} position={[x, 0, 0.041]}><boxGeometry args={[0.002, 0.03, 0.001]} /><meshBasicMaterial color="#222" /></mesh>)}
      </group>
    </group>
    {Array.from({ length: 8 }, (_, i) => { const q = ((tt * (0.1 + 0.4 * inc) + i / 8) % 1); return <mesh key={i} position={[-0.45 + 0.9 * q, -0.02, 0.045]} scale={0.006}><sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#9fd0ee" /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 36 · LA CAMPANA DE LA DUCHA: se levanta la campanita y del desagüe sube el olor verde; vuelve a su lugar, encaja, y el olor se corta
const ECampana: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fu = eio(tt, 0.4, 1.0) * (1 - eio(tt, 3.0, 3.6)), gas = cl((tt - 0.9) / 0.4) * (1 - eio(tt, 3.4, 3.8));
  return <Estudio t={tt} cam={[0.0, 0.6, 0.65]} look={[0, 0.05, 0]} orbit={0.05}>
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[1.2, 1.2]} /><meshStandardMaterial color="#cfd6d8" roughness={0.3} /></mesh>
    <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.07, 32]} /><meshBasicMaterial color="#0a0a0a" /></mesh>
    <group position={[0.25 * fu, 0.02 + 0.2 * fu, 0]} rotation={[0, 0, 0.6 * fu]}>
      <mesh><cylinderGeometry args={[0.05, 0.06, 0.04, 32, 1, true]} />{M.cromo("#c9ced3")}</mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.05, 32]} />{M.cromo("#c9ced3")}</mesh>
    </group>
    {Array.from({ length: 8 }, (_, j) => { const q = ((tt * 0.6 + j / 8) % 1); return <mesh key={j} position={[0.03 * Math.sin(j * 2 + tt), 0.02 + 0.4 * q, 0.03 * Math.cos(j * 3)]} scale={(0.02 + 0.05 * q) * gas + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} transparent opacity={0.45 * (1 - q)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 37 · EL MONITOR DE LAS SEÑALES: una línea verde de pulso corre como en un hospital; con cada señal el pulso da un salto y aparece su objetito encima
const EMonitor: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const A5 = [0, 1, 2, 3, 4].map((i) => AT(h, i, 1.0));
  const pts = memo("ecg" + Math.round(tt * 15), () => Array.from({ length: 120 }, (_, i) => { const x = -0.8 + i / 119 * 1.6, tx = (x + 0.8) / 1.6 * 5.4; let y = 0.01 * Math.sin(i * 0.9);
    A5.forEach((a) => { const d = tx - a; if (tt > a && Math.abs(d) < 0.12) y += 0.18 * Math.exp(-d * d * 400) * (d < 0 ? 1 : -0.6); }); return [x, 0.4 + y, 0] as V3; }).filter((q, i) => (i / 119) * 5.4 <= tt));
  const ic = [<mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />{AGUA(0.8)}</mesh>, <mesh scale={0.025}><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color="#cfd6d0" transparent opacity={0.6} /></mesh>,
    <mesh scale={0.03}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} transparent opacity={0.6} /></mesh>, <Granos n={6} c="#5a3a20" tipo="cafe" area={[0.05, 0.03]} s={0.4} />, <Tarja w={0.12} d={0.08} h={0.04} agua={0.8} />];
  return <Estudio t={tt} cam={[0, 0.45, 1.6]} look={[0, 0.45, 0]} orbit={0.02} mesa={false}>
    <RBox p={[0, 0.45, -0.05]} s={[1.8, 0.75, 0.05]} r={0.04}><meshStandardMaterial color="#0e1a16" roughness={0.4} /></RBox>
    {pts.length > 1 && <Tubo pts={pts} r={0.005}><meshBasicMaterial color="#5af08a" toneMapped={false} /></Tubo>}
    {A5.map((a, i) => <group key={i} position={[-0.8 + a / 5.4 * 1.6, 0.68, 0.02]} scale={Math.max(0.001, Math.min(1, IN(tt, a)))}>{ic[i]}</group>)}
  </Estudio>;
}}</Stage>;

// 38 · LA LLAVE DE BOCA: el tornillito sinfín gira y cierra las mandíbulas sobre la tuerca de bronce, con el trapo en medio; recién ahí gira
const ELlave: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ci = eio(tt, 0.5, 2.0), tr = eio(tt, 0.8, 1.4), gi = eio(tt, 2.6, 4.0);
  return <Estudio t={tt} cam={[0.0, 0.5, 0.75]} look={[0, 0.1, 0]} orbit={0.05}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.035, 0.035, 0.4, 20]} /><meshStandardMaterial color="#b0803a" metalness={0.85} roughness={0.35} /></mesh>
    <mesh position={[0, 0.1, 0]} rotation={[0, gi * 0.6, 0]}><cylinderGeometry args={[0.06, 0.06, 0.05, 6]} /><meshStandardMaterial color="#c9a050" metalness={0.85} roughness={0.3} /></mesh>
    <mesh position={[0, 0.1, 0]} visible={tr > 0.02} scale={[1, Math.max(0.001, tr), 1]}><cylinderGeometry args={[0.068, 0.068, 0.055, 24, 1, true]} /><meshStandardMaterial color="#5f86b8" roughness={1} side={THREE.DoubleSide} /></mesh>
    <group position={[0, 0.1, 0]} rotation={[0, gi * 0.6, 0]}>
      <mesh position={[0.07 + 0.06 * (1 - ci), 0, 0]}><boxGeometry args={[0.03, 0.04, 0.1]} />{M.cromo("#b7bcc2")}</mesh>
      <mesh position={[-0.08, 0, 0]}><boxGeometry args={[0.03, 0.04, 0.1]} />{M.cromo("#b7bcc2")}</mesh>
      <mesh position={[-0.08, 0, 0.3]}><boxGeometry args={[0.03, 0.03, 0.5]} />{M.cromo("#b7bcc2")}</mesh>
      <mesh position={[0.0, 0, 0.08]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />{M.cromo("#9aa0a6")}</mesh>
      <mesh position={[0.0, 0, 0.08]} rotation={[ci * 20, 0, P2]} geometry={roscaGeo("sinfin", 0.013, 5, 0.018)}>{M.cromo("#7a8086")}</mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 39 · CRACK: la tuerca de bronce aprieta y el tubo viejo, finito por dentro (en corte), se parte en la mano
const ECrack: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ap = eio(tt, 0.5, 2.0), cr = tt > 2.2 ? 1 : 0, sep = eio(tt, 2.2, 3.0);
  return <Estudio t={tt} cam={[0.2, 0.25, 0.85]} look={[0, 0.15, 0]} orbit={0.04}>
    <group position={[0, 0.15 + 0.05 * sep, 0]} rotation={[0, 0, 0.3 * sep]}><mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.04, 0.04, 0.24, 24, 1, true, 0, P]} /><meshStandardMaterial color="#b0803a" metalness={0.8} roughness={0.4} side={THREE.DoubleSide} /></mesh></group>
    <group position={[0, 0.15, 0]} rotation={[0, 0, -0.15 * sep]}><mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.04, 0.04, 0.2, 24, 1, true, 0, P]} /><meshStandardMaterial color="#b0803a" metalness={0.8} roughness={0.4} side={THREE.DoubleSide} /></mesh></group>
    <mesh position={[0, 0.0, 0]} rotation={[0, ap * 2, 0]}><cylinderGeometry args={[0.065, 0.065, 0.05, 6]} /><meshStandardMaterial color="#c9a050" metalness={0.85} roughness={0.3} /></mesh>
    {cr > 0 && Array.from({ length: 8 }, (_, i) => { const q = cl((tt - 2.2) / 0.8); return <mesh key={i} position={[Math.cos(i) * 0.06 * (1 + 3 * q), 0.15 - 0.2 * q * q, Math.sin(i) * 0.06 * (1 + 3 * q)]} scale={0.006 * (1 - q) + 0.0005}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#5a8a5a" /></mesh>; })}
    <pointLight position={[0, 0.16, 0.15]} intensity={0.01 + 3 * Math.exp(-Math.pow((tt - 2.2) * 6, 2))} distance={0.5} color="#ffb000" />
  </Estudio>;
}}</Stage>;

// 40 · LA MANO SECA: la mano recorre el sifón; donde hay una fisura, la yema sale brillando de humedad
const EManoSeca: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 3.4), br = eio(tt, 2.4, 2.9);
  return <Estudio t={tt} cam={[0.2, 0.35, 0.9]} look={[0, 0.1, 0]} orbit={0.05}>
    <Sifon s={0.8} />
    <mesh position={[0.02, 0.0, 0.05]} rotation={[0, 0, 0.6]}><boxGeometry args={[0.03, 0.001, 0.002]} /><meshBasicMaterial color="#6d6a5c" /></mesh>
    <Mano p={[lerp(-0.25, 0.25, k), 0.06 + 0.05 * Math.sin(k * P), 0.1]} rot={[0.3, 0, 0]} s={0.32} />
    <mesh position={[lerp(-0.25, 0.25, k), 0.04 + 0.05 * Math.sin(k * P), 0.13]} scale={0.012 * br + 0.0005}><sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#cfe6f2" roughness={0} clearcoat={1} transparent opacity={0.8} /></mesh>
  </Estudio>;
}}</Stage>;

// 41 · LO QUE UNA PIZZA: la caja de pizza se abre… y adentro, en vez de pizza, un sifón nuevo con sus juntas y sus tuercas
const EPizza: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const ab = eio(tt, 0.8, 1.8), su = eio(tt, 1.8, 3.0);
  return <Estudio t={tt} cam={[0, 0.8, 0.95]} look={[0, 0.05, 0]} orbit={0.05}>
    <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.6, 0.04, 0.6]} /><meshStandardMaterial color="#c9a46a" roughness={0.9} /></mesh>
    <group position={[0, 0.04, -0.3]} rotation={[-1.9 * ab, 0, 0]}><mesh position={[0, 0, 0.3]}><boxGeometry args={[0.6, 0.012, 0.6]} /><meshStandardMaterial map={ctex("pizzaCaja", 128, 128, (g) => { g.fillStyle = "#e8d9b8"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#d6362c"; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 34, 0, 6.3); g.stroke(); })} roughness={0.9} /></mesh></group>
    <group position={[0, 0.08 + 0.15 * su, 0]} rotation={[-P2 * (1 - su), 0, 0]} scale={0.5}><Sifon s={1} agua={0} /></group>
    {[[-0.2, 0.12], [0.2, 0.12]].map(([x, z], i) => <Tuerca key={i} p={[x, 0.06, z]} s={0.6} />)}
    {[[-0.2, -0.15], [0.2, -0.15]].map(([x, z], i) => <Conica key={"c" + i} p={[x, 0.05, z]} s={0.8} />)}
  </Estudio>;
}}</Stage>;

// 42 · LA LAVADORA REBALSA: el tubo vertical detrás de la máquina se llena de pelusa y la espuma de jabón sube y desborda por arriba al piso
const EStandpipe: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ll = eio(tt, 0.6, 3.0), de = eio(tt, 2.6, 4.4);
  return <Estudio t={tt} cam={[0.4, 0.6, 1.5]} look={[0, 0.45, 0]} orbit={0.04} mesa={false}>
    <mesh position={[0, 0.5, -0.3]}><planeGeometry args={[2, 1.4]} /><meshStandardMaterial color="#e9e3d6" /></mesh>
    <mesh position={[-0.45, 0.4, 0]}><boxGeometry args={[0.6, 0.8, 0.6]} /><meshStandardMaterial color="#f4f4f2" roughness={0.3} /></mesh>
    <mesh position={[0.15, 0.45, -0.2]}><cylinderGeometry args={[0.04, 0.04, 0.9, 20, 1, true]} />{PVC(0.45)}</mesh>
    <Tubo pts={[[-0.2, 0.7, -0.1], [0.05, 0.95, -0.15], [0.15, 0.9, -0.2]]} r={0.015}><meshStandardMaterial color="#5a5f66" /></Tubo>
    <mesh position={[0.15, 0.05 + 0.4 * ll, -0.2]}><cylinderGeometry args={[0.036, 0.036, 0.8 * ll + 0.001, 20]} /><meshStandardMaterial color="#b8b4aa" roughness={1} /></mesh>
    {Array.from({ length: 14 }, (_, i) => { const q = ((tt * 0.5 + i / 14) % 1); return <mesh key={i} position={[0.15 + 0.05 * Math.sin(i) * q, 0.9 + 0.05 * q - 0.85 * q * q * de, -0.2 + 0.08 * q]} scale={0.02 * de + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#fbfbf7" /></mesh>; })}
    <mesh position={[0.1, 0.002, 0.0]} rotation={[-P2, 0, 0]} scale={0.02 + 0.35 * de}><circleGeometry args={[1, 32]} />{AGUA(0.6, "#cfe0e8")}</mesh>
  </Estudio>;
}}</Stage>;

// 43 · EL KIT SOBRE LA TOALLA: vista de arriba; primero aparece la silueta de cada cosa en la toalla y, cuando se nombra, el objeto cae justo en su sombra
const EKit: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const L: V3[] = [[-0.45, 0, -0.2], [-0.15, 0, -0.22], [0.15, 0, -0.2], [0.45, 0, -0.2], [-0.45, 0, 0.18], [-0.15, 0, 0.2], [0.15, 0, 0.2], [0.45, 0, 0.18]];
  const ob = [<Cubeta s={0.35} />, <Guante s={0.3} />, <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.22, 10]} /><meshStandardMaterial color="#e8432e" /></mesh>, <Sonda s={0.25} avance={0.5} />,
    <RBox s={[0.16, 0.03, 0.12]} r={0.01}><meshStandardMaterial color="#5f86b8" /></RBox>, <group><mesh><cylinderGeometry args={[0.04, 0.035, 0.08, 20, 1, true]} />{M.vidrio()}</mesh><Conica p={[0, -0.03, 0]} s={0.6} /></group>,
    <group>{[0, 1, 2].map((j) => <Conica key={j} p={[(j - 1) * 0.05, 0, 0]} s={0.6} />)}</group>, <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.05, 0.05, 0.12, 24]} /><meshStandardMaterial color="#fbfbf7" /></mesh>];
  return <Estudio t={tt} cam={[0, 1.4, 0.35]} look={[0, 0, 0]} orbit={0.02}>
    <mesh position={[0, 0.002, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.3, 0.8]} /><meshStandardMaterial color="#d8c9a8" roughness={1} /></mesh>
    {ob.map((o, i) => { const a = AT(h, i, 0.55), k = fall(tt, a, 0.7), sh = eio(tt, 0.2 + i * 0.08, 0.6 + i * 0.08) * (1 - eio(tt, a, a + 0.6));
      return <group key={i} position={L[i]}>
        <mesh position={[0, 0.004, 0]} rotation={[-P2, 0, 0]} scale={0.09}><circleGeometry args={[1, 24]} /><meshBasicMaterial color="#000000" transparent opacity={0.25 * sh} /></mesh>
        <group position={[0, 0.03 + k, 0]} visible={tt > a - 0.1}>{o}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 44 · LOS RIVAS: tarja doble vista de arriba — la izquierda traga en un remolino rápido, la derecha gira lenta y el agua se queda
const ERivas: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const a = eio(tt, 0.6, 2.4), b = eio(tt, 0.6, 6.0);
  return <Estudio t={tt} cam={[0, 1.2, 0.45]} look={[0, 0.5, 0]} orbit={0.02}>
    <group position={[-0.3, 0.5, 0]}><Tarja w={0.5} d={0.42} h={0.18} agua={1 - a} remolino={1} t={tt * 3} /></group>
    <group position={[0.3, 0.5, 0]}><Tarja w={0.5} d={0.42} h={0.18} agua={1 - 0.3 * b} remolino={0.3} t={tt * 0.6} ac="#8e9690" /></group>
  </Estudio>;
}}</Stage>;

// 45 · LA JUNTA VIEJA NO REBOTA: dos juntas caen al piso — la nueva rebota blandita; la de años cae seca, salta como piedra y se raja
const ERebote: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const yA = Math.abs(Math.sin((tt - 0.5) * 5)) * Math.exp(-(tt - 0.5) * 1.2) * 0.4, yB = Math.abs(Math.sin((tt - 0.8) * 9)) * Math.exp(-(tt - 0.8) * 3.5) * 0.25, rj = tt > 1.15 ? 1 : 0;
  return <Estudio t={tt} cam={[0, 0.3, 1.0]} look={[0, 0.12, 0]} orbit={0.04}>
    <group position={[-0.25, 0.04 + (tt > 0.5 ? yA : 0.5), 0]} scale={[1 + 0.25 * Math.max(0, 0.05 - yA) * 10, 1 - 0.3 * Math.max(0, 0.05 - yA) * 10, 1]}><mesh rotation={[P2, 0, 0]}><torusGeometry args={[0.07, 0.02, 12, 32]} />{GOMA("#2c2c2c")}</mesh></group>
    {[0, 1].map((k) => <group key={k} position={[0.25 + (k ? 1 : -1) * 0.03 * rj, 0.04 + (tt > 0.8 ? yB : 0.5), 0]}><mesh rotation={[P2, 0, k * P]}><torusGeometry args={[0.07, 0.02, 12, 32, rj ? P - 0.1 : P]} /><meshStandardMaterial color="#5a4a3a" roughness={0.4} /></mesh></group>)}
  </Estudio>;
}}</Stage>;

// 46 · LOS EMPUJONES DEL MUEBLE: el balde, las botellas y la bolsa entran y salen del mueble; cada vez rozan el sifón y la tuerca se afloja un poquito más
const EEmpujon: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const n = Math.min(4, Math.floor(tt / 1.1)), z = (tt % 1.1) / 1.1, emp = Math.sin(z * P), fl = n * 0.25 + emp * 0.05;
  const ob = [<Cubeta s={0.4} />, <Botella s={0.3} c="#3a7ad8" />, <Botella s={0.3} c="#59c26a" />, <RBox s={[0.2, 0.18, 0.14]} r={0.04}><meshStandardMaterial color="#e9dcc0" /></RBox>][n % 4];
  return <Estudio t={tt} cam={[0.6, 0.45, 1.2]} look={[0, 0.2, 0]} orbit={0.03} mesa={false}>
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.2, 0.04, 0.7]} />{M.madera("#b08a5a")}</mesh>
    <group position={[0.05 * emp, 0.18, -0.2]} rotation={[0, 0, 0.05 * emp]}><Sifon s={0.6} nut={fl} /></group>
    <group position={[lerp(0.6, 0.05, emp), 0.05, 0.15]}>{ob}</group>
    {n >= 3 && <Gota p={[0.06, 0.15, -0.18]} k={(tt * 1.2) % 1} h={0.15} c="#9fd0ee" />}
  </Estudio>;
}}</Stage>;

// 47 · LA TABLITA (don Ramón y doña Clara): una tabla baja como una barrera; las cosas del mueble se acercan y se frenan contra ella, sin tocar el sifón
const ETablita: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const tb = cl(IN(tt, 0.5));
  return <Estudio t={tt} cam={[0.6, 0.5, 1.2]} look={[0, 0.2, 0]} orbit={0.03} mesa={false}>
    <mesh position={[0, -0.02, 0]}><boxGeometry args={[1.2, 0.04, 0.7]} />{M.madera("#b08a5a")}</mesh>
    <Sifon p={[0, 0.18, -0.2]} s={0.6} />
    <mesh position={[0, 0.12 + 0.3 * (1 - tb), -0.02]}><boxGeometry args={[1.1, 0.22, 0.02]} />{M.madera("#e0c48a")}</mesh>
    {[[-0.3, <Cubeta s={0.35} />], [0.05, <Botella s={0.28} c="#3a7ad8" />], [0.35, <RBox s={[0.2, 0.16, 0.14]} r={0.04}><meshStandardMaterial color="#c9b07a" /></RBox>]].map(([x, o], i) => {
      const k = eio(tt, 1.4 + i * 0.6, 2.2 + i * 0.6), bump = Math.exp(-Math.pow((tt - 2.2 - i * 0.6) * 8, 2)) * 0.02;
      return <group key={i} position={[x as number, 0.0, lerp(0.45, 0.1, k) + bump]}>{o as React.ReactNode}</group>; })}
  </Estudio>;
}}</Stage>;

// 48 · LOS MITOS SE APAGAN: cinco velas, cada una delante de su mito; al nombrarlo, la llama se apaga y sube el hilo de humo
const EVelas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ob = [<Guante s={0.18} />, <mesh rotation={[0, 0, P2]}><cylinderGeometry args={[0.03, 0.03, 0.03, 20]} /><meshStandardMaterial color="#f4f4f2" /></mesh>, <Sonda s={0.15} avance={0.3} />, <mesh scale={0.03}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} /></mesh>, <Conica s={0.7} />];
  return <Estudio t={tt} cam={[0, 0.4, 1.3]} look={[0, 0.2, 0]} orbit={0.03}>
    <directionalLight position={[0, 1, 1]} intensity={0.2} />
    {ob.map((o, i) => { const a = AT(h, i, 1.0, 0.8), ap = eio(tt, a + 0.1, a + 0.4), x = -0.6 + i * 0.3;
      return <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, 0.08, 0]}><cylinderGeometry args={[0.025, 0.025, 0.16, 16]} /><meshStandardMaterial color="#f2ead2" roughness={0.6} /></mesh>
        <mesh position={[0, 0.18 + 0.004 * Math.sin(tt * 13 + i), 0]} scale={[0.012, 0.03 * (1 - ap) + 0.0005, 0.012]}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ffb000" toneMapped={false} /></mesh>
        <pointLight position={[0, 0.2, 0.05]} intensity={0.01 + 0.5 * (1 - ap)} distance={0.4} color="#ffb000" />
        <Vapor t={tt} p={[0, 0.2, 0]} o={0.3 * ap * (1 - eio(tt, a + 1.5, a + 2.5))} h={0.3} s={0.02} spread={0.02} />
        <group position={[0, 0.03, 0.12]}>{o}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 49 · LAS MARCAS DE PINZA: la linterna rasante barre la tuerca y en su borde aparecen las mordidas de los dientes
const EMarcas: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ba = lerp(-1.2, 1.2, eio(tt, 0.6, 3.8));
  return <Estudio t={tt} cam={[0.0, 0.2, 0.45]} look={[0, 0.08, 0]} orbit={0.03}>
    <directionalLight position={[0, 1, 1]} intensity={0.1} />
    <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.035, 0.035, 0.3, 20]} />{PVC(1)}</mesh>
    <Tuerca p={[0, 0.08, 0]} s={1.2} />
    {Array.from({ length: 7 }, (_, i) => { const a = -0.6 + i * 0.2, on = cl(1 - Math.abs(Math.sin(a) * 1.2 - ba) * 2);
      return <mesh key={i} position={[Math.sin(a) * 0.086, 0.08 + (i % 2) * 0.01, Math.cos(a) * 0.086]} rotation={[0, a, 0]}><boxGeometry args={[0.01, 0.004, 0.004]} /><meshStandardMaterial color="#6d6a5c" emissive="#ffd36a" emissiveIntensity={0.8 * on} /></mesh>; })}
    <spotLight position={[ba * 0.3, 0.09, 0.3]} angle={0.25} penumbra={0.8} intensity={6} distance={1} color="#fff2c8" target-position={[0, 0.08, 0]} />
  </Estudio>;
}}</Stage>;

// 50 · CADA CUÁNTO: tres sifones bajo tres relojes de arena de distinto tamaño — cocina, lavamanos, ducha — y el del inodoro con candado: ese no se abre
const EFrecuencia: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const R = (sz: number, k: number) => <group scale={sz}>
    <mesh position={[0, 0.1, 0]}><coneGeometry args={[0.06, 0.1, 24]} />{M.vidrio()}</mesh><mesh position={[0, 0.0, 0]} rotation={[P, 0, 0]}><coneGeometry args={[0.06, 0.1, 24]} />{M.vidrio()}</mesh>
    <mesh position={[0, 0.08 + 0.02 * (1 - k), 0]} scale={[1 - k * 0.9 + 0.05, 1 - k + 0.01, 1 - k * 0.9 + 0.05]}><coneGeometry args={[0.05, 0.06, 20]} /><meshStandardMaterial color="#d9b77a" /></mesh>
    <mesh position={[0, -0.03, 0]} rotation={[P, 0, 0]} scale={[k, k + 0.01, k]}><coneGeometry args={[0.05, 0.05, 20]} /><meshStandardMaterial color="#d9b77a" /></mesh></group>;
  return <Estudio t={tt} cam={[0, 0.55, 1.8]} look={[0, 0.3, 0]} orbit={0.03}>
    {[0, 1, 2, 3].map((i) => { const a = AT(h, i, 1.0), on = cl(IN(tt, a)), x = -0.75 + i * 0.5;
      return <group key={i} position={[x, 0, 0]} scale={Math.max(0.001, on)}>
        {i < 3 ? <Sifon s={0.4} /> : <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.22, 0.25, 0.18]} />{LOZA_()}</mesh>}
        <group position={[0, 0.55, 0]}>{i < 3 ? R([1.0, 1.4, 0.8][i], cl((tt - a) / [3, 5, 2.2][i])) :
          <group><mesh position={[0, -0.03, 0]}><boxGeometry args={[0.1, 0.08, 0.04]} /><meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.3} /></mesh><mesh position={[0, 0.03, 0]}><torusGeometry args={[0.03, 0.008, 8, 20, P]} />{M.cromo()}</mesh></group>}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;
const LOZA_ = () => <meshPhysicalMaterial color="#f7f6f2" roughness={0.12} clearcoat={1} />;

// 51 · EL REPASO EN AZULEJOS: una pared de azulejos; con cada consejo un azulejo gira sobre su eje y del otro lado aparece su objeto en relieve
const ERecap: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const N = (h.items ?? []).length || 12;
  const ob = (i: number) => [<Sifon s={0.18} />, <Cubeta s={0.18} />, <Tarja w={0.12} d={0.08} h={0.04} agua={0.8} />, <Guante s={0.16} />, <group>{[0, 1].map((j) => <Conica key={j} p={[(j - 0.5) * 0.06, 0, 0]} s={0.5} />)}</group>,
    <Tarja w={0.12} d={0.08} h={0.04} />, <mesh scale={[0.05, 0.03, 0.03]}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={GRIS} /></mesh>, <Sonda s={0.14} avance={0.5} />,
    <group rotation={[0, 0, -0.1]}><Sifon s={0.18} /></group>, <Conica s={0.8} />, <Tuerca s={0.5} />, <mesh rotation={[-0.4, 0, 0]}><planeGeometry args={[0.12, 0.09]} /><meshStandardMaterial color="#fbfbf7" side={THREE.DoubleSide} /></mesh>, <UVidrio s={0.18} />][i % 13];
  const C4 = 4, R4 = Math.ceil(N / C4);
  return <Estudio t={tt} cam={[0, 0.5, 1.9]} look={[0, 0.5, 0]} orbit={0.02} mesa={false}>
    {Array.from({ length: N }, (_, i) => { const a = AT(h, i, 0.45, 0.5), k = eio(tt, a - 0.2, a + 0.5), x = -0.54 + (i % C4) * 0.36, y = 0.5 + (R4 - 1) * 0.17 - Math.floor(i / C4) * 0.34;
      return <group key={i} position={[x, y, 0]} rotation={[0, k * P, 0]}>
        <mesh><boxGeometry args={[0.34, 0.32, 0.02]} /><meshStandardMaterial color="#e9e3d6" roughness={0.3} /></mesh>
        <mesh position={[0, 0, -0.011]} rotation={[0, P, 0]}><planeGeometry args={[0.33, 0.31]} /><meshStandardMaterial color="#2a4a6e" roughness={0.5} /></mesh>
        <group position={[0, -0.05, -0.04]} rotation={[0, P, 0]}>{ob(i)}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 52 · LA COLUMNA ARRIBA: en rayos X, la tarja tapada llena carga una columna de agua alta encima del sifón; una cinta métrica la mide al lado — no son 5 cm, es todo eso
const EColumna: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ll = eio(tt, 0.4, 2.4), me = eio(tt, 2.0, 3.6);
  return <Estudio t={tt} cam={[0.25, 0.45, 1.55]} look={[0, 0.4, 0]} orbit={0.04} mesa={false}>
    <group position={[0, 0.85, 0]}><mesh><boxGeometry args={[0.55, 0.22, 0.4]} />{M.vidrio()}</mesh>
      <mesh position={[0, -0.11 + 0.1 * ll, 0]}><boxGeometry args={[0.52, 0.2 * ll + 0.001, 0.37]} />{AGUA(0.7)}</mesh></group>
    <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4, 20, 1, true]} />{PVC(0.35)}</mesh>
    <mesh position={[0, 0.35 + 0.2 * ll, 0]}><cylinderGeometry args={[0.036, 0.036, 0.4 * ll + 0.001, 20]} />{AGUA(0.75)}</mesh>
    <group position={[-0.02, -0.05, 0]} scale={1.1}><UVidrio nivel={1} /></group>
    <group position={[0.38, 0.0, 0.05]}>
      <mesh position={[0, 0.5 * me, 0]} scale={[1, Math.max(0.001, me), 1]}><boxGeometry args={[0.04, 1.0, 0.004]} /><meshStandardMaterial color="#f2c230" roughness={0.5} /></mesh>
      {Array.from({ length: 20 }, (_, i) => <mesh key={i} position={[-0.012, i * 0.05, 0.003]} visible={i * 0.05 < me}><boxGeometry args={[i % 2 ? 0.012 : 0.022, 0.003, 0.001]} /><meshBasicMaterial color="#222" /></mesh>)}
    </group>
  </Estudio>;
}}</Stage>;

// 53 · LA JUNTA PLANA DEL VASO: el vaso del sifón botella sube enroscando; con la goma plana en su asiento cierra seco; con la goma doblada, un anillo de agua se escapa por todo el borde
const EPlana: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const su = eio(tt, 0.5, 2.2), fu = cl((tt - 2.3) / 0.5);
  return <Estudio t={tt} cam={[0, 0.2, 1.05]} look={[0, 0.15, 0]} orbit={0.04}>
    {[-0.3, 0.3].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.09, 0.09, 0.12, 32]} />{PVC(1)}</mesh>
      <group position={[0, lerp(0.02, 0.17, su), 0]} rotation={[0, su * 6, 0]}><mesh><cylinderGeometry args={[0.09, 0.08, 0.2, 32, 1, true]} />{PVC(1, "#e9edf0")}</mesh>
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />{PVC(1, "#e9edf0")}</mesh></group>
      <mesh position={[0, 0.26, 0]} rotation={[P2 + (i ? 0.35 : 0), 0, 0]}><torusGeometry args={[0.085, 0.008, 6, 40]} />{GOMA("#2c2c2c")}</mesh>
      {i === 1 && Array.from({ length: 16 }, (_, j) => { const a = j / 16 * 2 * P, q = ((tt * 0.9 + j * 0.13) % 1);
        return <mesh key={j} position={[Math.cos(a) * 0.095, 0.26 - 0.3 * q * q, Math.sin(a) * 0.095]} scale={0.006 * fu + 0.0005}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#9fd0ee" transparent opacity={0.85 * (1 - q)} /></mesh>; })}
      <pointLight position={[0, 0.26, 0.2]} intensity={0.01 + 0.6 * fu} distance={0.35} color={i ? "#ff5a3a" : "#5ad87a"} />
    </group>)}
  </Estudio>;
}}</Stage>;

// 54 · LOS DOS OLORES DE LOS RIVAS: la casa en miniatura vista desde arriba; un hilo verde sale de la junta mal puesta bajo la tarja y otro del desagüe del patio con la masa gris; los dos se juntan en la cocina
const EDosOlores: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const a = eio(tt, 0.6, 2.6), b = eio(tt, 1.6, 3.6);
  const rA = memo("olA", () => new THREE.CatmullRomCurve3(([[-0.35, 0.05, -0.15], [-0.3, 0.25, 0.0], [-0.1, 0.35, 0.05], [0.0, 0.4, 0.0]] as V3[]).map((v) => new THREE.Vector3(...v))));
  const rB = memo("olB", () => new THREE.CatmullRomCurve3(([[0.45, 0.03, 0.25], [0.35, 0.2, 0.2], [0.15, 0.35, 0.05], [0.0, 0.4, 0.0]] as V3[]).map((v) => new THREE.Vector3(...v))));
  const hilo = (c: THREE.CatmullRomCurve3, k: number, key: string) => Array.from({ length: 14 }, (_, i) => { const q = c.getPointAt(Math.min(0.999, i / 13 * k));
    return <mesh key={key + i} position={[q.x, q.y + 0.01 * Math.sin(tt * 3 + i), q.z]} scale={(0.02 + 0.015 * Math.sin(i + tt * 2)) * (k > 0.02 ? 1 : 0) + 0.0005}><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color={VERDE} transparent opacity={0.5} depthWrite={false} /></mesh>; });
  return <Estudio t={tt} cam={[0.0, 1.3, 0.9]} look={[0.05, 0.0, 0.05]} orbit={0.04}>
    <mesh rotation={[-P2, 0, 0]}><planeGeometry args={[1.2, 0.8]} /><meshStandardMaterial color="#d9cdb5" /></mesh>
    {([[-0.6, 0, 0.02, 0.8], [0.6, 0, 0.02, 0.8], [0, -0.4, 1.2, 0.02], [0.2, 0.05, 0.02, 0.5]] as number[][]).map(([x, z, w, d], i) => <mesh key={i} position={[x, 0.06, z]}><boxGeometry args={[w, 0.12, d]} /><meshStandardMaterial color="#efe9dc" /></mesh>)}
    <mesh position={[0.42, 0.001, 0.25]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.36, 0.3]} /><meshStandardMaterial color="#8a9a6a" /></mesh>
    <mesh position={[-0.35, 0.03, -0.25]}><boxGeometry args={[0.3, 0.06, 0.14]} />{M.cromo("#c9ced3")}</mesh>
    <mesh position={[0.45, 0.012, 0.25]} scale={[0.04, 0.012, 0.03]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={GRIS} /></mesh>
    {hilo(rA, a, "a")}{hilo(rB, b, "b")}
  </Estudio>;
}}</Stage>;

// 55 · LOS GEMELOS: dos sifones de vidrio lado a lado; los meses pasan como cuentas que se encienden debajo; el de la izquierda (sin costumbres) junta grasa en un mes, el de la derecha llega a los cuatro casi limpio
const EGemelos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const m = eio(tt, 0.6, 4.4);
  const cur = memo("ucur3", () => new THREE.CatmullRomCurve3(UPTS.map((v) => new THREE.Vector3(...v))));
  const capa = (n: number, k: number, key: string) => Array.from({ length: n }, (_, i) => { const q = cur.getPointAt(0.15 + i / n * 0.65);
    return <mesh key={key + i} position={[q.x, q.y - 0.03, q.z]} scale={0.03 * cl(k * n - i * 0.6) + 0.0005}><sphereGeometry args={[1, 10, 8]} />{GRASA()}</mesh>; });
  return <Estudio t={tt} cam={[0.0, 0.25, 1.3]} look={[0.05, 0.12, 0]} orbit={0.03}>
    <group position={[-0.32, 0, 0]}><UVidrio nivel={1} />{capa(14, cl(m * 4), "L")}</group>
    <group position={[0.32, 0, 0]}><UVidrio nivel={1} />{capa(14, m * 0.15, "R")}</group>
    {[0, 1].map((g) => Array.from({ length: 4 }, (_, i) => { const on = cl(m * 4 - i);
      return <mesh key={g + "-" + i} position={[(g ? 0.32 : -0.32) + (i - 1.5) * 0.06, -0.12, 0.05]}><sphereGeometry args={[0.013, 12, 8]} /><meshBasicMaterial color={col("#3a3f44", g ? "#5ad87a" : "#ff8a3a", g ? on : (i === 0 ? on : 0))} toneMapped={false} /></mesh>; }))}
  </Estudio>;
}}</Stage>;

export const MAP: Record<string, C> = {
  e_pies: EPies, e_curva: ECurva, e_cinco: ECinco, e_cloaca: ECloaca, e_criba: ECriba, e_tipos: ETipos, e_foto: EFoto, e_cascada: ECascada, e_esponja: EEsponja,
  e_patio: EPatio, e_chorros: EChorros, e_agarre: EAgarre, e_despiece: EDespiece, e_conica: EConica, e_valentina: EValentina, e_bolsa: EBolsa, e_escobilla: EEscobilla,
  e_remojo: ERemojo, e_rosca: ERosca, e_dedo: EDedo, e_curvasonda: ECurvaSonda, e_amanece: EAmanece, e_nivel: ENivel, e_cruzada: ECruzada, e_pelada: EPelada,
  e_demas: EDemas, e_torcido: ETorcido, e_presento: EPresento, e_charcos: ECharcos, e_metodo: EMetodo, e_clic: EClic, e_papel: EPapel, e_tubito: ETubito,
  e_union: EUnion, e_burbuja: EBurbuja, e_campana: ECampana, e_monitor: EMonitor, e_llave: ELlave, e_crack: ECrack, e_manoseca: EManoSeca, e_pizza: EPizza,
  e_standpipe: EStandpipe, e_kit: EKit, e_rivas: ERivas, e_rebote: ERebote, e_empujon: EEmpujon, e_tablita: ETablita, e_velas: EVelas, e_marcas: EMarcas,
  e_frecuencia: EFrecuencia, e_recap: ERecap, e_columna: EColumna, e_plana: EPlana, e_dosolores: EDosOlores, e_gemelos: EGemelos,
};
