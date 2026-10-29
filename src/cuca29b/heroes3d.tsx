// cuca29b · NIXTAMAL en bodegón 3D (estudio3d + kit3d): los 29 componentes del video, ninguno repite la mecánica de cuca29a.
// Regla de a: el OBJETO cuenta la idea sin leer, cada cosa llega de a una con peso, un rótulo como mucho, nada pasa por el título.
import React from "react";
import * as THREE from "three";
import { cl, eio, H, Head, img, lerp, MZ, phys, RED, Stage, Tag } from "./ckit";
import { ctex, Estudio, fall, lathe, M, papel, RBox, rn, V3, Vapor } from "./estudio3d";
import { Chorro, Foto3D, Llama, Mano, Olla, Plato } from "./kit3d";

type C = React.FC<{ t: number; h: H }>;
const P = Math.PI, P2 = P / 2;
const ent = (tt: number, a: number) => cl(phys(tt, a, 6, 0.5));
const im = (h: H, i: number) => img(h.imgs?.[i] ?? h.bg ?? "");
const AMA = "#e8b93c", BLA = "#efe6cf", AZU = "#3a3f6e", MASA = "#e9d9a6";

// grano de maíz: gota achatada con brillo
const Grano: React.FC<{ p: V3; s?: number; rot?: V3; c?: string }> = ({ p, s = 0.06, rot = [0, 0, 0], c = AMA }) => (
  <mesh position={p} rotation={rot} scale={[s, s * 0.85, s * 0.6]} castShadow><sphereGeometry args={[1, 14, 10]} /><meshPhysicalMaterial color={c} roughness={0.32} clearcoat={0.7} /></mesh>);
const tortTex = () => ctex("tortb", 256, 256, (g) => {
  g.fillStyle = "#ecd9a0"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${110 + rn(i, 3) * 40},${70 + rn(i, 4) * 30},30,${0.25 + rn(i, 5) * 0.4})`; g.beginPath(); g.arc(rn(i, 1) * 256, rn(i, 2) * 256, 3 + rn(i, 6) * 9, 0, 7); g.fill(); }
});
const Tortilla: React.FC<{ p: V3; rot?: V3; r?: number; infla?: number }> = ({ p, rot, r = 0.5, infla = 0 }) => <group position={p} rotation={rot}>
  <mesh castShadow receiveShadow><cylinderGeometry args={[r, r, 0.018, 40]} /><meshStandardMaterial map={tortTex()} roughness={0.85} /></mesh>
  {infla > 0.01 && <mesh position={[0, 0.009, 0]} scale={[r * 0.92, r * 0.55 * infla, r * 0.92]} castShadow><sphereGeometry args={[1, 32, 16, 0, P * 2, 0, P2]} /><meshStandardMaterial map={tortTex()} roughness={0.85} /></mesh>}
</group>;
const Polvo: React.FC<{ t: number; p: V3; n?: number; o?: number; r?: number; h?: number }> = ({ t, p, n = 18, o = 0.5, r = 0.3, h = 0.6 }) => <>
  {Array.from({ length: n }, (_, i) => { const k = (t * 0.35 + i / n) % 1, a = i * 2.4 + t * 0.8; return <sprite key={i} position={[p[0] + Math.cos(a) * r * k, p[1] + k * h, p[2] + Math.sin(a) * r * k]} scale={[0.1 + k * 0.3, 0.1 + k * 0.3, 1]}>
    <spriteMaterial color="#ffffff" transparent opacity={o * (1 - k)} depthWrite={false} /></sprite>; })}</>;

// ── 1 · MAZORCA: la mazorca gira de pie y se desgrana de abajo arriba; cada grano cae con peso a la mesa
const H3Mazorca: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const R = 12, A = 14, spin = tt * 0.9, des = (j: number) => 1.2 + j * 0.035;
  return <>
    <Estudio t={tt} cam={[0, 1.6, 3.6]} look={[0, 0.65, 0]} orbit={0.14}>
      <group position={[0, 0.25 + fall(tt, 0, 0.8), 0]} rotation={[0, spin, 0.08]}>
        <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.13, 0.11, 1.2, 20]} /><meshStandardMaterial color="#d8c08a" roughness={0.8} /></mesh>
        {Array.from({ length: R * A }, (_, j) => { const ring = Math.floor(j / A), a = (j % A) / A * P * 2 + ring * 0.2, y = 0.08 + ring * 0.095;
          return tt >= des(j) ? null : <Grano key={j} p={[Math.cos(a) * 0.16, y, Math.sin(a) * 0.16]} rot={[0, -a, P2]} s={0.05} c={j % 9 ? AMA : "#d9a032"} />; })}
      </group>
      {Array.from({ length: 60 }, (_, i) => { const j = i * 2, at = des(j), a = rn(i, 1) * 6.28, r = 0.35 + rn(i, 2) * 0.7;
        if (tt < at) return null; const k = eio(tt, at, at + 0.45);
        return <Grano key={"c" + i} p={[lerp(0, Math.cos(a) * r, k), 0.03 + fall(tt, at, 0.3 + (j / (R * A)) * 1.1), lerp(0, Math.sin(a) * r, k) + 0.2]} rot={[rn(i, 3) * 3, rn(i, 4) * 6, 0]} s={0.05} />; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 1" title="CRIOLLO, SECO, QUE SUENE" />
  </>;
}}</Stage>;

// ── 2 · CUBETA DE VIDRIO: el maíz cae al agua; los buenos se van al fondo, los huecos suben, flotan y se salen por el borde
const cubetaGeo = lathe([[0, 0], [0.55, 0], [0.58, 0.02], [0.68, 0.95], [0.7, 0.97]], 48);
const H3Cubeta: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => <>
  <Estudio t={tt} cam={[0, 1.5, 3.4]} look={[0, 0.5, 0]} orbit={0.12}>
    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.64, 0.56, 0.78, 48]} />{M.liquido("#bcd8dc", 0.35)}</mesh>
    <mesh geometry={cubetaGeo}>{M.vidrio()}</mesh>
    {Array.from({ length: 40 }, (_, i) => { const at = 0.4 + i * 0.04, hueco = i % 8 === 3, x = (rn(i, 1) - 0.5) * 0.8, z = (rn(i, 2) - 0.5) * 0.8;
      if (tt < at) return null; const ent0 = eio(tt, at, at + 0.35), y0 = lerp(1.5, 0.75, ent0);
      const y = hueco ? lerp(y0, 0.8 + 0.02 * Math.sin(tt * 3 + i), eio(tt, at + 0.4, at + 1.6)) : lerp(y0, 0.05 + rn(i, 3) * 0.08, eio(tt, at + 0.3, at + 1.4));
      const sale = hueco ? eio(tt, 3.6 + rn(i, 4), 4.8 + rn(i, 4)) : 0;
      return <Grano key={i} p={[lerp(x, 0.85 * Math.sign(x || 1), sale), y + sale * 0.25, z]} rot={[rn(i, 5) * 3, rn(i, 6) * 6 + tt * (hueco ? 0.5 : 0), 0]} s={0.06} c={hueco ? "#c9b07a" : AMA} />; })}
  </Estudio>
  <Head tt={tt} kick="TRUCO 2" title="LO QUE FLOTA SE TIRA" />
</>}</Stage>;

// ── 3 · BALANZA de platillos: un montón de maíz contra una cucharada de cal; la cruz se mece y queda pareja
const H3Balanza: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const ang = -0.3 * cl((tt - 0.4) * 1.5) * (1 - cl(phys(tt, 2.0, 4, 0.35)));
  const pan = (s: number): V3 => [s * 0.95 * Math.cos(ang), 1.1 - s * 0.95 * Math.sin(ang) - 0.5, 0];
  return <>
    <Estudio t={tt} cam={[0, 1.5, 3.8]} look={[0, 0.75, 0]} orbit={0.12}>
      <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.04, 0.06, 1.1, 16]} />{M.cromo("#c9a64a")}</mesh>
      <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.3, 0.34, 0.06, 32]} />{M.cromo("#c9a64a")}</mesh>
      <group position={[0, 1.1, 0]} rotation={[0, 0, -ang]}><RBox s={[2.0, 0.05, 0.06]} r={0.02}>{M.cromo("#c9a64a")}</RBox></group>
      {[-1, 1].map((s) => { const p = pan(s); return <group key={s} position={p}>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.006, 0.006, 0.5, 6]} />{M.cromo()}</mesh>
        <mesh castShadow><cylinderGeometry args={[0.36, 0.3, 0.05, 32]} />{M.cromo("#c9a64a")}</mesh>
        {s < 0 ? Array.from({ length: 40 }, (_, i) => { const at = 0.3 + i * 0.02, a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.26;
          return <Grano key={i} p={[Math.cos(a) * r, 0.06 + (i % 4) * 0.035 + fall(tt, at, 1.0), Math.sin(a) * r]} rot={[rn(i, 3), rn(i, 4) * 6, 0]} s={0.05} />; })
          : <group position={[0, 0.05 + fall(tt, 1.5, 1.0), 0]}><mesh scale={[0.14, 0.07, 0.14]} castShadow><sphereGeometry args={[1, 20, 10, 0, P * 2, 0, P2]} /><meshStandardMaterial color="#f6f4ee" roughness={0.95} /></mesh></group>}
      </group>; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 3" title="LA CAL SE MIDE" />
    <Tag tt={tt} at={3.0} x={1300} y={880} txt="1 CUCHARADA POR KILO" col={MZ} size={44} />
  </>;
}}</Stage>;

// ── 4 · DOS BOLSAS DE CAL: llegan las dos; la «viva» se raya con una cruz roja y se va al fondo; la «apagada» avanza a cámara
const H3BolsaCal: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const x = eio(tt, 2.4, 3.0), va = eio(tt, 3.4, 4.4), sale = eio(tt, 3.6, 4.6);
  const Bolsa: React.FC<{ i: number; p: V3; rot: V3 }> = ({ i, p, rot }) => <group position={p} rotation={rot}>
    <RBox p={[0, 0.5, 0]} s={[0.7, 1.0, 0.36]} r={0.05}><meshStandardMaterial color="#d9c9a4" roughness={0.95} /></RBox>
    <mesh position={[0, 1.03, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.72, 0.06, 0.2]} /><meshStandardMaterial color="#c8b48a" roughness={0.95} /></mesh>
    <mesh position={[0, 0.52, 0.185]}><planeGeometry args={[0.56, 0.5]} /><meshStandardMaterial map={papel("bcal" + i, i ? ["CAL", "VIVA"] : ["CAL", "APAGADA"], { size: 120, bg: "#efe6cf" })} roughness={0.9} /></mesh>
    {i === 1 && [-1, 1].map((k) => <mesh key={k} position={[0, 0.52, 0.2]} rotation={[0, 0, k * 0.8]} scale={[Math.max(0.001, x), 1, 1]}><planeGeometry args={[0.78, 0.06]} /><meshBasicMaterial color="#c0392b" /></mesh>)}
  </group>;
  return <>
    <Estudio t={tt} cam={[0, 1.4, 3.6]} look={[0, 0.6, 0]} orbit={0.12}>
      <Bolsa i={0} p={[lerp(-0.6, -0.05, va), fall(tt, 0.2, 0.9), lerp(0, 0.6, va)]} rot={[0, lerp(0.25, 0, va), 0]} />
      <Bolsa i={1} p={[lerp(0.6, 1.5, sale), fall(tt, 0.55, 0.9), lerp(0, -1.2, sale)]} rot={[0, -0.25, 0]} />
      <pointLight position={[-0.1, 1.4, 1.6]} intensity={2.5 * va} distance={3} color="#fff0d0" />
    </Estudio>
    <Head tt={tt} kick="TRUCO 4" title="CUÁL CAL, Y CUÁL JAMÁS" />
  </>;
}}</Stage>;

// ── 5 · VASO: la cal entra al vaso, la cuchara gira, una nube blanca da vueltas y se asienta; el agua de cal va a la olla
const H3VasoCal: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const st = cl((tt - 1.0) * 2) * (1 - cl((tt - 3.6) * 1.5)), asienta = eio(tt, 3.4, 4.6), tilt = eio(tt, 4.8, 5.6);
  return <>
    <Estudio t={tt} cam={[0.2, 1.4, 3.0]} look={[0.2, 0.55, 0]} orbit={0.12}>
      <group position={[-0.35, 0, 0.2]} rotation={[0, 0, -tilt * 1.0]}>
        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.27, 0.24, 0.56, 40]} />{M.liquido("#eef2ee", lerp(0.3, 0.75, st))}</mesh>
        <mesh position={[0, 0.34, 0]}><cylinderGeometry args={[0.3, 0.26, 0.68, 40, 1, true]} />{M.vidrio()}</mesh>
        {Array.from({ length: 26 }, (_, i) => { const a = i * 0.9 + tt * 5 * st, r = 0.05 + (i % 5) * 0.04, y = lerp(0.15 + (i % 7) * 0.06, 0.04 + (i % 3) * 0.01, asienta);
          return <mesh key={i} position={[Math.cos(a) * r * (1 - asienta * 0.3), y, Math.sin(a) * r]}><sphereGeometry args={[0.03 + (i % 3) * 0.01, 8, 6]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} /></mesh>; })}
        <group position={[0.08 * Math.cos(tt * 5) * st, 0.5, 0.08 * Math.sin(tt * 5) * st]} rotation={[0.2, 0, 0.25]}>
          <mesh castShadow><cylinderGeometry args={[0.014, 0.014, 0.75, 8]} />{M.cromo()}</mesh></group>
      </group>
      <Olla p={[0.75, 0, -0.1]} nivel={0.55} caldo="#d9c27a" frijol={0} t={tt} hervor={0.15} s={0.75} />
      {tilt > 0.6 && <Chorro a={[-0.08, 0.62, 0.2]} b={[0.6, 0.45, 0]} r={0.03 * cl((tilt - 0.6) * 3)} c="#f1f1ea" o={0.7} />}
    </Estudio>
    <Head tt={tt} kick="TRUCO 5" title="LA CAL SE DESHACE APARTE" />
  </>;
}}</Stage>;

// ── 6 · OLLA DE ALUMINIO: el nixtamal hierve y una mancha gris sube por la pared; la olla se aparta y entra la de peltre azul, limpia
const potGeo = lathe([[0, 0], [0.6, 0], [0.62, 0.03], [0.62, 0.62], [0.65, 0.64]], 48);
const H3Aluminio: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1e1712" mesa={false}>{(tt) => {
  const mancha = eio(tt, 0.8, 3.0), cambia = eio(tt, 3.4, 4.4);
  return <>
    <Estudio t={tt} cam={[0, 2.3, 2.9]} look={[0, 0.3, 0]} orbit={0.1}>
      <group position={[lerp(0, -2.4, cambia), 0, 0]}>
        <mesh geometry={potGeo} castShadow receiveShadow><meshStandardMaterial color="#b9bcc0" roughness={0.42} metalness={0.9} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.6, 0.6, 0.4, 48]} />{M.liquido("#d9b84a", 0.9)}</mesh>
        <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.615, 0.615, 0.04 + 0.2 * mancha, 48, 1, true]} /><meshStandardMaterial color="#3e3f42" roughness={0.8} transparent opacity={0.85 * mancha} side={THREE.DoubleSide} /></mesh>
        <Vapor t={tt} p={[0, 0.6, 0]} n={8} o={0.2} />
      </group>
      <group position={[lerp(2.4, 0, cambia), 0, 0]}>
        <mesh geometry={potGeo} castShadow receiveShadow><meshPhysicalMaterial color="#2c4a7e" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, 0.64, 0]} rotation={[P2, 0, 0]}><torusGeometry args={[0.64, 0.015, 8, 48]} /><meshStandardMaterial color="#111" roughness={0.4} /></mesh>
        <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.6, 0.6, 0.4, 48]} />{M.liquido("#e3c35a", 0.9)}</mesh>
        {Array.from({ length: 22 }, (_, i) => { const a = rn(i, 1) * 6.28, r = Math.sqrt(rn(i, 2)) * 0.5; return <Grano key={i} p={[Math.cos(a) * r, 0.43, Math.sin(a) * r]} rot={[P2, rn(i, 3) * 6, 0]} s={0.05} />; })}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 6" title="NUNCA EN OLLA DE ALUMINIO" />
  </>;
}}</Stage>;

// ── 7 · MUESTRARIO: un solo grano en primer plano pasa del blanco al amarillo; en el amarillo, el reloj de cocina arranca
const H3Muestrario: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const k = eio(tt, 0.8, 3.2), c = new THREE.Color(BLA).lerp(new THREE.Color(AMA), k), corre = cl(tt - 3.3), ang = -corre * (tt - 3.3) * 1.4;
  return <>
    <Estudio t={tt} cam={[0, 1.0, 2.6]} look={[0.1, 0.45, 0]} orbit={0.1}>
      <group position={[-0.5, 0.45 + 0.03 * Math.sin(tt * 1.5), 0.2]} rotation={[0.2, tt * 0.4, 0.3]}>
        <mesh scale={[0.32, 0.27, 0.19]} castShadow><sphereGeometry args={[1, 40, 24]} /><meshPhysicalMaterial color={c} roughness={0.28} clearcoat={0.8} /></mesh></group>
      <pointLight position={[-0.5, 0.9, 1.0]} intensity={1.5 * k} distance={2} color="#ffd27a" />
      <group position={[0.75, fall(tt, 0.3, 0.8), 0]}>
        <mesh position={[0, 0.3, 0]} rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.18, 40]} /><meshPhysicalMaterial color="#c0392b" roughness={0.3} clearcoat={1} /></mesh>
        <mesh position={[0, 0.3, 0.091]}><circleGeometry args={[0.27, 40]} /><meshStandardMaterial color="#f6f1e4" roughness={0.6} /></mesh>
        <mesh position={[0, 0.3, 0.1]} rotation={[0, 0, ang]}><boxGeometry args={[0.02, 0.24, 0.01]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0.3, 0.095]}><ringGeometry args={[0.0, 0.26, 40, 1, P2, Math.max(0.001, -ang)]} /><meshBasicMaterial color={AMA} transparent opacity={0.6} /></mesh>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />{M.cromo()}</mesh>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 7" title="EN AMARILLO EMPIEZA A CONTAR" />
  </>;
}}</Stage>;

// ── 8 · LA UÑA: grano cocido en macro; el pulgar lo aprieta y la piel transparente se despega y se va girando
const H3Una: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#2a1c10" mesa={false}>{(tt) => {
  const pr = eio(tt, 1.2, 2.2), suelta = eio(tt, 2.4, 3.8);
  return <>
    <Estudio t={tt} cam={[0, 1.0, 2.2]} look={[0, 0.35, 0]} orbit={0.1}>
      <mesh position={[0, 0.3, 0]} scale={[0.38, 0.3 - 0.03 * pr, 0.24]} castShadow><sphereGeometry args={[1, 40, 24]} /><meshPhysicalMaterial color="#f0d070" roughness={0.4} clearcoat={0.5} /></mesh>
      <group position={[lerp(0, 0.6, suelta), 0.3 + suelta * 0.5, lerp(0, 0.3, suelta)]} rotation={[suelta * 1.2, suelta * 2, suelta * 0.6]}>
        <mesh scale={[0.4, 0.32, 0.26]}><sphereGeometry args={[1, 40, 24, 0, P * lerp(2, 1.2, suelta)]} /><meshPhysicalMaterial color="#fff6d8" roughness={0.2} transparent opacity={0.45} side={THREE.DoubleSide} clearcoat={1} /></mesh></group>
      <Mano p={[lerp(-1.4, -0.42, eio(tt, 0.3, 1.2)) + 0.05 * pr, 0.42, 0.1]} rot={[0, P2, -0.2]} pinza={pr} s={1.2} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 8" title="LA PRUEBA DE LA UÑA" />
  </>;
}}</Stage>;

// ── 9 · RELOJ DE PARED: cada maíz se apunta su tajada de tiempo; la tajada crece mientras su grano cae al platito
const H3RelojPared: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" mesa={false}>{(tt) => {
  const S = [{ c: BLA, a: 0.6, w: 1.6 }, { c: AMA, a: 2.0, w: 1.2 }, { c: "#f4efe2", a: 3.4, w: 2.3 }];
  let ini = P2;
  return <>
    <Estudio t={tt} cam={[0, 1.35, 3.4]} look={[0, 0.85, 0]} orbit={0.08}>
      <group position={[-0.4, 1.0, -0.6]}>
        <mesh rotation={[P2, 0, 0]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.08, 64]} />{M.madera("#6a4424")}</mesh>
        <mesh position={[0, 0, 0.041]}><circleGeometry args={[0.56, 64]} /><meshStandardMaterial color="#f6f1e4" roughness={0.7} /></mesh>
        {S.map((s, i) => { const k = eio(tt, s.a, s.a + 0.9), th = s.w * k, a0 = ini; ini += s.w;
          return <mesh key={i} position={[0, 0, 0.045 + i * 0.001]}><ringGeometry args={[0.12, 0.52, 48, 1, a0, Math.max(0.001, th)]} /><meshStandardMaterial color={i === 0 ? "#c9b98a" : i === 1 ? AMA : "#9a8f7a"} roughness={0.6} /></mesh>; })}
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, -tt * 0.9]}><boxGeometry args={[0.025, 0.46, 0.01]} /><meshStandardMaterial color="#222" /></mesh>
      </group>
      {S.map((s, i) => <Plato key={i} p={[0.6 + i * 0.5, 0, 0.5]} s={0.4}>
        {Array.from({ length: 8 }, (_, j) => <Grano key={j} p={[(rn(j, i + 1) - 0.5) * 0.4, 0.06 + fall(tt, s.a + j * 0.05, 0.9), (rn(j, i + 4) - 0.5) * 0.4]} rot={[rn(j, 2), rn(j, 3) * 6, 0]} s={i === 2 ? 0.11 : 0.08} c={s.c} />)}
      </Plato>)}
    </Estudio>
    <Head tt={tt} kick="TRUCO 9" title="CADA MAÍZ SU TIEMPO" />
  </>;
}}</Stage>;

// ── 10 · VENTANA DE NOCHE: la luna cruza el marco de la ventana; la olla tapada respira vapor quieto toda la noche
const H3VentanaLuna: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#0f1322" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 6.0), mx = lerp(-0.9, 0.9, k), my = 1.35 + 0.35 * Math.sin(k * P);
  return <>
    <Estudio t={tt} cam={[0, 1.2, 3.4]} look={[0, 0.85, 0]} orbit={0.06}>
      <mesh position={[0, 1.4, -1.25]}><planeGeometry args={[2.4, 1.3]} /><meshBasicMaterial color="#141c3a" /></mesh>
      {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[(rn(i, 1) - 0.5) * 2.2, 0.85 + rn(i, 2) * 1.1, -1.24]}><circleGeometry args={[0.008 + rn(i, 3) * 0.01, 6]} /><meshBasicMaterial color="#fff" transparent opacity={0.4 + 0.5 * Math.abs(Math.sin(tt * 2 + i))} /></mesh>)}
      <mesh position={[mx, my, -1.2]}><circleGeometry args={[0.16, 40]} /><meshBasicMaterial color="#f3ecd0" /></mesh>
      {[[0, 2.08, 2.5, 0.08], [0, 0.72, 2.5, 0.08], [-1.22, 1.4, 0.08, 1.44], [1.22, 1.4, 0.08, 1.44], [0, 1.4, 0.05, 1.36]].map((b, i) =>
        <RBox key={i} p={[b[0], b[1], -1.18]} s={[b[2], b[3], 0.08]} r={0.01}>{M.madera("#4a2e18")}</RBox>)}
      <pointLight position={[mx, my, -0.6]} intensity={1.4} distance={3.2} color="#a8b8ff" />
      <Olla p={[0, 0, 0.3]} mat="barro" nivel={0.6} caldo="#d9b84a" frijol={0} t={tt} hervor={0} s={0.85} />
      <mesh position={[0, 0.66, 0.3]} castShadow><cylinderGeometry args={[0.55, 0.6, 0.06, 40]} />{M.barro("#7a3f22")}</mesh>
      <Vapor t={tt} p={[0.2, 0.72, 0.3]} n={6} o={0.12} h={0.6} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 10" title="TODA LA NOCHE, TAPADO" />
  </>;
}}</Stage>;

// ── 11 · TIRA DE pH: la tira entra al nejayote y el morado le sube; la maceta de al lado queda lejos del frasco
const H3TiraPh: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const baja = eio(tt, 0.6, 1.4), sube = eio(tt, 1.6, 3.2), sale = eio(tt, 3.4, 4.2);
  return <>
    <Estudio t={tt} cam={[0, 1.3, 3.0]} look={[0, 0.6, 0]} orbit={0.12}>
      <mesh position={[-0.35, 0.3, 0]}><cylinderGeometry args={[0.3, 0.3, 0.56, 40]} />{M.liquido("#d8c36a", 0.75)}</mesh>
      <mesh position={[-0.35, 0.34, 0]}><cylinderGeometry args={[0.33, 0.33, 0.68, 40, 1, true]} />{M.vidrio()}</mesh>
      <group position={[-0.35, lerp(1.3, 0.55, baja) + sale * 0.5, 0.05]} rotation={[0, 0, sale * 0.3]}>
        <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.08, 0.8, 0.008]} /><meshStandardMaterial color="#f2e7a0" roughness={0.9} /></mesh>
        <mesh position={[0, -0.1 + 0.2 * sube, 0.005]} scale={[1, Math.max(0.001, sube), 1]}><boxGeometry args={[0.082, 0.4, 0.008]} /><meshStandardMaterial color="#6a2c8a" roughness={0.8} /></mesh>
      </group>
      <group position={[0.75, 0, -0.1]}>
        <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.24, 0.18, 0.36, 32]} />{M.barro("#a8552e")}</mesh>
        {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[Math.cos(i) * 0.08, 0.5, Math.sin(i) * 0.08]} rotation={[0.5 * Math.cos(i), 0, 0.5 * Math.sin(i)]} castShadow><boxGeometry args={[0.06, 0.32, 0.01]} /><meshStandardMaterial color="#3f8a3a" roughness={0.6} /></mesh>)}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 11" title="EL NEJAYOTE NO VA A LAS PLANTAS" />
  </>;
}}</Stage>;

// ── 12 · GRANO EN CAPAS: el grano se abre en capas (piel, cuerpo, germen); la piel vuelve a medias: se frota, no se pela todo
const H3CapasGrano: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const ab = eio(tt, 0.8, 1.8), vuelve = eio(tt, 3.2, 4.2), piel = lerp(2, 1.1, vuelve);
  return <>
    <Estudio t={tt} cam={[0, 1.1, 2.6]} look={[0, 0.55, 0]} orbit={0.14}>
      <group position={[0, 0.55, 0]} rotation={[0.2, tt * 0.3, 0.2]}>
        <mesh position={[0, 0, 0]} scale={[0.34, 0.28, 0.2]} castShadow><sphereGeometry args={[1, 40, 24]} /><meshPhysicalMaterial color="#f4dc8a" roughness={0.5} /></mesh>
        <mesh position={[0, -0.06 - 0.35 * ab * (1 - vuelve), 0.12 + 0.2 * ab * (1 - vuelve)]} scale={[0.1, 0.13, 0.06]} castShadow><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#c99a3a" roughness={0.5} /></mesh>
        <group position={[0, 0.45 * ab * (1 - vuelve), 0]} rotation={[0, 0, 0.3 * ab]}>
          <mesh scale={[0.37, 0.31, 0.23]}><sphereGeometry args={[1, 40, 24, 0, P * piel]} /><meshPhysicalMaterial color="#e9a92c" roughness={0.2} transparent opacity={0.55} side={THREE.DoubleSide} clearcoat={1} /></mesh></group>
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 12" title="SE FROTA, PERO NO SE PELA TODO" />
  </>;
}}</Stage>;

// ── 13 · MOLINO DE MANO: la manivela da vueltas, el maíz baja por la tolva y la masa sale enroscada al plato, dos pasadas
const tolvaGeo = lathe([[0.08, 0], [0.32, 0.35], [0.34, 0.38]], 32);
const H3Molino: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" mesa={false}>{(tt) => {
  const vuelta = tt * 4 * cl(tt - 0.8), m1 = eio(tt, 1.2, 3.4), m2 = eio(tt, 4.0, 5.8);
  return <>
    <Estudio t={tt} cam={[0.3, 1.6, 3.2]} look={[0.2, 0.7, 0]} orbit={0.12}>
      <group position={[-0.3, 0, 0]}>
        <RBox p={[0, 0.25, 0]} s={[0.5, 0.5, 0.9]} r={0.02}>{M.madera("#5a3a20")}</RBox>
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.18, 0.18, 0.5, 24]} />{M.hierro()}</mesh>
        <mesh geometry={tolvaGeo} position={[0, 0.9, 0]} castShadow><meshStandardMaterial color="#2a2826" roughness={0.45} metalness={0.6} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 16 }, (_, i) => <Grano key={i} p={[Math.cos(i * 2.3) * 0.15, 1.1 + (i % 4) * 0.04 - 0.15 * m1, Math.sin(i * 2.3) * 0.15]} rot={[i, i * 2, 0]} s={0.045} />)}
        <group position={[-0.3, 0.75, 0]} rotation={[vuelta, 0, 0]}>
          <mesh position={[0, 0, 0.2]} castShadow><boxGeometry args={[0.04, 0.04, 0.4]} />{M.hierro()}</mesh>
          <mesh position={[-0.08, 0, 0.4]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.16, 12]} />{M.madera("#7a5232")}</mesh></group>
      </group>
      {[m1, m2].map((m, k) => Array.from({ length: 14 }, (_, i) => { const u = i / 14; if (u > m) return null; const a = u * 7;
        return <mesh key={k + "-" + i} position={[0.35 + Math.cos(a) * 0.16 * (1 - u * 0.5) + k * 0.5, 0.06 + u * 0.08, 0.3 + Math.sin(a) * 0.16 * (1 - u * 0.5)]} castShadow><sphereGeometry args={[0.07 - k * 0.012, 12, 8]} /><meshStandardMaterial color={k ? "#f1e3b4" : MASA} roughness={0.9} /></mesh>; }))}
      <Plato p={[0.6, 0, 0.3]} s={0.7} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 13" title="MOLINO DE MANO: DOS PASADAS" />
  </>;
}}</Stage>;

// ── 14 · BOLITA: dos bolitas se aplastan bajo la prensa; la seca se raja en el borde, la de punto queda lisa
const H3Bolita: C = ({ t, h }) => <Stage t={t} h={h} mode="split" mesa={false}>{(tt) => {
  const pr = eio(tt, 1.2, 2.2), sube = eio(tt, 2.6, 3.2), aplast = pr;
  return <>
    <Estudio t={tt} cam={[0, 1.6, 3.0]} look={[0, 0.3, 0]} orbit={0.12}>
      {[-1, 1].map((s) => <group key={s} position={[s * 0.7, 0, 0]}>
        <RBox p={[0, 0.03, 0]} s={[0.9, 0.06, 0.9]} r={0.02}>{M.madera("#8a6a44")}</RBox>
        <mesh position={[0, 0.08 + 0.18 * (1 - aplast), 0]} scale={[0.18 + 0.2 * aplast, 0.18 - 0.15 * aplast, 0.18 + 0.2 * aplast]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color={s < 0 ? "#e6d39a" : MASA} roughness={0.9} /></mesh>
        {s < 0 && aplast > 0.6 && Array.from({ length: 9 }, (_, i) => { const a = i / 9 * P * 2 + 0.3; return <mesh key={i} position={[Math.cos(a) * 0.32, 0.1, Math.sin(a) * 0.32]} rotation={[0, -a, 0]} scale={[cl((aplast - 0.6) * 3), 1, 1]}><boxGeometry args={[0.12, 0.03, 0.012]} /><meshStandardMaterial color="#6a5530" /></mesh>; })}
        <RBox p={[0, lerp(0.95, 0.12, pr) + sube * 0.7, 0]} s={[0.9, 0.06, 0.9]} r={0.02}>{M.madera("#8a6a44")}</RBox>
      </group>)}
    </Estudio>
    <Head tt={tt} kick="TRUCO 14" title="LA BOLITA QUE NO SE AGRIETA" />
  </>;
}}</Stage>;

// ── 15 · AGUA TIBIA: la jarra echa un hilo de agua con vapor finito sobre la masa; la mano la amasa y la masa se vuelve tersa
const H3Tibia: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const tilt = eio(tt, 0.6, 1.4) * (1 - eio(tt, 3.0, 3.6)), amasa = cl(tt - 3.4), terso = eio(tt, 3.6, 5.6);
  return <>
    <Estudio t={tt} cam={[0, 1.5, 2.9]} look={[0, 0.45, 0]} orbit={0.12}>
      <group position={[-0.7, 0.25, 0]} rotation={[0, 0, -tilt * 0.9]}>
        <mesh geometry={lathe([[0, 0], [0.2, 0], [0.26, 0.25], [0.16, 0.5], [0.18, 0.55]], 32)} castShadow>{M.barro("#9a4f2c")}</mesh></group>
      {tilt > 0.5 && <Chorro a={[-0.45, 0.72, 0]} b={[0.05, 0.25, 0]} r={0.02} c="#cfe6ee" o={0.5} />}
      <Vapor t={tt} p={[-0.6, 0.8, 0]} n={6} o={0.18 * tilt} h={0.5} />
      <mesh position={[0.15, 0.08, 0]} castShadow><cylinderGeometry args={[0.55, 0.42, 0.16, 40]} />{M.barro("#b0683c")}</mesh>
      <mesh position={[0.15, 0.2, 0]} scale={[0.3 + 0.03 * Math.sin(tt * 5) * amasa, 0.12 - 0.02 * Math.abs(Math.sin(tt * 5)) * amasa, 0.3]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshPhysicalMaterial color={MASA} roughness={lerp(0.95, 0.5, terso)} clearcoat={0.3 * terso} /></mesh>
      <Mano p={[0.15 + 0.05 * Math.sin(tt * 5), lerp(1.4, 0.42, eio(tt, 3.0, 3.6)) - 0.04 * Math.abs(Math.sin(tt * 5)) * amasa, 0.15]} rot={[-1.1, 0, 0]} s={1.1} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 15" title="EL AGUA DE LA MASA, TIBIA" />
  </>;
}}</Stage>;

// ── 16 · COMAL: la tortilla da tres vueltas en el comal sobre el fuego; a la tercera se infla como globo
const H3Infla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#2a150a" mesa={false}>{(tt) => {
  const v = [1.2, 2.4, 3.6].reduce((a, x) => a + eio(tt, x, x + 0.45), 0), y = 0.42 + 0.35 * [1.2, 2.4, 3.6].reduce((a, x) => a + Math.sin(P * cl((tt - x) / 0.45)), 0);
  const infla = cl(phys(tt, 4.2, 5, 0.4));
  return <>
    <Estudio t={tt} cam={[0, 1.7, 2.8]} look={[0, 0.4, 0]} orbit={0.12}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow><cylinderGeometry args={[0.8, 0.8, 0.03, 48]} /><meshStandardMaterial color="#26221f" roughness={0.6} metalness={0.4} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} position={[Math.cos(i * 2.1) * 0.6, 0.18, Math.sin(i * 2.1) * 0.6]} castShadow><boxGeometry args={[0.16, 0.36, 0.16]} />{M.barro("#7a3f22")}</mesh>)}
      <Llama p={[0, 0.04, 0]} f={0.9} t={tt} r={0.4} />
      <Tortilla p={[0, y, 0]} rot={[v * P, 0, 0]} r={0.46} infla={infla} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 16" title="COMAL CALIENTE Y TRES VUELTAS" />
  </>;
}}</Stage>;

// ── 17 · CALIBRE: el calibre de taller cierra la boca sobre el borde de la tortilla y, al lado, sobre una moneda: mismo grosor
const Calibre: React.FC<{ p: V3; k: number }> = ({ p, k }) => <group position={p}>
  <RBox p={[0, 0, 0]} s={[1.3, 0.1, 0.03]} r={0.01}>{M.cromo()}</RBox>
  <RBox p={[-0.6, -0.17, 0]} s={[0.07, 0.28, 0.03]} r={0.01}>{M.cromo()}</RBox>
  <group position={[lerp(0.4, -0.52, k), 0, 0.03]}><RBox p={[0, 0, 0]} s={[0.22, 0.14, 0.04]} r={0.01}>{M.cromo("#b8bbc0")}</RBox><RBox p={[-0.02, -0.17, 0]} s={[0.07, 0.28, 0.03]} r={0.01}>{M.cromo("#b8bbc0")}</RBox></group>
</group>;
const H3Calibre: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const k1 = eio(tt, 1.0, 2.0), mv = eio(tt, 2.6, 3.4), k2 = eio(tt, 3.6, 4.4);
  return <>
    <Estudio t={tt} cam={[0, 0.9, 2.4]} look={[0.2, 0.3, 0]} orbit={0.08}>
      <Tortilla p={[-0.55, 0.05, 0]} r={0.5} />
      <mesh position={[0.75, 0.055, 0.1]} castShadow><cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />{M.cromo("#c9a64a")}</mesh>
      <Calibre p={[lerp(-0.03, 1.29, mv), 0.48, 0.05]} k={k1 * (1 - eio(tt, 2.2, 2.6)) + k2} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 17" title="EL GROSOR DE UNA MONEDA" />
  </>;
}}</Stage>;

// ── 18 · CHIQUIHUITE: entra la servilleta, caen las tortillas una sobre otra, la servilleta se dobla encima y el vapor queda adentro
const H3Chiquihuite: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" mesa={false}>{(tt) => {
  const dobla = eio(tt, 3.6, 4.6);
  const servTex = () => ctex("serv", 256, 256, (g) => { g.fillStyle = "#f4efe4"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#c0392b"; for (let i = 0; i < 8; i++) { g.fillRect(i * 32, 0, 10, 256); g.fillRect(0, i * 32, 256, 10); } });
  return <>
    <Estudio t={tt} cam={[0, 2.0, 2.8]} look={[0, 0.3, 0]} orbit={0.14}>
      <mesh geometry={lathe([[0, 0], [0.5, 0], [0.62, 0.3], [0.64, 0.32]], 40)} castShadow receiveShadow><meshStandardMaterial color="#b98a4a" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.06 + fall(tt, 0.2, 0.8), 0]} rotation={[-P2, 0, 0.3]}><planeGeometry args={[1.3, 1.3]} /><meshStandardMaterial map={servTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <Tortilla key={i} p={[0.02 * Math.sin(i), 0.08 + i * 0.022 + fall(tt, 1.0 + i * 0.35, 1.0), 0]} rot={[0, i, 0]} r={0.46} />)}
      <group position={[0, 0.32, -0.6]} rotation={[lerp(0, -P * 0.95, dobla), 0, 0]}><mesh position={[0, 0, 0.6]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.3, 1.2]} /><meshStandardMaterial map={servTex()} roughness={0.9} side={THREE.DoubleSide} /></mesh></group>
      <Vapor t={tt} p={[0, 0.3, 0]} n={10} o={0.25 * (1 - dobla)} h={0.8} />
    </Estudio>
    <Head tt={tt} kick="TRUCO 18" title="CHIQUIHUITE Y SERVILLETA" />
  </>;
}}</Stage>;

// ── 19 · EMBUDO: el maíz entra al embudo, la masa sale y crece en bola; la bola se vuelve una pila de tortillas
const H3Embudo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const bola = eio(tt, 1.4, 3.2), pila = eio(tt, 3.6, 5.4), n = Math.floor(pila * 12);
  return <>
    <Estudio t={tt} cam={[0, 1.5, 3.3]} look={[0, 0.75, 0]} orbit={0.12}>
      <group position={[-0.45, 0, 0]}>
        <mesh geometry={lathe([[0.04, 0.9], [0.06, 1.1], [0.42, 1.5], [0.44, 1.52]], 32)} castShadow><meshStandardMaterial color="#d8dade" roughness={0.2} metalness={1} side={THREE.DoubleSide} /></mesh>
        {Array.from({ length: 24 }, (_, i) => { const at = 0.3 + i * 0.06; if (tt < at) return null; const k = cl((tt - at) / 0.8); if (k >= 1) return null;
          return <Grano key={i} p={[Math.cos(i * 2.4) * 0.25 * (1 - k), lerp(1.9, 1.0, k), Math.sin(i * 2.4) * 0.25 * (1 - k)]} rot={[i, i, 0]} s={0.05} />; })}
        <mesh position={[0, 0.02 + 0.3 * bola * (1 - pila), 0]} scale={Math.max(0.001, 0.32 * bola * (1 - pila * 0.9))} castShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color={MASA} roughness={0.9} /></mesh>
        {bola > 0.02 && bola < 0.99 && <Chorro a={[0, 0.9, 0]} b={[0, 0.3 + 0.2 * bola, 0]} r={0.035} c={MASA} o={1} />}
      </group>
      {Array.from({ length: n }, (_, i) => <Tortilla key={i} p={[0.6, 0.02 + i * 0.022, 0]} rot={[0, i * 0.7, 0]} r={0.42} />)}
    </Estudio>
    <Head tt={tt} kick="TRUCO 19" title="CUÁNTO RINDE UN KILO" />
    <Tag tt={tt} at={4.8} x={1260} y={900} txt="1 KG DE MAÍZ = 1,8 KG DE MASA" col={MZ} size={42} />
  </>;
}}</Stage>;

// ── 20 · COCHINITO DE BARRO: caen monedas por la ranura una tras otra; el cochinito brinca con cada una y se pone pesado
const H3Alcancia: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const caen = Array.from({ length: 9 }, (_, i) => 1.0 + i * 0.45), salto = caen.reduce((a, c) => a + Math.max(0, Math.sin(P * cl((tt - c - 0.35) / 0.25))) * 0.04, 0);
  return <>
    <Estudio t={tt} cam={[0, 1.2, 2.9]} look={[0, 0.5, 0]} orbit={0.14}>
      <group position={[0, salto + fall(tt, 0, 0.7), 0]} rotation={[0, -0.5, 0]}>
        <mesh position={[0, 0.42, 0]} scale={[0.5, 0.36, 0.36]} castShadow><sphereGeometry args={[1, 40, 24]} />{M.barro("#c06a3c")}</mesh>
        <mesh position={[0.5, 0.42, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.12, 0.13, 0.1, 24]} />{M.barro("#b05e34")}</mesh>
        {[[0.32, 0.72, 0.15], [0.32, 0.72, -0.15]].map((e, i) => <mesh key={i} position={e as V3} rotation={[0, 0, -0.4]} castShadow><coneGeometry args={[0.07, 0.14, 12]} />{M.barro("#b05e34")}</mesh>)}
        {[[0.28, 0.1, 0.18], [0.28, 0.1, -0.18], [-0.28, 0.1, 0.18], [-0.28, 0.1, -0.18]].map((e, i) => <mesh key={i} position={e as V3} castShadow><cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />{M.barro("#b05e34")}</mesh>)}
        <mesh position={[0, 0.78, 0]}><boxGeometry args={[0.18, 0.01, 0.03]} /><meshStandardMaterial color="#2a1408" /></mesh>
        {[0.38, -0.05].map((z, i) => <mesh key={i} position={[0.5, 0.42, z * 0.15]}><circleGeometry args={[0.015, 8]} /><meshStandardMaterial color="#2a1408" /></mesh>)}
      </group>
      {caen.map((c, i) => { const k = cl((tt - c) / 0.4); if (tt < c - 0.6 || k >= 1) return null;
        return <mesh key={i} position={[-0.05 * Math.sin(i), lerp(1.6, 0.8, k * k), 0]} rotation={[P2, 0, tt * 3 + i]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.015, 24]} />{M.cromo("#d4a93a")}</mesh>; })}
    </Estudio>
    <Head tt={tt} kick="TRUCO 20" title="LA CUENTA CONTRA LA TORTILLERÍA" />
  </>;
}}</Stage>;

// ── 21 · DOS CUCHARAS DE CAL: el montón blanco recibe la cuchara grande; el azul, la chica; cada olla con su llama
const H3Voltea: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#141a2a" mesa={false}>{(tt) => {
  const c1 = eio(tt, 1.6, 2.4), c2 = eio(tt, 2.8, 3.6);
  const Cuch: React.FC<{ p: V3; s: number; k: number }> = ({ p, s, k }) => <group position={[p[0], p[1] + lerp(0.8, 0, k), p[2]]} rotation={[0, 0, lerp(0, -1.2, eio(k, 0.7, 1))]} scale={s}>
    <mesh castShadow scale={[1, 0.4, 1]}><sphereGeometry args={[0.16, 20, 12, 0, P * 2, P2, P2]} />{M.cromo()}</mesh>
    <mesh position={[0.38, 0.02, 0]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />{M.cromo()}</mesh>
    <mesh position={[0, 0.0, 0]} scale={[0.13, 0.05, 0.13]}><sphereGeometry args={[1, 16, 8, 0, P * 2, 0, P2]} /><meshStandardMaterial color="#fafaf6" roughness={1} /></mesh>
  </group>;
  return <>
    <Estudio t={tt} cam={[0, 1.6, 3.4]} look={[0, 0.4, 0]} orbit={0.12}>
      {[[-0.8, BLA, 1.0, c1], [0.8, AZU, 0.6, c2]].map(([x, c, s, k], j) => <group key={j}>
        <Plato p={[x as number, 0, 0.2]} s={0.75}>
          {Array.from({ length: 36 }, (_, i) => { const a = rn(i, j + 1) * 6.28, r = Math.sqrt(rn(i, j + 3)) * 0.32; return <Grano key={i} p={[Math.cos(a) * r, 0.05 + (i % 3) * 0.04 + fall(tt, 0.2 + j * 0.4 + i * 0.01, 0.8), Math.sin(a) * r]} rot={[rn(i, 5), rn(i, 6) * 6, 0]} s={0.055} c={c as string} />; })}
        </Plato>
        <Cuch p={[(x as number) - 0.05, 0.35, 0.25]} s={(s as number) * 1.4} k={k as number} />
      </group>)}
    </Estudio>
    <Head tt={tt} kick="TRUCO 21" title="EL AZUL PIDE MENOS" />
  </>;
}}</Stage>;

// ── 22 · PIZARRA: la tiza dibuja la curva de la masa: mejora, toca el punto justo (se enciende) y se pasa: cae en rojo
const curva = (u: number): [number, number] => [lerp(-0.9, 0.9, u), 0.2 + 0.75 * Math.sin(Math.min(u, 0.55) / 0.55 * P2) - (u > 0.55 ? 1.6 * (u - 0.55) * (u - 0.55) * 4 : 0)];
const H3Pizarra: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14201a" mesa={false}>{(tt) => {
  const dib = eio(tt, 0.8, 4.4), N = 48, pico = cl((dib - 0.55) * 8);
  const [tx, ty] = curva(dib);
  return <>
    <Estudio t={tt} cam={[0, 1.1, 3.0]} look={[0, 0.95, 0]} orbit={0.06}>
      <RBox p={[0, 1.0, -0.4]} s={[2.4, 1.45, 0.06]} r={0.02}><meshStandardMaterial color="#20342a" roughness={0.95} /></RBox>
      <RBox p={[0, 1.0, -0.43]} s={[2.55, 1.6, 0.04]} r={0.02}>{M.madera("#6a4424")}</RBox>
      {Array.from({ length: N }, (_, i) => { const u0 = i / N, u1 = (i + 1) / N; if (u1 > dib) return null; const [x0, y0] = curva(u0), [x1, y1] = curva(u1), L = Math.hypot(x1 - x0, y1 - y0);
        return <mesh key={i} position={[(x0 + x1) / 2, 0.45 + (y0 + y1) / 2, -0.36]} rotation={[0, 0, Math.atan2(y1 - y0, x1 - x0)]}><boxGeometry args={[L + 0.01, 0.028, 0.005]} /><meshStandardMaterial color={u0 > 0.6 ? "#e0584a" : "#efeee6"} roughness={1} /></mesh>; })}
      <mesh position={[curva(0.55)[0], 0.45 + curva(0.55)[1], -0.355]}><circleGeometry args={[0.05 * pico, 24]} /><meshStandardMaterial color={MZ} emissive={MZ} emissiveIntensity={1.4 * pico} /></mesh>
      <group position={[tx + 0.04, 0.45 + ty + 0.04, -0.3]} rotation={[0, 0, -0.6]}><mesh castShadow><cylinderGeometry args={[0.025, 0.025, 0.16, 10]} /><meshStandardMaterial color="#f6f4ee" roughness={1} /></mesh></group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 22" title="EL NIXTAMAL PASADO" col={RED} />
  </>;
}}</Stage>;

// ── 23 · PINZA: grano de cacahuacintle en macro; la pinza le arranca la cabecita y el grano revienta en flor
const H3Pinza: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" mesa={false}>{(tt) => {
  const ll = eio(tt, 0.6, 1.4), cierra = eio(tt, 1.5, 1.8), tira = eio(tt, 1.9, 2.8), flor = cl(phys(tt, 3.0, 5, 0.45));
  return <>
    <Estudio t={tt} cam={[0, 1.0, 2.2]} look={[0, 0.4, 0]} orbit={0.12}>
      <mesh position={[0, 0.35, 0]} scale={[0.32 * (1 + 0.2 * flor), 0.36 * (1 - 0.15 * flor), 0.26 * (1 + 0.2 * flor)]} castShadow><sphereGeometry args={[1, 40, 24]} /><meshPhysicalMaterial color="#f7f1e0" roughness={0.6} /></mesh>
      {Array.from({ length: 8 }, (_, i) => { const a = i / 8 * P * 2; return <mesh key={i} position={[Math.cos(a) * 0.22 * flor, 0.6 + 0.1 * flor, Math.sin(a) * 0.22 * flor]} scale={Math.max(0.001, 0.13 * flor)} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#fbf8ee" roughness={0.9} /></mesh>; })}
      <group position={[tira * 0.6, 0.72 + tira * 0.55, tira * 0.2]}>
        <mesh scale={[0.09, 0.05, 0.08]} castShadow><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#d8b880" roughness={0.6} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * lerp(0.08, 0.035, cierra), lerp(1.0, 0.32, ll), 0]} rotation={[0, 0, -s * 0.06]} castShadow><boxGeometry args={[0.02, 0.62, 0.05]} />{M.cromo()}</mesh>)}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 23" title="PARA POZOLE: SE DESCABEZA" />
  </>;
}}</Stage>;

// ── 24 · AMATE: sobre el papel de amate se dibuja la ruta del maíz de pueblo en pueblo y al final brota una mazorca
const amateTex = () => ctex("amate", 512, 512, (g) => { g.fillStyle = "#7a5634"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(40,24,10,.35)"; g.lineWidth = 3;
  for (let i = 0; i < 60; i++) { g.beginPath(); g.moveTo(rn(i, 1) * 512, 0); g.bezierCurveTo(rn(i, 2) * 512, 170, rn(i, 3) * 512, 340, rn(i, 4) * 512, 512); g.stroke(); } });
const RUTA: [number, number][] = [[-0.9, 0.35], [-0.5, 0.1], [-0.2, 0.3], [0.15, -0.05], [0.45, 0.2], [0.8, -0.1]];
const H3Mapa: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#24180c" mesa={false}>{(tt) => {
  const dib = eio(tt, 0.8, 4.0) * (RUTA.length - 1), brota = cl(phys(tt, 4.2, 5, 0.45));
  return <>
    <Estudio t={tt} cam={[0, 2.2, 2.4]} look={[0, 0.1, 0]} orbit={0.1}>
      <mesh position={[0, 0.02, 0]} rotation={[-P2, 0, 0.04]} receiveShadow><planeGeometry args={[2.3, 1.4]} /><meshStandardMaterial map={amateTex()} roughness={0.95} /></mesh>
      {RUTA.slice(0, -1).map((a, i) => { const b = RUTA[i + 1], k = cl(dib - i); if (k <= 0) return null; const x1 = lerp(a[0], b[0], k), z1 = lerp(a[1], b[1], k), L = Math.hypot(x1 - a[0], z1 - a[1]);
        return <mesh key={i} position={[(a[0] + x1) / 2, 0.03, (a[1] + z1) / 2]} rotation={[0, -Math.atan2(z1 - a[1], x1 - a[0]), 0]}><boxGeometry args={[L, 0.01, 0.025]} /><meshStandardMaterial color="#f0e2b8" roughness={0.8} /></mesh>; })}
      {RUTA.map((a, i) => <mesh key={i} position={[a[0], 0.04, a[1]]} scale={cl(dib - i + 1) > 0 && dib >= i ? 1 : 0.001}><cylinderGeometry args={[0.04, 0.04, 0.02, 16]} /><meshStandardMaterial color={MZ} emissive={MZ} emissiveIntensity={0.4} /></mesh>)}
      <group position={[0.8, 0.04, -0.1]} scale={Math.max(0.001, brota)}>
        <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.07, 0.06, 0.45, 16]} /><meshPhysicalMaterial color={AMA} roughness={0.4} clearcoat={0.6} /></mesh>
        {[-1, 1].map((s) => <mesh key={s} position={[s * 0.06, 0.2, 0]} rotation={[0, 0, s * 0.35]} castShadow><boxGeometry args={[0.04, 0.4, 0.1]} /><meshStandardMaterial color="#6a9a3a" roughness={0.7} /></mesh>)}
      </group>
    </Estudio>
    <Head tt={tt} kick="TRUCO 24" title="POR QUÉ ALIMENTA MÁS" />
    <Tag tt={tt} at={4.6} x={1280} y={860} txt="3.500 AÑOS" col={MZ} size={50} />
  </>;
}}</Stage>;

// ── 25 · RELOJ DE SOL: la sombra de la olla gira alrededor de ella como un reloj de sol: tarde, noche, madrugada; al alba, la masa
const H3SolLuna: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1420" mesa={false}>{(tt) => {
  const k = eio(tt, 0.4, 5.0), a = lerp(-0.4, P * 2 - 0.4, k), noche = Math.max(0, Math.sin(k * P)), masa = cl(phys(tt, 5.2, 5, 0.45));
  return <>
    <Estudio t={tt} cam={[0, 2.4, 2.8]} look={[0, 0.2, 0]} orbit={0.06}>
      <Olla p={[0, 0, 0]} mat="barro" nivel={0.6} caldo="#d9b84a" frijol={0} t={tt} hervor={0} s={0.7} />
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.47, 0.5, 0.05, 40]} />{M.barro("#7a3f22")}</mesh>
      <group rotation={[0, a, 0]}><mesh position={[0.95, 0.012, 0]} rotation={[-P2, 0, 0]}><planeGeometry args={[1.1, 0.7]} /><meshBasicMaterial color="#000" transparent opacity={0.35} depthWrite={false} /></mesh></group>
      <pointLight position={[Math.cos(a + P) * 2.2, 1.6, -Math.sin(a + P) * 2.2]} intensity={1.6} distance={5} color={new THREE.Color("#ffcf8a").lerp(new THREE.Color("#7f8fff"), noche)} />
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[Math.cos(i / 12 * P * 2) * 1.35, 0.03, Math.sin(i / 12 * P * 2) * 1.35]}><cylinderGeometry args={[0.025, 0.025, 0.02, 10]} /><meshStandardMaterial color="#f0e2b8" /></mesh>)}
      <mesh position={[0.75, 0.12, 0.55]} scale={Math.max(0.001, masa) * 0.18} castShadow><sphereGeometry args={[1, 28, 18]} /><meshStandardMaterial color={MASA} roughness={0.9} /></mesh>
    </Estudio>
    <Head tt={tt} kick="TRUCO 25" title="LA NOCHE ENTERA" />
  </>;
}}</Stage>;

// ── A · ERRORES: pila de tortillas rotas; cada una sale volando al nombrarse y deja ver la foto del error debajo
const H3ErroresTort: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#2a0f0a" mesa={false}>{(tt) => {
  const E = (h.items ?? []) as { a: number; tx: string }[], cur = E.reduce((c, e, i) => (tt >= e.a - h.at ? i : c), -1);
  return <>
    <Estudio t={tt} cam={[0, 2.3, 2.6]} look={[0, 0.2, 0]} orbit={0.08}>
      {E.map((e, i) => i === cur ? <Foto3D key={"f" + i} src={im(h, i)} p={[0, 0.03, 0]} rot={[-P2, 0, 0]} w={1.9} h={1.2}>
        <mesh position={[0, -0.72, 0.01]}><planeGeometry args={[1.7, 0.3]} /><meshStandardMaterial map={papel("errb" + i, [`${i + 1}. ${e.tx}`], { w: 1024, h: 180, size: 96 })} roughness={0.9} /></mesh></Foto3D> : null)}
      {E.map((e, i) => { const ea = e.a - h.at, vuela = eio(tt, ea, ea + 0.7), lvl = E.length - 1 - i;
        if (vuela >= 1) return null;
        return <group key={i} position={[lerp(0, (i % 2 ? 1 : -1) * 2.2, vuela), 0.06 + lvl * 0.03 + vuela * 1.2, lerp(0, -0.8, vuela)]} rotation={[vuela * 2, i, vuela * 1.5]}>
          <Tortilla p={[0, 0, 0]} r={0.62} />
          {[0, 1, 2].map((c) => <mesh key={c} position={[0.1 * c - 0.1, 0.012, 0.05 * c]} rotation={[0, c * 0.9 + i, 0]}><boxGeometry args={[0.9, 0.003, 0.012]} /><meshStandardMaterial color="#5a3a1a" /></mesh>)}
        </group>; })}
    </Estudio>
    <Head tt={tt} kick="LOS 5 ERRORES" title="LA TORTILLA QUEBRADIZA" col={RED} />
  </>;
}}</Stage>;

// ── B · ESCALERA: escalones de madera que suben uno por paso, cada uno con su foto de pie; la cámara sube con ellos
const H3Escalera: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (tt >= e.a - h.at ? i : c), 0), cf = lerp(Math.max(0, cur - 1), cur, eio(tt, (S[cur]?.a ?? h.at) - h.at, (S[cur]?.a ?? h.at) - h.at + 0.9));
  return <>
    <Estudio t={tt} cam={[2.4 + cf * 0.7, 1.4 + cf * 0.36, 3.2]} look={[cf * 0.7, 0.5 + cf * 0.36, 0]} orbit={0.05}>
      {S.map((s, i) => { const k = ent(tt, s.a - h.at); if (k <= 0.001) return null;
        return <group key={i} position={[i * 0.7, lerp(-0.6, 0, k) + i * 0.36, 0]}>
          <RBox p={[0, 0, 0]} s={[0.7, 0.36, 1.0]} r={0.02}>{M.madera(i % 2 ? "#8a6034" : "#7a5230")}</RBox>
          <Foto3D src={im(h, i)} p={[0, 0.62, 0]} rot={[0, -0.35, 0]} w={0.95} h={0.68} dim={i === cur ? 0 : 0.4}>
            <mesh position={[0, -0.45, 0.01]}><planeGeometry args={[0.95, 0.18]} /><meshStandardMaterial map={papel("escb" + i, [`${i + 1}. ${s.tx}`], { w: 1024, h: 190, size: 92 })} roughness={0.9} /></mesh></Foto3D>
        </group>; })}
    </Estudio>
    <Head tt={tt} kick="LA RUTINA COMPLETA" title="EN CINCO PASOS" />
  </>;
}}</Stage>;

// ── C · ALACENA: las puertitas de la alacena se abren de a una; adentro la foto y un candado rojo que se cierra
const Candado: React.FC<{ p: V3; k: number }> = ({ p, k }) => <group position={p} scale={Math.max(0.001, k)}>
  <RBox p={[0, 0, 0]} s={[0.16, 0.13, 0.05]} r={0.015}><meshPhysicalMaterial color="#b8281c" roughness={0.3} clearcoat={1} /></RBox>
  <mesh position={[0, 0.07 + 0.03 * (1 - k), 0]}><torusGeometry args={[0.05, 0.012, 8, 20, P]} />{M.cromo()}</mesh></group>;
const H3Alacena: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#24140c" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], n = Math.max(1, S.length), w = Math.min(0.75, 3.4 / n), x0 = -(n - 1) * w / 2;
  return <>
    <Estudio t={tt} cam={[0, 1.15, 3.6]} look={[0, 0.9, 0]} orbit={0.06}>
      <RBox p={[0, 0.95, -0.25]} s={[n * w + 0.2, 1.3, 0.4]} r={0.02}>{M.madera("#3e2412")}</RBox>
      {S.map((s, i) => { const o = eio(tt, s.a - h.at, s.a - h.at + 0.9), x = x0 + i * w;
        return <group key={i}>
          <Foto3D src={im(h, i)} p={[x, 1.02, -0.04]} w={w - 0.1} h={0.82} />
          <mesh position={[x, 0.48, -0.04]}><planeGeometry args={[w - 0.1, 0.2]} /><meshStandardMaterial map={papel("alab" + i, [s.tx], { w: 768, h: 200, size: 80 })} roughness={0.9} /></mesh>
          <Candado p={[x, 0.7, 0.0]} k={cl(phys(tt, s.a - h.at + 0.9, 8, 0.4))} />
          <group position={[x - (w - 0.06) / 2, 0.95, 0]} rotation={[0, -1.9 * o, 0]}>
            <RBox p={[(w - 0.06) / 2, 0, 0]} s={[w - 0.06, 1.2, 0.04]} r={0.015}>{M.madera("#7d5526")}</RBox>
            <mesh position={[w - 0.14, 0, 0.04]}><sphereGeometry args={[0.025, 12, 8]} />{M.cromo("#c9a64a")}</mesh></group>
        </group>; })}
    </Estudio>
    <Head tt={tt} kick="LO QUE MI ABUELA" title="NUNCA HACÍA" col={RED} />
  </>;
}}</Stage>;

// ── D · ROLLO DE ESTRAZA: el rollo rueda por la mesa y va dejando el papel; cada truco aparece escrito a su tiempo y la cámara lo sigue
const H3Rollo: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" mesa={false}>{(tt) => {
  const S = (h.items ?? []) as { a: number; tx: string }[], cur = S.reduce((c, e, i) => (tt >= e.a - h.at ? i : c), 0);
  const zf = lerp(Math.max(0, cur - 1), cur, eio(tt, (S[cur]?.a ?? h.at) - h.at, (S[cur]?.a ?? h.at) - h.at + 0.6)) * 0.32;
  return <>
    <Estudio t={tt} cam={[0, 1.6, 1.6 - zf]} look={[0, 0, -zf - 0.5]} orbit={0.04}>
      <mesh position={[0, 0.012, -(zf + 0.6) / 2 + 0.3]} rotation={[-P2, 0, 0]} receiveShadow><planeGeometry args={[1.5, zf + 1.2]} /><meshStandardMaterial color="#c9a878" roughness={0.95} /></mesh>
      <mesh position={[0, 0.1, -zf - 0.35]} rotation={[0, 0, P2]} castShadow><cylinderGeometry args={[0.09, 0.09, 1.5, 24]} /><meshStandardMaterial color="#b89464" roughness={0.9} /></mesh>
      {S.map((s, i) => { if (i < cur - 4 || i > cur) return null; const k = cl((tt - (s.a - h.at)) / 0.5);
        return <mesh key={i} position={[0, 0.015, -i * 0.32]} rotation={[-P2, 0, 0]} scale={[Math.max(0.001, k), 1, 1]}><planeGeometry args={[1.3, 0.26]} /><meshStandardMaterial map={papel("rolb" + i, [`${i + 1}. ${s.tx}`], { w: 1280, h: 256, size: 110, bg: "#d9bc8a" })} roughness={0.95} transparent /></mesh>; })}
    </Estudio>
    <Head tt={tt} kick="REPASO RÁPIDO" title="LOS 24, EN EL ROLLO" />
  </>;
}}</Stage>;

export const MAP3: Record<string, C> = { mazorca: H3Mazorca, cubeta: H3Cubeta, balanza: H3Balanza, bolsacal: H3BolsaCal, vasocal: H3VasoCal, aluminio: H3Aluminio,
  muestrario: H3Muestrario, una: H3Una, relojpared: H3RelojPared, ventanaluna: H3VentanaLuna, tiraph: H3TiraPh, capasgrano: H3CapasGrano, molino: H3Molino,
  bolita: H3Bolita, tibia: H3Tibia, infla: H3Infla, calibre: H3Calibre, chiquihuite: H3Chiquihuite, embudo: H3Embudo, alcancia: H3Alcancia, voltea: H3Voltea,
  pizarra: H3Pizarra, pinza: H3Pinza, mapa: H3Mapa, solluna: H3SolLuna, errorestort: H3ErroresTort, escalera: H3Escalera, alacena: H3Alacena, rollo: H3Rollo };
