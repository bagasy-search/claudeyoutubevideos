// ohf30d · componentes únicos 10-18 (la purga: encontrarla, abrirla un cuarto de vuelta, cerrarla y seguir por el lazo)
import React from "react";
import * as THREE from "three";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex, tubeG } from "./h3d";
import { Cup, Puffs, Rag, Shock, Tape } from "./okit";
import { BD, BH, Baseboard, CU, Coin, CoinVent, Cu, Fins, PY, RoomWall, Screwdriver } from "./bbkit";

const PI = Math.PI;
type V3 = [number, number, number];
const skin = <meshStandardMaterial color="#d9a585" roughness={0.6} />;
// mano estilizada con la palma hacia abajo (dedos hacia -z si no se rota)
const Hand: React.FC<{ p?: V3; rot?: V3; s?: number; curl?: number }> = ({ p = [0, 0, 0], rot = [0, 0, 0], s = 1, curl = 0 }) => <group position={p} rotation={rot} scale={s}>
  <RBox s={[0.085, 0.026, 0.09]} p={[0, 0, 0]} r={0.012}>{skin}</RBox>
  {[-0.03, -0.01, 0.01, 0.03].map((x, i) => <group key={i} position={[x, 0, -0.045]} rotation={[-curl * 0.9, 0, 0]}>
    <mesh position={[0, 0, -0.03 - (i === 1 || i === 2 ? 0.005 : 0)]} rotation={[PI / 2, 0, 0]}><capsuleGeometry args={[0.0095, 0.045 + (i === 1 || i === 2 ? 0.01 : 0), 6, 10]} />{skin}</mesh>
  </group>)}
  <mesh position={[0.05, -0.004, -0.01]} rotation={[PI / 2, 0, -0.7]}><capsuleGeometry args={[0.01, 0.04, 6, 10]} />{skin}</mesh>
  <mesh position={[0, 0.002, 0.07]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.036, 0.034, 0.06, 18]} /><meshStandardMaterial color="#4a5a6e" roughness={0.8} /></mesh>
</group>;

// ---- 6:23 · DONDE PASA DE CALIENTE A FRÍO (rehecho r2): de noche, a ras del piso y mirando a lo largo del elemento sin tapa; la mano
// avanza sobre las aletas: detrás del calor sube un temblor naranja, del lado frío cae un vaho azul, y una tira roja marca el cambio ----
export const HHandScan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="dark" wall="none" bg="#0b0d14" key1={[0.4, 1.0, 1.3]} warm={0.7} lamp={[-0.5, 0.35, 0.3]}
  cam={{ at: [0.0, 0.1, 0.0], az: [-0.78, -0.56], el: [0.36, 0.3], r: [1.2, 1.08], fov: 32 }}>{(tt) => {
  const XC = 0.12, hx = lerp(-0.42, 0.42, eio(tt, 0.4, 5.0)), L = 1.5, heatAt = (x: number) => x < XC ? 0.95 : 0.06;
  const mk = phys(tt, 3.0, 7, 0.5);
  return <>
    {/* el elemento solo, apoyado en sus ménsulas sobre el piso oscuro */}
    <mesh rotation={[0, 0, PI / 2]} position={[0, 0.07, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, L + 0.2, 22]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} emissive="#ff4a10" emissiveIntensity={0.12} /></mesh>
    <Fins len={L} p={[0, 0.07, 0]} fs={0.07} heat={(u) => { const x = -L / 2 + u * L; return x < hx ? heatAt(x) : 0.5; }} />
    {[-0.6, 0, 0.6].map((x, i) => <RBox key={i} s={[0.012, 0.06, 0.09]} p={[x, 0.03, 0]} r={0.003}>{M.steel({ col: "#7d8186" })}</RBox>)}
    {/* temblor de calor sobre lo caliente que ya pasó la mano; vaho frío sobre lo frío */}
    {Array.from({ length: 6 }, (_, i) => { const x = -0.66 + i * 0.13; return x < Math.min(hx, XC) ? <Puffs key={i} tt={tt + i * 0.37} n={6} a={[x, 0.11, 0]} b={[x + 0.02, 0.36, 0.02]} r={0.014} col="#ff9a4a" op={0.2} v={0.45} wob={0.012} /> : null; })}
    {Array.from({ length: 4 }, (_, i) => { const x = XC + 0.08 + i * 0.12; return x < hx ? <Puffs key={i} tt={tt + i * 0.5} n={5} a={[x, 0.16, 0]} b={[x + 0.03, 0.06, 0.1]} r={0.02} col="#8fb8ff" op={0.3} v={0.3} wob={0.008} /> : null; })}
    {/* la mano, palma abajo, que flota a dos dedos de las aletas */}
    <Hand p={[hx, 0.15 + 0.006 * Math.sin(tt * 3), 0.0]} rot={[0, -PI / 2, 0]} s={1.35} curl={0.15} />
    {/* la marca del cambio: cinta roja vertical que cae en el punto exacto */}
    <group position={[XC, 0.07, 0.0]} visible={mk > 0.01}>
      <mesh position={[0, 0.0, 0.05]} scale={[1, Math.max(0.001, mk), 1]}><boxGeometry args={[0.012, 0.16, 0.002]} /><meshBasicMaterial color="#e0402e" toneMapped={false} /></mesh>
    </group>
    <Tape txt="HOT, THEN COLD = AIR" col="#b3261e" p={[XC, 0.32, -0.02]} rot={[0, -0.6, 0]} w={0.42} k={phys(tt, 3.2, 8, 0.45)} />
    <Tape txt="HOT" col="#b5461e" p={[-0.22, 0.26, -0.06]} rot={[0, -0.6, 0]} w={0.12} k={phys(tt, 1.4, 8, 0.45)} />
    <Tape txt="COLD" col="#2a5c9a" p={[0.5, 0.24, -0.06]} rot={[0, -0.6, 0]} w={0.14} k={phys(tt, 4.2, 8, 0.45)} />
  </>;
}}</Scene3D>;

// ---- 7:58 · LA TAPA DE PUNTA SE LEVANTA Y SALE: sin palanca; abajo aparece el caño con su purga brillando ----
const coPaper = () => tex.text("co_wp", 512, 512, (g) => {
  g.fillStyle = "#3f5a4a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(232,214,168,.38)"; g.lineWidth = 3;
  for (let k = -512; k < 1024; k += 48) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 512, 512); g.stroke(); g.beginPath(); g.moveTo(k + 512, 0); g.lineTo(k, 512); g.stroke(); }
  for (let y = 24; y < 512; y += 48) for (let x = 0; x < 512; x += 48) { g.fillStyle = "rgba(232,214,168,.5)"; g.beginPath(); g.arc(x, y, 4, 0, 6.3); g.fill(); }
});
export const HCapOff: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="wood" wall="none" key1={[-0.6, 1.4, 1.2]}
  cam={{ at: [-0.36, 0.17, 0.05], az: [-0.42, -0.26], el: [0.32, 0.26], r: [0.85, 0.76], fov: 32 }}>{(tt) => {
  const c = eio(tt, 0.6, 2.2), shine = cl(tt - 2.2) * (0.6 + 0.4 * Math.sin(tt * 4));
  return <>
    <mesh position={[-0.2, 0.55, -0.015]} receiveShadow><planeGeometry args={[2.2, 1.1]} /><meshStandardMaterial map={coPaper()} roughness={0.85} /></mesh>
    <Baseboard len={0.8} capL={1} vent={0} heat={() => 0.7} />
    <group position={[-0.445 - 0.02 * c, 0.16 * c, 0.1 * c]} rotation={[0.2 * c, 0, 0.35 * c]}>
      <RBox s={[0.09, BH + 0.004, BD + 0.012]} p={[0, BH / 2 + 0.008, BD / 2 + 0.004]} r={0.008}><meshStandardMaterial color="#e7dfcf" roughness={0.42} metalness={0.25} /></RBox>
    </group>
    <mesh position={[-0.36, PY + 0.04, BD / 2]}><sphereGeometry args={[0.03, 16, 12]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.22 * shine} toneMapped={false} depthWrite={false} /></mesh>
    {/* flechita: hacia arriba, no hacia afuera */}
    <group position={[-0.56, 0.3, 0.1]} scale={Math.max(0.001, phys(tt, 0.3, 8, 0.5) * (1 - eio(tt, 2.0, 2.4)))}>
      <mesh><coneGeometry args={[0.02, 0.04, 3]} /><meshBasicMaterial color="#f5c24a" toneMapped={false} /></mesh>
      <mesh position={[0, -0.04, 0]}><boxGeometry args={[0.01, 0.05, 0.004]} /><meshBasicMaterial color="#f5c24a" toneMapped={false} /></mesh>
    </group>
    <Tape txt="LIFT IT. DON'T FORCE IT." p={[-0.2, 0.33, 0.1]} w={0.32} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 8:17 · CORTAR LA LÍNEA DE PINTURA (rehecho r2): macro de la junta tapa-pared pintada con pintura gruesa; la trincheta de hoja
// partible baja por la junta, el cordón de pintura se abre en dos labios limpios y las escamas caen girando sobre la toalla de papel húmeda ----
const PAINT = "#ece2cb", WALLC = "#7f948a";
const paintM = <meshPhysicalMaterial color={PAINT} roughness={0.22} clearcoat={0.9} clearcoatRoughness={0.15} />;
const towelTex = () => tex.text("towel_kl", 512, 384, (g) => {
  g.fillStyle = "#f4f6f4"; g.fillRect(0, 0, 512, 384);
  for (let y = 8; y < 384; y += 16) for (let x = (y / 16) % 2 ? 8 : 0; x < 512; x += 16) { g.fillStyle = "rgba(160,170,175,.35)"; g.beginPath(); g.arc(x, y, 2.4, 0, 6.3); g.fill(); }
  for (let i = 0; i < 7; i++) { const gr = g.createRadialGradient(80 + rn(i, 2) * 360, 60 + rn(i, 3) * 260, 4, 80 + rn(i, 2) * 360, 60 + rn(i, 3) * 260, 40 + rn(i, 4) * 70); gr.addColorStop(0, "rgba(120,140,155,.45)"); gr.addColorStop(1, "rgba(120,140,155,0)"); g.fillStyle = gr; g.fillRect(0, 0, 512, 384); }
  g.strokeStyle = "rgba(150,160,165,.5)"; g.lineWidth = 3; g.setLineDash([10, 8]); g.strokeRect(14, 14, 484, 356);
});
// trincheta de hoja partible: punta de la hoja en el origen, el mango sube por +y
const SnapKnife: React.FC = () => {
  const blade = React.useMemo(() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0.017, 0.013); s.lineTo(0.017, 0.075); s.lineTo(0, 0.075); s.lineTo(0, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.0008, bevelEnabled: false }); g.translate(-0.0085, 0, -0.0004); return g; }, []);
  return <group rotation={[0, PI / 2, 0]}>
    <mesh geometry={blade} castShadow><meshStandardMaterial color="#e9edf1" metalness={1} roughness={0.12} side={THREE.DoubleSide} /></mesh>
    {[0.022, 0.034, 0.046].map((y, i) => <mesh key={i} position={[0, y, 0.0006]} rotation={[0, 0, 0.66]}><planeGeometry args={[0.022, 0.0009]} /><meshBasicMaterial color="#6f777f" /></mesh>)}
    {/* nariz de metal, cuerpo gris y goma naranja; la corredera con estrías */}
    <RBox s={[0.024, 0.024, 0.012]} p={[0, 0.052, 0]} r={0.004}>{M.chrome({ col: "#b9c0c6" })}</RBox>
    <RBox s={[0.028, 0.14, 0.016]} p={[0, 0.13, 0]} r={0.006}><meshStandardMaterial color="#3a3e44" metalness={0.6} roughness={0.35} /></RBox>
    <RBox s={[0.031, 0.09, 0.019]} p={[0, 0.16, 0]} r={0.008}>{M.plastic({ col: "#e5641e" })}</RBox>
    {Array.from({ length: 5 }, (_, i) => <RBox key={i} s={[0.012, 0.003, 0.006]} p={[0, 0.075 + i * 0.006, 0.0105]} r={0.001}>{M.steel()}</RBox>)}
  </group>;
};
export const HKnifeLine: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="wood" wall="none" bg="#1a1714" key1={[-0.7, 1.3, 1.2]} warm={0.62}
  cam={{ at: [-0.06, 0.12, 0.08], az: [0.5, 0.3], el: [0.2, 0.14], r: [0.66, 0.56], fov: 30 }}>{(tt) => {
  const SX = -0.017, SZ = 0.1, cut = eio(tt, 0.7, 5.2), ky = lerp(0.212, 0.016, cut);
  const push = 0.004 * Math.sin(tt * 9) * (cut > 0 && cut < 1 ? 1 : 0);
  return <>
    {/* pared pintada */}
    <mesh position={[0, 0.5, 0]} receiveShadow><planeGeometry args={[2, 1]} /><meshStandardMaterial color={WALLC} roughness={0.85} /></mesh>
    {/* tapa frontal y tapa de punta, pintadas encima (por eso quedan pegadas) */}
    <RBox s={[0.6, 0.2, 0.012]} p={[-0.32, 0.11, 0.094]} r={0.004}>{paintM}</RBox>
    <RBox s={[0.6, 0.012, 0.09]} p={[-0.32, 0.206, 0.05]} r={0.004}>{paintM}</RBox>
    <RBox s={[0.07, 0.218, 0.104]} p={[0.019, 0.109, 0.052]} r={0.008}>{paintM}</RBox>
    {/* goterones de pintura vieja sobre la tapa */}
    {[[-0.12, 0.17], [-0.25, 0.15], [0.03, 0.16]].map(([x, y], i) => <mesh key={i} position={[x, y, x > 0 ? 0.105 : 0.1005]} rotation={[0, 0, 0]}><capsuleGeometry args={[0.0035, 0.025 + 0.01 * i, 6, 10]} />{paintM}</mesh>)}
    {/* el cordón de pintura que tapa la junta: entero abajo de la hoja, partido en dos labios arriba */}
    <mesh position={[SX, (0.012 + ky) / 2, SZ]}><cylinderGeometry args={[0.0042, 0.0042, Math.max(0.001, ky - 0.012), 14]} />{paintM}</mesh>
    {[-1, 1].map((s) => <mesh key={s} position={[SX + s * 0.0042, (ky + 0.212) / 2, SZ - 0.001]} visible={ky < 0.205}><cylinderGeometry args={[0.0027, 0.0027, Math.max(0.001, 0.212 - ky), 12]} />{paintM}</mesh>)}
    <mesh position={[SX, (ky + 0.212) / 2, SZ - 0.0035]} visible={ky < 0.205}><boxGeometry args={[0.0034, Math.max(0.001, 0.212 - ky), 0.002]} /><meshStandardMaterial color="#14110e" roughness={1} /></mesh>
    {/* la trincheta con la punta en la junta */}
    <group position={[SX + push * 0.3, ky - 0.004, SZ + 0.004]} rotation={[0.55, 0, -0.62]} scale={1.3}><SnapKnife /></group>
    {/* toalla de papel húmeda en el piso y las escamas cayendo girando */}
    <RBox s={[0.24, 0.003, 0.17]} p={[-0.02, 0.0016, 0.2]} r={0.002}><meshStandardMaterial map={towelTex()} roughness={0.95} /></RBox>
    {Array.from({ length: 18 }, (_, i) => { const a = 0.9 + i * 0.25; if (tt < a) return null;
      const y0 = lerp(0.212, 0.016, eio(a, 0.7, 5.2)), s = tt - a, fallT = Math.sqrt(2 * y0 / 1.4), q = Math.min(s, fallT);
      const y = Math.max(0.006, y0 - 0.7 * q * q), z = SZ + 0.01 + (0.04 + 0.08 * rn(i, 2)) * q / Math.max(0.2, fallT), x = SX + (rn(i, 1) - 0.5) * 0.06 * q / Math.max(0.2, fallT);
      const spin = q * (6 + 6 * rn(i, 3));
      return <mesh key={i} position={[x, y, z]} rotation={[spin, rn(i, 4) * 6, spin * 0.6]} castShadow><cylinderGeometry args={[0.008, 0.008, 0.009 + 0.006 * rn(i, 5), 10, 1, true, 0, 2.2]} /><meshPhysicalMaterial color={PAINT} roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} /></mesh>; })}
    <Tape txt="SCORE IT. CATCH THE FLAKES." p={[-0.23, 0.235, 0.004]} w={0.3} k={phys(tt, 1.0, 8, 0.45)} rev={cl((tt - 1.0) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 8:37 · TRES PURGAS POSIBLES (rehecho r3): un plato giratorio de madera trae cada purga al frente y cada una se usa en su turno:
// la moneda gira la de ranura ancha, el destornillador la de ranura fina y la automática suelta el aire sola ----
export const HThreeVents: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="dark" wall="none" bg="#16181c" key1={[-0.5, 1.5, 1.3]} warm={0.9}
  cam={{ at: [0.0, 0.1, 0.12], az: [-0.32, 0.12], el: [0.3, 0.24], r: [0.74, 0.6], fov: 32 }}>{(tt) => {
  const R = 0.15, ang = (2 * PI / 3) * (eio(tt, 1.8, 2.4) + eio(tt, 3.4, 4.0)), cin = phys(tt, 0.4, 8, 0.5), a0 = eio(tt, 0.8, 1.5) * PI / 2;
  const sd = phys(tt, 2.3, 8, 0.5) * (1 - eio(tt, 3.5, 3.8)), a1 = eio(tt, 2.6, 3.3) * PI / 2, hiss = cl((tt - 4.1) * 3);
  const lab = [cl((1.8 - tt) * 4), cl((tt - 2.2) * 4) * cl((3.5 - tt) * 4), cl((tt - 3.9) * 4)];
  return <>
    <mesh position={[0, 0.6, -0.5]}><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={tex.wood(6, 2, [58, 44, 34])} roughness={0.8} /></mesh>
    <pointLight position={[0, 0.4, 0.1]} intensity={0.15} distance={1.0} color="#ffd9a0" />
    <group rotation={[0, -ang, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow><cylinderGeometry args={[0.24, 0.25, 0.04, 64]} />{M.wood({ rx: 1, ry: 1, base: [140, 92, 52] })}</mesh>
      <mesh position={[0, 0.0405, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.2, 0.205, 64]} /><meshStandardMaterial color="#3a2614" /></mesh>
      {[0, 1, 2].map((i) => { const th = i * 2 * PI / 3; return <group key={i} position={[Math.sin(th) * R, 0.04, Math.cos(th) * R]} rotation={[0, th, 0]}>
        <mesh position={[0, 0.035, 0]}><cylinderGeometry args={[0.014, 0.014, 0.07, 20]} /><meshStandardMaterial color={CU} metalness={0.9} roughness={0.3} /></mesh>
        <group position={[0, 0.07, 0]} scale={2.6}>
          {i === 0 && <><CoinVent a={a0} /><group position={[0, 0.034, 0]} rotation={[0, a0, 0]} visible={cin > 0.01}><group position={[0, 0.05 * (1 - cin), 0]}><Coin rot={[PI / 2, 0, 0]} s={Math.max(0.001, cin * 0.95)} /></group></group></>}
          {i === 1 && <><mesh position={[0, 0.008, 0]}><cylinderGeometry args={[0.008, 0.009, 0.016, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
            <group rotation={[0, a1, 0]}><mesh position={[0, 0.018, 0]}><cylinderGeometry args={[0.005, 0.005, 0.006, 20]} />{M.brass()}</mesh>
              <RBox s={[0.008, 0.002, 0.0016]} p={[0, 0.0215, 0]} r={0.0003}><meshStandardMaterial color="#3b2a10" /></RBox>
              <Screwdriver p={[0, 0.03 + 0.04 * (1 - sd), 0]} s={Math.max(0.001, sd * 0.26)} /></group></>}
          {i === 2 && <><mesh position={[0, 0.006, 0]}><cylinderGeometry args={[0.006, 0.006, 0.012, 16]} />{M.brass()}</mesh>
            <mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.014, 0.014, 0.03, 24]} />{M.chrome()}</mesh>
            <mesh position={[0, 0.045 + 0.003 * hiss * Math.sin(tt * 12), 0]}><cylinderGeometry args={[0.006, 0.006, 0.008, 16]} /><meshStandardMaterial color="#1b1b1b" roughness={0.4} /></mesh>
            <Puffs tt={tt} n={8} a={[0, 0.05, 0]} b={[0.025, 0.085, 0.02]} r={0.005} col="#ffffff" op={0.6 * hiss} v={1.1} k={hiss} /></>}
        </group>
      </group>; })}
    </group>
    {["COIN", "SCREWDRIVER", "AUTOMATIC"].map((n, i) => <Tape key={i} txt={n} col={["#7a4a12", "#b3261e", "#1f4f8a"][i]} p={[0.0, 0.07, 0.26]} rot={[-0.3, 0, 0]} w={[0.12, 0.22, 0.2][i]} k={Math.max(0.001, lab[i]) * (i === 0 ? phys(tt, 0.5, 8, 0.45) : 1)} />)}
  </>;
}}</Scene3D>;

// ---- 9:08 · UN TRAPO EN UN VASITO (rehecho r2): de cerca, sobre machimbre verde; el trapo se dobla y cae en la taza, la taza se
// desliza bajo la purga, la moneda gira y las primeras gotas caen adentro: el trapo se oscurece de mojado y el piso queda seco ----
const rgBead = () => tex.text("rg_bead", 256, 256, (g) => {
  g.fillStyle = "#7d9a86"; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(255,255,255,.10)"; g.fillRect(x + 2, 0, 10, 256); g.fillStyle = "rgba(30,50,40,.35)"; g.fillRect(x, 0, 2, 256); }
});
export const HRagCup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#15130f" key1={[-0.5, 1.2, 1.1]} warm={0.8}
  cam={{ at: [-0.33, 0.13, 0.1], az: [-0.62, -0.38], el: [0.3, 0.22], r: [0.6, 0.5], fov: 32 }}>{(tt) => {
  const fold = eio(tt, 0.2, 0.9), drop = eio(tt, 0.9, 1.4), slide = eio(tt, 1.5, 2.4), turn = eio(tt, 2.5, 3.3), wet = eio(tt, 3.4, 5.4);
  const cx = lerp(-0.12, -0.36, slide), vx = -0.36, vy = PY + 0.03, cz = BD / 2 + 0.065;
  return <>
    <mesh position={[0, 0.8, -0.006]} receiveShadow><planeGeometry args={[3, 1.6]} /><meshStandardMaterial map={rgBead()} roughness={0.6} /></mesh>
    <Baseboard len={0.8} capL={1} cover={1} vent={0} ventA={(PI / 2) * turn} heat={() => 0.7} />
    {/* la moneda que abre la purga */}
    <group position={[vx, vy + 0.012 + 0.04 * (1 - eio(tt, 2.2, 2.6)) + 0.04 * eio(tt, 3.6, 4.2), BD / 2]} rotation={[0, (PI / 2) * turn, 0]} visible={tt > 2.15}>
      <Coin rot={[0, 0, PI / 2]} p={[0, 0.012, 0]} />
    </group>
    <group position={[cx, 0, cz]}>
      <Cup p={[0, 0, 0]} s={0.95} fill={0.12 * wet} />
      <group position={[0, lerp(0.2, 0.06, drop), 0]} scale={[lerp(1, 0.5, fold), 1 + fold * 2, lerp(1, 0.55, fold)]}>
        <RBox s={[0.1, 0.012, 0.08]} r={0.006}><meshStandardMaterial color={new THREE.Color("#e9e1cf").lerp(new THREE.Color("#8c8576"), 0.6 * wet)} map={undefined} roughness={0.95} /></RBox>
        <RBox s={[0.1, 0.0125, 0.02]} r={0.004}><meshStandardMaterial color={new THREE.Color("#b84a3e").lerp(new THREE.Color("#6e2a24"), 0.6 * wet)} roughness={0.95} /></RBox>
      </group>
    </group>
    {/* las gotas: salen de la purga en arco y caen en la taza, con salpicadura chica */}
    {Array.from({ length: 4 }, (_, i) => { const u = ((tt - 3.4) * 1.3 + i / 4) % 1; if (tt < 3.4 + i / 5.2) return null;
      return <mesh key={i} position={[vx + 0.004, vy - u * u * 0.09 + 0.006 * Math.sin(PI * u), BD / 2 + u * (cz - BD / 2)]} scale={[1, 1 + u * 0.6, 1]}><sphereGeometry args={[0.0045, 10, 8]} />{M.water({ op: 0.9 })}</mesh>; })}
    <Puffs tt={tt} n={4} a={[vx + 0.01, vy + 0.01, BD / 2]} b={[vx + 0.05, vy + 0.06, BD / 2 + 0.04]} r={0.007} col="#ffffff" op={0.35 * cl((tt - 3.3) * 3) * (1 - eio(tt, 4.6, 5.2))} v={1.2} />
    <Tape txt="RAG IN A CUP, RIGHT UNDER IT" p={[-0.2, 0.25, 0.02]} w={0.3} k={phys(tt, 0.8, 8, 0.45)} rev={cl((tt - 0.8) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 9:31 · UN CUARTO DE VUELTA: vista desde arriba; la moneda gira la ranura 90° contra reloj y un arco marca el tope ----
export const HQuarterTurn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" key1={[-0.3, 1.4, 0.6]}
  cam={{ at: [0.0, 0.03, 0.0], az: [-0.05, 0.05], el: [1.25, 1.2], r: [0.3, 0.27], fov: 32 }}>{(tt) => {
  const a = (PI / 2) * eio(tt, 1.0, 2.4), arc = eio(tt, 1.0, 2.4);
  return <>
    <mesh rotation={[0, 0, PI / 2]}><cylinderGeometry args={[0.011, 0.011, 0.3, 24]} /><meshStandardMaterial color="#b8703a" metalness={0.9} roughness={0.3} /></mesh>
    <CoinVent p={[0, 0.011, 0]} a={a} s={2.2} />
    <group position={[0, 0.072, 0]} rotation={[0, a, 0]}><Coin rot={[PI / 2, 0, 0]} s={2.2} p={[0, 0, 0]} /></group>
    {/* el arco de 90° y el tope */}
    <mesh position={[0, 0.06, 0]} rotation={[-PI / 2, 0, 0]}><ringGeometry args={[0.044, 0.05, 48, 1, 0, Math.max(0.001, arc * PI / 2)]} /><meshBasicMaterial color="#f5c24a" toneMapped={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.06, -0.047]} scale={Math.max(0.001, phys(tt, 2.4, 9, 0.5))}><boxGeometry args={[0.004, 0.003, 0.016]} /><meshBasicMaterial color="#d33a2c" toneMapped={false} /></mesh>
    <Tape txt="1/4 TURN. THAT'S ALL." p={[0.0, 0.07, 0.035]} rot={[-PI / 2, 0, 0]} w={0.14} k={phys(tt, 1.5, 8, 0.45)} rev={cl((tt - 1.5) / 0.7)} />
  </>;
}}</Scene3D>;

// ---- 9:45 · SI SEGUÍS GIRANDO, EL TORNILLO SALE (rehecho r2): macro sobre el caño; el tornillo sube vuelta a vuelta, salta, cae dando
// tumbos sobre las tablas del piso y por el agujero sale un chorro que salpica y arma un charco que crece ----
export const HScrewPop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" key1={[-0.6, 1.3, 1.2]} warm={0.95}
  cam={{ at: [0.03, 0.02, 0.02], az: [-0.5, -0.32], el: [0.34, 0.28], r: [0.5, 0.44], fov: 32 }}>{(tt) => {
  const TP = 2.5, tw = eio(tt, 0.2, TP), up = tt > TP;
  // vuelo del tornillo: parábola hasta el piso (y=-0.07) y rebote amortiguado
  const ft = Math.max(0, tt - TP), fx = Math.min(ft, 1.4) * 0.09, fy = up ? Math.max(-0.088, 0.045 + 0.32 * ft - 1.6 * ft * ft) : 0;
  const bounce = ft > 0.55 ? Math.abs(Math.sin((ft - 0.55) * 7)) * 0.02 * Math.exp(-(ft - 0.55) * 3) : 0;
  const jet = cl((tt - TP - 0.05) * 3), pud = eio(tt, TP + 0.3, 5.6);
  return <>
    {/* tablas del piso bajo el caño */}
    <mesh rotation={[-PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow><planeGeometry args={[2, 2]} /><meshStandardMaterial map={tex.wood(5, 2, [128, 84, 48])} roughness={0.55} /></mesh>
    <mesh rotation={[0, 0, PI / 2]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.5, 24]} /><meshStandardMaterial color="#b8703a" metalness={0.9} roughness={0.3} /></mesh>
    {[-0.2, 0.2].map((x, i) => <RBox key={i} s={[0.012, 0.09, 0.03]} p={[x, -0.045, 0]} r={0.003}>{M.steel({ col: "#7d8186" })}</RBox>)}
    <group position={[0, 0.011, 0]} scale={1.8}>
      <mesh position={[0, 0.006, 0]} castShadow><cylinderGeometry args={[0.009, 0.01, 0.012, 6]} />{M.brass({ col: "#c99a45" })}</mesh>
      <mesh position={[0, 0.013, 0]}><cylinderGeometry args={[0.0035, 0.0035, 0.002, 16]} /><meshStandardMaterial color="#120c06" /></mesh>
      <group position={up ? [fx / 1.8, (fy + bounce) / 1.8, ft * 0.012] : [0, 0.02 + tw * 0.012, 0]} rotation={up ? [ft * 6, tw * PI * 5, ft * 3] : [0, tw * PI * 5, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.0085, 0.0085, 0.004, 24]} />{M.brass({ col: "#e0b45a" })}</mesh>
        <RBox s={[0.0175, 0.0026, 0.0028]} p={[0, 0.0015, 0]} r={0.0004}><meshStandardMaterial color="#3b2a10" roughness={0.8} /></RBox>
        <mesh position={[0, -0.008, 0]}><cylinderGeometry args={[0.004, 0.004, 0.012, 12]} />{M.brass()}</mesh>
      </group>
    </group>
    {/* el chorro con su temblor, gotas que se desprenden y el charco */}
    <group visible={jet > 0.01}>
      <mesh geometry={tubeG("popjet2", [[0, 0.033, 0], [0.0, 0.08, 0.02], [0.03, 0.1, 0.06], [0.07, 0.04, 0.1], [0.09, -0.08, 0.12]], (u) => 0.0045 * (1 - u * 0.5), 50, 10)} scale={[1, Math.max(0.001, jet), 1 + 0.03 * Math.sin(tt * 8)]}>{M.water({ op: 0.7 })}</mesh>
      {Array.from({ length: 10 }, (_, i) => { const u = (tt * 1.1 + rn(i, 2)) % 1; return <mesh key={i} position={[0.03 + u * 0.09 + 0.02 * rn(i, 3), 0.1 - u * u * 0.18, 0.05 + u * 0.08 + 0.03 * rn(i, 4)]} scale={jet}><sphereGeometry args={[0.003, 8, 6]} />{M.water({ op: 0.85 })}</mesh>; })}
    </group>
    <mesh position={[0.09, -0.0885, 0.12]} rotation={[-PI / 2, 0, 0]} scale={[Math.max(0.001, pud), Math.max(0.001, pud * 0.8), 1]} visible={pud > 0.01}><circleGeometry args={[0.1, 40]} /><meshPhysicalMaterial color="#9cc7e6" transparent opacity={0.55} roughness={0.05} clearcoat={1} /></mesh>
    <Shock tt={tt} a={TP} p={[0, 0.06, 0.02]} r={0.035} col="#8fd0ff" />
    <Tape txt="DON'T KEEP TURNING" col="#b3261e" p={[-0.06, -0.045, 0.065]} rot={[-0.15, -0.4, 0]} w={0.16} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.8)} />
  </>;
}}</Scene3D>;

// ---- 10:02 · DEL ESCUPIDO AL CHORRITO PAREJO (rehecho r3): pared con zócalo de madera con paneles en relieve y moldura; primero escupe
// aire y agua turbia a borbotones, el chorro se va aclarando hasta quedar limpio y parejo, y recién ahí la moneda cierra ----
const spPaper = () => tex.text("sp_wp", 512, 512, (g) => {
  g.fillStyle = "#c9b48a"; g.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 64) { g.strokeStyle = "rgba(110,80,40,.35)"; g.lineWidth = 3; g.beginPath(); for (let y = 0; y <= 512; y += 8) g.lineTo(x + 32 + 10 * Math.sin(y / 30), y); g.stroke(); }
});
export const HSputter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#15110d" key1={[-0.7, 1.3, 1.1]} warm={0.9}
  cam={{ at: [-0.3, 0.13, 0.08], az: [-0.62, -0.38], el: [0.2, 0.14], r: [0.7, 0.58], fov: 32 }}>{(tt) => {
  const steady = eio(tt, 2.2, 3.6), clean = eio(tt, 2.6, 4.2), close = eio(tt, 4.8, 5.4), flow = steady * (1 - close);
  const vx = -0.36, vy = PY + 0.03, wc = "#" + new THREE.Color("#7b5a3a").lerp(new THREE.Color("#cfe8ff"), clean).getHexString();
  const pulse = 1 - (1 - steady) * (0.5 + 0.5 * Math.sin(tt * 11));
  return <>
    {/* pared con profundidad: papel arriba, moldura, y paneles en relieve abajo */}
    <mesh position={[0, 0.85, -0.03]}><planeGeometry args={[2.4, 1.1]} /><meshStandardMaterial map={spPaper()} roughness={0.85} /></mesh>
    <RBox s={[2.4, 0.03, 0.04]} p={[0, 0.31, -0.01]} r={0.008}><meshStandardMaterial color="#3b2a1c" roughness={0.45} /></RBox>
    <mesh position={[0, 0.15, -0.035]}><planeGeometry args={[2.4, 0.32]} /><meshStandardMaterial color="#4a3423" roughness={0.6} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <RBox key={i} s={[0.3, 0.2, 0.012]} p={[-0.9 + i * 0.32, 0.17, -0.026]} r={0.01}><meshStandardMaterial color="#5a4029" roughness={0.5} /></RBox>)}
    <Baseboard len={0.8} capL={1} cover={1} vent={0} ventA={PI / 2 * (1 - close)} heat={() => 0.7} />
    <Cup p={[vx, 0, BD / 2 + 0.05]} s={0.7} fill={0.15 + 0.55 * eio(tt, 0.8, 4.8)} col={wc} />
    {/* escupe: bocanadas de aire y gotas turbias a borbotones */}
    <Puffs tt={tt} n={7} a={[vx + 0.012, vy, BD / 2]} b={[vx + 0.09, vy + 0.07, BD / 2 + 0.06]} r={0.01} col="#ffffff" op={0.55 * (1 - steady)} v={1.4} />
    {Array.from({ length: 8 }, (_, i) => { const u = (tt * 1.7 + i / 8) % 1, sx = 0.05 * rn(i, 5); return <mesh key={i} position={[vx + 0.012 + u * (0.02 + sx), vy - u * 0.06 + 0.03 * Math.sin(PI * u) * rn(i, 6), BD / 2 + 0.01 + u * 0.04]} scale={Math.max(0.001, (1 - steady) * (0.7 + 0.6 * rn(i, 7)))}><sphereGeometry args={[0.005, 8, 8]} />{M.water({ col: "#7b5a3a", op: 0.9 })}</mesh>; })}
    {/* el chorro: arranca cortado y turbio, termina parejo y limpio */}
    <mesh geometry={tubeG("sputstream3", [[vx + 0.012, vy, BD / 2], [vx + 0.02, vy - 0.02, BD / 2 + 0.03], [vx + 0.01, vy - 0.06, BD / 2 + 0.05]], 0.0026, 30, 8)} scale={[1, 1, Math.max(0.001, pulse)]} visible={flow > 0.02}>{M.water({ col: wc, op: 0.8 * flow })}</mesh>
    <Tape txt="CLOUDY + SPITTING = AIR" col="#7a3b1f" p={[-0.22, 0.25, 0.1]} w={0.32} k={phys(tt, 0.6, 8, 0.45) * (1 - eio(tt, 2.9, 3.2))} rev={cl((tt - 0.6) / 0.6)} />
    <Tape txt="CLEAR + STEADY = AIR'S OUT" col="#1f4f8a" p={[-0.22, 0.25, 0.1]} w={0.34} k={phys(tt, 3.3, 8, 0.45) * (1 - eio(tt, 4.6, 4.8))} rev={cl((tt - 3.3) / 0.5)} />
    <Tape txt="SNUG, NOT CRANKED" p={[-0.22, 0.25, 0.1]} w={0.3} k={phys(tt, 4.8, 8, 0.45)} rev={cl((tt - 4.8) / 0.4)} />
  </>;
}}</Scene3D>;

// ---- 10:39 · LA MONEDA RECORRE EL LAZO (rehecho r2): casa de muñecas en corte, dos pisos empapelados; la moneda salta de purga en
// purga, de la más baja y cercana a la más alta y lejana; cada purga escupe su aire y su zócalo se enciende naranja ----
const VENTS: V3[] = [[-0.42, 0.1, 0.05], [0.02, 0.1, 0.05], [0.46, 0.1, 0.05], [-0.22, 0.66, 0.05], [0.36, 0.66, 0.05]];
const chPaper = (k: string, a: string, b: string) => tex.text("ch_" + k, 256, 256, (g) => {
  g.fillStyle = a; g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 32) { g.fillStyle = b; g.fillRect(x, 0, 10, 256); }
});
export const HChaseLoop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="none" bg="#121519" key1={[-0.6, 2.2, 1.8]}
  cam={{ at: [0.02, 0.5, 0.0], az: [-0.3, 0.14], el: [0.16, 0.08], r: [1.66, 1.46], fov: 32 }}>{(tt) => {
  const q = cl((tt - 0.5) / 4.8) * 4, i0 = Math.min(3, Math.floor(q)), f = q - i0, a = VENTS[i0], b = VENTS[Math.min(4, i0 + 1)], e = eio(f, 0.15, 0.85);
  const cp: V3 = [lerp(a[0], b[0], e), lerp(a[1], b[1], e) + 0.1 + 0.16 * Math.sin(PI * e), 0.14];
  const hit = (i: number) => 0.5 + (i === 0 ? 0 : (i - 0.15) * 1.2);
  return <>
    {/* la casa en corte: dos pisos empapelados, losas, techo, ventanas */}
    <RBox s={[1.3, 0.56, 0.02]} p={[0, 0.28, -0.04]} r={0.004}><meshStandardMaterial map={chPaper("a", "#c9b48e", "rgba(255,245,220,.25)")} roughness={0.9} /></RBox>
    <RBox s={[1.3, 0.54, 0.02]} p={[0, 0.85, -0.04]} r={0.004}><meshStandardMaterial map={chPaper("b", "#8ea6a0", "rgba(255,255,255,.18)")} roughness={0.9} /></RBox>
    <RBox s={[1.34, 0.04, 0.24]} p={[0, 0.58, 0.06]} r={0.006}><meshStandardMaterial map={tex.wood(3, 1, [140, 92, 54])} roughness={0.6} /></RBox>
    <RBox s={[1.34, 0.04, 0.24]} p={[0, -0.02, 0.06]} r={0.006}><meshStandardMaterial map={tex.wood(3, 1, [140, 92, 54])} roughness={0.6} /></RBox>
    {[-1, 1].map((s) => <RBox key={s} s={[0.04, 1.18, 0.24]} p={[s * 0.67, 0.57, 0.06]} r={0.006}><meshStandardMaterial color="#efe7d6" roughness={0.6} /></RBox>)}
    {[-1, 1].map((s) => <RBox key={"r" + s} s={[0.8, 0.045, 0.28]} p={[s * 0.34, 1.3, 0.06]} rot={[0, 0, -s * 0.5]} r={0.006}><meshStandardMaterial color="#5a3c28" roughness={0.7} /></RBox>)}
    {[[0.24, 0.29], [-0.48, 0.92], [0.08, 0.92]].map(([x, y], i) => <group key={i} position={[x, y, -0.028]}>
      <mesh><planeGeometry args={[0.16, 0.14]} /><meshBasicMaterial color="#1d2b44" toneMapped={false} /></mesh>
      <RBox s={[0.18, 0.016, 0.012]} p={[0, -0.075, 0.004]} r={0.003}><meshStandardMaterial color="#f3ede0" /></RBox>
      <RBox s={[0.012, 0.15, 0.008]} p={[0, 0, 0.004]} r={0.002}><meshStandardMaterial color="#f3ede0" /></RBox></group>)}
    <RBox s={[0.2, 0.26, 0.14]} p={[-0.54, 0.13, 0.06]} r={0.02}><meshStandardMaterial color="#2f4a5c" metalness={0.35} roughness={0.45} /></RBox>
    {VENTS.map((v, i) => { const on = eio(tt, hit(i) + 0.2, hit(i) + 0.9);
      return <group key={i}>
        <RBox s={[0.34, 0.1, 0.07]} p={[v[0], v[1] - 0.05, v[2]]} r={0.012}><meshStandardMaterial color="#e7dfcf" roughness={0.42} emissive="#ff7a2a" emissiveIntensity={0.55 * on} /></RBox>
        <mesh position={[v[0] - 0.14, v[1] + 0.006, v[2] + 0.025]}><sphereGeometry args={[0.014, 14, 10]} />{M.brass()}</mesh>
        <Puffs tt={tt} n={4} a={[v[0] - 0.14, v[1] + 0.02, v[2] + 0.03]} b={[v[0] - 0.1, v[1] + 0.12, v[2] + 0.08]} r={0.012} col="#ffffff" op={0.5 * cl((tt - hit(i)) * 4) * (1 - eio(tt, hit(i) + 0.5, hit(i) + 1.0))} v={1.4} />
        <Puffs tt={tt + i} n={4} a={[v[0], v[1] + 0.02, v[2]]} b={[v[0] + 0.02, v[1] + 0.2, v[2] + 0.02]} r={0.016} col="#ff9a4a" op={0.25 * on} v={0.4} />
        <Tape txt={String(i + 1)} p={[v[0] + 0.1, v[1] + 0.1, v[2] + 0.04]} w={0.18} k={phys(tt, hit(i) - 0.3, 8, 0.45)} col={on > 0.5 ? "#1f6a3a" : "#1c2a3a"} />
      </group>; })}
    <group position={cp} rotation={[PI / 2, 0, tt * 4]} scale={7}><mesh castShadow><cylinderGeometry args={[0.012, 0.012, 0.0025, 40]} />{M.brass({ col: "#e8c46a", em: "#7a5a10", emI: 0.5 })}</mesh></group>
    <Tape txt="LOW + CLOSE FIRST, HIGH + FAR LAST" p={[0.06, 0.44, 0.0]} w={1.05} k={phys(tt, 0.9, 8, 0.45)} rev={cl((tt - 0.9) / 0.9)} />
  </>;
}}</Scene3D>;
