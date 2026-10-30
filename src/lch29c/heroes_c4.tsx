// lch29c · componentes únicos 22-27 (la luz que vuelve, los botones, el espejo bajo el borde, el conducto, la corteza, la plata contra la luz).
import React from "react";
import { H } from "./hkit";
import { M, RBox, Scene3D, cl, eio, lerp, phys, rn, tex } from "./h3d";
import { Cloth, Filter } from "./hood";

const PI = Math.PI;

// ---- 15:10 · LA COCINA SE OSCURECE CADA AÑO: el difusor amarillo de la luz; el trapo lo pasa y el cono de luz sobre la mesada vuelve ----
export const HLensClean: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="counter" wall="none" bg="#0f0e0c" key1={[0.4, 0.4, 0.6]}
  cam={{ at: [0, 0.2, 0], az: [0.4, 0.25], el: [-0.25, -0.15], r: [0.85, 0.74], fov: 34 }}>{(tt) => {
  const w = eio(tt, 1.0, 3.6), lum = lerp(0.25, 1, w);
  return <>
    {/* el borde de abajo de la campana con el difusor redondo */}
    <RBox s={[0.7, 0.04, 0.4]} p={[0, 0.42, 0]} r={0.01}>{M.steel()}</RBox>
    <mesh position={[0, 0.398, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.07, 40]} /><meshBasicMaterial color="#fff6dc" /></mesh>
    {/* la película amarilla de grasa sobre el difusor: el trapo la barre de izquierda a derecha */}
    <mesh position={[0.07 * w, 0.396, 0]} rotation={[PI / 2, 0, 0]} scale={[Math.max(0.01, 1 - w), 1, 1]}><circleGeometry args={[0.072, 40]} /><meshBasicMaterial color="#8a6420" transparent opacity={0.82} /></mesh>
    {w > 0.02 && w < 0.98 && <group position={[lerp(-0.08, 0.08, w), 0.38, 0]} rotation={[PI, 0, 0]}><Cloth w={0.08} d={0.06} dirt={w} /></group>}
    <pointLight position={[0, 0.37, 0]} intensity={lum * 2.4} distance={1.2} color={w > 0.5 ? "#fff3d6" : "#e2b870"} />
    {/* lo que alumbra en la mesada: tabla, tomate, cuchillo */}
    <RBox s={[0.3, 0.02, 0.18]} p={[0, 0.01, 0.02]} r={0.01}>{M.wood()}</RBox>
    <mesh position={[0.05, 0.05, 0.02]}><sphereGeometry args={[0.035, 24, 16]} /><meshStandardMaterial color="#c7321f" roughness={0.35} /></mesh>
    <RBox s={[0.16, 0.004, 0.025]} p={[-0.06, 0.024, 0.05]} r={0.002}>{M.chrome()}</RBox>
  </>;
}}</Scene3D>;

// ---- 15:55 · NUNCA ROCIAR LOS BOTONES: el chorro sobre el botón se mete por la rendija (cruz roja); el rociado sobre el trapo, y el trapo al botón (tilde) ----
export const HButtonSpray: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#121110"
  cam={{ at: [0, 0.02, 0], az: [0.0, 0.05], el: [0.18, 0.24], r: [0.85, 0.78], fov: 30 }}>{(tt) => {
  const s1 = cl((tt - 0.4) / 1.4), drip = eio(tt, 1.2, 2.6), s2 = cl((tt - 2.8) / 0.8), wipe = eio(tt, 3.6, 4.8);
  const panel = (x: number) => <group position={[x, 0, 0]}>
    <RBox s={[0.26, 0.12, 0.02]} p={[0, 0, -0.01]} r={0.008}>{M.steel()}</RBox>
    {[-0.07, 0, 0.07].map((bx, i) => <group key={i} position={[bx, 0, 0.004]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.022, 0.022, 0.008, 28]} />{M.plastic({ col: "#2a2a2c" })}</mesh>
      <mesh position={[0, 0, 0.0005]} rotation={[PI / 2, 0, 0]}><torusGeometry args={[0.023, 0.0016, 8, 32]} /><meshStandardMaterial color="#090909" /></mesh>
    </group>)}
  </group>;
  return <>
    {panel(-0.17)}
    {panel(0.17)}
    {/* izquierda: el chorro de la botella va directo al botón y el líquido entra por la rendija */}
    {Array.from({ length: 16 }, (_, i) => { const ph = (s1 * 3 + rn(i, 2)) % 1; return s1 > 0 && s1 < 1 && <mesh key={i} position={[-0.17 + lerp(-0.25, 0, ph), 0.02 * (rn(i, 3) - 0.5), lerp(0.25, 0.01, ph)]}><sphereGeometry args={[0.004, 6, 5]} /><meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.7} roughness={0} /></mesh>; })}
    {drip > 0 && <mesh position={[-0.17, -0.02 - 0.03 * drip, 0.006]} scale={[1, 1 + 2 * drip, 1]}><sphereGeometry args={[0.006, 12, 8]} /><meshPhysicalMaterial color="#cfe6ff" transparent opacity={0.8} roughness={0} /></mesh>}
    {drip > 0.5 && <group position={[-0.17, 0.1, 0.02]} scale={eio(tt, 2.2, 2.6)}>
      <RBox s={[0.07, 0.012, 0.004]} rot={[0, 0, PI / 4]} r={0.003}><meshBasicMaterial color="#d23a2a" /></RBox>
      <RBox s={[0.07, 0.012, 0.004]} rot={[0, 0, -PI / 4]} r={0.003}><meshBasicMaterial color="#d23a2a" /></RBox>
    </group>}
    {/* derecha: se rocía el trapo y el trapo húmedo limpia el botón */}
    <group position={[0.17 + lerp(0.2, 0, wipe) + 0.02 * Math.sin(tt * 8) * (wipe > 0 && wipe < 1 ? 1 : 0), lerp(0.12, 0.0, wipe), 0.025]} rotation={[PI / 2, 0, 0]}><Cloth w={0.07} d={0.05} col={s2 > 0.5 ? "#d6dccf" : "#e9e4d6"} /></group>
    {wipe > 0.9 && <group position={[0.17, 0.1, 0.02]} scale={eio(tt, 4.6, 5.0)}>
      <RBox s={[0.03, 0.012, 0.004]} p={[-0.015, -0.008, 0]} rot={[0, 0, -PI / 4]} r={0.003}><meshBasicMaterial color="#3fae4a" /></RBox>
      <RBox s={[0.06, 0.012, 0.004]} p={[0.012, 0.004, 0]} rot={[0, 0, PI / 3.2]} r={0.003}><meshBasicMaterial color="#3fae4a" /></RBox>
    </group>}
  </>;
}}</Scene3D>;

// el reflejo: la cara de abajo vista en el espejo, acero con gotas marrones
const reflTex = () => tex.text("refl", 256, 256, (g) => { g.fillStyle = "#a9adb1"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${100 + 30 * rn(i, 2)},${60 + 20 * rn(i, 3)},20,0.9)`; g.beginPath(); g.ellipse(rn(i, 4) * 256, rn(i, 5) * 256, 4 + 7 * rn(i, 6), 3 + 5 * rn(i, 7), 0, 0, PI * 2); g.fill(); } g.fillStyle = "rgba(90,58,22,0.35)"; g.fillRect(0, 0, 256, 256); });

// ---- 16:40 · MIRAR HACIA ARRIBA ADENTRO: el espejito de mano bajo el borde muestra la cara de abajo, la que nadie ve, llena de gotas marrones ----
export const HMirrorLip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="drop" floor="none" wall="dark" bg="#121110"
  cam={{ at: [0, 0.3, 0.05], az: [0.35, 0.2], el: [-0.05, 0.05], r: [0.8, 0.68], fov: 32 }}>{(tt) => {
  const tilt = eio(tt, 0.8, 2.4), rise = phys(tt, 0.2, 6, 0.5);
  return <>
    <RBox s={[0.7, 0.05, 0.36]} p={[0, 0.45, 0]} r={0.01}>{M.steel()}</RBox>
    {/* la cara de abajo del borde: gotas de grasa colgando */}
    {Array.from({ length: 30 }, (_, i) => <mesh key={i} position={[-0.32 + rn(i, 2) * 0.64, 0.42 - 0.006 * rn(i, 3), -0.15 + rn(i, 4) * 0.3]} scale={[1, 1.6, 1]}><sphereGeometry args={[0.006 + 0.004 * rn(i, 5), 10, 8]} />{M.grease({ col: "#7a4f1c" })}</mesh>)}
    {/* el espejito con mango, que sube y se inclina para mostrar el reflejo */}
    <group position={[0.02, lerp(0.05, 0.3, cl(rise)), 0.12]} rotation={[lerp(0, -1.0, tilt), 0, 0]}>
      <mesh rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.008, 40]} />{M.plastic({ col: "#d9b9c6" })}</mesh>
      <mesh position={[0, 0.0045, 0]} rotation={[-PI / 2, 0, 0]}><circleGeometry args={[0.064, 40]} /><meshBasicMaterial map={reflTex()} /></mesh>
      <mesh position={[0, -0.0045, 0]} rotation={[PI / 2, 0, 0]}><circleGeometry args={[0.064, 40]} /><meshBasicMaterial map={reflTex()} /></mesh>
      <mesh position={[0, 0, 0.12]} rotation={[PI / 2, 0, 0]}><cylinderGeometry args={[0.009, 0.011, 0.12, 14]} />{M.plastic({ col: "#d9b9c6" })}</mesh>
    </group>
    <pointLight position={[0, 0.2, 0.4]} intensity={0.5} distance={1.2} />
  </>;
}}</Scene3D>;

// ---- 17:30 · ASÍ SE ESPARCE EL FUEGO: corte del conducto; la pared por dentro marrón, la llama baja de la hornalla sube por la grasa ----
export const HDuctGrease: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="wipe" floor="none" wall="dark" bg="#0e0c0b" key1={[-0.8, 0.6, 1.0]}
  cam={{ at: [0, 0.55, 0], az: [0.15, 0.05], el: [0.05, 0.1], r: [1.9, 1.7], fov: 34 }}>{(tt) => {
  const up = eio(tt, 1.2, 4.6);
  return <>
    <RBox s={[0.6, 0.06, 0.4]} p={[0, 0.36, 0]} r={0.01}>{M.steel()}</RBox>
    <group position={[0, 0.05, 0]}><mesh><cylinderGeometry args={[0.12, 0.1, 0.04, 32]} /><meshStandardMaterial color="#1b1b1c" metalness={0.6} roughness={0.5} /></mesh></group>
    {/* conducto en corte: media caña con la grasa pegada por dentro */}
    <group position={[0, 0.75, -0.05]}>
      <mesh><cylinderGeometry args={[0.1, 0.1, 0.7, 32, 1, true, PI / 2, PI]} /><meshStandardMaterial color="#9ea2a6" metalness={0.8} roughness={0.35} side={2} /></mesh>
      <mesh scale={0.97}><cylinderGeometry args={[0.1, 0.1, 0.7, 32, 1, true, PI / 2, PI]} /><meshStandardMaterial color="#5a3a16" roughness={0.5} side={1} /></mesh>
    </group>
    {/* la llama que sube por adentro: altura crece lento, sin parpadeo (≤2 Hz) */}
    {Array.from({ length: 10 }, (_, i) => { const y = 0.1 + i * 0.1, on = cl((up * 10 - i) * 0.9); return on > 0 && <mesh key={i} position={[0.01 * Math.sin(tt * 2 + i), y, -0.1]} scale={[on * (1 - i * 0.04), on * 1.6, on * 0.6]}>
      <sphereGeometry args={[0.045, 16, 12]} /><meshBasicMaterial color={i < 3 ? "#ffb23a" : "#ff7a1e"} transparent opacity={0.75} /></mesh>; })}
    <pointLight position={[0, 0.4 + 0.5 * up, 0]} intensity={up * 3} distance={1.4} color="#ff8a2a" />
  </>;
}}</Scene3D>;

// ---- 18:50 · COMO CORTEZA DE ÁRBOL: el filtro de Marjorie de canto; la costra en capas gruesas, agrietada, con relieve ----
const barkTex = () => tex.text("bark", 512, 512, (g) => { g.fillStyle = "#4a2e12"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 260; i++) { const x = rn(i, 2) * 512, y = rn(i, 3) * 512; g.fillStyle = `rgba(${90 + 60 * rn(i, 4)},${55 + 35 * rn(i, 5)},20,0.7)`; g.beginPath(); g.ellipse(x, y, 10 + 30 * rn(i, 6), 4 + 8 * rn(i, 7), 0.2 * rn(i, 8), 0, PI * 2); g.fill(); } g.strokeStyle = "#1c1006"; g.lineWidth = 3; for (let i = 0; i < 40; i++) { g.beginPath(); const x = rn(i, 9) * 512; g.moveTo(x, 0); for (let y = 0; y < 512; y += 32) g.lineTo(x + 18 * Math.sin(y * 0.05 + i), y); g.stroke(); } });
export const HBarkFilter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="iris" floor="wood" wall="none" bg="#151210"
  cam={{ at: [0, 0.03, 0], az: [0.7, 0.35], el: [0.25, 0.35], r: [0.55, 0.45], fov: 30 }}>{(tt) => {
  const z = eio(tt, 0.3, 4.5);
  return <>
    <group position={[0, 0.02, 0]}><Filter dirt={1} dark={0.4} /></group>
    {/* la costra encima, con relieve que se lee como corteza */}
    <mesh position={[0, 0.034 + 0.004 * z, 0]} rotation={[-PI / 2, 0, 0]}><planeGeometry args={[0.35, 0.23, 60, 40]} /><meshStandardMaterial map={barkTex()} bumpMap={barkTex()} bumpScale={4} roughness={0.75} /></mesh>
    {/* el borde de la costra: escamas levantadas */}
    {Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[-0.17 + i * 0.02, 0.04, 0.115]} rotation={[-0.6 - 0.4 * rn(i, 2), 0, 0]}><boxGeometry args={[0.018, 0.012 + 0.008 * rn(i, 3), 0.003]} /><meshStandardMaterial color="#3d250d" roughness={0.8} /></mesh>)}
  </>;
}}</Scene3D>;

// ---- 19:40 · SE VEÍA LA LUZ POR CADA CAPA: el mismo filtro contra la ventana, plateado; un sol atrás atraviesa la malla ----
export const HLentSilver: React.FC<{ t: number; h: H }> = ({ t, h }) => <Scene3D t={t} h={h} mode="split" floor="none" wall="none" bg="#0f0f10"
  cam={{ at: [0, 0.2, 0], az: [0.0, 0.12], el: [0.02, 0.06], r: [0.75, 0.62], fov: 32 }}>{(tt) => {
  const up = cl(phys(tt, 0.3, 6, 0.55)), sun = eio(tt, 1.2, 3.2);
  return <>
    {/* ventana atrás con luz */}
    <mesh position={[0, 0.25, -0.35]}><planeGeometry args={[0.9, 0.6]} /><meshBasicMaterial color="#f6ead0" transparent opacity={0.25 + 0.4 * sun} /></mesh>
    {[-0.45, 0, 0.45].map((x, i) => <RBox key={i} s={[0.03, 0.62, 0.03]} p={[x, 0.25, -0.33]} r={0.004}><meshStandardMaterial color="#e8e2d4" /></RBox>)}
    <pointLight position={[0, 0.25, -0.2]} intensity={1.2 * sun} distance={1.4} color="#fff3d6" />
    {/* el filtro levantado contra la luz, inclinado hacia la cámara */}
    <group position={[0, lerp(0.05, 0.25, up), 0]} rotation={[PI / 2 - 0.15, 0, 0.04 * Math.sin(tt * 0.9)]}><Filter dirt={0} /></group>
  </>;
}}</Scene3D>;
