// mar29e · componentes únicos 22-41 (bomba de calor), vuelta 2 en 3D (kit r3k): objetos grandes, la acción se ve, sin rótulos que repitan la voz.
// La acción se reparte en todo el plano (u = 0..1). Registro: D:/rtmp/mar29_COMPONENTES.md
import React from "react";
import * as THREE from "three";
import { BOLD, Bx, Cy, Flame, PLASTER, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { HPU } from "./heroesE1";
import { Odo } from "./r3c";

// cámara: por defecto tal cual (k = 1); si se pide k acerca p hacia l
const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const bump = (u: number, a: number, f = 26, k = 8) => u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0;
const mix = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
const Wall: React.FC<{ y?: number; z?: number; c?: string }> = ({ y = 1, z = -0.05, c = "#ffffff" }) => <Bx s={[4, 2.6, 0.05]} p={[0, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
// termómetro de vidrio: base en p, v = 0..1 (llenado), mk = marca opcional (0..1)
const Thermo: React.FC<{ p: V3; v: number; mk?: number; s?: number }> = ({ p, v, mk, s = 1 }) => {
  const top = -0.3 + cl(v) * 0.62, hh = top + 0.3 + 0.001;
  return <group position={p} scale={s}>
    <Bx s={[0.15, 0.82, 0.025]} p={[0, 0, -0.02]} c="#f2eee4" ro={0.6} rad={0.012} />
    <Cy rt={0.026} h={0.66} p={[0, 0.03, 0]} c="#e8f0f4" o={0.35} ro={0.05} />
    <Sp rad={0.05} p={[0, -0.33, 0]} c="#d22a22" e="#ff2a10" ei={0.5} ro={0.25} />
    <Cy rt={0.013} h={hh} p={[0, -0.3 + hh / 2, 0]} c="#d22a22" e="#ff2a10" ei={0.6} ro={0.3} />
    {Array.from({ length: 11 }, (_, i) => <Bx key={i} s={[i % 5 === 0 ? 0.05 : 0.03, 0.005, 0.004]} p={[0.055, -0.3 + i * 0.062, 0.002]} c="#1a1a1a" ns />)}
    {mk !== undefined && <Bx s={[0.17, 0.014, 0.012]} p={[0, -0.3 + mk * 0.62, 0.03]} c="#1f7a3a" e="#3fbf6a" ei={0.8} ns />}
  </group>;
};

const meterTex = () => canvasTex("mtr22", 256, 64, (g) => { g.fillStyle = "#c8302a"; g.fillRect(0, 0, 256, 64); g.fillStyle = "#fff"; g.font = BOLD(40); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("kWh", 128, 34); });
// 22 · el medidor de luz de la pared: bajo la cúpula de vidrio el disco de aluminio gira cada vez más rápido y los tambores del contador ruedan cuando entran las resistencias
export const HMeterspin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), run = win(u, 0.22, 0.6), sp = 1 + 13 * run, ang = tt * (2 + 26 * run), kwh = 48210 + tt * sp * 1.3;
  const coil = (x: number) => <group position={[x, 0.95, 0.02]}>
    <Bx s={[0.26, 0.4, 0.1]} c="#2a2c30" m={0.5} ro={0.4} rad={0.02} />
    {Array.from({ length: 5 }, (_, i) => <Cy key={i} rt={0.016} h={0.2} p={[0, -0.14 + i * 0.07, 0.055]} r={[0, 0, Math.PI / 2]} c={mix("#5a5652", "#ff4a1a", run)} e="#ff3a10" ei={3.2 * run} ro={0.4} />)}
    <Puff p={[0, 0, 0.12]} s={0.55} c="#ff6a2a" o={0.55 * run} />
  </group>;
  return <S3 p={lv([0.25, 1.0, 1.5], [0.0, 0.96, 1.25], win(u, 0, 1))} l={[0, 0.95, 0]} fov={34} floor={null}>
    <Wall />
    {coil(-0.58)}{coil(0.58)}
    <Tube pts={[[-0.45, 0.95, 0.05], [-0.35, 0.9, 0.08], [-0.26, 0.95, 0.09]]} rad={0.008} c="#1a1a1a" />
    <Tube pts={[[0.45, 0.95, 0.05], [0.35, 0.9, 0.08], [0.26, 0.95, 0.09]]} rad={0.008} c="#1a1a1a" />
    <Bx s={[0.5, 0.72, 0.07]} p={[0, 0.95, 0.03]} c="#d9d6cf" ro={0.5} rad={0.03} />
    <Cy rt={0.225} h={0.09} p={[0, 0.88, 0.09]} r={[Math.PI / 2, 0, 0]} c="#eceff1" o={0.28} ro={0.05} />
    <To R={0.225} t={0.014} p={[0, 0.88, 0.135]} c="#aeb4ba" m={1} ro={0.2} />
    <Cy rt={0.2} h={0.01} p={[0, 0.88, 0.075]} r={[Math.PI / 2, 0, 0]} c="#2a2c30" ro={0.6} />
    <group position={[0, 0.88, 0.1]} rotation={[0, 0, -ang]}>
      <Cy rt={0.185} h={0.01} r={[Math.PI / 2, 0, 0]} c="#d8dde2" m={1} ro={0.18} />
      <Bx s={[0.15, 0.022, 0.006]} p={[0.1, 0, 0.007]} c="#111" ns />
      <Bx s={[0.15, 0.022, 0.006]} p={[-0.1, 0, 0.007]} c="#111" ns />
      <Cy rt={0.185} h={0.012} r={[Math.PI / 2, 0, 0]} c="#ffffff" o={0.35 * run} ro={0.3} />
    </group>
    <Sp rad={0.018} p={[0, 0.88, 0.115]} c="#9aa0a6" m={1} ro={0.2} />
    <Bx s={[0.4, 0.1, 0.02]} p={[0, 1.22, 0.07]} c="#0d0d0d" rad={0.01} />
    <Odo v={kwh} n={5} p={[0, 1.22, 0.085]} s={0.58} />
    <Pl w={0.14} h={0.035} p={[0, 0.63, 0.07]} map={meterTex()} c="#ffffff" ro={0.6} />
  </S3>;
}}</Stage>;

// 23 · el gatillo: el dedo baja un solo grado en el termostato y la primera ficha cae; la fila de dominó llega hasta la resistencia, que se pone al rojo vivo
export const HTrigger: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), pr = Math.sin(win(u, 0.04, 0.2) * Math.PI), N = 9, hot = win(u, 0.66, 0.8), dn = u > 0.12;
  return <S3 p={lv([0.15, 0.6, 1.5], [0.02, 0.5, 1.2], win(u, 0, 1))} l={[0.02, 0.28, 0]} fov={38}>
    <Bx s={[4, 2.2, 0.05]} p={[0, 0.8, -0.3]} map={PLASTER()} c="#e9e0cf" ro={0.95} ns />
    <Bx s={[2.2, 0.05, 0.7]} p={[0, -0.025, 0]} c="#8a6a48" ro={0.6} />
    <Bx s={[0.34, 0.34, 0.05]} p={[-0.62, 0.52, -0.25]} c="#f1eee6" ro={0.4} rad={0.03} />
    <Cy rt={0.12} h={0.02} p={[-0.62, 0.55, -0.215]} r={[Math.PI / 2, 0, 0]} c="#1c1d20" ro={0.3} />
    <Txt t={dn ? "71" : "72"} w={0.15} c="#9ff0b0" p={[-0.62, 0.55, -0.2]} />
    <Bx s={[0.08, 0.05, 0.02]} p={[-0.62, 0.4, -0.22 + 0.012 * pr]} c="#c9ccd0" m={0.5} />
    <group position={[-0.5 + 0.1 * (1 - pr), 0.4, 0.5 - 0.57 * pr]} rotation={[0, 0, 0]}>
      <Cy rt={0.028} h={0.34} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.1]} c="#d9a07c" ro={0.6} />
      <Sp rad={0.028} p={[0, 0, -0.07]} c="#d9a07c" ro={0.6} />
      <Cy rt={0.05} h={0.2} r={[Math.PI / 2, 0, 0]} p={[0.02, -0.02, 0.38]} c="#d9a07c" ro={0.6} />
    </group>
    {Array.from({ length: N }, (_, i) => {
      const f = cl((u - 0.2 - i * 0.035) / 0.08), x = -0.38 + i * 0.095;
      return <group key={i} position={[x + 0.015, 0.002, 0]} rotation={[0, 0, -f * 1.45]}>
        <Bx s={[0.03, 0.2, 0.1]} p={[-0.015, 0.1, 0]} c="#f4f1ea" ro={0.4} rad={0.008} />
        <Sp rad={0.006} p={[-0.015, 0.14, 0.052]} c="#222" ns /><Sp rad={0.006} p={[-0.015, 0.07, 0.052]} c="#222" ns />
      </group>;
    })}
    <group position={[0.65, 0, 0]}>
      <Bx s={[0.34, 0.34, 0.24]} p={[0, 0.17, 0]} c="#3a3d42" m={0.6} ro={0.35} rad={0.02} />
      {Array.from({ length: 5 }, (_, i) => <Cy key={i} rt={0.017} h={0.26} p={[0, 0.05 + i * 0.06, 0.125]} r={[0, 0, Math.PI / 2]} c={mix("#5a5652", "#ff3a10", hot)} e="#ff3a10" ei={3.5 * hot} ro={0.4} />)}
      <Puff p={[0, 0.17, 0.2]} s={0.8} c="#ff5a1a" o={0.6 * hot} />
      {Array.from({ length: 5 }, (_, i) => { const f = (tt * 0.5 + i / 5) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.2, 0.36 + f * 0.3, 0.1]} s={0.12 + f * 0.1} c="#ff9a4a" o={0.4 * hot * Math.sin(f * Math.PI)} />; })}
      <pointLight position={[0, 0.25, 0.5]} color="#ff5a2a" intensity={2.4 * hot} distance={2} />
    </group>
  </S3>;
}}</Stage>;

// 24 · el candado por temperatura: el mercurio sube por encima de la marca de 35° y el candado abierto cae sobre la caja de las resistencias y cierra el arco con un clic
export const HLockout: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), out = lerp(25, 45, win(u, 0.05, 0.5)), fall = drop(u, 0.42, 0.56), shut = win(u, 0.58, 0.62), click = bump(u, 0.58, 40, 14);
  return <S3 p={lv([0.15, 0.55, 1.5], [0.05, 0.45, 1.25], win(u, 0, 1))} l={[0.08, 0.38, 0]} fov={36}>
    <Wall y={0.9} z={-0.25} c="#eadfc9" />
    <Bx s={[0.62, 0.52, 0.34]} p={[-0.25, 0.26, 0]} c="#4a4e55" m={0.6} ro={0.35} rad={0.025} />
    <Bx s={[0.5, 0.4, 0.02]} p={[-0.25, 0.26, 0.18]} c="#2a2c30" m={0.4} ro={0.4} />
    {[0, 1, 2].map((i) => <Cy key={i} rt={0.018} h={0.4} p={[-0.25, 0.13 + i * 0.13, 0.2]} r={[0, 0, Math.PI / 2]} c={mix("#5a5652", "#ff3a10", 0.25 * (1 - shut))} e="#ff3a10" ei={0.8 * (1 - shut)} />)}
    <group position={[-0.25, 0.66 + (1 - fall) * 0.6 - click * 0.012, 0.22]} scale={fall > 0.001 ? 1 : 0.001}>
      <Bx s={[0.22, 0.17, 0.08]} c="#c9a24a" m={0.95} ro={0.25} rad={0.02} />
      <Cy rt={0.018} h={0.02} p={[0, 0.0, 0.042]} r={[Math.PI / 2, 0, 0]} c="#1a1a1a" />
      <group position={[-0.07, 0.085, 0]} rotation={[0, (1 - shut) * 0.9, 0]}>
        <To R={0.07} t={0.016} arc={Math.PI} p={[0.07, (1 - shut) * 0.05, 0]} c="#c0c4c8" m={1} ro={0.2} />
      </group>
    </group>
    <Thermo p={[0.55, 0.42, 0.05]} v={(out - 25) / 20} mk={0.5} s={1.05} />
  </S3>;
}}</Stage>;

const billTop = () => canvasTex("billtop", 512, 350, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 512, 350); g.fillStyle = "#2b4d6e"; g.fillRect(0, 0, 512, 92); g.fillStyle = "#fff"; g.font = BOLD(42); g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("JANUARY · ELECTRIC", 24, 62); g.fillStyle = "#c9c6bd"; for (let i = 0; i < 4; i++) g.fillRect(24, 124 + i * 40, 300 + (i % 2) * 90, 16); g.fillStyle = "#6b6760"; g.font = BOLD(34); g.fillText("TOTAL", 24, 320); });
const billBot = () => canvasTex("billbot", 512, 350, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 512, 350); g.fillStyle = "#c9c6bd"; for (let i = 0; i < 5; i++) g.fillRect(24, 30 + i * 44, 260 + (i % 3) * 80, 16); g.fillStyle = "#2b4d6e"; g.fillRect(0, 300, 512, 50); });
// 25 · la tijera: una tijera grande corta la factura de enero por la mitad, la mitad de abajo cae girando y en la que queda el total rueda de $412 a $220
export const HHalfbill: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cut = win(u, 0.14, 0.5), fall = win(u, 0.52, 0.8), roll = win(u, 0.62, 0.88), ob = Math.abs(Math.sin(tt * 9)) * (cut > 0 && cut < 1 ? 1 : 0.15);
  const sx = lerp(-0.34, 0.36, cut), sc = win(u, 0.06, 0.14) * (1 - win(u, 0.52, 0.6));
  return <S3 p={lv([0.12, 0.95, 1.35], [0.0, 0.9, 1.15], win(u, 0, 1))} l={[0, 0.8, 0]} fov={38}>
    <Bx s={[3, 0.04, 1.6]} p={[0, 0.3, -0.5]} c="#6b4a2e" ro={0.6} ns />
    <Bx s={[3, 1.6, 0.04]} p={[0, 1, -0.7]} c="#2b2f36" ro={0.9} ns />
    <Pl w={0.78} h={0.54} p={[0, 1.08 + 0.002, 0]} map={billTop()} c="#ffffff" ro={0.8} />
    <Bx s={[0.8, 0.012, 0.01]} p={[0, 0.81 + 0.0, -0.002]} c="#1a1a1a" o={cut > 0 ? 0.6 : 0} ns />
    <Odo v={lerp(412, 220, roll)} n={3} pre="$" p={[0.12, 0.95, 0.03]} s={1.05} />
    <group position={[0, 0.81 - fall * fall * 1.1, fall * 0.35]} rotation={[fall * 0.9, 0, fall * 0.8]}>
      <Pl w={0.78} h={0.54} p={[0, -0.27 + 0.0, 0]} map={billBot()} c="#ffffff" ro={0.8} />
    </group>
    <group position={[sx, 0.81, 0.05]} scale={sc + 0.001}>
      <group position={[-0.2, 0, 0]}>
        <group rotation={[0, 0, 0.3 * ob]}><Bx s={[0.34, 0.03, 0.006]} p={[0.17, 0.0, 0]} c="#e2e6ea" m={1} ro={0.12} rad={0.004} /><To R={0.06} t={0.016} p={[-0.1, 0.07, 0]} r={[0, 0, 0]} c="#c8302a" ro={0.4} /><Bx s={[0.08, 0.02, 0.012]} p={[-0.02, 0.02, 0]} c="#c8302a" ro={0.4} /></group>
        <group rotation={[0, 0, -0.3 * ob]}><Bx s={[0.34, 0.03, 0.006]} p={[0.17, 0.0, 0.01]} c="#cfd4d9" m={1} ro={0.12} rad={0.004} /><To R={0.06} t={0.016} p={[-0.1, -0.07, 0.01]} c="#c8302a" ro={0.4} /><Bx s={[0.08, 0.02, 0.012]} p={[-0.02, -0.02, 0.01]} c="#c8302a" ro={0.4} /></group>
        <Cy rt={0.014} h={0.03} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.005]} c="#9aa0a6" m={1} ro={0.2} />
      </group>
    </group>
  </S3>;
}}</Stage>;

const noteIcon = (i: number, k: number) => {
  if (i === 0) return <group>
    <Bx s={[0.15, 0.12, 0.04]} p={[0, -0.03, 0.02]} c="#c9a24a" m={0.95} ro={0.25} rad={0.015} />
    <To R={0.05} t={0.014} arc={Math.PI} p={[0, 0.03, 0.02]} c="#c0c4c8" m={1} ro={0.2} />
    <Cy rt={0.014} h={0.02} p={[0, -0.03, 0.045]} r={[Math.PI / 2, 0, 0]} c="#1a1a1a" /></group>;
  if (i === 1) return <group>
    <Bx s={[0.04, 0.16, 0.03]} p={[0, -0.02, 0.02]} c="#555a62" m={0.7} /><group position={[0, 0.06, 0.02]} rotation={[0, 0, 0.18 * Math.sin(k * 6)]}>
      <Bx s={[0.22, 0.014, 0.02]} c="#c9a24a" m={0.9} ro={0.3} />
      <Cy rt={0.04} h={0.01} p={[-0.1, -0.05, 0]} c="#9aa0a6" m={0.9} ro={0.3} /><Cy rt={0.04} h={0.01} p={[0.1, -0.05, 0]} c="#9aa0a6" m={0.9} ro={0.3} /></group></group>;
  return <Thermo p={[0, -0.005, 0.02]} v={0.3 + 0.5 * k} s={0.2} />;
};
const checkTex = () => canvasTex("chk26", 128, 128, (g) => { g.strokeStyle = "#1f7a3a"; g.lineWidth = 12; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.stroke(); g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(36, 66); g.lineTo(56, 86); g.lineTo(94, 42); g.stroke(); });
// 26 · las tres notas: tres notas adhesivas amarillas con un icono grande (candado, balanza, termómetro) se pegan una a una en la pared con un golpe y cada una recibe su sello verde
export const HThreeq: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h);
  return <S3 p={lv([0.1, 1.0, 1.4], [0.0, 0.96, 1.2], win(u, 0, 1))} l={[0, 0.95, 0]} fov={36} floor={null}>
    <Wall c="#e4dcc9" />
    {[0, 1, 2].map((i) => {
      const a = 0.08 + i * 0.24, f = drop(u, a, a + 0.1), sk = win(u, a + 0.12, a + 0.17), x = (i - 1) * 0.5;
      return <group key={i} position={[x, 0.95 + (i === 1 ? 0.02 : -0.01), 0.01 + (1 - f) * 0.45]} rotation={[(1 - f) * 0.5, 0, (i - 1) * 0.06 + (1 - f) * 0.2]} scale={f > 0.001 ? 1 : 0.001}>
        <Bx s={[0.4, 0.4, 0.012]} c={i === 1 ? "#ffe066" : "#ffd84a"} ro={0.8} rad={0.004} />
        <group scale={1.9} position={[0, 0.02, 0.01]}>{noteIcon(i, tt)}</group>
        <Pl w={0.17} h={0.17} p={[0.1, -0.12, 0.016 + 0.03 * (1 - sk)]} map={checkTex()} c="#ffffff" ro={0.5} />
      </group>;
    })}
  </S3>;
}}</Stage>;

// 27 · la luz a través del filtro: una linterna detrás de cada filtro; el haz atraviesa el limpio y pinta la mesa, y en el sucio queda tapado
export const HStraw: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.12, 0.3), dirt = win(u, 0.4, 0.58);
  const filt = (x: number, d: number) => {
    const mid = d ? mix("#f1ead8", "#6b6050", dirt) : "#f6f1e4";
    return <group position={[x, 0, 0]}>
      <Cy rt={0.045} rb={0.06} h={0.3} p={[0, 0.3, -0.38]} r={[Math.PI / 2, 0, 0]} c="#2a2c30" ro={0.4} />
      <Cy rt={0.05} h={0.02} p={[0, 0.3, -0.225]} r={[Math.PI / 2, 0, 0]} c="#fff6c8" e="#fff0b0" ei={2.5 * on} ro={0.2} />
      {!d && <mesh position={[0, 0.3, 0.2]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.34, 0.8, 32, 1, true]} /><meshBasicMaterial color="#fff2b8" transparent opacity={0.22 * on} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
      <Bx s={[0.56, 0.56, 0.05]} p={[0, 0.3, 0]} c="#9c7a4a" ro={0.6} rad={0.01} />
      <Bx s={[0.5, 0.5, 0.045]} p={[0, 0.3, 0.004]} c="#2a2c30" ro={0.9} ns />
      {Array.from({ length: 16 }, (_, i) => <Bx key={i} s={[0.03, 0.46, 0.03]} p={[-0.225 + i * 0.03, 0.3, 0.016]} r={[0, i % 2 ? 0.7 : -0.7, 0]} c={mid} e={d ? undefined : "#ffe9a0"} ei={d ? 1 : 1.5 * on} ro={1} ns />)}
      {d === 1 && Array.from({ length: 7 }, (_, i) => <Sp key={i} rad={0.05 + 0.02 * rnd(i)} p={[(rnd(i) - 0.5) * 0.38, 0.12 + rnd(i + 3) * 0.36, 0.04]} c="#3f382c" ro={1} sc={[1, 1, 0.3]} />)}
      {!d && <Puff p={[0, 0.0, 0.45]} s={1.0} c="#fff0b0" o={0.5 * on} r={[-Math.PI / 2, 0, 0]} />}
      {d === 1 && <Puff p={[0, 0.0, 0.2]} s={0.6} c="#000000" o={0.5 * dirt} add={false} r={[-Math.PI / 2, 0, 0]} />}
    </group>;
  };
  return <S3 p={lv([0.3, 0.7, 1.55], [0.1, 0.62, 1.3], win(u, 0, 1))} l={[0, 0.28, 0]} fov={38} exp={0.8}>
    {filt(-0.38, 0)}{filt(0.38, 1)}
  </S3>;
}}</Stage>;

// 28 · la vela de la corriente: una llama junto al marco de la puerta se acuesta con el aire frío que entra por la rendija; llega el burlete, la rendija se cierra y la llama se para derecha
export const HDraft: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), strip = drop(u, 0.5, 0.66), gap = 1 - cl(strip), lean = gap * 1.0 * win(u, 0.06, 0.2);
  return <S3 p={lv([0.2, 0.95, 1.3], [0.05, 0.9, 1.05], win(u, 0, 1))} l={[-0.05, 0.88, 0]} fov={36} floor={null}>
    <Wall y={1} z={-0.12} c="#e6dccb" />
    <Bx s={[0.9, 2.0, 0.06]} p={[-0.68, 1.0, -0.02]} c="#7a5638" ro={0.55} />
    <Bx s={[0.6, 1.5, 0.02]} p={[-0.68, 1.0, 0.02]} c="#6a4a30" ro={0.6} ns />
    <Bx s={[0.06, 2.0, 0.1]} p={[-0.19, 1.0, -0.04]} c="#f0e8da" ro={0.6} />
    <Bx s={[0.028, 2.0, 0.02]} p={[-0.215, 1.0, -0.05]} c="#fff6c8" e="#ffe9a0" ei={1.8 * gap} o={0.15 + 0.85 * gap} ns />
    <Bx s={[0.03, 1.9 * cl(strip) + 0.001, 0.05]} p={[-0.215, 2.0 - 0.95 * cl(strip), 0.0]} c="#1c1c1a" ro={0.9} />
    {Array.from({ length: 6 }, (_, i) => {
      const y0 = 0.45 + i * 0.16, pts = Array.from({ length: 24 }, (_, k) => [-0.2 + k * 0.015, y0 + 0.02 * Math.sin(k * 0.8 + tt * 5 + i), 0.0 + 0.01 * k] as V3);
      return gap > 0.05 ? <Tube key={i} pts={pts} rad={0.009} c="#bfe4ff" e="#7ac4ff" ei={1.2} o={0.7 * gap} /> : null;
    })}
    <Bx s={[0.5, 0.04, 0.2]} p={[0.16, 0.62, 0.06]} c="#6b4a2e" ro={0.6} />
    <group position={[0.16, 0.64, 0.06]}>
      <Cy rt={0.045} h={0.2} p={[0, 0.1, 0]} c="#f4efe2" ro={0.6} />
      <Cy rt={0.004} h={0.03} p={[0, 0.215, 0]} c="#1a1a1a" />
      <group position={[0, 0.21, 0]} rotation={[0, 0, -lean]}>
        <Flame p={[0, 0, 0]} s={2.1} u={tt} i={1} warm={0.6} />
        <Puff p={[0, 0.1, 0.02]} s={0.4} c="#ffb040" o={0.55} />
      </group>
    </group>
    <pointLight position={[0.2, 0.9, 0.5]} color="#ffb060" intensity={1.2} distance={2} />
  </S3>;
}}</Stage>;

// 29 · la heladera al revés: corte de una heladera con el serpentín trasero al rojo vivo soltando calor hacia afuera; la misma máquina gira media vuelta y el calor entra a la casita
export const HFridgeheater: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), turn = win(u, 0.36, 0.64) * Math.PI, heat = 0.6 + 0.4 * win(u, 0, 0.2), arrive = win(u, 0.62, 0.85);
  const zig = Array.from({ length: 11 }, (_, i) => [0.285, 0.12 + i * 0.075, i % 2 ? 0.14 : -0.14] as V3);
  return <S3 p={lv([0.1, 0.7, 1.7], [-0.15, 0.65, 1.5], win(u, 0, 1))} l={[-0.35, 0.45, 0]} fov={40}>
    <Bx s={[3.4, 0.04, 1.4]} p={[-0.3, 0.0, 0]} c="#d8d2c4" ro={0.7} ns />
    <group position={[-0.95, 0, 0.0]}>
      <Bx s={[0.62, 0.42, 0.42]} p={[0, 0.21, 0]} c="#efe4cf" ro={0.7} rad={0.02} />
      <mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.5, 0.3, 4]} /><meshStandardMaterial color="#9a4a38" roughness={0.7} /></mesh>
      <Bx s={[0.2, 0.2, 0.01]} p={[0.0, 0.25, 0.216]} c="#ffd27a" e="#ffb040" ei={0.3 + 2.2 * arrive} ro={0.4} />
      <Puff p={[0.35, 0.28, 0.2]} s={0.9} c="#ff9a4a" o={0.5 * arrive} />
      <pointLight position={[0.2, 0.3, 0.5]} color="#ff9a4a" intensity={2 * arrive} distance={2} />
    </group>
    <group position={[0.15, 0, 0]} rotation={[0, turn, 0]}>
      <Bx s={[0.5, 0.03, 0.4]} p={[0, 0.015, 0]} c="#c9ccd0" m={0.5} ro={0.4} />
      <Bx s={[0.5, 0.03, 0.4]} p={[0, 0.9, 0]} c="#eceff1" m={0.2} ro={0.4} />
      <Bx s={[0.03, 0.9, 0.4]} p={[-0.235, 0.45, 0]} c="#f2f2f0" m={0.2} ro={0.3} rad={0.01} />
      <Bx s={[0.025, 0.4, 0.04]} p={[-0.26, 0.5, 0.12]} c="#9aa0a6" m={0.9} ro={0.25} />
      <Bx s={[0.03, 0.9, 0.4]} p={[0.235, 0.45, 0]} c="#e4e6e8" m={0.2} ro={0.4} />
      <Pl w={0.44} h={0.84} p={[0, 0.45, 0]} c="#bfe0f4" e="#9fd0f0" ei={0.4} o={0.25} side={2} />
      {[0.25, 0.5, 0.75].map((y, i) => <group key={i}><Bx s={[0.44, 0.012, 0.36]} p={[0, y, 0]} c="#d8eaf4" o={0.5} ro={0.05} />
        <Bx s={[0.08, 0.14, 0.08]} p={[-0.12, y + 0.075, 0.05]} c={["#e8f0f8", "#f4d03f", "#6aa86a"][i]} ro={0.5} /><Sp rad={0.05} p={[0.1, y + 0.05, -0.05]} c={["#d8503a", "#f08a3a", "#c8e060"][i]} ro={0.5} /></group>)}
      <Tube pts={zig} rad={0.014} seg={120} c={mix("#2a2c30", "#ff3a10", heat)} e="#ff3a10" ei={2.6 * heat} />
      <Puff p={[0.32, 0.5, 0]} s={0.8} c="#ff4a1a" o={0.55 * heat} r={[0, Math.PI / 2, 0]} />
      {Array.from({ length: 8 }, (_, i) => { const f = (tt * 0.45 + i / 8) % 1; return <Puff key={i} p={[0.32 + f * 0.6, 0.15 + rnd(i) * 0.7, (rnd(i + 2) - 0.5) * 0.3]} s={0.22 + f * 0.12} c="#ff8a3a" o={0.55 * Math.sin(f * Math.PI) * heat} />; })}
    </group>
  </S3>;
}}</Stage>;

const sheetTex = () => canvasTex("svc30", 512, 680, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 512, 680); g.fillStyle = "#2b4d6e"; g.fillRect(0, 0, 512, 84); g.fillStyle = "#fff"; g.font = BOLD(44); g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("SERVICE REPORT", 28, 58);
  for (let i = 0; i < 5; i++) { g.strokeStyle = "#8a8f96"; g.lineWidth = 4; g.strokeRect(30, 120 + i * 62, 34, 34); g.fillStyle = "#c9c6bd"; g.fillRect(84, 128 + i * 62, 250 + (i % 3) * 60, 16); if (i < 3) { g.strokeStyle = "#1f7a3a"; g.lineWidth = 7; g.beginPath(); g.moveTo(36, 138 + i * 62); g.lineTo(46, 150 + i * 62); g.lineTo(62, 124 + i * 62); g.stroke(); } } });
const stampTex = () => canvasTex("stp30", 640, 220, (g) => { g.clearRect(0, 0, 640, 220); g.strokeStyle = "#c8302a"; g.lineWidth = 14; g.strokeRect(14, 14, 612, 192); g.lineWidth = 5; g.strokeRect(30, 30, 580, 160); g.fillStyle = "#c8302a"; g.font = BOLD(104); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NOT BROKEN", 320, 114); for (let i = 0; i < 160; i++) { g.clearRect(rnd(i) * 640, rnd(i, 3) * 220, 3 + rnd(i, 5) * 5, 2 + rnd(i, 7) * 4); } });
// 30 · el sello del veredicto: la unidad humea al fondo y un sello de goma grande baja con rebote sobre la hoja de servicio y deja la marca roja NOT BROKEN
export const HVerdict: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), dn = drop(u, 0.38, 0.5), up = win(u, 0.58, 0.76), hit = bump(u, 0.46, 34, 12), mk = win(u, 0.465, 0.485);
  return <S3 p={lv([0.1, 1.15, 0.95], [0.0, 0.98, 0.78], win(u, 0, 1))} l={[0, 0.03, 0.0]} fov={40}>
    <Bx s={[3, 0.04, 2.2]} p={[0, -0.02, -0.3]} c="#7b573a" ro={0.6} ns />
    <HPU p={[-0.6, 0, -0.75]} s={0.95} fan={tt * 6} />
    {Array.from({ length: 9 }, (_, i) => { const f = (tt * 0.3 + i / 9) % 1; return <Puff key={i} p={[-0.6 + (rnd(i) - 0.5) * 0.3 + f * 0.1, 0.6 + f * 0.9, -0.75]} s={0.3 + f * 0.4} c="#f4f6f8" o={0.5 * Math.sin(f * Math.PI)} add={false} />; })}
    <group rotation={[hit * 0.015, 0, 0]}>
      <Pl w={0.64} h={0.86} p={[0, 0.003, 0.05]} r={[-Math.PI / 2, 0, 0.03]} map={sheetTex()} c="#ffffff" ro={0.9} />
      <Pl w={0.5} h={0.17} p={[0.0, 0.007, 0.28]} r={[-Math.PI / 2, 0, 0.12]} map={stampTex()} c="#ffffff" o={0.95 * mk} ro={0.8} />
    </group>
    <group position={[0.0, 0.05 + (1 - dn) * 0.5 + up * 0.5, 0.28]} rotation={[0, 0.12, 0]}>
      <Bx s={[0.5, 0.06, 0.19]} p={[0, 0.03, 0]} c="#c8302a" ro={0.8} rad={0.01} />
      <Bx s={[0.46, 0.08, 0.16]} p={[0, 0.1, 0]} c="#3a2a1c" ro={0.5} rad={0.02} />
      <Cy rt={0.04} rb={0.05} h={0.2} p={[0, 0.24, 0]} c="#6b4a2e" ro={0.5} />
      <Sp rad={0.075} p={[0, 0.38, 0]} c="#6b4a2e" ro={0.45} />
    </group>
  </S3>;
}}</Stage>;

// 31 · la balanza de grados: en un platillo el termómetro de afuera baja de 50 a 18 y el otro platillo, con la bomba trabajando cada vez más, sube
export const HSeesawtemp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.1, 0.78), out = lerp(50, 18, k), tilt = lerp(-0.26, 0.26, k) + bump(u, 0.78, 20, 7) * 0.03;
  const L = 0.52, py = 0.7, ex = (s: number): V3 => [s * L * Math.cos(tilt), py + s * L * Math.sin(tilt), 0];
  const pan = (s: number, children: React.ReactNode) => { const e = ex(s); return <group>
    <Tube pts={[e, [e[0] - 0.14, e[1] - 0.3, 0]]} rad={0.006} c="#9aa0a6" m={0.8} />
    <Tube pts={[e, [e[0] + 0.14, e[1] - 0.3, 0]]} rad={0.006} c="#9aa0a6" m={0.8} />
    <Cy rt={0.24} rb={0.2} h={0.03} p={[e[0], e[1] - 0.31, 0]} c="#c9a24a" m={0.9} ro={0.3} />
    <group position={[e[0], e[1] - 0.29, 0]}>{children}</group></group>; };
  return <S3 p={lv([0, 0.8, 1.55], [0, 0.72, 1.3], win(u, 0, 1))} l={[0, 0.5, 0]} fov={38}>
    <Wall y={0.9} z={-0.35} c="#d9d2c2" />
    <mesh position={[0, 0.34, 0]} castShadow><coneGeometry args={[0.14, 0.7, 4]} /><meshStandardMaterial color="#3a3d42" metalness={0.5} roughness={0.4} /></mesh>
    <Cy rt={0.4} rb={0.4} h={0.03} p={[0, 0.0, 0]} c="#3a3d42" m={0.5} />
    <group position={[0, py, 0]} rotation={[0, 0, tilt]}><Bx s={[1.1, 0.05, 0.1]} c="#c9a24a" m={0.9} ro={0.3} rad={0.015} /></group>
    <Sp rad={0.05} p={[0, py, 0.03]} c="#9aa0a6" m={1} ro={0.2} />
    {pan(-1, <Thermo p={[0, 0.34, 0]} v={(out - 18) / 32} s={0.62} />)}
    {pan(1, <group><HPU p={[0, 0, 0]} s={0.58} fan={tt * (5 + 16 * k)} /><Puff p={[0, 0.25, 0.3]} s={0.6} c="#ff7a3a" o={0.5 * k} /></group>)}
  </S3>;
}}</Stage>;

const dayTex = (d: number) => {
  const D = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], bad = d === 4 || d === 5;
  return canvasTex(`day32|${d}`, 400, 440, (g) => { g.fillStyle = bad ? "#fff1ec" : "#fbfaf6"; g.fillRect(0, 0, 400, 440); g.fillStyle = bad ? "#c8302a" : "#2a2520"; g.font = BOLD(110); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(D[d], 200, 180);
    g.font = BOLD(190); g.fillText(String(12 + d), 200, 340);
    if (bad) { g.strokeStyle = "#e02a1a"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.ellipse(200, 250, 170, 190, -0.08, 0.2, Math.PI * 2 + 0.05); g.stroke(); } });
};
// 32 · el almanaque: las hojas grandes de lunes a domingo se arrancan una a una; viernes y sábado salen con un círculo rojo de marcador y el teléfono suena y vibra encima
export const HWeekend: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), s = win(u, 0.05, 0.86) * 6.999, idx = Math.floor(s), ph = s - idx, tear = win(ph, 0.0, 0.45), bad = idx === 4 || idx === 5 || (idx === 3 && tear > 0.6);
  const ring = bad ? Math.sin(tt * 9) : 0;
  return <S3 p={lv([0.12, 1.05, 1.4], [0.0, 1.0, 1.2], win(u, 0, 1))} l={[0.05, 0.98, 0]} fov={36} floor={null}>
    <Wall c="#e1d8c6" />
    <Bx s={[0.74, 0.8, 0.03]} p={[0, 1.02, -0.02]} c="#3a3a3a" ro={0.5} />
    <Bx s={[0.74, 0.1, 0.06]} p={[0, 1.46, 0.0]} c="#c8302a" ro={0.5} rad={0.015} />
    {[-0.22, 0.22].map((x, i) => <To key={i} R={0.03} t={0.008} p={[x, 1.46, 0.04]} c="#c0c4c8" m={1} ro={0.2} />)}
    {idx < 6 && <Pl w={0.64} h={0.7} p={[0, 1.0, 0.03]} map={dayTex(idx + 1)} c="#ffffff" ro={0.9} />}
    {idx === 6 && <Pl w={0.64} h={0.7} p={[0, 1.0, 0.03]} map={dayTex(6)} c="#ffffff" ro={0.9} />}
    <group position={[0, 1.35 - tear * tear * 0.9, 0.05 + tear * 0.3]} rotation={[-tear * 1.4, 0, tear * 0.5]}>
      <Pl w={0.64} h={0.7} p={[0, -0.35, 0]} map={dayTex(Math.min(6, idx))} c="#ffffff" ro={0.9} o={idx >= 6 ? 0 : 1 - win(tear, 0.7, 1)} />
    </group>
    <group position={[0.55 + 0.003 * ring, 0.6 + 0.004 * Math.abs(ring), 0.14]} rotation={[0, -0.3, 0.12 * ring * (bad ? 1 : 0)]}>
      <Bx s={[0.2, 0.36, 0.035]} c="#16171a" m={0.4} ro={0.3} rad={0.025} />
      <Bx s={[0.17, 0.3, 0.004]} p={[0, 0, 0.02]} c={bad ? "#3fbf6a" : "#1c2a3a"} e={bad ? "#3fbf6a" : "#1c2a3a"} ei={bad ? 1.4 : 0.2} ns />
      {bad && [0.13, 0.19].map((r, i) => <To key={i} R={r} t={0.007} arc={Math.PI * 0.6} p={[0, 0.0, 0.03]} r={[0, 0, Math.PI * 0.2]} c="#ffd27a" e="#ffb040" ei={1.6} o={0.8 - i * 0.3} />)}
    </group>
  </S3>;
}}</Stage>;

const PEAKS: [number, string][] = [[0.2, "FAN HUM"], [0.42, "WHOOSH"], [0.62, "CLUNK"], [0.82, "HISS"]];
// 33 · el sismógrafo de las 3 a.m.: el rollo de papel corre bajo la aguja de tinta, que salta en cada ruido de la noche; cada pico levanta su cartel de una sola palabra
export const HBedjump: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), head = win(u, 0.04, 0.92), Lw = 2.0, nx = 0.3;
  const env = (x: number) => PEAKS.reduce((a, [p], i) => a + Math.exp(-Math.pow((x - p) * 42, 2)) * (0.6 + 0.12 * i), 0.04);
  const zAt = (x: number) => env(x) * 0.24 * Math.sin(x * 520);
  const q0 = Math.max(0, head - 0.98 / Lw), pts = Array.from({ length: 280 }, (_, i) => { const q = q0 + (head - q0) * (i / 279); return [nx - (head - q) * Lw, 0.027, zAt(q)] as V3; });
  const tip: V3 = [nx, 0.03, zAt(head)], post: V3 = [0.62, 0.34, -0.36], roll = head * Lw / 0.16;
  const gx = (head * Lw) % 0.1;
  return <S3 p={lv([0.05, 0.95, 1.2], [0.0, 0.85, 1.0], win(u, 0, 1))} l={[0.0, 0.1, -0.05]} fov={40}>
    <Bx s={[1.8, 0.05, 0.8]} p={[0, -0.025, 0]} c="#2a2c30" m={0.5} ro={0.4} rad={0.02} />
    <Bx s={[1.5, 0.014, 0.6]} p={[0.0, 0.008, 0]} c="#fbf7e8" ro={0.9} />
    {Array.from({ length: 15 }, (_, k) => { const x = -0.7 + k * 0.1 - gx; return x > -0.72 && x < 0.72 ? <Bx key={k} s={[0.004, 0.002, 0.6]} p={[x, 0.017, 0]} c="#a8c4e0" ns /> : null; })}
    {[-1, 1].map((s) => <group key={s} position={[s * 0.82, 0.11, 0]}>
      <Cy rt={0.1} h={0.62} r={[Math.PI / 2, 0, 0]} c="#efe6cf" ro={0.85} />
      <group rotation={[0, 0, roll * s]}><Bx s={[0.012, 0.1, 0.64]} p={[0.06, 0, 0]} c="#c9a24a" /></group>
    </group>)}
    <Bx s={[0.1, 0.4, 0.1]} p={[0.62, 0.2, -0.36]} c="#9aa0a6" m={0.8} ro={0.3} />
    <Tube pts={[post, [0.45, 0.2, -0.2], tip]} rad={0.012} c="#c9a24a" m={0.9} />
    <Sp rad={0.022} p={tip} c="#c8302a" e="#ff3a20" ei={1.5} />
    <Tube pts={pts} rad={0.0065} seg={280} c="#0f2a5a" e="#2a5aff" ei={0.6} />
    {PEAKS.map(([p, w], i) => { const xw = nx - (head - p) * Lw, o = win(head, p, p + 0.03) * win(xw, -0.62, -0.38);
      return o > 0.02 ? <group key={i} position={[xw, 0.26, -0.3]} scale={0.7 + 0.3 * o + 0.15 * bump(head, p + 0.01, 30, 12)}><Bx s={[0.4, 0.15, 0.02]} p={[0, 0, -0.012]} c="#14181f" ro={0.5} rad={0.01} /><Txt t={w} w={0.34} c="#9ff0b0" o={o} p={[0, 0, 0.003]} /></group> : null; })}
  </S3>;
}}</Stage>;

const padIcon = (i: number, tt: number, on: number) => {
  if (i === 0) return <group>{[0.14, 0.1, 0.07].map((w, j) => <Bx key={j} s={[w, 0.012, 0.018]} p={[0.04 * Math.sin(tt * 3 + j) - (0.14 - w) / 2, 0.02, -0.06 + j * 0.06]} c="#ffffff" e="#ffffff" ei={0.6 + on} ns />)}</group>;
  if (i === 1) return <group><Bx s={[0.14, 0.05, 0.1]} p={[0, 0.03, 0.02]} c="#c9ccd0" m={0.8} ro={0.3} /><Cy rt={0.045} h={0.02} p={[0, 0.07, -0.02]} c="#c8302a" /><Bx s={[0.1, 0.014, 0.014]} p={[0, 0.085, -0.02]} c="#c8302a" /></group>;
  if (i === 2) return <group>{[0, 1, 2].map((j) => { const f = (tt * 0.6 + j / 3) % 1; return <Sp key={j} rad={0.03 + 0.02 * f} p={[(j - 1) * 0.05, 0.03 + f * 0.1, 0]} c="#ffffff" e="#ffffff" ei={0.8} ro={0.5} ns />; })}</group>;
  if (i === 3) return <group position={[0, 0.04, 0]} rotation={[0, tt * 8, 0]}>{[0, 1, 2].map((j) => <Bx key={j} s={[0.1, 0.008, 0.04]} p={[0.05 * Math.cos(j * 2.094), 0, -0.05 * Math.sin(j * 2.094)]} r={[0.3, j * 2.094, 0]} c="#ffffff" e="#ffffff" ei={0.6} ns />)}</group>;
  return <group position={[0.004 * Math.sin(tt * 30) * on, 0.04, 0]} rotation={[0, tt * 3, 0]}><Cy rt={0.06} h={0.03} c="#e8d8d8" e="#ffffff" ei={0.8} />{Array.from({ length: 8 }, (_, j) => <Bx key={j} s={[0.03, 0.03, 0.03]} p={[0.075 * Math.cos(j * 0.785), 0, 0.075 * Math.sin(j * 0.785)]} r={[0, -j * 0.785, 0]} c="#e8d8d8" e="#ffffff" ei={0.8} ns />)}</group>;
};
const PADC = ["#3fbf6a", "#3fbf6a", "#3fbf6a", "#3fbf6a", "#e2342a"];
// 34 · la consola de sonidos: cuatro pads grandes con su icono se encienden en verde al sonar (normales) y el último, el del raspado, late fuerte en rojo y baña la mesa
export const HSoundboard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), red = win(u, 0.7, 0.8), pulse = 0.65 + 0.35 * Math.sin(tt * 8);
  return <S3 p={lv([0, 1.25, 1.3], [0, 1.1, 1.1], win(u, 0, 1))} l={[0, 0.03, 0.02]} fov={38}>
    <Bx s={[1.8, 0.1, 0.62]} p={[0, 0.05, 0]} c="#1c1d20" m={0.4} ro={0.35} rad={0.03} />
    <Bx s={[1.7, 0.02, 0.1]} p={[0, 0.105, -0.24]} c="#2a2c30" ro={0.5} />
    {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => <Bx key={i} s={[0.05, 0.03, 0.03]} p={[x, 0.125, -0.24 + 0.0]} c="#c9ccd0" m={0.8} />)}
    {PADC.map((c, i) => { const a = 0.08 + i * 0.15, on = i < 4 ? win(u, a, a + 0.04) * (1 - win(u, a + 0.12, a + 0.16) * 0.65) : red * pulse, press = Math.sin(win(u, a, a + 0.06) * Math.PI);
      return <group key={i} position={[-0.64 + i * 0.32, 0.1 - press * 0.012, 0.06]}>
        <Bx s={[0.28, 0.04, 0.28]} p={[0, 0.02, 0]} c={c} e={c} ei={0.08 + on * 1.8} ro={0.3} rad={0.02} />
        <group position={[0, 0.045, 0]}>{padIcon(i, tt, on)}</group>
      </group>; })}
    <Puff p={[0.64, 0.12, 0.08]} s={1.1} c="#ff2a1a" o={0.7 * red * pulse} r={[-Math.PI / 2, 0, 0]} />
    <pointLight position={[0.64, 0.4, 0.3]} color="#ff2a1a" intensity={3 * red * pulse} distance={2} />
  </S3>;
}}</Stage>;

const tkTex = () => canvasTex("tk35", 256, 340, (g) => { g.fillStyle = "#fbf3d6"; g.fillRect(0, 0, 256, 340); g.fillStyle = "#c8302a"; g.fillRect(0, 0, 256, 18); g.fillStyle = "#1a1a1a"; g.font = BOLD(120); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$100", 128, 160); g.fillStyle = "#9a9588"; for (let i = 0; i < 4; i++) g.fillRect(40, 240 + i * 22, 176 - (i % 2) * 40, 8); });
const bandTex = () => canvasTex("bd35", 512, 160, (g) => { g.fillStyle = "#1f7a3a"; g.fillRect(0, 0, 512, 160); g.fillStyle = "#fff6c8"; g.font = BOLD(104); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$1,500", 256, 84); });
// 35 · el boleto: una máquina expendedora imprime un ticket de $100 de revisión y, al lado, una torre de billetes de $1,500 de arreglo lo deja chiquito
export const HCheckup: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tk = win(u, 0.1, 0.38), n = Math.floor(win(u, 0.42, 0.78) * 18), thump = bump(u, 0.12, 24, 9) * 0.01;
  return <S3 p={lv([0.1, 0.65, 1.55], [0.05, 0.55, 1.3], win(u, 0, 1))} l={[0.02, 0.4, 0]} fov={38}>
    <Wall y={0.9} z={-0.4} c="#cfd6dc" />
    <group position={[-0.5, 0, 0]}>
      <Bx s={[0.46, 0.82, 0.34]} p={[0, 0.41 + thump, 0]} c="#c8302a" m={0.3} ro={0.35} rad={0.025} />
      <Bx s={[0.36, 0.26, 0.02]} p={[0, 0.62, 0.175]} c="#10141a" ro={0.2} />
      <Txt t="CHECK-UP" w={0.3} c="#9ff0b0" p={[0, 0.66, 0.188]} />
      <Txt t="$100" w={0.2} c="#fff3d6" p={[0, 0.58, 0.188]} />
      <Bx s={[0.3, 0.035, 0.03]} p={[0, 0.35, 0.18]} c="#050505" ns />
      <Bx s={[0.3, 0.1, 0.05]} p={[0, 0.2, 0.19]} c="#2a2c30" ro={0.5} />
      <group position={[0, 0.355, 0.19]}><Pl w={0.26} h={0.34} p={[0, -0.17 * tk, 0.0]} map={tkTex()} c="#ffffff" ro={0.9} sc={[1, tk + 0.001, 1]} /></group>
    </group>
    <group position={[0.42, 0, 0]}>
      {Array.from({ length: n }, (_, i) => <Bx key={i} s={[0.4, 0.034, 0.22]} p={[(rnd(i) - 0.5) * 0.02, 0.017 + i * 0.034, (rnd(i + 5) - 0.5) * 0.02]} r={[0, (rnd(i) - 0.5) * 0.12, 0]} c={i % 2 ? "#8fbf80" : "#9fc890"} ro={0.8} />)}
      {n > 4 && <Pl w={0.42} h={0.13} p={[0, 0.034 * n - 0.12, 0.125]} map={bandTex()} c="#ffffff" ro={0.7} />}
      {n > 4 && <Bx s={[0.405, 0.012, 0.225]} p={[0, 0.034 * n - 0.18, 0]} c="#fff6c8" ns />}
    </group>
  </S3>;
}}</Stage>;

// 36 · el relevo: la bomba corre con el testigo, llega a la línea y se lo pasa a un furnace a gas, que sale corriendo; la llama del testigo cambia de naranja a azul
export const HDualfuel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = win(u, 0.04, 0.5), pass = win(u, 0.46, 0.6), b = win(u, 0.58, 0.92);
  const px = lerp(-1.0, -0.2, a) - 0.0, fx = lerp(0.25, 0.95, b), bx = lerp(px + 0.2, fx - 0.18, pass), run = (x: number) => 0.55 * Math.sin(tt * 11 + x * 4);
  const runningP = a < 0.99, runningF = b > 0.01 && b < 0.99;
  const leg = (s: number, on: boolean) => <group>{[-1, 1].map((q) => <group key={q} position={[q * 0.1, 0.12, 0]} rotation={[on ? q * run(s) * 0.7 : 0, 0, 0]}><Cy rt={0.022} h={0.14} p={[0, -0.07, 0]} c="#2a2c30" ro={0.5} /><Bx s={[0.07, 0.03, 0.12]} p={[0, -0.14, 0.03]} c="#e8e8e8" ro={0.5} /></group>)}</group>;
  return <S3 p={lv([0.1, 0.55, 1.55], [0.1, 0.5, 1.35], win(u, 0, 1))} l={[(px + fx) / 2 * 0.8, 0.28, 0]} fov={40}>
    <Bx s={[3.4, 0.03, 0.7]} p={[0, -0.0, 0]} c="#b8503a" ro={0.9} ns />
    <Bx s={[3.4, 0.01, 0.01]} p={[0, 0.02, 0.2]} c="#ffffff" ns /><Bx s={[3.4, 0.01, 0.01]} p={[0, 0.02, -0.2]} c="#ffffff" ns />
    <Bx s={[0.05, 0.012, 0.7]} p={[0.0, 0.02, 0]} c="#ffffff" e="#ffffff" ei={0.5} ns />
    <Bx s={[3.4, 1.4, 0.03]} p={[0, 0.7, -0.4]} map={PLASTER()} c="#9fb0c0" ro={0.95} ns />
    <group position={[px, 0.0, 0]}>{leg(px, runningP)}<HPU p={[0, 0.14, 0]} s={0.7} fan={tt * 12} /></group>
    <group position={[fx, 0.0, 0.0]}>{leg(fx, runningF)}
      <group position={[0, 0.14, 0]}>
        <Bx s={[0.32, 0.52, 0.3]} p={[0, 0.26, 0]} c="#d8d4cc" m={0.35} ro={0.4} rad={0.02} />
        <Bx s={[0.2, 0.2, 0.01]} p={[0, 0.3, 0.155]} c="#10141a" ro={0.2} />
        <Flame p={[0, 0.22, 0.16]} s={0.9} u={tt} i={3} warm={0} /><Puff p={[0, 0.3, 0.18]} s={0.3} c="#5aa0ff" o={0.5} />
        <Cy rt={0.035} h={0.18} p={[0.08, 0.6, 0]} c="#9aa0a6" m={0.8} ro={0.3} />
        {[0.46, 0.4, 0.34].map((y, i) => <Bx key={i} s={[0.2, 0.012, 0.01]} p={[0, y, 0.155]} c="#8a8e94" m={0.7} ns />)}
      </group>
    </group>
    <group position={[bx, 0.43 + 0.02 * Math.sin(tt * 10) * (a < 1 || b > 0 ? 1 : 0), 0.2]}>
      <Cy rt={0.018} h={0.2} p={[0, 0, 0]} r={[0, 0, Math.PI / 2 - 0.5]} c="#c9a24a" m={0.9} ro={0.3} />
      <Flame p={[0.08, 0.06, 0]} s={1.2} u={tt} i={2} warm={1 - pass} />
      <Puff p={[0.08, 0.12, 0]} s={0.35} c={mix("#ff9a3a", "#5aa0ff", pass)} o={0.6} />
    </group>
  </S3>;
}}</Stage>;

const BANDC = ["#e8a04a", "#e8c84a", "#a8c86a", "#7ab4e6"];
const US: [number, number][] = [[-124.7, 48.4], [-123.2, 48.2], [-122.8, 49.0], [-95.2, 49.0], [-94.6, 48.7], [-89.5, 48.0], [-84.8, 46.9], [-83.4, 46.0], [-82.5, 45.3], [-82.4, 43.0], [-83.1, 42.1], [-79.0, 42.8], [-76.5, 43.6], [-75.0, 45.0], [-71.5, 45.0], [-70.0, 46.7], [-68.0, 47.4], [-67.0, 45.2], [-69.0, 43.9], [-70.7, 43.0], [-70.0, 41.7], [-73.8, 40.9], [-74.0, 39.5], [-75.5, 38.0], [-76.0, 36.9], [-75.5, 35.2], [-77.5, 34.0], [-79.5, 33.0], [-81.2, 31.5], [-81.3, 30.0], [-80.0, 26.8], [-80.4, 25.2], [-81.2, 25.4], [-82.7, 27.7], [-82.8, 29.2], [-84.0, 30.1], [-85.4, 29.7], [-87.5, 30.3], [-89.5, 30.2], [-89.2, 29.0], [-91.5, 29.4], [-94.0, 29.6], [-97.0, 27.8], [-97.2, 26.0], [-99.5, 27.5], [-101.5, 29.8], [-103.2, 29.0], [-104.5, 29.7], [-106.5, 31.8], [-108.2, 31.8], [-111.0, 31.3], [-114.8, 32.5], [-117.1, 32.5], [-118.5, 34.0], [-120.6, 34.6], [-122.5, 37.5], [-124.0, 40.4], [-124.4, 43.0], [-124.0, 46.2]];
const LATB = [24, 33, 37.5, 42, 50];
const clipB = (poly: [number, number][], lo: number, hi: number) => {
  const cut = (p: [number, number][], keep: (q: [number, number]) => number, y: number) => { const o: [number, number][] = [];
    for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], fa = keep(a) >= 0, fb = keep(b) >= 0; if (fa) o.push(a); if (fa !== fb) o.push([a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y]); } return o; };
  return cut(cut(poly, (q) => q[1] - lo, lo), (q) => hi - q[1], hi);
};
const bandCache = new Map<number, { g: THREE.BufferGeometry; cx: number; cz: number }>();
const bandOf = (i: number) => {
  let r = bandCache.get(i); if (r) return r;
  const pts = clipB(US, LATB[i], LATB[i + 1]).map(([lo, la]) => [(lo + 96) * 0.0225, (la - 37) * 0.028] as [number, number]);
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 1, bevelEnabled: false });
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cz = -pts.reduce((a, p) => a + p[1], 0) / pts.length;
  r = { g, cx, cz }; bandCache.set(i, r); return r;
};
// 37 · el mapa del país en relieve: las franjas de clima se levantan y se pintan de sur a norte con una bomba sobre cada una; la franja más fría se tiñe de rojo y suma una caja de respaldo
export const HColdmap: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), red = win(u, 0.74, 0.9);
  return <S3 p={lv([0.1, 1.05, 0.95], [0.0, 0.92, 0.8], win(u, 0, 1))} l={[0, 0.0, -0.02]} fov={40}>
    <Bx s={[2.2, 0.04, 1.3]} p={[0, -0.03, -0.02]} c="#2b3036" ro={0.7} ns />
    {[0, 1, 2, 3].map((i) => { const k = drop(u, 0.06 + i * 0.16, 0.18 + i * 0.16), hh = 0.012 + 0.055 * cl(k), b = bandOf(i), col = i === 3 ? mix(BANDC[3], "#d64a38", red) : BANDC[i];
      return <group key={i}>
        <mesh geometry={b.g} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, hh]} castShadow receiveShadow><meshStandardMaterial color={k > 0.02 ? col : "#c9c4b8"} roughness={0.65} emissive={k > 0.02 ? col : "#000"} emissiveIntensity={0.12} /></mesh>
        {k > 0.5 && <group position={[b.cx, hh, b.cz]} scale={cl((k - 0.5) * 2)}><HPU s={0.2} fan={tt * 8} /></group>}
      </group>; })}
    {red > 0.01 && <group position={[bandOf(3).cx + 0.28, 0.067 + (1 - red) * 0.3, bandOf(3).cz + 0.02]} scale={0.5 + 0.5 * red}>
      <Bx s={[0.2, 0.22, 0.16]} p={[0, 0.11, 0]} c="#c8302a" m={0.3} ro={0.4} rad={0.015} />
      <Flame p={[0, 0.0, 0.085]} s={0.8} u={tt} i={4} warm={0.6} />
      <Cy rt={0.025} h={0.1} p={[0.05, 0.27, 0]} c="#9aa0a6" m={0.8} />
    </group>}
  </S3>;
}}</Stage>;

// 38 · el pulso parejo: dos monitores grandes con la temperatura de la casa; el del furnace dibuja dientes de sierra, el de la bomba una línea tibia y plana
export const HSteady: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.06, 0.86);
  const mon = (x: number, f: (q: number) => number, c: string, led: string) => {
    const pts = Array.from({ length: 120 }, (_, i) => { const q = i / 119 * k; return [-0.245 + q * 0.49, 0.0 + f(q) * 0.1, 0.036] as V3; }), hx = -0.245 + k * 0.49, hy = f(k) * 0.1;
    return <group position={[x, 0.5, 0]}>
      <Bx s={[0.6, 0.42, 0.06]} c="#1c1d20" m={0.4} ro={0.35} rad={0.025} />
      <Bx s={[0.54, 0.35, 0.005]} p={[0, 0, 0.031]} c="#06120a" e="#0a2a14" ei={0.5} />
      {Array.from({ length: 5 }, (_, i) => <Bx key={i} s={[0.52, 0.002, 0.002]} p={[0, -0.14 + i * 0.07, 0.035]} c="#1f4a2a" ns />)}
      {k > 0.02 && <Tube pts={pts} rad={0.0065} seg={240} c={c} e={c} ei={2.2} />}
      <Sp rad={0.014} p={[hx, hy, 0.04]} c="#ffffff" e={c} ei={3} ns />
      {k > 0.02 && <Puff p={[hx, hy, 0.05]} s={0.14} c={c} o={0.6} />}
      <Sp rad={0.012} p={[0.24, -0.19, 0.034]} c={led} e={led} ei={1.5} ns />
      <Cy rt={0.03} h={0.1} p={[0, -0.26, -0.01]} c="#2a2c30" m={0.5} /><Bx s={[0.26, 0.02, 0.18]} p={[0, -0.32, 0]} c="#2a2c30" m={0.5} />
    </group>;
  };
  return <S3 p={lv([0, 0.7, 1.35], [0, 0.58, 1.1], win(u, 0, 1))} l={[0, 0.45, 0]} fov={38} floor={null}>
    <Wall y={0.8} z={-0.12} c="#c9d2da" />
    <Bx s={[3, 0.04, 1.2]} p={[0, 0.17, 0.3]} c="#6b4a2e" ro={0.6} ns />
    {mon(-0.32, (q) => { const s = (q * 5) % 1; return s < 0.3 ? s / 0.3 * 2 - 1 : 1 - (s - 0.3) / 0.7 * 2; }, "#ff7a5a", "#ff3a2a")}
    {mon(0.32, (q) => 0.05 * Math.sin(q * 30), "#7dff8a", "#3fbf6a")}
  </S3>;
}}</Stage>;

// 39 · la línea de vida: una regla de años; la unidad descuidada pierde el ventilador y se apaga entre humo al llegar al 10 y la cuidada sigue girando hasta pasar el 15
export const HLifespan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), yr = win(u, 0.06, 0.84) * 17, dead = yr > 10, dd = win(yr, 10, 11), X = (y: number) => -0.8 + y * 0.12, cx = X(Math.max(5, Math.min(yr, 12))) ;
  return <S3 p={lv([cx, 0.62, 1.5], [cx + 0.05, 0.52, 1.25], win(u, 0, 1))} l={[cx, 0.24, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 1.2, 0.04]} p={[0.4, 0.5, -0.4]} map={PLASTER()} c="#d9d2c2" ro={0.95} ns />
    <Bx s={[3.0, 0.04, 0.95]} p={[0.5, 0.0, 0.0]} c="#6b4a2e" ro={0.6} ns />
    <Bx s={[2.2, 0.1, 0.05]} p={[0.2, 0.02, 0.4]} c="#f2c230" ro={0.4} rad={0.008} />
    {Array.from({ length: 19 }, (_, i) => <group key={i}><Bx s={[0.006, i % 5 === 0 ? 0.08 : 0.05, 0.01]} p={[X(i), 0.065, 0.426]} c="#1a1a1a" ns />
      {i % 5 === 0 && <Txt t={`${i}`} w={0.14} c={i === 10 ? "#c8302a" : i === 15 ? "#1f7a3a" : "#1a1a1a"} p={[X(i), 0.17, 0.425]} />}</group>)}
    <Bx s={[0.012, 0.6, 0.012]} p={[X(10), 0.3, 0.1]} c="#c8302a" e="#c8302a" ei={0.5} ns /><Bx s={[0.012, 0.6, 0.012]} p={[X(15), 0.3, 0.1]} c="#1f7a3a" e="#3fbf6a" ei={0.5} ns />
    <group position={[X(Math.min(yr, 10)), 0.04, -0.05]} rotation={[0, 0, dd * 0.08]}>
      <HPU s={0.75} fan={dead ? 0 : tt * 10} />
      {dead && <Bx s={[0.46, 0.46, 0.46]} p={[0, 0.23, 0]} c="#0d0d0d" o={0.55 * dd} />}
      {dead && Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.35 + i / 6) % 1; return <Puff key={i} p={[(rnd(i) - 0.5) * 0.2, 0.48 + f * 0.5, 0]} s={0.2 + f * 0.3} c="#3a3836" o={0.55 * dd * Math.sin(f * Math.PI)} add={false} />; })}
    </group>
    <group position={[X(yr), 0.04, 0.2]}><HPU s={0.75} fan={tt * 10} />
      <Puff p={[0, 0.5, 0.0]} s={0.5} c="#9ff0b0" o={0.18} /></group>
  </S3>;
}}</Stage>;

// 40 · la puerta y el miedo: tras el vidrio esmerilado de una puerta la silueta encogida de la señora espera; el termómetro del pasillo sube, el vidrio se aclara y la silueta se endereza y se enfoca
export const HScared: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.15, 0.72), sl = 1 - k, deg = Math.round(lerp(58, 68, k));
  return <S3 p={lv([0.3, 0.95, 1.9], [0.15, 0.85, 1.55], win(u, 0, 1))} l={[0.1, 0.78, 0]} fov={40} floor={null}>
    <Wall y={1} z={-0.08} c="#eadfc9" />
    <Bx s={[0.72, 1.6, 0.02]} p={[-0.3, 0.9, -0.3]} c="#ffe9c0" e="#ffd9a0" ei={1.2} ns />
    <group position={[-0.3, 0.1 + 0.0, -0.22]} rotation={[0, 0, sl * 0.1]} scale={[1, 0.93 + 0.07 * k, 1]}>
      <group rotation={[0, 0, 0]}>
        <Cy rt={0.1} rb={0.19} h={0.7} p={[0, 0.55, 0]} c="#241c1c" ro={1} />
        <Cy rt={0.045} h={0.12} p={[0, 0.95, 0]} c="#241c1c" ro={1} />
        <group position={[sl * 0.08, 0, 0]} rotation={[0, 0, -sl * 0.35]}><Sp rad={0.1} p={[0, 1.07, 0]} c="#241c1c" ro={1} /><Sp rad={0.06} p={[0, 1.18, -0.02]} c="#241c1c" ro={1} /></group>
        <Cy rt={0.03} h={0.5} p={[-0.17 - sl * 0.02, 0.72, 0]} r={[0, 0, 0.2 + sl * 0.3]} c="#241c1c" ro={1} /><Cy rt={0.03} h={0.5} p={[0.17 + sl * 0.02, 0.72, 0]} r={[0, 0, -0.2 - sl * 0.3]} c="#241c1c" ro={1} />
        <Cy rt={0.14} rb={0.17} h={0.3} p={[0, 0.15, 0]} c="#241c1c" ro={1} />
      </group>
    </group>
    <Bx s={[0.68, 1.56, 0.02]} p={[-0.3, 0.9, -0.12]} c="#f4f0e6" o={0.9 - 0.45 * k} ro={0.15} />
    {[[-0.3, 1.71, 0.82, 0.12], [-0.3, 0.09, 0.82, 0.12], [-0.66, 0.9, 0.12, 1.7], [0.06, 0.9, 0.12, 1.7], [-0.3, 0.9, 0.7, 0.07]].map(([x, y, w, hh], i) => <Bx key={i} s={[w, hh, 0.07]} p={[x, y, -0.1]} c="#7a5638" ro={0.55} rad={0.012} />)}
    <Sp rad={0.03} p={[0.0, 0.88, -0.03]} c="#c9a24a" m={0.95} ro={0.25} />
    <Thermo p={[0.6, 0.85, -0.04]} v={(deg - 58) / 12 * 0.8 + 0.1} s={1.4} />
    <Bx s={[0.28, 0.12, 0.02]} p={[0.6, 0.18, -0.04]} c="#10141a" ro={0.2} /><Txt t={`${deg}°`} w={0.22} c="#9ff0b0" p={[0.6, 0.18, -0.025]} />
  </S3>;
}}</Stage>;

// 41 · el amanecer de la taza: por la ventana el sol sube sobre el patio y la unidad de afuera humea manso; un haz de luz cae sobre la taza humeante del alféizar
export const HGoodmorning: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sun = win(u, 0.04, 0.8), sky = mix("#243049", "#ffcf90", sun);
  return <S3 p={lv([0.2, 0.7, 1.3], [0.0, 0.66, 1.1], win(u, 0, 1))} l={[0, 0.66, 0]} fov={40} floor={null} exp={0.7 + 0.5 * sun}>
    <Bx s={[4, 3, 0.1]} p={[0, 0.75, -3.5]} c={sky} e={sky} ei={0.6} ns />
    <Sp rad={0.22} p={[0.3, lerp(0.35, 1.0, sun), -3.2]} c="#fff0c0" e="#ffd070" ei={3} ns />
    <Puff p={[0.3, lerp(0.35, 1.0, sun), -3.0]} s={1.8} c="#ffcf80" o={0.7 * sun} />
    <Bx s={[6, 0.05, 4]} p={[0, 0.4, -1.8]} c={mix("#2a3a34", "#9fc08a", sun)} ro={0.9} ns />
    <HPU p={[-0.15, 0.42, -0.9]} s={0.7} fan={tt * 3} />
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.25 + i / 6) % 1; return <Puff key={i} p={[-0.15 + f * 0.06, 0.8 + f * 0.35, -0.9]} s={0.2 + f * 0.3} c="#ffffff" o={0.4 * Math.sin(f * Math.PI)} add={false} />; })}
    <Bx s={[1.1, 1.3, 0.1]} p={[-1.0, 0.8, 0]} map={PLASTER()} c="#f0e6d4" ro={0.95} ns />
    <Bx s={[1.1, 1.3, 0.1]} p={[1.0, 0.8, 0]} map={PLASTER()} c="#f0e6d4" ro={0.95} ns />
    <Bx s={[1.0, 0.7, 0.1]} p={[0, 1.4, 0]} map={PLASTER()} c="#f0e6d4" ro={0.95} ns />
    <Bx s={[1.0, 0.25, 0.1]} p={[0, 0.275, 0]} map={PLASTER()} c="#f0e6d4" ro={0.95} ns />
    {[[0, 1.06, 0.98, 0.07], [0, 0.46, 0.98, 0.07], [-0.47, 0.76, 0.07, 0.66], [0.47, 0.76, 0.07, 0.66], [0, 0.76, 0.04, 0.62]].map(([x, y, w, hh], i) => <Bx key={i} s={[w, hh, 0.09]} p={[x, y, 0.02]} c="#ffffff" ro={0.5} rad={0.01} />)}
    <Bx s={[1.3, 0.05, 0.3]} p={[0, 0.44, 0.17]} c="#efe8da" ro={0.5} />
    <group position={[-0.28, 0.465, 0.2]}>
      <Cy rt={0.075} rb={0.062} h={0.15} p={[0, 0.075, 0]} c="#c8302a" ro={0.3} />
      <Cy rt={0.063} h={0.01} p={[0, 0.14, 0]} c="#3a1f10" ro={0.3} />
      <To R={0.045} t={0.013} p={[0.085, 0.08, 0]} c="#c8302a" ro={0.3} />
      {Array.from({ length: 7 }, (_, i) => { const f = (tt * 0.4 + i / 7) % 1; return <Puff key={i} p={[Math.sin(f * 6 + i) * 0.03, 0.17 + f * 0.32, 0.0]} s={0.1 + f * 0.14} c="#ffffff" o={0.5 * Math.sin(f * Math.PI) * (0.4 + 0.6 * sun)} add={false} />; })}
    </group>
    {[0, 1, 2].map((i) => <mesh key={i} position={[0.0 - i * 0.12, 0.75, 0.4]} rotation={[0, 0, 0.55]}><planeGeometry args={[0.1, 1.5]} /><meshBasicMaterial color="#ffd890" transparent opacity={0.1 * sun} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>)}
    <pointLight position={[0.1, 0.9, 0.6]} color="#ffc070" intensity={3 * sun} distance={3} />
  </S3>;
}}</Stage>;
