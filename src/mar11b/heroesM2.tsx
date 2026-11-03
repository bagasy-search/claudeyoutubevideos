// mar11b · componentes únicos 14-25 + la CTA del manual. Misma regla: UNA acción física por pieza, a mitad de camino en el
// cuadro del medio, objetos grandes y enteros, números impresos EN el objeto. Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import * as THREE from "three";
import { BOLD, Bx, Cy, env, Pl, Puff, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { ManualCTA } from "./book3d";
import { HPU, U, bump, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";
import { plate } from "./heroesM1";

const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const Table: React.FC<{ w?: number; d?: number }> = ({ w = 4, d = 2.4 }) => <PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} />;
const Wall: React.FC<{ w?: number; hh?: number; z?: number; c?: string }> = ({ w = 6, hh = 3.2, z = -0.5, c = "#ffffff" }) =>
  <PhotoWall w={w} h={hh} z={z} y={hh / 2 - 0.3} name="t_pared.jpg" tint={c} />;
env(Wall); env(Table);
// termostato de pared con display grande (número y color)
const Thermo: React.FC<{ p: V3; n: string; fg: string; s?: number }> = ({ p, n, fg, s = 1 }) => <group position={p} scale={s}>
  <Bx s={[0.6, 0.6, 0.07]} c="#f2f0ea" ro={0.35} rad={0.05} />
  <Pl w={0.48} h={0.32} p={[0, 0.04, 0.037]} map={plate(n, "#10161c", fg, 200, 512, 340)} c="#ffffff" e="#ffffff" ei={0.25} ns />
</group>;

// 14 · el sillón vacío: la lámpara prende, la rejilla del piso sopla aire tibio y el reloj corre de 6 a 8 sobre un sillón donde no hay nadie
const clockT = () => canvasTex("clk11b2", 512, 512, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(256, 256, 250, 0, 6.29); g.fill(); g.fillStyle = "#1c1a18";
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; g.save(); g.translate(256 + Math.sin(a) * 205, 256 - Math.cos(a) * 205); g.rotate(a); g.fillRect(-7, -28, 14, 56); g.restore(); }
});
export const MEmptychair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lamp = win(u, 0.04, 0.12), blow = win(u, 0.16, 0.3), hr = 6 + 2 * win(u, 0.1, 0.92);
  return <S3 p={lv([0.35, 1.1, 2.55], [0.2, 1.02, 2.2], u)} l={[0, 0.75, 0]} fov={38} floor={null} warm="#ffd8b0" exp={0.95}>
    <PhotoGround w={7} d={5} name="t_madera.jpg" rep={1.2} tint="#a08070" /><Wall w={8} c="#cdbfae" z={-0.9} />
    <group position={[-0.1, 0, -0.2]}>
      <Bx s={[1.0, 0.42, 0.9]} p={[0, 0.21, 0]} c="#7a3f32" ro={0.9} rad={0.06} />
      <Bx s={[1.0, 0.7, 0.2]} p={[0, 0.66, -0.36]} c="#7a3f32" ro={0.9} rad={0.08} />
      {[-0.48, 0.48].map((x) => <Bx key={x} s={[0.18, 0.62, 0.86]} p={[x, 0.36, 0.01]} c="#6e382c" ro={0.9} rad={0.07} />)}
      <Bx s={[0.66, 0.1, 0.62]} p={[0, 0.46, 0.08]} c="#8a4a3c" ro={0.95} rad={0.05} />
    </group>
    <group position={[-1.0, 0, -0.45]}>
      <Cy rt={0.16} h={0.03} p={[0, 0.015, 0]} c="#2a2724" m={0.6} ro={0.4} />
      <Cy rt={0.015} h={1.4} p={[0, 0.7, 0]} c="#b08a3a" m={1} ro={0.3} />
      <Cy rt={0.14} rb={0.24} h={0.28} p={[0, 1.45, 0]} c={mixc("#c8b89a", "#fff0c8", lamp)} e={lamp > 0.05 ? "#ffcf8a" : undefined} ei={1.2 * lamp} ro={0.8} open />
      <pointLight position={[0, 1.3, 0.2]} intensity={2.6 * lamp} distance={3.5} color="#ffc47a" />
    </group>
    <Bx s={[0.5, 0.02, 0.18]} p={[0.75, 0.011, 0.45]} c="#d9d6cc" m={0.6} ro={0.4} />
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.35 + i / 10) % 1;
      return <Puff key={i} p={[0.75 + (rnd(i, 1) - 0.5) * 0.3 - ph * 0.4, 0.05 + ph * 0.9, 0.45 - ph * 0.35]} s={0.35 + ph * 0.5} c="#ffb070" o={0.4 * blow * (1 - ph)} />; })}
    <group position={[0.7, 1.38, -0.84]} scale={1.7}>
      <Cy rt={0.24} h={0.05} r={[Math.PI / 2, 0, 0]} c="#2a2724" ro={0.4} seg={48} />
      <mesh position={[0, 0, 0.027]}><circleGeometry args={[0.22, 48]} /><meshStandardMaterial map={clockT()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.035]} rotation={[0, 0, -(hr % 1) * Math.PI * 2]}><Bx s={[0.014, 0.18, 0.006]} p={[0, 0.08, 0]} c="#1c1a18" /></group>
      <group position={[0, 0, 0.032]} rotation={[0, 0, -(hr / 12) * Math.PI * 2]}><Bx s={[0.022, 0.12, 0.006]} p={[0, 0.05, 0]} c="#1c1a18" /></group>
    </group>
  </S3>;
}}</Stage>;

// 15 · la cuota del auto: caen tres billetes grandes de $300, $200 y $150 uno sobre otro, y arriba aterriza la llave de un auto con su control
const Bill: React.FC<{ v: string; p: V3; r?: number }> = ({ v, p, r = 0 }) => <group position={p} rotation={[-Math.PI / 2, 0, r]}>
  <Bx s={[0.9, 0.42, 0.006]} c="#cfd8c0" ro={0.8} ns />
  <Pl w={0.86} h={0.38} p={[0, 0, 0.004]} map={plate(v, "#a9b897", "#1f3a22", 230, 768, 340)} c="#ffffff" ro={0.8} ns />
</group>;
export const MKeyfob: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), V = ["$300", "$200", "$150"], k = (i: number) => win(u, 0.06 + i * 0.13, 0.14 + i * 0.13), kk = win(u, 0.52, 0.64), b = bump(u, 0.64, 40, 10);
  return <S3 zk={1.2} p={[0, 1.75, 1.55]} l={[0, 0.0, 0.05]} fov={40} floor={null}>
    <Table w={4} d={3} />
    {V.map((v, i) => <Bill key={i} v={v} p={[-0.3 + (i - 1) * 0.28, 0.004 + i * 0.008 + (1 - k(i)) * 0.9, -0.25 + i * 0.26]} r={(i - 1) * 0.1 + (1 - k(i)) * 0.8} />)}
    <group scale={1.8} position={[0.62, 0.04 + (1 - kk) * 0.8 + b * 0.02, 0.02]} rotation={[0, 0.5 + (1 - kk) * 2, 0]}>
      <Bx s={[0.16, 0.05, 0.3]} p={[0, 0, 0]} c="#141414" ro={0.4} rad={0.04} />
      {[0, 1, 2].map((i) => <Cy key={i} rt={0.025} h={0.012} p={[0, 0.03, -0.08 + i * 0.07]} c="#3a3a3a" ro={0.5} />)}
      <Bx s={[0.05, 0.012, 0.26]} p={[0, 0, 0.28]} c="#c9ccd0" m={1} ro={0.2} />
      <To R={0.05} t={0.008} p={[0, 0, -0.18]} r={[Math.PI / 2, 0, 0]} c="#c9ccd0" m={1} ro={0.2} />
    </group>
  </S3>;
}}</Stage>;

// 16 · la puerta de enero: la puerta de calle se abre, entra una ráfaga de nieve por el pasillo, el termostato baja de 70 a 64 y se pone azul; la puerta se cierra
export const MDoorgust: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = win(u, 0.08, 0.26) * (1 - win(u, 0.78, 0.92)), drop = win(u, 0.3, 0.62), n = Math.round(70 - 6 * drop);
  return <S3 p={[0.6, 1.2, 2.2]} l={[-0.2, 1.05, -0.3]} fov={42} floor={null} warm="#dfe8ff">
    <PhotoGround w={6} d={5} name="t_madera.jpg" rep={1.2} tint="#a89080" />
    <PhotoWall w={6} h={3} z={-0.7} name="t_pared.jpg" tint="#d7cbb8" />
    <PhotoPl w={0.92} h={2.0} name="t_pasto.jpg" p={[-1.0, 1.0, -0.6]} tint="#e8f0ff" e={0.6} />
    <Bx s={[1.06, 2.1, 0.1]} p={[-1.0, 1.02, -0.68]} c="#f2ece0" ro={0.6} />
    <group position={[-1.45, 1.0, -0.6]} rotation={[0, op * 1.35, 0]}>
      <PhotoPl w={0.9} h={2.0} name="t_madera.jpg" p={[0.45, 0, 0.032]} tint="#9a5a34" /><Bx s={[0.9, 2.0, 0.06]} p={[0.45, 0, 0]} c="#6a3a22" ro={0.55} />
      <Sp rad={0.035} p={[0.8, 0, 0.05]} c="#c9a14a" m={1} ro={0.2} />
    </group>
    {Array.from({ length: 140 }, (_, i) => { const ph = (tt * 0.8 + rnd(i, 1)) % 1;
      return <Sp key={i} rad={0.018 + 0.016 * rnd(i, 2)} p={[-1.0 + ph * 2.0 + (rnd(i, 3) - 0.5) * 0.4, 0.4 + 1.3 * rnd(i, 4) - ph * 0.2, -0.55 + ph * 0.6]} c="#ffffff" e="#ffffff" ei={0.6} o={op} ns />; })}
    <Puff p={[-0.4, 1.0, -0.2]} s={1.8} c="#dfeaff" o={0.55 * op} add={false} /><Puff p={[0.3, 1.1, 0.1]} s={1.4} c="#dfeaff" o={0.4 * op * drop} add={false} />
    <Thermo p={[0.55, 1.2, -0.63]} s={1.3} n={String(n)} fg={drop > 0.5 ? "#5ab8ff" : "#ffffff"} />
    <pointLight position={[0.55, 1.2, -0.3]} intensity={1.6 * drop} distance={1.2} color="#5ab8ff" />
  </S3>;
}}</Stage>;

// 17 · la puerta giratoria: cuatro hojas de vidrio; primero gira hacia un lado con luz azul (frío) y después al revés con luz naranja (calor)
export const MRevolvingdoor: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), d = h.out - h.at, f1 = win(u, 0.04, 0.12) * (1 - win(u, 0.4, 0.5)), f2 = win(u, 0.55, 0.65);
  const a = cl(u) * 0 + (win(u, 0, 0.5) * 2.2 - win(u, 0.5, 1) * 3.0) * d * 0.5, col = u < 0.5 ? "#4aa8ff" : "#ff8a2a", k = Math.max(f1, f2);
  return <S3 zk={1.4} p={[0, 1.55, 3.7]} l={[0, 1.0, 0]} fov={40} floor={null}>
    <PhotoGround w={7} d={5} name="t_concreto.jpg" rep={1} tint="#8a8a8a" />
    <Wall w={8} c={mixc("#d8ccb8", col, 0.35 * k)} z={-1.4} />
    <To R={0.95} t={0.02} r={[Math.PI / 2, 0, 0]} p={[0, 0.01, 0]} c={col} e={col} ei={1.6 * k} />
    <Cy rt={1.0} h={0.12} p={[0, 2.0, 0]} c="#3a3a3e" m={0.7} ro={0.3} />
    <Cy rt={0.06} h={2.0} p={[0, 1.0, 0]} c="#b0b4b8" m={1} ro={0.2} />
    <group rotation={[0, a, 0]}>
      {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, i * Math.PI / 2, 0]}>
        <Bx s={[0.9, 1.9, 0.03]} p={[0.48, 0.97, 0]} c={mixc("#dfefff", col, 0.6 * k)} e={col} ei={0.25 * k} o={0.32} ro={0.05} m={0.2} ns />
        <Bx s={[0.9, 0.05, 0.05]} p={[0.48, 0.05, 0]} c="#b0b4b8" m={1} ro={0.2} />
        <Bx s={[0.05, 1.9, 0.05]} p={[0.93, 0.97, 0]} c="#b0b4b8" m={1} ro={0.2} />
      </group>)}
    </group>
    {Array.from({ length: 8 }, (_, i) => { const q = a * 0.9 + i * 0.785; return <Puff key={i} p={[Math.cos(q) * 0.7, 0.4 + (i % 3) * 0.5, Math.sin(q) * 0.7]} s={0.4} c={col} o={0.3 * k} />; })}
    <pointLight position={[0, 1.2, 1.2]} intensity={3 * k} distance={4} color={col} />
  </S3>;
}}</Stage>;

// 18 · la serpentina de adentro: la «A» de aletas dentro del gabinete abierto se va cubriendo de escarcha blanca de abajo hacia arriba
const frostA = (k: number) => canvasTex(`fA11b|${Math.round(k * 40)}`, 256, 512, (g) => {
  g.clearRect(0, 0, 256, 512); const top = 512 - k * 520;
  for (let i = 0; i < 260; i++) { const y = top + rnd(i, 1) * (512 - top), x = rnd(i, 2) * 256; g.fillStyle = `rgba(245,250,255,${0.55 + 0.4 * rnd(i, 3)})`; g.beginPath(); g.arc(x, y, 6 + 14 * rnd(i, 4), 0, 6.29); g.fill(); }
  if (k > 0.05) { g.fillStyle = `rgba(240,248,255,${0.6 * k})`; g.fillRect(0, Math.max(0, top + 40), 256, 512); }
});
export const MAcoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.06, 0.82);
  const Side: React.FC<{ s: number }> = ({ s }) => <group position={[s * 0.3, 0.75, 0]} rotation={[0, 0, -s * 0.36]}>
    <PhotoPl w={0.5} h={1.3} name="t_aletas.jpg" rep={[1, 2]} p={[0, 0, 0.06]} r={[0, 0, 0]} tint="#d8a070" m={0.6} ro={0.35} />
    <Pl w={0.5} h={1.3} p={[0, 0, 0.065]} map={frostA(k)} c="#ffffff" ro={0.6} ns />
    <Bx s={[0.54, 1.32, 0.04]} p={[0, 0, 0.03]} c="#7a7f86" m={0.7} ro={0.3} />
  </group>;
  return <S3 p={[0, 0.9, 2.15]} l={[0, 0.82, 0]} fov={40} floor={null} warm="#dfe8ff">
    <PhotoGround w={6} d={4} name="t_concreto.jpg" rep={1} tint="#8a8a8a" /><Wall w={7} c="#b8b0a4" z={-0.9} />
    <Bx s={[1.5, 1.7, 0.05]} p={[0, 0.85, -0.4]} c="#c9ccd0" m={0.5} ro={0.4} />
    {[-0.73, 0.73].map((x) => <Bx key={x} s={[0.05, 1.7, 0.8]} p={[x, 0.85, 0]} c="#c9ccd0" m={0.5} ro={0.4} />)}
    <Bx s={[1.5, 0.05, 0.8]} p={[0, 1.72, 0]} c="#c9ccd0" m={0.5} ro={0.4} />
    <Bx s={[1.5, 0.08, 0.8]} p={[0, 0.04, 0]} c="#2a2c30" m={0.4} ro={0.5} />
    <Side s={-1} /><Side s={1} />
    {[-0.5, 0.5].map((x) => <Tube key={x} pts={[[x * 0.6, 0.15, 0.1], [x * 0.9, 0.06, 0.4], [x * 1.4, 0.06, 0.6]]} rad={0.022} c="#c97a3a" m={1} ro={0.25} />)}
    {Array.from({ length: 10 }, (_, i) => { const ph = (tt * 0.3 + i / 10) % 1; return <Puff key={i} p={[(rnd(i, 1) - 0.5) * 0.8, 0.3 + ph * 1.2, 0.3 + ph * 0.3]} s={0.35} c="#cfe6ff" o={0.25 * k * (1 - ph)} />; })}
    <pointLight position={[0, 1.0, 1.0]} intensity={1.4 * k} distance={3} color="#a8d0ff" />
  </S3>;
}}</Stage>;

// 19 · los tacos del día: en una regla de madera con el sol y la luna entran tres tacos: 70 de día, 68 de noche y una rampa que sube antes de despertar
export const MDayblocks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = (i: number) => win(u, 0.08 + i * 0.2, 0.2 + i * 0.2), b = (i: number) => bump(u, 0.2 + i * 0.2, 40, 12);
  const B = [{ x: -0.62, w: 0.68, hh: 0.36, c: "#e8b84a", n: "70" }, { x: 0.12, w: 0.62, hh: 0.26, c: "#5a7ab8", n: "68" }];
  return <S3 zk={1.4} p={[0, 0.85, 1.85]} l={[0, 0.32, 0]} fov={40} floor={null}>
    <Table w={5} d={3} /><Wall w={7} c="#e2d6c2" z={-0.8} />
    <Bx s={[2.3, 0.05, 0.42]} p={[0, 0.025, 0]} c="#5a3a20" ro={0.6} />
    <Sp rad={0.13} p={[-0.62, 0.95, -0.2]} c="#ffcf4a" e="#ffb020" ei={1.2} />
    <group position={[0.12, 0.95, -0.2]}><Sp rad={0.12} c="#e6e8f0" e="#c8d0e8" ei={0.6} /><Sp rad={0.1} p={[0.06, 0.03, 0.05]} c="#e2d6c2" /></group>
    {B.map((q, i) => <group key={i} position={[q.x + (1 - k(i)) * 2.4, 0.05 + q.hh / 2 + b(i) * 0.015, 0]}>
      <Bx s={[q.w, q.hh, 0.36]} c={q.c} ro={0.6} rad={0.02} />
      <Pl w={0.4} h={0.22} p={[0, 0, 0.182]} map={plate(q.n, "#1a120a", "#ffffff", 180, 384, 220)} c="#ffffff" ns />
    </group>)}
    <group position={[0.77 + (1 - k(2)) * 2.0, 0.05, 0]}>
      <mesh rotation={[0, 0, 0]} castShadow receiveShadow position={[0, 0, -0.18]}>
        <extrudeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.3, 0); s.lineTo(0.3, 0); s.lineTo(0.3, 0.36); s.lineTo(-0.3, 0.26); s.closePath(); return s; })(), { depth: 0.36, bevelEnabled: false }]} />
        <meshStandardMaterial color="#d97a3a" roughness={0.6} />
      </mesh>
      <Sp rad={0.06} p={[0.36, 0.42, 0.0]} c="#ffcf4a" e="#ffb020" ei={1.2 * k(2)} />
      <Pl w={0.3} h={0.17} p={[0, 0.16, 0.185]} map={plate("6 AM", "#1a120a", "#ffffff", 130, 384, 220)} c="#ffffff" ns />
    </group>
  </S3>;
}}</Stage>;

// 20 · la marioneta: una cruceta de madera con hilos mueve la perilla grande del termostato; la máquina hace lo que le dicen
export const MMarionette: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = Math.sin(win(u, 0.1, 0.9) * Math.PI * 3) * 0.35 * win(u, 0.06, 0.2), down = win(u, 0.02, 0.12);
  const cb: V3 = [0, 2.0 - 0.2 * down, 0.15], L = (s: number): V3 => [cb[0] + s * 0.5 * Math.cos(sw), cb[1] + s * 0.5 * Math.sin(sw), cb[2]];
  return <S3 p={[0, 1.35, 2.45]} l={[0, 1.3, 0]} fov={40} floor={null}>
    <Wall w={7} c="#d8ccb8" z={-0.1} />
    <directionalLight position={[2.5, 2.2, 1.5]} intensity={1.2} color="#ffe6c8" />
    <group position={cb} rotation={[0, 0, sw]}>
      <Bx s={[1.1, 0.06, 0.06]} c="#8a5a30" ro={0.6} />
      <Bx s={[0.06, 0.06, 0.6]} c="#8a5a30" ro={0.6} />
    </group>
    {[-1, 1].map((s) => { const a = L(s), bpt: V3 = [s * 0.36 * Math.cos(sw * 1.2), 0.9 + s * 0.36 * Math.sin(sw * 1.2), 0.12];
      return <Tube key={s} pts={[a, [(a[0] + bpt[0]) / 2, (a[1] + bpt[1]) / 2, 0.14], bpt]} rad={0.011} c="#2a1a10" ro={0.9} />; })}
    <group position={[0, 0.9, 0]}>
      <Cy rt={0.5} h={0.08} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.5} ro={0.35} seg={64} />
      <group rotation={[0, 0, sw * 1.2]}>
        <Cy rt={0.4} h={0.1} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.06]} c="#e8e4da" ro={0.35} seg={64} /><mesh position={[0, 0, 0.112]}><circleGeometry args={[0.38, 64]} /><meshStandardMaterial map={dial60()} roughness={0.5} /></mesh>
        <Bx s={[0.05, 0.3, 0.02]} p={[0, 0.2, 0.12]} c="#c4261c" />
      </group>
      {Array.from({ length: 9 }, (_, i) => { const q = -0.9 + i * 0.225; return <Bx key={i} s={[0.02, 0.06, 0.01]} p={[Math.sin(q) * 0.46, Math.cos(q) * 0.46, 0.05]} r={[0, 0, -q]} c="#e8e4da" />; })}
    </group>
  </S3>;
}}</Stage>;

// 21 · la valija: cae una valija rígida al lado del termostato de perilla, la perilla gira hasta 60 y la valija se va rodando
const dial60 = () => canvasTex("d60_11b", 512, 512, (g) => {
  g.fillStyle = "#e8e4da"; g.beginPath(); g.arc(256, 256, 250, 0, 6.29); g.fill(); g.fillStyle = "#1a1a1a"; g.font = BOLD(70); g.textAlign = "center"; g.textBaseline = "middle";
  [50, 60, 70, 80].forEach((v, i) => { const a = -1.2 + i * 0.8; g.fillText(String(v), 256 + Math.sin(a) * 170, 256 - Math.cos(a) * 170); });
});
export const MSuitcase: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dr = win(u, 0.05, 0.2), b = bump(u, 0.2, 40, 10), turn = win(u, 0.3, 0.58), go = win(u, 0.72, 1.1), ang = lerp(-0.4, -1.2 + 0.8 * 1, 1) * 0 + lerp(0.4, -0.4, turn);
  return <S3 zk={1.3} p={[0, 0.95, 2.3]} l={[0, 0.85, 0]} fov={40} floor={null}>
    <PhotoGround w={7} d={5} name="t_madera.jpg" rep={1.2} tint="#a89080" /><Wall w={7} c="#d8ccb8" z={-0.3} />
    <group position={[0.55, 1.15, -0.22]}>
      <Bx s={[1.0, 1.0, 0.04]} p={[0, 0, -0.02]} c="#f2f0ea" ro={0.35} rad={0.06} />
      <Cy rt={0.4} h={0.06} r={[Math.PI / 2, 0, 0]} c="#2a2c30" ro={0.4} seg={64} />
      <group rotation={[0, 0, ang]}><mesh position={[0, 0, 0.032]}><circleGeometry args={[0.36, 64]} /><meshStandardMaterial map={dial60()} roughness={0.5} /></mesh></group>
      <Bx s={[0.03, 0.1, 0.02]} p={[0, 0.42, 0.04]} c="#c4261c" />
    </group>
    <group position={[-0.5 + go * -2.6, 0.38 + (1 - dr) * 1.2 + b * 0.02, 0.1]} rotation={[0, 0, go * 0.15]}>
      <Bx s={[0.62, 0.76, 0.3]} c="#2f4f6a" m={0.2} ro={0.3} rad={0.05} />
      {[-0.18, 0, 0.18].map((x) => <Bx key={x} s={[0.04, 0.72, 0.31]} p={[x, 0, 0]} c="#284560" ro={0.35} ns />)}
      <Bx s={[0.2, 0.04, 0.05]} p={[0, 0.42, 0]} c="#141414" ro={0.5} />
      {[-0.22, 0.22].map((x) => <Cy key={x} rt={0.04} h={0.04} r={[Math.PI / 2, 0, 0]} p={[x, -0.41, 0]} c="#141414" ro={0.6} />)}
    </group>
  </S3>;
}}</Stage>;

// 22 · las cuatro teclas: MODE, FAN, TEMP y SCHEDULE se hunden una por una y prenden en verde; nada se rompe, la unidad de afuera sigue girando
export const MFourkeys: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), K = ["MODE", "FAN", "TEMP", "SCHEDULE"];
  return <S3 zk={1.3} p={[0, 1.6, 2.0]} l={[0, 0.2, -0.3]} fov={40} floor={null}>
    <Table w={4} d={3} />
    <group position={[0, 0, -1.05]} scale={0.9}><HPU fan={tt * 14} /></group>
    <Bx s={[2.0, 0.12, 0.8]} p={[0, 0.06, 0]} c="#f2f0ea" ro={0.35} rad={0.06} />
    {K.map((k, i) => { const a = 0.08 + i * 0.18, pr = win(u, a, a + 0.04) * (1 - win(u, a + 0.06, a + 0.1)), on = win(u, a + 0.03, a + 0.06), x = -0.72 + i * 0.48;
      return <group key={k} position={[x, 0.12 - pr * 0.03, 0]}>
        <Bx s={[0.42, 0.06, 0.52]} p={[0, 0.03, 0]} c={on > 0.5 ? "#3fbf6a" : "#3a3c40"} e={on > 0.5 ? "#3fbf6a" : undefined} ei={0.5 * on} ro={0.4} rad={0.04} />
        <Pl w={0.4} h={0.2} p={[0, 0.062, 0]} r={[-Math.PI / 2, 0, 0]} map={plate(k, "rgba(0,0,0,0)", "#ffffff", k.length > 5 ? 64 : 110, 512, 256)} c="#ffffff" ns />
        {on > 0.5 && <pointLight position={[0, 0.3, 0.1]} intensity={0.4 * on} distance={0.8} color="#5dff8a" />}
      </group>; })}
  </S3>;
}}</Stage>;

// 23 · el mismo chip: dos cajas de termostato (la de $60 y la de $250) abren la tapa y de las dos sube el mismo chip verde que brilla igual
export const MSamechip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = win(u, 0.12, 0.3), up = win(u, 0.34, 0.6), gl = win(u, 0.55, 0.7);
  const Box: React.FC<{ x: number; tag: string; c: string }> = ({ x, tag, c }) => <group position={[x, 0, 0]}>
    <Bx s={[0.66, 0.4, 0.5]} p={[0, 0.2, 0]} c={c} ro={0.7} rad={0.01} />
    <Pl w={0.5} h={0.24} p={[0, 0.2, 0.252]} map={plate(tag, "#f4efe2", "#1a120a", 150, 512, 246)} c="#ffffff" ro={0.6} ns />
    <group position={[0, 0.4, -0.25]} rotation={[-op * 1.9, 0, 0]}><Bx s={[0.68, 0.03, 0.52]} p={[0, 0.015, 0.26]} c={c} ro={0.7} /></group>
    <group position={[0, 0.3 + up * 0.5, 0.05]} rotation={[0.5 * up, up * 3.2, 0]} scale={1 + 0.9 * up}>
      <Bx s={[0.3, 0.025, 0.22]} c="#1f6b3a" ro={0.4} e="#2fa05a" ei={0.6 * gl} />
      <Bx s={[0.1, 0.03, 0.1]} p={[0, 0.025, 0]} c="#1a1a1a" ro={0.3} />
      {Array.from({ length: 6 }, (_, i) => <Bx key={i} s={[0.012, 0.01, 0.03]} p={[-0.04 + (i % 3) * 0.04, 0.02, i < 3 ? -0.065 : 0.065]} c="#d9b25a" m={1} ro={0.2} />)}
      <pointLight position={[0, 0.15, 0.1]} intensity={1.2 * gl} distance={1.2} color="#5dff8a" />
    </group>
  </group>;
  return <S3 p={[0, 1.1, 1.9]} l={[0, 0.5, 0]} fov={40} floor={null}>
    <Table w={5} d={3} /><Wall w={7} c="#e2d6c2" z={-0.8} />
    <Box x={-0.55} tag="$60" c="#c9b088" />
    <Box x={0.55} tag="$250" c="#2a2c30" />
  </S3>;
}}</Stage>;

// 24 · las bicicletas de los nietos: dos bicicletas chicas con moño entran rodando, las ruedas giran y frenan una al lado de la otra
const Bike: React.FC<{ c: string; a: number }> = ({ c, a }) => { const R = 0.26;
  const Wh: React.FC<{ x: number }> = ({ x }) => <group position={[x, R, 0]} rotation={[0, 0, -a]}>
    <To R={R} t={0.03} c="#141414" ro={0.8} />
    {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.006, R * 2, 0.006]} r={[0, 0, (i * Math.PI) / 8]} c="#c9ccd0" m={1} ro={0.2} ns />)}
    <Cy rt={0.03} h={0.05} r={[Math.PI / 2, 0, 0]} c="#c9ccd0" m={1} ro={0.2} />
  </group>;
  return <group>
    <Wh x={-0.36} /><Wh x={0.36} />
    <Tube pts={[[-0.36, R, 0], [-0.05, R + 0.02, 0], [0.22, R + 0.3, 0], [0.36, R, 0]]} rad={0.022} c={c} m={0.4} ro={0.3} />
    <Tube pts={[[-0.05, R + 0.02, 0], [-0.14, R + 0.34, 0], [0.22, R + 0.3, 0]]} rad={0.022} c={c} m={0.4} ro={0.3} />
    <Bx s={[0.2, 0.04, 0.09]} p={[-0.16, R + 0.39, 0]} c="#1a1a1a" ro={0.6} rad={0.02} />
    <Cy rt={0.012} h={0.2} p={[0.27, R + 0.4, 0]} c="#c9ccd0" m={1} ro={0.2} />
    <Cy rt={0.014} h={0.34} r={[Math.PI / 2, 0, 0]} p={[0.27, R + 0.5, 0]} c="#c9ccd0" m={1} ro={0.2} />
    <group position={[0.27, R + 0.5, 0.08]}><To R={0.07} t={0.025} p={[-0.07, 0.03, 0]} r={[0, 0, 0.5]} c="#e0302a" ro={0.4} /><To R={0.07} t={0.025} p={[0.07, 0.03, 0]} r={[0, 0, -0.5]} c="#e0302a" ro={0.4} /><Sp rad={0.035} c="#c4261c" ro={0.4} /><Bx s={[0.03, 0.16, 0.01]} p={[-0.03, -0.09, 0]} r={[0, 0, 0.3]} c="#e0302a" /><Bx s={[0.03, 0.16, 0.01]} p={[0.03, -0.09, 0]} r={[0, 0, -0.3]} c="#e0302a" /></group>
  </group>; };
export const MBicycles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), r1 = win(u, 0.05, 0.42), r2 = win(u, 0.14, 0.52), x1 = lerp(-3.2, -0.62, r1), x2 = lerp(-3.4, 0.62, r2);
  return <S3 p={[0, 0.9, 2.55]} l={[0, 0.45, 0]} fov={40} floor={null}>
    <PhotoGround w={8} d={5} name="t_concreto.jpg" rep={1} tint="#9a9a9a" /><Wall w={9} c="#c8bca8" z={-1.0} />
    <group position={[x1, 0, -0.1]}><Bike c="#3a8fd9" a={(x1 + 3.2) / 0.26} /></group>
    <group position={[x2, 0, 0.0]}><Bike c="#d95aa8" a={(x2 + 3.4) / 0.26} /></group>
  </S3>;
}}</Stage>;

// 25 · la urna: una papeleta con los cinco hábitos y uno tildado a mano cae y entra por la ranura de la urna de madera
const ballotTex = () => canvasTex("ballot11b", 512, 640, (g) => {
  g.fillStyle = "#f6f1e2"; g.fillRect(0, 0, 512, 640); g.strokeStyle = "#2a2724"; g.lineWidth = 8; g.fillStyle = "#2a2724"; g.font = BOLD(84); g.textBaseline = "middle";
  const T = ["-10°", "80°", "EM", "FAN", "WALL"]; for (let i = 0; i < 5; i++) { const y = 70 + i * 122; g.strokeRect(40, y - 42, 84, 84); g.font = BOLD(T[i].length > 3 ? 76 : 92); g.fillText(T[i], 160, y + 4); }
  g.strokeStyle = "#c4261c"; g.lineWidth = 20; g.lineCap = "round"; g.beginPath(); g.moveTo(52, 314); g.lineTo(80, 346); g.lineTo(134, 266); g.stroke();
});
export const MBallot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dn = win(u, 0.1, 0.38), tip = win(u, 0.38, 0.48), slide = 0.55 * win(u, 0.5, 0.8);
  return <S3 p={[0.45, 1.25, 1.85]} l={[0, 0.8, 0]} fov={40} floor={null}>
    <Table w={5} d={3} /><Wall w={7} c="#d8ccb8" z={-0.8} />
    <pointLight position={[0.6, 1.6, 1.0]} intensity={2.2} distance={3.5} color="#ffe2c0" />
    <Bx s={[0.9, 0.7, 0.7]} p={[0, 0.35, 0]} c="#7a4a26" ro={0.55} rad={0.02} />
    <Bx s={[0.5, 0.012, 0.05]} p={[0, 0.704, 0]} c="#141414" ns />
    <group position={[0, 0.72 + (1 - dn) * 0.9 - slide * 0.5, 0]} rotation={[-Math.PI / 2 + tip * (Math.PI / 2), 0, (1 - dn) * 0.4]}>
      <Pl w={0.4} h={0.5} p={[0, 0.25 * tip + 0.0, 0]} map={ballotTex()} c="#ffffff" ro={0.8} />
    </group>
    <Bx s={[0.92, 0.3, 0.72]} p={[0, 0.85, 0]} c="#7a4a26" o={slide > 0.02 ? 1 : 0} ro={0.55} ns />
  </S3>;
}}</Stage>;

// CTA del manual (dos veces): el libro abre en la página exacta que nombra Marcus
export const MCta: React.FC<{ t: number; h: H }> = ({ t, h }) => <ManualCTA t={t} h={h} page={h.page} under={h.under} />;
