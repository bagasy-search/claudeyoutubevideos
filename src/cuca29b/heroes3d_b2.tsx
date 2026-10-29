// cuca29b · NIXTAMAL · componentes 3D, segunda mitad (trucos 14-25 + rutina, lo que nunca hacía y repaso).
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, img, lerp, MZ, phys, RED, Stage, Tag, TX } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Foto3D, Llama, Mano, Olla } from "./kit3d";
import { C, COL, Comal, ent, Grano, granoGeo, jarroGeo, Masa, Tortilla, tortTex } from "./heroes3d_b1";

const P = Math.PI, P2 = P / 2;

// ── 14 · BOLITA: dos bolitas bajo dos tablitas que bajan; la seca se abre en grietas por el borde, la buena queda lisita
const H3Bolita: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ap1 = eio(tt, 0.3, 1.0), grieta = eio(tt, 0.6, 2.4), ap2 = eio(tt, 5.6, 6.3);
  const Disco: React.FC<{ x: number; ap: number; seca: boolean }> = ({ x, ap, seca }) => (
    <group position={[x, 0, 0.2]}>
      <mesh position={[0, 0.08 + 0.17 * (1 - ap), 0]} scale={[0.26 + 0.24 * ap, 0.24 * (1 - ap) + 0.05, 0.26 + 0.24 * ap]} castShadow><sphereGeometry args={[1, 32, 16]} /><meshStandardMaterial color={seca ? "#d8c690" : "#ecdcac"} roughness={0.95} /></mesh>
      {seca && Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 6.28 + rn(i, 1) * 0.3; return <mesh key={i} position={[Math.cos(a) * (0.5 * ap - 0.06), 0.135, Math.sin(a) * (0.5 * ap - 0.06)]} rotation={[-P2, 0, -a]} scale={[0.14 * grieta, 0.012, 1]}><planeGeometry args={[1, 1]} /><meshBasicMaterial color="#5a4220" /></mesh>; })}
      <RBox p={[0, 0.5 - 0.33 * ap + (1 - ent(tt, x < 0 ? 0 : 5.0)) * 1.2, 0]} s={[1.1, 0.06, 1.1]} r={0.02}>{M.madera("#8a5a30")}</RBox>
    </group>);
  return <>
    <Estudio t={tt} cam={[0, 2.2, 3.4]} look={[0, 0.2, 0]} orbit={0.12}>
      <Disco x={-0.75} ap={ap1} seca />
      <Disco x={0.75} ap={ap2} seca={false} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 14" title="LA BOLITA QUE NO SE AGRIETA" />
    <Tag tt={tt} at={1.8} x={620} y={900} txt="LE FALTA AGUA" col={RED} size={44} />
    <Tag tt={tt} at={6.2} x={1300} y={900} txt="LISITA" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 15 · AGUA TIBIA: jarro frío escarchado contra jarro tibio que humea; el tibio cae sobre la masa y la masa se alisa
const H3Tibia: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const vierte = eio(tt, 3.2, 3.9) * (1 - eio(tt, 5.0, 5.6)), fria = cl((tt - 4.2) * 2), liso = eio(tt, 3.9, 6.0), palma = eio(tt, 5.6, 6.6);
  return <>
    <Estudio t={tt} cam={[0, 1.7, 3.6]} look={[0, 0.5, 0]} orbit={0.12}>
      <group position={[-1.2, 0, -0.1]}>
        <mesh geometry={jarroGeo} scale={1.3} castShadow><meshPhysicalMaterial color="#cfe4f2" roughness={0.6} transparent opacity={0.85} /></mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0]} scale={0.5 + 0.5 * fria} visible={fria > 0.02}><ringGeometry args={[0.18, 0.22, 4]} /><meshBasicMaterial color="#d23a2a" side={THREE.DoubleSide} transparent opacity={fria} /></mesh>
      </group>
      <group position={[lerp(1.2, 0.55, vierte), 0.05 + 0.5 * vierte, 0]} rotation={[0, 0, 1.2 * vierte]}>
        <mesh geometry={jarroGeo} scale={1.3} castShadow>{M.barro("#a65a35")}</mesh>
        <Vapor t={tt} p={[0, 0.85, 0]} o={0.35} h={0.9} s={0.25} />
      </group>
      {vierte > 0.7 && <Chorro a={[0.25, 0.9, 0]} b={[0.0, 0.3, 0.2]} r={0.03} c="#d9eef4" o={0.6} />}
      <group position={[0, 0, 0.2]}>
        <mesh geometry={lathe([[0, 0], [0.4, 0], [0.55, 0.18], [0.58, 0.2]])} castShadow receiveShadow>{M.barro("#8f4a28")}</mesh>
        <Masa p={[0, 0.2, 0]} s={0.32} grumo={1 - liso} c={liso > 0.5 ? "#ecdcac" : "#d8c690"} />
      </group>
      <Mano p={[0, 0.55 - 0.22 * palma + 0.6 * (1 - palma), 0.25]} rot={[P2 * 0.1, 0, 0]} s={1.1} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 15" title="EL AGUA DE LA MASA, TIBIA" />
    <Tag tt={tt} at={4.4} x={420} y={760} txt="FRÍA, NUNCA" col={RED} size={42} />
  </>;
}}</Stage>;

// ── 16 · EL COMAL: la lumbre sube, caen gotitas de agua y BRINCAN y bailan sobre el hierro: está listo; cae la tortilla y se infla
const H3Infla: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const fuego = eio(tt, 0.2, 1.6), cae = tt - 4.6, tort = ent(tt, 6.9), infla = eio(tt, 7.3, 8.0);
  return <>
    <Estudio t={tt} cam={[0, 2.1, 2.9]} look={[0, 0.2, 0]} orbit={0.12}>
      <Comal p={[0, 0.25, 0]} s={1.1} />
      <Llama p={[0, 0.05, 0]} f={0.8 * fuego} t={tt} r={0.6} />
      {Array.from({ length: 12 }, (_, i) => { const at = cae - i * 0.1; if (at < 0) return null; const bounce = Math.abs(Math.sin(at * (9 + rn(i, 1) * 5))) * 0.12 * Math.exp(-at * 0.5);
        const x = (rn(i, 2) - 0.5) * 1.3 + Math.sin(at * 3 + i) * 0.08 * cl(at - 0.6), z = (rn(i, 3) - 0.5) * 1.0, y = at < 0.35 ? 1.2 - at * 3 : 0.37 + bounce;
        const s = 0.035 * (1 - cl((at - 2.6) / 0.8));
        return s > 0.002 ? <mesh key={i} position={[x, y, z]} scale={[s, s * 0.7, s]}><sphereGeometry args={[1, 10, 8]} />{M.liquido("#dff2f6", 0.85)}</mesh> : null; })}
      {Array.from({ length: 6 }, (_, i) => <Vapor key={i} t={tt + i} p={[(rn(i, 5) - 0.5) * 1.2, 0.38, (rn(i, 6) - 0.5) * 0.8]} n={3} o={0.3 * cl(cae - 0.5) * (1 - cl(cae - 3))} h={0.4} s={0.12} />)}
      <Tortilla p={[0, 0.39 + (1 - tort) * 1.3, 0]} rot={[(1 - tort) * 0.6, 0, 0]} s={1.25} infla={infla * 0.9} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 16" title="COMAL CALIENTE Y TRES VUELTAS" />
    <Tag tt={tt} at={6.3} x={1400} y={360} txt="SI BAILAN, ESTÁ LISTO" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── 17 · LA PRENSA Y LA MONEDA: la prensa de madera se cierra sobre la bolita; la tortilla sale y queda parada junto a una moneda: mismo grueso
const H3Calibre: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const cierra = eio(tt, 5.8, 6.4) * (1 - eio(tt, 6.6, 7.0)), aplast = eio(tt, 5.9, 6.4), moneda = ent(tt, 1.0);
  return <>
    <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.4, 0]} orbit={0.12}>
      <group position={[-0.5, 0, 0]}>
        <RBox p={[0, 0.05, 0]} s={[1.3, 0.1, 1.3]} r={0.03}>{M.madera("#9a6a3c")}</RBox>
        <group position={[0, 0.1, -0.65]} rotation={[-(1 - cierra) * 1.7, 0, 0]}><RBox p={[0, 0.03, 0.65]} s={[1.3, 0.08, 1.3]} r={0.03}>{M.madera("#a87644")}</RBox></group>
        <mesh position={[0, 0.12 + 0.1 * (1 - aplast), 0]} scale={[0.22 + 0.33 * aplast, 0.18 * (1 - aplast) + 0.012, 0.22 + 0.33 * aplast]}><sphereGeometry args={[1, 32, 16]} /><meshStandardMaterial color="#ecdcac" roughness={0.95} /></mesh>
      </group>
      <group position={[0.95, 0, 0.4]}>
        <mesh position={[0, 0.5 + (1 - moneda) * 1.5, 0]} rotation={[P2, 0, 0.25]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.02, 40]} />{M.cromo("#c9a64a")}</mesh>
        <group position={[0.35, 0.5, 0]} rotation={[P2, 0, 0.25]} scale={0.9}><Tortilla p={[0, 0, 0]} s={0.9} /></group>
        <RBox p={[0.2, 0.2, 0]} s={[0.9, 0.04, 0.3]} r={0.01}>{M.madera("#6a4024")}</RBox>
      </group>
      <mesh position={[1.12, 0.52, 0.42]} rotation={[0, 0, 0]}><boxGeometry args={[0.5, 0.006, 0.006]} /><meshBasicMaterial color="#ffcf70" transparent opacity={cl((tt - 2.4) * 2)} /></mesh>
    </Estudio>
    <Head tt={tt} kick="TRUCO 17" title="EL GROSOR DE UNA MONEDA" />
    <Tag tt={tt} at={3.0} x={1380} y={310} txt="2 MILÍMETROS" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 18 · CHIQUIHUITE: canasta de palma con servilleta bordada; las tortillas caen y se apilan; la servilleta se cierra y el vapor queda adentro
const palmaTex = () => ctex("palma", 256, 256, (g) => { g.fillStyle = "#c9a46a"; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) for (let x = 0; x < 256; x += 16) { g.fillStyle = (x / 16 + y / 16) % 2 ? "#b08a50" : "#d8b47a"; g.fillRect(x + 1, y + 1, 14, 14); } });
const H3Chiqui: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const cierra = eio(tt, 4.9, 6.0);
  return <>
    <Estudio t={tt} cam={[0, 2.2, 3.2]} look={[0, 0.3, 0]} orbit={0.14}>
      <mesh geometry={lathe([[0, 0], [0.62, 0], [0.75, 0.4], [0.78, 0.42]], 48)} castShadow receiveShadow><meshStandardMaterial map={palmaTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const at = 1.8 + i * 0.2; return tt < at - 0.4 ? null : <Tortilla key={i} p={[0.02 * Math.sin(i), 0.06 + i * 0.022 + fall(tt, at, 0.9), 0.02 * Math.cos(i)]} rot={[0, i, 0]} s={1.18} />; })}
      {[-1, 1].map((s) => <group key={s} position={[s * 0.62, 0.42, 0]} rotation={[0, 0, s * lerp(-1.1, 1.45, cierra)]}>
        <mesh position={[-s * 0.4, 0, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.85, 1.3, 8, 8]} /><meshStandardMaterial color="#f4f0e6" roughness={0.95} side={THREE.DoubleSide} /></mesh>
        <mesh position={[-s * 0.75, 0.003, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[0.1, 1.3]} /><meshStandardMaterial color="#c0392b" side={THREE.DoubleSide} /></mesh></group>)}
      <Vapor t={tt} p={[0, 0.5, 0]} o={0.35 * (1 - cierra)} h={0.8} s={0.25} spread={0.4} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 18" title="CHIQUIHUITE Y SERVILLETA" />
    <Tag tt={tt} at={6.4} x={1380} y={330} txt="EL VAPOR SE QUEDA" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── B · LA RUTINA: escalera de cinco escalones de madera; en cada «paso» sube un escalón con su foto, la cámara sube con ella
const H3Escalera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false} cam={0.6}>{(tt) => {
  const T = [0.7, 5.3, 13.1, 20.3, 24.3], fotos = h.imgs ?? ["fb01", "fb03", "fb07", "fb13", "fb18"];
  const n = T.filter((a) => tt >= a).length, sube = T.reduce((s, a) => s + eio(tt, a, a + 1.0), 0);
  return <>
    <Estudio t={tt} cam={[2.2, 1.4 + sube * 0.42, 4.2]} look={[-0.2 + sube * 0.1, 0.6 + sube * 0.42, 0]} orbit={0.08}>
      {T.map((a, i) => { const k = ent(tt, a); return <group key={i} position={[-1.6 + i * 0.75, lerp(-1.5, 0, k), 0]}>
        <RBox p={[0, (i + 1) * 0.21, 0]} s={[0.72, (i + 1) * 0.42, 1.2]} r={0.03}>{M.madera(i % 2 ? "#7a5232" : "#8a5e3a")}</RBox>
        <Foto3D src={img(fotos[i])} p={[0, (i + 1) * 0.42 + 0.48, -0.1]} rot={[-0.12, -0.35, 0]} w={0.82} h={0.56} />
        <mesh position={[0.25, (i + 1) * 0.42 + 0.02, 0.45]} rotation={[-P2, 0, 0]}><circleGeometry args={[0.13, 32]} /><meshStandardMaterial color={i < n ? "#e9b33a" : "#5a4a3a"} emissive="#e9b33a" emissiveIntensity={i === n - 1 ? 0.6 : 0} /></mesh>
      </group>; })}
    </Estudio>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="EN CINCO PASOS" />
    {T.map((a, i) => (n - 1 === i ? <Tag key={i} tt={tt} at={a + 0.3} x={520} y={880} txt={`PASO ${i + 1}`} col={MZ} size={54} /> : null))}
  </>;
}}</Stage>;

// ── 19 · RINDE: el kilo de maíz entra por la tolva del costal y del otro lado crece una montaña de masa casi del doble
const H3Embudo: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const crece = eio(tt, 0.2, 2.6), baja = eio(tt, 0, 2.4), pila = eio(tt, 5.4, 6.8);
  return <>
    <Estudio t={tt} cam={[0, 1.6, 3.9]} look={[0, 0.6, 0]} orbit={0.12}>
      <group position={[-1.0, 0, 0]}>
        {Array.from({ length: 50 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.4 * (1 - (i % 6) / 8); return (i / 50) > 1 - baja * 0.8 ? null : <Grano key={i} p={[Math.cos(a) * r, 0.04 + (i % 6) * 0.05, Math.sin(a) * r]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.07} c={COL.nixta} />; })}
      </group>
      <mesh position={[0.9, 0.02 + 0.45 * crece, 0]} scale={[0.75, 0.9 * crece + 0.01, 0.75]} castShadow><sphereGeometry args={[1, 40, 20, 0, 6.29, 0, P2]} /><meshStandardMaterial color="#ecdcac" roughness={0.95} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <Tortilla key={i} p={[0.9, 0.05 + i * 0.022 + (1 - ent(tt, 5.5 + i * 0.12)) * 1.4, 0.9]} rot={[0, i, 0]} s={0.75 * (pila > 0 ? 1 : 0)} />)}
      <mesh position={[-0.05, 0.9, 0]} rotation={[0, 0, -P2]}><coneGeometry args={[0.12, 0.4, 3]} /><meshStandardMaterial color="#e9b33a" emissive="#e9b33a" emissiveIntensity={0.4} /></mesh>
    </Estudio>
    <Head tt={tt} kick="TRUCO 19" title="CUÁNTO RINDE UN KILO" />
    <Tag tt={tt} at={0.3} x={560} y={860} txt="1 KG MAÍZ" col={TX} size={44} />
    <Tag tt={tt} at={1.2} x={1360} y={860} txt="1,8 KG MASA" col={MZ} size={50} />
  </>;
}}</Stage>;

// ── 20 · ALCANCÍA: cochinito de barro; caen monedas con física: lo que se ahorra por cada kilo hecho en casa
const H3Alcancia: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const cochi = ent(tt, 0.2), brillo = cl((tt - 5.6) * 2);
  return <>
    <Estudio t={tt} cam={[0, 1.4, 3.4]} look={[0, 0.55, 0]} orbit={0.14}>
      <group position={[0, lerp(1.4, 0, cochi), 0]} rotation={[0, -0.5 + 0.1 * Math.sin(tt * 0.5), 0]}>
        <mesh position={[0, 0.55, 0]} scale={[0.75, 0.55, 0.55]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshPhysicalMaterial color="#c0643a" roughness={0.35} clearcoat={0.6} /></mesh>
        <mesh position={[0.75, 0.6, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.16, 0.2, 0.14, 24]} /><meshPhysicalMaterial color="#c0643a" roughness={0.35} clearcoat={0.6} /></mesh>
        {[[-0.4, -0.25], [-0.4, 0.25], [0.4, -0.25], [0.4, 0.25]].map(([x, z], i) => <mesh key={i} position={[x, 0.1, z]}><cylinderGeometry args={[0.08, 0.07, 0.2, 12]} /><meshStandardMaterial color="#a8532e" roughness={0.5} /></mesh>)}
        {[-1, 1].map((s) => <mesh key={s} position={[0.55, 0.98, s * 0.2]} rotation={[0, 0, -0.4]}><coneGeometry args={[0.1, 0.22, 4]} /><meshStandardMaterial color="#a8532e" /></mesh>)}
        {[0.08, -0.08].map((z) => <mesh key={z} position={[0.88, 0.6, z]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#5a2a18" /></mesh>)}
        <mesh position={[0, 1.08, 0]}><boxGeometry args={[0.3, 0.02, 0.05]} /><meshStandardMaterial color="#2a120a" /></mesh>
      </group>
      {Array.from({ length: 10 }, (_, i) => { const at = 1.6 + i * 0.38, k = tt - at; if (k < 0) return null; const y = Math.max(1.1, 2.6 - 4.9 * k * k);
        return k < 0.75 ? <mesh key={i} position={[0.02 * Math.sin(i), y, 0]} rotation={[P2 + k * 3, 0, k * 2]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />{M.cromo("#d9b44a")}</mesh> : null; })}
      <pointLight position={[0, 1.6, 0.8]} intensity={0.01 + 3 * brillo} distance={2.2} color="#ffd98a" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 20" title="LA CUENTA CONTRA LA TORTILLERÍA" />
    <Tag tt={tt} at={5.9} x={1380} y={380} txt="$12 EL KILO" col={MZ} size={52} />
  </>;
}}</Stage>;

// ── 21 · EL AZUL PIDE MENOS: montón azul frente al blanco; al azul le toca la cuchara chica y la llama más corta
const H3Voltea: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const az = ent(tt, 0.8), bl = ent(tt, 4.5), menos = eio(tt, 5.8, 6.6);
  const Pila: React.FC<{ x: number; c: string; k: number }> = ({ x, c, k }) => <group position={[x, lerp(1.4, 0, k), 0]}>
    {Array.from({ length: 50 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.45 * (1 - (i % 6) / 8); return <Grano key={i} p={[Math.cos(a) * r, 0.04 + (i % 6) * 0.05, Math.sin(a) * r]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.07} c={c} brillo={0.9} />; })}</group>;
  return <>
    <Estudio t={tt} cam={[0, 1.8, 3.5]} look={[0, 0.35, 0]} orbit={0.12}>
      <Pila x={-0.85} c={COL.azul} k={az} />
      <Pila x={0.85} c={COL.blanco} k={bl} />
      <mesh position={[-0.85, 0.5 + 0.08 * Math.sin(tt * 2), 0.6]} scale={0.55 + 0.45 * (1 - menos)} castShadow><sphereGeometry args={[0.12, 16, 8, 0, 6.29, P2, P2]} />{M.cromo()}</mesh>
      <mesh position={[0.85, 0.5 + 0.08 * Math.sin(tt * 2 + 1), 0.6]} castShadow><sphereGeometry args={[0.12, 16, 8, 0, 6.29, P2, P2]} />{M.cromo()}</mesh>
      <pointLight position={[-0.85, 1.2, 0.9]} intensity={0.01 + 3 * az} distance={2.2} color="#9aa0ff" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 21" title="EL AZUL PIDE MENOS" />
    <Tag tt={tt} at={6.2} x={640} y={900} txt="MENOS CAL, MENOS TIEMPO" col={MZ} size={42} />
  </>;
}}</Stage>;

// ── 22 · EL PASADO: la prensa se abre y la masa chiclosa se estira en hilos pegada a las dos tablas, no se despega
const H3Pizarra: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const abre = eio(tt, 3.6, 6.4), tira = 0.08 + 0.9 * abre;
  return <>
    <Estudio t={tt} cam={[0.6, 1.5, 3.2]} look={[0, 0.45, 0]} orbit={0.1}>
      <RBox p={[0, 0.05, 0]} s={[1.4, 0.1, 1.4]} r={0.03}>{M.madera("#9a6a3c")}</RBox>
      <group position={[0, 0.1, -0.7]} rotation={[-abre * 1.1, 0, 0]}><RBox p={[0, 0.06, 0.7]} s={[1.4, 0.08, 1.4]} r={0.03}>{M.madera("#a87644")}</RBox></group>
      <mesh position={[0, 0.12, 0]} scale={[0.5, 0.02, 0.5]}><cylinderGeometry args={[1, 1, 1, 32]} /><meshStandardMaterial color="#d9c690" roughness={0.6} /></mesh>
      {Array.from({ length: 9 }, (_, i) => { const x = (rn(i, 1) - 0.5) * 0.7, z = (rn(i, 2) - 0.5) * 0.7, top = new THREE.Vector3(x, 0.16 + Math.sin(abre * 1.1) * (z + 0.7) + 0.02, z - (1 - Math.cos(abre * 1.1)) * (z + 0.7));
        const len = Math.max(0.01, top.y - 0.13), w = 0.03 * (1 - 0.6 * abre) * (1 + 0.5 * rn(i, 3));
        return <mesh key={i} position={[x, 0.13 + len / 2, (z + top.z) / 2]} scale={[w, len, w]}><cylinderGeometry args={[1, 1.6, 1, 8]} /><meshPhysicalMaterial color="#e7d29a" roughness={0.3} clearcoat={0.6} /></mesh>; })}
      <mesh position={[0, 0.18, 0.15]} visible={tira > 0.5}><sphereGeometry args={[0.001, 4, 4]} /><meshBasicMaterial /></mesh>
    </Estudio>
    <Head tt={tt} kick="TRUCO 22" title="EL NIXTAMAL PASADO" col={RED} />
    <Tag tt={tt} at={3.0} x={1380} y={330} txt="CHICLOSA" col={RED} size={52} />
  </>;
}}</Stage>;

// ── C · LO QUE NUNCA HACÍA: alacena de cinco puertitas; en cada «nunca» se abre una y adentro aparece la foto con un aro rojo que la tacha
const H3Alacena: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const T = [0.7, 4.5, 6.4, 8.9, 11.0, 16.2], fotos = h.imgs ?? ["fb02", "fb03", "fb13", "fb12", "fb17", "fb09"];
  return <>
    <Estudio t={tt} cam={[0, 1.2, 4.6]} look={[0, 1.15, 0]} orbit={0.06}>
      <RBox p={[0, 1.15, -0.32]} s={[3.5, 2.3, 0.1]} r={0.02}>{M.madera("#5a3218")}</RBox>
      {T.map((a, i) => { const col = i % 3, row = Math.floor(i / 3), x = -1.12 + col * 1.12, y = 1.72 - row * 1.12, ab = eio(tt, a, a + 0.8), tacha = cl(phys(tt, a + 0.9, 7, 0.45));
        return <group key={i} position={[x, y, 0]}>
          <RBox p={[0, 0, -0.2]} s={[1.04, 1.04, 0.3]} r={0.02}>{M.madera("#3e2412")}</RBox>
          <Foto3D src={img(fotos[i % fotos.length])} p={[0, 0, -0.03]} w={0.86} h={0.86} dim={0.15 * tacha} />
          <mesh position={[0, 0, 0.02]} scale={0.3 + 0.7 * tacha} visible={tacha > 0.01}><ringGeometry args={[0.36, 0.42, 40]} /><meshBasicMaterial color="#d23a2a" transparent opacity={tacha} /></mesh>
          <mesh position={[0, 0, 0.021]} rotation={[0, 0, -0.78]} scale={[0.3 + 0.7 * tacha, 1, 1]} visible={tacha > 0.01}><planeGeometry args={[0.8, 0.06]} /><meshBasicMaterial color="#d23a2a" transparent opacity={tacha} /></mesh>
          <group position={[-0.52, 0, 0.04]} rotation={[0, -ab * 1.9, 0]}>
            <RBox p={[0.52, 0, 0]} s={[1.02, 1.02, 0.05]} r={0.02}>{M.madera(i % 2 ? "#8a5a30" : "#7a4e2a")}</RBox>
            <mesh position={[0.92, 0, 0.04]}><sphereGeometry args={[0.04, 12, 8]} />{M.cromo("#c9a64a")}</mesh>
          </group>
        </group>; })}
    </Estudio>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA" col={RED} />
  </>;
}}</Stage>;

// ── 23 · PINZA: macro del cacahuacintle (grano grandote y blanco); la pinza le quita la cabecita y el grano revienta en flor
const H3Pinza: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const llega = eio(tt, 3.0, 4.2), pinza = eio(tt, 4.2, 4.6), saca = eio(tt, 4.6, 5.4), flor = eio(tt, 5.6, 6.8);
  return <>
    <Estudio t={tt} cam={[0, 0.9, 2.1]} look={[0, 0.4, 0]} orbit={0.1} fov={30}>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0]} receiveShadow><circleGeometry args={[1.2, 48]} /><meshStandardMaterial color="#3a2a1c" roughness={0.6} /></mesh>
      <group position={[0, 0.38, 0]} rotation={[0, tt * 0.2, 0]}>
        {flor < 0.02 ? <Grano p={[0, 0, 0]} s={0.3} c="#f6f0e0" brillo={0.3} /> :
          Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * 6.28; return <mesh key={i} position={[Math.cos(a) * 0.12 * flor, 0.05 * flor, Math.sin(a) * 0.12 * flor]} rotation={[Math.sin(a) * 0.6 * flor, 0, -Math.cos(a) * 0.6 * flor]} scale={[0.15, 0.32, 0.15]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#fbf7ec" roughness={0.85} /></mesh>; })}
        <mesh position={[0, -0.3 - saca * 0.0, 0]} visible={saca < 0.05}><coneGeometry args={[0.06, 0.1, 10]} /><meshStandardMaterial color="#c9a46a" /></mesh>
      </group>
      <group position={[lerp(1.2, 0.05, llega) + saca * 0.6, lerp(1.2, 0.12, llega) + saca * 0.5, 0.05]} rotation={[0, 0, 0.6]}>
        {[-1, 1].map((s) => <mesh key={s} position={[0, 0.35, s * (0.05 - 0.035 * pinza)]} rotation={[s * (0.12 - 0.08 * pinza), 0, 0]}><boxGeometry args={[0.03, 0.75, 0.02]} />{M.cromo()}</mesh>)}
        {saca > 0.05 && <mesh position={[0, -0.03, 0]}><coneGeometry args={[0.06, 0.1, 10]} /><meshStandardMaterial color="#c9a46a" /></mesh>}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 23" title="PARA POZOLE: SE DESCABEZA" />
    <Tag tt={tt} at={1.4} x={1380} y={380} txt="CACAHUACINTLE" col={MZ} size={46} />
  </>;
}}</Stage>;

// ── 24 · EL GRANO CERRADO CON LLAVE: el grano tiene un candadito; la cal lo abre y sale la vitamina (motas de luz) y entra el calcio
const H3Mapa: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false} tone="#1a1410">{(tt) => {
  const cal = eio(tt, 1.0, 1.8), abre = eio(tt, 3.7, 4.5), calcio = eio(tt, 5.2, 6.2);
  return <>
    <Estudio t={tt} cam={[0, 1.0, 2.6]} look={[0, 0.65, 0]} orbit={0.12} fov={32}>
      <group position={[0, 0.65, 0]} rotation={[0, 0.25 * Math.sin(tt * 0.4), 0]}>
        <Grano p={[0, 0, 0]} s={0.36} c={COL.nixta} brillo={0.3} glow={0.15 * abre} />
        <group position={[0, -0.05, 0.27]}>
          <mesh position={[0, 0.13 + 0.12 * abre, 0]} rotation={[0, abre * 1.2, 0]}><torusGeometry args={[0.08, 0.02, 10, 24, P]} />{M.cromo("#c9a64a")}</mesh>
          <RBox p={[0, 0, 0]} s={[0.22, 0.2, 0.06]} r={0.02}>{M.cromo("#c9a64a")}</RBox>
        </group>
      </group>
      {Array.from({ length: 18 }, (_, i) => { const k = cl((tt - 4.2 - rn(i, 1) * 0.8) / 2.4), a = rn(i, 2) * 6.28;
        return k > 0 && k < 1 ? <mesh key={i} position={[Math.cos(a) * (0.35 + k * 1.1), 0.65 + (rn(i, 3) - 0.3) * k * 1.2, Math.sin(a) * (0.2 + k * 0.6)]} scale={0.03 * (1 - k * 0.5)}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#ffe08a" transparent opacity={1 - k} toneMapped={false} /></mesh> : null; })}
      {Array.from({ length: 14 }, (_, i) => { const k = cl((tt - 1.0 - i * 0.05) / 0.8) * (1 - calcio * 0.0), y = lerp(2.0, 0.8, k) - calcio * 0.15 * (i % 3);
        return <mesh key={"c" + i} position={[(rn(i, 5) - 0.5) * 0.6 * (1 - calcio * 0.5), y, (rn(i, 6) - 0.5) * 0.3]} scale={0.022 * cl(k * 3) * (1 - calcio * 0.7)}><sphereGeometry args={[1, 6, 6]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>; })}
      <pointLight position={[0, 0.9, 0.8]} intensity={0.01 + 3 * abre} distance={2} color="#ffd98a" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 24" title="POR QUÉ ALIMENTA MÁS" />
    <Tag tt={tt} at={2.2} x={1380} y={360} txt="VITAMINA ENCERRADA" col={MZ} size={42} />
    <Tag tt={tt} at={5.4} x={560} y={860} txt="+ CALCIO" col={TX} size={48} />
  </>;
}}</Stage>;

// ── D · REPASO: un rollo de papel de estraza se desenrolla sobre la mesa y cada truco aparece escrito a mano en su palabra
const REP: [number, string][] = [[0.7, "maíz criollo que suene"], [2.5, "lo que flota se tira"], [4.4, "1 kg · 3 litros · 1 cda rasa"], [8.2, "cal apagada, nunca viva"], [10.4, "la cal, aparte"],
  [12.4, "nada de aluminio"], [13.8, "amarillo = empieza a contar"], [16.4, "la prueba de la uña"], [17.8, "cada maíz su tiempo"], [19.7, "toda la noche tapado"], [21.3, "nejayote al drenaje"],
  [23.2, "se lava sin pelar"], [24.8, "molino: dos pasadas"], [26.7, "bolita sin grietas"], [28.5, "agua tibia"], [29.5, "comal caliente"], [31.5, "grosor de moneda"], [33.5, "chiquihuite y servilleta"],
  [35.5, "1 kilo = 1,8 de masa"], [37.0, "$12 contra $25"], [38.5, "el azul pide menos"], [40.0, "no lo pase"], [41.5, "pozole: se descabeza"], [43.0, "la noche entera"]];
const H3Rollo: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false} cam={0.5}>{(tt) => {
  const ROW = 0.22, last = REP.filter(([a]) => tt >= a).length, scroll = Math.max(0, (last - 7) * ROW);
  return <>
    <Estudio t={tt} cam={[0, 2.3, 2.6]} look={[0, 0, -0.1]} orbit={0.05}>
      <group position={[0, 0, scroll * 0.6]}>
        <mesh rotation={[-P2, 0, 0]} position={[0, 0.01, -REP.length * ROW / 2 + 1.0]} receiveShadow><planeGeometry args={[2.4, REP.length * ROW + 0.6]} /><meshStandardMaterial color="#c9a774" roughness={0.95} /></mesh>
        {REP.map(([a, s], i) => { const k = cl((tt - a) * 2.2); return k > 0.01 ? <mesh key={i} rotation={[-P2, 0, 0]} position={[0, 0.012, 1.0 - 0.1 - i * ROW]} scale={[k, 1, 1]}>
          <planeGeometry args={[2.1, 0.2]} /><meshBasicMaterial map={papel("rep" + i, [`${i + 1}. ${s}`], { w: 1024, h: 98, bg: "#c9a774", ink: "#2a1c12", size: 70 })} transparent toneMapped={false} /></mesh> : null; })}
      </group>
      <mesh position={[0, 0.09, -0.75 + scroll * 0.0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.09, 0.09, 2.45, 24]} /><meshStandardMaterial color="#b9965f" roughness={0.9} /></mesh>
    </Estudio>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LOS 24, EN EL ROLLO" />
  </>;
}}</Stage>;

// ── 25 · LA NOCHE ENTERA: olla en corte; el sol baja, la luna cruza el arco del cielo y los granos se hinchan y se encienden despacio
const H3SolLuna: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false} tone="#10141f">{(tt) => {
  const arc = eio(tt, 0.4, 7.6), hinch = eio(tt, 3.0, 7.0), sol = Math.max(0, 1 - arc * 2.2), noche = cl(arc * 2) * (1 - cl((arc - 0.85) * 6));
  return <>
    <Estudio t={tt} cam={[0, 1.5, 3.8]} look={[0, 0.95, 0]} orbit={0.08}>
      <group position={[0, 0, 0.3]}>
        <mesh geometry={lathe([[0, 0], [0.55, 0], [0.7, 0.4], [0.68, 0.75], [0.62, 0.82]], 48)} castShadow receiveShadow>{M.vidrio()}</mesh>
        <mesh position={[0, 0.37, 0]}><cylinderGeometry args={[0.66, 0.55, 0.72, 40]} />{M.liquido("#e3c05a", 0.6)}</mesh>
        {Array.from({ length: 34 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.5; return <Grano key={i} p={[Math.cos(a) * r, 0.08 + (i % 5) * 0.08, Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.06 + 0.025 * hinch} c={COL.nixta} glow={0.25 * hinch} />; })}
      </group>
      {[[sol, "#ffcf70", 0.34, -0.3], [noche, "#e8eefc", 0.24, 1]].map(([k, c, r, off], i) => { const a = P * (0.15 + 0.7 * cl(arc * 1.2 - (off as number) * 0.25));
        return <mesh key={i} position={[Math.cos(P - a) * 2.0, 0.9 + Math.sin(a) * 1.2, -1.2]} scale={(k as number) > 0.02 ? 1 : 0.001}><sphereGeometry args={[r as number, 32, 16]} /><meshBasicMaterial color={c as string} transparent opacity={k as number} toneMapped={false} /></mesh>; })}
      <pointLight position={[0, 1.6, 0.6]} intensity={0.01 + 2.5 * noche} distance={3} color="#9ab8ff" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 25" title="LA NOCHE ENTERA" />
    <Tag tt={tt} at={6.4} x={1380} y={360} txt="SE HACE EN LA NOCHE" col={MZ} size={46} />
  </>;
}}</Stage>;

export const MAPB2: Record<string, C> = { bolita: H3Bolita, tibia: H3Tibia, infla: H3Infla, calibre: H3Calibre, chiquihuite: H3Chiqui, escalera: H3Escalera, embudo: H3Embudo,
  alcancia: H3Alcancia, voltea: H3Voltea, pizarra: H3Pizarra, alacena: H3Alacena, pinza: H3Pinza, mapa: H3Mapa, rollo: H3Rollo, solluna: H3SolLuna };
export { tortTex, granoGeo, jarroGeo };
