// mar11a · componentes únicos 1-17 (antes de la primera helada), 3D en el kit r3k. Cada uno es UNA acción física que se ve
// entera en el plano (u = 0..1), sin rótulos que repitan la voz. Registro: D:/rtmp/mar11_COMPONENTES.md
// vuelta 2 (EVALUADOR v1: pasto de ruido, manos de maniquí, carteles chicos, cuadros iguales): texturas de foto, sin manos,
// la idea la hace un objeto que se mueve con peso; los números van impresos EN el objeto y grandes.
import React from "react";
import * as THREE from "three";
import { BOLD, Bx, Cy, D2R, HANDF, MONO, Pl, Puff, S3 as S3k, Sp, To, Tube, Txt, V3, canvasTex, cl, drop, lerp, lv, rnd, win, env, Env } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { BrickWall, FrostGround, Gutter, HPU, LEAFC, Leaf, U, bump, cum, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";

const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
const Wall: React.FC<{ w?: number; hh?: number; z?: number; c?: string }> = ({ w = 5, hh = 3, z = -0.4, c = "#ffffff" }) =>
  <PhotoWall w={w} h={hh} z={z} y={hh / 2 - 0.3} name="t_pared.jpg" tint={c} />;
const Table: React.FC<{ w?: number; d?: number }> = ({ w = 3.4, d = 2.2 }) => <PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} />;

env(Wall); env(Table);
// 1 · la ventana de la madrugada: la escarcha crece en cristales gruesos desde el marco y un dedo invisible escribe «19» en el vidrio; por el trazo se ve la unidad nevada
const frostTex = (k: number, w: number) => canvasTex(`frost11b|${Math.round(k * 30)}|${Math.round(w * 40)}`, 512, 640, (g) => {
  g.clearRect(0, 0, 512, 640);
  g.fillStyle = `rgba(222,236,248,${0.82 * k})`; g.fillRect(0, 0, 512, 640);
  for (let i = 0; i < 70; i++) {
    const side = i % 4, s0 = rnd(i, 2), L = (90 + 220 * rnd(i, 3)) * k;
    let x = side === 0 ? 0 : side === 1 ? 512 : s0 * 512, y = side === 2 ? 640 : side === 3 ? 0 : s0 * 640;
    const a0 = side === 0 ? 0 : side === 1 ? Math.PI : side === 2 ? -Math.PI / 2 : Math.PI / 2;
    for (let j = 0; j < 6; j++) { const a = a0 + (rnd(i * 7 + j, 4) - 0.5) * 1.0, st = L / 6, nx = x + Math.cos(a) * st, ny = y + Math.sin(a) * st, lw = 9 - j * 1.2;
      g.strokeStyle = "rgba(255,255,255,.95)"; g.lineWidth = lw; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke();
      for (const sg of [-1, 1]) { g.lineWidth = lw * 0.55; g.beginPath(); g.moveTo(nx, ny); g.lineTo(nx + Math.cos(a + sg * 0.75) * st * 0.7, ny + Math.sin(a + sg * 0.75) * st * 0.7); g.stroke(); }
      x = nx; y = ny; }
  }
  if (w > 0) { g.save(); g.beginPath(); g.rect(0, 0, 70 + w * 380, 640); g.clip(); g.globalCompositeOperation = "destination-out";
    g.font = BOLD(380); g.lineWidth = 34; g.lineJoin = "round"; g.lineCap = "round"; g.strokeStyle = "#000"; g.strokeText("19", 70, 440);
    for (let d = 0; d < 7; d++) { const dx = 120 + d * 46, dl = 40 + 90 * rnd(d, 9) * w; g.fillRect(dx, 455, 9, dl); }
    g.restore(); }
});
export const MFrostpane: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = 0.25 + 0.75 * win(u, 0.0, 0.3), w = win(u, 0.3, 0.7);
  return <S3 p={lv([0, 1.2, 2.0], [0.05, 1.18, 1.5], win(u, 0, 1))} l={[0, 1.15, 0]} fov={36} floor={null} warm="#ffd9b0">
    <group position={[0, 0.2, -2.2]}><FrostGround w={8} d={4} /><HPU p={[0.15, 0, 0]} s={1.5} frost={0.9} /><PhotoWall w={8} h={3} z={-0.9} /></group>
    <Pl w={14} h={7} p={[0, 2.5, -5]} c="#1d2b44" e="#1d2b44" ei={0.5} ro={1} ns />
    <Sp rad={0.25} p={[2.2, 3.4, -4.8]} c="#f4f1e0" e="#f4f1e0" ei={1.2} ns />
    <pointLight position={[0.6, 1.8, -1.6]} intensity={2.2} distance={4} color="#ffd08a" />
    {[[1.5, 0.08, 0.12, 0, 0.45], [1.5, 0.08, 0.12, 0, 1.95], [0.08, 1.58, 0.12, -0.72, 1.2], [0.08, 1.58, 0.12, 0.72, 1.2]].map(([a, b, c, x, y], i) => <Bx key={i} s={[a, b, c]} p={[x, y, 0]} c="#efe9dd" ro={0.6} />)}
    <Bx s={[1.6, 0.06, 0.22]} p={[0, 0.39, 0.08]} c="#e6dccb" ro={0.6} />
    <Pl w={1.36} h={1.46} p={[0, 1.2, 0.01]} c="#bcd2e6" o={0.1} ro={0.05} ns />
    <Pl w={1.36} h={1.46} p={[0, 1.2, 0.02]} map={frostTex(k, w)} c="#ffffff" o={0.97} ro={0.3} ns />
    {([[-1.75, 1.2, 2, 3.2], [1.75, 1.2, 2, 3.2], [0, 2.45, 1.5, 0.9], [0, 0.0, 1.5, 0.9]] as number[][]).map(([x, y, ww, hh], i) => <PhotoPl key={i} w={ww} h={hh} p={[x, y, -0.07]} name="t_pared.jpg" tint="#efe6d6" ro={0.95} />)}
  </S3>;
}}</Stage>;

// 2 · el reloj de cocina: gira solo a diez minutos y va bajando; alrededor, siete botones grandes que se hunden y prenden de a uno, un paso cada uno
const dialTex = () => canvasTex("egg11dial", 512, 128, (g) => {
  g.fillStyle = "#fbf7ee"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#222"; g.font = BOLD(44); g.textAlign = "center";
  for (let i = 0; i < 60; i++) { const x = (i / 60) * 512; g.fillRect(x, 0, 3, i % 5 ? 24 : 44); if (i % 5 === 0) g.fillText(String(i), x, 98); }
});
const numTex = (n: number) => canvasTex(`egg11n|${n}`, 128, 128, (g) => { g.fillStyle = "#f6f1e4"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#1a1a1a"; g.font = BOLD(92); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 64, 70); });
export const MEggtimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), wind = win(u, 0.02, 0.22), run = win(u, 0.26, 1), mins = 10 * wind * (1 - run * 0.7), ang = (mins / 60) * Math.PI * 2;
  const step = win(u, 0.28, 0.95) * 7;
  return <S3 zk={1.3} p={lv([0.56, 0.88, 1.24], [0.32, 0.72, 0.92], win(u, 0, 1))} l={[0, 0.2, 0]} fov={36} floor={null}>
    <Table />
    <group><Cy rt={0.22} rb={0.24} h={0.2} p={[0, 0.1, 0]} c="#f4efe2" ro={0.35} />
    <group rotation={[0, -ang, 0]}>
      <Cy rt={0.225} h={0.07} p={[0, 0.235, 0]} map={dialTex()} c="#ffffff" ro={0.4} />
      <Sp rad={0.2} p={[0, 0.27, 0]} sc={[1, 0.55, 1]} c="#d2402f" ro={0.3} />
      <Bx s={[0.05, 0.08, 0.16]} p={[0, 0.38, 0]} c="#b5321f" ro={0.3} />
    </group>
    <Bx s={[0.014, 0.07, 0.024]} p={[0, 0.24, 0.236]} c="#111" /></group>
    {Array.from({ length: 7 }, (_, i) => { const a = -1.15 + i * 0.383, on = cl(step - i), press = bump(step / 7, i / 7 + 0.001, 40, 14);
      return <group key={i} position={[Math.sin(a) * 0.52, 0, Math.cos(a) * 0.52]} rotation={[0, a, 0]}>
        <Cy rt={0.1} h={0.03} p={[0, 0.015, 0]} c="#2a2724" ro={0.5} />
        <Cy rt={0.082} h={0.05} p={[0, 0.045 - 0.02 * on - 0.01 * press, 0]} c={on > 0.5 ? "#3fbf6a" : "#d9d3c4"} e={on > 0.5 ? "#3fbf6a" : undefined} ei={0.9 * on} ro={0.35} />
        <Pl w={0.11} h={0.11} p={[0, 0.072 - 0.02 * on, 0]} r={[-Math.PI / 2, 0, 0]} map={numTex(i + 1)} c="#ffffff" ro={0.5} ns />
        {on > 0.5 && <pointLight position={[0, 0.15, 0]} intensity={0.35} distance={0.5} color="#5dff8a" />}
      </group>; })}
  </S3>;
}}</Stage>;

// 3 · la tormenta de hojas: un rastrillo barre las hojas del jardín contra tres lados de la unidad; el ventilador se ahoga y las aletas se escarchan
const Rake: React.FC<{ p: V3; r?: V3 }> = ({ p, r = [0, 0, 0] }) => <group position={p} rotation={r}>
  <Cy rt={0.022} h={0.95} p={[0, 0.48, 0]} c="#b08a5a" ro={0.8} />
  <Bx s={[0.55, 0.03, 0.04]} p={[0, 0.02, 0]} c="#3c6e3a" ro={0.5} />
  {Array.from({ length: 13 }, (_, i) => <Bx key={i} s={[0.006, 0.006, 0.14]} p={[-0.26 + i * 0.043, 0.0, 0.07]} r={[0.3, 0, 0]} c="#2e5a2c" ro={0.5} ns />)}
</group>;
export const MLeafstorm: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), pile = win(u, 0.1, 0.78), D = h.out - h.at, rk = win(u, 0.04, 0.7);
  const fan = 14 * D * cum((x) => 1 - 0.85 * win(x, 0.3, 0.85), u);
  const sides: [number, number][] = [[-0.62, 0], [0, 0.62], [0.62, 0]];
  return <S3 zk={1.3} p={lv([1.65, 1.66, 2.75], [1.155, 1.33, 2.145], win(u, 0, 1))} l={[0, 0.45, 0]} fov={38} floor={null}>
    <FrostGround /><BrickWall w={6} h={2.6} z={-0.75} />
    <HPU s={1.4} fan={fan} frost={pile * 0.95} />
    {sides.map(([x, z], si) => Array.from({ length: 80 }, (_, i) => { const j = si * 80 + i, f0 = (i / 80) * 0.7, ft = win(pile, f0, f0 + 0.22), ph = (i / 80) * 0.75 * pile;
      const tx = x !== 0 ? x + Math.sign(x) * (rnd(j) - 0.15) * 0.32 : (rnd(j) - 0.5) * 0.95, tz = z !== 0 ? z + (rnd(j, 2) - 0.15) * 0.32 : (rnd(j, 2) - 0.5) * 0.95;
      const sx = lerp(tx + 1.6, tx, ft), sz = lerp(tz + 1.4, tz, ft);
      return ft > 0 ? <Leaf key={j} p={[sx, 0.03 + ph * (1 - Math.abs(rnd(j, 5) - 0.5)) + Math.sin(ft * Math.PI) * 0.25, sz]} r={[-Math.PI / 2 + (rnd(j, 3) - 0.5) * 1.6 * (1 - ft) + (rnd(j, 3) - 0.5) * 0.8, rnd(j, 4) * 6, (rnd(j, 6) - 0.5) * 1.2]} s={2.2} c={LEAFC[j % 5]} /> : null; }))}
    <Rake p={[lerp(2.0, 0.95, rk), 0, lerp(1.6, 0.85, rk)]} r={[0.35 * Math.sin(tt * 3.2), 0.8, 0.55]} />
  </S3>;
}}</Stage>;

// 4 · las estacas: caen cuatro estacas a dos pies de cada esquina con polvo, un hilo amarillo las une y una regla de carpintero de 24" queda en el pasto; desde la canaleta baja una plomada
const rulerTex = () => canvasTex("ruler11", 1024, 96, (g) => { g.fillStyle = "#e9c56a"; g.fillRect(0, 0, 1024, 96); g.fillStyle = "#2a2016"; for (let i = 0; i <= 24; i++) { const x = 12 + i * 41.6; g.fillRect(x, 0, 4, i % 6 ? 26 : 46); if (i % 6 === 0 && i) { g.font = BOLD(40); g.fillText(String(i), x - 18, 86); } } g.font = BOLD(46); g.fillText('24"', 880, 86); });
export const MStakeline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), R = 1.02, C: [number, number][] = [[-R, R], [R, R], [R, -0.62], [-R, -0.62]], ln = win(u, 0.24, 0.46), rl = win(u, 0.4, 0.55), pl = win(u, 0.5, 0.66);
  const pts: V3[] = []; const per = C.length; for (let i = 0; i <= 48; i++) { const f = (i / 48) * per * ln, j = Math.floor(f) % per, k = f - Math.floor(f), a = C[j], b = C[(j + 1) % per]; pts.push([lerp(a[0], b[0], k), 0.3, lerp(a[1], b[1], k)]); }
  return <S3 zk={1.3} p={lv([1.76, 2.38, 2.95], [1.32, 1.94, 2.345], win(u, 0, 1))} l={[0, 0.4, 0.2]} fov={44} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-0.75} />
    <Gutter p={[0, 1.9, -0.55]} w={3} />
    <HPU s={1.4} />
    {C.map(([x, z], i) => { const a0 = 0.04 + i * 0.07, d = drop(u, a0, a0 + 0.12), land = win(u, a0 + 0.08, a0 + 0.2); return d > 0 ? <group key={i} position={[x, lerp(1.6, 0, d), z]}>
      <Bx s={[0.08, 0.5, 0.08]} p={[0, 0.17, 0]} c="#a07a4a" ro={0.85} rad={0.01} /><Cy rt={0.0} rb={0.045} h={0.1} p={[0, -0.12, 0]} r={[Math.PI, 0, 0]} c="#8a6a3e" ro={0.85} seg={4} />
      <Bx s={[0.09, 0.08, 0.09]} p={[0, 0.42, 0]} c="#e2582a" ro={0.6} rad={0.01} />
      {land > 0 && land < 1 && [0, 1, 2].map((q) => <Puff key={q} p={[(q - 1) * 0.1, 0.05, 0.05]} s={0.15 + land * 0.35} c="#b9a88a" o={0.5 * (1 - land)} add={false} />)}</group> : null; })}
    {ln > 0.02 && <Tube pts={pts} rad={0.012} c="#ffd21f" e="#ffd21f" ei={0.35} ro={0.5} seg={96} />}
    {rl > 0 && <group position={[0.0, 0.015, 0.83]} rotation={[-Math.PI / 2, 0, 0.0]}><Bx s={[1.02 * rl, 0.11, 0.014]} p={[0, 0, 0]} c="#e9c56a" ro={0.6} /><Pl w={1.02 * rl} h={0.105} p={[0, 0, 0.008]} map={rulerTex()} c="#ffffff" ro={0.6} ns /></group>}
    {pl > 0 && <group><Bx s={[0.014, 1.6 * pl, 0.014]} p={[0.9, 1.84 - 0.8 * pl, 0.55]} c="#f2f2f2" e="#ffffff" ei={0.3} ns /><Cy rt={0.0} rb={0.08} h={0.17} p={[0.9, 1.84 - 1.6 * pl - 0.06, 0.55]} r={[Math.PI, 0, 0]} c="#c79a3a" m={0.85} ro={0.25} /></group>}
  </S3>;
}}</Stage>;

// 5 · la lona: una lona de tela cae con pliegues y se amolda a la unidad, el ventilador frena y las aletas se escarchan; la lona sale volando con el viento
const Tarp: React.FC<{ f: number; yank: number; tt: number }> = ({ f, yank, tt }) => {
  const top = 0.9, E = 0.43, g = new THREE.PlaneGeometry(1.5, 1.5, 30, 30); g.rotateX(-Math.PI / 2);
  const ps = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < ps.count; i++) {
    const x0 = ps.getX(i), z0 = ps.getZ(i), dx = Math.max(0, Math.abs(x0) - E), dz = Math.max(0, Math.abs(z0) - E), d = Math.hypot(dx, dz);
    const dr = d > 0 ? Math.min(d * 1.05, top - 0.03) : 0, out = d > 0 ? 0.04 + d * 0.12 : 0;
    const xd = d > 0 ? Math.sign(x0) * (Math.min(Math.abs(x0), E) + (dx / d) * out) : x0, zd = d > 0 ? Math.sign(z0) * (Math.min(Math.abs(z0), E) + (dz / d) * out) : z0;
    const wr = Math.sin(x0 * 23 + z0 * 7) * Math.cos(z0 * 19 - x0 * 5) * 0.018 * (0.3 + d * 2);
    const yd = top + 0.01 - dr + wr, flap = Math.sin(x0 * 6 + tt * 14) * 0.12 * yank + Math.sin(z0 * 5 + tt * 9) * 0.08 * yank;
    ps.setXYZ(i, lerp(x0, xd, f * (1 - yank)), lerp(top + 0.02, yd, f * (1 - yank)) + flap, lerp(z0, zd, f * (1 - yank)));
  }
  g.computeVertexNormals();
  return <mesh geometry={g} castShadow receiveShadow><meshStandardMaterial color="#2f6fd0" roughness={0.75} side={THREE.DoubleSide} /></mesh>;
};
export const MTarpdrop: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, fall = drop(u, 0.06, 0.24), f = win(u, 0.18, 0.36), yank = win(u, 0.72, 0.9), ice = win(u, 0.34, 0.68) * (1 - win(u, 0.9, 1) * 0.3);
  const fan = 14 * D * cum((x) => 1 - 0.97 * win(x, 0.28, 0.5) + 0.97 * win(x, 0.9, 0.99), u);
  return <S3 p={lv([1.35, 1.45, 2.15], [0.95, 1.2, 1.7], win(u, 0, 1))} l={[0, 0.55, 0]} fov={38} floor={null}>
    <FrostGround /><BrickWall w={6} h={2.6} z={-0.75} />
    <HPU s={1.4} fan={fan} frost={ice} />
    {yank < 1 && <group position={[yank * 2.4, lerp(1.4, 0, fall) + yank * 1.6, yank * 0.6]} rotation={[yank * 0.5, yank * 0.8, -yank * 1.1]}><Tarp f={f} yank={yank} tt={tt} /></group>}
    {yank > 0 && yank < 1 && Array.from({ length: 6 }, (_, i) => <Leaf key={i} p={[0.3 + yank * 2 + i * 0.12, 0.2 + yank * 1.2 + rnd(i) * 0.4, 0.3 + rnd(i, 2) * 0.5]} r={[tt * 5 + i, tt * 3, i]} s={1.3} c={LEAFC[i % 5]} />)}
  </S3>;
}}</Stage>;

// 6 · el testigo de hielo: en el ladrillo un almanaque pierde una hoja por día y la gota de la canaleta suma un anillo de hielo sobre la tapa, como un tronco
const calTex = (d: string) => canvasTex(`cal11|${d}`, 256, 320, (g) => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#c3352a"; g.fillRect(0, 0, 256, 80); g.fillStyle = "#fff"; g.font = BOLD(56); g.textAlign = "center"; g.fillText("JAN", 128, 62); g.fillStyle = "#1a1a1a"; g.font = BOLD(180); g.fillText(d, 128, 270); });
export const MIcecore: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = win(u, 0.04, 0.85) * 6, day = Math.min(5, Math.floor(g)), tear = g - Math.floor(g);
  return <S3 zk={1.32} p={[0.17, 1.48, 1.8]} l={[-0.35, 1.0, -0.2]} fov={40} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-0.75} />
    <Gutter p={[0, 2.25, -0.4]} w={3} sag={0.04} />
    <HPU s={1.4} frost={0.7} />
    {Array.from({ length: 5 }, (_, i) => { const f = (tt * 1.1 + i / 5) % 1; return <Sp key={i} rad={0.034} sc={[1, 1.5, 1]} p={[0, 2.15 - f * (2.15 - 0.95 - g * 0.12), -0.1]} c="#bfe4ff" o={0.95} ro={0.05} m={0.3} />; })}
    {[0, 1, 2, 3, 4, 5].map((i) => { const k = cl(g - i); if (k <= 0) return null; const y = 0.9 + i * 0.12, rr = 0.34 - i * 0.035;
      return <group key={i}>
        <mesh position={[0, y + 0.06 * k, -0.1]} castShadow><cylinderGeometry args={[rr - 0.02, rr, 0.12 * k, 40]} /><meshPhysicalMaterial color={i % 2 ? "#cfe9ff" : "#eaf6ff"} roughness={0.06} transmission={0.55} thickness={0.3} clearcoat={1} /></mesh>
        <To R={rr + 0.004} t={0.01} p={[0, y + 0.004, -0.1]} r={[Math.PI / 2, 0, 0]} c="#6aaee0" o={1} ro={0.1} />
      </group>; })}
    <group position={[-0.95, 1.35, -0.68]} scale={1.7}>
      <Bx s={[0.42, 0.5, 0.02]} p={[0, 0, -0.01]} c="#3a2a1e" ro={0.8} />
      <Pl w={0.38} h={0.47} p={[0, -0.01, 0.005]} map={calTex(String(14 + day + (tear > 0.5 && day < 5 ? 1 : 0)))} c="#ffffff" ro={0.7} ns />
      {day < 5 && tear < 0.5 && <group position={[0, 0.22, 0.01]} rotation={[-tear * 2.4, 0, tear * 0.6]}><Pl w={0.38} h={0.47} p={[0, -0.235, 0.004]} map={calTex(String(14 + day))} c="#ffffff" ro={0.7} ns /></group>}
    </group>
  </S3>;
}}</Stage>;

// 7 · el desviador: la canaleta gotea justo sobre la tapa; baja el codo, encaja con un clic, se estira la prolongación telescópica y el chorro sale lejos de la unidad
export const MDiverter: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), fit = drop(u, 0.12, 0.28), ext = win(u, 0.3, 0.46), on = win(u, 0.44, 0.52), pool = win(u, 0.5, 0.85);
  const end: V3 = [lerp(0.7, 1.75, ext), lerp(1.1, 0.25, ext), -0.35];
  return <S3 zk={1.25} p={lv([1.495, 1.88, 2.75], [1.22, 1.605, 2.255], win(u, 0, 1))} l={[0.45, 1.0, 0]} fov={42} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-0.75} />
    <Gutter p={[0, 2.2, -0.5]} w={3} sag={0.03} />
    <HPU s={1.4} frost={0.6} />
    {Array.from({ length: 7 }, (_, i) => { const f = (tt * 1.3 + i / 7) % 1; return on < 1 ? <Sp key={i} rad={0.02} sc={[1, 1.4, 1]} p={[0, 2.12 - f * 1.2, -0.45]} c="#cfeaff" o={0.9 * (1 - on)} ro={0.05} m={0.2} ns /> : null; })}
    <group position={[0, lerp(1.4, 0, fit), 0]}>
      <Cy rt={0.06} h={0.28} p={[0, 2.0, -0.45]} c="#f2f2ef" ro={0.35} m={0.1} />
      <To R={0.062} t={0.012} p={[0, 2.13, -0.45]} r={[Math.PI / 2, 0, 0]} c="#dcdcd8" ro={0.3} />
      <Tube pts={[[0, 1.86, -0.45], [0.12, 1.66, -0.43], [0.45, 1.38, -0.4], [0.7, 1.1, -0.35]]} rad={0.055} c="#f2f2ef" ro={0.35} seg={40} />
    </group>
    {fit > 0.98 && <Tube pts={[[0.68, 1.12, -0.35], [lerp(0.7, 1.2, ext), lerp(1.1, 0.7, ext), -0.35], end]} rad={0.05} c="#e8e8e4" ro={0.35} seg={30} />}
    {fit > 0.98 && fit < 1 && <Puff p={[0, 2.13, -0.4]} s={0.3} c="#ffffff" o={0.5} />}
    {Array.from({ length: 34 }, (_, i) => { const f = (tt * 1.8 + i / 34) % 1; return on > 0 ? <Sp key={"w" + i} rad={0.03} sc={[1.3, 1, 1]} p={[end[0] + 0.05 + f * 0.45 + (rnd(i) - 0.5) * 0.04, end[1] - f * f * 0.3, end[2] + f * 0.12 + (rnd(i, 2) - 0.5) * 0.05]} c="#a8d8ff" o={0.85 * on} ro={0.05} m={0.2} ns /> : null; })}
    {pool > 0 && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.05, 0.006, -0.2]}><circleGeometry args={[0.38 * pool, 40]} /><meshStandardMaterial color="#8fb8d6" roughness={0.05} metalness={0.6} transparent opacity={0.8} /></mesh>}
  </S3>;
}}</Stage>;

// 8 · el galón de leche: un galón de verdad (asa, tapa roja) debajo de la unidad en deshielo; las gotas de las aletas lo van llenando hasta el cuello
export const MMilkjug: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lv1 = win(u, 0.06, 0.92), wob = Math.sin(tt * 6) * 0.004;
  return <S3 p={lv([1.0, 0.45, 1.6], [0.8, 0.4, 1.3], win(u, 0, 1))} l={[0.2, 0.3, 0.25]} fov={40} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-1.2} />
    <HPU s={1.4} frost={1 - lv1 * 0.8} p={[-0.6, 0, -0.75]} />
    {Array.from({ length: 12 }, (_, i) => { const f = (tt * 1.5 + i / 12) % 1; return <Sp key={i} rad={0.012} sc={[1, 1.5, 1]} p={[0.25 + (rnd(i) - 0.5) * 0.06, 0.62 - f * 0.28, 0.3 + (rnd(i, 2) - 0.5) * 0.04]} c="#d6eeff" o={0.85} ro={0.05} m={0.2} ns />; })}
    <group position={[0.25, 0, 0.3]} scale={1.6}>
      <Bx s={[0.15, 0.2, 0.15]} p={[0, 0.1, 0]} c="#f4f4ee" o={0.38} ro={0.25} rad={0.035} />
      <Cy rt={0.035} rb={0.07} h={0.06} p={[0, 0.23, 0]} c="#f4f4ee" o={0.38} ro={0.25} />
      <Cy rt={0.022} h={0.03} p={[0, 0.27, 0]} c="#f4f4ee" o={0.5} ro={0.25} />
      <Cy rt={0.025} h={0.02} p={[0, 0.293, 0]} c="#d0302a" ro={0.4} />
      <To R={0.04} t={0.012} p={[0.07, 0.17, 0]} r={[0, Math.PI / 2, 0]} arc={Math.PI} c="#f4f4ee" o={0.5} ro={0.25} />
      <Bx s={[0.14, Math.max(0.002, 0.19 * lv1), 0.14]} p={[0, 0.006 + 0.095 * lv1, 0]} c="#6fb4e6" o={0.85} ro={0.04} m={0.2} rad={0.03} ns />
      <Cy rt={0.066} h={0.002} p={[0, 0.006 + 0.19 * lv1 + wob, 0]} c="#bfe2fb" o={0.7} ro={0.02} m={0.4} />
    </group>
  </S3>;
}}</Stage>;

// 9 · el pozo de barro: corte del suelo con tierra colorada de foto; la losa se hunde tres pulgadas contra una regla clavada, el pozo se llena y se congela bajo las aletas
const yardTex = () => canvasTex("yard11", 128, 512, (g) => { g.fillStyle = "#f2d14a"; g.fillRect(0, 0, 128, 512); g.fillStyle = "#1a1a1a"; for (let i = 0; i <= 8; i++) { const y = 20 + i * 59; g.fillRect(0, y, i % 2 ? 50 : 90, 6); if (i % 2 === 0) { g.font = BOLD(44); g.fillText(String(i / 2), 92, y + 16); } } });
export const MSinkpad: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), s = win(u, 0.06, 0.48), wt = win(u, 0.36, 0.72), fr = win(u, 0.7, 0.95), dz = 0.2 * s;
  return <S3 p={lv([0.55, 0.85, 2.3], [0.35, 0.6, 1.8], win(u, 0, 1))} l={[0, 0.2, 0]} fov={40} floor={null}>
    <PhotoPl w={3.2} h={1.0} p={[0, -0.5, 0.601]} name="t_tierra.jpg" rep={[2, 1]} ro={0.95} />
    <Bx s={[3.2, 1.0, 1.2]} p={[0, -0.5, 0]} c="#7a3a22" ro={0.95} ns />
    <group position={[0, 0.001, 0]}><PhotoGround w={3.2} d={1.2} /></group>
    <Cy rt={0.78} rb={0.58} h={0.2 * s + 0.001} p={[0, -0.1 * s, 0]} c="#3b2716" ro={0.98} />
    {wt > 0 && <Cy rt={0.76} rb={0.62} h={0.1 * wt} p={[0, -0.2 * s + 0.05 * wt, 0]} c={mixc("#4f7a93", "#e6f4fd", fr)} o={0.78} ro={0.04 + 0.35 * fr} m={0.35 - 0.3 * fr} />}
    <PhotoPl w={1.0} h={1.0} name="t_concreto.jpg" p={[0, 0.081 - dz, 0]} r={[-Math.PI / 2, 0, 0]} ro={0.9} />
    <Bx s={[1.0, 0.08, 1.0]} p={[0, 0.04 - dz, 0]} c="#9a958c" ro={0.9} />
    <HPU s={1.4} p={[0, 0.08 - dz, 0]} ice={fr * 0.22} frost={fr} />
    <group position={[0.72, 0, 0.5]}><Bx s={[0.07, 0.6, 0.012]} p={[0, -0.05, 0]} c="#f2d14a" ro={0.6} /><Pl w={0.07} h={0.6} p={[0, -0.05, 0.007]} map={yardTex()} c="#ffffff" ro={0.6} ns />
      <Bx s={[0.16, 0.012, 0.03]} p={[-0.08, 0.08 - dz, 0.0]} c="#c3352a" e="#c3352a" ei={0.4} /></group>
  </S3>;
}}</Stage>;

// 10 · el nivel de burbuja: la unidad está torcida 8°, tacos de goma negros se deslizan bajo las esquinas, baja con un rebote y la burbuja del nivel grande se clava entre las dos marcas
export const MSpiritlevel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lift = win(u, 0.1, 0.26) * (1 - win(u, 0.5, 0.64)), rs = win(u, 0.26, 0.48), lev = win(u, 0.5, 0.78);
  const tilt = lerp(-8, 0, lev) * D2R + bump(u, 0.64, 30, 10) * 0.01, bub = lerp(-1, 0, lev) + bump(u, 0.78, 28, 8) * 0.25;
  return <S3 zk={1.32} p={lv([0.172, 1.433, 1.997], [0.115, 1.375, 1.767], win(u, 0, 1))} l={[0, 0.8, 0.1]} fov={36} floor={null}>
    <FrostGround /><BrickWall w={6} h={3} z={-0.9} />
    {[-1, 1].map((x) => [-1, 1].map((z) => <group key={`${x}${z}`} position={[x * 0.4 + x * (1 - rs) * 0.7, 0, z * 0.38]}>
      <Bx s={[0.24, 0.1, 0.24]} p={[0, 0.05, 0]} c="#1d1d1f" ro={0.75} rad={0.015} />{[-0.04, 0, 0.04].map((q) => <Bx key={q} s={[0.172, 0.006, 0.01]} p={[0, 0.1, q]} c="#2c2c2f" ns />)}</group>))}
    <group position={[0.42, 0.1 * rs + lift * 0.18, 0]} rotation={[0, 0, tilt]}>
      <group position={[-0.42, 0, 0]}>
        <HPU s={1.4} />
        <group position={[0, 0.93, 0.12]} scale={2.6}>
          <Bx s={[0.62, 0.06, 0.06]} c="#f2c230" ro={0.4} rad={0.012} />
          <Bx s={[0.18, 0.036, 0.036]} p={[0, 0.0, 0.03]} c="#c9f2a8" o={0.75} ro={0.05} />
          {[-0.03, 0.03].map((x) => <Bx key={x} s={[0.004, 0.04, 0.002]} p={[x, 0, 0.05]} c="#111" ns />)}
          <Sp rad={0.016} p={[cl(Math.abs(bub)) * Math.sign(bub) * 0.075, 0.004, 0.047]} sc={[1.8, 1, 1]} c="#ffffff" o={0.95} ro={0.02} ns />
        </group>
      </group>
    </group>
  </S3>;
}}</Stage>;

// 11 · las cintas en la rejilla: dos rejillas de chapa grandes, frente a frente; cintas de tela anchas: las de la bomba flamean suaves, las del gas salen tiesas; un termómetro de vidrio en cada una sube a 95 y a 130
const Register: React.FC<{ x: number }> = ({ x }) => <group position={[x, 1.2, 0]}>
  <Bx s={[0.62, 0.38, 0.03]} c="#efeee9" m={0.3} ro={0.4} rad={0.01} />
  {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.54, 0.02, 0.04]} p={[0, -0.15 + i * 0.043, 0.02]} r={[-0.5, 0, 0]} c="#d9d7cf" m={0.3} ro={0.45} />)}
</group>;
const Thermo: React.FC<{ x: number; k: number; hot: boolean }> = ({ x, k, hot }) => <group position={[x, 1.62, 0.04]}>
  <Bx s={[0.07, 0.36, 0.015]} c="#f8f6f0" ro={0.4} rad={0.01} />
  <Cy rt={0.011} h={0.3} p={[0, 0.0, 0.012]} c="#e8f2f8" o={0.6} ro={0.05} />
  <Cy rt={0.007} h={0.3 * k} p={[0, -0.15 + 0.15 * k, 0.012]} c={hot ? "#d62a1a" : "#e88a2a"} e={hot ? "#d62a1a" : "#e88a2a"} ei={0.4} ro={0.2} />
  <Sp rad={0.02} p={[0, -0.17, 0.012]} c={hot ? "#d62a1a" : "#e88a2a"} ro={0.2} />
  <Txt t={hot ? "130°" : "95°"} w={hot ? 0.2 : 0.15} c="#1a1a1a" p={[0, 0.24, 0.01]} />
</group>;
export const MRibbons: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.06, 0.32), th = win(u, 0.2, 0.75);
  const Rib: React.FC<{ x: number; s: number; c: string }> = ({ x, s, c }) => <>{[0, 1, 2, 3, 4].map((i) => {
    const pts: V3[] = Array.from({ length: 9 }, (_, j) => { const d = (j / 8) * 0.55 * on, fl = Math.sin(tt * (4 + s * 9) + j * 0.9 + i) * 0.03 * j * (1.3 - s);
      return [x - 0.2 + i * 0.1 + fl * 0.5, 1.2 - 0.17 + d * s * 1.1 - d * (1 - s) * 0.9, 0.05 + d * (0.25 + s * 0.6) + fl]; });
    return <Tube key={i} pts={pts} rad={0.014} c={c} ro={0.75} seg={32} />; })}</>;
  return <S3 p={lv([0.1, 1.32, 1.3], [0.05, 1.3, 1.05], win(u, 0, 1))} l={[0, 1.3, 0]} fov={38} floor={null}>
    <Wall w={4} hh={3.2} z={-0.03} c="#f1e8d8" />
    <Register x={-0.48} /><Register x={0.48} />
    <Rib x={-0.48} s={0.4} c="#f0a040" />
    <Rib x={0.48} s={1} c="#d63a2a" />
    <Thermo x={-0.85} k={0.15 + 0.45 * th} hot={false} /><Thermo x={0.85} k={0.15 + 0.8 * th} hot />
  </S3>;
}}</Stage>;

// 12 · el marcador: un marcador negro grueso escribe solo, trazo a trazo, la medida del filtro en la chapa del gabinete y se aparta; la tinta brilla húmeda
const markTex = (k: number) => canvasTex(`mark11b|${Math.round(k * 50)}`, 1024, 300, (g) => {
  g.clearRect(0, 0, 1024, 300); g.save(); g.beginPath(); g.rect(0, 0, 50 + k * 920, 300); g.clip();
  g.fillStyle = "#0d0d0d"; g.strokeStyle = "#0d0d0d"; g.lineWidth = 8; g.font = HANDF(190); g.strokeText("16x25x1", 50, 215); g.fillText("16x25x1", 50, 215); g.restore();
});
export const MMarkerwrite: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.02, 0.75), away = win(u, 0.8, 0.95), mx = lerp(-0.5, 0.5, k) + away * 0.35;
  return <S3 p={lv([0.2, 1.2, 1.55], [0.06, 1.14, 1.2], win(u, 0, 1))} l={[0, 1.12, 0]} fov={36} floor={null}>
    <Bx s={[1.5, 2.2, 0.6]} p={[0, 0.8, -0.31]} c="#9ea3a8" m={0.4} ro={0.45} rad={0.02} />
    <PhotoPl w={1.48} h={2.18} p={[0, 0.8, 0.0]} name="t_chapa.jpg" ro={0.45} m={0.3} />
    <Bx s={[1.5, 0.02, 0.01]} p={[0, 1.6, 0.006]} c="#80858a" />
    <Pl w={1.15} h={0.34} p={[0, 1.1, 0.007]} map={markTex(k)} c="#ffffff" o={0.99} ro={0.15} m={0.2} ns />
    {away < 1 && <group position={[mx + 0.12, 1.2 + 0.05 * Math.sin(k * 70) + away * 0.25, 0.2 + away * 0.15]} rotation={[0.5, 0, -0.55]} scale={2.3}>
      <Cy rt={0.022} h={0.2} c="#111" ro={0.35} /><Cy rt={0.022} rb={0.01} h={0.035} p={[0, -0.115, 0]} c="#1b1b1b" ro={0.4} /><Cy rt={0.006} rb={0.002} h={0.025} p={[0, -0.14, 0]} c="#0a0a0a" />
      <Cy rt={0.024} h={0.03} p={[0, 0.07, 0]} c="#dcdcdc" ro={0.4} /><Cy rt={0.023} h={0.012} p={[0, 0.1, 0]} c="#111" /></group>}
  </S3>;
}}</Stage>;

// 13 · las mangas de viento: un ventilador de caja sopla contra dos filtros; detrás del fino la manga se infla de golpe y flamea, detrás del grueso de alergias cuelga muerta
export const MWindsock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = win(u, 0.12, 0.32), D = h.out - h.at, fan = 18 * D * cum((x) => win(x, 0.02, 0.15), u);
  const Sock: React.FC<{ x: number; f: number }> = ({ x, f }) => <group position={[x, 0.9, 0.12]} scale={1.5}>
    <To R={0.12} t={0.01} r={[0, 0, 0]} c="#bbbbbb" m={0.7} ro={0.3} />
    {Array.from({ length: 7 }, (_, i) => { const d = i * 0.1, droop = (1 - f) * d * d * 4.2, sw = Math.sin(tt * 8 + i) * 0.025 * f * (i / 6);
      return <Cy key={i} rt={0.12 - i * 0.011 * (1 - f * 0.35)} rb={0.12 - (i + 1) * 0.011 * (1 - f * 0.35)} h={0.1} p={[sw, -droop, d + 0.05]} r={[Math.PI / 2 - (1 - f) * d * 3.2, 0, 0]} c={i % 2 ? "#ffffff" : "#e2582a"} ro={0.75} open />; })}
  </group>;
  return <S3 p={lv([2.3, 1.45, 2.0], [2.1, 1.35, 1.8], win(u, 0, 1))} l={[0, 0.8, 0.45]} fov={40} floor="conc">
    <group position={[0, 0.9, -0.55]}><Bx s={[1.9, 0.75, 0.25]} c="#e9e7e1" ro={0.5} rad={0.03} />
      {[-0.5, 0.5].map((x) => <group key={x} position={[x, 0, 0.13]} rotation={[0, 0, fan + x]}>{[0, 1, 2].map((b) => <Bx key={b} s={[0.07, 0.3, 0.01]} p={[Math.sin(b * 2.09) * 0.13, Math.cos(b * 2.09) * 0.13, 0]} r={[0, 0.4, -b * 2.09]} c="#7a7f86" ro={0.4} />)}</group>)}</group>
    {[-0.5, 0.5].map((x, i) => <group key={x}>
      <Bx s={[0.6, 0.6, i ? 0.16 : 0.035]} p={[x, 0.9, -0.15]} c={i ? "#f1efe6" : "#f6f2e6"} ro={0.9} rad={0.01} />
      {Array.from({ length: i ? 18 : 10 }, (_, j) => <Bx key={j} s={[0.008, 0.56, (i ? 0.16 : 0.035) + 0.004]} p={[x - 0.27 + j * (0.54 / (i ? 17 : 9)), 0.9, -0.15]} c="#cfc9b8" ns />)}
      <Bx s={[0.64, 0.05, (i ? 0.2 : 0.06)]} p={[x, 0.58, -0.15]} c="#9c7a4a" ro={0.8} />
      <Sock x={x} f={on * (i ? 0.08 : 1) + (i ? 0 : bump(u, 0.12, 30, 10) * 0.1)} />
      {!i && Array.from({ length: 10 }, (_, j) => { const f = (tt * 1.1 + j / 10) % 1; return <Bx key={j} s={[0.03, 0.004, 0.004]} p={[x + (rnd(j) - 0.5) * 0.3, 0.9 + (rnd(j, 2) - 0.5) * 0.25, -0.1 + f * 1.1]} c="#e2582a" o={0.8 * on * Math.sin(f * Math.PI)} ns />; })}
    </group>)}
  </S3>;
}}</Stage>;

// 14 · el cambio de vías: la palanca roja baja con un clac y el carrito de madera pasa de la vía de la bomba (ventilador girando) a la de las resistencias, que se ponen al rojo y alumbran el carrito
export const MTrackswitch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = win(u, 0.16, 0.28), mv = win(u, 0.28, 0.9), glow = win(u, 0.55, 0.85);
  const sm2 = (x: number) => { const c = cl(x); return c * c * (3 - 2 * c); };
  const path = (k: number): V3 => { const z = lerp(1.1, -1.25, k), x = z < 0.1 ? lerp(0, sw > 0.5 ? 0.9 : -0.9, sm2((0.1 - z) / 1.35)) : 0; return [x, 0.1, z]; };
  const Rail: React.FC<{ to: number }> = ({ to }) => <>{[-0.12, 0.12].map((o) => <Tube key={o} pts={Array.from({ length: 11 }, (_, i) => { const z = lerp(1.6, -1.5, i / 10), x = z < 0.1 ? lerp(0, to, sm2((0.1 - z) / 1.35)) : 0; return [x + o, 0.035, z] as V3; })} rad={0.016} c="#9aa0a6" m={0.85} ro={0.25} seg={48} />)}</>;
  const [x, y, z] = path(mv);
  return <S3 p={lv([0.212, 1.192, 1.837], [0.102, 1.065, 1.54], win(u, 0, 1))} l={[0, 0.3, -0.5]} fov={42} floor={null}>
    <PhotoGround w={5} d={4.4} name="t_concreto.jpg" rep={1.2} />
    <Rail to={-0.9} /><Rail to={0.9} />
    {Array.from({ length: 16 }, (_, i) => <Bx key={i} s={[0.44, 0.025, 0.07]} p={[0, 0.012, 1.5 - i * 0.11]} c="#6a4e34" ro={0.9} />)}
    <group position={[-0.9, 0, -1.5]}><HPU s={0.8} fan={tt * 9 * (1 - sw)} /></group>
    <group position={[0.9, 0, -1.5]}>
      <Bx s={[0.5, 0.06, 0.3]} p={[0, 0.03, 0]} c="#2a2a2a" ro={0.6} />
      {[0, 1, 2].map((i) => <To key={i} R={0.15} t={0.02} p={[0, 0.22 + i * 0.12, 0]} r={[Math.PI / 2, 0, 0]} c={mixc("#6a6a6a", "#ff4a1a", glow)} e={glow > 0.05 ? "#ff3a10" : undefined} ei={glow * 2.6} ro={0.4} />)}
      {glow > 0.05 && <pointLight position={[0, 0.4, 0.4]} intensity={3 * glow} distance={2.6} color="#ff5a20" />}
      <Txt t="EM HEAT" w={0.62} c="#ffffff" bg="#a8261a" p={[0, 0.72, 0]} />
    </group>
    <Txt t="HEAT PUMP" w={0.66} c="#ffffff" bg="#24427a" p={[-0.9, 0.85, -1.5]} />
    <group position={[0.5, 0, 0.45]}><Bx s={[0.16, 0.08, 0.16]} p={[0, 0.04, 0]} c="#333" ro={0.5} /><group position={[0, 0.08, 0]} rotation={[0, 0, lerp(0.6, -0.6, sw)]}><Cy rt={0.016} h={0.4} p={[0, 0.2, 0]} c="#c3352a" ro={0.35} /><Sp rad={0.04} p={[0, 0.41, 0]} c="#d8402f" ro={0.3} /></group></group>
    <group position={[x, y, z]} scale={1.6}>
      <Bx s={[0.26, 0.11, 0.18]} p={[0, 0.02, 0]} c="#b5834e" ro={0.7} rad={0.015} /><Bx s={[0.27, 0.02, 0.19]} p={[0, 0.08, 0]} c="#8a5c34" ro={0.8} />
      {[-1, 1].map((a) => [-1, 1].map((b) => <Cy key={`${a}${b}`} rt={0.035} h={0.025} p={[a * 0.09, -0.04, b * 0.1]} r={[Math.PI / 2, 0, 0]} c="#2a2a2a" m={0.5} />))}
    </group>
  </S3>;
}}</Stage>;

// 15 · el tendedero: dos cuentas de luz colgadas con broches; la de $612 lleva atada una bolsa de arena de arpillera y tira la soga hasta el pasto, la de $270 apenas la dobla
const bill = (amt: string, lab: string, c: string) => canvasTex(`bill11b|${amt}`, 512, 360, (g) => {
  g.fillStyle = "#fbfbf7"; g.fillRect(0, 0, 512, 360); g.fillStyle = "#24427a"; g.fillRect(0, 0, 512, 78); g.fillStyle = "#fff"; g.font = BOLD(46); g.fillText("POWER BILL", 22, 56);
  g.fillStyle = "#444"; g.font = BOLD(38); g.fillText(lab, 24, 140); g.fillStyle = c; g.font = BOLD(150); g.fillText(amt, 18, 310);
});
const sackTex = () => canvasTex("sack11", 256, 256, (g) => { g.fillStyle = "#b39a6a"; g.fillRect(0, 0, 256, 256); g.strokeStyle = "rgba(80,60,30,.45)"; g.lineWidth = 2; for (let i = 0; i < 256; i += 6) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); } g.fillStyle = "#5a4020"; g.font = BOLD(60); g.textAlign = "center"; g.fillText("SAND", 128, 150); });
export const MClothesline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), a = drop(u, 0.08, 0.28), b = drop(u, 0.42, 0.6), sagA = 0.9 * win(u, 0.2, 0.42) + bump(u, 0.32, 18, 6) * 0.08, sagB = 0.1 * win(u, 0.52, 0.7);
  const y0 = 1.75, xa = -0.65, xb = 0.75, yA = y0 - sagA, yB = y0 - sagB - sagA * 0.3;
  const line: V3[] = [[-1.7, y0, 0], [xa, yA, 0], [xb, yB, 0], [1.7, y0, 0]];
  const Pin: React.FC<{ x: number }> = ({ x }) => <Bx s={[0.03, 0.1, 0.035]} p={[x, -0.02, 0.02]} c="#c9a06a" ro={0.7} rad={0.008} />;
  return <S3 p={lv([0.25, 1.35, 3.0], [0.12, 1.25, 2.45], win(u, 0, 1))} l={[0, 1.1, 0]} fov={42} floor={null}>
    <FrostGround w={8} d={6} /><BrickWall w={8} h={3} z={-1.6} />
    {[-1.7, 1.7].map((x) => <group key={x}><Bx s={[0.08, 1.9, 0.08]} p={[x, 0.95, 0]} c="#6b5a44" ro={0.9} /><Bx s={[0.5, 0.06, 0.06]} p={[x, 1.8, 0]} c="#6b5a44" ro={0.9} /></group>)}
    <Tube pts={line} rad={0.01} c="#ece6d6" ro={0.8} seg={60} />
    {a > 0 && <group position={[xa, lerp(y0 + 1.2, yA, a), 0]}><Pin x={-0.16} /><Pin x={0.16} />
      <Pl w={0.62} h={0.44} p={[0, -0.25, 0.01]} map={bill("$612", "THIS DECEMBER", "#c3352a")} c="#ffffff" ro={0.7} />
      <Tube pts={[[0, -0.47, 0.0], [0, -0.58, 0.02]]} rad={0.006} c="#5a4020" seg={4} />
      <Bx s={[0.34, 0.32, 0.22]} p={[0, -0.76, 0.02]} map={sackTex()} c="#ffffff" ro={0.95} rad={0.08} /></group>}
    {b > 0 && <group position={[xb, lerp(y0 + 1.2, yB, b), 0]} rotation={[0, 0, Math.sin(tt * 2.2) * 0.05]}><Pin x={-0.14} /><Pin x={0.14} />
      <Pl w={0.56} h={0.4} p={[0, -0.22, 0.01]} map={bill("$270", "LAST DECEMBER", "#2f7d4a")} c="#ffffff" ro={0.7} /></group>}
  </S3>;
}}</Stage>;

// 16 · los dos tanques: dos medidores de combustible de auto con bisel cromado y vidrio; la aguja de las resistencias se desploma tres veces más rápido, rebota en E y prende la luz de reserva
const gaugeFace = (lab: string) => canvasTex(`gau11b|${lab}`, 512, 512, (g) => {
  g.clearRect(0, 0, 512, 512); g.fillStyle = "#121417"; g.beginPath(); g.arc(256, 256, 256, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#e9e9e9"; g.lineWidth = 8;
  for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.15 - i * 0.1625); g.beginPath(); g.moveTo(256 + Math.cos(a) * 215, 256 - Math.sin(a) * 215); g.lineTo(256 + Math.cos(a) * (i % 4 ? 185 : 160), 256 - Math.sin(a) * (i % 4 ? 185 : 160)); g.stroke(); }
  g.fillStyle = "#ff5a4a"; g.font = BOLD(72); g.fillText("E", 52, 350); g.fillStyle = "#e9e9e9"; g.fillText("F", 410, 350);
  g.font = BOLD(54); g.textAlign = "center"; g.fillText(lab, 256, 445);
});
export const MFuelgauge: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), r = win(u, 0.1, 0.8), a1 = 1 - r * 0.28, a2 = Math.max(0, 1 - r * 1.0) + (r >= 1 ? bump(u, 0.8, 30, 9) * 0.04 : 0), warn = win(u, 0.78, 0.84);
  const G: React.FC<{ x: number; f: number; lab: string; w: number }> = ({ x, f, lab, w }) => <group position={[x, 1.0, 0]}>
    <Cy rt={0.4} h={0.08} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.6} ro={0.3} seg={64} />
    <To R={0.39} t={0.035} p={[0, 0, 0.04]} c="#d9dde2" m={1} ro={0.12} />
    <mesh position={[0, 0, 0.041]}><circleGeometry args={[0.36, 64]} /><meshStandardMaterial map={gaugeFace(lab)} roughness={0.5} /></mesh>
    <group position={[0, 0, 0.05]} rotation={[0, 0, Math.PI * (1.15 - f * 1.3) - Math.PI / 2]}><Bx s={[0.016, 0.29, 0.008]} p={[0, 0.13, 0]} c="#ff7a2a" e="#ff7a2a" ei={0.7} /></group>
    <Sp rad={0.035} p={[0, 0, 0.06]} c="#888" m={0.8} ro={0.25} />
    <mesh position={[0, 0, 0.075]}><circleGeometry args={[0.37, 64]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.07} roughness={0.02} metalness={0.9} /></mesh>
    {w > 0 && <><Sp rad={0.05} p={[0, -0.24, 0.06]} c="#ff3a2a" e="#ff3a2a" ei={2.2 * w} /><pointLight position={[0, -0.2, 0.3]} intensity={1.8 * w} distance={1.4} color="#ff3a2a" /></>}
  </group>;
  return <S3 p={lv([0, 1.05, 1.95], [0, 1.02, 1.5], win(u, 0, 1))} l={[0, 1.0, 0]} fov={36} floor={null} warm="#ffe0c0">
    <Bx s={[2.3, 1.1, 0.22]} p={[0, 1.0, -0.13]} c="#1a1b1e" ro={0.45} rad={0.08} />
    <G x={-0.52} f={a1} lab="HEAT PUMP" w={0} />
    <G x={0.52} f={a2} lab="EM STRIPS" w={warn} />
  </S3>;
}}</Stage>;

// 17 · las tres cosas del deshielo, en la misma unidad: 1) el ventilador frena y queda escarchado, 2) una nube de vapor grande sube de las aletas,
// 3) en la pared el termostato prende AUX en verde; cada cosa llega en su tiempo y la anterior se queda
export const MFilmstrip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, a = win(u, 0.06, 0.26), b = win(u, 0.32, 0.5), c = win(u, 0.58, 0.7);
  const fan = 16 * D * cum((x) => 1 - win(x, 0.06, 0.26), u);
  return <S3 p={[0.9, 1.25, 2.6]} l={[0.35, 0.85, 0]} fov={40} floor={null}>
    <FrostGround /><BrickWall w={10} z={-0.75} />
    <HPU s={1.4} fan={fan} frost={0.25 + 0.75 * a - 0.6 * b} />
    {b > 0 && Array.from({ length: 16 }, (_, j) => { const f = (tt * 0.35 + j / 16) % 1; return <Puff key={j} p={[(rnd(j) - 0.5) * 0.7, 0.75 + f * 1.4, (rnd(j, 2) - 0.3) * 0.6]} s={0.45 + f * 0.9} c="#f4f8fb" o={0.7 * b * Math.sin(f * Math.PI)} add={false} />; })}
    <group position={[1.0, 1.15, -0.66]} scale={1.8}>
      <Bx s={[0.42, 0.3, 0.05]} c="#efe9da" ro={0.5} rad={0.03} />
      <Bx s={[0.32, 0.15, 0.01]} p={[0, 0.03, 0.03]} c={mixc("#1a1f1a", "#0d2a17", c)} />
      <Txt t="AUX" w={0.26} c="#5dff8a" e={2.2 * c} o={0.15 + 0.85 * c} p={[0, 0.03, 0.037]} />
      {c > 0.05 && <pointLight position={[0, 0.05, 0.3]} intensity={1.5 * c} distance={1.2} color="#5dff8a" />}
    </group>
  </S3>;
}}</Stage>;
