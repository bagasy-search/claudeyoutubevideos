// mar11c · componentes únicos 1-13 (la revisión de invierno que hace durar 30 años la bomba de calor), 3D en el kit r3k.
// Lección de mar11a/b (EVALUADOR): UN objeto grande al centro con margen, cámara de frente, la acción a mitad de camino en el
// cuadro del medio, números impresos EN el objeto y grandes, foto real en las superficies. Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import * as THREE from "three";
import { BOLD, Bx, Cy, Env, HANDF, Pl, Puff, S3 as S3k, Sp, To, Tube, V3, canvasTex, cl, drop, env, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { FrostGround, HPU, U, bump, mixc } from "./props11";
import { PhotoGround, PhotoPl, PhotoWall } from "./tex11";

export const S3: React.FC<React.ComponentProps<typeof S3k> & { k?: number }> = ({ k = 1, p, l, ...r }) =>
  <S3k p={[l[0] + (p[0] - l[0]) * k, l[1] + (p[1] - l[1]) * k, l[2] + (p[2] - l[2]) * k]} l={l} {...r} />;
export const Wall: React.FC<{ w?: number; hh?: number; z?: number; c?: string; name?: string }> = ({ w = 6, hh = 3.2, z = -0.6, c = "#ffffff", name = "t_pared.jpg" }) =>
  <PhotoWall w={w} h={hh} z={z} y={hh / 2 - 0.3} name={name} tint={c} />;
export const Table: React.FC<{ w?: number; d?: number }> = ({ w = 4, d = 2.6 }) => <PhotoGround w={w} d={d} name="t_madera.jpg" rep={1.4} />;
env(Wall); env(Table);
export const plate = (t: string, bg: string, fg: string, px = 150, w = 512, hh = 256, font = BOLD) => canvasTex(`pl11c|${t}|${bg}|${fg}|${px}|${w}|${hh}`, w, hh, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = font(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, w / 2, hh / 2 + px * 0.04);
});
// hormiga: tres segmentos y seis patas que caminan con la fase
export const Ant: React.FC<{ p: V3; a: number; ph: number; s?: number }> = ({ p, a, ph, s = 1 }) => <group position={p} rotation={[0, a, 0]} scale={s}>
  <Sp rad={0.012} p={[0, 0.012, -0.022]} sc={[1, 0.8, 1.3]} c="#140e0a" ro={0.3} ns />
  <Sp rad={0.008} p={[0, 0.012, 0]} c="#1c130d" ro={0.3} ns />
  <Sp rad={0.009} p={[0, 0.013, 0.017]} c="#140e0a" ro={0.3} ns />
  {[-1, 1].map((sd) => [-0.01, 0, 0.01].map((z, j) => <Bx key={`${sd}${j}`} s={[0.022, 0.002, 0.002]} p={[sd * 0.01, 0.006, z + Math.sin(ph * 12 + j * 2 + sd) * 0.004]} r={[0, sd * (0.3 - j * 0.3), sd * -0.5]} c="#140e0a" ns />))}
</group>;

// 1 · las dos casas gemelas: en la misma calle se levantan a la vez dos casas iguales, cada una con su bomba de calor
const House: React.FC<{ k: number; r: number; lit: number }> = ({ k, r, lit }) => <group>
  <group scale={[1, Math.max(0.001, k), 1]}>
    <Bx s={[1.0, 0.7, 0.8]} p={[0, 0.35, 0]} c="#a85a3a" ro={0.8} rad={0.004} />
    <PhotoPl w={1.0} h={0.7} name="t_ladrillo.jpg" p={[0, 0.35, 0.402]} rep={[2, 1.4]} />
    <Bx s={[0.2, 0.36, 0.02]} p={[0, 0.18, 0.412]} c="#5a3420" ro={0.6} />
    {[-0.3, 0.3].map((x) => <group key={x}><Bx s={[0.22, 0.2, 0.02]} p={[x, 0.42, 0.41]} c="#f2ece0" ro={0.5} /><Pl w={0.18} h={0.16} p={[x, 0.42, 0.422]} c={mixc("#30404e", "#ffd88a", lit)} e={mixc("#30404e", "#ffcf7a", lit)} ei={0.4 + 1.4 * lit} ns /></group>)}
  </group>
  <group position={[0, 0.7 + (1 - r) * 1.6, 0]}>
    <mesh position={[0, 0, -0.44]} castShadow><extrudeGeometry args={[(() => { const s = new THREE.Shape(); s.moveTo(-0.6, 0); s.lineTo(0.6, 0); s.lineTo(0, 0.42); s.closePath(); return s; })(), { depth: 0.88, bevelEnabled: false }]} /><meshStandardMaterial color="#3a2c26" roughness={0.8} /></mesh>
  </group>
</group>;
export const MMirrorhouses: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = win(u, 0.06, 0.42), r = drop(u, 0.44, 0.58), lit = win(u, 0.62, 0.74), un = win(u, 0.7, 0.86), b = bump(u, 0.58, 30, 9);
  return <S3 p={lv([0, 1.15, 3.6], [0, 1.0, 3.2], u)} l={[0, 0.55, 0]} fov={38} floor={null}>
    <PhotoGround w={9} d={5} name="t_pasto.jpg" rep={1} tint="#b8c0a8" />
    <Env><Bx s={[8, 0.01, 0.7]} p={[0, 0.005, 1.0]} c="#6e6a64" ro={0.9} /></Env>
    {[-0.78, 0.78].map((x) => <group key={x} position={[x, b * 0.01, 0]}>
      <House k={k} r={r} lit={lit} />
      <HPU p={[0.66, 0, 0.1]} s={0.32 * un + 0.001} fan={tt * 10} />
    </group>)}
  </S3>;
}}</Stage>;

// 2 · el marco de la puerta: como las marcas de altura de los chicos, un lápiz anota en el marco la edad de cada unidad que sacó: 12, 13, 25, 30
const jambTex = (n: number, pr: number) => canvasTex(`jamb11c|${n}|${Math.round(pr * 20)}`, 320, 1024, (g) => {
  g.fillStyle = "#f3eee4"; g.fillRect(0, 0, 320, 1024);
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(160,140,110,${0.05 + 0.05 * rnd(i, 3)})`; g.fillRect(0, rnd(i, 1) * 1024, 320, 2); }
  const M = [{ a: 12, y: 820 }, { a: 13, y: 740 }, { a: 25, y: 380 }, { a: 30, y: 200 }];
  g.strokeStyle = "#2a2622"; g.fillStyle = "#2a2622"; g.lineWidth = 9; g.lineCap = "round"; g.font = HANDF(118); g.textBaseline = "middle";
  M.forEach((m, i) => { if (i > n) return; const f = i < n ? 1 : pr; g.beginPath(); g.moveTo(20, m.y); g.lineTo(20 + 130 * cl(f * 2), m.y); g.stroke();
    if (f > 0.5) { g.globalAlpha = cl((f - 0.5) * 2); g.fillText(String(m.a), 165, m.y - 6); g.globalAlpha = 1; } });
});
export const MDoorframe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), seg = cl((u - 0.08) / 0.8) * 4, n = Math.min(3, Math.floor(seg)), pr = seg >= 4 ? 1 : seg - n;
  const Y = [0.62, 0.72, 1.16, 1.38], px = 0.02 + 0.42 * cl(pr * 2), py = Y[n] + 0.02 * Math.sin(tt * 30) * (pr > 0 && pr < 1 ? 1 : 0), cy = lerp(0.8, 1.15, cl(seg / 4));
  return <S3 p={[0.35, cy + 0.05, 1.75]} l={[0.05, cy, 0]} fov={40} floor={null} warm="#ffe2c4">
    <PhotoGround w={5} d={4} name="t_madera.jpg" rep={1.2} tint="#a08070" />
    <Wall w={6} c="#d9ccb6" z={-0.08} />
    <Env><group position={[-0.62, 1.0, 0.04]}><Bx s={[0.9, 2.1, 0.05]} p={[0, 0.0, -0.02]} c="#6a4426" ro={0.55} /><PhotoPl w={0.86} h={2.06} name="t_madera.jpg" p={[0, 0, 0.007]} tint="#9a6a40" /><Sp rad={0.035} p={[0.34, -0.02, 0.04]} c="#c9a14a" m={1} ro={0.2} /></group></Env>
    <group position={[0, 1.0, 0.04]}>
      <Bx s={[0.5, 2.1, 0.06]} c="#f3eee4" ro={0.6} rad={0.006} />
      <Pl w={0.48} h={1.54} p={[0, 0.0, 0.032]} map={jambTex(n, pr)} c="#ffffff" ro={0.7} ns />
    </group>
    <group position={[-0.22 + px, 1.0 + (py - 1.0) * 1.0 - 0.0, 0.12]} rotation={[0, 0, -0.9]}>
      <Cy rt={0.018} h={0.32} seg={6} p={[0, 0.16, 0]} c="#f2c230" ro={0.5} />
      <Cy rt={0.0} rb={0.018} h={0.05} seg={6} p={[0, -0.025, 0]} c="#e0c49a" ro={0.7} />
      <Cy rt={0.019} h={0.04} p={[0, 0.34, 0]} c="#c9ccd0" m={1} ro={0.3} /><Cy rt={0.018} h={0.04} p={[0, 0.38, 0]} c="#e88aa0" ro={0.8} />
    </group>
  </S3>;
}}</Stage>;

// 4 · el tablero de herramientas: seis herramientas caen una por una en su silueta pintada sobre la lona (manguera, linterna, destornillador, peine, cepillo, rociador)
const matTex = () => canvasTex("mat11c", 1024, 640, (g) => {
  g.fillStyle = "#24384a"; g.fillRect(0, 0, 1024, 640); g.strokeStyle = "rgba(255,255,255,.06)"; g.lineWidth = 2; for (let x = 0; x < 1024; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 640); g.stroke(); } for (let y = 0; y < 640; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
  g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 8; g.setLineDash([18, 12]);
  g.beginPath(); g.arc(200, 200, 120, 0, 6.29); g.stroke(); g.beginPath(); g.arc(200, 200, 50, 0, 6.29); g.stroke();
  g.strokeRect(420, 120, 330, 80); g.strokeRect(800, 80, 70, 260); g.strokeRect(120, 420, 320, 70); g.strokeRect(500, 400, 220, 110); g.beginPath(); g.arc(860, 470, 80, 0, 6.29); g.stroke();
});
export const MKnolling: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), k = (i: number) => drop(u, 0.08 + i * 0.12, 0.2 + i * 0.12), z = (i: number) => (1 - k(i)) * 1.1;
  // lona 1.8 × 1.125 → canvas 1024 × 640: x = (px/1024 - .5)·1.8, z = (py/640 - .5)·1.125
  const X = (px: number) => (px / 1024 - 0.5) * 1.8, Z = (py: number) => (py / 640 - 0.5) * 1.125;
  return <S3 zk={1.15} p={[0, 1.9, 0.75]} l={[0, 0, 0.02]} fov={40} floor={null}>
    <Table w={5} d={4} />
    <Pl w={1.8} h={1.125} p={[0, 0.004, 0]} r={[-Math.PI / 2, 0, 0]} map={matTex()} c="#ffffff" ro={0.9} />
    <group position={[X(200), 0.03 + z(0), Z(200)]}>{[0, 1, 2, 3].map((i) => <To key={i} R={0.065 + i * 0.03} t={0.018} r={[Math.PI / 2, 0, 0]} p={[0, i * 0.004, 0]} c="#2f8a3a" ro={0.5} />)}<Cy rt={0.022} h={0.08} r={[0, 0, Math.PI / 2]} p={[0.2, 0.02, 0]} c="#c9a24a" m={1} ro={0.25} /></group>
    <group position={[X(585), 0.035 + z(1), Z(160)]}><Cy rt={0.034} h={0.5} r={[0, 0, Math.PI / 2]} c="#1e1e20" m={0.4} ro={0.4} /><Cy rt={0.05} rb={0.036} h={0.1} r={[0, 0, Math.PI / 2]} p={[0.28, 0, 0]} c="#1e1e20" m={0.4} ro={0.4} /><Cy rt={0.045} h={0.01} r={[0, 0, Math.PI / 2]} p={[0.335, 0, 0]} c="#fff4cc" e="#fff4cc" ei={1.5} /></group>
    <group position={[X(835), 0.025 + z(2), Z(210)]}><Cy rt={0.03} h={0.2} p={[0, 0, 0.1]} r={[Math.PI / 2, 0, 0]} c="#e0302a" ro={0.4} /><Cy rt={0.007} h={0.24} r={[Math.PI / 2, 0, 0]} p={[0, 0, -0.12]} c="#c9ccd0" m={1} ro={0.2} /></group>
    <group position={[X(280), 0.012 + z(3), Z(455)]}><Bx s={[0.52, 0.02, 0.06]} c="#e8b84a" ro={0.5} />{Array.from({ length: 14 }, (_, i) => <Bx key={i} s={[0.006, 0.01, 0.05]} p={[-0.24 + i * 0.037, 0, 0.05]} c="#c9ccd0" m={1} ro={0.25} />)}</group>
    <group position={[X(610), 0.03 + z(4), Z(455)]}><Bx s={[0.36, 0.05, 0.12]} c="#8a5a30" ro={0.6} rad={0.01} />{Array.from({ length: 24 }, (_, i) => <Cy key={i} rt={0.005} h={0.06} p={[-0.16 + (i % 12) * 0.029, -0.045, i < 12 ? -0.03 : 0.03]} c="#1a1a1a" ro={0.9} />)}</group>
    <group position={[X(860), 0.0 + z(5), Z(470)]}><Cy rt={0.09} rb={0.1} h={0.3} p={[0, 0.15, 0]} c="#ffffff" o={0.85} ro={0.2} /><Cy rt={0.03} h={0.08} p={[0, 0.34, 0]} c="#2f6fd9" ro={0.4} /><Bx s={[0.1, 0.03, 0.03]} p={[0.05, 0.38, 0]} c="#2f6fd9" ro={0.4} /></group>
  </S3>;
}}</Stage>;

// 5 · la torta de 29: sobre la torta de cumpleaños de la unidad se prenden en ola 29 velitas, una detrás de la otra
export const MBirthdaycake: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 29;
  const P = Array.from({ length: N }, (_, i) => { const ring = i < 18 ? 0 : 1, j = ring ? i - 18 : i, n = ring ? 11 : 18, R = ring ? 0.2 : 0.36, a = (j / n) * Math.PI * 2 + (ring ? 0.3 : 0); return { x: Math.cos(a) * R, z: Math.sin(a) * R, i }; });
  return <S3 p={lv([0, 1.25, 1.65], [0, 1.1, 1.35], u)} l={[0, 0.38, 0]} fov={40} floor={null} warm="#ffd8b0" exp={0.9}>
    <Table w={5} d={3} /><Wall w={7} c="#b8a890" z={-1.0} />
    <group><Cy rt={0.56} h={0.03} p={[0, 0.015, 0]} c="#e8e4da" m={0.3} ro={0.3} seg={64} />
      <Cy rt={0.46} h={0.28} p={[0, 0.17, 0]} c="#f3e6d0" ro={0.7} seg={64} />
      <To R={0.46} t={0.03} r={[Math.PI / 2, 0, 0]} p={[0, 0.31, 0]} c="#f7c8d8" ro={0.6} />
      <To R={0.46} t={0.03} r={[Math.PI / 2, 0, 0]} p={[0, 0.04, 0]} c="#f7c8d8" ro={0.6} /></group>
    {P.map(({ x, z, i }) => { const on = win(u, 0.1 + i * 0.022, 0.13 + i * 0.022), fl = 1 + 0.15 * Math.sin(tt * 19 + i);
      return <group key={i} position={[x, 0.31, z]}>
        <Cy rt={0.009} h={0.1} p={[0, 0.05, 0]} c={i % 3 ? "#5aa0e8" : "#f2c230"} ro={0.5} />
        {on > 0.02 && <Sp rad={0.014 * on} p={[0, 0.115, 0]} sc={[1, 1.9 * fl, 1]} c="#ffcf6a" e="#ff9a2a" ei={3} ns />}
      </group>; })}
    <pointLight position={[0, 0.7, 0.2]} intensity={3.2 * win(u, 0.1, 0.75)} distance={2.2} color="#ffb060" />
  </S3>;
}}</Stage>;

// 6 · las aletas aplastadas: el chorro de la hidrolavadora barre de derecha a izquierda y las aletas de aluminio se doblan planas a su paso, como un mazo de cartas
export const MFinfold: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 34, jx = lerp(0.78, -0.78, win(u, 0.14, 0.82)), on = win(u, 0.08, 0.14) * (1 - win(u, 0.84, 0.9));
  return <S3 p={[0.55, 0.85, 1.35]} l={[0, 0.5, 0]} fov={40} floor={null}>
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1} tint="#a0a0a0" />
    <Wall w={6} c="#b0a898" z={-0.5} name="t_ladrillo.jpg" />
    <group><Bx s={[1.7, 0.06, 0.16]} p={[0, 0.2, 0]} c="#7a7f86" m={0.6} ro={0.35} /><Bx s={[1.7, 0.06, 0.16]} p={[0, 0.84, 0]} c="#7a7f86" m={0.6} ro={0.35} />
      {[0.34, 0.52, 0.7].map((y) => <Cy key={y} rt={0.012} h={1.68} r={[0, 0, Math.PI / 2]} p={[0, y, -0.02]} c="#c97a3a" m={1} ro={0.25} />)}</group>
    {Array.from({ length: N }, (_, i) => { const x = -0.8 + (i * 1.6) / (N - 1), hit = on > 0.5 ? cl((x - jx) / 0.08) : 0, f = Math.max(hit, x > jx + 0.04 ? cl(win(u, 0.14, 0.82) * 4) : 0) * (x > jx ? 1 : 0);
      return <group key={i} position={[x, 0.23, 0.0]} rotation={[0, 0, -1.25 * f]}>
        <Bx s={[0.008, 0.6, 0.12]} p={[0, 0.3, 0]} c="#d2d6da" m={0.85} ro={0.25} ns />
      </group>; })}
    <group position={[jx + 0.05, 0.55, 0.55]} rotation={[0.3, 0.6, 0]}>
      <Cy rt={0.014} h={0.8} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.4]} c="#c9ccd0" m={1} ro={0.2} />
      <Cy rt={0.03} h={0.1} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.02]} c="#e8b020" ro={0.4} />
      <Bx s={[0.06, 0.16, 0.08]} p={[0, -0.08, 0.7]} c="#1e1e20" ro={0.5} />
    </group>
    {on > 0.02 && Array.from({ length: 14 }, (_, i) => { const g = (tt * 3 + i / 14) % 1; return <Sp key={i} rad={0.01 + 0.02 * g} p={[jx + 0.05 - g * 0.04, 0.55 - g * 0.12, 0.55 - g * 0.5]} c="#e8f4ff" o={0.75 * on * (1 - g * 0.6)} ns />; })}
    {on > 0.02 && <Puff p={[jx, 0.45, 0.06]} s={0.35} c="#eaf4ff" o={0.5 * on} add={false} />}
  </S3>;
}}</Stage>;

// 7 · el gato de hielo: en la bandeja de la base crece una columna de hielo que empuja hacia arriba y dobla los caños de la serpentina
export const MIcejack: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ice = win(u, 0.08, 0.7), push = cl((ice - 0.45) / 0.55), cr = bump(u, 0.62, 40, 10);
  return <S3 zk={1.1} p={[0.2, 0.75, 1.55]} l={[0, 0.48, 0]} fov={40} floor={null} warm="#dfe8ff">
    <PhotoGround w={5} d={4} name="t_concreto.jpg" rep={1} tint="#909090" />
    <Wall w={6} c="#9aa0a8" z={-0.6} />
    <Bx s={[1.3, 0.06, 0.5]} p={[0, 0.03, 0]} c="#3a3d42" m={0.5} ro={0.4} />
    <Bx s={[1.3, 0.12, 0.04]} p={[0, 0.1, 0.25]} c="#4a4e54" m={0.5} ro={0.4} /><Bx s={[1.3, 0.12, 0.04]} p={[0, 0.1, -0.25]} c="#4a4e54" m={0.5} ro={0.4} />
    <Bx s={[0.5, 0.42 * ice + 0.001, 0.4]} p={[0, 0.06 + 0.21 * ice, 0]} c="#cfeaff" e="#9fd4ff" ei={0.25} o={0.72} ro={0.05} m={0.1} />
    {ice > 0.05 && Array.from({ length: 10 }, (_, i) => <Sp key={i} rad={0.025 + 0.02 * rnd(i, 2)} p={[(rnd(i, 1) - 0.5) * 0.45, 0.06 + 0.42 * ice * rnd(i, 3), 0.2]} c="#ffffff" o={0.7} ro={0.1} ns />)}
    {[0.46, 0.58, 0.7].map((y, j) => { const lift = 0.16 * push * (1 - j * 0.25) + cr * 0.01;
      return <group key={y}><Tube pts={[[-0.65, y, 0], [-0.3, y + lift * 0.4, 0], [0, y + lift, 0], [0.3, y + lift * 0.4, 0], [0.65, y, 0]]} rad={0.022} c="#c97a3a" m={1} ro={0.25} />
        {Array.from({ length: 14 }, (_, i) => { const x = -0.62 + i * 0.095, ly = lift * Math.max(0, 1 - Math.abs(x) / 0.65); return <Bx key={i} s={[0.006, 0.1, 0.16]} p={[x, y + ly, 0]} r={[0, 0, x * push * 0.6]} c="#d2d6da" m={0.8} ro={0.3} ns />; })}</group>; })}
    <pointLight position={[0, 0.5, 0.6]} intensity={1.4 * ice} distance={1.6} color="#9fd4ff" />
  </S3>;
}}</Stage>;

// 8 · la lata de bizcochos: al lado del capacitor que se hincha, la lata de masa de bizcochos revienta por la costura en espiral
export const MBiscuit: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sw = win(u, 0.08, 0.55), pop = win(u, 0.55, 0.62), pb = bump(u, 0.55, 30, 7);
  const can = () => canvasTex("bisc11c", 512, 512, (g) => { g.fillStyle = "#1f4fa8"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#f4efe2"; g.lineWidth = 10; for (let i = -4; i < 8; i++) { g.beginPath(); g.moveTo(0, i * 90); g.lineTo(512, i * 90 + 260); g.stroke(); } g.fillStyle = "#f2c230"; g.beginPath(); g.arc(256, 250, 110, 0, 6.29); g.fill(); });
  return <S3 p={[0.1, 0.62, 1.4]} l={[0, 0.3, 0]} fov={40} floor={null}>
    <Table w={4} d={3} /><Wall w={6} c="#d8ccb8" z={-0.7} />
    <group position={[-0.3, 0, 0]}>
      <Cy rt={0.13} h={0.44} p={[0, 0.22, 0]} c="#c9ccd0" m={0.9} ro={0.2} seg={48} />
      <Pl w={0.26} h={0.18} p={[0, 0.24, 0.131]} map={plate("45+5", "#e8e4da", "#1a1a1a", 120, 512, 340)} c="#ffffff" ns />
      <Sp rad={0.13} p={[0, 0.44, 0]} sc={[1, 0.05 + 0.75 * sw, 1]} c="#c9ccd0" m={0.9} ro={0.25} seg={40} />
      {[-0.05, 0.05].map((x) => <Bx key={x} s={[0.03, 0.06, 0.02]} p={[x, 0.46 + 0.1 * sw, 0]} c="#b08a3a" m={1} ro={0.3} />)}
    </group>
    <group position={[0.3, 0, 0]}>
      <Cy rt={0.1} h={0.4} p={[0, 0.2 - 0.04 * pop, 0]} c="#ffffff" ro={0.6} seg={40} />
      <mesh position={[0, 0.2 - 0.04 * pop, 0]}><cylinderGeometry args={[0.101, 0.101, 0.4, 40, 1, true]} /><meshStandardMaterial map={can()} roughness={0.6} /></mesh>
      <Cy rt={0.104} h={0.02} p={[0, 0.41, 0]} c="#c9ccd0" m={1} ro={0.25} />
      {pop > 0 && <group position={[0, 0.26, 0.08]} rotation={[0.6, 0.4, 0]}>
        <Sp rad={0.1} sc={[1.2 * pop, 0.5 + 0.5 * pop, 0.7 * pop]} c="#f0d8a8" ro={0.9} />
        <Sp rad={0.06} p={[0.06, 0.06, 0.04]} sc={[pop, pop, pop]} c="#f3dfb6" ro={0.9} />
      </group>}
      {pb > 0.05 && <Puff p={[0, 0.28, 0.12]} s={0.3} c="#fff6e0" o={0.5 * pb} add={false} />}
    </group>
  </S3>;
}}</Stage>;

// 9 · la bola de nieve: una bolita de $40 rueda por la pendiente nevada y crece hasta ser una roca de $3,000; la etiqueta clavada arriba cuenta el precio
export const MSnowball: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = win(u, 0.06, 0.86), R = lerp(0.06, 0.46, g), x = lerp(-1.4, 0.2, g), price = Math.round(lerp(40, 3000, g * g) / 10) * 10;
  const n = price >= 1000 ? `$${Math.floor(price / 1000)},${String(price % 1000).padStart(3, "0")}` : `$${price}`;
  return <S3 zk={1.15} p={[0.1, 0.9, 2.3]} l={[-0.1, 0.42, 0]} fov={40} floor={null} warm="#e8f0ff">
    <PhotoGround w={8} d={5} name="t_concreto.jpg" rep={1} tint="#f4f6fa" />
    <Env><Bx s={[8, 0.02, 0.06]} p={[0, 0.01, -0.05]} c="#e6ecf4" ro={0.9} /></Env>
    {Array.from({ length: 12 }, (_, i) => { const tx = -1.4 + (i / 12) * (x + 1.4); return i / 12 < g ? <Sp key={i} rad={0.03 + 0.05 * (i / 12)} p={[tx, 0.0, 0.0]} sc={[1.6, 0.25, 1]} c="#d8e2ee" ro={0.9} ns /> : null; })}
    <group position={[x, R, 0]}>
      <group rotation={[0, 0, -(x + 1.4) / Math.max(0.1, R) * 0.5]}><Sp rad={R} seg={36} c="#f6f8fc" ro={0.85} />
        {Array.from({ length: 9 }, (_, i) => <Sp key={i} rad={R * 0.22} p={[Math.cos(i * 2.1) * R * 0.85, Math.sin(i * 2.1) * R * 0.85, (rnd(i) - 0.5) * R]} c="#e6ecf4" ro={0.9} ns />)}</group>
      <group position={[0, R, 0]}><Cy rt={0.008} h={0.18} p={[0, 0.06, 0]} c="#6a4a2e" ro={0.8} />
        <Bx s={[0.34, 0.16, 0.01]} p={[0, 0.2, 0]} c="#f4efe2" ro={0.6} />
        <Pl w={0.32} h={0.14} p={[0, 0.2, 0.006]} map={plate(n, "#f4efe2", price > 1000 ? "#c4261c" : "#1a1a1a", 110, 512, 220)} c="#ffffff" ns /></group>
    </group>
  </S3>;
}}</Stage>;

// 10 · el techo de la cocina: la mancha de agua crece en el cielorraso, la panza de yeso se hincha y revienta; el chorro cae en la olla de la mesada
const stainTex = (k: number) => canvasTex(`stain11c|${Math.round(k * 20)}`, 512, 512, (g) => { g.fillStyle = "#efe9dc"; g.fillRect(0, 0, 512, 512);
  for (let r = 4; r > 0; r--) { g.fillStyle = `rgba(150,110,60,${0.12 + 0.05 * (4 - r)})`; g.beginPath(); g.ellipse(256, 256, 220 * k * r / 4 + 4, 190 * k * r / 4 + 4, 0.3, 0, 6.29); g.fill(); } });
export const MCeilingburst: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), st = win(u, 0.04, 0.4), bl = win(u, 0.3, 0.56), br = win(u, 0.56, 0.6), pour = win(u, 0.58, 0.66), fill = win(u, 0.62, 1);
  return <S3 p={[0.55, 1.15, 2.3]} l={[0, 1.25, 0]} fov={46} floor={null} warm="#ffe6c8">
    <PhotoGround w={6} d={4} name="t_madera.jpg" rep={1.2} tint="#a08070" />
    <Wall w={6} c="#d8ccb8" z={-0.7} hh={2.4} />
    {[-0.9, -0.3, 0.3, 0.9].map((x) => <Bx key={x} s={[0.56, 0.6, 0.32]} p={[x, 1.6, -0.52]} c="#7a5a3c" ro={0.55} rad={0.01} />)}
    <group><Bx s={[2.4, 0.08, 1.6]} p={[0, 2.1, 0]} c="#efe9dc" ro={0.9} />
      <Pl w={1.2} h={1.2} p={[0, 2.058, 0]} r={[Math.PI / 2, 0, 0]} map={stainTex(st)} c="#ffffff" ro={0.95} ns />
      {br < 1 && <Sp rad={0.42} p={[0, 2.06, 0]} sc={[1, 0.02 + 0.75 * bl, 1]} c={mixc("#e6dcc6", "#a89070", bl)} ro={0.85} seg={40} />}
      {br > 0 && br < 1 && Array.from({ length: 10 }, (_, i) => <Bx key={i} s={[0.07, 0.02, 0.06]} p={[(rnd(i, 7) - 0.5) * 0.5, 2.0 - br * (0.5 + rnd(i, 8)), (rnd(i, 9) - 0.5) * 0.4]} r={[rnd(i) * 3, rnd(i, 2) * 3, 0]} c="#e2d8c4" ro={0.9} />)}
      {br > 0 && <mesh position={[0, 2.055, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.2, 24]} /><meshStandardMaterial color="#2a2420" side={2} /></mesh>}</group>
    <group><Bx s={[1.6, 0.86, 0.6]} p={[0, 0.43, -0.2]} c="#e8e2d6" ro={0.6} /><Bx s={[1.66, 0.04, 0.66]} p={[0, 0.88, -0.2]} c="#3a3634" ro={0.3} m={0.2} /></group>
    <group position={[0, 0.9, 0]}><Cy rt={0.17} rb={0.15} h={0.2} p={[0, 0.1, 0]} c="#b0b4b8" m={0.9} ro={0.25} open />
      <Cy rt={0.165} h={0.01} p={[0, 0.02 + 0.16 * fill, 0]} c="#8ab8d8" o={0.8} ro={0.05} /></group>
    {pour > 0 && <Cy rt={0.06} rb={0.075} h={1.14} p={[0, 1.5, 0]} c="#bfe0f4" e="#9fd4ff" ei={0.35} o={0.85 * pour} ro={0.05} />}
    {pour > 0 && Array.from({ length: 30 }, (_, i) => { const g = (tt * 1.6 + i / 30) % 1; return <Sp key={i} rad={0.024} p={[(rnd(i) - 0.5) * 0.16, 2.04 - g * 1.0, (rnd(i, 2) - 0.5) * 0.07]} c="#cfeaff" o={0.8} ns />; })}
    {pour > 0 && <><Puff p={[0, 1.12, 0.02]} s={0.55} c="#eaf6ff" o={0.6 * pour} add={false} />{Array.from({ length: 12 }, (_, i) => { const a = i / 12 * 6.28, g = (tt * 2 + rnd(i, 3)) % 1; return <Sp key={"s" + i} rad={0.02} p={[Math.cos(a) * (0.18 + 0.2 * g), 1.12 + 0.18 * Math.sin(g * 3.14), Math.sin(a) * (0.18 + 0.2 * g)]} c="#d8f0ff" o={0.8 * pour * (1 - g)} ns />; })}</>}
  </S3>;
}}</Stage>;

// 11 · los acebos: lapso de cinco años; plantaron los acebos lejos y año a año crecen hasta tocar la unidad; el cartelito clavado cuenta el año
export const MHollies: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), g = win(u, 0.08, 0.84), yr = Math.min(5, 1 + Math.floor(g * 5)), touch = win(u, 0.78, 0.86);
  const Bush: React.FC<{ x: number; s: number }> = ({ x, s }) => <group position={[x, 0, 0.05]} scale={s}>
    {Array.from({ length: 11 }, (_, i) => <Sp key={i} rad={0.18 + 0.06 * rnd(i, 2)} p={[(rnd(i, 1) - 0.5) * 0.38, 0.17 + rnd(i, 3) * 0.3, (rnd(i, 4) - 0.5) * 0.3]} c={i % 3 ? "#1f4a2a" : "#2c5e34"} ro={0.7} seg={14} />)}
    {Array.from({ length: 9 }, (_, i) => <Sp key={i} rad={0.025} p={[(rnd(i, 5) - 0.5) * 0.42, 0.22 + rnd(i, 6) * 0.3, 0.2]} c="#c4261c" ro={0.3} ns />)}
  </group>;
  return <S3 p={[0, 0.85, 2.1]} l={[0, 0.4, 0]} fov={40} floor={null}>
    <FrostGround w={7} d={5} /><Wall w={8} c="#c8b8a4" z={-0.7} name="t_ladrillo.jpg" />
    <HPU s={1.05} fan={tt * 12 * (1 - 0.7 * touch)} />
    <Bush x={lerp(-0.95, -0.62, g)} s={lerp(0.25, 1.25, g)} />
    <Bush x={lerp(0.95, 0.62, g)} s={lerp(0.25, 1.25, g)} />
    <group position={[-0.9, 0, 0.55]}><Cy rt={0.012} h={0.3} p={[0, 0.15, 0]} c="#6a4a2e" ro={0.8} />
      <Bx s={[0.3, 0.17, 0.012]} p={[0, 0.36, 0]} c="#f4efe2" ro={0.6} /><Pl w={0.28} h={0.15} p={[0, 0.36, 0.007]} map={plate(`YEAR ${yr}`, "#f4efe2", "#1f4a2a", 92, 512, 270)} c="#ffffff" ns /></group>
  </S3>;
}}</Stage>;

// 12 · el tablero que avisa: en un tablero de auto se prenden de a una tres luces ámbar (escarcha, ruido, ciclos cortos) y al final la roja grande titila
const icon = (kind: number, col: string) => canvasTex(`ic11c|${kind}|${col}`, 256, 256, (g) => { g.fillStyle = "#0c0d10"; g.fillRect(0, 0, 256, 256); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 16; g.lineCap = "round";
  if (kind === 0) for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; g.beginPath(); g.moveTo(128 - Math.cos(a) * 90, 128 - Math.sin(a) * 90); g.lineTo(128 + Math.cos(a) * 90, 128 + Math.sin(a) * 90); g.stroke(); }
  if (kind === 1) { g.fillRect(50, 98, 40, 60); g.beginPath(); g.moveTo(90, 98); g.lineTo(130, 60); g.lineTo(130, 196); g.lineTo(90, 158); g.fill(); [40, 70].forEach((r) => { g.beginPath(); g.arc(140, 128, r, -0.7, 0.7); g.stroke(); }); }
  if (kind === 2) { g.beginPath(); g.arc(128, 128, 78, 0.4, 5.6); g.stroke(); g.beginPath(); g.moveTo(206, 80); g.lineTo(206, 140); g.lineTo(150, 120); g.fill(); }
  if (kind === 3) { g.beginPath(); g.moveTo(128, 26); g.lineTo(236, 222); g.lineTo(20, 222); g.closePath(); g.fill(); g.fillStyle = "#0c0d10"; g.fillRect(116, 90, 24, 80); g.fillRect(116, 184, 24, 22); } });
export const MDashwarn: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), on = (i: number) => win(u, 0.1 + i * 0.16, 0.13 + i * 0.16), red = win(u, 0.62, 0.66) * (0.75 + 0.25 * Math.sign(Math.sin(tt * 14)));
  return <S3 zk={1.15} p={[0, 0.55, 1.25]} l={[0, 0.48, 0]} fov={40} floor={null} exp={0.9}>
    <Bx s={[2.2, 0.9, 0.3]} p={[0, 0.45, -0.18]} c="#1a1b1e" ro={0.5} rad={0.08} />
    <Cy rt={0.34} h={0.06} r={[Math.PI / 2, 0, 0]} p={[-0.62, 0.5, -0.02]} c="#2a2c30" m={0.5} ro={0.3} seg={64} />
    <Cy rt={0.34} h={0.06} r={[Math.PI / 2, 0, 0]} p={[0.62, 0.5, -0.02]} c="#2a2c30" m={0.5} ro={0.3} seg={64} />
    {[-0.62, 0.62].map((x, j) => <group key={x} position={[x, 0.5, 0.015]} rotation={[0, 0, 1.2 - (j ? 0.4 * red : 0.9 * win(u, 0.1, 0.6))]}><Bx s={[0.012, 0.26, 0.01]} p={[0, 0.12, 0]} c="#ff5a2a" e="#ff5a2a" ei={1} /></group>)}
    {[0, 1, 2].map((i) => <group key={i} position={[-0.2 + i * 0.2, 0.72, 0.0]}>
      <Pl w={0.15} h={0.15} map={icon(i, on(i) > 0.5 ? "#ffb020" : "#2a2418")} c="#ffffff" e={on(i) > 0.5 ? "#ffb020" : undefined} ei={0.6 * on(i)} ns />
      {on(i) > 0.5 && <pointLight position={[0, 0, 0.15]} intensity={0.5} distance={0.6} color="#ffb020" />}
    </group>)}
    <group position={[0, 0.36, 0.0]}><Pl w={0.3} h={0.3} map={icon(3, red > 0.5 ? "#ff2a1a" : "#2a1414")} c="#ffffff" e={red > 0.5 ? "#ff2a1a" : undefined} ei={0.8 * red} ns />
      <pointLight position={[0, 0, 0.3]} intensity={2 * red} distance={1.4} color="#ff2a1a" /></group>
  </S3>;
}}</Stage>;

// 13 · la fila de hormigas: una fila de hormigas cruza la losa, entra por la ranura de la caja de control y el contactor hace clac con una chispa
export const MAntmarch: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), clk = win(u, 0.7, 0.73), sp = bump(u, 0.7, 50, 12);
  const path = (s: number): V3 => [lerp(-0.7, 0.0, s), 0.004, 0.12 + 0.05 * Math.sin(s * 9)];
  return <S3 p={[0.15, 0.48, 0.95]} l={[-0.05, 0.16, 0]} fov={40} floor={null}>
    <PhotoGround w={4} d={3} name="t_concreto.jpg" rep={1.4} tint="#b0aca4" />
    <Wall w={5} c="#9aa0a8" z={-0.3} />
    <group position={[0.12, 0.0, -0.05]}>
      <Bx s={[0.44, 0.42, 0.26]} p={[0, 0.24, 0]} c="#c9ccd0" m={0.4} ro={0.4} rad={0.01} />
      <Bx s={[0.08, 0.02, 0.03]} p={[-0.12, 0.04, 0.13]} c="#1a1a1a" ns />
      <group position={[0, 0.26, 0.135]}>
        <Bx s={[0.26, 0.22, 0.02]} c="#2a2c30" ro={0.5} />
        <Bx s={[0.18, 0.05, 0.03]} p={[0, 0.03 - 0.03 * clk, 0.02]} c="#3a3d42" ro={0.5} />
        {[-0.07, 0.07].map((x) => <group key={x}><Bx s={[0.03, 0.02, 0.02]} p={[x, 0.07, 0.025]} c="#c97a3a" m={1} ro={0.25} /><Bx s={[0.03, 0.02, 0.02]} p={[x, -0.0 + 0.04 * (1 - clk), 0.025]} c="#c97a3a" m={1} ro={0.25} /></group>)}
      </group>
      {sp > 0.05 && <><Sp rad={0.03} p={[0, 0.32, 0.17]} c="#ffffff" e="#9fd4ff" ei={4} ns /><pointLight position={[0, 0.32, 0.25]} intensity={3 * sp} distance={0.8} color="#9fd4ff" /></>}
    </group>
    {Array.from({ length: 22 }, (_, i) => { const s = ((tt * 0.09 + i / 22) % 1) * win(u, 0, 0.1) * 1.0 + 0; const p = path(s); return s < 0.97 ? <Ant key={i} p={p} a={-Math.PI / 2 + Math.cos(s * 9) * 0.4} ph={tt + i} s={1.6} /> : null; })}
  </S3>;
}}</Stage>;
