// mar11a · componentes únicos 18-33 y los dos CTA del manual (kit r3k). Registro: D:/rtmp/mar11_COMPONENTES.md
// vuelta 2 (EVALUADOR v1): sin manos de maniquí, sin rótulos chicos, el número vive EN el objeto, cada plano tiene su acción entera
import React from "react";
import * as THREE from "three";
import { BOLD, Bx, Cy, D2R, HANDF, MONO, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win, env, Env } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { ManualCTA } from "./book3d";
import { Bench, BrickWall, FrostGround, Gutter, HPU, LEAFC, Leaf, U, bump, cum, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";

const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const PaperWall: React.FC<{ c?: string; z?: number }> = ({ c = "#efe6d6", z = -0.2 }) => <PhotoWall w={4} h={3} z={z} y={1.0} name="t_pared.jpg" tint={c} />;
env(PaperWall);

// 18 · el camión de bomberos: de noche, la unidad larga una columna de vapor enorme iluminada desde abajo; entra el camión y las balizas
// rojas y azules barren el asfalto mojado, el ladrillo y el vapor
export const MFiretruck: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tr = win(u, 0.22, 0.62), bA = Math.max(0, Math.sin(tt * 9)), bB = Math.max(0, Math.sin(tt * 9 + Math.PI)), lit = tr > 0.05 ? 1 : 0;
  const tx = lerp(4.2, 1.35, tr);
  return <S3 p={lv([1.2, 1.1, 3.9], [0.9, 1.0, 3.3], win(u, 0, 1))} l={[0.2, 0.9, 0]} fov={42} floor={null} warm="#6d7ca8" exp={0.75}>
    <PhotoGround w={9} d={6} name="t_concreto.jpg" rep={1.5} tint="#4a4e55" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.5]}><planeGeometry args={[9, 4]} /><meshStandardMaterial color="#0d0f12" roughness={0.08} metalness={0.85} transparent opacity={0.55} /></mesh>
    <BrickWall w={9} h={3.2} z={-1.0} />
    <Bx s={[0.6, 0.8, 0.04]} p={[-1.6, 1.5, -0.93]} c="#ffcf7a" e="#ffb84a" ei={1.4} />
    <HPU s={1.3} p={[-0.6, 0, -0.4]} fan={0} frost={0.4} />
    <pointLight position={[-0.6, 0.15, 0.2]} intensity={2.2} distance={3} color="#ffc98a" />
    {Array.from({ length: 22 }, (_, i) => { const f = (tt * 0.2 + i / 22) % 1; return <Puff key={i} p={[-0.6 + (rnd(i) - 0.5) * 0.4 + f * 0.5, 0.95 + f * 2.2, -0.4 + (rnd(i, 2) - 0.5) * 0.3]} s={0.45 + f * 1.4} c="#e6ebf2" o={0.55 * Math.sin(f * Math.PI)} add={false} />; })}
    {lit > 0 && <><pointLight position={[tx - 0.55, 1.05, 0.5]} intensity={9 * bA} distance={6} color="#ff2a2a" /><pointLight position={[tx - 0.55, 1.05, 0.5]} intensity={9 * bB} distance={6} color="#2a5aff" /></>}
    <group position={[tx, 0, 0.6]} scale={0.62}>
      <Bx s={[2.4, 0.8, 0.86]} p={[0.2, 0.62, 0]} c="#b81818" ro={0.3} m={0.35} rad={0.05} />
      <Bx s={[0.8, 0.7, 0.84]} p={[-1.25, 0.95, 0]} c="#c41f1f" ro={0.3} m={0.35} rad={0.06} />
      <Bx s={[0.02, 0.36, 0.7]} p={[-1.66, 1.08, 0]} c="#0f1a26" ro={0.05} m={0.8} />
      <Bx s={[0.5, 0.36, 0.02]} p={[-1.25, 1.08, 0.43]} c="#0f1a26" ro={0.05} m={0.8} />
      {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.03, 0.08, 0.6]} p={[-0.4 + i * 0.2, 1.12, 0]} c="#c9ced4" m={0.85} ro={0.25} />)}
      {[-0.3, 0.3].map((z) => <Bx key={z} s={[1.9, 0.04, 0.04]} p={[0.4, 1.16, z]} c="#c9ced4" m={0.85} ro={0.25} />)}
      <Bx s={[2.4, 0.06, 0.88]} p={[0.2, 0.3, 0]} c="#e9e9e9" m={0.7} ro={0.3} />
      <Bx s={[0.5, 0.08, 0.2]} p={[-1.25, 1.35, -0.2]} c="#ff2a2a" e="#ff2a2a" ei={4 * bA} />
      <Bx s={[0.5, 0.08, 0.2]} p={[-1.25, 1.35, 0.2]} c="#2a5aff" e="#2a5aff" ei={4 * bB} />
      {[-0.95, 0.9].map((x) => [-0.44, 0.44].map((z) => <Cy key={`${x}${z}`} rt={0.24} h={0.16} p={[x, 0.24, z]} r={[Math.PI / 2, 0, 0]} c="#141414" ro={0.8} />))}
      <Bx s={[0.06, 0.12, 0.3]} p={[-1.66, 0.55, 0.28]} c="#fff6d8" e="#fff6d8" ei={2.5} />
    </group>
  </S3>;
}}</Stage>;

// 19 · el reloj de arena: un reloj de arena grande delante de la unidad quieta; cae el último grano, el ventilador arranca borroso y la ráfaga levanta las hojas
export const MHourglass: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), s = win(u, 0.04, 0.46), D = h.out - h.at, go = win(u, 0.47, 0.55);
  const fan = 22 * D * cum((x) => win(x, 0.47, 0.55), u);
  return <S3 zk={1.25} p={[0.155, 0.948, 2.295]} l={[-0.1, 0.65, 0]} fov={38} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-1.0} />
    <HPU s={1.3} p={[0.15, 0, -0.45]} fan={fan} frost={0.6 * (1 - go)} />
    {go > 0.3 && <mesh position={[0.15, 0.845, -0.45]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.31, 40]} /><meshStandardMaterial color="#3a3d42" transparent opacity={0.55 * go} roughness={0.6} /></mesh>}
    <group position={[-0.55, 0, 0.45]} scale={1.55}>
      <Cy rt={0.2} h={0.04} p={[0, 0.02, 0]} c="#6a3e22" ro={0.55} /><Cy rt={0.2} h={0.04} p={[0, 0.9, 0]} c="#6a3e22" ro={0.55} />
      {[0, 1, 2].map((i) => <Cy key={i} rt={0.014} h={0.86} p={[Math.cos(i * 2.1) * 0.17, 0.46, Math.sin(i * 2.1) * 0.17]} c="#6a3e22" ro={0.55} />)}
      <Cy rt={0.14} rb={0.02} h={0.4} p={[0, 0.66, 0]} c="#eef6fb" o={0.22} ro={0.02} m={0.3} />
      <Cy rt={0.02} rb={0.14} h={0.4} p={[0, 0.26, 0]} c="#eef6fb" o={0.22} ro={0.02} m={0.3} />
      {s < 1 && <Cy rt={0.125 * (1 - s) + 0.018} rb={0.018} h={0.34 * (1 - s) + 0.01} p={[0, 0.47 + 0.17 * (1 - s), 0]} c="#d8b06a" ro={0.9} />}
      {s > 0 && s < 1 && <Cy rt={0.005} h={0.36} p={[0, 0.3, 0]} c="#d8b06a" ro={0.9} />}
      {s > 0 && <Cy rt={0.02 + 0.11 * s} rb={0.13} h={0.04 + 0.16 * s} p={[0, 0.06 + 0.08 * s, 0]} c="#d8b06a" ro={0.9} />}
    </group>
    {go > 0 && Array.from({ length: 34 }, (_, i) => { const f = cl((u - 0.5 - rnd(i) * 0.08) / 0.3); return f > 0 ? <Leaf key={i} p={[0.15 + (rnd(i, 2) - 0.5) * 0.8 - f * 0.9, 0.05 + f * 0.9 * (0.5 + rnd(i, 3)), -0.1 + (rnd(i, 4) - 0.2) * 0.8 + f * 0.5]} r={[tt * 6 + i, tt * 4, i]} s={1.4} c={LEAFC[i % 5]} /> : null; })}
    {go > 0 && Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.7 + i / 6) % 1; return <Puff key={i} p={[0.15 + (rnd(i) - 0.5) * 0.3, 1.0 + f * 1.0, -0.45]} s={0.3 + f * 0.6} c="#f1f5f9" o={0.4 * go * Math.sin(f * Math.PI)} add={false} />; })}
  </S3>;
}}</Stage>;

// 20 · el calibre: un calibre digital de acero cierra sobre UNA aleta (pantalla grande: 0.08 mm) y después sobre la pared de una lata (0.10 mm)
const segTex = (s: string) => canvasTex(`seg11|${s}`, 512, 160, (g) => { g.fillStyle = "#9fae8f"; g.fillRect(0, 0, 512, 160); g.fillStyle = "#14180f"; g.font = "bold 120px 'DSEG7 Classic', 'Courier New', monospace"; g.textAlign = "right"; g.fillText(s, 400, 128); g.font = BOLD(46); g.textAlign = "left"; g.fillText("mm", 410, 128); });
export const MCaliper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = win(u, 0.06, 0.28), mv = win(u, 0.4, 0.56), b = win(u, 0.58, 0.8);
  const gap = mv < 0.01 ? lerp(0.12, 0.004, a) : mv < 0.99 ? lerp(0.004, 0.12, Math.sin(mv * Math.PI)) : lerp(0.12, 0.005, b);
  const read = mv < 0.01 ? (a > 0.98 ? "0.08" : (0.08 + gap * 12).toFixed(2)) : mv < 0.99 ? (0.08 + gap * 12).toFixed(2) : (b > 0.98 ? "0.10" : (0.10 + gap * 12).toFixed(2));
  const cx = lerp(-0.32, 0.32, mv);
  return <S3 p={lv([cx + 0.15, 0.48, 0.78], [cx + 0.1, 0.42, 0.6], win(u, 0, 1))} l={[cx + 0.08, 0.3, 0]} fov={36} floor={null}>
    <Bench />
    <group position={[-0.32, 0, -0.05]}>
      <Bx s={[0.16, 0.26, 0.2]} p={[0, 0.13, -0.08]} c="#9ea3a8" m={0.4} ro={0.45} />
      {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.0025, 0.26, 0.14]} p={[-0.06 + i * 0.015, 0.13, 0.02]} c="#c9ced3" m={0.85} ro={0.25} ns />)}
    </group>
    <group position={[0.32, 0, -0.05]}><Cy rt={0.06} h={0.2} p={[0, 0.1, 0]} c="#c3352a" m={0.7} ro={0.3} open /><Cy rt={0.06} h={0.2} p={[0, 0.1, 0]} c="#e2e2e2" m={0.9} ro={0.2} sc={[0.97, 1, 0.97]} open />
      <Cy rt={0.058} h={0.01} p={[0, 0.2, 0]} c="#d9d9d9" m={0.9} ro={0.2} /></group>
    <group position={[cx, 0.26, 0.04]}>
      <Bx s={[0.62, 0.05, 0.012]} p={[0.27, 0.14, 0]} c="#c9ccd0" m={0.9} ro={0.18} />
      <Bx s={[0.024, 0.22, 0.012]} p={[-gap / 2 - 0.012, 0.02, 0]} c="#c9ccd0" m={0.9} ro={0.18} />
      <Bx s={[0.024, 0.22, 0.012]} p={[gap / 2 + 0.012, 0.02, 0]} c="#c9ccd0" m={0.9} ro={0.18} />
      <Bx s={[0.26, 0.12, 0.034]} p={[gap / 2 + 0.17, 0.14, 0.014]} c="#1d1f22" ro={0.4} rad={0.012} />
      <Pl w={0.21} h={0.066} p={[gap / 2 + 0.17, 0.15, 0.032]} map={segTex(read)} c="#ffffff" ro={0.3} ns />
    </group>
  </S3>;
}}</Stage>;

// 21 · la pava: el agua hirviendo cae con vapor sobre la rejilla de plástico de arriba, la raja se dibuja sola con astillas, y el hielo vuelve a crecer en medio segundo
export const MKettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tip = win(u, 0.06, 0.2) * (1 - win(u, 0.55, 0.65)), pour = win(u, 0.16, 0.24) * (1 - win(u, 0.5, 0.56)), cr = win(u, 0.34, 0.5), rf = win(u, 0.62, 0.7);
  const crack = canvasTex(`crack11b|${Math.round(cr * 12)}`, 512, 512, (g) => { g.clearRect(0, 0, 512, 512); g.strokeStyle = "#0a0a0a"; g.lineCap = "round";
    for (let i = 0; i < 6; i++) { let x = 256, y = 256; g.lineWidth = 9; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 6 * cr; j++) { const a = i * 1.05 + (rnd(i * 9 + j) - 0.5) * 0.9; x += Math.cos(a) * 36; y += Math.sin(a) * 36; g.lineTo(x, y); g.lineWidth = 9 - j; } g.stroke(); } });
  return <S3 p={lv([0.55, 1.6, 1.25], [0.4, 1.45, 0.95], win(u, 0, 1))} l={[0, 0.85, 0]} fov={38} floor={null}>
    <PhotoGround w={6} d={5} name="t_concreto.jpg" rep={1.4} /><BrickWall w={6} h={3} z={-0.9} />
    <HPU s={1.3} ice={0.3 * (1 - pour * 0.8) + 0.3 * rf} frost={0.5 + 0.5 * rf} />
    <Cy rt={0.33} h={0.025} p={[0, 0.85, 0]} c="#1e1f22" ro={0.55} />
    {Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.62, 0.012, 0.02]} p={[0, 0.865, -0.28 + i * 0.07]} c="#2b2c30" ro={0.5} />)}
    {cr > 0 && <Pl w={0.62} h={0.62} p={[0, 0.875, 0]} r={[-Math.PI / 2, 0, 0]} map={crack} c="#ffffff" o={0.98} ns />}
    {cr > 0 && cr < 1 && Array.from({ length: 8 }, (_, i) => { const f = cr; return <Bx key={"c" + i} s={[0.02, 0.006, 0.014]} p={[Math.cos(i) * (0.05 + f * 0.25), 0.88 + Math.sin(f * Math.PI) * 0.12 * rnd(i), Math.sin(i * 1.7) * (0.05 + f * 0.2)]} r={[tt * 9, i, tt * 7]} c="#1e1f22" ns />; })}
    {rf > 0 && <Bx s={[0.6, 0.03 * rf, 0.6]} p={[0, 0.885, 0]} c="#e6f6ff" o={0.75 * rf} ro={0.05} m={0.2} />}
    <group position={[0.4, 1.35, 0.05]} rotation={[0, 0, tip * 0.9]}>
      <Cy rt={0.1} rb={0.13} h={0.18} c="#b7bcc2" m={0.85} ro={0.2} />
      <Cy rt={0.015} rb={0.025} h={0.16} p={[-0.14, 0.02, 0]} r={[0, 0, 1.0]} c="#b7bcc2" m={0.85} ro={0.2} />
      <To R={0.08} t={0.012} p={[0.04, 0.12, 0]} arc={Math.PI} c="#222" />
      {Array.from({ length: 5 }, (_, i) => { const f = (tt * 0.5 + i / 5) % 1; return <Puff key={i} p={[-0.2, 0.1 + f * 0.35, 0]} s={0.12 + f * 0.25} c="#ffffff" o={0.5 * Math.sin(f * Math.PI)} add={false} />; })}
    </group>
    {pour > 0 && <Tube pts={[[0.2, 1.3, 0.05], [0.14, 1.15, 0.04], [0.08, 0.98, 0.02], [0.06, 0.88, 0.0]]} rad={0.016 * pour} c="#d9eefc" o={0.75} ro={0.05} seg={16} />}
    {pour > 0 && Array.from({ length: 10 }, (_, i) => { const f = (tt * 0.6 + i / 10) % 1; return <Puff key={"s" + i} p={[0.06 + (rnd(i) - 0.5) * 0.3, 0.9 + f * 0.5, (rnd(i, 2) - 0.5) * 0.2]} s={0.18 + f * 0.35} c="#ffffff" o={0.55 * pour * Math.sin(f * Math.PI)} add={false} />; })}
    {pour > 0 && Array.from({ length: 8 }, (_, i) => { const f = (tt * 2 + i / 8) % 1; return <Sp key={"d" + i} rad={0.012} p={[0.06 + Math.cos(i * 0.8) * f * 0.25, 0.89 + Math.sin(f * Math.PI) * 0.08, Math.sin(i * 0.8) * f * 0.25]} c="#d9eefc" o={0.8 * pour} ns />; })}
  </S3>;
}}</Stage>;

// 22 · las dos cuestas: una bola de acero sube la loma de 2° (escala tallada al costado); en la de 6° se clava a mitad y la resistencia de abajo se pone al rojo y alumbra la cuesta
const scaleTex = (deg: number) => canvasTex(`hill11|${deg}`, 512, 256, (g) => { g.fillStyle = "#e9dcc2"; g.beginPath(); g.moveTo(0, 256); g.arc(0, 256, 250, -Math.PI / 2, 0); g.fill(); g.strokeStyle = "#3a2e1e"; g.lineWidth = 4;
  for (let d = 0; d <= 10; d++) { const a = -d * 0.12; g.beginPath(); g.moveTo(Math.cos(a) * 200, 256 + Math.sin(a) * 200); g.lineTo(Math.cos(a) * 245, 256 + Math.sin(a) * 245); g.stroke(); }
  g.fillStyle = "#3a2e1e"; g.font = BOLD(120); g.fillText(`${deg}°`, 40, 220); });
export const MHillclimb: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.08, 0.5), ign = win(u, 0.5, 0.66), k2 = Math.min(win(u, 0.08, 0.5), 0.45) + 0.55 * win(u, 0.66, 0.95);
  const Hill: React.FC<{ z: number; deg: number; kk: number; strips: boolean }> = ({ z, deg, kk, strips }) => { const a = deg * D2R * 3, L = 1.15;
    const bx = -0.55 + L * kk * Math.cos(a), by = L * kk * Math.sin(a);
    return <group position={[z, 0, -0.2]}>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow><extrudeGeometry args={[new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(L * Math.cos(a), 0), new THREE.Vector2(L * Math.cos(a), L * Math.sin(a))]), { depth: 0.36, bevelEnabled: false }]} /><meshStandardMaterial color={strips ? "#8a6a48" : "#9a7c56"} roughness={0.85} /></mesh>
      <Pl w={0.56} h={0.28} p={[0.2, -0.17, 0.37]} map={scaleTex(deg)} c="#ffffff" ro={0.8} ns />
      <Sp rad={0.1} p={[bx, by + 0.1, 0.18]} c="#d8dde2" m={0.95} ro={0.12} />
      {strips && <group position={[-0.25, 0.08, 0.42]}>{[0, 1, 2, 3, 4].map((i) => <To key={i} R={0.05} t={0.012} p={[i * 0.12, 0, 0]} r={[0, Math.PI / 2, 0]} c={mixc("#555", "#ff4a1a", ign)} e={ign > 0.05 ? "#ff3a10" : undefined} ei={ign * 3} ro={0.4} />)}
        {ign > 0.05 && <pointLight position={[0.25, 0.25, 0.1]} intensity={3 * ign} distance={2} color="#ff5a20" />}</group>}
    </group>; };
  return <S3 p={lv([0.0, 0.95, 2.9], [0.0, 0.85, 2.55], win(u, 0, 1))} l={[0, 0.22, 0]} fov={40} floor={null}>
    <Bench w={4.4} d={3} />
    <Hill z={-0.68} deg={2} kk={k} strips={false} />
    <Hill z={0.68} deg={6} kk={k2} strips />
  </S3>;
}}</Stage>;

// 23 · el semáforo de las llamadas: semáforo de chapa negra con lentes de vidrio; cada luz que se prende ilumina su objeto real: un bloque de hielo, un ventilador quieto, el termostato en EM HEAT
export const MTraffic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), L = [win(u, 0.08, 0.12), win(u, 0.36, 0.4), win(u, 0.64, 0.68)];
  const Lens: React.FC<{ y: number; on: number; col: string }> = ({ y, on, col }) => <group position={[0, y, 0.14]}>
    <To R={0.13} t={0.02} c="#121314" ro={0.4} />
    <Bx s={[0.32, 0.03, 0.18]} p={[0, 0.14, 0.06]} r={[0.3, 0, 0]} c="#141516" ro={0.5} />
    <Sp rad={0.12} sc={[1, 1, 0.35]} c={mixc("#1a1614", col, on)} e={on > 0.05 ? col : undefined} ei={on * 3.5} ro={0.08} m={0.2} />
    {on > 0.05 && <pointLight position={[0.45, 0, 0.35]} intensity={4 * on} distance={1.8} color={col} />}
  </group>;
  return <S3 p={lv([0.15, 1.45, 2.05], [0.1, 1.42, 1.75], win(u, 0, 1))} l={[0.05, 1.42, 0]} fov={38} floor={null}>
    <PaperWall c="#d9cfbf" z={-0.5} />
    <Cy rt={0.045} h={1.2} p={[-0.3, 0.4, -0.1]} c="#1b1c1e" m={0.5} ro={0.4} />
    <Bx s={[0.38, 1.05, 0.28]} p={[-0.3, 1.42, 0]} c="#1b1c1e" ro={0.35} m={0.5} rad={0.03} />
    <group position={[-0.3, 0, 0]}>{[1.76, 1.42, 1.08].map((y, i) => <Lens key={i} y={y} on={L[i]} col={["#ff3a2a", "#ffb21f", "#ff3a2a"][i]} />)}</group>
    <group position={[0.42, 1.76, 0.1]} scale={(0.6 + 0.4 * L[0]) * 1.35}><Bx s={[0.26, 0.26, 0.26]} c="#e6f6ff" o={0.85} ro={0.05} m={0.2} /><Bx s={[0.2, 0.2, 0.2]} c="#bfe2f6" o={0.6} /></group>
    <group position={[0.42, 1.42, 0.1]} scale={(0.6 + 0.4 * L[1]) * 1.35}><Cy rt={0.16} h={0.03} r={[Math.PI / 2, 0, 0]} c="#2a2c30" ro={0.5} />{[0, 1, 2].map((i) => <Bx key={i} s={[0.14, 0.04, 0.01]} p={[0.07 * Math.cos(i * 2.09), 0.07 * Math.sin(i * 2.09), 0.02]} r={[0, 0, i * 2.09 + Math.sin(tt * 60) * 0.02 * L[1]]} c="#666" />)}</group>
    <group position={[0.42, 1.08, 0.1]} scale={(0.6 + 0.4 * L[2]) * 1.35}><Bx s={[0.34, 0.24, 0.05]} c="#efe9da" ro={0.5} rad={0.03} /><Bx s={[0.24, 0.1, 0.01]} p={[0, 0.02, 0.03]} c="#2a0d08" /><Txt t="EM HEAT" w={0.23} c="#ff6a3a" e={2} px={200} p={[0, 0.02, 0.036]} /></group>
  </S3>;
}}</Stage>;

// 24 · el capacitor: un destornillador de mango amarillo se acerca solo a los bornes; al tocar, fogonazo azul que ilumina todo, chispas, y el destornillador sale despedido
export const MCapspark: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ap = win(u, 0.06, 0.42), hit = u > 0.42 ? 1 : 0, back = win(u, 0.44, 0.58), fl = hit * Math.exp(-(u - 0.42) * 9);
  const tipX = lerp(0.5, 0.0, ap) + back * 0.9;
  return <S3 p={lv([0.182, 0.689, 1.062], [0.114, 0.638, 0.85], win(u, 0, 1))} l={[0.08, 0.4, 0]} fov={36} floor={null} exp={1 + fl * 0.5}>
    <Bench />
    <Cy rt={0.1} h={0.42} p={[-0.12, 0.21, 0]} c="#c4c8cc" m={0.85} ro={0.22} />
    <Bx s={[0.14, 0.022, 0.06]} p={[-0.12, 0.43, 0]} c="#e9e9e9" ro={0.4} />
    {[-0.045, 0.045].map((x) => <Cy key={x} rt={0.014} h={0.05} p={[-0.12 + x, 0.465, 0]} c="#d9a441" m={0.8} ro={0.3} />)}
    <Bx s={[0.19, 0.13, 0.001]} p={[-0.12, 0.25, 0.101]} c="#d8302a" ro={0.5} />
    <group position={[tipX - 0.02, 0.5 + back * 0.05, 0]} rotation={[0, back * 1.2, Math.PI / 2 + 0.3 + back * 4.2]}>
      <Cy rt={0.011} h={0.24} p={[0, -0.12, 0]} c="#c9ccd0" m={0.95} ro={0.15} />
      <Cy rt={0.04} rb={0.034} h={0.2} p={[0, -0.34, 0]} c="#f2c21b" ro={0.35} />
      <Cy rt={0.018} h={0.04} p={[0, -0.22, 0]} c="#1d1d1f" ro={0.5} />
    </group>
    {fl > 0.02 && <><pointLight position={[-0.08, 0.5, 0.15]} intensity={14 * fl} distance={4} color="#9fd0ff" />
      <Puff p={[-0.08, 0.5, 0.05]} s={1.1 * fl + 0.2} c="#cfe6ff" o={0.6 * fl} /><Puff p={[-0.08, 0.5, 0.06]} s={0.5 * fl + 0.1} c="#ffffff" o={fl} />
      <Tube pts={Array.from({ length: 8 }, (_, i) => [lerp(-0.075, tipX - 0.03, i / 7), 0.49 + (i % 2 ? 1 : -1) * 0.02 * rnd(i + Math.floor(tt * 30)), 0] as V3)} rad={0.006} c="#e6f3ff" e="#9fd0ff" ei={5} seg={32} /></>}
    {hit > 0 && Array.from({ length: 18 }, (_, i) => { const f = cl((u - 0.42) * 6); const a = rnd(i) * Math.PI * 2, sp = 0.2 + rnd(i, 2) * 0.4; return f < 1 ? <Sp key={i} rad={0.006} p={[-0.08 + Math.cos(a) * sp * f, 0.5 + Math.abs(Math.sin(a)) * sp * f - f * f * 0.3, Math.sin(a * 1.3) * sp * f * 0.5]} c="#fff1b0" e="#ffcf4a" ei={4 * (1 - f)} ns /> : null; })}
  </S3>;
}}</Stage>;

// 25 · las dos vueltas: desde arriba, huellas de botas aparecen una por una y dan dos vueltas a la unidad; al pasar, un cono de luz enciende cada cosa que miraba Earl
const bootTex = () => canvasTex("boot11", 128, 256, (g) => { g.clearRect(0, 0, 128, 256); g.fillStyle = "rgba(30,22,12,1)"; g.beginPath(); g.ellipse(64, 80, 44, 70, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(64, 205, 36, 42, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(0,0,0,0)"; g.globalCompositeOperation = "destination-out"; for (let i = 0; i < 6; i++) g.fillRect(30, 30 + i * 18, 68, 6); });
export const MOrbit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.04, 0.92) * 2, R = 0.95, N = 18;
  const spots: [V3, number][] = [[[0, 0, -1.3], 0.15], [[1.3, 0, 0], 0.4], [[0, 0, 1.3], 0.65], [[-1.3, 0, 0], 0.9]];
  return <S3 p={[1.23, 1.758, 2.05]} l={[0, 0.2, 0]} fov={42} floor={null} exp={0.85}>
    <FrostGround w={10} d={10} pad={false} /><BrickWall w={10} z={-1.9} />
    <HPU s={1.2} frost={0.4} />
    {Array.from({ length: N * 2 }, (_, i) => { const f = i / N; if (f > k) return null; const a = f * Math.PI * 2 - Math.PI / 2, rr = R + (f >= 1 ? 0.2 : 0) + (i % 2 ? 0.06 : -0.06);
      return <Pl key={i} w={0.3} h={0.56} p={[Math.cos(a) * rr, 0.008 + i * 0.0001, Math.sin(a) * rr]} r={[-Math.PI / 2, 0, -a]} map={bootTex()} c="#ffffff" o={0.95} ns />; })}
    {spots.map(([p, at], i) => { const on = win(k % 1 + (k >= 1 ? 1 : 0), at, at + 0.08) ; return <group key={i}>
      {i === 0 && <Gutter p={[0, 0.15, -1.35]} w={0.7} />}
      {i === 1 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.3, 0.005, 0]}><circleGeometry args={[0.22, 32]} /><meshStandardMaterial color="#d8eefc" roughness={0.05} metalness={0.4} /></mesh>}
      {i === 2 && Array.from({ length: 14 }, (_, j) => <Leaf key={j} p={[(rnd(j) - 0.5) * 0.4, 0.01 + j * 0.003, 1.3 + (rnd(j, 2) - 0.5) * 0.3]} r={[-Math.PI / 2, 0, rnd(j, 3) * 6]} s={1.6} c={LEAFC[j % 5]} />)}
      {i === 3 && Array.from({ length: 4 }, (_, j) => { const f = (tt * 0.4 + j / 4) % 1; return <Puff key={j} p={[-1.3, 0.1 + f * 0.5, 0]} s={0.2 + f * 0.3} c="#f4f8fb" o={0.6 * Math.sin(f * Math.PI)} add={false} />; })}
      <spotLight position={[p[0], 1.8, p[2]]} angle={0.3} penumbra={0.5} intensity={60 * on} distance={3} color="#fff1d0" />
    </group>; })}
  </S3>;
}}</Stage>;

// 26 · el pinche de comandas: un pinche de acero pesado sobre el mostrador del taller; se clavan tres comandas amarillas: pasto, pasto, engranaje
const tick = (yard: boolean) => canvasTex(`tick11b|${yard}`, 256, 320, (g) => { g.fillStyle = "#f6d65a"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#3a2e10"; g.fillRect(20, 30, 216, 6);
  if (yard) { g.strokeStyle = "#2f7d4a"; g.lineWidth = 10; g.lineCap = "round"; g.lineWidth = 16; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(40 + i * 29, 290); g.quadraticCurveTo(35 + i * 29 + (i % 2 ? 14 : -14), 180, 50 + i * 29 + (i % 2 ? 24 : -18), 70 + (i % 3) * 18); g.stroke(); } g.fillStyle = "#2f7d4a"; g.fillRect(20, 282, 216, 18); }
  else { g.fillStyle = "#c3352a"; g.beginPath(); for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 90 : 118; g.lineTo(128 + Math.cos(a) * r, 175 + Math.sin(a) * r); } g.fill(); g.fillStyle = "#f6d65a"; g.beginPath(); g.arc(128, 175, 40, 0, 7); g.fill(); } });
export const MSpike: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  // vuelta 6: cámara de frente a la altura del mostrador; pinche grueso; cada comanda cae inclinada hacia cámara con un ícono enorme
  const u = U(tt, h), W = [true, true, false];
  return <S3 zk={1.38} p={lv([0.08, 0.62, 1.2], [0.05, 0.58, 1.02], u)} l={[0, 0.3, 0]} fov={38} floor={null}>
    <Bench /><PaperWall c="#d8ccb4" z={-0.55} />
    <group><Cy rt={0.17} h={0.06} p={[0, 0.03, 0]} c="#2a2c30" m={0.7} ro={0.3} seg={48} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.03, 0.002, 0.03]}><circleGeometry args={[0.19, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.4} depthWrite={false} /></mesh>
      <Cy rt={0.006} rb={0.032} h={0.56} p={[0, 0.34, 0]} c="#d6d9dc" m={0.95} ro={0.12} /></group>
    {W.map((y, i) => { const a0 = 0.1 + i * 0.22, d = drop(u, a0, a0 + 0.14), land = 0.1 + i * 0.075; if (d <= 0) return null;
      return <group key={i} position={[0, lerp(0.85, land, d), 0]} rotation={[-Math.PI / 2 + 0.75, 0, -0.35 + i * 0.35]}>
        <Bx s={[0.3, 0.36, 0.004]} p={[0, 0.05, 0]} c="#f6d65a" ro={0.85} ns />
        <Pl w={0.28} h={0.34} p={[0, 0.05, 0.003]} map={tick(y)} c="#ffffff" ro={0.85} ns />
      </group>; })}
    <pointLight position={[0.4, 0.9, 0.6]} intensity={1.2} distance={2.5} color="#ffe2c0" />
  </S3>;
}}</Stage>;

// 27 · los dos metrónomos: el verde, grande, va lento y su sombra barre la pared; el rojo, frenético, tiembla, se borronea y echa humo
export const MMetronome: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.04, 0.16), heat = win(u, 0.3, 0.9);
  const Met: React.FC<{ x: number; f: number; c: string; s: number; frantic: boolean }> = ({ x, f, c, s, frantic }) => { const sh = frantic ? (rnd(Math.floor(tt * 40)) - 0.5) * 0.006 * on : 0;
    return <group position={[x + sh, 0, 0]} scale={s}>
      <Cy rt={0.05} rb={0.18} h={0.5} seg={4} p={[0, 0.25, 0]} r={[0, Math.PI / 4, 0]} c={frantic ? mixc(c, "#3a1210", heat * 0.5) : c} ro={0.4} />
      {(frantic ? [0, 0.33, 0.66] : [0]).map((ph, j) => <group key={j} position={[0, 0.06, 0.1]} rotation={[0, 0, Math.sin(tt * f - ph) * 0.55 * on]}>
        <Bx s={[0.012, 0.42, 0.01]} p={[0, 0.21, 0]} c="#d9d9d9" m={0.8} ro={0.3} o={j ? 0.35 : 1} /><Bx s={[0.05, 0.04, 0.02]} p={[0, 0.3, 0]} c="#c9a24a" m={0.7} ro={0.3} o={j ? 0.35 : 1} /></group>)}
      {frantic && Array.from({ length: 6 }, (_, i) => { const g = (tt * 0.5 + i / 6) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.1, 0.5 + g * 0.5, 0]} s={0.08 + g * 0.2} c="#9a9a9a" o={0.5 * heat * Math.sin(g * Math.PI)} add={false} />; })}
    </group>; };
  return <S3 p={lv([0, 0.7, 1.6], [0, 0.65, 1.25], win(u, 0, 1))} l={[0, 0.35, 0]} fov={36} floor={null}>
    <Bench />
    <PaperWall z={-0.4} />
    <spotLight position={[-0.9, 0.9, 0.9]} angle={0.6} penumbra={0.4} intensity={10} distance={4} castShadow color="#fff0dc" />
    <Met x={-0.3} f={2.0} c="#3f7a52" s={1.3} frantic={false} />
    <Met x={0.4} f={26} c="#b0281f" s={0.9} frantic />
  </S3>;
}}</Stage>;

// 28 · la tarjeta de fichar: el reloj de fábrica se traga la tarjeta y la perfora con un golpe; en la grilla de 60 agujeros, más de la mitad queda con un sello grande YOU
const cardTex = (n: number) => canvasTex(`punch11b|${n}`, 512, 640, (g) => { g.fillStyle = "#f3e9c8"; g.fillRect(0, 0, 512, 640); g.fillStyle = "#3a2e1e"; g.font = BOLD(44); g.fillText("ONE HOUR", 30, 60);
  for (let i = 0; i < 60; i++) { const cx = 50 + (i % 6) * 82, cy = 120 + Math.floor(i / 6) * 50, on = i < n; g.fillStyle = on ? (i < 34 ? "#2f7d4a" : "#555") : "#d9cba4"; g.beginPath(); g.arc(cx, cy, 15, 0, 7); g.fill(); }
  if (n >= 34) { g.save(); g.translate(256, 300); g.rotate(-0.2); g.strokeStyle = "rgba(195,53,42,.92)"; g.lineWidth = 14; g.strokeRect(-170, -80, 340, 160); g.fillStyle = "rgba(195,53,42,.92)"; g.font = BOLD(150); g.textAlign = "center"; g.fillText("YOU", 0, 55); g.restore(); } });
export const MPunchcard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ins = win(u, 0.06, 0.24), pun = bump(u, 0.26, 50, 18), out = win(u, 0.3, 0.46), n = Math.floor(win(u, 0.46, 0.85) * 34) + (u > 0.88 ? 0 : 0), stamp = win(u, 0.86, 0.9);
  const cy = 0.92 + 0.26 * (1 - ins) - 0.26 * out * 0;
  return <S3 p={lv([0.2, 1.1, 1.65], [0.1, 1.0, 1.2], win(u, 0, 1))} l={[0, 0.98, 0]} fov={36} floor={null} warm="#ffe6c8">
    <PaperWall c="#d8ccb4" />
    <Bx s={[0.52, 0.44, 0.3]} p={[-0.3, 1.32, -0.04]} c="#5a5e64" m={0.55} ro={0.35} rad={0.04} />
    <Cy rt={0.12} h={0.02} p={[-0.3, 1.38, 0.12]} r={[Math.PI / 2, 0, 0]} c="#f1ede4" />
    <Bx s={[0.008, 0.09, 0.004]} p={[-0.3, 1.41, 0.135]} r={[0, 0, -tt * 0.8]} c="#111" />
    <Bx s={[0.4, 0.02, 0.1]} p={[-0.3, 1.11 + pun * 0.02, 0.06]} c="#2a2c30" />
    {out < 1 && <Pl w={0.3} h={0.38} p={[-0.3, cy + 0.12 * (1 - ins), 0.12]} map={cardTex(0)} c="#ffffff" ro={0.8} o={1 - out} />}
    {out > 0 && <group position={[lerp(-0.3, 0.32, out), 0.98, 0.04]} rotation={[0, 0, (1 - out) * 0.3]} scale={1 + stamp * 0.04}><Pl w={0.42} h={0.52} map={cardTex(n + (stamp > 0.5 ? 0 : 0))} c="#ffffff" ro={0.8} /></group>}
  </S3>;
}}</Stage>;

// 29 · los cajones: caen dos cajas con rebote y sombra fuerte; el tercero, enorme, lo baja un gancho de grúa y levanta polvo; el precio va estampado en el costado
const crateTex = (s: string) => canvasTex(`crate11|${s}`, 512, 512, (g) => { g.fillStyle = "#c9a36e"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(90,60,30,.5)"; g.lineWidth = 3; for (let y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  g.fillStyle = "rgba(30,20,10,.9)"; g.font = BOLD(s.length > 5 ? 112 : 170); g.textAlign = "center"; g.fillText(s, 256, 310); });
export const MCrates: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), S: [number, string, number, number][] = [[0.42, "$90–150", 1.0, 0.06], [0.6, "$200+", 1.75, 0.22]];
  const big = win(u, 0.34, 0.62), bl = cl((u - 0.62) / 0.16);
  return <S3 zk={1.3} p={lv([0.952, 1.31, 3.168], [0.776, 1.222, 2.64], win(u, 0, 1))} l={[0.6, 0.65, 0]} fov={44} floor={null}>
    <FrostGround w={8} d={6} /><BrickWall w={8} h={3} z={-1.0} />
    <directionalLight position={[2, 4, 2]} intensity={2} castShadow />
    <HPU s={1.3} p={[-0.5, 0, -0.3]} />
    {S.map(([sz, lab, x, at], i) => { const d = drop(u, at, at + 0.14); if (d <= 0) return null;
      return <group key={lab} position={[x, lerp(2.6, 0, d) + bump(u, at + 0.14, 30, 12) * 0.05 + Math.abs(bump(u, 0.62, 40, 10)) * 0.08, 0.35]} rotation={[0, -0.25, 0]}>
        <Bx s={[sz, sz, sz]} p={[0, sz / 2, 0]} c="#c9a36e" ro={0.85} rad={0.01} />
        <Pl w={sz * 0.98} h={sz * 0.98} p={[0, sz / 2, sz / 2 + 0.002]} map={crateTex(lab)} c="#ffffff" ro={0.85} />
        {[-1, 1].map((k) => <Bx key={k} s={[sz * 1.04, 0.035, sz * 1.04]} p={[0, sz / 2 + k * sz * 0.36, 0]} c="#8a6a42" ro={0.9} />)}
      </group>; })}
    {big > 0 && <group position={[-0.5, lerp(3.2, 0, big), 0.0]}>
      <Bx s={[1.1, 1.0, 1.0]} p={[0, 0.5, 0]} c="#b08a5a" ro={0.85} rad={0.01} />
      <Pl w={1.06} h={0.96} p={[0, 0.5, 0.502]} map={crateTex("$7–12K")} c="#ffffff" ro={0.85} />
      {[-1, 1].map((k) => <Bx key={k} s={[1.14, 0.05, 1.04]} p={[0, 0.5 + k * 0.38, 0]} c="#7a5a32" ro={0.9} />)}
      {[-0.45, 0.45].map((x) => <Tube key={x} pts={[[x, 1.0, 0], [0, 1.6, 0]]} rad={0.008} c="#333" seg={4} />)}
      <Tube pts={[[0, 1.6, 0], [0, 4, 0]]} rad={0.012} c="#333" seg={4} />
      <To R={0.07} t={0.018} p={[0, 1.66, 0]} arc={Math.PI * 1.4} c="#e2a21b" m={0.7} ro={0.35} />
    </group>}
    {bl > 0 && bl < 1 && Array.from({ length: 8 }, (_, i) => <Puff key={i} p={[-0.5 + Math.cos(i * 0.8) * (0.6 + bl * 0.4), 0.08 + bl * 0.15, Math.sin(i * 0.8) * (0.6 + bl * 0.4)]} s={0.3 + bl * 0.5} c="#b9a88a" o={0.55 * (1 - bl)} add={false} />)}
  </S3>;
}}</Stage>;

// 30 · las paletas del reloj: un reloj de paletas grande en la pared del pasillo; de noche (sale la luna en la ventana) cae paleta por paleta 68 → 67 → 66 y una traba roja lo frena en 66
const flipT = (s: string, half: 0 | 1) => canvasTex(`flip11b|${s}|${half}`, 256, 160, (g) => { g.fillStyle = "#1d1f22"; g.fillRect(0, 0, 256, 160); g.fillStyle = "#f4f1ea"; g.font = BOLD(270); g.textAlign = "center"; g.fillText(s, 128, half ? 110 : 270); });
const Flap: React.FC<{ a: string; b: string; f: number; x: number }> = ({ a, b, f, x }) => { const g = cl(f), ang = -g * Math.PI;
  return <group position={[x, 0, 0]}>
    <Pl w={0.3} h={0.2} p={[0, 0.101, 0]} map={flipT(f >= 0.5 ? b : a, 0)} c="#ffffff" ro={0.5} />
    <Pl w={0.3} h={0.2} p={[0, -0.101, 0]} map={flipT(f >= 1 ? b : a, 1)} c="#ffffff" ro={0.5} />
    {g > 0 && g < 1 && <group rotation={[ang, 0, 0]} position={[0, 0, 0.006]}>{ang > -Math.PI / 2 ? <Pl w={0.3} h={0.2} p={[0, 0.1, 0]} map={flipT(a, 0)} c="#ffffff" ro={0.5} /> : <Pl w={0.3} h={0.2} p={[0, 0.1, 0]} r={[Math.PI, 0, 0]} map={flipT(b, 1)} c="#ffffff" ro={0.5} />}</group>}
    <Bx s={[0.31, 0.006, 0.02]} p={[0, 0, 0.01]} c="#000" ns />
  </group>; };
export const MFlipclock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  // vuelta 4: reloj grande al centro sobre un estante; caen dos paletas (68→67→66), baja la traba roja gruesa y la tercera paleta intenta caer y rebota contra ella
  const u = U(tt, h), night = win(u, 0.04, 0.2), f1 = win(u, 0.16, 0.3), f2 = win(u, 0.36, 0.5), latch = win(u, 0.56, 0.64), hit = bump(u, 0.64, 34, 9);
  const tens = "6", tryf = u > 0.74 ? Math.max(0, Math.sin(cl((u - 0.74) / 0.12) * Math.PI)) * 0.28 + bump(u, 0.86, 40, 12) * 0.05 : 0;
  return <S3 p={[0.0, 1.05, 2.25]} l={[0.0, 0.98, 0]} fov={36} floor={null} warm={mixc("#ffe2c0", "#9fb4e6", night)} exp={1.05 - 0.15 * night}>
    <PaperWall c="#e8dcc4" />
    <Bx s={[1.7, 0.06, 0.45]} p={[0.3, 0.5, 0.0]} c="#6a4426" ro={0.6} />
    <Env><group position={[-0.92, 1.08, -0.12]} scale={1.25}>
      <Bx s={[0.5, 0.86, 0.06]} c="#f2ece0" ro={0.6} />
      <Pl w={0.42} h={0.76} p={[0, 0, 0.032]} c={mixc("#6a8ab8", "#0b1430", night)} e={mixc("#6a8ab8", "#0b1430", night)} ei={0.8} ro={0.2} ns />
      <Sp rad={0.07} p={[0.1, -0.22 + 0.42 * win(u, 0.05, 0.6), 0.04]} c="#f6f1dc" e="#f6f1dc" ei={1.4} ns />
      <Bx s={[0.025, 0.78, 0.02]} p={[0, 0, 0.05]} c="#f2ece0" /><Bx s={[0.44, 0.025, 0.02]} p={[0, 0, 0.05]} c="#f2ece0" />
    </group></Env>
    <group position={[0.3, 0.95, 0.02]} scale={1.7}>
      <Bx s={[0.82, 0.52, 0.12]} c="#2a2c30" ro={0.35} m={0.3} rad={0.04} />
      <group position={[0, 0, 0.065]}>
        <Flap a="6" b={tens} f={0} x={-0.17} />
        <Flap a={f2 >= 1 ? "6" : f1 < 1 ? "8" : "7"} b={f2 >= 1 ? "5" : f1 < 1 ? "7" : "6"} f={f1 < 1 ? f1 : f2 < 1 ? f2 : tryf} x={0.17} />
      </group>
      <group position={[0.17, 0.3 + 0.5 * (1 - latch) - 0.01 * hit, 0.13]}>
        <Bx s={[0.3, 0.07, 0.07]} c="#c3352a" ro={0.5} rad={0.012} />
        {[-0.11, 0.11].map((x) => <Cy key={x} rt={0.014} h={0.02} r={[Math.PI / 2, 0, 0]} p={[x, 0, 0.04]} c="#9a9a9a" m={0.9} />)}
      </group>
    </group>
    {hit > 0.02 && <Puff p={[0.6, 1.42, 0.3]} s={0.4} c="#ffd08a" o={0.6 * Math.abs(hit)} />}
  </S3>;
}}</Stage>;

// 31 · la puerta del armario: la puerta gira hacia cámara y del lado de adentro está la hoja amarilla con cinta de pintor: un 10 grande y cinco casillas
const listTex = () => canvasTex("list11b", 400, 560, (g) => { g.fillStyle = "#f8e58a"; g.fillRect(0, 0, 400, 560); g.fillStyle = "#1b2a6b"; g.font = HANDF(190); g.fillText("10", 30, 180); g.font = HANDF(60); g.fillText("min", 250, 170);
  for (let i = 0; i < 5; i++) { const y = 230 + i * 64; g.strokeStyle = "#1b2a6b"; g.lineWidth = 6; g.strokeRect(36, y, 44, 44); g.fillRect(100, y + 20, 220 - i * 18, 6); } });
export const MClosetdoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = win(u, 0.04, 0.38) + bump(u, 0.38, 26, 9) * 0.04, tp = win(u, 0.42, 0.62);
  return <S3 p={lv([0.6, 1.3, 1.9], [0.45, 1.25, 1.45], win(u, 0, 1))} l={[0.25, 1.2, 0.2]} fov={40} floor="wood">
    <PaperWall c="#e6dccb" z={-0.32} />
    <Bx s={[0.84, 2.1, 0.5]} p={[0, 1.05, -0.6]} c="#2a2520" ro={0.9} />
    <Bx s={[0.6, 0.55, 0.35]} p={[0, 0.3, -0.55]} c="#9ea3a8" m={0.4} ro={0.45} />
    <group position={[0.42, 0, -0.27]} rotation={[0, lerp(0, 1.95, op), 0]}>
      <Bx s={[0.84, 2.05, 0.04]} p={[-0.42, 1.03, 0]} c="#f3efe6" ro={0.6} />
      <Sp rad={0.025} p={[-0.78, 1.0, 0.03]} c="#c9a24a" m={0.8} ro={0.3} />
      <Pl w={0.42} h={0.58} p={[-0.42, 1.3, -0.025]} r={[0, Math.PI, 0]} map={listTex()} c="#ffffff" ro={0.8} />
      {[[-0.6, 1.58], [-0.24, 1.58], [-0.6, 1.02], [-0.24, 1.02]].map(([x, y], i) => <Pl key={i} w={0.14 * tp + 0.001} h={0.045} p={[x, y, -0.027]} r={[0, Math.PI, (i % 2 ? -1 : 1) * 0.6]} c="#e6d7a8" ro={0.8} o={0.92} />)}
    </group>
  </S3>;
}}</Stage>;

// 32 · la ráfaga: el montón de hojas de verdad rodea la unidad; una ráfaga en espiral las barre hacia afuera y queda el anillo limpio, marcado con una soga a dos pies
const rulerTex2 = () => canvasTex("ruler11g", 1024, 112, (g) => { g.fillStyle = "#e9c56a"; g.fillRect(0, 0, 1024, 112); g.fillStyle = "#2a2016"; for (let i = 0; i <= 24; i++) { const x = 12 + i * 41.6; g.fillRect(x, 0, 5, i % 6 ? 28 : 50); } g.font = BOLD(70); g.fillText("2 FT", 420, 104); });
export const MRakegust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = win(u, 0.12, 0.55), D = h.out - h.at, rope = win(u, 0.5, 0.7), R = 0.95;
  const rp: V3[] = Array.from({ length: 61 }, (_, i) => { const a = (i / 60) * Math.PI * 2 * rope - Math.PI / 2; return [Math.cos(a) * R, 0.02, Math.sin(a) * R]; });
  return <S3 zk={1.15} p={[0.9, 1.5, 2.3]} l={[0, 0.4, 0]} fov={38} floor={null}>
    <FrostGround /><BrickWall w={7} h={3} z={-1.6} />
    <HPU s={1.3} fan={10 * D * cum((x) => win(x, 0.6, 0.8), u)} />
    <Env>{Array.from({ length: 260 }, (_, i) => { const a0 = rnd(i) * Math.PI * 2, r0 = 0.45 + rnd(i, 2) * 0.45, gi = cl((g - (a0 / (Math.PI * 2)) * 0.5) / 0.5), a = a0 + gi * 2.4, r = r0 + gi * (1.3 + rnd(i, 4)), y = 0.02 + rnd(i, 5) * 0.25 * (1 - gi) + Math.sin(gi * Math.PI) * 0.6;
      return <Leaf key={i} p={[Math.cos(a) * r, y, Math.sin(a) * r]} r={[-Math.PI / 2 + (rnd(i, 6) - 0.5) * 0.8 + gi * 8, rnd(i, 7) * 6, gi * 6]} s={1.9} c={LEAFC[i % 5]} />; })}</Env>
    {rope > 0.01 && <Tube pts={rp} rad={0.045} c="#ff7a1e" ro={0.7} seg={120} />}
    {rope > 0.6 && <group position={[0.3 + 0.35 * win(rope, 0.6, 1), 0.014, 0.66]} rotation={[-Math.PI / 2, 0, -0.65]}><Bx s={[0.7 * win(rope, 0.6, 1), 0.1, 0.012]} c="#e9c56a" ro={0.6} /><Pl w={0.7 * win(rope, 0.6, 1)} h={0.095} p={[0, 0, 0.007]} map={rulerTex2()} c="#ffffff" ro={0.6} ns /></group>}
  </S3>;
}}</Stage>;

// 33 · el mapa de Georgia: un relieve de madera clara tallado sobre la mesa; se prenden los LED de sur a norte, uno por uno, y al final un destello dorado; tres pueblos en banderines de papel
const GA: [number, number][] = [[-85.61, 34.98], [-83.11, 35.0], [-82.6, 34.6], [-82.2, 33.6], [-81.4, 32.6], [-80.85, 32.03], [-81.3, 31.4], [-81.5, 30.7], [-82.0, 30.55], [-82.2, 30.57], [-84.86, 30.7], [-85.0, 31.0], [-85.13, 31.8], [-84.9, 32.3], [-85.18, 32.86], [-85.61, 34.98]];
const gx = (lon: number) => (lon + 83.2) * 0.32, gz = (lat: number) => -(lat - 32.7) * 0.32;
const TOWNS: [string, number, number][] = [["MACON", -83.63, 32.84], ["SAVANNAH", -81.1, 32.08], ["ATLANTA", -84.39, 33.75]];
let GAS: THREE.Shape | null = null;
const gaShape = () => { if (!GAS) { GAS = new THREE.Shape(); GA.forEach(([a, b], i) => (i ? GAS!.lineTo(gx(a), -gz(b)) : GAS!.moveTo(gx(a), -gz(b)))); } return GAS; };
const flagTex = (n: string) => canvasTex(`flag11|${n}`, 512, 128, (g) => { g.fillStyle = "#fbf8ee"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#1a1a1a"; g.font = BOLD(84); g.textAlign = "center"; g.fillText(n, 256, 98); });
const LEDS = Array.from({ length: 70 }, (_, i) => [-85 + rnd(i) * 3.8, 30.9 + rnd(i, 2) * 3.9] as [number, number]).filter(([lo, la]) => lo < -81.3 - (la < 32 ? 0 : (la - 32) * 0.6) && lo > -85.1 + (la > 33 ? 0 : 0)).sort((a, b) => a[1] - b[1]);
export const MTownlights: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), shp = gaShape(), gold = bump(u, 0.82, 12, 6) > 0 ? Math.exp(-(u - 0.82) * 14) : 0;
  return <S3 p={[0, 1.85, 1.55]} l={[0, 0, -0.05]} fov={40} floor={null} warm="#ffd9a8">
    <Bench w={4} d={3} />
    <pointLight position={[-1, 1.5, 1]} intensity={3} distance={5} color="#ffd9a8" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} castShadow receiveShadow>
      <extrudeGeometry args={[shp, { depth: 0.12, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.015, bevelSegments: 3 }]} /><meshStandardMaterial color="#9a6a38" roughness={0.6} />
    </mesh>
    {LEDS.map(([lo, la], i) => { const on = win(u, 0.1 + (i / LEDS.length) * 0.65, 0.14 + (i / LEDS.length) * 0.65); return <group key={i}><Cy rt={0.04} rb={0.03} h={0.02} p={[gx(lo), 0.13, gz(la)]} c="#8a6a3a" m={0.8} ro={0.3} /><Sp rad={0.036} p={[gx(lo), 0.15, gz(la)]} c={on > 0.5 ? "#ffd27a" : "#5a4a34"} e={on > 0.5 ? "#ffc04a" : undefined} ei={2.2 * on + gold * 0.6} ns />{on > 0.5 && <Puff p={[gx(lo), 0.16, gz(la)]} s={0.2} c="#ffcf7a" o={0.35} />}</group>; })}
  </S3>;
}}</Stage>;

// CTA del manual (dos veces): el libro abre en la página exacta que nombra Marcus
export const MCta: React.FC<{ t: number; h: H }> = ({ t, h }) => <ManualCTA t={t} h={h} page={h.page} under={h.under} />;
