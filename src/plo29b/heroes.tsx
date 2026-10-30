// plo29b · EL INODORO DE UN PLOMERO CASI NUNCA SE TAPA · componentes únicos 3D (ninguno repite mecanismo de plo29a ni entre sí).
// Cada uno: OBJETO reconocible sin leer, llegada de a uno con peso (fall/phys), el momento wow en la palabra clave, a lo sumo un rótulo DENTRO de la escena.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, lerp, MZ, phys, RED, Stage, Tag, TX, VER } from "./ckit";
import { Estudio, fall, lathe, M, papel, RBox, rn, Vapor } from "./estudio3d";
import { Mano } from "./kit3d";
import { AGUA, Botella, CanoCorte, Copa, Cubeta, Frasco, GOMA, Gota, Granos, Guante, Linterna, PVC, Sonda, Tubo, tuboGeo } from "./kitplo";
import { Bote, BordeAgujeros, Cadena, Calendario, Clip, Cochecito, Esponja, Hisopo, Inodoro, Lata, LlavePaso, LOZA, Medusa, PapelCuadro, Pastilla, Raices, Rollo, SondaInodoro, Toallita, TRAPI, Vaso } from "./kitbano";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const rel = (h: H, i: number) => (h.items?.[i]?.a ?? h.at + 99) - h.at;
const IN = (tt: number, a: number) => phys(tt, a, 7, 0.45);
const TR = new THREE.CatmullRomCurve3(TRAPI.map((q) => new THREE.Vector3(...q)));
const trap = (k: number): [number, number, number] => { const v = TR.getPoint(cl(k)); return [v.x, v.y, v.z]; };
const CACHE = new Map<string, any>();
const memo = <T,>(k: string, f: () => T): T => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const Moneda: React.FC<{ p: [number, number, number]; rot?: [number, number, number] }> = ({ p, rot }) =>
  <mesh position={p} rotation={rot} castShadow><cylinderGeometry args={[0.09, 0.09, 0.022, 32]} /><meshStandardMaterial color="#d9b24a" metalness={0.9} roughness={0.28} /></mesh>;
const Bollo: React.FC<{ p: [number, number, number]; s?: number; c?: string }> = ({ p, s = 0.06, c = "#f7f5ee" }) =>
  <mesh position={p} scale={s} castShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color={c} roughness={0.95} flatShading /></mesh>;

// 1 · EL SILENCIO: el agua de la taza sube despacito, gris, y se queda temblando en el borde
const BSilencio: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.6, 4.2), tiembla = cl((tt - 4.0) / 0.5);
  return <Estudio t={tt} cam={[0.35, 1.25, 1.35]} look={[0, 0.58, 0.05]} orbit={0.08}>
    <Inodoro nivel={0.15 + 0.85 * sube} agua={new THREE.Color("#a9cfe0").lerp(new THREE.Color("#7d7a6c"), sube).getStyle()} t={tt} />
    {tiembla > 0 && Array.from({ length: 3 }, (_, i) => { const k = ((tt * 0.9 + i / 3) % 1);
      return <mesh key={i} position={[0, 0.615, 0]} rotation={[-P2, 0, 0]} scale={[1, 1.28, 1]}><ringGeometry args={[0.05 + 0.26 * k, 0.058 + 0.26 * k, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.35 * (1 - k) * tiembla} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 2 · MENOS DE DOS DÓLARES: dos monedas caen girando y se apilan junto a la botella de vinagre; el cronómetro de arena marca 10 minutos
const BDosDolares: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const m1 = fall(tt, 0.4, 1.4), m2 = fall(tt, 0.9, 1.4), ar = eio(tt, 2.2, 6.5);
  return <>
    <Estudio t={tt} cam={[0.3, 1.0, 2.2]} look={[0.1, 0.35, 0]} orbit={0.12}>
      <Botella p={[-0.55, fall(tt, 0.1, 1.2), 0]} s={0.75} c="#f4f1e8" vidrio tx={["VINAGRE"]} tc="#fff8e0" />
      <Moneda p={[0.15, 0.011 + m1, 0.1]} rot={[m1 > 0.01 ? tt * 8 : 0, 0, m1 > 0.01 ? 0.4 : 0]} />
      <Moneda p={[0.17, 0.034 + m2, 0.1]} rot={[m2 > 0.01 ? tt * 9 : 0, 0.3, 0]} />
      {/* reloj de arena: la arena pasa de arriba a abajo */}
      <group position={[0.7, fall(tt, 1.6, 1.3), 0]}>
        {[0, 0.5].map((y) => <mesh key={y} position={[0, y, 0]} geometry={RB} castShadow><meshStandardMaterial color="#8a5a32" roughness={0.7} /></mesh>)}
        {[0.15, 0.35].map((y, i) => <mesh key={y} position={[0, y, 0]} rotation={[i ? 0 : P, 0, 0]}><coneGeometry args={[0.12, 0.2, 24, 1, true]} />{M.vidrio()}</mesh>)}
        <mesh position={[0, 0.39 - 0.04 * ar, 0]} scale={[1 - 0.8 * ar, 1 - 0.8 * ar, 1 - 0.8 * ar]}><coneGeometry args={[0.09, 0.12, 20]} /><meshStandardMaterial color="#e6c47a" roughness={0.9} /></mesh>
        <mesh position={[0, 0.06 + 0.03 * ar, 0]} scale={[0.2 + 0.8 * ar, 0.2 + 0.8 * ar, 0.2 + 0.8 * ar]}><coneGeometry args={[0.1, 0.09, 20]} /><meshStandardMaterial color="#e6c47a" roughness={0.9} /></mesh>
        {ar > 0 && ar < 1 && <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.004, 0.004, 0.2, 6]} /><meshStandardMaterial color="#e6c47a" /></mesh>}
      </group>
    </Estudio>
    <Tag tt={tt} at={1.6} x={900} y={260} txt="MENOS DE $2" col={MZ} size={52} />
  </>;
}}</Stage>;
const RB = new THREE.CylinderGeometry(0.15, 0.15, 0.03, 24);

// 3 · LAS TRES CAUSAS: tres pedestales que suben con su objeto: la toallita, el borde con sarro y el tanque medio vacío
const BTres: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const X = [-1.0, 0, 1.0], on = (i: number) => IN(tt, rel(h, i) > 90 ? 0.6 + i * 1.1 : rel(h, i));
  return <Estudio t={tt} cam={[0, 1.15, 3.0]} look={[0, 0.55, 0]} orbit={0.1}>
    {X.map((x, i) => <group key={i} position={[x, -0.7 + 0.7 * on(i), 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow><cylinderGeometry args={[0.3, 0.33, 0.4, 40]} /><meshStandardMaterial color="#2c3440" roughness={0.5} /></mesh>
      <pointLight position={[0, 1.2, 0.4]} intensity={0.01 + 2.5 * on(i)} distance={2} color="#fff0d8" />
    </group>)}
    <Toallita p={[X[0], -0.7 + 0.7 * on(0) + 0.62, 0]} rot={[-0.3, 0.2, 0]} t={tt} s={0.9} />
    <group position={[X[1], -0.7 + 0.7 * on(1) + 0.48, 0]} scale={0.32}><BordeAgujeros n={6} sarro={1} tapados={[1, 2, 4]} /></group>
    <group position={[X[2], -0.7 + 0.7 * on(2) + 0.42, 0.1]} scale={0.42}><Inodoro corteTq={1} tq={0.35} marca asiento={false} /></group>
  </Estudio>;
}}</Stage>;

// 4 · LA SOGA DE TOALLITAS: las toallitas se enroscan entre sí y forman una soga gris que se estira junto a una cinta métrica: 2 metros
const BCuerda: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const L = eio(tt, 0.5, 4.0), N = 12;
  return <>
    <Estudio t={tt} cam={[0.0, 1.1, 2.6]} look={[0, 0.25, 0]} orbit={0.1}>
      {Array.from({ length: N }, (_, i) => { const k = cl(L * N - i);
        return <group key={i} position={[-1.3 + i * 0.22, 0.12 + 0.6 * (1 - k), 0.05 * Math.sin(i * 1.7)]} rotation={[0, 0, (i % 2 ? 0.4 : -0.4) + tt * 0.05]}>
          {k > 0.01 && <Toallita t={tt + i} enrolla={0.85} s={0.95} c={new THREE.Color("#f6f7f4").lerp(new THREE.Color("#8d8a80"), 0.55 + 0.1 * Math.sin(i)).getStyle()} />}</group>; })}
      <mesh position={[-1.35 + 1.35 * L, 0.01, 0.32]} scale={[2.7 * L + 0.001, 1, 1]}><boxGeometry args={[1, 0.008, 0.07]} /><meshStandardMaterial map={papel("cinta2m", ["0     50     100     150     200 cm"], { w: 1024, h: 64, size: 40, bg: "#f2d24a" })} roughness={0.6} /></mesh>
    </Estudio>
    <Tag tt={tt} at={3.6} x={1420} y={300} txt="2 METROS" col={MZ} size={56} />
  </>;
}}</Stage>;

// 5 · LA PRUEBA DE LOS DOS FRASCOS: se agitan; en uno el papel se hace pedacitos, en el otro la toallita sale entera
const BFrascos: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ag = cl((tt - 1.0) / 0.2) * (1 - cl((tt - 3.6) / 0.2)), sh = Math.sin(tt * 28) * 0.18 * ag, k = eio(tt, 1.6, 3.8);
  return <>
    <Estudio t={tt} cam={[0, 0.85, 2.0]} look={[0, 0.4, 0]} orbit={0.08}>
      {[-0.5, 0.5].map((x, j) => <group key={j} position={[x, fall(tt, 0.1 + j * 0.25, 1.2), 0]} rotation={[0, 0, sh * (j ? -1 : 1)]}>
        <Frasco s={1.4} lleno={0.85} c="#cfe6f0" tapa={1} />
        {j === 0 ? <PapelCuadro p={[0, 0.26, 0]} s={1.2} k={k} /> : <Toallita p={[0, 0.26, 0]} s={0.42} t={tt * 3} />}
      </group>)}
    </Estudio>
    <Tag tt={tt} at={4.0} x={640} y={900} txt="SE DESHACE" col={VER} size={44} />
    <Tag tt={tt} at={4.4} x={1290} y={900} txt="SALE IGUAL" col={RED} size={44} />
  </>;
}}</Stage>;

// 6 · EL BOTE CON TAPA: el pedal se pisa, la tapa se abre y las toallitas vuelan en arco adentro; la tapa cae con peso
const BBote: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const abre = eio(tt, 0.8, 1.3) * (1 - eio(tt, 4.2, 4.5));
  return <Estudio t={tt} cam={[0.6, 1.0, 2.2]} look={[-0.1, 0.4, 0]} orbit={0.12}>
    <Inodoro p={[0.7, 0, -0.2]} s={0.75} />
    <Bote p={[-0.35, 0, 0.1]} abre={abre} s={1.1} />
    {[0, 1, 2].map((i) => { const a = 1.4 + i * 0.7, k = cl((tt - a) / 0.75); if (k <= 0 || k >= 1) return null;
      return <Toallita key={i} p={[lerp(0.6, -0.35, k), 1.0 + 0.6 * Math.sin(k * P) - 0.4 * k, lerp(0.3, 0.1, k)]} rot={[k * 4, k * 2, k * 3]} s={0.55} t={tt} />; })}
  </Estudio>;
}}</Stage>;

// 7 · EL BOLLO DE PAPEL: media mano de papel se desenrolla, se arruga en un bollo y queda trabado en el cuello del inodoro (rayos X)
const BBollo: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const des = eio(tt, 0.4, 1.8), arr = eio(tt, 1.8, 2.6), viaje = eio(tt, 2.8, 4.4);
  const bp = trap(0.42 * viaje);
  return <Estudio t={tt} cam={[1.6, 0.95, 1.2]} look={[-0.05, 0.45, -0.1]} orbit={0.1}>
    <Inodoro x={eio(tt, 2.2, 3.0)} nivel={0.1 + 0.6 * eio(tt, 4.2, 5.6)} agua="#9bb5bd" />
    {viaje < 0.01 && <Rollo p={[0.55, 1.05, 0.25]} desen={des} bollo={arr} s={0.9} />}
    {viaje > 0.01 && <Bollo p={[bp[0], bp[1], bp[2]]} s={0.075} />}
  </Estudio>;
}}</Stage>;

// 8 · LO QUE NUNCA VA: cada cosa que se nombra cae hacia la taza… y rebota de lado al bote (hilo dental, hisopo, pelo, arena, aceite)
const BNuncaVa: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const path = (a: number): [number, number, number] | null => { const k = cl((tt - a) / 1.3); if (tt < a) return null;
    return [lerp(0.05, -0.95, eio(k, 0.35, 1)), k < 0.35 ? lerp(1.6, 0.75, k / 0.35) : 0.75 + 0.5 * Math.sin((k - 0.35) / 0.65 * P) - 0.25 * (k - 0.35) / 0.65, 0.1]; };
  const objs = [(q: any) => <Medusa p={q} s={0.45} t={tt} k={0.3} />, (q: any) => <Hisopo p={q} rot={[0, 0, 1]} s={0.9} />, (q: any) => <Bollo p={q} s={0.06} c="#3a2a20" />,
    (q: any) => <Granos n={18} c="#9a9488" area={[0.08, 0.08]} y={q[1]} />, (q: any) => <Botella p={q} s={0.35} c="#e8c35a" vidrio />];
  return <Estudio t={tt} cam={[0.0, 1.45, 2.7]} look={[-0.3, 0.6, 0]} orbit={0.1}>
    <Inodoro p={[0.1, 0, 0]} s={0.95} />
    <Bote p={[-0.95, 0, 0.1]} abre={tt > rel(h, 0) - 0.4 ? 1 : 0} />
    {objs.map((f, i) => { const q = path(rel(h, i)); if (!q) return null; const k = cl((tt - rel(h, i)) / 1.3); if (k >= 1) return null;
      return <group key={i} position={i === 3 ? [q[0], 0, q[2]] : [0, 0, 0]}>{f(i === 3 ? [0, q[1], 0] : q)}</group>; })}
  </Estudio>;
}}</Stage>;

// 9 · LA MEDUSA: la sonda sale del cuello y trae colgando un rollo de hilo dental con algodones que se mece como una medusa
const BMedusa: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const sale = eio(tt, 0.4, 2.6);
  return <Estudio t={tt} cam={[0.8, 1.3, 1.9]} look={[0, 0.85, 0]} orbit={0.12}>
    <Inodoro p={[0, 0, -0.1]} s={0.85} asiento={false} />
    <group position={[0.05, 0.4 + 0.9 * sale, 0.05]}>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.012, 0.012, 1, 8]} />{M.cromo()}</mesh>
      <Medusa p={[0, 0, 0]} s={1.1} t={tt} k={1} />
    </group>
  </Estudio>;
}}</Stage>;

// 10 · LA TAPA DEL TANQUE: se levanta (pesa: sube lento), viaja y se apoya sobre una toalla doblada en el piso
const BTapaTanque: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const sube = eio(tt, 0.6, 2.0), va = eio(tt, 2.0, 3.4), baja = phys(tt, 3.4, 6, 0.6);
  const y = 1.17 + 0.3 * sube - (1.17 + 0.3 - 0.07) * baja, x = lerp(0, 1.0, va), z = lerp(-0.42, 0.25, va);
  return <Estudio t={tt} cam={[0.9, 1.4, 2.6]} look={[0.4, 0.6, -0.1]} orbit={0.1}>
    <Inodoro sinTapa />
    <mesh position={[x, y, z]} rotation={[0, 0.3 * va, 0]} geometry={TAPA} castShadow>{LOZA()}</mesh>
    <mesh position={[1.0, 0.025, 0.25]} geometry={TOALLA} castShadow receiveShadow><meshStandardMaterial color="#5f8fb8" roughness={1} /></mesh>
    {/* el tanque queda abierto (sin tapa) desde que sube */}
    <mesh position={[0, 1.17, -0.44]} geometry={HUECO} visible={sube > 0.2}><meshStandardMaterial color="#cfe7f2" roughness={0.1} /></mesh>
  </Estudio>;
}}</Stage>;
const TAPA = new THREE.BoxGeometry(0.7, 0.05, 0.26), TOALLA = new THREE.BoxGeometry(0.9, 0.05, 0.45), HUECO = new THREE.BoxGeometry(0.6, 0.005, 0.17);

// 11 · LA MARCA: tanque en corte; la raya roja se enciende y el agua queda cuatro dedos abajo; cuatro dedos se apilan en el hueco
const BMarca: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const ded = (i: number) => IN(tt, 2.2 + i * 0.35);
  return <Estudio t={tt} cam={[0.15, 1.0, 1.05]} look={[0, 0.9, -0.42]} orbit={0.06}>
    <Inodoro corteTq={eio(tt, 0.3, 1.1)} tq={0.4} marca={tt > 1.2} asiento={false} />
    {[0, 1, 2, 3].map((i) => <mesh key={i} position={[0.32, 0.66 + 0.4 * 0.4 + 0.02 + i * 0.04, -0.3]} rotation={[0, 0, P2]} scale={[1, ded(i), 1]}>
      <capsuleGeometry args={[0.017, 0.1, 6, 10]} /><meshStandardMaterial color="#d9a27c" roughness={0.6} /></mesh>)}
  </Estudio>;
}}</Stage>;

// 12 · DESCARGA FUERTE vs DÉBIL: dos inodoros en rayos X; el mismo bollo — con el tanque lleno pasa el sifón, con el bajo se queda a mitad
const BDebil: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const k = eio(tt, 1.4, 3.6);
  return <>
    <Estudio t={tt} cam={[2.4, 1.2, 2.3]} look={[0, 0.5, 0]} orbit={0.08}>
      {[-0.75, 0.75].map((x, j) => { const b = trap(j ? 0.45 * k : k);
        return <group key={j} position={[x, 0, 0]}>
          <Inodoro x={1} corteTq={1} tq={j ? 0.35 - 0.2 * k : 0.85 - 0.6 * k} asiento={false} />
          <Bollo p={[b[0], b[1], b[2]]} s={0.05} />
        </group>; })}
    </Estudio>
    <Tag tt={tt} at={3.8} x={520} y={900} txt="PASA" col={VER} size={46} />
    <Tag tt={tt} at={4.1} x={1350} y={900} txt="SE QUEDA" col={RED} size={46} />
  </>;
}}</Stage>;

// 13 · LA PERILLA DEL VASITO: el tornillo gira y el flotador sube por su columna hasta la marca
const BPerilla: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const g = eio(tt, 0.8, 3.8);
  return <Estudio t={tt} cam={[-0.35, 1.05, 0.7]} look={[-0.2, 0.92, -0.42]} orbit={0.05}>
    <Inodoro corteTq={1} tq={0.4 + 0.4 * g} marca asiento={false} />
    <group position={[-0.2, 1.17, -0.44]} rotation={[0, g * P * 6, 0]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.04, 6]} /><meshStandardMaterial color="#e6e0d0" roughness={0.4} /></mesh>
      <mesh position={[0, 0.03, 0]}><boxGeometry args={[0.06, 0.01, 0.012]} /><meshStandardMaterial color="#333" /></mesh>
    </group>
    <Mano p={[-0.12, 1.32, -0.36]} rot={[0.9, 0.3 + g * 0.6, 0]} pinza={0.7} s={0.35} />
  </Estudio>;
}}</Stage>;

// 14 · LA BOTELLA EN EL TANQUE: se hunde, el agua sube… y la columna de la descarga sale flaquita
const BBotellaTq: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const hunde = eio(tt, 0.5, 1.8), des = eio(tt, 2.6, 4.6);
  return <Estudio t={tt} cam={[0.6, 1.2, 1.4]} look={[0, 0.85, -0.3]} orbit={0.08}>
    <Inodoro corteTq={1} tq={0.8 - 0.55 * des} asiento={false} sapo={des > 0 && des < 1 ? 1 : 0} />
    <group position={[0.22, 1.35 - 0.5 * hunde, -0.44]}><Botella s={0.32} c="#d8eef6" vidrio /></group>
    {des > 0.02 && des < 0.98 && <mesh position={[0.05, 0.62, -0.3]}><cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />{AGUA(0.8)}</mesh>}
  </Estudio>;
}}</Stage>;

// 15 · LOS AGUJERITOS DEL BORDE desde abajo: salen los chorritos… el sarro va cerrando la mitad y los chorros se apagan
const BAgujeros: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const sarro = eio(tt, 2.4, 4.6);
  return <Estudio t={tt} cam={[0.2, -0.05, 1.6]} look={[0, 0.55, 0]} orbit={0.08} mesa={false}>
    <BordeAgujeros p={[0, 0.85, 0]} sarro={sarro} tapados={[0, 2, 3, 5, 7]} chorro={eio(tt, 0.6, 1.2)} t={tt} />
  </Estudio>;
}}</Stage>;

// 16 · CON EL ESPEJITO: la linterna alumbra, el espejito entra bajo el borde y en su reflejo aparecen los agujeros con costra blanca
const BEspejito: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const entra = eio(tt, 0.5, 1.8), luz = eio(tt, 1.6, 2.2);
  return <Estudio t={tt} cam={[0.4, 0.75, 1.2]} look={[0, 0.6, 0.1]} orbit={0.08}>
    <Inodoro asiento={false} />
    <group position={[lerp(0.6, 0.12, entra), 0.56, 0.32]} rotation={[-0.7, 0.4, 0]}>
      <mesh rotation={[P2, 0, 0]}><cylinderGeometry args={[0.11, 0.11, 0.015, 36]} /><meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.0081, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.1, 36]} /><meshBasicMaterial map={reflejo()} toneMapped={false} color={new THREE.Color().setScalar(0.35 + 0.65 * luz)} /></mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.014, 0.016, 0.24, 10]} /><meshStandardMaterial color="#2b2f36" /></mesh>
    </group>
    <Linterna p={[0.55, 0.85, 0.6]} rot={[-0.5, 0.6, 0]} on={luz} />
  </Estudio>;
}}</Stage>;
const reflejo = () => papelTex();
const papelTex = (() => { let tx: THREE.Texture | null = null; return () => { if (tx) return tx; const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!;
  g.fillStyle = "#e9edf0"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 6; i++) { const x = 30 + i * 40; g.fillStyle = "#1b1f24"; g.beginPath(); g.arc(x, 128, 13, 0, 7); g.fill();
    if (i % 2 === 0) { g.fillStyle = "#efe6cf"; g.beginPath(); g.arc(x, 128, 11, 0, 7); g.fill(); g.fillStyle = "#d8cba8"; g.beginPath(); g.arc(x + 3, 124, 5, 0, 7); g.fill(); } }
  tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; }; })();

// 17 · EL REMOLINO: dos tazas vistas desde arriba; la sana gira, la del sarro cae derecha
const BRemolino: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const on = eio(tt, 0.8, 1.6);
  return <>
    <Estudio t={tt} cam={[0, 2.6, 0.9]} look={[0, 0.5, 0]} orbit={0.04}>
      {[-0.55, 0.55].map((x, j) => <group key={j} position={[x, 0, 0]} scale={0.8}>
        <Inodoro remolino={j ? 0 : on} t={tt} nivel={0.1} asiento={false} />
        {j === 1 && on > 0 && Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[-0.25 + i * 0.12, 0.62 - ((tt * 1.2 + i * 0.2) % 0.25), 0.15]}><cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />{AGUA(0.7)}</mesh>)}
      </group>)}
    </Estudio>
    <Tag tt={tt} at={2.0} x={560} y={960} txt="GIRA" col={VER} size={44} />
    <Tag tt={tt} at={2.4} x={1360} y={960} txt="CAE DERECHA" col={RED} size={44} />
  </>;
}}</Stage>;

// 18 · EL CLIP ABIERTO: el clip se despliega, entra en un agujero y caen las migas de sarro
const BClip: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const abre = eio(tt, 0.4, 1.4), entra = eio(tt, 1.6, 2.4), gira = Math.max(0, tt - 2.4);
  return <Estudio t={tt} cam={[0.25, 0.25, 0.95]} look={[0, 0.6, 0]} orbit={0.06} mesa={false}>
    <BordeAgujeros p={[0, 0.85, 0]} sarro={1} tapados={[3, 4, 5]} limpio={0.4 + 0.08 * cl(gira / 2)} n={9} />
    <group position={[0, 0.5 + 0.25 * entra, 0.05]} rotation={[0, gira * 6, 0]}><Clip s={1.2} abierto={abre} rot={[P, 0, 0]} /></group>
    {gira > 0 && Array.from({ length: 14 }, (_, i) => { const a = 2.5 + i * 0.12, k = cl((tt - a) / 0.8); return k > 0 && k < 1 ?
      <mesh key={i} position={[(rn(i, 1) - 0.5) * 0.06, 0.76 - 0.5 * k * k, 0.05 + (rn(i, 2) - 0.5) * 0.05]} scale={0.008 + 0.006 * rn(i, 3)}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#efe8d6" flatShading /></mesh> : null; })}
  </Estudio>;
}}</Stage>;

// 19 · EL CHORRO DE ABAJO (jet): en rayos X, un chorro fuerte sale del agujero del fondo y empuja todo al cuello: arranca el sifón
const BJet: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const j = eio(tt, 1.0, 1.6) * (1 - eio(tt, 4.2, 4.8)), k = eio(tt, 1.6, 3.6);
  return <Estudio t={tt} cam={[1.7, 0.85, 0.9]} look={[0, 0.4, -0.05]} orbit={0.1}>
    <Inodoro x={1} asiento={false} nivel={0.1 - 0.1 * k} />
    <mesh position={[0, 0.36, 0.14]} rotation={[1.25, 0, 0]} scale={[1, j, 1]}><coneGeometry args={[0.045, 0.32, 16, 1, true]} /><meshPhysicalMaterial color="#5fb8ff" emissive="#5fb8ff" emissiveIntensity={0.6} transparent opacity={0.7} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    {[0, 1, 2].map((i) => { const b = trap(cl(k * 1.2 - i * 0.12)); return <Bollo key={i} p={b} s={0.03} />; })}
  </Estudio>;
}}</Stage>;

// 20 · EL HOTELITO DE LA COSTA: 20 inodoros chiquitos en fila; al limpiar cada chorro, cada uno se enciende con su remolino, uno por uno
const BHotel: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = eio(tt, 1.0, 5.5) * 20;
  return <Estudio t={tt} cam={[0, 2.2, 3.4]} look={[0, 0.2, -0.2]} orbit={0.1}>
    {Array.from({ length: 20 }, (_, i) => { const x = -1.6 + (i % 10) * 0.36, z = i < 10 ? -0.6 : 0.1, on = cl(k - i);
      return <group key={i} position={[x, 0.6 * (1 - IN(tt, 0.1 + i * 0.04)), z]} scale={0.26}>
        <Inodoro remolino={on} t={tt + i} asiento={false} agua={on > 0.5 ? "#8fd0ff" : "#b8b2a2"} />
        <pointLight position={[0, 1.2, 0.5]} intensity={0.01 + 1.2 * on} distance={1.4} color="#9fd8ff" />
      </group>; })}
  </Estudio>;
}}</Stage>;

// 21 · EL SAPO QUE SE CIERRA ANTES: tanque en corte; la goma sube, el agua baja… y la goma cae cuando queda la mitad
const BSapo: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const abre = eio(tt, 0.8, 1.2) * (1 - phys(tt, 2.6, 9, 0.35)), baja = eio(tt, 1.0, 2.6);
  return <Estudio t={tt} cam={[0.1, 0.95, 0.8]} look={[0.02, 0.85, -0.42]} orbit={0.05}>
    <Inodoro corteTq={1} tq={0.82 - 0.4 * baja} marca sapo={abre} cadena={0.9} asiento={false} />
  </Estudio>;
}}</Stage>;

// 22 · LA CADENITA: muy larga cuelga floja; se acorta eslabón por eslabón hasta quedar con dos de juego
const BCadena: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const k = eio(tt, 1.0, 3.6);
  return <Estudio t={tt} cam={[0.35, 1.0, 0.45]} look={[0.12, 0.9, -0.42]} orbit={0.04}>
    <Inodoro corteTq={1} tq={0.8} cadena={1.4 - 1.2 * k} asiento={false} />
  </Estudio>;
}}</Stage>;

// 23 · FALDA vs COPA PLANA en el cuello (corte): la plana deja escapar burbujas por los costados, la de falda sella y empuja
const BFalda: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const em = Math.max(0, Math.sin((tt - 1.2) * 4)) * cl(tt - 1.2);
  return <>
    <Estudio t={tt} cam={[0, 0.9, 2.3]} look={[0, 0.45, 0]} orbit={0.06}>
      {[-0.6, 0.6].map((x, j) => <group key={j} position={[x, 0, 0]}>
        <CanoCorte p={[0, 0.25, 0]} rot={[0, 0, P2]} L={0.6} r={0.14} />
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.6, 0.06, 0.4]} />{AGUA(0.5)}</mesh>
        <Copa p={[0, 0.56 + fall(tt, 0.2 + j * 0.2, 0.8) - 0.06 * em, 0]} s={0.75} falda={j === 1} aplasta={em * 0.5} />
        {j === 0 && em > 0.1 && Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[(i % 2 ? 1 : -1) * (0.2 + 0.05 * i), 0.55 + ((tt * 0.8 + i * 0.13) % 0.4), 0]} scale={0.02 + 0.01 * (i % 3)}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.6, "#ffffff")}</mesh>)}
      </group>)}
    </Estudio>
    <Tag tt={tt} at={2.6} x={560} y={930} txt="SE ESCAPA" col={RED} size={42} />
    <Tag tt={tt} at={3.0} x={1360} y={930} txt="SELLA" col={VER} size={42} />
  </>;
}}</Stage>;

// 24 · DIEZ EMPUJADAS: el destapacaños sube y baja recto; un anillo de diez cuentas se enciende una por empujada; a la décima, sale y el agua se va
const BDiez: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const n = Math.min(10, Math.max(0, Math.floor((tt - 0.8) / 0.42))), ph = tt < 5.0 ? Math.max(0, Math.sin((tt - 0.8) / 0.42 * P * 2)) : 0;
  const sale = eio(tt, 5.0, 5.4), baja = eio(tt, 5.3, 6.6);
  return <Estudio t={tt} cam={[0.0, 1.5, 2.0]} look={[0, 0.7, 0]} orbit={0.06}>
    <Inodoro nivel={0.55 - 0.5 * baja} remolino={baja * (1 - baja) * 4} t={tt} asiento={false} />
    <group position={[0, 0.52 - 0.05 * ph + 0.5 * sale, 0.06]}><Copa s={0.8} falda aplasta={ph * 0.6} /></group>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * P * 2 - P2, on = i < n ? 1 : 0;
      return <mesh key={i} position={[Math.cos(a) * 0.65, 1.25 + Math.sin(a) * 0.0, Math.sin(a) * 0.3 - 0.1]} scale={0.035 + 0.012 * on}><sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color={on ? "#f2c230" : "#3a3f48"} emissive={on ? "#f2a020" : "#000000"} emissiveIntensity={on ? 0.8 : 0} roughness={0.3} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 25 · LA SONDA DE INODORO en rayos X: la manivela gira, el cable sigue la curva del sifón y vuelve con un muñequito enganchado
const BSondaIn: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const va = eio(tt, 0.8, 3.0), vuelve = eio(tt, 3.6, 5.4), k = 0.8 * va * (1 - vuelve);
  const pts = Array.from({ length: 12 }, (_, i) => trap((i / 11) * k));
  const geo = k > 0.02 ? memo('sonda' + Math.round(k * 200), () => tuboGeo(pts as any, 0.014, 40, 6)) : null;
  const tip = trap(k);
  return <Estudio t={tt} cam={[1.7, 1.0, 1.1]} look={[0, 0.5, -0.1]} orbit={0.1}>
    <Inodoro x={1} asiento={false} />
    {geo && <mesh geometry={geo}>{M.cromo("#c9ccd0")}</mesh>}
    <SondaInodoro p={[0, 0.3 + 0.35 * (1 - va + vuelve), 0.06]} rot={[0, 0, 0]} s={0.7} giro={tt * 1.5} />
    {tt > 3.0 && <group position={tip}><Cochecito s={0.35} c="#2d6fd0" /></group>}
  </Estudio>;
}}</Stage>;

// 26 · LAS RAÍCES: bajo la tierra, un caño con una fisura; una raicita entra y se hace red adentro
const BRaices: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 5.0);
  return <Estudio t={tt} cam={[0.3, 0.75, 2.1]} look={[0, 0.45, 0]} orbit={0.08} mesa={false}>
    <mesh position={[0, 0.9, -0.3]}><boxGeometry args={[4, 0.06, 1.6]} /><meshStandardMaterial color="#5b7a32" roughness={1} /></mesh>
    <mesh position={[0, 0.45, -0.6]}><boxGeometry args={[4, 0.9, 0.2]} /><meshStandardMaterial color="#4a3020" roughness={1} /></mesh>
    <mesh position={[0.9, 1.5, -0.4]}><cylinderGeometry args={[0.12, 0.18, 1.2, 14]} />{M.madera("#5a3c22")}</mesh>
    <mesh position={[0.9, 2.15, -0.4]}><sphereGeometry args={[0.55, 20, 14]} /><meshStandardMaterial color="#3f6a2a" roughness={0.9} /></mesh>
    <CanoCorte p={[0, 0.35, 0]} L={2.8} r={0.2} />
    <Raices p={[0.15, 0.55, 0.0]} s={0.9} k={k} />
    <mesh position={[0.15, 0.555, 0]} rotation={[0, 0, 0.1]}><boxGeometry args={[0.05, 0.01, 0.02]} /><meshBasicMaterial color="#111" /></mesh>
  </Estudio>;
}}</Stage>;

// 27 · EL ÁCIDO EN EL CODO: el líquido verde se queda quieto en el codo de fierro, burbujea y lo come: aparecen agujeros y gotea
const BAcido: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const come = eio(tt, 1.8, 4.6);
  const codo = memo('codo', () => tuboGeo([[-0.8, 0.7, 0], [-0.1, 0.7, 0], [0.1, 0.6, 0], [0.15, 0.3, 0], [0.15, -0.2, 0]], 0.09, 60, 20));
  return <Estudio t={tt} cam={[0.0, 0.8, 1.6]} look={[0, 0.45, 0]} orbit={0.08} mesa={false}>
    <mesh geometry={codo}><meshStandardMaterial color={new THREE.Color("#5a5048").lerp(new THREE.Color("#8a4a22"), come).getStyle()} metalness={0.5} roughness={0.6} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh position={[0.08, 0.58, 0]} scale={[0.12, 0.06, 0.08]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#6ee04a" emissive="#4ac02a" emissiveIntensity={0.5} transparent opacity={0.85} /></mesh>
    {Array.from({ length: 6 }, (_, i) => { const k = ((tt * 1.3 + i / 6) % 1); return <mesh key={i} position={[0.05 + (rn(i, 1) - 0.5) * 0.1, 0.6 + 0.12 * k, (rn(i, 2) - 0.5) * 0.05]} scale={0.012 * (1 - k)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#b8ff9a" /></mesh>; })}
    {come > 0.3 && [0, 1, 2].map((i) => { const k = ((tt * 0.9 + i / 3) % 1); return <mesh key={i} position={[0.06 + i * 0.05, 0.52 - 0.5 * k * k, 0.02]} scale={[0.012, 0.018, 0.012]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#6ee04a" emissive="#4ac02a" emissiveIntensity={0.5} /></mesh>; })}
    {[0, 1, 2].map((i) => <mesh key={"h" + i} position={[0.0 + i * 0.07, 0.62 - i * 0.03, 0.085]} scale={cl(come * 3 - i) * 0.025}><circleGeometry args={[1, 10]} /><meshBasicMaterial color="#0c0a08" /></mesh>)}
  </Estudio>;
}}</Stage>;

// 28 · LOS CINCO ERRORES como dominó: cada ficha lleva su objeto; al nombrar el error cae sobre la siguiente
const BErrores: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const cae = (i: number) => eio(tt, rel(h, i) + 0.2, rel(h, i) + 0.8);
  const obj = [<Toallita s={0.3} t={tt} />, <mesh scale={0.06}><cylinderGeometry args={[1, 1, 1.2, 18]} /><meshStandardMaterial color="#3a3a3a" /></mesh>,
    <Botella s={0.2} c="#e8432e" />, <group rotation={[0, 0, 0.6]}><mesh><boxGeometry args={[0.18, 0.03, 0.04]} />{M.cromo()}</mesh></group>, <Calendario s={0.22} dia="?" mes="NUNCA" />];
  return <Estudio t={tt} cam={[0.6, 1.0, 2.6]} look={[0, 0.35, 0]} orbit={0.1}>
    {[0, 1, 2, 3, 4].map((i) => <group key={i} position={[-1.2 + i * 0.6, 0, 0]} rotation={[0, 0, -1.25 * cae(i)]}>
      <group position={[0, 0.6 * (1 - IN(tt, 0.2 + i * 0.12)), 0]}>
        <RBox p={[0, 0.3, 0]} s={[0.08, 0.6, 0.34]} r={0.02}><meshStandardMaterial color="#f4efe2" roughness={0.5} /></RBox>
        <mesh position={[0.045, 0.3, 0]} rotation={[0, P2, 0]}><planeGeometry args={[0.3, 0.3]} /><meshStandardMaterial map={papel("dom" + i, [String(i + 1)], { w: 256, h: 256, bg: "#f4efe2", ink: "#c0392b", size: 180 })} /></mesh>
        <group position={[0, 0.72, 0]}>{obj[i]}</group>
      </group>
    </group>)}
  </Estudio>;
}}</Stage>;

// 29 · EL PRIMERO DEL MES: la hoja del calendario se arranca y aparece el «1» con la botella de vinagre al lado
const BPrimero: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  return <Estudio t={tt} cam={[0.3, 0.9, 1.8]} look={[0.1, 0.55, 0]} orbit={0.08}>
    <group position={[-0.15, 0.6 + fall(tt, 0.1, 1.0), 0]}><Calendario arranca={0} dia="1" mes="CADA MES" s={1.1} /></group>
    <group position={[-0.15, 0.6, 0.06]} visible={tt < 3.2}><group position={[0, 0.21, 0.03]} rotation={[-2.4 * eio(tt, 1.6, 2.6), 0, 0.4 * eio(tt, 1.6, 2.6)]}>
      <mesh position={[0, -0.28, 0]}><planeGeometry args={[0.62, 0.55]} /><meshStandardMaterial map={papel("cald31", ["31"], { w: 512, h: 460, bg: "#fbf9f3", ink: "#9a9a9a", size: 300 })} side={THREE.DoubleSide} /></mesh></group></group>
    <Botella p={[0.65, fall(tt, 2.4, 1.0), 0.1]} s={0.6} c="#f4f1e8" vidrio tx={["VINAGRE"]} tc="#fff8e0" />
  </Estudio>;
}}</Stage>;

// 30 · PAPEL CON VINAGRE BAJO EL BORDE: tiras de papel se pegan sobre la fila de agujeros; el vinagre las empapa (se oscurecen) y el sarro se ablanda
const BPapelBorde: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const pone = eio(tt, 0.5, 2.0), moja = eio(tt, 2.4, 4.4);
  return <Estudio t={tt} cam={[0.2, 0.15, 1.5]} look={[0, 0.65, 0]} orbit={0.06} mesa={false}>
    <BordeAgujeros p={[0, 0.85, 0]} sarro={1 - 0.6 * moja} tapados={[1, 2, 4, 6, 7]} n={9} />
    {Array.from({ length: 4 }, (_, i) => <mesh key={i} position={[-0.6 + i * 0.4, 0.77 - 0.3 * (1 - cl(pone * 4 - i)), 0.06]} rotation={[P2, 0, 0.05 * Math.sin(i)]}>
      <planeGeometry args={[0.42, 0.22]} /><meshStandardMaterial color={new THREE.Color("#fbfaf6").lerp(new THREE.Color("#d9c99a"), moja).getStyle()} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.92} /></mesh>)}
    {moja > 0 && moja < 1 && Array.from({ length: 8 }, (_, i) => { const k = ((tt * 1.1 + i / 8) % 1); return <mesh key={i} position={[-0.7 + i * 0.2, 0.77 - 0.4 * k * k, 0.08]} scale={[0.012, 0.018, 0.012]}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.7, "#e8dca8")}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 31 · EL VINAGRE POR EL REBOSADERO: en rayos X, el vinagre entra al tubo alto, baja por el canal interno y sale por cada agujerito del borde (camino que se ilumina)
const BRebosadero: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const k = eio(tt, 1.0, 4.2);
  const camino = memo('camino', () => new THREE.CatmullRomCurve3([[0.08, 1.15, -0.44], [0.08, 0.7, -0.44], [0.0, 0.66, -0.3], [0, 0.63, -0.15], [0.3, 0.62, 0.0], [0, 0.62, 0.42], [-0.3, 0.62, 0.0], [0, 0.63, -0.15]].map((q) => new THREE.Vector3(...(q as [number, number, number])))));
  const geo = k > 0.02 ? memo('reb' + Math.round(k * 120), () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(camino.getPoints(60).slice(0, Math.max(2, Math.round(60 * k)))), 60, 0.018, 8)) : null;
  return <Estudio t={tt} cam={[1.3, 1.5, 1.4]} look={[0, 0.75, -0.15]} orbit={0.08}>
    <Inodoro x={0.85} corteTq={1} tq={0.2} tapa={1} asiento={false} />
    <Botella p={[0.25, 1.35, -0.44]} rot={[0, 0, 2.2 * eio(tt, 0.4, 1.0)]} s={0.35} c="#f4f1e8" vidrio />
    {geo && <mesh geometry={geo}><meshBasicMaterial color="#ffe08a" toneMapped={false} /></mesh>}
  </Estudio>;
}}</Stage>;

// 32 · LA CUBETA DESDE LA CINTURA: la cubeta se vuelca de golpe, la masa de agua cae a la taza y en rayos X limpia el cuello
const BCubeta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const vuelca = eio(tt, 1.2, 1.7), cae = cl((tt - 1.5) / 0.45), x = eio(tt, 2.0, 2.6), lim = eio(tt, 2.4, 3.8);
  return <Estudio t={tt} cam={[1.5, 1.3, 1.8]} look={[0, 0.7, 0]} orbit={0.1}>
    <Inodoro x={x} asiento={false} tapon={1 - lim} tc="#c8c0a8" nivel={0.2 + 0.4 * cae * (1 - lim)} />
    <group position={[0.15, 1.45, 0.35]} rotation={[0, 0, 1.9 * vuelca]}><Cubeta s={0.75} nivel={0.8 * (1 - cae)} agua="#cfe7f2" /></group>
    {cae > 0 && cae < 1 && <mesh position={[0.05, 1.3 - 0.6 * cae, 0.1]} scale={[0.22, 0.35 * (1 - cae) + 0.05, 0.18]}><sphereGeometry args={[1, 20, 14]} />{AGUA(0.6, "#cfe7f2")}</mesh>}
    <Vapor t={tt} p={[0, 0.65, 0]} o={0.18 * cl(cae * 2)} h={0.6} s={0.25} />
  </Estudio>;
}}</Stage>;

// 33 · EL COCHECITO: un auto de juguete cruza la mesada, salta y cae al inodoro (la única vez en 25 años)
const BCochecito: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 2.2), cae = cl((tt - 2.2) / 0.5);
  const x = lerp(-1.4, 0.0, k), y = cae > 0 ? 0.62 - 0.4 * cae * cae : 0.66 + 0.25 * Math.sin(cl((k - 0.75) / 0.25) * P) * (k > 0.75 ? 1 : 0);
  return <Estudio t={tt} cam={[0.2, 1.3, 2.2]} look={[-0.3, 0.6, 0]} orbit={0.08}>
    <Inodoro p={[0, 0, -0.05]} asiento />
    <RBox p={[-0.95, 0.31, 0.05]} s={[0.9, 0.62, 0.6]} r={0.03}><meshStandardMaterial color="#e9e3d6" roughness={0.6} /></RBox>
    <group position={[x, y, 0.08]} rotation={[0, 0, -cae * 1.2 + (k > 0.75 && cae === 0 ? 0.2 : 0)]}><Cochecito s={1.2} /></group>
    {cae >= 1 && Array.from({ length: 6 }, (_, i) => { const a = 2.7 + i * 0.02, kk = cl((tt - a) / 0.6); return <mesh key={i} position={[Math.cos(i) * 0.15 * kk, 0.62 + 0.3 * Math.sin(kk * P), Math.sin(i) * 0.15 * kk]} scale={0.02 * (1 - kk)}><sphereGeometry args={[1, 8, 6]} />{AGUA(0.8)}</mesh>; })}
  </Estudio>;
}}</Stage>;

// 34 · LA MANO EN EL SAPO: el agua de la taza sube; una mano entra al tanque y aprieta la goma abajo; la otra levanta el flotador: el agua se frena
const BSapoMano: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const mete = eio(tt, 0.6, 1.6), frena = eio(tt, 1.6, 2.2);
  return <Estudio t={tt} cam={[0.6, 1.5, 1.4]} look={[0, 0.85, -0.3]} orbit={0.08}>
    <Inodoro corteTq={0.9} tapa={1} tq={0.6} sapo={1 - frena} flot={0.6 + 0.35 * frena} nivel={0.6 + 0.3 * eio(tt, 0, 1.6)} asiento={false} />
    <Mano p={[0.02, 1.35 - 0.55 * mete, -0.42]} rot={[1.4, 0, 0]} pinza={0.2} s={0.32} />
    <Mano p={[-0.25, 1.4 - 0.25 * mete + 0.1 * frena, -0.42]} rot={[1.3, 0.4, 0]} pinza={0.8} s={0.3} />
  </Estudio>;
}}</Stage>;

// 35 · LA LLAVE DE PASO: la mariposa gira a la derecha y el agua que corría por el caño (partículas) se frena
const BLlavePaso: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const g = eio(tt, 1.0, 2.4);
  return <Estudio t={tt} cam={[0.35, 0.5, 0.9]} look={[0, 0.3, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 0.3, -0.12]}><boxGeometry args={[2, 1.4, 0.04]} /><meshStandardMaterial color="#e9edf0" roughness={0.4} /></mesh>
    <LlavePaso p={[0, 0.45, -0.05]} giro={g} s={1.3} />
    <mesh position={[0, 0.6, -0.05]} rotation={[0, 0, P2]}><cylinderGeometry args={[0.012, 0.012, 0.6, 10]} />{M.cromo("#b8bcc2")}</mesh>
    {Array.from({ length: 10 }, (_, i) => { const y = 0.15 + ((tt * 0.6 * (1 - g) + i / 10) % 1) * 0.3; return g < 0.95 ? <mesh key={i} position={[0, y, -0.05]} scale={0.009 * (1 - g)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#8fd0ff" /></mesh> : null; })}
  </Estudio>;
}}</Stage>;

// 36 · EL KIT EN EL RINCÓN: un tablero de ganchos en la pared; cada cosa se cuelga cuando se nombra
const BKit: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const on = (i: number) => IN(tt, rel(h, i));
  const X = [-0.9, -0.45, 0, 0.45, 0.9, -0.67, -0.22, 0.22];
  const Y = [0.95, 0.95, 0.95, 0.95, 0.95, 0.45, 0.45, 0.45];
  const it = [<Copa s={0.5} falda />, <SondaInodoro s={0.45} />, <Guante s={0.55} />, <Esponja s={1.2} />, <Clip s={1.6} />, <Botella s={0.4} c="#f4f1e8" vidrio />, <mesh scale={[0.18, 0.12, 0.03]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#c9a46a" roughness={1} /></mesh>, <Linterna on={0.8} />];
  return <Estudio t={tt} cam={[0, 0.75, 2.4]} look={[0, 0.62, 0]} orbit={0.06} mesa={false}>
    <mesh position={[0, 0.65, -0.12]} receiveShadow><boxGeometry args={[2.3, 1.3, 0.04]} /><meshStandardMaterial color="#b8925e" roughness={0.9} /></mesh>
    {X.map((x, i) => <group key={i}>
      <mesh position={[x, Y[i] + 0.12, -0.08]} rotation={[P2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />{M.cromo()}</mesh>
      <group position={[x, Y[i] + 0.9 * (1 - on(i)), 0]} scale={on(i) + 0.001}>{it[i]}</group>
    </group>)}
  </Estudio>;
}}</Stage>;

// 37 · MARTA: TRES CAUSAS JUNTAS: tres anillos (toallitas, tanque bajo, sarro) se acercan y se traban en el centro, que se enciende rojo
const BMarta: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const j = (i: number) => eio(tt, rel(h, i) > 90 ? 0.6 + i * 0.9 : rel(h, i), (rel(h, i) > 90 ? 0.6 + i * 0.9 : rel(h, i)) + 1.0), c3 = Math.min(j(0), j(1), j(2));
  const A = [P2, P2 + 2.09, P2 + 4.19];
  return <Estudio t={tt} cam={[0, 1.6, 2.6]} look={[0, 0.6, 0]} orbit={0.12}>
    {A.map((a, i) => { const r = lerp(1.2, 0.3, j(i));
      return <group key={i} position={[Math.cos(a) * r, 0.65 + Math.sin(a) * r * 0.6, 0]}>
        <mesh rotation={[0, 0, 0]}><torusGeometry args={[0.42, 0.02, 10, 60]} /><meshStandardMaterial color={["#f6f7f4", "#8fd0ff", "#efe6cf"][i]} emissive={["#f6f7f4", "#8fd0ff", "#efe6cf"][i]} emissiveIntensity={0.3} /></mesh>
        <group scale={0.5}>{[<Toallita t={tt} s={0.6} />, <Inodoro s={0.4} corteTq={1} tq={0.3} asiento={false} p={[0, -0.45, 0]} />, <BordeAgujeros s={0.3} sarro={1} tapados={[0, 1, 2]} n={4} />][i]}</group>
      </group>; })}
    <mesh position={[0, 0.65, 0]} scale={0.04 + 0.1 * c3}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#e8432e" emissive="#e8432e" emissiveIntensity={1.2 * c3} /></mesh>
  </Estudio>;
}}</Stage>;

// 38 · LOS MITOS: cada objeto sobre una trampilla; al nombrarlo, la trampilla se abre y el mito cae al vacío
const BMitos: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const ab = (i: number) => eio(tt, rel(h, i) + 1.2, rel(h, i) + 1.6), caeY = (i: number) => -2.5 * Math.pow(cl((tt - rel(h, i) - 1.4) / 0.8), 2);
  const it = [<group><mesh scale={[0.18, 0.16, 0.18]}><cylinderGeometry args={[1, 1, 1, 24]} />{M.cromo()}</mesh><Vapor t={tt} p={[0, 0.1, 0]} o={0.3} h={0.5} s={0.2} /></group>,
    <Pastilla s={1.5} />, <Lata s={1.2} />, <Inodoro s={0.25} asiento={false} />, <group><Botella s={0.28} c="#f4f1e8" vidrio /><mesh position={[0.2, 0.05, 0]} scale={[0.1, 0.06, 0.1]}><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh></group>];
  return <Estudio t={tt} cam={[0, 1.4, 2.8]} look={[0, 0.2, 0]} orbit={0.08} mesa={false}>
    {it.map((o, i) => { const x = -1.3 + i * 0.65;
      return <group key={i} position={[x, 0, 0]}>
        {[-1, 1].map((s) => <group key={s} position={[s * 0.25, 0, 0]} rotation={[0, 0, s * 1.4 * ab(i)]}><mesh position={[-s * 0.125, 0, 0]} receiveShadow><boxGeometry args={[0.25, 0.03, 0.5]} /><meshStandardMaterial color="#3a3f48" roughness={0.6} /></mesh></group>)}
        <group position={[0, 0.06 + 0.6 * (1 - IN(tt, 0.2 + i * 0.15)) + caeY(i), 0]} visible={caeY(i) > -2.4}>{o}</group>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 39 · LA LOZA SE RAJA: agua hirviendo sobre la loza fría: la raja corre por la porcelana con vapor
const BRaja: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 1.6, 3.4);
  const raja = memo('raja', () => tuboGeo(Array.from({ length: 9 }, (_, i) => [0.33 * Math.cos(1.2 - i * 0.12), 0.6 - i * 0.04 + (rn(i, 1) - 0.5) * 0.02, 0.42 * Math.sin(1.2 - i * 0.12)] as [number, number, number]), 0.005, 40, 4));
  return <Estudio t={tt} cam={[0.9, 1.0, 1.3]} look={[0, 0.5, 0]} orbit={0.08}>
    <Inodoro asiento={false} />
    <group position={[0.2, 1.1, 0.2]} rotation={[0, 0, 1.2 * eio(tt, 0.4, 1.0)]}><mesh scale={[0.15, 0.13, 0.15]}><cylinderGeometry args={[1, 1, 1, 24]} />{M.cromo()}</mesh></group>
    <Vapor t={tt} p={[0, 0.55, 0.1]} o={0.35 * eio(tt, 1.0, 1.6)} h={0.8} s={0.3} />
    <mesh geometry={raja} scale={[1, 1, 1]} visible={k > 0.02}><meshBasicMaterial color="#2a2420" /></mesh>
    <mesh position={[0.33 * Math.cos(1.2 - 8 * 0.12 * k), 0.6 - 8 * 0.04 * k, 0.42 * Math.sin(1.2 - 8 * 0.12 * k)]} scale={0.012 * (k > 0 && k < 1 ? 1 : 0)}><sphereGeometry args={[1, 8, 6]} /><meshBasicMaterial color="#ffd27a" /></mesh>
  </Estudio>;
}}</Stage>;

// 40 · LAS CINCO SEÑALES en el mismo inodoro: cada una aparece cuando se nombra (nivel bajo, sin remolino, sube antes de bajar, burbujas en la ducha, olor)
const BSenales: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const s = (i: number) => tt >= rel(h, i) && (i === 4 || tt < rel(h, i + 1));
  const sube = s(2) ? Math.sin(cl((tt - rel(h, 2)) / 2) * P) : 0;
  return <Estudio t={tt} cam={[0.6, 1.4, 2.3]} look={[0.2, 0.55, 0]} orbit={0.1}>
    <Inodoro nivel={s(0) ? -0.4 : 0.1 + 0.5 * sube} remolino={s(1) ? 0 : 0.6} t={tt} asiento={false} />
    {/* ducha al costado con burbujas en la rejilla */}
    <mesh position={[1.0, 0.01, 0.1]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.12, 24]} />{M.cromo("#b8bcc2")}</mesh>
    {s(3) && Array.from({ length: 6 }, (_, i) => { const k = ((tt * 1.4 + i / 6) % 1); return <mesh key={i} position={[1.0 + (rn(i, 1) - 0.5) * 0.12, 0.02 + 0.2 * k, 0.1 + (rn(i, 2) - 0.5) * 0.12]} scale={0.02 * (1 - k * 0.5)}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.5, "#ffffff")}</mesh>; })}
    {s(4) && Array.from({ length: 3 }, (_, i) => { const k = ((tt * 0.5 + i / 3) % 1); return <mesh key={i} position={[0.0, 0.7 + 0.6 * k, 0.0]} rotation={[0, tt + i * 2, 0]} scale={[0.25 + 0.2 * k, 0.04, 0.25 + 0.2 * k]}><torusGeometry args={[1, 0.25, 8, 30]} /><meshBasicMaterial color="#9bb06a" transparent opacity={0.35 * (1 - k)} depthWrite={false} /></mesh>; })}
  </Estudio>;
}}</Stage>;

// 41 · EL ACEITE QUE TAPA LA EVAPORACIÓN: dos tazas vistas de arriba; sin aceite el agua baja día a día; con la película dorada, queda
const BAceite: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const d = eio(tt, 1.4, 5.0);
  return <>
    <Estudio t={tt} cam={[0, 2.0, 1.4]} look={[0, 0.45, 0]} orbit={0.05}>
      {[-0.55, 0.55].map((x, j) => <group key={j} position={[x, 0, 0]} scale={0.8}>
        <Inodoro nivel={j ? 0.1 : 0.1 - 0.6 * d} asiento={false} agua={j ? "#a9cfe0" : "#a9cfe0"} />
        {j === 1 && <mesh position={[0, 0.425, 0]} rotation={[-P2, 0, 0]} scale={[1, 1.28, 1]}><circleGeometry args={[0.155, 40]} /><meshPhysicalMaterial color="#e8b84a" transparent opacity={0.6 * eio(tt, 0.4, 1.2)} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>}
        {j === 0 && <Vapor t={tt} p={[0, 0.45, 0]} o={0.25 * d} h={0.5} s={0.18} />}
      </group>)}
    </Estudio>
  </>;
}}</Stage>;

// 42 · EL RESUMEN: tres columnas (lo que se tira, el sarro, el agua del tanque); cada consejo cae como un bloque sobre su columna
const BRecap: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const N = (h.items ?? []).length;
  return <Estudio t={tt} cam={[0, 1.4, 3.2]} look={[0, 0.8, 0]} orbit={0.1}>
    {[-0.9, 0, 0.9].map((x, c) => <mesh key={c} position={[x, 0.03, 0]} receiveShadow><boxGeometry args={[0.7, 0.06, 0.5]} /><meshStandardMaterial color={["#e9e3d6", "#efe6cf", "#cfe7f2"][c]} roughness={0.6} /></mesh>)}
    {Array.from({ length: N }, (_, i) => { const c = i % 3, lvl = Math.floor(i / 3), y = 0.1 + lvl * 0.13, a = rel(h, i);
      return <group key={i} position={[[-0.9, 0, 0.9][c] + (rn(i, 1) - 0.5) * 0.08, y + fall(tt, a, 1.6), 0]} rotation={[0, (rn(i, 2) - 0.5) * 0.3, 0]}>
        <RBox s={[0.6, 0.11, 0.4]} r={0.025}><meshStandardMaterial color={new THREE.Color(["#f6f2e8", "#f2e6c4", "#d6ecf6"][c]).offsetHSL(0, 0, -0.04 * lvl).getStyle()} roughness={0.5} /></RBox>
      </group>; })}
  </Estudio>;
}}</Stage>;

// 43 · SABER QUÉ BUSCAS (don Ernesto): la linterna barre el caño por arriba y lo que hay adentro aparece recién cuando la luz pasa
const BBusca: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const bx = lerp(-1.0, 1.0, eio(tt, 0.8, 4.2)), seen = (x: number) => IN(tt, 0.8 + ((x + 1.0) / 2.0) * 3.4);
  const a = seen(-0.45), b = seen(0.42);
  return <Estudio t={tt} cam={[0, 0.95, 2.4]} look={[0, 0.4, 0]} orbit={0.08}>
    <Tubo pts={[[-1.25, 0.3, 0], [1.25, 0.3, 0]]} r={0.17} o={0.32} />
    <group position={[-0.45, 0.3, 0]} scale={Math.max(0.001, a)} visible={a > 0.01}><Hisopo s={0.9} rot={[0, 0, 0.3]} /></group>
    <group position={[0.42, 0.3, 0]} scale={Math.max(0.001, b)} visible={b > 0.01}><Toallita s={0.22} t={tt * 2} /></group>
    <group position={[bx, 0.98, 0]}>
      <Linterna rot={[P2, 0, 0]} on={1} />
      <mesh position={[0, -0.33, 0]}><coneGeometry args={[0.24, 0.6, 32, 1, true]} /><meshBasicMaterial color="#fff3c4" transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} /></mesh>
    </group>
  </Estudio>;
}}</Stage>;

// 44 · NUNCA RAYAR LA LOZA: el alambre pelado deja una raya y en la raya se junta el sarro; el de funda pasa y no deja nada
const BRaya: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k = eio(tt, 0.5, 2.5), sar = eio(tt, 2.9, 4.9), z = lerp(-0.28, 0.28, k);
  return <>
    <Estudio t={tt} cam={[0, 0.95, 0.95]} look={[0, 0.08, 0]} orbit={0.06}>
      <group position={[0, 0.03 + fall(tt, 0.05, 1.0), 0]}><RBox s={[1.25, 0.06, 0.75]} r={0.02}>{LOZA()}</RBox></group>
      {[-0.32, 0.32].map((x, j) => <group key={j}>
        <group position={[x, 0.062, z]} rotation={[0.6, 0, 0]}>
          <mesh position={[0, 0.21, 0]} castShadow><cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />{M.cromo()}</mesh>
          {j === 1 && <mesh position={[0, 0.025, 0]}><capsuleGeometry args={[0.018, 0.04, 6, 12]} />{GOMA()}</mesh>}
        </group>
        {j === 0 && k > 0.01 && <mesh position={[x, 0.0605, -0.28 + 0.28 * k]} scale={[1, 1, 0.56 * k]}><boxGeometry args={[0.006, 0.002, 1]} /><meshStandardMaterial color="#6d665c" roughness={1} /></mesh>}
        {j === 0 && sar > 0.01 && <group position={[x, 0.058, 0]}><Granos n={34} tipo="cafe" c="#b08a52" area={[0.012, 0.5]} y={0.004} s={0.7 * sar} /></group>}
      </group>)}
    </Estudio>
    <Tag tt={tt} at={3.3} x={720} y={930} txt="SE PEGA EL SARRO" col={RED} size={40} />
    <Tag tt={tt} at={3.8} x={1250} y={930} txt="CON FUNDA" col={VER} size={40} />
  </>;
}}</Stage>;

// 45 · AGUA DURA, CAPA POR CAPA: cada gota deja un anillo blanco que achica el agujerito… y una gota de vinagre los disuelve en burbujas
const BCapas: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const grow = cl((tt - 0.6) / 3.0), dis = eio(tt, 4.4, 6.2), lay = grow * (1 - dis), T = 0.1;
  const gk = tt < 3.6 ? ((tt - 0.3) % 0.6) / 0.6 : 0;
  return <>
    <Estudio t={tt} cam={[0.05, 0.62, 0.62]} look={[0, 0.1, 0]} orbit={0.05}>
      <group position={[0, 0.05, 0]}><RBox s={[0.8, 0.1, 0.6]} r={0.02}>{LOZA()}</RBox></group>
      <mesh position={[0, T + 0.001, 0]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.12, 40]} /><meshStandardMaterial color="#15181c" roughness={1} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} visible={lay * 6 > i} position={[0, T + 0.004 + i * 0.003, 0]} rotation={[P2, 0, 0]}>
        <torusGeometry args={[0.112 - i * 0.012, 0.009, 8, 40]} /><meshStandardMaterial color={new THREE.Color("#efe6cf").offsetHSL(0, 0, -0.025 * i).getStyle()} roughness={0.95} /></mesh>)}
      {tt > 0.3 && tt < 3.6 && <Gota p={[0, T, 0]} k={gk} h={0.55} />}
      <Gota p={[0, T, 0]} k={eio(tt, 3.9, 4.4)} h={0.55} c="#fff1cc" />
      {dis > 0.03 && dis < 0.97 && Array.from({ length: 9 }, (_, i) => { const a = i * 0.7, r = 0.05 + 0.05 * rn(i, 3);
        return <mesh key={i} position={[Math.cos(a) * r, T + 0.01 + ((tt * 0.35 + i * 0.11) % 0.22), Math.sin(a) * r]} scale={0.01 + 0.008 * rn(i, 4)}><sphereGeometry args={[1, 10, 8]} />{AGUA(0.6, "#f4efe0")}</mesh>; })}
    </Estudio>
    <Tag tt={tt} at={4.8} x={960} y={930} txt="CADA 15 DÍAS" col={VER} size={44} />
  </>;
}}</Stage>;

// 46 · EL TAPÓN DE AGUA contra el olor: el gas de la cloaca sube por el caño y choca con el agua del sifón; cuando el agua se evapora, pasa a la casa
const SELLO = new THREE.CatmullRomCurve3(([[1.1, -0.2, 0], [1.1, 0.55, 0], [0.95, 0.7, 0], [0.55, 0.7, 0], [0.4, 0.55, 0], [0.4, 0.3, 0], [0.25, 0.12, 0], [0, 0.08, 0], [-0.25, 0.12, 0], [-0.4, 0.3, 0], [-0.4, 0.95, 0], [-0.4, 1.35, 0]] as [number, number, number][]).map((q) => new THREE.Vector3(...q)));
const SELLO_PTS: [number, number, number][] = SELLO.getSpacedPoints(80).filter((v) => v.y < 1.0).map((v) => [v.x, v.y, v.z]);
const BSello: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const lvl = Math.round(lerp(0.42, 0.04, eio(tt, 3.2, 5.0)) * 50) / 50;
  const [agua, tope] = memo("sello" + lvl, () => { const r: [number, number, number][] = []; let u0 = 1.2;
    for (let u = 0.36; u <= 0.86; u += 0.01) { const v = SELLO.getPointAt(u); if (v.y < lvl) { r.push([v.x, v.y, v.z]); if (u0 > 1) u0 = u - 0.03; } }
    return [r, r.length > 1 ? u0 : 1.2] as [[number, number, number][], number]; });
  return <>
    <Estudio t={tt} cam={[0.35, 0.7, 2.7]} look={[0.35, 0.5, 0]} orbit={0.06} mesa={false}>
      <Tubo pts={SELLO_PTS} r={0.09} o={0.3} />
      {agua.length > 1 && <Tubo pts={agua} r={0.08}>{AGUA(0.9, "#7fc4e6")}</Tubo>}
      {Array.from({ length: 10 }, (_, i) => { const u0 = (tt * 0.16 + i / 10) % 1, u = Math.min(u0, tope), v = SELLO.getPointAt(Math.min(1, u));
        const o = u0 < tope ? 0.5 : 0.5 * (1 - cl((u0 - tope) / 0.15)), sc = 0.05 * (u > 0.95 ? 1 + (u - 0.95) * 30 : 1);
        return o > 0.02 ? <mesh key={i} position={[v.x + 0.02 * Math.sin(i + tt), v.y, v.z]} scale={sc}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial color="#8da23f" transparent opacity={o} depthWrite={false} roughness={1} /></mesh> : null; })}
    </Estudio>
    <Tag tt={tt} at={1.4} x={1010} y={900} txt="TAPÓN DE AGUA" col={VER} size={42} />
    <Tag tt={tt} at={5.4} x={620} y={180} txt="OLOR A CLOACA" col={RED} size={42} />
  </>;
}}</Stage>;

export const MAP: Record<string, C> = {
  b_silencio: BSilencio, b_dosdolares: BDosDolares, b_tres: BTres, b_cuerda: BCuerda, b_frascos: BFrascos, b_bote: BBote, b_bollo: BBollo, b_nuncava: BNuncaVa,
  b_medusa: BMedusa, b_tapatanque: BTapaTanque, b_marca: BMarca, b_debil: BDebil, b_perilla: BPerilla, b_botellatq: BBotellaTq, b_agujeros: BAgujeros,
  b_espejito: BEspejito, b_remolino: BRemolino, b_clip: BClip, b_jet: BJet, b_hotel: BHotel, b_sapo: BSapo, b_cadena: BCadena, b_falda: BFalda, b_diez: BDiez,
  b_sondain: BSondaIn, b_raices: BRaices, b_acido: BAcido, b_errores: BErrores, b_primero: BPrimero, b_papelborde: BPapelBorde, b_rebosadero: BRebosadero,
  b_cubeta: BCubeta, b_cochecito: BCochecito, b_sapomano: BSapoMano, b_llavepaso: BLlavePaso, b_kit: BKit, b_marta: BMarta, b_mitos: BMitos, b_raja: BRaja,
  b_senales: BSenales, b_busca: BBusca, b_raya: BRaya, b_capas: BCapas, b_sello: BSello, b_aceite: BAceite, b_recap: BRecap,
};
