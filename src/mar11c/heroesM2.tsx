// mar11c · componentes únicos 14-25 + la CTA del manual. Misma regla: UN objeto grande al centro con margen, una acción
// física a mitad de camino en el cuadro del medio, números impresos EN el objeto. Registro: D:/rtmp/mar11_COMPONENTES.md
import React from "react";
import { BOLD, Bx, Cy, Env, Pl, Puff, Sp, To, Tube, V3, canvasTex, cl, drop, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { ManualCTA } from "./book3d";
import { FrostGround, HPU, Leaf, LEAFC, U, bump, mixc } from "./props11";
import { PhotoGround, PhotoPl } from "./tex11";
import { Ant, S3, Table, Wall, plate } from "./heroesM1";

// 14 · la línea de cebo: alrededor de la unidad, a dos pies, un anillo de gránulos; las hormigas llegan, tocan la línea y se dan vuelta
export const MBaitline: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), ring = win(u, 0.06, 0.34), R = 0.62;
  return <S3 p={[0, 1.55, 1.55]} l={[0, 0.1, 0.05]} fov={42} floor={null}>
    <PhotoGround w={5} d={4} name="t_tierra.jpg" rep={1.1} tint="#9a8a78" />
    <HPU s={0.7} fan={tt * 12} />
    {Array.from({ length: 160 }, (_, i) => { const a = (i / 160) * Math.PI * 2, f = cl(ring * 1.15 - (i / 160) * 0.15) ; if (f <= 0) return null;
      const rr = R + (rnd(i, 1) - 0.5) * 0.05; return <Sp key={i} rad={0.011} p={[Math.cos(a) * rr, 0.008 + (1 - f) * 0.3, Math.sin(a) * rr]} c={i % 2 ? "#e8d8a8" : "#d8c088"} ro={0.8} ns />; })}
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2 + 0.2, ph = ((tt * 0.12 + rnd(i, 3)) % 1), go = ph < 0.5 ? ph * 2 : (1 - ph) * 2, r = lerp(1.25, R + 0.07, go);
      const yaw = ph < 0.5 ? -a + Math.PI / 2 : -a - Math.PI / 2;
      return u > 0.3 ? <Ant key={i} p={[Math.cos(a) * r, 0, Math.sin(a) * r]} a={yaw} ph={tt + i} s={2.2} /> : null; })}
  </S3>;
}}</Stage>;

// 15 · las dos balanzas de resorte: del gancho de una cuelga la caja del arreglo de $200-350 y el resorte se estira hasta abajo; de la otra, el kit de $30 y casi no se mueve
const scaleFace = () => canvasTex("sface11c", 256, 256, (g) => { g.fillStyle = "#f4efe2"; g.beginPath(); g.arc(128, 128, 124, 0, 6.29); g.fill(); g.strokeStyle = "#1a1a1a"; g.lineWidth = 6;
  for (let i = 0; i <= 10; i++) { const a = -2.4 + i * 0.48; g.beginPath(); g.moveTo(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); g.lineTo(128 + Math.sin(a) * (i % 5 ? 86 : 72), 128 - Math.cos(a) * (i % 5 ? 86 : 72)); g.stroke(); } });
const Spring: React.FC<{ y0: number; y1: number }> = ({ y0, y1 }) => { const pts: V3[] = Array.from({ length: 80 }, (_, i) => { const a = i * 0.55; return [Math.sin(a) * 0.035, lerp(y0, y1, i / 79), Math.cos(a) * 0.035]; }); return <Tube pts={pts} rad={0.005} c="#c9ccd0" m={1} ro={0.25} seg={200} />; };
export const MSpringscale: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hang1 = win(u, 0.12, 0.3), hang2 = win(u, 0.42, 0.58), st1 = 0.42 * hang1 + bump(u, 0.3, 22, 6) * 0.03, st2 = 0.04 * hang2 + bump(u, 0.58, 30, 8) * 0.01;
  const Sc: React.FC<{ x: number; st: number; tag: string; big: boolean; k: number }> = ({ x, st, tag, big, k }) => <group position={[x, 0, 0]}>
    <Cy rt={0.012} h={0.12} p={[0, 1.66, 0]} c="#8a8e94" m={1} ro={0.3} />
    <Cy rt={0.09} h={0.05} r={[Math.PI / 2, 0, 0]} p={[0, 1.5, 0]} c="#b08a3a" m={1} ro={0.25} seg={40} />
    <mesh position={[0, 1.5, 0.027]}><circleGeometry args={[0.08, 40]} /><meshStandardMaterial map={scaleFace()} roughness={0.5} /></mesh>
    <group position={[0, 1.5, 0.032]} rotation={[0, 0, 2.4 - st * 10]}><Bx s={[0.006, 0.07, 0.004]} p={[0, 0.03, 0]} c="#c4261c" /></group>
    <Spring y0={1.44} y1={1.2 - st} />
    <Tube pts={[[0, 1.2 - st, 0], [0, 1.15 - st, 0.03], [0, 1.12 - st, 0], [0, 1.15 - st, -0.02]]} rad={0.006} c="#8a8e94" m={1} ro={0.3} />
    {k > 0 && <group position={[0, (1.1 - st) + (1 - k) * 0.6, 0]}>
      <Cy rt={0.004} h={0.08} p={[0, -0.04, 0]} c="#3a3a3a" />
      <Bx s={big ? [0.5, 0.36, 0.3] : [0.24, 0.14, 0.16]} p={[0, big ? -0.26 : -0.15, 0]} c={big ? "#a87a48" : "#c9b088"} ro={0.8} rad={0.01} />
      <Pl w={big ? 0.46 : 0.22} h={big ? 0.18 : 0.09} p={[0, big ? -0.26 : -0.15, big ? 0.152 : 0.082]} map={plate(tag, "#f4efe2", big ? "#c4261c" : "#1f6b3a", big ? 128 : 160, 768, 300)} c="#ffffff" ns />
    </group>}
  </group>;
  return <S3 zk={1.18} p={[0, 1.15, 2.0]} l={[0, 1.1, 0]} fov={40} floor={null}>
    <Wall w={6} c="#d8ccb8" z={-0.4} />
    <Bx s={[1.8, 0.06, 0.12]} p={[0, 1.74, -0.05]} c="#6a4426" ro={0.6} />
    <Sc x={-0.42} st={st1} tag="$200-350" big k={hang1} />
    <Sc x={0.42} st={st2} tag="$30" big={false} k={hang2} />
  </S3>;
}}</Stage>;

// 17 · el tocadiscos: el disco gira, la púa corre y en «grind» salta del surco con un chispazo; el brazo tiembla y raya
const vinyl = () => canvasTex("vinyl11c", 512, 512, (g) => { g.fillStyle = "#0c0c0e"; g.beginPath(); g.arc(256, 256, 255, 0, 6.29); g.fill(); g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 2; for (let r = 90; r < 250; r += 5) { g.beginPath(); g.arc(256, 256, r, 0, 6.29); g.stroke(); }
  g.fillStyle = "#c4261c"; g.beginPath(); g.arc(256, 256, 84, 0, 6.29); g.fill(); g.fillStyle = "#f4efe2"; g.font = BOLD(40); g.textAlign = "center"; g.fillText("HVAC", 256, 246); g.font = BOLD(26); g.fillText("SIDE A", 256, 286); g.fillStyle = "#0c0c0e"; g.beginPath(); g.arc(256, 256, 8, 0, 6.29); g.fill(); });
export const MTurntable: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sk = win(u, 0.5, 0.53), jit = u > 0.5 ? (rnd(Math.floor(tt * 30)) - 0.5) * 0.08 * (1 - win(u, 0.7, 0.9)) : 0, sp = bump(u, 0.5, 45, 10);
  const arm = lerp(-0.35, -0.05, win(u, 0.04, 0.48)) + sk * 0.12 + jit;
  return <S3 p={[0.35, 0.95, 1.3]} l={[0, 0.2, 0]} fov={40} floor={null} warm="#ffe2c0">
    <Table w={4} d={3} /><Wall w={6} c="#c8b8a4" z={-0.8} />
    <Bx s={[1.2, 0.1, 0.9]} p={[0, 0.05, 0]} c="#5a3a22" ro={0.5} rad={0.02} />
    <Cy rt={0.38} h={0.03} p={[-0.12, 0.115, 0]} c="#2a2c30" m={0.6} ro={0.3} seg={64} />
    <group position={[-0.12, 0.135, 0]} rotation={[0, -tt * 3.5, 0]}><mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.36, 64]} /><meshStandardMaterial map={vinyl()} roughness={0.35} metalness={0.2} /></mesh></group>
    <group position={[0.42, 0.14, -0.3]} rotation={[0, arm, 0]}>
      <Cy rt={0.04} h={0.06} c="#c9ccd0" m={1} ro={0.2} />
      <group rotation={[sk * -0.18, 0, 0]}><Tube pts={[[0, 0.05, 0], [-0.05, 0.05, 0.2], [-0.2, 0.04, 0.42], [-0.22, 0.03, 0.46]]} rad={0.009} c="#c9ccd0" m={1} ro={0.2} />
        <Bx s={[0.05, 0.025, 0.07]} p={[-0.22, 0.02, 0.48]} c="#1a1a1a" ro={0.4} /></group>
    </group>
    {sp > 0.05 && <><Sp rad={0.03} p={[0.12, 0.17, 0.2]} c="#ffffff" e="#ffd08a" ei={4} ns /><pointLight position={[0.12, 0.25, 0.25]} intensity={2.5 * sp} distance={0.8} color="#ffb060" /></>}
  </S3>;
}}</Stage>;

// 18 · la caja de libretitas: una caja llena de libretitas de espiral con elástico; una se levanta sola, el elástico salta y la libreta se abre
export const MRubberband: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), up = win(u, 0.14, 0.4), snap = win(u, 0.46, 0.5), fly = win(u, 0.48, 0.7), op = win(u, 0.55, 0.78);
  const C = ["#c4261c", "#2f6fd9", "#2f8a3a", "#e8b020", "#6a3a8a", "#d97a3a", "#1f4a6a", "#8a5a30"];
  return <S3 p={[0.1, 1.0, 1.5]} l={[0, 0.42, 0]} fov={40} floor={null}>
    <Table w={4} d={3} /><Wall w={6} c="#d8ccb8" z={-0.8} />
    <group><Bx s={[0.9, 0.3, 0.4]} p={[0, 0.15, 0]} c="#b08a5a" ro={0.9} rad={0.005} /><Pl w={0.5} h={0.14} p={[0, 0.16, 0.202]} map={plate("1994-2025", "#b08a5a", "#2a1a0e", 110, 768, 220)} c="#ffffff" ns /></group>
    {C.map((c, i) => { const me = i === 3, x = -0.36 + i * 0.103, y = 0.36 + (me ? up * 0.42 : 0);
      return <group key={i} position={[x, y, 0]} rotation={[0, 0, me ? -0.15 * up : 0]}>
        <group rotation={[0, me ? -op * 1.2 : 0, 0]}><Bx s={[0.09, 0.32, 0.24]} c={c} ro={0.7} rad={0.008} /></group>
        {me && op > 0 && <Bx s={[0.006, 0.3, 0.22]} p={[0.05 + op * 0.06, 0, -op * 0.05]} r={[0, op * 0.9, 0]} c="#f4efe2" ro={0.8} ns />}
        <Tube pts={Array.from({ length: 12 }, (_, j) => [-0.048, -0.14 + j * 0.026, -0.12] as V3)} rad={0.006} c="#c9ccd0" m={1} ro={0.2} />
        {!(me && snap > 0.5) && <To R={0.135} t={0.006} r={[0, Math.PI / 2, 0]} sc={[1, 1.2, 0.36]} c="#d9a03a" ro={0.6} />}
      </group>; })}
    {snap > 0.5 && fly < 1 && <group position={[-0.05 + fly * 0.7, 0.8 + fly * 0.5, fly * 0.3]} rotation={[fly * 6, fly * 4, 0]}><To R={0.09} t={0.006} c="#d9a03a" ro={0.6} /></group>}
  </S3>;
}}</Stage>;

// 19 · la barra en tercios: una barra de oro con el precio del sistema nuevo se parte en tres; el tercio de la punta, el arreglo, cae con peso
export const MThirdsbar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cr = win(u, 0.3, 0.36), f = drop(u, 0.38, 0.6), b = bump(u, 0.6, 30, 8);
  const seg = (i: number, n: string, fc: string) => <group position={[-0.62 + i * 0.62 + (i === 2 ? f * 0.25 : 0), 0.13 + (i === 2 ? f * -0.0 + b * 0.01 : 0), i === 2 ? f * 0.25 : 0]} rotation={[0, i === 2 ? f * 0.5 : 0, i === 2 ? -0.0 : 0]}>
    <Bx s={[0.6 - cr * 0.02, 0.24, 0.36]} c="#d9a72a" m={1} ro={0.22} rad={0.02} />
    <Pl w={0.5} h={0.18} p={[0, 0, 0.181]} map={plate(n, "#d9a72a", fc, 120, 768, 280)} c="#ffffff" m={0.4} ro={0.4} ns />
  </group>;
  return <S3 p={[0.15, 0.85, 2.0]} l={[0, 0.2, 0]} fov={40} floor={null} warm="#ffe2c0">
    <Table w={5} d={3} /><Wall w={7} c="#2a2c30" z={-0.9} />
    {seg(0, "$9,400", "#3a2a0a")}{seg(1, "", "#3a2a0a")}{seg(2, "$3,000+", "#8a1a10")}
    {cr > 0.02 && [-0.31, 0.31].map((x) => <Puff key={x} p={[x, 0.2, 0.2]} s={0.25} c="#ffe8a8" o={0.6 * Math.sin(cr * Math.PI)} />)}
    <pointLight position={[0, 1.0, 0.8]} intensity={1.8} distance={3} color="#ffe2a8" />
  </S3>;
}}</Stage>;

// 20 · la última lata: el estante de latas verdes de R-22 se vacía de a una (cada lata sube y se va) hasta que queda una sola con su precio colgado
export const MLastcan: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), N = 9, last = 4, tag = win(u, 0.7, 0.8), tb = bump(u, 0.8, 26, 6);
  const lab = () => plate("R-22", "#2f8a6a", "#f4efe2", 150, 512, 256);
  return <S3 p={[0, 1.0, 2.1]} l={[0, 0.78, 0]} fov={40} floor={null}>
    <Wall w={6} c="#9a948a" z={-0.4} name="t_chapa.jpg" />
    {[0.42, 1.1].map((y) => <Bx key={y} s={[2.2, 0.04, 0.4]} p={[0, y, -0.12]} c="#7a7f86" m={0.6} ro={0.4} />)}
    {Array.from({ length: N }, (_, i) => { if (i === last) return null; const o = 0.12 + ((i < last ? i : i - 1) * 0.07), g = win(u, o, o + 0.1); if (g >= 1) return null;
      return <group key={i} position={[-0.92 + i * 0.23, 0.44 + g * 1.4, -0.12]}><Cy rt={0.085} h={0.26} p={[0, 0.13, 0]} c="#2f8a6a" m={0.5} ro={0.35} seg={32} /><Cy rt={0.05} h={0.04} p={[0, 0.28, 0]} c="#c9ccd0" m={1} ro={0.25} /></group>; })}
    <group position={[-0.92 + last * 0.23, 0.44, -0.12]} scale={1.25}>
      <Cy rt={0.085} h={0.26} p={[0, 0.13, 0]} c="#2f8a6a" m={0.5} ro={0.35} seg={32} />
      <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.0855, 0.0855, 0.12, 32, 1, true, -0.8, 1.6]} /><meshStandardMaterial map={lab()} roughness={0.5} /></mesh>
      <Cy rt={0.05} h={0.04} p={[0, 0.28, 0]} c="#c9ccd0" m={1} ro={0.25} />
      {tag > 0 && <group position={[0.12, 0.3 - (1 - tag) * 0.3, 0.06]} rotation={[0, 0, 0.2 + tb * 0.3]}>
        <Tube pts={[[-0.08, 0.0, 0], [-0.03, 0.02, 0], [0, -0.03, 0]]} rad={0.003} c="#f4efe2" />
        <Bx s={[0.2, 0.11, 0.006]} p={[0.06, -0.09, 0]} c="#f4efe2" ro={0.6} /><Pl w={0.19} h={0.1} p={[0.06, -0.09, 0.004]} map={plate("$$$$", "#f4efe2", "#c4261c", 150, 512, 270)} c="#ffffff" ns />
      </group>}
    </group>
  </S3>;
}}</Stage>;

// 21 · sin vacaciones: al lado de la unidad hay una reposera de playa con sombrilla; un tirón se la lleva fuera de cuadro y empieza a nevar
export const MNobeach: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), yk = win(u, 0.36, 0.5), sn = win(u, 0.5, 0.75), x = lerp(0.62, -2.6, yk * yk);
  return <S3 p={[0.1, 0.85, 2.05]} l={[0, 0.4, 0]} fov={40} floor={null} warm={mixc("#ffe0b0", "#dfe8ff", sn)}>
    <PhotoGround w={6} d={4} name="t_pasto.jpg" rep={1} tint={mixc("#c8c8a8", "#f0f4f8", sn)} />
    <Wall w={7} c="#c8b8a4" z={-0.8} name="t_ladrillo.jpg" />
    <HPU p={[-0.28, 0, 0]} s={1.0} fan={tt * 12} frost={sn * 0.6} />
    <group position={[x, 0, 0.15]} rotation={[0, -0.4 + yk * 0.6, yk * 0.3]}>
      {[-0.16, 0.16].map((z) => <group key={z}><Tube pts={[[-0.22, 0, z], [0.0, 0.18, z], [0.22, 0.0, z]]} rad={0.01} c="#c9ccd0" m={1} ro={0.25} /><Tube pts={[[0.05, 0.16, z], [-0.15, 0.5, z]]} rad={0.01} c="#c9ccd0" m={1} ro={0.25} /></group>)}
      <Bx s={[0.36, 0.01, 0.32]} p={[0.05, 0.19, 0]} r={[0, 0, -0.12]} c="#2f8ad9" ro={0.8} />
      <Bx s={[0.36, 0.01, 0.32]} p={[-0.06, 0.34, 0]} r={[0, 0, 1.1]} c="#f4efe2" ro={0.8} />
      <Cy rt={0.008} h={1.0} p={[0.3, 0.5, -0.2]} c="#e8e4da" />
      <Cy rt={0.0} rb={0.36} h={0.16} p={[0.3, 1.02, -0.2]} c="#e0402a" ro={0.7} seg={8} />
    </group>
    {yk > 0.1 && yk < 0.9 && <Puff p={[x + 0.4, 0.06, 0.2]} s={0.5} c="#d8c8a8" o={0.4} add={false} />}
    {Array.from({ length: 80 }, (_, i) => { const g = (tt * 0.25 + rnd(i, 1)) % 1; return <Sp key={i} rad={0.008 + 0.008 * rnd(i, 2)} p={[(rnd(i, 3) - 0.5) * 2.6, 1.6 - g * 1.6, (rnd(i, 4) - 0.5) * 1.2]} c="#ffffff" e="#ffffff" ei={0.4} o={sn} ns />; })}
  </S3>;
}}</Stage>;

// 22 · el desarmado: la tapa de la unidad sube, los paneles se abren y del interior salen y se apoyan en fila las hojas apelmazadas, el capacitor hinchado y el compresor quemado
export const MTeardown: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), lid = win(u, 0.06, 0.24), it = (i: number) => win(u, 0.28 + i * 0.16, 0.42 + i * 0.16);
  const out = (i: number, to: V3): V3 => { const k = it(i), up = Math.sin(k * Math.PI) * 0.35; return [lerp(0, to[0], k), lerp(0.4, to[1], k) + up, lerp(0, to[2], k)]; };
  return <S3 p={[0, 1.15, 2.2]} l={[0, 0.35, 0.2]} fov={42} floor={null}>
    <FrostGround w={7} d={5} />
    <group><Bx s={[0.64, 0.04, 0.64]} p={[0, 0.02, 0]} c="#3a3d42" ro={0.6} />
      <Bx s={[0.6, 0.5, 0.02]} p={[0, 0.3, -0.29]} c="#c9ccd0" m={0.4} ro={0.4} />
      {[-1, 1].map((s) => <group key={s} position={[s * 0.3, 0.05, 0.3]} rotation={[0, s * lid * 1.4, 0]}><Bx s={[0.3, 0.5, 0.02]} p={[-s * 0.15, 0.25, 0]} c="#c9ccd0" m={0.4} ro={0.4} /></group>)}
      <group position={[0, 0.62 + lid * 0.55, -0.1 * lid]} rotation={[-lid * 0.5, 0, 0]}><Cy rt={0.3} h={0.04} c="#2a2c30" ro={0.5} /></group></group>
    <group position={out(0, [-0.7, 0, 0.55])}>{Array.from({ length: 14 }, (_, i) => <Leaf key={i} p={[(rnd(i, 1) - 0.5) * 0.3, 0.02 + i * 0.008, (rnd(i, 2) - 0.5) * 0.2]} r={[-Math.PI / 2 + 0.1, 0, rnd(i, 3) * 6]} s={1.8} c={LEAFC[i % 5]} />)}</group>
    <group position={out(1, [0, 0, 0.75])}><Cy rt={0.07} h={0.22} p={[0, 0.11, 0]} c="#c9ccd0" m={0.9} ro={0.25} /><Sp rad={0.07} p={[0, 0.22, 0]} sc={[1, 0.7, 1]} c="#c9ccd0" m={0.9} ro={0.25} /></group>
    <group position={out(2, [0.72, 0, 0.55])}><Cy rt={0.14} h={0.32} p={[0, 0.16, 0]} c="#1a1a1c" m={0.3} ro={0.6} seg={32} /><Sp rad={0.14} p={[0, 0.32, 0]} sc={[1, 0.5, 1]} c="#141416" ro={0.6} />
      <Puff p={[0, 0.5, 0]} s={0.35} c="#6a6a6a" o={0.35 * it(2)} add={false} /></group>
  </S3>;
}}</Stage>;

// 23 · la bolsa en el alambre: de la caja de corte cuelga con alambre una bolsa con cierre y la libreta adentro; el viento la hace hamacar
export const MZiplock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hang = drop(u, 0.12, 0.32), sw = Math.sin(tt * 2.4) * 0.22 * win(u, 0.3, 0.45) * (1 - 0.5 * win(u, 0.75, 1));
  return <S3 zk={1.2} p={[0.2, 1.05, 1.6]} l={[0, 0.9, 0]} fov={40} floor={null}>
    <Wall w={6} c="#b0a898" z={-0.15} name="t_ladrillo.jpg" />
    <group><Bx s={[0.42, 0.56, 0.16]} p={[0, 1.3, -0.02]} c="#9aa0a8" m={0.5} ro={0.4} rad={0.01} />
      <Pl w={0.3} h={0.1} p={[0, 1.45, 0.062]} map={plate("DISCONNECT", "#9aa0a8", "#1a1a1a", 64, 512, 170)} c="#ffffff" ns />
      <Bx s={[0.06, 0.18, 0.06]} p={[0.24, 1.25, 0.02]} c="#c4261c" ro={0.4} /></group>
    <group position={[0, 1.02 + (1 - hang) * 0.8, 0.08]} rotation={[0, 0, sw]}>
      <Tube pts={[[0, 0, 0], [0.01, -0.1, 0.01], [0, -0.2, 0]]} rad={0.004} c="#c9ccd0" m={1} ro={0.2} />
      <group position={[0, -0.42, 0]}>
        <Bx s={[0.3, 0.42, 0.06]} c="#e8f0f8" o={0.35} ro={0.05} m={0.1} ns />
        <Bx s={[0.3, 0.02, 0.07]} p={[0, 0.2, 0]} c="#2f6fd9" ro={0.4} />
        <Bx s={[0.22, 0.3, 0.025]} p={[0, -0.03, 0]} c="#e8b020" ro={0.7} />
        <Pl w={0.18} h={0.1} p={[0, 0.0, 0.014]} map={plate("LOG", "#e8b020", "#1a1a1a", 150, 512, 280)} c="#ffffff" ns />
      </group>
    </group>
  </S3>;
}}</Stage>;

// 24 · el sacapuntas de manivela: la manivela gira rápido, salen virutas en espiral y el lápiz sale con punta: la hora entera en un minuto
export const MSharpener: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), cr = win(u, 0.1, 0.75), ang = cr * Math.PI * 10, pin = win(u, 0.05, 0.15) * (1 - win(u, 0.78, 0.92) * 0.7);
  return <S3 zk={1.15} p={[0.25, 0.75, 1.25]} l={[0, 0.5, 0]} fov={40} floor={null}>
    <Table w={4} d={3} /><Wall w={6} c="#d8ccb8" z={-0.6} />
    <group position={[0, 0.5, 0]}>
      <Bx s={[0.3, 0.3, 0.3]} c="#8a8e94" m={0.7} ro={0.3} rad={0.04} />
      <Cy rt={0.08} h={0.04} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.16]} c="#6a6e74" m={0.8} ro={0.3} />
      <group position={[0.17, 0, 0]} rotation={[ang, 0, 0]}><Cy rt={0.02} h={0.06} r={[0, 0, Math.PI / 2]} p={[0.03, 0, 0]} c="#c9ccd0" m={1} ro={0.2} />
        <Bx s={[0.02, 0.2, 0.03]} p={[0.06, 0.09, 0]} c="#c9ccd0" m={1} ro={0.2} /><Cy rt={0.022} h={0.08} r={[0, 0, Math.PI / 2]} p={[0.1, 0.18, 0]} c="#c4261c" ro={0.5} /></group>
      <Bx s={[0.3, 0.1, 0.2]} p={[0, -0.22, 0.05]} c="#5a5e64" m={0.6} ro={0.3} rad={0.02} />
      <group position={[0, 0, 0.18 + 0.35 * (1 - pin)]}><Cy rt={0.018} h={0.4} seg={6} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.2]} c="#f2c230" ro={0.5} /><Cy rt={0.0} rb={0.018} h={0.05} seg={6} r={[-Math.PI / 2, 0, 0]} p={[0, 0, -0.025]} c="#e0c49a" ro={0.7} /></group>
    </group>
    {cr > 0 && cr < 1 && Array.from({ length: 10 }, (_, i) => { const g = (tt * 1.2 + i / 10) % 1; return <group key={i} position={[(rnd(i) - 0.5) * 0.1, 0.32 - g * 0.3, 0.12 + g * 0.1]} rotation={[g * 6, i, 0]}><To R={0.025} t={0.005} arc={4} c="#e8c890" ro={0.8} /></group>; })}
  </S3>;
}}</Stage>;

// 25 · el museo: la vieja unidad sobre un pedestal bajo un foco, rodeada de postes con cordón de terciopelo; se prende el foco y sube la placa de bronce «29 YEARS»
export const MMuseum: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), sp = win(u, 0.06, 0.16), rope = win(u, 0.2, 0.5), pl = win(u, 0.5, 0.66);
  return <S3 zk={1.3} p={lv([0.3, 1.2, 2.6], [0.15, 1.1, 2.2], u)} l={[0, 0.72, 0]} fov={40} floor={null} exp={0.8} warm="#ffe2c0">
    <PhotoGround w={7} d={5} name="t_concreto.jpg" rep={1.2} tint="#5a5450" /><Wall w={8} c="#3a2a30" z={-1.0} />
    <group><Bx s={[0.9, 0.5, 0.9]} p={[0, 0.25, 0]} c="#e8e4da" ro={0.4} rad={0.01} /><Bx s={[1.0, 0.04, 1.0]} p={[0, 0.52, 0]} c="#d8d4ca" ro={0.4} /></group>
    <HPU p={[0, 0.54, 0]} s={1.0} />
    <group position={[0, 0.3, 0.452]} scale={[1, Math.max(0.01, pl), 1]}><Bx s={[0.5, 0.16, 0.012]} c="#b08a3a" m={1} ro={0.25} /><Pl w={0.46} h={0.13} p={[0, 0, 0.007]} map={plate("29 YEARS", "#b08a3a", "#2a1a0a", 110, 768, 220)} c="#ffffff" m={0.6} ro={0.3} ns /></group>
    {[[-0.85, 0.75], [0.85, 0.75], [-0.85, -0.6], [0.85, -0.6]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><Cy rt={0.1} h={0.03} p={[0, 0.015, 0]} c="#b08a3a" m={1} ro={0.25} /><Cy rt={0.02} h={0.7} p={[0, 0.35, 0]} c="#b08a3a" m={1} ro={0.25} /><Sp rad={0.04} p={[0, 0.72, 0]} c="#b08a3a" m={1} ro={0.25} /></group>)}
    {rope > 0 && <Tube pts={[[-0.85, 0.66, 0.75], [-0.42, 0.66 - 0.18 * rope, 0.75], [0, 0.66 - 0.22 * rope, 0.75], [0.42, 0.66 - 0.18 * rope, 0.75], [0.85, 0.66, 0.75]]} rad={0.022} c="#8a1020" ro={0.9} />}
    <spotLight position={[0, 2.8, 0.6]} angle={0.42} penumbra={0.5} intensity={30 * sp} distance={5} color="#fff2d8" castShadow />
    <Cy rt={0.06} rb={0.62} h={2.2} p={[0, 1.7, 0.25]} c="#fff4dc" o={0.07 * sp} />
  </S3>;
}}</Stage>;

// CTA del manual (dos veces): el libro abre en la página exacta que nombra Marcus
export const MCta: React.FC<{ t: number; h: H }> = ({ t, h }) => <ManualCTA t={t} h={h} page={h.page} under={h.under} />;
