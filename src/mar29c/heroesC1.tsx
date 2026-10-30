// mar29c · componentes únicos 1-17, vuelta 3 en 3D (kit r3k) sobre la foto desenfocada del momento.
// Vuelta 3 (EVALUADOR vuelta 2: 5-7): objetos protagonistas enormes, la acción de la idea hecha de verdad (contador de tambores, pilas que caen,
// mercurio que rueda, sello que baja, escalera, esfera de aire…), cámara cerrada y sin rótulos que repitan la voz. Registro: D:/rtmp/mar29_COMPONENTES.md
import React from "react";
import * as THREE from "three";
import { H, Stage } from "./hkit";
import { BOLD, Bx, Cy, D2R, Dot, Flame, PLASTER, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { CORK, Odo, Fres, PEG, PhotoCard, RoundThermo, Thermo3, lcd } from "./r3c";

// cámara: por defecto se usa tal cual (k = 1); con k < 1 se acerca p hacia l
const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const U = (tt: number, h: H) => cl(tt / (h.out - h.at));
const Wall: React.FC<{ y?: number; w?: number; hh?: number; z?: number; c?: string }> = ({ y = 1, w = 4, hh = 2.4, z = -0.03, c = "#ffffff" }) =>
  <Bx s={[w, hh, 0.05]} p={[0, y, z]} map={PLASTER()} c={c} ro={0.95} ns />;
// rebote que se apaga (para golpes y topes)
const bump = (u: number, a: number, f = 26, k = 8) => (u > a ? Math.sin((u - a) * f) * Math.exp(-(u - a) * k) : 0);
const mix = (a: string, b: string, k: number) => new THREE.Color(a).lerp(new THREE.Color(b), cl(k)).getStyle();
// sillón de verdad (base, almohadón, respaldo, brazos, patas), de frente a +z
const Sofa: React.FC<{ c: string; c2?: string; p?: V3; r?: V3; s?: number }> = ({ c, c2, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) =>
  <group position={p} rotation={r} scale={s}>
    <Bx s={[0.8, 0.17, 0.5]} p={[0, 0.17, 0]} c={c} ro={0.9} rad={0.05} />
    <Bx s={[0.56, 0.1, 0.42]} p={[0, 0.275, 0.04]} c={c2 ?? c} ro={0.95} rad={0.04} />
    <Bx s={[0.8, 0.42, 0.14]} p={[0, 0.4, -0.18]} c={c} ro={0.9} rad={0.05} />
    {[-0.34, 0.34].map((x) => <Bx key={x} s={[0.13, 0.3, 0.5]} p={[x, 0.3, 0]} c={c} ro={0.9} rad={0.05} />)}
    {[-0.34, 0.34].map((x) => [-0.2, 0.2].map((z) => <Cy key={`${x}${z}`} rt={0.02} rb={0.015} h={0.09} p={[x, 0.045, z]} c="#2a1c10" ro={0.5} />))}
  </group>;

const bill = (ghost = false) => canvasTex(`billv3|${ghost}`, 640, 470, (g) => {
  g.fillStyle = ghost ? "#e8e6e0" : "#fbfaf6"; g.fillRect(0, 0, 640, 470); g.fillStyle = ghost ? "#8a8a8a" : "#2b4d6e"; g.fillRect(0, 0, 640, 80);
  g.fillStyle = "#fff"; g.font = BOLD(44); g.textBaseline = "middle"; g.textAlign = "left"; g.fillText(ghost ? "LAST YEAR" : "ENERGY BILL", 28, 42);
  g.fillStyle = "#c9c6bd"; for (let i = 0; i < 3; i++) g.fillRect(28, 112 + i * 34, 330 - i * 50, 14);
  if (ghost) { g.fillStyle = "#6a6a6a"; g.font = BOLD(170); g.textAlign = "center"; g.fillText("$356", 320, 310); }
  else { g.fillStyle = "#c9c6bd"; g.fillRect(28, 400, 330, 14); g.fillStyle = "#555"; g.font = BOLD(30); g.textAlign = "right"; g.fillText("AMOUNT DUE", 612, 425); }
});
const flapGeo = (() => { const s = new THREE.Shape(); s.moveTo(-0.55, 0); s.lineTo(0.55, 0); s.lineTo(0, -0.4); s.closePath(); return new THREE.ShapeGeometry(s); })();
// 1 · el sobre: entra deslizando y se planta, la solapa se abre, la factura sube entera por encima y su contador de tambores rueda de 356 a 412; a un costado, más baja, la del año pasado en fantasma
export const HEnvelope: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), slide = drop(u, 0, 0.16), flap = win(u, 0.16, 0.3), up = drop(u, 0.3, 0.54), v = lerp(356, 412, win(u, 0.46, 0.84)), gh = drop(u, 0.58, 0.72);
  return <S3 p={lv([0.1, 0.85, 2.25], [-0.1, 0.75, 1.9], win(u, 0, 1))} l={[-0.15, 0.5, 0]} fov={36}>
    <group position={[-0.88, 0.27 + (1 - gh) * 0.6, 0.1]} rotation={[0, 0.2, 0.1]} scale={gh > 0 ? 1 : 0.001}>
      <Pl w={0.7} h={0.51} map={bill(true)} c="#ffffff" o={0.88} ro={0.8} ns />
    </group>
    <group position={[lerp(1.7, 0.3, slide), 0.35, 0]} rotation={[0, lerp(-0.4, -0.08, slide), lerp(0.2, 0, slide)]}>
      <Bx s={[1.1, 0.7, 0.02]} p={[0, 0, -0.02]} c="#e0d4b6" ro={0.85} rad={0.008} />
      <group position={[0, lerp(0, 0.62, up), -0.004]}>
        <Pl w={0.92} h={0.67} map={bill()} c="#ffffff" ro={0.75} />
        <Odo v={v} n={3} pre="$" p={[0, 0, 0.012]} s={1.5} />
      </group>
      <Bx s={[1.1, 0.7, 0.014]} p={[0, 0, 0.02]} c="#efe6cf" ro={0.85} rad={0.008} />
      {[0, 1, 2].map((i) => <Bx key={i} s={[0.5 - i * 0.12, 0.025, 0.004]} p={[-0.2 + i * -0.0, -0.12 - i * 0.09, 0.03]} c="#bfb597" ro={0.8} />)}
      <group position={[0, 0.35, 0.028]} rotation={[flap * 2.7, 0, 0]}>
        <mesh geometry={flapGeo} castShadow receiveShadow><meshStandardMaterial color="#e9dfc4" roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <Cy rt={0.06} h={0.014} p={[0, -0.34, 0.008]} r={[Math.PI / 2, 0, 0]} c="#b8442e" ro={0.5} />
      </group>
    </group>
  </S3>;
}}</Stage>;

const SL: [number, string][] = [[0.5, "#e8913a"], [0.18, "#4f7ea6"], [0.14, "#7f8f5e"], [0.1, "#c9bfa6"], [0.08, "#7a6a8a"]];
// 2 · la torta del gasto de la casa: la mitad de calefacción y aire se separa y sube con brillo cálido, un contador de tambores rueda hasta 50 % sobre ella y el termostato baja y se apoya con sombra
export const HHalfpie: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lift = drop(u, 0.2, 0.42), glow = win(u, 0.28, 0.48), a = lerp(0.3, -0.15, win(u, 0, 1)), pct = 50 * win(u, 0.34, 0.62), th = drop(u, 0.56, 0.74);
  const lz = 0.24 * lift, top = 0.065 + 0.065 + 0.22 * lift, R = 0.7;
  let acc = -Math.PI / 2;
  return <S3 p={[1.1 * Math.sin(a), 1.15, 1.3 * Math.cos(a)]} l={[0, 0.3, 0.12]} fov={36}>
    {SL.map(([f, c], i) => {
      const t0 = acc, len = f * Math.PI * 2; acc += len; const k = i === 0 ? lift : 0, grow = drop(u, i * 0.02, 0.1 + i * 0.02);
      return <mesh key={i} position={[0, 0.065 + 0.22 * k, i === 0 ? lz : 0]} scale={[1, Math.max(0.05, grow), 1]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R, 0.13, 72, 1, false, t0 + 0.006, len - 0.012]} />
        <meshStandardMaterial color={c} roughness={0.45} metalness={0.05} emissive={i === 0 ? "#ff8a20" : "#000"} emissiveIntensity={i === 0 ? 0.8 * glow : 0} />
      </mesh>;
    })}
    <pointLight position={[0, 0.9, lz + 0.3]} intensity={2.4 * glow} distance={2} color="#ffb060" />
    <group position={[0, top + 0.004, lz + 0.4]} rotation={[-Math.PI / 2, 0, 0]} scale={Math.max(0.001, win(u, 0.32, 0.42))}>
      <Odo v={pct} n={2} p={[-0.1, 0, 0]} s={1.5} /><Txt t="%" w={0.2} c="#fff3d6" e={0.6} p={[0.26, 0, 0.03]} />
    </group>
    <Thermo3 v="72" p={[0, top + 0.17 + (1 - th) * 0.9, lz + 0.05]} r={[-0.2, 0, 0]} s={1.35} glow={0.6} />
  </S3>;
}}</Stage>;

const tileT = (() => { let t: THREE.Texture | null = null; return () => { if (!t) { t = PEG().clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 2.2); t.needsUpdate = true; } return t; }; })();
// 3 · la pared de termostatos: tablero perforado con 18 termostatos grandes; una ola de luz los enciende de izquierda a derecha y baña el tablero, y la placa dorada del año cuelga del riel y cae con rebote
export const HMosaic: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), C = 6, R = 3, wave = lerp(-1.5, 1.6, win(u, 0.06, 0.62)), pl = drop(u, 0.66, 0.82), py = lerp(1.95, 0.33, pl);
  return <S3 p={lv([0.6, 1.0, 2.6], [-0.2, 0.95, 2.15], win(u, 0, 1))} l={[0, 0.92, 0]} fov={40} floor={null}>
    <Bx s={[3.1, 1.75, 0.05]} p={[0, 0.92, -0.04]} map={tileT()} c="#8d7556" ro={0.85} ns />
    <Bx s={[3.2, 0.07, 0.12]} p={[0, 1.84, 0.02]} c="#4a3322" ro={0.5} />
    {Array.from({ length: C * R }, (_, i) => { const c = i % C, r = Math.floor(i / C), x = (c - (C - 1) / 2) * 0.44, y = 1.38 - r * 0.38, on = cl((wave - x + 0.1) * 4);
      return <group key={i}>
        <Puff p={[x, y, 0.035]} s={0.85} c="#b8f08a" o={0.4 * on} />
        <Thermo3 v={on > 0.5 ? "72" : "--"} p={[x, y, 0.05 + on * 0.02]} s={1.15} glow={1.8 * on} dark={on < 0.5} />
      </group>; })}
    <pointLight position={[wave, 1.0, 0.8]} intensity={2.2 * win(u, 0.06, 0.14) * (1 - win(u, 0.6, 0.7))} distance={1.8} color="#bff0a0" />
    {[-0.95, 0.95].map((x) => <Tube key={x} pts={[[x, 1.88, 0.12], [x, (1.88 + Math.min(py + 0.17, 1.8)) / 2, 0.12], [x, Math.min(py + 0.17, 1.8), 0.12]]} rad={0.007} c="#d8cdb0" ro={0.8} />)}
    <group position={[0, py, 0.12]} rotation={[0, 0, bump(u, 0.82, 30, 10) * 0.1]}>
      <Bx s={[2.1, 0.34, 0.04]} c="#c9a24a" m={0.95} ro={0.22} rad={0.025} />
      <Txt t="UP TO $400 A YEAR" w={1.85} c="#2a1e0c" p={[0, 0, 0.022]} />
    </group>
  </S3>;
}}</Stage>;

// 4 · la palanquita escondida: primer plano de la palanca FAN, que salta de AUTO a ON con rebote y un resplandor, y cuelga del costado la etiqueta del costo, entera y balanceándose
export const HSwitchflip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), flip = drop(u, 0.36, 0.48), tag = drop(u, 0.58, 0.76), sw = bump(u, 0.76, 22, 6) * 0.3, pf = win(u, 0.36, 0.46) * (1 - win(u, 0.5, 0.68));
  return <S3 p={lv([0.5, 1.05, 2.4], [0.15, 0.98, 2.0], win(u, 0, 1))} l={[0.05, 0.85, 0]} fov={36} floor={null}>
    <Wall y={1.1} w={4.6} hh={2.8} />
    <Thermo3 v="72" p={[-0.5, 1.0, 0.03]} s={1.8} glow={0.5} />
    <group position={[0.6, 0.98, 0.05]} scale={2.4}>
      <Bx s={[0.44, 0.14, 0.05]} c="#d8d4ca" ro={0.4} rad={0.02} />
      <Bx s={[0.32, 0.03, 0.01]} p={[0, 0, 0.026]} c="#2a2a28" ro={0.6} rad={0.006} />
      <Bx s={[0.09, 0.09, 0.06]} p={[lerp(-0.12, 0.12, flip), 0, 0.05]} c="#c8302a" ro={0.35} rad={0.02} e="#ff3a20" ei={0.3 + 0.8 * pf} />
      <Puff p={[lerp(-0.12, 0.12, flip), 0, 0.1]} s={0.5 * pf} c="#ff6a4a" o={0.7 * pf} />
      <Txt t="AUTO" w={0.12} c={flip < 0.5 ? "#1a1a1a" : "#8a867c"} p={[-0.12, 0.1, 0.026]} /><Txt t="ON" w={0.07} c={flip > 0.5 ? "#c8302a" : "#8a867c"} p={[0.12, 0.1, 0.026]} />
      <Txt t="FAN" w={0.09} c="#4a463e" p={[0, -0.1, 0.026]} />
    </group>
    <pointLight position={[0.6 + lerp(-0.12, 0.12, flip) * 2.4, 1.0, 0.7]} intensity={2 * pf} distance={1.4} color="#ff7a5a" />
    <group position={[0.6, 0.8 + (1 - tag) * 0.8, 0.14]} rotation={[0, 0, sw]}>
      <Tube pts={[[0, 0, 0], [0, -0.06, 0], [0, -0.12, 0]]} rad={0.006} c="#d8cdb0" ro={0.8} />
      <Bx s={[0.8, 0.3, 0.012]} p={[0, -0.27, 0]} c="#f5efdc" ro={0.85} rad={0.02} />
      <Txt t="$200-300 / YR" w={0.68} c="#c8302a" p={[0, -0.27, 0.008]} />
    </group>
  </S3>;
}}</Stage>;

// 5 · el relé: sube la columna del termómetro, empuja el brazo de cobre, salta el arco azul entre los contactos y las llamas del quemador, en primer plano, se apagan
export const HRelay: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), col = lerp(0.12, 0.52, win(u, 0.08, 0.5)), open = drop(u, 0.5, 0.64), fl = 1 - win(u, 0.58, 0.76), push = win(u, 0.3, 0.58);
  const sp = win(u, 0.47, 0.52) * (1 - win(u, 0.6, 0.72)), ang = open * 0.45, tip: V3 = [-0.17 + 0.36 * Math.cos(ang), 0.64 + 0.36 * Math.sin(ang), 0];
  return <S3 p={lv([0.3, 0.85, 2.0], [0.55, 0.8, 1.5], push)} l={lv([0.2, 0.45, 0], [0.45, 0.55, 0], push)} fov={34}>
    <Bx s={[2.2, 1.3, 0.05]} p={[0.3, 0.5, -0.14]} c="#3e3933" ro={0.8} ns />
    <group scale={1.3}>
      <Bx s={[0.3, 0.05, 0.3]} p={[-0.25, 0.025, 0]} c="#3b3631" ro={0.5} />
      <Cy rt={0.055} h={0.62} p={[-0.25, 0.36, 0]} c="#e8f0f4" o={0.28} ro={0.05} m={0.1} />
      <Sp rad={0.08} p={[-0.25, 0.1, 0]} c="#d22a22" ro={0.25} e="#801010" ei={0.4} />
      <Cy rt={0.028} h={col} p={[-0.25, 0.1 + col / 2, 0]} c="#d22a22" ro={0.3} e="#a01010" ei={0.5} />
      <To R={0.06} t={0.01} p={[-0.25, 0.62, 0]} r={[Math.PI / 2, 0, 0]} c="#d0a64a" m={0.9} ro={0.25} />
      <Bx s={[0.06, 0.04, 0.06]} p={[-0.2, 0.625, 0]} c="#b87333" m={0.9} ro={0.3} />
      <group position={[-0.17, 0.64, 0]} rotation={[0, 0, ang]}><Bx s={[0.36, 0.03, 0.055]} p={[0.18, 0, 0]} c="#c97b3e" m={0.9} ro={0.25} /></group>
      <Bx s={[0.07, 0.06, 0.07]} p={[0.2, 0.615, 0]} c="#b87333" m={0.9} ro={0.3} />
      <Tube pts={[tip, [(tip[0] + 0.2) / 2, (tip[1] + 0.665) / 2 + 0.03 * Math.sin(tt * 30), 0.02], [0.2, 0.655, 0]]} rad={0.012} c="#dff0ff" e="#bfe0ff" ei={3} o={Math.max(0.001, sp)} />
      <Dot p={[0.2, 0.665, 0.04]} r={0.14 * sp} c="#bfe0ff" o={0.8 * sp} add />
      {Array.from({ length: 10 }, (_, i) => { const a = i * 0.63, d = 0.04 + 0.16 * win(u, 0.5, 0.62); return <Dot key={i} p={[0.2 + Math.cos(a) * d, 0.665 + Math.sin(a) * d, 0.04]} r={0.02} c="#fff2a0" o={sp} add />; })}
      <pointLight position={[0.2, 0.7, 0.2]} intensity={4 * sp} distance={1.2} color="#cfe6ff" />
      <Tube pts={[[0.2, 0.6, 0], [0.42, 0.55, 0.02], [0.62, 0.32, 0.05], [0.66, 0.2, 0.05]]} rad={0.012} c="#2a2a2a" ro={0.6} />
      <Bx s={[0.5, 0.12, 0.3]} p={[0.66, 0.06, 0]} c="#4a4e55" m={0.6} ro={0.35} />
      <Puff p={[0.66, 0.2, 0.1]} s={0.7} c="#ff9a3a" o={0.45 * fl} />
      {[0, 1, 2, 3].map((i) => <group key={i} scale={[1, Math.max(0.001, fl), 1]} position={[0.5 + i * 0.105, 0.12, 0.05]}><Flame p={[0, 0, 0]} s={1.7} u={tt} i={i} warm={0.3} /></group>)}
    </group>
  </S3>;
}}</Stage>;

// 6 · la carrera: dos termómetros gordos (SET 70 y SET 80) suben parejos; una cinta de meta en 70 frena y hace rebotar al de 70, y el de 80 la rompe, sigue hasta 75 y se pone rojo con brillo
export const HRace: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const f = (uu: number) => 58 + 17.5 * win(uu, 0.06, 0.86);
  let hit = 0.56; for (let i = 0; i <= 400; i++) if (f(i / 400) >= 70) { hit = i / 400; break; }
  const u = U(tt, h), T = f(u), L = Math.min(T, 70) + (T >= 70 ? Math.abs(bump(u, hit, 34, 9)) * 0.9 : 0), hot = win(u, hit, hit + 0.18), torn = win(u, hit, hit + 0.05);
  const Y = (d: number) => 0.2 + (d - 58) * 0.036;
  const one = (x: number, v: number, set: string, red: number) => <group position={[x, 0, 0]}>
    <Cy rt={0.1} h={0.88} p={[0, 0.58, 0]} c="#e8f0f4" o={0.25} ro={0.05} />
    <Sp rad={0.17} p={[0, 0.2, 0]} c={red > 0 ? "#ff2a10" : "#c8302a"} ro={0.25} e="#ff2a10" ei={0.3 + red * 1.4} />
    <Cy rt={0.06} h={Y(v) - 0.2} p={[0, 0.2 + (Y(v) - 0.2) / 2, 0]} c="#d22a22" ro={0.3} e="#ff2a10" ei={0.3 + red * 1.8} />
    {[60, 65, 70, 75, 80].map((d) => <Bx key={d} s={[0.06, 0.01, 0.01]} p={[0.14, Y(d), 0.04]} c="#2a2520" ns />)}
    <Lbl3 t={`${Math.floor(v)}°`} w={0.34} p={[0, Y(v) + 0.14, 0.14]} c={red > 0.2 ? "#ff8a6a" : "#fff3d6"} />
    <pointLight position={[0, Y(v), 0.5]} intensity={2.4 * red} distance={1.3} color="#ff4020" />
  </group>;
  const tY = Y(70);
  return <S3 p={lv([0.15, 0.78, 1.95], [-0.05, 0.68, 1.65], win(u, 0, 1))} l={[0, 0.55, 0]} fov={36} floor="conc">
    <Bx s={[2.6, 1.5, 0.05]} p={[0, 0.7, -0.4]} map={PLASTER()} c="#a9b6c2" ro={0.95} ns />
    <Bx s={[1.7, 0.14, 0.56]} p={[0, 0.07, 0]} c="#2e3138" ro={0.5} rad={0.02} />
    <Txt t="SET 70" w={0.5} c="#f3ead6" p={[-0.42, 0.07, 0.282]} /><Txt t="SET 80" w={0.5} c="#f3ead6" p={[0.42, 0.07, 0.282]} />
    {one(-0.42, L, "SET 70", 0)}{one(0.42, T, "SET 80", hot)}
    {[-0.82, 0.82].map((x) => <group key={x}><Cy rt={0.022} h={0.95} p={[x, 0.55, 0.22]} c="#e8e8e8" ro={0.4} /><Sp rad={0.04} p={[x, 1.03, 0.22]} c="#c8302a" ro={0.4} /></group>)}
    <Bx s={[0.82, 0.045, 0.012]} p={[-0.41, tY + bump(u, hit, 34, 9) * 0.04, 0.22]} c="#6fe39a" e="#2fbf6a" ei={1.2} ns />
    <group position={[0.82, tY, 0.22]} rotation={[0, 0, torn * 1.35]}><Bx s={[0.82, 0.045, 0.012]} p={[-0.41, 0, 0]} c="#6fe39a" e="#2fbf6a" ei={1.2} ns /></group>
  </S3>;
}}</Stage>;
// rótulo que se lee de frente (sombra suave atrás)
const Lbl3: React.FC<{ t: string; w: number; p: V3; c?: string; o?: number }> = ({ t, w, p, c = "#fff7e6", o = 1 }) =>
  <group position={p}><Txt t={t} w={w * 1.02} c="#000000" o={0.5 * o} p={[0.008, -0.008, -0.002]} /><Txt t={t} w={w} c={c} o={o} /></group>;

// 7 · la burbuja: el termostato siente sólo el aire de su lado; una esfera translucida de aire tibio, con borde de luz y chispas adentro, nace en él y crece hacia el sillón azul, que queda afuera, frío, con 64° grande
export const HBubble: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), R = lerp(0.1, 1.15, win(u, 0.12, 0.72)), cold = win(u, 0.5, 0.72), cen: V3 = [-0.95, 1.0, -0.2];
  return <S3 p={lv([0.5, 1.2, 2.8], [0.1, 1.05, 2.35], win(u, 0, 1))} l={[0, 0.72, 0]} fov={38} floor="wood">
    <Bx s={[3.8, 2.2, 0.05]} p={[0, 1.1, -0.6]} map={PLASTER()} c="#f4ece0" ro={0.95} ns />
    <Thermo3 v="72" p={[-0.95, 1.0, -0.55]} s={2.0} glow={0.9} />
    <mesh position={cen}><sphereGeometry args={[R, 40, 28]} /><meshStandardMaterial color="#ff9a3a" transparent opacity={0.16} depthWrite={false} emissive="#ff7a20" emissiveIntensity={0.6} /></mesh>
    <Fres p={cen} r={R} c="#ff9a3a" o={0.95} />
    <pointLight position={cen} intensity={3 * win(u, 0.12, 0.22)} distance={2.6} color="#ff9a50" />
    {Array.from({ length: 28 }, (_, i) => { const a = rnd(i) * 6.28 + tt * 0.35, b = rnd(i + 7) * 3.14, rr = R * 0.85 * rnd(i + 3);
      return <Dot key={i} p={[cen[0] + Math.cos(a) * Math.sin(b) * rr, cen[1] + Math.cos(b) * rr + ((tt * 0.12 + rnd(i)) % 0.1), cen[2] + Math.sin(a) * Math.sin(b) * rr]} r={0.022} c="#ffd6a0" o={0.8 * win(u, 0.14, 0.26)} add />; })}
    <Puff p={[0.95, 0.5, 0.1]} s={1.6} c="#5a9aff" o={0.3 * cold} />
    <Sofa c={mix("#7a7f88", "#3f78b8", cold)} c2={mix("#868b94", "#5a92cf", cold)} p={[0.95, 0, 0.1]} r={[0, -0.35, 0]} s={1.6} />
    <pointLight position={[0.9, 0.9, 0.9]} intensity={1.6 * cold} distance={1.8} color="#7ab8ff" />
    <group position={[0.95, 1.18, 0.15]} scale={Math.max(0.001, cold)}>
      <Bx s={[0.8, 0.4, 0.03]} c="#f4f8ff" ro={0.5} rad={0.02} />
      <Txt t="64°" w={0.56} c="#12305c" p={[0, 0, 0.02]} />
    </group>
  </S3>;
}}</Stage>;

// 8 · la lámpara de bronce: el foco se prende, bocanadas de calor gruesas y luminosas suben hasta el termostato, que trepa a 72 con la pantalla grande; el sillón azul de enfrente marca 64
export const HLamp: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.06, 0.16), v = lerp(66, 72, win(u, 0.28, 0.7)), cold = win(u, 0.62, 0.8), heat = on * win(u, 0.12, 0.24);
  return <S3 p={lv([0.3, 1.2, 2.8], [0.05, 1.1, 2.35], win(u, 0, 1))} l={[0, 0.72, 0]} fov={38}>
    <Bx s={[3.8, 2.2, 0.05]} p={[0, 1.1, -0.45]} map={PLASTER()} c="#f4efe4" ro={0.95} ns />
    <Thermo3 v={`${Math.round(v)}`} p={[0.1, 1.1, -0.4]} s={2.0} glow={0.5 + 0.9 * win(u, 0.4, 0.7)} />
    <group position={[-1.0, 0, 0.1]} scale={1.3}>
      <Bx s={[0.54, 0.04, 0.42]} p={[0, 0.4, 0]} c="#4a3322" ro={0.45} rad={0.01} />
      {[-0.22, 0.22].map((x) => [-0.16, 0.16].map((z) => <Cy key={`${x}${z}`} rt={0.025} rb={0.02} h={0.38} p={[x, 0.19, z]} c="#4a3322" ro={0.45} />))}
      <Cy rt={0.1} rb={0.13} h={0.05} p={[0, 0.445, 0]} c="#8a5a24" m={0.9} ro={0.28} />
      <Cy rt={0.018} h={0.3} p={[0, 0.6, 0]} c="#8a5a24" m={0.9} ro={0.28} />
      <Sp rad={0.06} p={[0, 0.74, 0]} c="#fff6dc" e="#ffcf7a" ei={5 * on} />
      <Cy rt={0.1} rb={0.21} h={0.24} p={[0, 0.8, 0]} c="#8a5a24" m={0.9} ro={0.28} open side={THREE.DoubleSide} />
      <Puff p={[0, 0.78, 0.1]} s={0.9} c="#ffcf7a" o={0.6 * on} />
    </group>
    <pointLight position={[-1.0, 1.1, 0.5]} intensity={3 * on} distance={3} color="#ffcf8a" />
    {Array.from({ length: 6 }, (_, i) => { const f = (tt * 0.35 + i / 6) % 1, fo = Math.sin(f * Math.PI);
      return <Puff key={i} p={[lerp(-0.8, -0.25, f), lerp(1.0, 1.15, f) + Math.sin(f * Math.PI) * 0.18, -0.15]} s={0.3 + 0.3 * f} c="#ff9a40" o={0.65 * heat * fo} />; })}
    {Array.from({ length: 3 }, (_, i) => { const pts = Array.from({ length: 24 }, (_, k) => { const q = k / 23; return [lerp(-0.8, -0.2, q) + Math.sin(q * 9 + tt * 3 + i * 2) * 0.03, lerp(1.0, 1.18, q) + Math.sin(q * Math.PI) * (0.1 + i * 0.1), -0.12] as V3; });
      return <Tube key={i} pts={pts} rad={0.022} c="#ff9a4a" e="#ff7a20" ei={1.8} o={Math.max(0.001, 0.55 * heat)} />; })}
    <Puff p={[1.0, 0.5, 0.2]} s={1.6} c="#5a9aff" o={0.28 * cold} />
    <Sofa c={mix("#7a6a5a", "#3f78b8", cold)} c2={mix("#8a7a68", "#5a92cf", cold)} p={[1.0, 0, 0.15]} r={[0, -0.4, 0]} s={1.6} />
    <group position={[1.0, 1.18, 0.2]} scale={Math.max(0.001, cold)}>
      <Bx s={[0.8, 0.4, 0.03]} c="#f4f8ff" ro={0.5} rad={0.02} />
      <Txt t="64°" w={0.56} c="#12305c" p={[0, 0, 0.02]} />
    </group>
  </S3>;
}}</Stage>;

const corkT = (() => { let t: THREE.Texture | null = null; return () => { if (!t) { t = CORK().clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); t.needsUpdate = true; } return t; }; })();
const PINS: [string, V3][] = [["n_c_ventana_sol", [-0.55, 1.25, 0]], ["f_c_lampara", [0.55, 1.25, 0]], ["n_c_registro_bajo", [-0.55, 0.7, 0]], ["f_c_pasillo_noche", [0.55, 0.7, 0]]];
// 9 · el tablero del detective: 4 fotos del propio video caen con rebote sobre el corcho alrededor del termostato, la chinche las clava y un hilo rojo se tensa hasta él; la cámara cierra sobre la foto de la puerta y su chinche se hunde
export const HPins: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), C: V3 = [0, 0.975, 0.05], end = win(u, 0.76, 0.95), sink = win(u, 0.86, 0.94) * 0.045;
  return <S3 p={lv([0.0, 0.98, 1.6], [0.5, 0.72, 0.9], end)} l={lv([0, 0.98, 0], [0.55, 0.7, 0], end)} fov={40} floor={null}>
    <Bx s={[2.5, 1.7, 0.05]} p={[0, 0.98, -0.03]} c="#ffffff" ro={0.95} map={corkT()} />
    <Bx s={[2.6, 1.8, 0.04]} p={[0, 0.98, -0.06]} c="#6b4a2e" ro={0.6} />
    <Thermo3 v="72" p={[0, 0.975, 0.02]} s={1.25} glow={0.5} />
    {PINS.map(([id, p], i) => { const a = 0.06 + i * 0.12, d = drop(u, a, a + 0.12), pin = drop(u, a + 0.1, a + 0.16), y = win(u, a + 0.16, a + 0.3), rz = (rnd(i) - 0.5) * 0.12, sg = Math.sign(p[0]);
      const from: V3 = [p[0] - sg * 0.22, p[1] + (p[1] > 1 ? -0.15 : 0.15), 0.04], to: V3 = lv(from, [C[0] + sg * 0.22, C[1] + (p[1] > 1 ? 0.04 : -0.04), 0.04], y), mid = lv(from, to, 0.5);
      return <group key={i}>
        <group position={[p[0], p[1] + (1 - d) * 0.7, 0.01 + (1 - d) * 0.35]} rotation={[0, 0, rz]} scale={d > 0 ? 1 : 0.001}>
          <PhotoCard id={id} w={0.56} h={0.38} />
          <group position={[0, 0.17, 0.01 + (1 - pin) * 0.12 - (i === 3 ? sink : 0)]}><Cy rt={0.004} h={0.05} p={[0, 0, 0.025]} r={[Math.PI / 2, 0, 0]} c="#bbbbbb" m={0.9} ro={0.2} /><Sp rad={0.035} p={[0, 0, 0.055]} c="#d4231c" ro={0.3} /></group>
        </group>
        {y > 0.02 && <Tube pts={[from, [mid[0], mid[1] - 0.03 * (1 - y), mid[2]], to]} rad={0.006} c="#c81e1e" ro={0.6} seg={24} />}
      </group>; })}
  </S3>;
}}</Stage>;

// la cinta se dibuja de 0 a 72 pulgadas (6 ft) y la tira se corta en `top` para que el 5 quede exactamente en la punta
const tape = () => canvasTex("tape5ftv3", 256, 1536, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 256, 1536); g.fillStyle = "#1a1a1a";
  for (let i = 0; i <= 72; i++) { const y = 1536 - i * (1536 / 72); g.fillRect(0, y - 2, i % 12 === 0 ? 140 : i % 6 === 0 ? 96 : 52, i % 12 === 0 ? 10 : 4); }
  g.font = BOLD(120); g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#c8302a"; for (let f = 1; f <= 5; f++) g.fillText(String(f), 196, 1536 - f * 12 * (1536 / 72) + 4);
});
const Strip: React.FC<{ top: number; x: number; z: number }> = ({ top, x, z }) => {
  const geo = React.useMemo(() => { const g = new THREE.PlaneGeometry(0.24, Math.max(0.02, top), 1, 1); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * Math.max(0.02, top) / 1.83); return g; }, [Math.round(top * 250)]);
  return <mesh geometry={geo} position={[x, Math.max(0.02, top) / 2, z]} castShadow receiveShadow><meshStandardMaterial map={tape()} roughness={0.45} metalness={0.2} side={THREE.DoubleSide} /></mesh>;
};
// 10 · la altura justa: una cinta métrica gruesa sube desde su carcasa en el zócalo y frena con rebote justo en el 5; el termostato entra de costado, encaja contra la pared a esa altura con un golpe y su sombra
export const HHeight: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ext = drop(u, 0.06, 0.45), top = lerp(0.1, 1.525, ext), slide = drop(u, 0.5, 0.64), cy = lerp(0.7, 1.4, win(u, 0.04, 0.5)), TX = -0.3;
  return <S3 p={[0.25, cy + 0.1, 1.85]} l={[0.0, cy, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 2.9, 0.05]} p={[0, 1.4, -0.05]} map={PLASTER()} c="#f6efe2" ro={0.95} ns />
    <Bx s={[3.6, 0.15, 0.04]} p={[0, 0.075, -0.01]} c="#fffaf0" ro={0.55} />
    <Bx s={[0.12, 2.7, 0.07]} p={[1.0, 1.35, 0]} c="#fffaf0" ro={0.55} />
    <Bx s={[0.8, 2.5, 0.04]} p={[1.45, 1.25, -0.02]} c="#8a6a48" ro={0.55} />
    <Bx s={[0.11, 0.16, 0.015]} p={[-0.95, 0.4, 0.0]} c="#f4f1e8" ro={0.4} /><Bx s={[0.012, 0.03, 0.005]} p={[-0.95, 0.43, 0.01]} c="#222" ns /><Bx s={[0.012, 0.03, 0.005]} p={[-0.95, 0.37, 0.01]} c="#222" ns />
    <Puff p={[0.3, 1.6, 0.0]} s={2.6} c="#fff0cc" o={0.18} />
    <Bx s={[0.36, 0.26, 0.22]} p={[TX, 0.13 + 0.015, 0.12]} c="#f2c230" ro={0.4} rad={0.04} />
    <Bx s={[0.1, 0.03, 0.2]} p={[TX + 0.1, 0.275, 0.12]} c="#1a1a1a" ro={0.5} />
    <Strip top={top} x={TX} z={0.12} />
    <Bx s={[0.26, 0.035, 0.05]} p={[TX, top + 0.015, 0.12]} c="#9a9a9a" m={0.8} ro={0.3} />
    <Pl w={0.62} h={0.46} p={[0.3, 1.525, 0.001]} c="#000000" o={0.32 * win(u, 0.56, 0.66)} ns />
    <Thermo3 v="70" p={[lerp(1.9, 0.3, slide), 1.525, 0.25 * (1 - win(u, 0.52, 0.64))]} s={1.7} glow={0.6} />
  </S3>;
}}</Stage>;

const sky = () => canvasTex("nightsky", 256, 256, (g) => { const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, "#0a1430"); r.addColorStop(1, "#2c447c"); g.fillStyle = r; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) g.fillRect((i * 97) % 256, (i * 61) % 200, 2, 2); });
// 11 · la noche: la luna cruza entera la ventana y baña de azul la mesa de luz; el termostato baja de 70 a 62 y por cada grado cae una moneda y la pila crece; al final cae la moneda grande del 10 %
export const HNightcurve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), m = win(u, 0, 1), k = win(u, 0.12, 0.62), v = Math.round(lerp(70, 62, k)), n = Math.min(8, 70 - v), big = drop(u, 0.68, 0.84), mp: V3 = [lerp(-0.55, 0.25, m), 1.2 + Math.sin(m * Math.PI) * 0.12, -0.45], fr = (k * 8) % 1;
  const TOP = 0.58;
  return <S3 p={lv([-0.25, 1.05, 2.1], [-0.05, 0.95, 1.8], m)} l={[-0.05, 0.95, 0]} fov={38} warm="#b8c8ff" exp={0.9} floor={null}>
    <Bx s={[3.4, 2.4, 0.05]} p={[0, 1.2, -0.5]} map={PLASTER()} c="#7a88b8" ro={0.95} ns />
    <Pl w={1.0} h={0.72} p={[-0.15, 1.2, -0.47]} map={sky()} c="#ffffff" e="#2c447c" ei={0.5} ns />
    <Sp rad={0.1} p={mp} c="#f2f0e6" e="#dfe6ff" ei={1.8} ns />
    <Puff p={[mp[0], mp[1], -0.44]} s={0.6} c="#cfdcff" o={0.55} />
    {[[-0.15, 1.2, 1.06, 0.045], [-0.15, 1.2, 0.045, 0.78]].map(([x, y, w, hh], i) => <Bx key={i} s={[w, hh, 0.04]} p={[x, y, -0.45]} c="#e8e2d4" ro={0.6} />)}
    <Bx s={[1.12, 0.04, 0.08]} p={[-0.15, 0.82, -0.43]} c="#e8e2d4" ro={0.6} /><Bx s={[1.12, 0.04, 0.08]} p={[-0.15, 1.58, -0.43]} c="#e8e2d4" ro={0.6} />
    <pointLight position={[-0.15, 1.1, 0.4]} intensity={2.4} distance={2.6} color="#9ab8ff" />
    <Bx s={[1.3, 0.06, 0.5]} p={[-0.1, 0.55, 0]} c="#6b4a2e" ro={0.45} rad={0.015} />
    <Bx s={[1.2, 0.34, 0.44]} p={[-0.1, 0.35, 0]} c="#5a3e28" ro={0.5} rad={0.015} />
    {[-0.3, 0.3].map((x) => <group key={x}><Bx s={[0.5, 0.26, 0.02]} p={[x - 0.1, 0.35, 0.23]} c="#6b4a2e" ro={0.45} rad={0.01} /><Sp rad={0.025} p={[x - 0.1, 0.35, 0.255]} c="#c9a24a" m={0.9} ro={0.3} /></group>)}
    {[-0.6, 0.6].map((x) => [-0.18, 0.18].map((z) => <Cy key={`${x}${z}`} rt={0.03} rb={0.022} h={0.17} p={[x - 0.1, 0.085, z]} c="#4a3322" ro={0.5} />))}
    <Puff p={[-0.1, TOP + 0.005, 0]} s={1.3} c="#7aa0ff" o={0.4} r={[-Math.PI / 2, 0, 0]} />
    <Thermo3 v={`${v}`} p={[-0.42, TOP + 0.165, 0.04]} r={[-0.1, 0.3, 0]} s={1.3} glow={0.9} dark />
    {Array.from({ length: n }, (_, i) => <Cy key={i} rt={0.09} h={0.022} p={[0.05 + (rnd(i) - 0.5) * 0.012, TOP + 0.014 + i * 0.023, 0.04]} c="#d9b25a" m={0.95} ro={0.25} seg={40} />)}
    {n < 8 && k > 0 && k < 1 && <Cy rt={0.09} h={0.022} p={[0.05, TOP + 0.014 + n * 0.023 + (1 - fr) * (1 - fr) * 0.5, 0.04]} r={[fr * 3, 0, 0]} c="#d9b25a" m={0.95} ro={0.25} seg={40} />}
    <group position={[0.4, TOP + 0.21 + (1 - big) * 0.7, 0.06]} scale={big > 0 ? 1 : 0.001}>
      <Cy rt={0.21} h={0.035} r={[Math.PI / 2, 0, 0]} c="#d9b25a" m={0.95} ro={0.22} seg={64} />
      <Txt t="10%" w={0.27} c="#5a3e10" p={[0, 0, 0.02]} />
    </group>
  </S3>;
}}</Stage>;

// 12 · la escalera de noche: el cursor grande del termostato baja de 70 y choca contra el tope rojo sólido en 65 con rebote; el fantasma tachado que quería seguir hacia 55 se cae y rueda escalón por escalón por la escalera
export const HGuardrail: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), deg = lerp(70, 65, drop(u, 0.12, 0.42)), X = (d: number) => (d - 62.5) * 0.13, gh = win(u, 0.5, 0.9);
  const SY = (i: number) => 0.14 + i * 0.13, SX = (i: number) => -0.95 + i * 0.25;
  // el fantasma: cae del tope a la escalera (escalón 4) y baja de a un escalón saltando hasta el 0
  const fallP = win(gh, 0, 0.15), hp = cl((gh - 0.15) / 0.85) * 4, s0 = Math.min(3, Math.floor(hp)), fr = hp - s0;
  const gX = gh < 0.15 ? lerp(X(65), SX(4), fallP) : lerp(SX(4 - s0), SX(3 - s0), fr);
  const gY = gh < 0.15 ? lerp(1.3, SY(4) + 0.2, fallP * fallP) : lerp(SY(4 - s0), SY(3 - s0), fr) + 0.2 + Math.sin(fr * Math.PI) * 0.14;
  const gR = gh < 0.15 ? fallP * 0.6 : 0.6 + hp * (Math.PI / 2);
  return <S3 p={lv([0.2, 0.9, 2.6], [0.05, 0.85, 2.35], win(u, 0, 1))} l={[-0.05, 0.8, 0]} fov={38} floor={null}>
    <Bx s={[3.6, 2.4, 0.05]} p={[0, 1.2, -0.9]} map={PLASTER()} c="#c8c4da" ro={0.95} ns />
    <Bx s={[3.6, 0.08, 1.4]} p={[0, 0.0, -0.2]} c="#6b4a2e" ro={0.6} ns />
    {Array.from({ length: 5 }, (_, i) => <Bx key={i} s={[0.25, SY(i), 0.55]} p={[SX(i), SY(i) / 2, -0.35]} c="#7a5638" ro={0.55} rad={0.01} />)}
    {Array.from({ length: 5 }, (_, i) => <Cy key={i} rt={0.014} h={0.42} p={[SX(i), SY(i) + 0.21, -0.12]} c="#5a3a22" ro={0.4} />)}
    <Tube pts={[[SX(0), SY(0) + 0.42, -0.12], [SX(2), SY(2) + 0.42, -0.12], [SX(4) + 0.12, SY(4) + 0.42 + 0.04, -0.12]]} rad={0.03} c="#5a3a22" ro={0.4} />
    <group position={[0, 1.3, 0.1]}>
      <Bx s={[2.3, 0.42, 0.06]} c="#efece4" ro={0.42} rad={0.03} />
      <Bx s={[2.0, 0.05, 0.012]} p={[0, -0.06, 0.034]} c="#2a2a28" ro={0.6} />
      {[55, 60, 65, 70].map((d) => <Txt key={d} t={`${d}`} w={0.17} c={d === 65 ? "#c8302a" : "#3a332a"} p={[X(d), 0.1, 0.034]} />)}
      <Bx s={[0.1, 0.3, 0.1]} p={[X(65) - 0.13 + Math.abs(bump(u, 0.42, 30, 9)) * 0.0, -0.04, 0.07]} c="#e0261a" ro={0.4} rad={0.012} e="#ff2010" ei={0.7} />
      <Bx s={[0.15, 0.3, 0.08]} p={[X(deg) + Math.abs(bump(u, 0.42, 30, 9)) * 0.05, -0.04, 0.08]} c="#2c6fb0" ro={0.35} rad={0.015} />
    </group>
    {gh > 0.01 && <group position={[gX, gY, 0.1]} rotation={[0, 0, gR]}>
      <Bx s={[0.15, 0.3, 0.08]} c="#2c6fb0" o={0.5} ro={0.35} rad={0.015} />
      <Bx s={[0.3, 0.035, 0.02]} p={[0, 0, 0.05]} r={[0, 0, 0.8]} c="#e0261a" ns /><Bx s={[0.3, 0.035, 0.02]} p={[0, 0, 0.05]} r={[0, 0, -0.8]} c="#e0261a" ns />
    </group>}
  </S3>;
}}</Stage>;

const coil = (y: number, x0: number): V3[] => Array.from({ length: 50 }, (_, i) => [x0 + Math.sin(i * 1.9) * 0.015, y + i / 49 * 0.2, Math.cos(i * 1.9) * 0.015]);
// 13 · la tostadora: tostadora cromada vista desde arriba, con las resistencias de las ranuras pasando de gris a rojo vivo; al lado el medidor de luz con vidrio, disco plateado con marca roja que gira cada vez más rápido y tambores que ruedan
export const HToaster: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hot = win(u, 0.15, 0.45), ang = (u * 1.5 + Math.pow(u, 3) * 6) * Math.PI * 2, cc = mix("#55524f", "#ff4a1a", hot);
  return <S3 p={lv([0.3, 1.4, 2.1], [0.15, 1.3, 1.85], win(u, 0, 1))} l={[0.1, 0.45, 0]} fov={36}>
    <group position={[-0.55, 0, 0]} scale={1.5}>
      <Bx s={[0.6, 0.04, 0.34]} p={[0, 0.02, 0]} c="#dfe3e6" m={1} ro={0.12} rad={0.015} />
      <Bx s={[0.6, 0.34, 0.03]} p={[0, 0.19, 0.155]} c="#dfe3e6" m={1} ro={0.12} rad={0.04} />
      <Bx s={[0.6, 0.34, 0.03]} p={[0, 0.19, -0.155]} c="#dfe3e6" m={1} ro={0.12} rad={0.04} />
      {[-0.285, 0.285].map((x) => <Bx key={x} s={[0.03, 0.34, 0.34]} p={[x, 0.19, 0]} c="#dfe3e6" m={1} ro={0.12} rad={0.04} />)}
      <Bx s={[0.6, 0.03, 0.075]} p={[0, 0.355, 0.1325]} c="#e6eaec" m={1} ro={0.1} rad={0.01} />
      <Bx s={[0.6, 0.03, 0.09]} p={[0, 0.355, 0]} c="#e6eaec" m={1} ro={0.1} rad={0.01} />
      <Bx s={[0.6, 0.03, 0.075]} p={[0, 0.355, -0.1325]} c="#e6eaec" m={1} ro={0.1} rad={0.01} />
      {[-0.07, 0.07].map((z) => [-0.02, 0.02].map((dz) => <Bx key={`${z}${dz}`} s={[0.44, 0.24, 0.006]} p={[0, 0.22, z + dz]} c={cc} e="#ff3a10" ei={2.6 * hot} ro={0.5} ns />))}
      {[-0.07, 0.07].map((z) => [-0.15, 0, 0.15].map((x, j) => <group key={`${z}${j}`} position={[0, 0, z]}><Tube pts={coil(0.13, x)} rad={0.006} seg={90} c={cc} e="#ff3a10" ei={3 * hot} /></group>))}
      {[-0.07, 0.07].map((z, i) => <Pl key={i} w={0.46} h={0.05} p={[0, 0.372, z]} r={[-Math.PI / 2, 0, 0]} c="#ff5a20" add o={0.9 * hot} ns />)}
      <Bx s={[0.06, 0.05, 0.03]} p={[0.2, 0.2, 0.18]} c="#1a1a1a" ro={0.4} rad={0.01} /><Cy rt={0.03} h={0.03} p={[-0.2, 0.2, 0.185]} r={[Math.PI / 2, 0, 0]} c="#1a1a1a" ro={0.4} />
    </group>
    <pointLight position={[-0.55, 0.8, 0.2]} intensity={3.4 * hot} distance={1.8} color="#ff6a2a" />
    <group position={[0.78, 0, 0.05]} scale={1.6}>
      <Bx s={[0.46, 0.05, 0.22]} p={[0, 0.025, 0]} c="#3c3f44" m={0.6} ro={0.4} />
      <Bx s={[0.4, 0.7, 0.05]} p={[0, 0.4, -0.03]} c="#d8dde2" m={0.5} ro={0.3} rad={0.02} />
      <Cy rt={0.17} h={0.1} p={[0, 0.36, 0.045]} r={[Math.PI / 2, 0, 0]} c="#e8f4ff" o={0.22} ro={0.02} />
      <To R={0.17} t={0.014} p={[0, 0.36, 0.095]} c="#8a9096" m={0.9} ro={0.2} />
      <group position={[0, 0.36, 0.03]} rotation={[0, 0, -ang]}>
        <Cy rt={0.14} h={0.016} r={[Math.PI / 2, 0, 0]} c="#cfd4d8" m={0.95} ro={0.15} />
        <Bx s={[0.08, 0.03, 0.01]} p={[0.09, 0, 0.011]} c="#e0261a" e="#e0261a" ei={0.6} ns />
        <Bx s={[0.02, 0.02, 0.01]} p={[-0.1, 0, 0.011]} c="#2a2a2a" ns />
      </group>
      <Odo v={4200 + u * 60 + Math.pow(u, 3) * 300} n={4} p={[0, 0.63, 0.012]} s={0.7} />
    </group>
  </S3>;
}}</Stage>;

const clockFace = () => canvasTex("clockfacev3", 512, 512, (g) => {
  g.fillStyle = "#f6f1e4"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2a2520"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = BOLD(64);
  for (let i = 1; i <= 12; i++) { const a = i * 30 * D2R; g.fillText(String(i), 256 + 190 * Math.sin(a), 256 - 190 * Math.cos(a)); }
});
// 14 · el mismo fin de semana: el reloj de pared gira una hora hacia atrás con una flecha ámbar; en primer plano la tapita del termostato se abre en su bisagra y dos pilas AA caen adentro con rebote
export const HClockback: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), back = win(u, 0.06, 0.5), mA = -back * Math.PI * 2, hA = 60 * D2R - back * 30 * D2R, door = drop(u, 0.36, 0.52), cam = win(u, 0.3, 0.55), arc = back * 4.2, phi = Math.PI / 2 + arc;
  return <S3 p={lv([-0.3, 1.1, 2.4], [0.1, 0.95, 1.95], cam)} l={lv([-0.45, 1.05, 0], [0.1, 0.92, 0], cam)} fov={38} floor={null}>
    <Wall y={1.2} w={4.8} hh={2.9} />
    <group position={[-0.7, 1.25, 0.06]}>
      <Cy rt={0.46} h={0.08} r={[Math.PI / 2, 0, 0]} c="#6b4a2e" ro={0.45} seg={64} />
      <mesh position={[0, 0, 0.042]}><circleGeometry args={[0.41, 64]} /><meshStandardMaterial map={clockFace()} roughness={0.6} /></mesh>
      <group position={[0, 0, 0.05]} rotation={[0, 0, -hA]}><Bx s={[0.04, 0.22, 0.01]} p={[0, 0.1, 0]} c="#1a1a1a" ns /></group>
      <group position={[0, 0, 0.06]} rotation={[0, 0, -mA]}><Bx s={[0.026, 0.34, 0.01]} p={[0, 0.16, 0]} c="#1a1a1a" ns /></group>
      <Sp rad={0.03} p={[0, 0, 0.068]} c="#c9a24a" m={0.9} ro={0.3} />
      {arc > 0.05 && <>
        <To R={0.56} t={0.018} arc={arc} r={[0, 0, Math.PI / 2]} p={[0, 0, 0.03]} c="#ffb14a" e="#ffb14a" ei={1.6} />
        <mesh position={[0.56 * Math.cos(phi), 0.56 * Math.sin(phi), 0.03]} rotation={[0, 0, phi]}><coneGeometry args={[0.06, 0.14, 16]} /><meshStandardMaterial color="#ffb14a" emissive="#ffb14a" emissiveIntensity={1.6} /></mesh>
      </>}
    </group>
    <group position={[0.5, 0.78, 0.05]} scale={2.6}>
      <Bx s={[0.34, 0.26, 0.05]} c="#efece4" ro={0.42} rad={0.03} />
      <Pl w={0.2} h={0.095} p={[0, 0.07, 0.0275]} map={lcd("68")} c="#ffffff" e="#9fd08a" ei={0.6} ro={0.35} ns />
      <Bx s={[0.29, 0.12, 0.012]} p={[0, -0.055, 0.028]} c="#121212" ro={0.6} rad={0.006} />
      {[-0.06, 0.06].map((x) => <Bx key={x} s={[0.05, 0.1, 0.006]} p={[x, -0.055, 0.036]} c="#2c2c2c" ro={0.5} />)}
      <group position={[0, -0.115, 0.034]} rotation={[door * 1.55, 0, 0]}><Bx s={[0.3, 0.115, 0.012]} p={[0, 0.0575, 0]} c="#e4e0d6" ro={0.45} rad={0.01} /></group>
      {[0, 1].map((i) => { const d = drop(u, 0.5 + i * 0.09, 0.66 + i * 0.09);
        return <group key={i} position={[i ? 0.06 : -0.06, lerp(0.62, -0.055, d), 0.046]} rotation={[0, 0, (1 - d) * 0.7 * (i ? -1 : 1)]}>
          <Cy rt={0.021} h={0.09} c="#1d1d1d" ro={0.35} m={0.3} /><Cy rt={0.0215} h={0.02} p={[0, -0.025, 0]} c="#c9a24a" m={0.9} ro={0.25} /><Cy rt={0.009} h={0.012} p={[0, 0.05, 0]} c="#cfcfcf" m={0.9} ro={0.2} />
        </group>; })}
    </group>
  </S3>;
}}</Stage>;

// 15 · el mercurio: el termostato redondo dorado se ladea 15° y, delante, un tubo de vidrio grande con una bola de mercurio plateada rueda de punta a punta con reflejo; al llegar la aguja salta 3°
export const HTilt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), tilt = drop(u, 0.28, 0.46), roll = win(u, 0.34, 0.6), deg = 70 + 3 * win(u, 0.58, 0.64), ta = -tilt * 15 * D2R;
  return <S3 p={lv([0.1, 1.1, 2.2], [0.0, 1.0, 1.85], win(u, 0, 1))} l={[0, 0.9, 0]} fov={38} floor={null}>
    <Wall y={1.1} w={4.6} hh={2.8} />
    <RoundThermo deg={deg} p={[0, 1.2, 0.04]} r={[0, 0, ta]} s={2.2} ring="#e0b23a" />
    <group position={[0, 0.4, 0.5]} rotation={[0, 0, ta]}>
      <Bx s={[1.5, 0.08, 0.1]} p={[0, -0.12, -0.02]} c="#3a332a" ro={0.5} rad={0.02} />
      <Cy rt={0.1} h={1.3} r={[0, 0, Math.PI / 2]} c="#eef6fa" o={0.28} ro={0.02} m={0.1} />
      <Sp rad={0.085} p={[lerp(-0.5, 0.5, roll), -0.012, 0]} c="#e6eaee" m={1} ro={0.03} seg={40} />
      <Dot p={[lerp(-0.5, 0.5, roll) - 0.03, 0.03, 0.065]} r={0.014} c="#ffffff" o={0.9} add />
      <Bx s={[0.5, 0.012, 0.02]} p={[0, 0.07, 0.07]} c="#ffffff" o={0.35} ns />
      {[-0.68, 0.68].map((x) => <Cy key={x} rt={0.115} h={0.1} p={[x, 0, 0]} r={[0, 0, Math.PI / 2]} c="#b87333" m={0.9} ro={0.3} />)}
    </group>
    <pointLight position={[0.5, 1.2, 1.2]} intensity={2} distance={3} color="#ffffff" />
  </S3>;
}}</Stage>;

const boxTex = () => canvasTex("progboxv3", 512, 512, (g) => {
  g.fillStyle = "#b98a52"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,235,200" : "70,45,20"},.07)`; g.fillRect(rnd(i, 3) * 512, rnd(i, 5) * 512, 4 + rnd(i, 7) * 12, 2); }
  g.fillStyle = "#e9d9b0"; g.fillRect(226, 0, 60, 512); g.fillStyle = "#f6f4ee"; g.fillRect(40, 250, 432, 150); g.fillStyle = "#2b4d6e"; g.fillRect(40, 250, 432, 38);
  g.fillStyle = "#222"; g.font = BOLD(54); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("PROGRAMMABLE", 256, 345);
});
// 16 · no es caro: las solapas de la caja de cartón revientan hacia arriba, el termostato programable sale disparado girando y su pantalla se prende en 68, y la etiqueta del precio cuelga de un hilo y se balancea
export const HCycles: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), op = drop(u, 0.1, 0.32), fa = op * 2.3, rise = drop(u, 0.22, 0.5), turn = (1 - win(u, 0.25, 0.58)) * 3.2, scr = win(u, 0.55, 0.62), tag = drop(u, 0.58, 0.76), sw = Math.sin(tt * 3.2) * 0.14 * (1 - win(u, 0.85, 1));
  const fl = (c: string) => ({ c, ro: 0.8, rad: 0.004 });
  return <S3 p={lv([0.3, 0.95, 2.2], [0.1, 0.9, 1.9], win(u, 0, 1))} l={[0.05, 0.68, 0]} fov={36}>
    <Bx s={[0.7, 0.4, 0.45]} p={[0, 0.2, 0]} c="#ffffff" map={boxTex()} ro={0.85} rad={0.006} />
    <Pl w={0.64} h={0.39} p={[0, 0.402, 0]} r={[-Math.PI / 2, 0, 0]} c="#2a1c10" ns />
    <group position={[0, 0.4, 0.225]} rotation={[fa, 0, 0]}><Bx s={[0.7, 0.012, 0.225]} p={[0, 0, -0.1125]} {...fl("#a77a44")} /></group>
    <group position={[0, 0.4, -0.225]} rotation={[-fa * 1.05, 0, 0]}><Bx s={[0.7, 0.012, 0.225]} p={[0, 0, 0.1125]} {...fl("#a77a44")} /></group>
    <group position={[-0.35, 0.4, 0]} rotation={[0, 0, fa * 0.95]}><Bx s={[0.2, 0.012, 0.45]} p={[0.1, 0, 0]} {...fl("#b08150")} /></group>
    <group position={[0.35, 0.4, 0]} rotation={[0, 0, -fa * 0.95]}><Bx s={[0.2, 0.012, 0.45]} p={[-0.1, 0, 0]} {...fl("#b08150")} /></group>
    <Puff p={[0, lerp(0.12, 0.98, rise), -0.05]} s={1.1} c="#9fe08a" o={0.4 * scr} />
    <Thermo3 v={scr > 0.5 ? "68" : "  "} p={[0, lerp(0.12, 0.98, rise), 0.02]} r={[0, turn, 0]} s={1.8} glow={1.3 * scr} dark={scr < 0.5} />
    <group position={[0.72, 1.5 + (1 - tag) * 0.7, 0.1]} rotation={[0, 0, sw]}>
      <Tube pts={[[0, 0, 0], [0, -0.15, 0], [0, -0.3, 0]]} rad={0.006} c="#d8cdb0" ro={0.8} />
      <Bx s={[0.8, 0.34, 0.012]} p={[0, -0.47, 0]} c="#f5efdc" ro={0.85} rad={0.02} />
      <Txt t="UNDER $40" w={0.68} c="#1f7a3a" p={[0, -0.47, 0.008]} />
    </group>
  </S3>;
}}</Stage>;

const recTex = () => canvasTex("recsym", 256, 256, (g) => {
  g.strokeStyle = "#ffffff"; g.fillStyle = "#ffffff"; g.lineWidth = 22; g.lineJoin = "round"; g.lineCap = "round";
  const P = [[128, 40], [220, 205], [36, 205]]; g.beginPath(); g.moveTo(P[0][0], P[0][1]); g.lineTo(P[1][0], P[1][1]); g.lineTo(P[2][0], P[2][1]); g.closePath(); g.stroke();
  for (let i = 0; i < 3; i++) { const a = P[i], b = P[(i + 1) % 3], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], an = Math.atan2(b[1] - a[1], b[0] - a[0]); g.save(); g.translate(m[0], m[1]); g.rotate(an); g.beginPath(); g.moveTo(26, 0); g.lineTo(-14, -26); g.lineTo(-14, 26); g.closePath(); g.fill(); g.restore(); }
});
// 17 · el viejo no va a la basura: el tacho verde abierto recibe al termostato redondo que cae girando, la tapa se cierra con rebote y un sello de goma grande baja con golpe y estampa «FREE» en la tapa
export const HRecyclebin: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fall = win(u, 0.06, 0.4), lid = drop(u, 0.42, 0.54), st = drop(u, 0.6, 0.7), up = win(u, 0.78, 0.92), ink = win(u, 0.66, 0.7);
  return <S3 p={lv([0.5, 1.55, 3.0], [0.3, 1.4, 2.6], win(u, 0, 1))} l={[0, 0.82, 0]} fov={36}>
    <group scale={1.6}>
      <Cy rt={0.3} rb={0.25} h={0.7} p={[0, 0.35, 0]} c="#2f7a3e" ro={0.5} open />
      <Cy rt={0.27} rb={0.22} h={0.68} p={[0, 0.35, 0]} c="#1f5a2c" ro={0.7} open />
      <Cy rt={0.25} h={0.02} p={[0, 0.02, 0]} c="#1a4a24" ro={0.8} />
      <To R={0.3} t={0.02} p={[0, 0.7, 0]} r={[Math.PI / 2, 0, 0]} c="#2a6a38" ro={0.5} />
      {[0.2, 0.45].map((y) => <To key={y} R={0.25 + 0.05 * (y / 0.7) + 0.004} t={0.01} p={[0, y, 0]} r={[Math.PI / 2, 0, 0]} c="#2a6a38" ro={0.5} />)}
      <Pl w={0.2} h={0.2} p={[0, 0.34, 0.284]} r={[0.07, 0, 0]} map={recTex()} c="#ffffff" ro={0.6} ns />
      {[-0.22, 0.22].map((x) => <Cy key={x} rt={0.07} h={0.05} p={[x, 0.07, -0.19]} r={[0, 0, Math.PI / 2]} c="#1a1a1a" ro={0.7} />)}
      <RoundThermo deg={70} p={[lerp(0.04, 0, fall), lerp(1.3, 0.45, fall * fall), lerp(0.1, 0, fall)]} r={[0.15 * (1 - fall), 0, fall * 8]} s={0.95} ring="#e0b23a" />
      <group position={[0, 0.71, -0.3]} rotation={[-(1 - lid) * 1.95, 0, 0]}>
        <Cy rt={0.32} h={0.04} p={[0, 0.02, 0.3]} c="#2f7a3e" ro={0.45} />
        <To R={0.31} t={0.014} p={[0, 0.04, 0.3]} r={[Math.PI / 2, 0, 0]} c="#2a6a38" ro={0.5} />
      </group>
      <Txt t="FREE" w={0.4} c="#d4231c" o={ink * 0.95} e={0.2} p={[0, 0.753, 0.0]} r={[-Math.PI / 2, 0, 0]} />
      <group position={[0.0, 0.752 + (1 - st) * 0.7 + up * 1.0, 0.0]}>
        <Bx s={[0.46, 0.06, 0.22]} p={[0, 0.03, 0]} c="#3a2a1c" ro={0.7} rad={0.015} />
        <Bx s={[0.44, 0.008, 0.2]} p={[0, 0.002, 0]} c="#a31d18" ro={0.9} ns />
        <Cy rt={0.04} h={0.18} p={[0, 0.15, 0]} c="#6b4a2e" ro={0.6} /><Sp rad={0.07} p={[0, 0.27, 0]} c="#6b4a2e" ro={0.6} />
      </group>
    </group>
  </S3>;
}}</Stage>;
