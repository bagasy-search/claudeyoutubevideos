// mar11a · vuelta 4: reemplazos SIMPLES de las piezas que se estancaron en 5 tras 3 vueltas del EVALUADOR (regla: simple y perfecto
// le gana a ambicioso). Un objeto grande al centro, una sola acción que está a mitad de camino en el cuadro del medio, sin texto.
import React from "react";
import { BOLD, Bx, Cy, Env, Pl, Puff, S3, Sp, To, Tube, V3, canvasTex, cl, lerp, lv, rnd, win } from "../kits/r3k/r3k";
import { H, Stage } from "./hkit";
import { BrickWall, FrostGround, HPU, U, bump, cum, mixc } from "./props11";
import { PhotoGround, PhotoWall } from "./tex11";
const plate = (t: string, bg: string, fg: string, px = 150, w = 512, hh = 256) => canvasTex(`pl11a|${t}|${bg}|${fg}|${px}|${w}|${hh}`, w, hh, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, hh); g.fillStyle = fg; g.font = BOLD(px); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, w / 2, hh / 2 + px * 0.04);
});

// 1 · cae la noche helada: el cielo de atardecer se apaga a azul noche, sube una luna grande, la escarcha avanza por el suelo hasta la unidad y de la tapa crecen carámbanos colgados
export const MNightfall: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), n = win(u, 0.0, 0.22), fr = win(u, 0.15, 0.6), ic = win(u, 0.3, 0.8);
  return <S3 p={[0.35, 0.95, 2.4]} l={[0.1, 0.75, 0]} fov={38} floor={null} warm={mixc("#ffb27a", "#7f98d8", n)} exp={1.1 - 0.3 * n}>
    <FrostGround w={9} d={6} />
    <Env>
      <Pl w={18} h={9} p={[0, 3.5, -5]} c={mixc("#e88a52", "#0c1630", n)} e={mixc("#e88a52", "#0c1630", n)} ei={0.7} ro={1} ns />
      <Sp rad={0.32} p={[1.3, 0.9 + 1.1 * n, -4]} c="#f4f1e0" e="#f4f1e0" ei={0.3 + 1.6 * n} ns />
      {Array.from({ length: 30 }, (_, i) => <Sp key={i} rad={0.012} p={[-4 + rnd(i, 1) * 8, 1.4 + rnd(i, 2) * 3, -4.8]} c="#fff" e="#fff" ei={2 * cl((n - 0.5) * 2)} ns />)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><circleGeometry args={[0.2 + 3.2 * (1 - fr), 64, 0, Math.PI * 2]} /><meshStandardMaterial color="#5a4a3a" roughness={1} transparent opacity={0.85 * (1 - fr)} /></mesh>
      <pointLight position={[1.3, 2.5, -1]} intensity={2.2 * n} distance={8} color="#9fb8ff" />
    </Env>
    <group>
      <HPU p={[0, 0, 0]} s={1.2} frost={fr} fan={tt * 6 * (1 - fr)} />
      {Array.from({ length: 13 }, (_, i) => { const L = (0.1 + 0.2 * rnd(i, 3)) * cl((ic - i * 0.035) * 1.8);
        return L > 0.005 ? <mesh key={i} position={[-0.34 + i * 0.057, 0.72 - L / 2, 0.375]} rotation={[Math.PI, 0, 0]} castShadow><coneGeometry args={[0.018, L, 8]} /><meshPhysicalMaterial color="#e4f2ff" roughness={0.05} transmission={0.6} thickness={0.05} emissive="#9fb8ff" emissiveIntensity={0.25 * n} /></mesh> : null; })}
    </group>
  </S3>;
}}</Stage>;

// 2 · los dos tubos de aire: un ventilador sopla bolitas por dos tubos transparentes; el filtro fino las deja pasar, el grueso las atasca y se apilan
const Fan: React.FC<{ p: V3; a: number }> = ({ p, a }) => <group position={p}>
  <Bx s={[0.12, 0.5, 0.5]} c="#e9e7e1" ro={0.5} rad={0.03} />
  <group position={[0.07, 0, 0]} rotation={[a, 0, 0]}>{[0, 1, 2].map((b) => <Bx key={b} s={[0.01, 0.2, 0.07]} p={[0, Math.cos(b * 2.09) * 0.1, Math.sin(b * 2.09) * 0.1]} r={[-b * 2.09, 0.4, 0]} c="#7a7f86" ro={0.4} />)}</group>
</group>;
export const MAirtubes: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), D = h.out - h.at, on = win(u, 0.04, 0.14), a = 22 * D * cum((x) => win(x, 0.04, 0.14), u);
  const T: React.FC<{ y: number; thick: boolean }> = ({ y, thick }) => {
    const fx = 0.1, N = 18;
    return <group position={[0, y, 0]}>
      <Fan p={[-1.35, 0, 0]} a={a} />
      <Cy rt={0.2} h={2.5} r={[0, 0, Math.PI / 2]} p={[0, 0, 0]} c="#dfefff" o={0.14} ro={0.05} m={0.1} open />
      {[-1.25, 1.25].map((x) => <To key={x} R={0.2} t={0.012} r={[0, Math.PI / 2, 0]} p={[x, 0, 0]} c="#b0b4b8" m={1} ro={0.2} />)}
      {thick ? Array.from({ length: 9 }, (_, i) => <Bx key={i} s={[0.24, 0.39, 0.04]} p={[fx, 0, -0.17 + i * 0.042]} r={[0, (i % 2 ? 1 : -1) * 0.5, 0]} c="#f1efe6" ro={0.95} />)
        : <Bx s={[0.03, 0.39, 0.39]} p={[fx, 0, 0]} c="#f6f2e6" o={0.85} ro={0.9} />}
      {Array.from({ length: N }, (_, i) => { const free = -1.2 + ((tt * 1.1 * on + i / N * 2.9) % 2.9);
        const x = thick ? Math.min(free, fx - 0.09 - Math.floor(i / 4) * 0.11) : free, out = Math.max(0, x - 1.25);
        return <Sp key={i} rad={0.055} p={[x, ((i * 37) % 5 - 2) * 0.05 - 1.8 * out * out, ((i * 13) % 5 - 2) * 0.05]} c="#e2582a" ro={0.35} />; })}
    </group>;
  };
  return <S3 p={[0.135, 1.04, 1.912]} l={[0.05, 0.98, 0]} fov={40} floor={null}>
    <PhotoGround w={7} d={5} name="t_concreto.jpg" rep={1} tint="#8a8a8a" /><PhotoWall w={8} h={3.2} z={-0.9} name="t_pared.jpg" tint="#d2c6b4" />
    <T y={1.38} thick={false} />
    <T y={0.62} thick={true} />
    {[0.62, 1.38].map((y) => <Bx key={y} s={[0.06, y - 0.2, 0.06]} p={[-0.9, (y - 0.2) / 2, -0.25]} c="#3a3a3e" m={0.6} ro={0.4} />)}
  </S3>;
}}</Stage>;

// 3 · el aerostático: con la llamita azul de la bomba el globo, medio desinflado, apenas se despega del pasto; ruge el quemador naranja de las resistencias, se infla y trepa de golpe entre las nubes (la cámara lo sigue)
export const MHotair: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), roar = win(u, 0.42, 0.5), y = 0.06 * win(u, 0.05, 0.4) + 1.6 * win(u, 0.5, 0.92), fl = 0.3 + 0.7 * roar;
  const col = mixc("#4aa8ff", "#ff7a1e", roar), inf = 0.72 + 0.28 * win(u, 0.42, 0.56), cy = 0.95 + y * 0.85;
  return <S3 zk={1.25} p={[0.3, cy, 3.1]} l={[0, cy + 0.05, 0]} fov={38} floor={null}>
    <PhotoGround w={10} d={6} name="t_tierra.jpg" rep={1.1} tint="#8a9a7a" />
    <Env>
      <Pl w={20} h={12} p={[0, 4, -6]} c="#8fb0d8" e="#8fb0d8" ei={0.45} ro={1} ns />
      {[[-1.6, 1.4, -2.5, 0.5], [1.5, 2.1, -3, 0.65], [-0.9, 2.9, -2.2, 0.45], [1.1, 3.4, -1.8, 0.4], [-1.8, 3.8, -3, 0.6]].map(([x, yy, z, r], i) =>
        <group key={i} position={[x, yy, z]}>{[0, 1, 2].map((j) => <Sp key={j} rad={r * (0.7 + 0.3 * (j % 2))} p={[(j - 1) * r * 0.9, 0, 0]} sc={[1, 0.55, 0.7]} c="#ffffff" ro={1} ns />)}</group>)}
      <group position={[-1.4, 0, -2.6]}>{[0, 1, 2, 3].map((i) => <Cy key={i} rt={0.06} h={0.9 + 0.3 * (i % 2)} p={[i * 0.35, 0.45, 0]} c="#3a5a2a" ro={1} />)}</group>
    </Env>
    <group position={[0, y, 0]}>
      <group position={[0, 1.05, 0]} scale={[inf, inf * (0.85 + 0.15 * inf), inf]}>
        <Sp rad={0.5} sc={[1, 1.18, 1]} c="#d9443a" ro={0.6} />
        {Array.from({ length: 8 }, (_, i) => <Bx key={i} s={[0.03, 0.98, 0.03]} p={[Math.sin(i * 0.785) * 0.48, 0, Math.cos(i * 0.785) * 0.48]} r={[0, i * 0.785, 0]} c="#f2d64a" ro={0.6} ns />)}
      </group>
      {[-1, 1].map((s) => <Tube key={s} pts={[[s * 0.3, 0.55, 0.1], [s * 0.14, 0.3, 0.1]]} rad={0.006} c="#3a2a1a" />)}
      <Bx s={[0.3, 0.22, 0.3]} p={[0, 0.19, 0]} c="#8a5a30" ro={0.8} />
      <mesh position={[0, 0.42 + 0.06 * fl, 0]} scale={[1, 1 + 0.18 * Math.sin(tt * 14) * roar, 1]}><coneGeometry args={[0.05 + 0.05 * roar, 0.22 * fl, 16]} /><meshStandardMaterial color={col} emissive={col} emissiveIntensity={2.4} transparent opacity={0.92} /></mesh>
      <Puff p={[0, 0.48, 0.05]} s={0.25 + 0.6 * roar} c={col} o={0.5} />
      <pointLight position={[0, 0.7, 0.3]} intensity={0.8 + 5 * roar} distance={2.6} color={col} />
    </group>
  </S3>;
}}</Stage>;

// 4 · las tres campanas de mostrador: tres objetos grandes llegan de a uno al banco (bloque de hielo, ventilador quieto, termostato en EM); delante de cada uno una campana de bronce
// se hunde sola con un «ding» (ondas que se abren) y a ese objeto lo baña una luz roja: son las tres señales para llamar al técnico
const emTex = () => canvasTex("em11a", 512, 300, (g) => { g.fillStyle = "#10161c"; g.fillRect(0, 0, 512, 300); g.fillStyle = "#ff3a2a"; g.font = BOLD(150); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("EM", 256, 150); });
const Bell: React.FC<{ p: V3; k: number; ring: number }> = ({ p, k, ring }) => <group position={p}>
  <Cy rt={0.13} rb={0.14} h={0.03} p={[0, 0.015, 0]} c="#3a2a1c" ro={0.5} />
  <Sp rad={0.11} p={[0, 0.03, 0]} sc={[1, 0.8, 1]} c="#c89a3a" m={1} ro={0.18} />
  <Cy rt={0.008} h={0.07 - 0.04 * k} p={[0, 0.13 - 0.02 * k, 0]} c="#b0b4b8" m={1} ro={0.2} />
  <Sp rad={0.022} p={[0, 0.17 - 0.04 * k, 0]} c="#d8d8d8" m={1} ro={0.2} />
  {[0, 1].map((j) => { const r = cl(ring * 1.3 - j * 0.3); return r > 0 && r < 1 ? <To key={j} R={0.14 + 0.5 * r} t={0.006} p={[0, 0.12, 0]} r={[Math.PI / 2, 0, 0]} c="#ffe6a0" e="#ffe6a0" ei={1.5 * (1 - r)} /> : null; })}
</group>;
export const MCallbell: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  const u = U(tt, h), hit = (i: number) => Math.max(0, bump(u, 0.3 + i * 0.2, 30, 10)), ring = (i: number) => win(u, 0.3 + i * 0.2, 0.42 + i * 0.2), lit = (i: number) => win(u, 0.3 + i * 0.2, 0.36 + i * 0.2);
  const X = [-0.85, 0, 0.85];
  return <S3 zk={1.3} p={[0.0, 0.844, 1.64]} l={[0, 0.42, 0]} fov={40} floor={null} warm="#ffe0b8" exp={0.95}>
    <PhotoGround w={5} d={3} name="t_madera.jpg" rep={1.4} /><PhotoWall w={7} h={3.2} z={-0.7} name="t_pared.jpg" tint="#8a7e6e" />
    <group position={[X[0], 0.25, -0.15]}>
      <mesh castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshPhysicalMaterial color="#d6ecff" roughness={0.1} transmission={0.55} thickness={0.4} /></mesh>
      {Array.from({ length: 6 }, (_, i) => <Bx key={i} s={[0.006, 0.38, 0.34]} p={[-0.17 + i * 0.068, 0, 0]} c="#8a9aa8" o={0.5} m={0.6} ns />)}
    </group>
    <group position={[X[1], 0.34, -0.15]}>
      <Cy rt={0.32} h={0.06} r={[Math.PI / 2, 0, 0]} c="#2a2c30" m={0.5} ro={0.4} />
      {[0, 1, 2].map((b) => <Bx key={b} s={[0.11, 0.28, 0.015]} p={[Math.sin(b * 2.09) * 0.15, Math.cos(b * 2.09) * 0.15, 0.05]} r={[0, 0.4, -b * 2.09]} c="#7a7f86" m={0.4} ro={0.3} />)}
      <Cy rt={0.05} h={0.08} r={[Math.PI / 2, 0, 0]} p={[0, 0, 0.06]} c="#1a1a1a" />
      <Bx s={[0.08, 0.32, 0.08]} p={[0, -0.25, -0.02]} c="#3a3a3e" />
    </group>
    <group position={[X[2], 0.33, -0.15]}>
      <Bx s={[0.46, 0.46, 0.08]} c="#f2f0ea" ro={0.35} rad={0.04} />
      <Pl w={0.38} h={0.22} p={[0, 0.04, 0.042]} map={emTex()} c="#ffffff" e="#ffffff" ei={0.3} ns />
      <Bx s={[0.2, 0.1, 0.2]} p={[0, -0.28, 0]} c="#6a4426" ro={0.6} />
    </group>
    {X.map((x, i) => <React.Fragment key={i}>
      <Bell p={[x, 0, 0.32]} k={hit(i)} ring={ring(i)} />
      <pointLight position={[x, 0.7, 0.5]} intensity={3.2 * lit(i)} distance={1.3} color="#ff3a2a" />
    </React.Fragment>)}
  </S3>;
}}</Stage>;

// 5 · el buzón de campo: un buzón de chapa sobre su poste en la vereda; entra una carta por la boca, la tapa se cierra y la banderita roja sube de golpe con rebote («contame en los comentarios»)
export const MMailflag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="r3">{(tt) => {
  // vuelta 6 (EVALUADOR 4,5 «cubo naranja placeholder»): sin casa de cartón; el buzón de chapa grande, solo, sobre su poste en el pasto con la foto real detrás
  const u = U(tt, h), lt = win(u, 0.1, 0.36), door = win(u, 0.06, 0.14) * (1 - win(u, 0.4, 0.48)), flag = win(u, 0.52, 0.6), fb = bump(u, 0.6, 34, 9);
  const cam = lv([0.95, 1.12, 1.45], [0.75, 1.08, 1.25], u);
  return <S3 p={cam} l={[0, 0.98, 0]} fov={38} floor={null} warm="#ffd9b0">
    <PhotoGround w={6} d={4} name="t_pasto.jpg" rep={1} tint="#c8c8c0" />
    <group><Bx s={[0.1, 0.9, 0.1]} p={[0, 0.45, 0]} c="#6a4a2e" ro={0.85} /><Bx s={[0.16, 0.03, 0.62]} p={[0, 0.9, 0]} c="#5a3e26" ro={0.85} /></group>
    <group position={[0, 1.04, 0]}>
      <Bx s={[0.3, 0.16, 0.6]} p={[0, -0.04, 0]} c="#2f3e4e" m={0.7} ro={0.32} rad={0.005} />
      <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 0.6, 40, 1, false, -Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#2f3e4e" metalness={0.7} roughness={0.32} side={2} /></mesh>
      <mesh position={[0, 0.04, -0.3]} rotation={[0, 0, 0]}><circleGeometry args={[0.15, 40, 0, Math.PI]} /><meshStandardMaterial color="#26323f" metalness={0.7} roughness={0.35} side={2} /></mesh>
      <Pl w={0.2} h={0.05} p={[0.152, -0.02, 0.05]} r={[0, Math.PI / 2, 0]} map={plate("MARCUS", "#2f3e4e", "#f2efe6", 120, 512, 128)} c="#ffffff" ns />
      <group position={[0, -0.12, 0.302]} rotation={[door * 1.45, 0, 0]}>
        <Bx s={[0.3, 0.16, 0.012]} p={[0, 0.08, 0]} c="#26323f" m={0.7} ro={0.32} />
        <mesh position={[0, 0.16, 0]}><circleGeometry args={[0.15, 40, 0, Math.PI]} /><meshStandardMaterial color="#26323f" metalness={0.7} roughness={0.32} side={2} /></mesh>
        <Cy rt={0.018} h={0.03} r={[Math.PI / 2, 0, 0]} p={[0, 0.2, 0.02]} c="#c9ccd0" m={1} ro={0.2} />
      </group>
      {lt < 1 && <group position={[0, -0.02 + (1 - lt) * 0.06, lerp(0.75, 0.02, lt)]} rotation={[0, 0.04, 0]}>
        <Bx s={[0.22, 0.008, 0.3]} c="#f4efe2" ro={0.8} /><Pl w={0.08} h={0.06} p={[0.06, 0.005, -0.09]} r={[-Math.PI / 2, 0, 0]} c="#c4261c" ns />
      </group>}
      <group position={[0.165, -0.02, -0.16]} rotation={[-Math.PI / 2 * (1 - flag) + fb * 0.3, 0, 0]}>
        <Bx s={[0.016, 0.3, 0.03]} p={[0, 0.15, 0]} c="#d42a1e" ro={0.35} /><Bx s={[0.018, 0.1, 0.13]} p={[0, 0.27, -0.05]} c="#d42a1e" ro={0.35} />
      </group>
      <pointLight position={[0.5, 0.4, 0.4]} intensity={1.2 * flag} distance={1.4} color="#ff5a4a" />
    </group>
  </S3>;
}}</Stage>;
